import { useState } from 'react'
import { HEXAGRAMAS, lanzarMonedas, lineasAHexagrama, dibujarHexagrama } from '../lib/motores/iching'
import Compartir from '../components/Compartir'

export default function IChing() {
  const [fase, setFase] = useState<'pregunta' | 'resultado'>('pregunta')
  const [pregunta, setPregunta] = useState('')
  const [resultado, setResultado] = useState<any>(null)
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const nombre = localStorage.getItem('nombre') || 'viajero'

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const consultar = async () => {
    const lineas = lanzarMonedas()
    const { hexagrama, cambiante, hexagramaResultante } = lineasAHexagrama(lineas)
    const dibujo = dibujarHexagrama(lineas)
    const hexData = HEXAGRAMAS[hexagrama - 1]
    const hexResultData = HEXAGRAMAS[hexagramaResultante - 1]
    const hayCambio = cambiante.some(c => c) && hexagrama !== hexagramaResultante

    setResultado({ hexData, hexResultData, dibujo, hayCambio })
    setFase('resultado')
    setCargando(true)

    const prompt = `Eres un sabio intérprete del I Ching con profundo conocimiento de la filosofía taoísta.

${nombre} pregunta: "${pregunta}"

Ha obtenido el Hexagrama ${hexData.numero}: ${hexData.nombre} (${hexData.chino})
${hayCambio ? `Con líneas cambiantes que conducen al Hexagrama ${hexResultData.numero}: ${hexResultData.nombre} (${hexResultData.chino})` : ''}

Tema del hexagrama principal: ${hexData.tema}

Escribe una interpretación sabia y poética de 3-4 párrafos. Primero describe la energía del hexagrama. Luego conecta con la pregunta de ${nombre}. Si hay hexagrama resultante, habla de la transformación que señala. Termina con una pregunta de reflexión profunda. No hagas predicciones directas — el I Ching refleja la situación, no determina el futuro.`

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
          }),
        }
      )
      const data = await res.json()
      setInterpretacion(data.candidates?.[0]?.content?.parts?.[0]?.text || hexData.tema)
    } catch {
      setInterpretacion(hexData.tema)
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
            <p className="text-white font-semibold text-sm">I Ching · 易經</p>
            <p className="text-purple-300 text-xs">El Libro de los Cambios</p>
          </div>
        </div>

        {fase === 'pregunta' && (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <div className="text-5xl mb-4" style={{ fontFamily: 'serif' }}>☯</div>
              <p className="text-white/60 text-sm leading-relaxed">
                El I Ching no predice el futuro. Refleja la energía del momento presente y te ayuda a comprender la situación con mayor profundidad.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu pregunta</p>
              <textarea
                value={pregunta}
                onChange={e => setPregunta(e.target.value)}
                placeholder="Formula tu pregunta con sinceridad..."
                rows={3}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30"
              />
            </div>

            <button
              onClick={consultar}
              disabled={!pregunta.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >
              Lanzar las monedas
            </button>
          </div>
        )}

        {fase === 'resultado' && resultado && (
          <div className="flex flex-col gap-5">

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-4">Tu hexagrama</p>
              <div className="flex gap-6 items-start">
                <div className="flex flex-col gap-2 font-mono text-lg">
                  {resultado.dibujo.map((linea: string, i: number) => (
                    <div key={i} className="text-purple-300">{linea}</div>
                  ))}
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-1">Hexagrama {resultado.hexData.numero}</p>
                  <p className="text-xl font-semibold">{resultado.hexData.nombre}</p>
                  <p className="text-2xl" style={{ fontFamily: 'serif' }}>{resultado.hexData.chino}</p>
                  <p className="text-purple-300/70 text-xs mt-1">{resultado.hexData.keywords}</p>
                </div>
              </div>
            </div>

            {resultado.hayCambio && (
              <div className="bg-white/5 border border-purple-500/20 rounded-3xl p-4 backdrop-blur">
                <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Transformación hacia</p>
                <p className="text-white font-semibold">{resultado.hexResultData.nombre} · {resultado.hexResultData.chino}</p>
                <p className="text-white/50 text-xs">{resultado.hexResultData.keywords}</p>
              </div>
            )}

            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur">
              <p className="text-white/40 text-xs">Tu pregunta: <span className="text-white/70 italic">"{pregunta}"</span></p>
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
                titulo={`Mi consulta al I Ching: ${resultado.hexData.nombre}`}
                texto={interpretacion}
                hashtags={['IChing', 'Universe', 'Sabiduria', 'China']}
              />
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                Explorar con mi Guía IA
              </button>
              <button onClick={() => { setFase('pregunta'); setPregunta(''); setInterpretacion('') }} className="w-full text-purple-300/60 text-sm py-2">
                Nueva consulta
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}