import { useState } from 'react'
import { getMensajeDiario, getSignoSolar } from '../lib/motores/astroDaily'
import Compartir from '../components/Compartir'
import { supabase } from '../lib/supabase'

export default function AstroDaily() {
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [generado, setGenerado] = useState(false)
  const [fromCache, setFromCache] = useState(false)

  const nombre = localStorage.getItem('nombre') || 'viajero'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const signo = getSignoSolar(fechaNacimiento)
  const mensajes = getMensajeDiario(signo)
  const hoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
  const fechaHoy = new Date().toISOString().split('T')[0]

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const generarLectura = async () => {
    setCargando(true)
    setGenerado(true)

    // ── 1. Buscar en caché ─────────────────────────────────
    try {
      const { data: cached } = await supabase
        .from('horoscopo_cache')
        .select('contenido')
        .eq('signo', signo.toLowerCase())
        .eq('fecha', fechaHoy)
        .eq('tipo', 'astro-daily')
        .maybeSingle()

      if (cached?.contenido) {
        setInterpretacion(`${nombre}, ${cached.contenido}`)
        setFromCache(true)
        setCargando(false)
        return
      }
    } catch (err) {
      console.warn('[AstroDaily] Error leyendo caché:', err)
    }

    // ── 2. Fallback: Gemini ────────────────────────────────
    const prompt = `Eres un astrólogo simbólico que combina astrología occidental con psicología moderna.

Signo solar: ${signo}
Fecha: ${hoy}
Energía del día: ${mensajes.energia}

Escribe una guía astrológica diaria de 3 párrafos para ${signo}.
Primero habla de la energía general que ${signo} experimenta hoy.
Luego da un consejo para amor/relaciones y otro para trabajo/proyectos.
Termina con una afirmación poderosa para ${signo}.
Tono: reflexivo, simbólico, nunca predictivo ni alarmante.
Máximo 200 palabras. Solo el texto, sin título ni encabezado.`

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
          }),
        }
      )
      const data = await res.json()
      const texto = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      const tokens = data.usageMetadata?.totalTokenCount ?? 0

      setInterpretacion(`${nombre}, ${texto}`)
      setFromCache(false)

      // Guardar en caché (fire & forget)
      supabase.from('horoscopo_cache').insert({
        signo: signo.toLowerCase(),
        fecha: fechaHoy,
        tipo: 'astro-daily',
        contenido: texto,
        tokens_used: tokens,
      }).then(() => {})

    } catch {
      setInterpretacion('Las estrellas guardan silencio hoy. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => window.location.href = '/universo'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Astro Daily</p>
            <p className="text-purple-300 text-xs capitalize">{hoy}</p>
          </div>
        </div>

        <div className="bg-white/5 border border-purple-500/30 rounded-3xl p-6 backdrop-blur text-center">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Tu energía hoy</p>
          <p className="text-3xl font-bold mb-1">{signo}</p>
          <p className="text-purple-300 text-sm">{mensajes.energia}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Mensaje del día</p>
          <p className="text-white/90 text-sm leading-relaxed">{mensajes.mensaje}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
            <p className="text-pink-300 text-xs tracking-widest uppercase mb-2">❤️ Amor</p>
            <p className="text-white/70 text-xs leading-relaxed">{mensajes.amor}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
            <p className="text-amber-300 text-xs tracking-widest uppercase mb-2">💼 Trabajo</p>
            <p className="text-white/70 text-xs leading-relaxed">{mensajes.trabajo}</p>
          </div>
        </div>

        {!generado ? (
          <button
            onClick={generarLectura}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
          >
            Generar mi guía astrológica completa
          </button>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-3">
              <p className="text-purple-300 text-xs tracking-widest uppercase">Tu guía completa</p>
              {fromCache && <span className="text-green-400 text-xs">⚡ Instantáneo</span>}
            </div>
            {cargando ? (
              <div className="flex gap-2 py-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{interpretacion}</p>
            )}
          </div>
        )}

        {!cargando && interpretacion && (
          <Compartir
            titulo={`Mi Astro Daily: ${signo} · ${hoy}`}
            texto={interpretacion}
            hashtags={['AstroDaily', 'Universe', signo, 'Astrologia']}
          />
        )}

        {generado && !cargando && (
          <button onClick={() => window.location.href = '/guia'} className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full">
            Explorar con mi Guía IA
          </button>
        )}

      </div>
    </div>
  )
}
