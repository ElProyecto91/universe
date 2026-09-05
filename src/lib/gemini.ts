// src/lib/gemini.ts
import { supabase } from './supabase'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

// ✅ Modelos activos a septiembre 2026
// gemini-2.0-flash y gemini-2.0-flash-lite fueron apagados el 1 jun 2026
const GEMINI_FLASH_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`
const GEMINI_LITE_URL  = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${GEMINI_API_KEY}`

const COSTE_FLASH_INPUT  = 0.00000150   // $1.50 / 1M tokens
const COSTE_FLASH_OUTPUT = 0.0000090    // $9.00 / 1M tokens
const COSTE_LITE_INPUT   = 0.000000010  // $0.10 / 1M tokens
const COSTE_LITE_OUTPUT  = 0.000000040  // $0.40 / 1M tokens

export interface LlamarGeminiParams {
  herramienta: string
  prompt: string
  userId?: string | null
  esPremium?: boolean
  usarLite?: boolean
  cacheable?: boolean
  cacheExpiraHoras?: number
  maxTokens?: number
  temperatura?: number
}

export interface LlamarGeminiResult {
  texto: string
  fromCache: boolean
  tokensUsados: number
  costeUsd: number
  modelo: 'flash' | 'lite' | 'cache'
  error?: string
}

export async function llamarGemini(params: LlamarGeminiParams): Promise<LlamarGeminiResult> {
  const {
    herramienta,
    prompt,
    userId = null,
    esPremium = false,
    usarLite = false,
    cacheable = false,
    cacheExpiraHoras = 24,
    maxTokens = usarLite ? 200 : 500,
    temperatura = 0.8,
  } = params

  const modeloUrl   = usarLite ? GEMINI_LITE_URL  : GEMINI_FLASH_URL
  const costoInput  = usarLite ? COSTE_LITE_INPUT  : COSTE_FLASH_INPUT
  const costoOutput = usarLite ? COSTE_LITE_OUTPUT : COSTE_FLASH_OUTPUT
  const modeloNombre: 'flash' | 'lite' = usarLite ? 'lite' : 'flash'

  // ── 1. KILL SWITCH ─────────────────────────────────────────
  const config = await obtenerConfig()
  if (!config.activo) {
    return error('El servicio de IA está temporalmente pausado. Inténtalo más tarde.')
  }

  // ── 2. PRESUPUESTO ─────────────────────────────────────────
  const [gastoHoy, gastoMes] = await Promise.all([obtenerGastoHoy(), obtenerGastoMes()])
  if (gastoHoy >= config.presupuesto_diario_usd) {
    return error('Se ha alcanzado el límite de consultas IA por hoy. Vuelve mañana.')
  }
  if (gastoMes >= config.presupuesto_mensual_usd) {
    return error('Se ha alcanzado el límite mensual de consultas IA.')
  }

  // ── 3. RATE LIMITING ───────────────────────────────────────
  if (userId) {
    const limiteHora = esPremium ? config.limite_calls_hora_premium : config.limite_calls_hora_free
    const limiteDia  = esPremium ? config.limite_calls_dia_premium  : config.limite_calls_dia_free
    const [callsHora, callsDia] = await Promise.all([
      contarCallsUsuario(userId, 'hora'),
      contarCallsUsuario(userId, 'dia'),
    ])
    if (callsHora >= limiteHora) {
      return error(`Has alcanzado el límite de ${limiteHora} consultas por hora.${esPremium ? '' : ' Hazte Premium para aumentar tu límite.'}`)
    }
    if (callsDia >= limiteDia) {
      return error(`Has alcanzado el límite de ${limiteDia} consultas por día.${esPremium ? '' : ' Hazte Premium para aumentar tu límite.'}`)
    }
  }

  // ── 4. CACHÉ ───────────────────────────────────────────────
  if (cacheable) {
    const cacheKey = await generarCacheKey(herramienta, prompt)
    const cached = await buscarEnCache(cacheKey)
    if (cached) {
      supabase.from('ai_cache').update({ hits: cached.hits + 1 }).eq('cache_key', cacheKey).then(() => {})
      return { texto: cached.respuesta, fromCache: true, tokensUsados: cached.tokens_used, costeUsd: 0, modelo: 'cache' }
    }
  }

  // ── 5. LLAMADA A GEMINI ────────────────────────────────────
  let texto = ''
  let tokensInput = 0
  let tokensOutput = 0

  try {
    const response = await fetch(modeloUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: temperatura, maxOutputTokens: maxTokens },
      }),
    })

    if (!response.ok) {
      const errBody = await response.text()
      console.error(`[gemini/${modeloNombre}] Error API:`, response.status, errBody)
      if (response.status === 429) return error('Demasiadas consultas. Inténtalo en unos segundos.')
      return error('Error al conectar con el servicio de IA. Inténtalo de nuevo.')
    }

    const data = await response.json()
    texto        = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    tokensInput  = data.usageMetadata?.promptTokenCount ?? 0
    tokensOutput = data.usageMetadata?.candidatesTokenCount ?? 0

  } catch (err) {
    console.error(`[gemini/${modeloNombre}] Error de red:`, err)
    return error('Error de conexión. Comprueba tu internet e inténtalo de nuevo.')
  }

  const costeUsd    = (tokensInput * costoInput) + (tokensOutput * costoOutput)
  const tokensTotal = tokensInput + tokensOutput

  // ── 6. GUARDAR EN CACHÉ ────────────────────────────────────
  if (cacheable && texto) {
    const cacheKey = await generarCacheKey(herramienta, prompt)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + cacheExpiraHoras)
    supabase.from('ai_cache').insert({
      cache_key: cacheKey, herramienta, prompt_hash: cacheKey,
      respuesta: texto, tokens_used: tokensTotal, expires_at: expiresAt.toISOString(),
    }).then(() => {})
  }

  // ── 7. REGISTRAR USO ───────────────────────────────────────
  if (userId) {
    supabase.from('ai_usage').insert({
      user_id: userId, herramienta: `${herramienta}/${modeloNombre}`,
      tokens_input: tokensInput, tokens_output: tokensOutput, coste_usd: costeUsd,
    }).then(() => {})
    supabase.rpc('incrementar_consulta', { user_id_param: userId }).then(() => {})
  }

  return { texto, fromCache: false, tokensUsados: tokensTotal, costeUsd, modelo: modeloNombre }
}

// ── Helpers ────────────────────────────────────────────────

function error(mensaje: string): LlamarGeminiResult {
  return { texto: '', fromCache: false, tokensUsados: 0, costeUsd: 0, modelo: 'flash', error: mensaje }
}

async function obtenerConfig() {
  try {
    const { data } = await supabase.from('ai_config').select('*').eq('id', 1).single()
    return data ?? configDefecto()
  } catch { return configDefecto() }
}

function configDefecto() {
  return {
    activo: true,
    presupuesto_diario_usd: 5,
    presupuesto_mensual_usd: 50,
    limite_calls_hora_free: 10,
    limite_calls_dia_free: 30,
    limite_calls_hora_premium: 50,
    limite_calls_dia_premium: 200,
  }
}

async function obtenerGastoHoy(): Promise<number> {
  try {
    const { data } = await supabase.from('ai_gasto_hoy').select('*').single()
    return Number(data?.total_eur ?? data?.gasto_usd_hoy ?? 0)
  } catch { return 0 }
}

async function obtenerGastoMes(): Promise<number> {
  try {
    const { data } = await supabase.from('ai_gasto_mes').select('*').single()
    return Number(data?.total_eur ?? data?.gasto_usd_mes ?? 0)
  } catch { return 0 }
}

async function contarCallsUsuario(userId: string, periodo: 'hora' | 'dia'): Promise<number> {
  try {
    const desde = new Date()
    if (periodo === 'hora') desde.setHours(desde.getHours() - 1)
    else desde.setHours(0, 0, 0, 0)
    const { count } = await supabase.from('ai_usage').select('*', { count: 'exact', head: true })
      .eq('user_id', userId).gte('created_at', desde.toISOString())
    return count ?? 0
  } catch { return 0 }
}

async function buscarEnCache(cacheKey: string) {
  try {
    const { data } = await supabase.from('ai_cache').select('respuesta, tokens_used, hits')
      .eq('cache_key', cacheKey)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .maybeSingle()
    return data
  } catch { return null }
}

async function generarCacheKey(herramienta: string, prompt: string): Promise<string> {
  const text = `${herramienta}::${prompt}`
  const encoded = new TextEncoder().encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
