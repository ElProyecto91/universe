import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

// ============================================================
// Semitua — Proxy de Gemini con controles en servidor
// - Valida el JWT (usuario logueado o clave anon = invitado)
// - Limita tamaño de prompt y maxTokens
// - Kill switch, presupuesto diario/mensual y rate limit por usuario
// - Registra el uso en ai_usage (el cliente ya no lo hace)
// ============================================================

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') ?? ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

const MODEL_FLASH = 'gemini-3.6-flash'
const MODEL_LITE = 'gemini-3.1-flash-lite'

// USD por token
const PRECIOS = {
  flash: { input: 0.00000075, output: 0.00000375 },
  lite: { input: 0.00000025, output: 0.0000015 },
}

const ALLOWED_ORIGINS = [
  'https://semitua.com',
  'https://www.semitua.com',
  'https://universe-three-alpha.vercel.app',
]

// Límites duros por petición
const LIMITES = {
  usuario: { prompt: 16000, maxTokens: 3000 },
  invitado: { prompt: 6000, maxTokens: 1000 },
}

// Invitados: límite por IP (en memoria, por instancia; best-effort)
const INVITADOS_POR_HORA = 5
const ipHits = new Map<string, number[]>()

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

function json(body: unknown, status: number, cors: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  })
}

function numero(v: unknown, def: number, min: number, max: number) {
  const n = Number(v)
  if (!Number.isFinite(n)) return def
  return Math.min(max, Math.max(min, n))
}

function ipDe(req: Request) {
  const xff = req.headers.get('x-forwarded-for') ?? ''
  return xff.split(',')[0].trim() || 'desconocida'
}

function invitadoExcedido(ip: string) {
  const ahora = Date.now()
  const hits = (ipHits.get(ip) ?? []).filter((t) => ahora - t < 3600_000)
  if (hits.length >= INVITADOS_POR_HORA) {
    ipHits.set(ip, hits)
    return true
  }
  hits.push(ahora)
  ipHits.set(ip, hits)
  if (ipHits.size > 5000) ipHits.clear()
  return false
}

async function valorVista(vista: string, claves: string[]): Promise<number | null> {
  const { data, error } = await admin.from(vista).select('*').limit(1).maybeSingle()
  if (error) {
    console.error(`[gemini] no se pudo leer ${vista}:`, error.message)
    return null
  }
  for (const c of claves) {
    if (data && data[c] != null) return Number(data[c])
  }
  return 0
}

serve(async (req) => {
  const origin = req.headers.get('origin') ?? ''
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  const cors = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  }

  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'Método no permitido.' }, 405, cors)

  // Origen: rechaza llamadas de navegador desde dominios no permitidos
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return json({ error: 'Origen no permitido.' }, 403, cors)
  }

  if (!GEMINI_API_KEY || !SUPABASE_URL || !SERVICE_KEY) {
    console.error('[gemini] faltan variables de entorno')
    return json({ error: 'Servicio no disponible.' }, 500, cors)
  }

  try {
    // ── 1. Identidad ─────────────────────────────────────────
    const token = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '')
    let userId: string | null = null
    if (token) {
      const { data } = await admin.auth.getUser(token)
      userId = data?.user?.id ?? null
    }
    const esInvitado = !userId
    const lim = esInvitado ? LIMITES.invitado : LIMITES.usuario

    // ── 2. Validación de entrada ─────────────────────────────
    const body = await req.json()
    const prompt = typeof body?.prompt === 'string' ? body.prompt : ''
    if (!prompt) return json({ error: 'prompt requerido' }, 400, cors)
    if (prompt.length > lim.prompt) return json({ error: 'Consulta demasiado larga.' }, 413, cors)

    const usarLite = body?.usarLite === true
    const maxTokens = Math.round(numero(body?.maxTokens, 1500, 1, lim.maxTokens))
    const temperatura = numero(body?.temperatura, 0.8, 0, 1.5)
    const herramienta =
      typeof body?.herramienta === 'string' ? body.herramienta.slice(0, 60) : 'desconocida'
    const modelo = usarLite ? 'lite' : 'flash'

    // ── 3. Kill switch y presupuesto ─────────────────────────
    const { data: cfg } = await admin.from('ai_config').select('*').eq('id', 1).maybeSingle()
    const config = {
      activo: cfg?.activo ?? true,
      presupuesto_diario_usd: Number(cfg?.presupuesto_diario_usd ?? 5),
      presupuesto_mensual_usd: Number(cfg?.presupuesto_mensual_usd ?? 50),
      hora_free: Number(cfg?.limite_calls_hora_free ?? 10),
      dia_free: Number(cfg?.limite_calls_dia_free ?? 30),
      hora_premium: Number(cfg?.limite_calls_hora_premium ?? 50),
      dia_premium: Number(cfg?.limite_calls_dia_premium ?? 200),
    }
    if (!config.activo) {
      return json({ error: 'El servicio de IA está temporalmente pausado.' }, 503, cors)
    }

    // Si la vista falla se registra y se deja pasar (fail-open) para no tumbar la app
    const gastoHoy = await valorVista('ai_gasto_hoy', ['gasto_usd_hoy', 'total_usd', 'total_eur'])
    const gastoMes = await valorVista('ai_gasto_mes', ['gasto_usd_mes', 'total_usd', 'total_eur'])
    if (gastoHoy !== null && gastoHoy >= config.presupuesto_diario_usd) {
      return json({ error: 'Límite diario de IA alcanzado.' }, 429, cors)
    }
    if (gastoMes !== null && gastoMes >= config.presupuesto_mensual_usd) {
      return json({ error: 'Límite mensual de IA alcanzado.' }, 429, cors)
    }

    // ── 4. Rate limit ────────────────────────────────────────
    if (esInvitado) {
      if (invitadoExcedido(ipDe(req))) {
        return json({ error: 'Demasiadas consultas. Inicia sesión para continuar.' }, 429, cors)
      }
    } else {
      const { data: perfil } = await admin
        .from('profiles')
        .select('plan, plan_fin')
        .eq('id', userId)
        .maybeSingle()
      const premium =
        perfil?.plan === 'premium' && perfil?.plan_fin && new Date(perfil.plan_fin) > new Date()
      const limHora = premium ? config.hora_premium : config.hora_free
      const limDia = premium ? config.dia_premium : config.dia_free

      const haceUnaHora = new Date(Date.now() - 3600_000).toISOString()
      const inicioDia = new Date()
      inicioDia.setUTCHours(0, 0, 0, 0)

      const [h, d] = await Promise.all([
        admin.from('ai_usage').select('*', { count: 'exact', head: true })
          .eq('user_id', userId).gte('created_at', haceUnaHora),
        admin.from('ai_usage').select('*', { count: 'exact', head: true })
          .eq('user_id', userId).gte('created_at', inicioDia.toISOString()),
      ])
      if ((h.count ?? 0) >= limHora || (d.count ?? 0) >= limDia) {
        return json({ error: 'Has alcanzado tu límite de consultas.' }, 429, cors)
      }
    }

    // ── 5. Llamada a Gemini ──────────────────────────────────
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${usarLite ? MODEL_LITE : MODEL_FLASH}:generateContent`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: temperatura, maxOutputTokens: maxTokens },
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Gemini error:', response.status, err)
      if (response.status === 429) {
        return json({ error: 'Demasiadas consultas. Inténtalo en unos segundos.' }, 429, cors)
      }
      return json({ error: 'Error al conectar con el servicio de IA.' }, 500, cors)
    }

    const data = await response.json()

    // ── 6. Registro de uso (solo usuarios) ───────────────────
    if (userId) {
      const tin = data.usageMetadata?.promptTokenCount ?? 0
      const tout = data.usageMetadata?.candidatesTokenCount ?? 0
      const coste = tin * PRECIOS[modelo].input + tout * PRECIOS[modelo].output
      const { error: errUso } = await admin.from('ai_usage').insert({
        user_id: userId,
        herramienta: `${herramienta}/${modelo}`,
        tokens_input: tin,
        tokens_output: tout,
        coste_usd: coste,
      })
      if (errUso) console.error('[gemini] no se pudo registrar uso:', errUso.message)
    }

    return json(data, 200, cors)
  } catch (err) {
    console.error('Edge function error:', err)
    return json({ error: 'Error interno.' }, 500, cors)
  }
})
