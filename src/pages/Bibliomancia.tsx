import { useState } from 'react'
import { getTextoAleatorio, TEXTOS_DOMINIO_PUBLICO } from '../lib/motores/bibliomancia'
import Compartir from '../components/Compartir'

export default function Bibliomancia() {
  const [texto, setTexto] = useState<typeof TEXTOS_DOMINIO_PUBLICO[0] | null>(null)
  const [pregunta, setPregunta] = useState('')
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'preguntar' | 'resultado'>('preguntar')
  const nombre = localStorage.getItem('nombre') || 'viajero'

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const abrir = async () => {
    if (!pregunta.trim()) return
    const pasaje = getTextoAleatorio()
    setTexto(pasaje)
    setFase('resultado')
    setCargando(true)

    const prompt = `Eres un intérprete de bibliomancia — el arte de encontrar orientación en textos sagrados o filosóficos abiertos al azar.

Nombre: ${nombre}
Pregunta: "${pregunta}"
Pasaje encontrado: "${pasaje.texto}"
Fuente: ${pasaje.fuente}

Explora la conexión entre esta pregunta y este pasaje para ${nombre}. ¿Qué podría estar diciendo este texto en respuesta a su situación? Escribe 2-3 párrafos de interpretación simbólica y reflexiva. No afirmes que el texto "predice" nada — explora la resonancia entre las palabras y la pregunta. Termina con una pregunta de reflexión.`

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
      setInterpretacion(data.candidates?.[0]?.content?.parts?.[0]?.text || '')
    } catch {
      setInterpretacion('El libro guarda silencio. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => window.location.href = '/tradiciones'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Bibliomancia</p>
            <p className="text-purple-300 text-xs">Textos en dominio público · Sabiduría universal</p>
          </div>
        </div>

        {fase === 'preguntar' && (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <p className="text-6xl mb-4">📖</p>
              <p className="text-white/60 text-sm leading-relaxed">
                La bibliomancia es el arte de encontrar orientación abriendo un texto al azar. Nuestra biblioteca incluye textos filosóficos y poéticos en dominio público de culturas de todo el mundo.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu pregunta</p>
              <textarea
                value={pregunta}
                onChange={e => setPregunta(e.target.value)}
                placeholder="¿Qué necesitas saber hoy?"
                rows={3}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30"
              />
            </div>

            <button
              onClick={abrir}
              disabled={!pregunta.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >
              Abrir el libro
            </button>
          </div>
        )}

        {fase === 'resultado' && texto && (
          <div className="flex flex-col gap-5">

            <div className="bg-white/5 border border-purple-500/20 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">El pasaje</p>
              <p className="text-white/90 text-base leading-relaxed italic mb-3">"{texto.texto}"</p>
              <p className="text-white/40 text-xs">— {texto.fuente}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur">
              <p className="text-white/40 text-xs">Pregunta: <span className="text-white/70 italic">"{pregunta}"</span></p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Reflexión</p>
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

            {!cargando && interpretacion && (
              <Compartir
                titulo={`Bibliomancia: ${texto.fuente}`}
                texto={`"${texto.texto}"\n\n${interpretacion}`}
                hashtags={['Bibliomancia', 'Universe', 'Sabiduria']}
              />
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                Explorar con mi Guía IA
              </button>
              <button onClick={() => { setFase('preguntar'); setTexto(null); setInterpretacion('') }} className="w-full text-purple-300/60 text-sm py-2">
                Nueva consulta
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}