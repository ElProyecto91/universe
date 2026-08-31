import { useState } from 'react'
import { getPreguntaDelDia, getPreguntaAleatoria } from '../lib/motores/mirrorOracle'
import Compartir from '../components/Compartir'

export default function MirrorOracle() {
  const [respuesta, setRespuesta] = useState('')
  const [reflexion, setReflexion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'pregunta' | 'resultado'>('pregunta')
  const [preguntaActual, setPreguntaActual] = useState(getPreguntaDelDia())
  const nombre = localStorage.getItem('nombre') || 'viajero'

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const explorar = async () => {
    if (!respuesta.trim()) return
    setCargando(true)
    setFase('resultado')

    const prompt = `Eres un guía de autoconocimiento profundo que usa preguntas como espejos para revelar la sabiduría interior de las personas.

Nombre: ${nombre}
Pregunta mirror: "${preguntaActual.pregunta}"
Pregunta de profundización: "${preguntaActual.profundizacion}"
Respuesta de ${nombre}: "${respuesta}"

Escribe una reflexión de 3 párrafos para ${nombre} basada en su respuesta.
Primero, refleja de vuelta lo que has escuchado — muestra que has comprendido profundamente.
Luego, lleva la reflexión un nivel más profundo — ¿qué podría estar detrás de esta respuesta? ¿Qué patrón o creencia subyace?
Termina con una pregunta aún más profunda que abra nuevas perspectivas.
Sé empático, no interpretativo. No diagnostiques ni juzgues. Sostén el espacio de reflexión.`

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
      setReflexion(data.candidates?.[0]?.content?.parts?.[0]?.text || '')
    } catch {
      setReflexion('El espejo guarda silencio. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  const hoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => {
            if (fase === 'resultado') setFase('pregunta')
            else window.location.href = '/tradiciones'
          }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Mirror Oracle</p>
            <p className="text-purple-300 text-xs capitalize">{hoy}</p>
          </div>
        </div>

        {fase === 'pregunta' && (
          <div className="flex flex-col gap-6">

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur text-center">
              <p className="text-white/50 text-sm leading-relaxed">
                El Mirror Oracle no predice — refleja. Las preguntas son espejos que revelan lo que ya sabes pero aún no has visto con claridad.
              </p>
            </div>

            <div className="bg-white/5 border border-purple-500/20 rounded-3xl p-6 backdrop-blur">
              <div className="flex items-center justify-between mb-4">
                <p className="text-purple-300 text-xs tracking-widest uppercase">Pregunta del día</p>
                <span className="text-purple-300/50 text-xs bg-purple-500/10 px-2 py-1 rounded-full">{preguntaActual.categoria}</span>
              </div>
              <p className="text-white text-lg leading-relaxed font-medium mb-4">
                {preguntaActual.pregunta}
              </p>
              <p className="text-white/40 text-xs italic">
                {preguntaActual.profundizacion}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu respuesta</p>
              <textarea
                value={respuesta}
                onChange={e => setRespuesta(e.target.value)}
                placeholder="Escribe lo primero que surja. No filtres, no corrijas. Solo escribe."
                rows={6}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30 leading-relaxed"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setPreguntaActual(getPreguntaAleatoria()); setRespuesta('') }}
                className="flex-1 bg-white/5 border border-white/10 text-white/60 text-sm py-3 rounded-full hover:bg-white/10 transition"
              >
                Otra pregunta
              </button>
              <button
                onClick={explorar}
                disabled={!respuesta.trim()}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-full hover:opacity-90 transition disabled:opacity-40"
              >
                Explorar
              </button>
            </div>
          </div>
        )}

        {fase === 'resultado' && (
          <div className="flex flex-col gap-5">

            <div className="bg-white/5 border border-purple-500/20 rounded-3xl p-5 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">La pregunta</p>
              <p className="text-white/80 text-sm italic">"{preguntaActual.pregunta}"</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur">
              <p className="text-white/40 text-xs mb-1">Tu respuesta</p>
              <p className="text-white/70 text-sm">{respuesta.substring(0, 120)}{respuesta.length > 120 ? '...' : ''}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">El espejo te devuelve</p>
              {cargando ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : (
                <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{reflexion}</p>
              )}
            </div>

            {!cargando && reflexion && (
              <Compartir
                titulo="Mi reflexión del Mirror Oracle"
                texto={`Pregunta: "${preguntaActual.pregunta}"\n\n${reflexion}`}
                hashtags={['MirrorOracle', 'Universe', 'Autoconocimiento', 'Reflexion']}
              />
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                Continuar con mi Guía IA
              </button>
              <button
                onClick={() => { setFase('pregunta'); setRespuesta(''); setReflexion(''); setPreguntaActual(getPreguntaAleatoria()) }}
                className="w-full text-purple-300/60 text-sm py-2"
              >
                Nueva pregunta
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}