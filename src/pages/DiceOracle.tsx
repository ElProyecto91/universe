import { useState } from 'react'
import { lanzar3Dados, INTERPRETACIONES_DADO } from '../lib/motores/dados'
import Compartir from '../components/Compartir'

export default function DiceOracle() {
  const [dados, setDados] = useState<number[]>([])
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'preguntar' | 'resultado'>('preguntar')
  const [pregunta, setPregunta] = useState('')
  const nombre = localStorage.getItem('nombre') || 'viajero'

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const lanzar = async () => {
    if (!pregunta.trim()) return
    const resultado = lanzar3Dados()
    setDados(resultado)
    setFase('resultado')
    setCargando(true)

    const suma = resultado.reduce((a, b) => a + b, 0)
    const prompt = `Eres un intérprete de oráculos de dados con conocimiento de numerología y simbolismo.

Nombre: ${nombre}
Pregunta: "${pregunta}"
Dados: ${resultado.join(', ')} (suma: ${suma})

Interpreta estos tres dados para ${nombre}. El primer dado representa la mente/pensamiento, el segundo el corazón/emoción, el tercero la acción/cuerpo. La suma total también tiene su significado.

Escribe una interpretación de 2-3 párrafos. Conecta los números con la pregunta de ${nombre}. Termina con una reflexión o consejo concreto. No hagas predicciones absolutas — ofrece perspectiva y sabiduría.`

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
      setInterpretacion('Los dados guardan silencio. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  const CARAS_DADO = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅']

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => window.location.href = '/tradiciones'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Oracle de Dados</p>
            <p className="text-purple-300 text-xs">Cleromancia · Tradición antigua</p>
          </div>
        </div>

        {fase === 'preguntar' && (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <p className="text-6xl mb-4">⚄</p>
              <p className="text-white/60 text-sm leading-relaxed">
                La cleromancia — adivinación mediante objetos lanzados al azar — es una de las prácticas más antiguas de la humanidad, presente en culturas de todo el mundo.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu pregunta</p>
              <textarea
                value={pregunta}
                onChange={e => setPregunta(e.target.value)}
                placeholder="Formula tu pregunta con claridad..."
                rows={3}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30"
              />
            </div>

            <button
              onClick={lanzar}
              disabled={!pregunta.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >
              Lanzar los dados
            </button>
          </div>
        )}

        {fase === 'resultado' && (
          <div className="flex flex-col gap-5">

            <div className="flex justify-center gap-6 py-4">
              {dados.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <span className="text-6xl">{CARAS_DADO[d]}</span>
                  <span className="text-white/40 text-xs">{['Mente', 'Corazón', 'Acción'][i]}</span>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur">
              <p className="text-white/40 text-xs">Pregunta: <span className="text-white/70 italic">"{pregunta}"</span></p>
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
                titulo={`Mi Oracle de Dados: ${dados.join('-')}`}
                texto={interpretacion}
                hashtags={['DiceOracle', 'Universe', 'Cleromancia']}
              />
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                Explorar con mi Guía IA
              </button>
              <button onClick={() => { setFase('preguntar'); setDados([]); setInterpretacion('') }} className="w-full text-purple-300/60 text-sm py-2">
                Nueva tirada
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}