// api/cron/horoscopo-batch.ts
// ============================================================
// UNIVERSE — Batch diario de horóscopos
// Vercel Cron Job: se ejecuta cada día a las 06:00 UTC
// Configurar en vercel.json (ver abajo)
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
//   VITE_GEMINI_API_KEY       — ya existe
//   SUPABASE_URL              — ya existe (o VITE_SUPABASE_URL)
//   SUPABASE_SERVICE_ROLE_KEY — clave SERVICE ROLE (no la anon key)
//   CRON_SECRET               — string aleatorio para proteger el endpoint
// ============================================================

import { createClient } from '@supabase/supabase-js'

const SIGNOS = [
  'aries', 'tauro', 'géminis', 'cáncer', 'leo', 'virgo',
  'libra', 'escorpio', 'sagitario', 'capricornio', 'acuario', 'piscis'
]

// Pausa entre llamadas a Gemini para evitar rate limits
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function generarHoroscopo(signo: string): Promise<{ texto: string; tokens: number }> {
  const prompt = `Eres un astrólogo simbólico. Genera el horóscopo diario para ${signo} de hoy.
  
Escribe 3-4 párrafos cortos sobre: energía general del día, amor/relaciones, trabajo/creatividad, y un mensaje de cierre.

Tono: reflexivo, simbólico, nunca predictivo ni alarmante. Invita a la introspección.
Evita frases como "hoy te pasará X" o predicciones absolutas.
Máximo 200 palabras. Responde solo el texto del horóscopo, sin título ni encabezado.`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.VITE_GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 400,
        }
      })
    }
  )

  if (!response.ok) {
    throw new Error(`Gemini error ${response.status}: ${await response.text()}`)
  }

  const data = await response.json()
  const texto = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  const tokens = data.usageMetadata?.totalTokenCount ?? 0

  return { texto, tokens }
}

export async function GET(request: Request) {
  // Verificar que la llamada viene de Vercel Cron o de nosotros
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createClient(
    process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? '',
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  )

  const hoy = new Date().toISOString().split('T')[0] // 'YYYY-MM-DD'
  const resultados: Array<{ signo: string; ok: boolean; tokens?: number; error?: string }> = []
  let tokensTotal = 0

  for (const signo of SIGNOS) {
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
        continue // ya generado, no gastar tokens
      }

      // Generar con Gemini
      const { texto, tokens } = await generarHoroscopo(signo)

      // Guardar en cache
      await supabase.from('horoscopo_cache').insert({
        signo,
        fecha: hoy,
        tipo: 'diario',
        contenido: texto,
        tokens_used: tokens
      })

      tokensTotal += tokens
      resultados.push({ signo, ok: true, tokens })

      // Pausa de 500ms entre signo y signo (evitar rate limit de Gemini)
      await sleep(15000)

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
  console.log(`[horoscopo-batch] ${hoy}: ${exitosos}/12 signos OK, ${tokensTotal} tokens totales`)

  return Response.json({
    fecha: hoy,
    resultados,
    tokens_total: tokensTotal,
    exitosos,
    fallidos: 12 - exitosos
  })
}
