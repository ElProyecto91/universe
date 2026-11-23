// api/cron/horoscopo-batch.ts
// ============================================================
// Semitua — Batch diario de horóscopos
// Vercel Cron Job: se ejecuta cada día a las 06:00 UTC
// ============================================================
//
// vercel.json:
// {
//   "crons": [{
//     "path": "/api/cron/horoscopo-batch",
//     "schedule": "0 6 * * *"
//   }]
// }
//
// Variables de entorno necesarias (en Vercel):
//   GEMINI_API_KEY            — clave de Gemini (sin prefijo VITE_: nunca debe
//                               llegar al navegador). Si no existe, se usa
//                               VITE_GEMINI_API_KEY solo como transición.
//   SUPABASE_URL              — ya existe (o VITE_SUPABASE_URL)
//   SUPABASE_SERVICE_ROLE_KEY — clave SERVICE ROLE (no la anon key)
//   CRON_SECRET               — string aleatorio para proteger el endpoint
//   HOROSCOPO_MODEL           — opcional; por defecto el mismo modelo Flash que
//                               usa la Edge Function `gemini`
//
// Es idempotente: los signos que ya tienen horóscopo de hoy se saltan, así que
// se puede volver a lanzar a mano para rellenar los que fallaron.
// ============================================================

import { createClient } from '@supabase/supabase-js'

const SIGNOS = [
  'aries', 'tauro', 'géminis', 'cáncer', 'leo', 'virgo',
  'libra', 'escorpio', 'sagitario', 'capricornio', 'acuario', 'piscis'
]

const MODELO_POR_DEFECTO = 'gemini-3.6-flash'

// Errores transitorios de Gemini: se reintentan con espera creciente.
const ESTADOS_REINTENTABLES = [429, 500, 502, 503, 504]
const MAX_INTENTOS = 3
const ESPERAS_REINTENTO_MS = [4000, 10000]
const TIMEOUT_PETICION_MS = 20000

// Pausa entre llamadas a Gemini (los 429 ya se reintentan, así que no hace falta
// ir al límite más conservador).
const PAUSA_ENTRE_SIGNOS_MS = 8000

// Vercel corta la función a los 300 s. No se empieza un signo nuevo pasado este
// tiempo; los que queden se completan en la siguiente ejecución.
const PRESUPUESTO_MS = 215000

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function generarHoroscopo(signo: string): Promise<{ texto: string; tokens: number }> {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.VITE_GEMINI_API_KEY
  if (!apiKey) throw new Error('Falta GEMINI_API_KEY en las variables de entorno')

  const modelo = process.env.HOROSCOPO_MODEL ?? MODELO_POR_DEFECTO

  const prompt = `Eres un astrólogo simbólico. Genera el horóscopo diario para ${signo} de hoy.

Escribe 3-4 párrafos cortos sobre: energía general del día, amor/relaciones, trabajo/creatividad, y un mensaje de cierre.

Tono: reflexivo, simbólico, nunca predictivo ni alarmante. Invita a la introspección.
Evita frases como "hoy te pasará X" o predicciones absolutas.
Máximo 200 palabras. Responde solo el texto del horóscopo, sin título ni encabezado.`

  let ultimoError = 'Error desconocido'

  for (let intento = 1; intento <= MAX_INTENTOS; intento++) {
    let reintentable = true
    try {
      // La clave va en cabecera, no en la URL (las URLs acaban en logs).
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
          signal: AbortSignal.timeout(TIMEOUT_PETICION_MS),
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 400,
            }
          })
        }
      )

      if (response.ok) {
        const data = await response.json()
        const texto = (data.candidates?.[0]?.content?.parts?.[0]?.text ?? '').trim()
        const tokens = data.usageMetadata?.totalTokenCount ?? 0
        // Nunca se guarda una respuesta vacía en la caché: la verían todos los usuarios.
        if (!texto) throw new Error('Gemini devolvió una respuesta vacía')
        return { texto, tokens }
      }

      reintentable = ESTADOS_REINTENTABLES.includes(response.status)
      ultimoError = `Gemini error ${response.status}: ${(await response.text()).slice(0, 200)}`
    } catch (error) {
      // Timeout o fallo de red: también es transitorio. Una respuesta vacía no.
      const msg = error instanceof Error ? error.message : 'Error desconocido'
      if (msg.startsWith('Gemini devolvió')) throw error
      ultimoError = msg
    }

    if (!reintentable || intento === MAX_INTENTOS) break
    await sleep(ESPERAS_REINTENTO_MS[intento - 1] ?? 10000)
  }

  throw new Error(ultimoError)
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? '',
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  )

  const inicio = Date.now()
  const hoy = new Date().toISOString().split('T')[0]
  const resultados: Array<{ signo: string; ok: boolean; tokens?: number; error?: string }> = []
  let tokensTotal = 0

  for (let i = 0; i < SIGNOS.length; i++) {
    const signo = SIGNOS[i]

    if (Date.now() - inicio > PRESUPUESTO_MS) {
      resultados.push({ signo, ok: false, error: 'Sin tiempo: se completará en la próxima ejecución' })
      continue
    }

    try {
      // Comprobar si ya existe en cache para hoy
      const { data: existe } = await supabase
        .from('horoscopo_cache')
        .select('id')
        .eq('signo', signo)
        .eq('fecha', hoy)
        .eq('tipo', 'diario')
        .maybeSingle()

      if (existe) {
        resultados.push({ signo, ok: true, tokens: 0 })
        continue
      }

      // Generar con Gemini (con reintentos ante errores transitorios)
      const { texto, tokens } = await generarHoroscopo(signo)

      // Guardar en cache
      const { error: errorGuardado } = await supabase.from('horoscopo_cache').insert({
        signo,
        fecha: hoy,
        tipo: 'diario',
        contenido: texto,
        tokens_used: tokens
      })
      if (errorGuardado) throw new Error(`No se pudo guardar en horoscopo_cache: ${errorGuardado.message}`)

      tokensTotal += tokens
      resultados.push({ signo, ok: true, tokens })

      // Pausa entre llamadas a Gemini; no hace falta tras el último signo.
      if (i < SIGNOS.length - 1) await sleep(PAUSA_ENTRE_SIGNOS_MS)

    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error desconocido'
      resultados.push({ signo, ok: false, error: msg })
      console.error(`[horoscopo-batch] Error en ${signo}:`, msg)
    }
  }

  // Limpiar cache antiguo (más de 7 días)
  const hace7dias = new Date()
  hace7dias.setDate(hace7dias.getDate() - 7)
  await supabase
    .from('horoscopo_cache')
    .delete()
    .lt('fecha', hace7dias.toISOString().split('T')[0])

  const exitosos = resultados.filter(r => r.ok).length
  const pendientes = resultados.filter(r => !r.ok).map(r => r.signo)
  console.log(`[horoscopo-batch] ${hoy}: ${exitosos}/${SIGNOS.length} signos OK, ${tokensTotal} tokens totales` +
    (pendientes.length ? `, pendientes: ${pendientes.join(', ')}` : ''))

  return Response.json({
    fecha: hoy,
    resultados,
    tokens_total: tokensTotal,
    exitosos,
    fallidos: SIGNOS.length - exitosos,
    pendientes
  })
}
