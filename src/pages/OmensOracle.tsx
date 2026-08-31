import { useState } from 'react'
import Compartir from '../components/Compartir'

const SEÑALES_COMUNES = [
  '11:11 u otras horas repetidas',
  'Plumas encontradas en el camino',
  'Cuervos o cuervos que aparecen repetidamente',
  'Mariposas en momentos inesperados',
  'Sueños recurrentes',
  'Números que se repiten',
  'Canciones que suenan en momentos significativos',
  'Animales inusuales que aparecen',
  'Conversaciones que parecen responder tus preguntas',
  'Objetos que aparecen o desaparecen',
]

export default function OmensOracle() {
  const [señal, setSeñal] = useState('')
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'describir' | 'resultado'>('describir')
  const nombre = localStorage.getItem('nombre') || 'viajero'

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const interpretar = async () => {
    if (!señal.trim()) return
    setCargando(true)
    setFase('resultado')

    const prompt = `Eres un intérprete experto en presagios, sincronicidades y simbolismo de señales naturales, con conocimiento de múltiples tradiciones culturales.

Nombre: ${nombre}
Señal o sincronicidad: "${señal}"

Explora el posible significado de esta señal para ${nombre} desde múltiples perspectivas:
1. Qué dicen diferentes tradiciones culturales sobre esta señal (máximo 2-3 tradiciones relevantes)
2. Qué podría significar psicológicamente (Jung llamaba a esto sincronicidad — coincidencias significativas)
3. Cómo podría relacionarse con la vida de ${nombre} en este momento

Escribe 3 párrafos. No afirmes que la señal "predice" nada ni que definitivamente significa algo. Explora las posibilidades con apertura. Termina con una pregunta de reflexión. Sé respetuoso con todas las tradiciones que menciones.`

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
      setInterpretacion('El universo guarda silencio. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => {
            if (fase === 'resultado') setFase('describir')
            else window.location.href = '/tradiciones'
          }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Presagios y Señales</p>
            <p className="text-purple-300 text-xs">Sincronicidad · Simbolismo · Tradiciones</p>
          </div>
        </div>

        {fase === 'describir' && (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <p className="text-5xl mb-4">🔮</p>
              <p className="text-white/60 text-sm leading-relaxed">
                ¿Has notado algo que se repite? ¿Una señal que sientes significativa? Descríbela y exploramos su simbolismo desde diferentes tradiciones culturales y la psicología junguiana.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Describe la señal</p>
              <textarea
                value={señal}
                onChange={e => setSeñal(e.target.value)}
                placeholder="He estado viendo cuervos en todas partes durante tres días..."
                rows={4}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Señales comunes</p>
              <div className="flex flex-wrap gap-2">
                {SEÑALES_COMUNES.map(s => (
                  <button
                    key={s}
                    onClick={() => setSeñal(s)}
                    className="text-white/50 text-xs border border-white/10 rounded-full px-3 py-1 hover:text-white hover:border-purple-500/40 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={interpretar}
              disabled={!señal.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >
              Interpretar esta señal
            </button>
          </div>
        )}

        {fase === 'resultado' && (
          <div className="flex flex-col gap-5">

            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur">
              <p className="text-white/40 text-xs mb-1">Tu señal</p>
              <p className="text-white/70 text-sm italic">"{señal}"</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Interpretación</p>
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
                titulo="Mi señal interpretada"
                texto={interpretacion}
                hashtags={['Presagios', 'Universe', 'Sincronicidad', 'Señales']}
              />
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                Explorar con mi Guía IA
              </button>
              <button onClick={() => { setFase('describir'); setSeñal(''); setInterpretacion('') }} className="w-full text-purple-300/60 text-sm py-2">
                Interpretar otra señal
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}