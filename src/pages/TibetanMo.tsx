import { useState } from 'react'
import { lanzarMo, getMoResultado } from '../lib/motores/tibetanMo'
import Compartir from '../components/Compartir'

export default function TibetanMo() {
  const [dados, setDados] = useState<{ dado1: number; dado2: number } | null>(null)
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

  const consultar = async () => {
    if (!pregunta.trim()) return
    const resultado = lanzarMo()
    setDados(resultado)
    setFase('resultado')
    setCargando(true)

    const mo = getMoResultado(resultado.dado1, resultado.dado2)

    const prompt = `Eres un experto en el sistema Mo tibetano, un método de adivinación del budismo tibetano que usa dados.

Nombre: ${nombre}
Pregunta: "${pregunta}"
Dados: ${resultado.dado1} y ${resultado.dado2}
Resultado: ${mo.titulo}
Signo: ${mo.signo}
Descripción: ${mo.descripcion}
Consejo base: ${mo.consejo}

Escribe una interpretación Mo de 2-3 párrafos para ${nombre}. Primero describe qué indica este resultado en la tradición Mo tibetana. Luego conecta con la pregunta específica de ${nombre}. El Mo no predice el futuro con certeza — ofrece una perspectiva sobre la energía presente y qué factores considerar. Termina con una reflexión budista sobre la impermanencia o la acción hábil. Sé respetuoso con la tradición.`

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
      setInterpretacion('El Mo guarda silencio. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  const signoColor = (signo: string) => {
    if (signo === 'favorable') return { color: '#22c55e', label: 'Favorable' }
    if (signo === 'desfavorable') return { color: '#ef4444', label: 'Desfavorable' }
    return { color: '#f59e0b', label: 'Neutro' }
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => {
            if (fase === 'resultado') setFase('preguntar')
            else window.location.href = '/tradiciones'
          }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Mo Tibetano · མོ</p>
            <p className="text-purple-300 text-xs">Adivinación budista tibetana</p>
          </div>
        </div>

        {fase === 'preguntar' && (
          <div className="flex flex-col gap-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
              <p className="text-white/60 text-sm leading-relaxed">
                El Mo es un sistema de adivinación del budismo tibetano que utiliza dados. Se consulta para decisiones importantes, viajes, salud y situaciones difíciles. No predice el futuro — refleja la energía del momento y ofrece orientación.
              </p>
            </div>

            <div className="text-center py-4">
              <p className="text-6xl mb-2">🎲</p>
              <p className="text-white/40 text-xs">Dos dados · 36 posibles resultados</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu pregunta</p>
              <textarea
                value={pregunta}
                onChange={e => setPregunta(e.target.value)}
                placeholder="Formula tu pregunta con sinceridad y claridad mental..."
                rows={3}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30"
              />
            </div>

            <button
              onClick={consultar}
              disabled={!pregunta.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >
              Lanzar el Mo
            </button>
          </div>
        )}

        {fase === 'resultado' && dados && (
          <div className="flex flex-col gap-5">

            {(() => {
              const mo = getMoResultado(dados.dado1, dados.dado2)
              const sc = signoColor(mo.signo)
              return (
                <>
                  <div className="flex justify-center gap-8 py-4">
                    {[dados.dado1, dados.dado2].map((d, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-3xl font-bold text-purple-300">
                          {d}
                        </div>
                        <p className="text-white/40 text-xs">Dado {i + 1}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/5 border border-purple-500/20 rounded-3xl p-5 backdrop-blur text-center">
                    <p className="text-white font-bold text-lg mb-2">{mo.titulo}</p>
                    <span
                      className="text-xs px-3 py-1 rounded-full font-semibold"
                      style={{ backgroundColor: sc.color + '20', color: sc.color }}
                    >
                      {sc.label}
                    </span>
                    <p className="text-white/60 text-sm mt-3 leading-relaxed">{mo.descripcion}</p>
                    <p className="text-purple-300 text-xs mt-2 italic">{mo.consejo}</p>
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
                      titulo={`Mo Tibetano: ${mo.titulo}`}
                      texto={interpretacion}
                      hashtags={['TibetanMo', 'Universe', 'Budismo', 'Adivinacion']}
                    />
                  )}

                  <div className="flex flex-col gap-3">
                    <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                      Explorar con mi Guía IA
                    </button>
                    <button onClick={() => { setFase('preguntar'); setDados(null); setInterpretacion('') }} className="w-full text-purple-300/60 text-sm py-2">
                      Nueva consulta
                    </button>
                  </div>
                </>
              )
            })()}
          </div>
        )}

      </div>
    </div>
  )
}