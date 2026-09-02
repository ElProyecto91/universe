import { useState, useEffect } from 'react'
import { getHoroscopoDiario, getSignoSolar } from '../lib/motores/horoscopo'
import Compartir from '../components/Compartir'
import { supabase } from '../lib/supabase'

const TODOS_LOS_SIGNOS = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
  'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
]

const SIMBOLOS_SIGNOS: Record<string, string> = {
  Aries: '♈', Tauro: '♉', Géminis: '♊', Cáncer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Escorpio: '♏',
  Sagitario: '♐', Capricornio: '♑', Acuario: '♒', Piscis: '♓',
}

// Coste por token (para fallback con Gemini directo)
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`

export default function Horoscopo() {
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const miSigno = getSignoSolar(fechaNacimiento)
  const [signoSeleccionado, setSignoSeleccionado] = useState(miSigno)
  const [vista, setVista] = useState<'diario' | 'todos'>('diario')
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [generado, setGenerado] = useState(false)
  const [fromCache, setFromCache] = useState(false)

  const horoscopo = getHoroscopoDiario(signoSeleccionado)
  const hoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
  const nombre = localStorage.getItem('nombre') || 'viajero'
  const fechaHoy = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  // Resetear al cambiar signo
  useEffect(() => {
    setGenerado(false)
    setInterpretacion('')
    setFromCache(false)
  }, [signoSeleccionado])

  const generarLectura = async () => {
    setCargando(true)
    setGenerado(true)

    // ── 1. Buscar en caché de Supabase ─────────────────────
    try {
      const { data: cached } = await supabase
        .from('horoscopo_cache')
        .select('contenido')
        .eq('signo', signoSeleccionado.toLowerCase())
        .eq('fecha', fechaHoy)
        .eq('tipo', 'diario')
        .maybeSingle()

      if (cached?.contenido) {
        // ✅ Cache hit — 0 tokens gastados
        // Personalizamos el saludo en el frontend, sin IA
        const textoPersonalizado = `${nombre}, ${cached.contenido}`
        setInterpretacion(textoPersonalizado)
        setFromCache(true)
        setCargando(false)
        return
      }
    } catch (err) {
      console.warn('[Horoscopo] Error leyendo caché, usando Gemini:', err)
    }

    // ── 2. Fallback: llamar a Gemini si no hay caché ───────
    // (Solo ocurre si el cron no se ejecutó aún hoy)
    const prompt = `Eres un astrólogo simbólico. Genera el horóscopo diario para ${signoSeleccionado} de hoy.

Escribe 3-4 párrafos cortos sobre: energía general del día, amor/relaciones, trabajo/creatividad, y un mensaje de cierre.

Tono: reflexivo, simbólico, nunca predictivo ni alarmante. Invita a la introspección.
Evita frases como "hoy te pasará X" o predicciones absolutas.
Máximo 200 palabras. Responde solo el texto del horóscopo, sin título ni encabezado.`

    try {
      const res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        }),
      })
      const data = await res.json()
      const texto = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      const tokens = data.usageMetadata?.totalTokenCount ?? 0

      setInterpretacion(`${nombre}, ${texto}`)
      setFromCache(false)

      // Guardar en caché para los siguientes usuarios (fire & forget)
      supabase.from('horoscopo_cache').insert({
        signo: signoSeleccionado.toLowerCase(),
        fecha: fechaHoy,
        tipo: 'diario',
        contenido: texto,
        tokens_used: tokens,
      }).then(() => {})

    } catch {
      setInterpretacion('Las estrellas guardan silencio. Inténtalo de nuevo.')
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
            <p className="text-white font-semibold text-sm">Horóscopo</p>
            <p className="text-purple-300 text-xs capitalize">{hoy}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white/10 rounded-2xl p-1">
          <button
            onClick={() => setVista('diario')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${vista === 'diario' ? 'bg-purple-600 text-white' : 'text-white/50'}`}
          >
            Mi horóscopo
          </button>
          <button
            onClick={() => setVista('todos')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${vista === 'todos' ? 'bg-purple-600 text-white' : 'text-white/50'}`}
          >
            Todos los signos
          </button>
        </div>

        {vista === 'todos' && (
          <div className="grid grid-cols-3 gap-2">
            {TODOS_LOS_SIGNOS.map(s => (
              <button
                key={s}
                onClick={() => { setSignoSeleccionado(s); setVista('diario') }}
                className={`rounded-2xl p-3 flex flex-col items-center gap-1 transition border ${s === signoSeleccionado ? 'bg-purple-600/40 border-purple-400' : 'bg-white/8 border-white/20 hover:bg-white/15'}`}
                style={{ backgroundColor: s === signoSeleccionado ? undefined : 'rgba(255,255,255,0.08)' }}
              >
                <span className="text-2xl" style={{ fontFamily: 'serif' }}>{SIMBOLOS_SIGNOS[s]}</span>
                <span className="text-xs text-white">{s}</span>
                {s === miSigno && <span className="text-xs text-purple-300">Tu signo</span>}
              </button>
            ))}
          </div>
        )}

        {vista === 'diario' && (
          <>
            {/* Signo header */}
            <div className="bg-white/8 border border-white/20 rounded-3xl p-6 backdrop-blur flex flex-col items-center gap-2"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <span className="text-6xl" style={{ fontFamily: 'serif', textShadow: '0 0 20px rgba(192,132,252,0.6)' }}>
                {SIMBOLOS_SIGNOS[signoSeleccionado]}
              </span>
              <p className="text-2xl font-bold">{signoSeleccionado}</p>
              {signoSeleccionado !== miSigno && (
                <button
                  onClick={() => setSignoSeleccionado(miSigno)}
                  className="text-purple-300 text-xs"
                >
                  ← Volver a mi signo ({miSigno})
                </button>
              )}
            </div>

            {/* Mensaje general */}
            <div className="bg-white/8 border border-white/20 rounded-3xl p-6 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Energía del día</p>
              <p className="text-white/90 text-sm leading-relaxed">{horoscopo.general}</p>
            </div>

            {/* Grid amor/trabajo */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <p className="text-pink-300 text-xs tracking-widest uppercase mb-2">❤️ Amor</p>
                <p className="text-white/80 text-xs leading-relaxed">{horoscopo.amor}</p>
              </div>
              <div className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <p className="text-amber-300 text-xs tracking-widest uppercase mb-2">💼 Trabajo</p>
                <p className="text-white/80 text-xs leading-relaxed">{horoscopo.trabajo}</p>
              </div>
            </div>

            {/* Salud */}
            <div className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-green-300 text-xs tracking-widest uppercase mb-2">🌿 Salud</p>
              <p className="text-white/80 text-xs leading-relaxed">{horoscopo.salud}</p>
            </div>

            {/* Afirmación */}
            <div className="bg-purple-600/20 border border-purple-400/30 rounded-2xl p-4 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">✨ Afirmación del día</p>
              <p className="text-white font-medium text-sm italic">"{horoscopo.afirmacion}"</p>
            </div>

            {!generado ? (
              <button
                onClick={generarLectura}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
              >
                Generar horóscopo completo con IA
              </button>
            ) : (
              <div className="bg-white/8 border border-white/20 rounded-3xl p-6 backdrop-blur"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-purple-300 text-xs tracking-widest uppercase">Tu horóscopo completo</p>
                  {fromCache && (
                    <span className="text-green-400 text-xs">⚡ Instantáneo</span>
                  )}
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
                titulo={`Mi horóscopo de hoy: ${signoSeleccionado} ${SIMBOLOS_SIGNOS[signoSeleccionado]}`}
                texto={interpretacion}
                hashtags={['Horoscopo', 'Universe', signoSeleccionado, 'Astrologia']}
              />
            )}

            <button onClick={() => window.location.href = '/guia'} className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full">
              Explorar con mi Guía IA
            </button>
          </>
        )}

      </div>
    </div>
  )
}
