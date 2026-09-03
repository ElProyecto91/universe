import { useState } from 'react'
import { lanzar3Monedas, getInterpretacion, ResultadoMoneda } from '../lib/motores/coinOracle'
import Compartir from '../components/Compartir'
import { llamarGemini } from '../lib/gemini'

export default function CoinOracle() {
  const [monedas, setMonedas] = useState<ResultadoMoneda[]>([])
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'preguntar' | 'resultado'>('preguntar')
  const [pregunta, setPregunta] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const nombre = localStorage.getItem('nombre') || 'viajero'
  const userId = null

  const bgStyle = { backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }

  const lanzar = async () => {
    if (!pregunta.trim()) return
    const resultado = lanzar3Monedas()
    setMonedas(resultado)
    setFase('resultado')
    setCargando(true)
    setErrorMsg('')

    const interpretacionBase = getInterpretacion(resultado)
    const caras = resultado.filter(m => m === 'cara').length
    const cruces = resultado.filter(m => m === 'cruz').length

    const result = await llamarGemini({
      herramienta: 'coin-oracle',
      prompt: `Intérprete de oráculos de monedas.

Nombre: ${nombre}
Pregunta: "${pregunta}"
Resultado: ${resultado.join(', ')} (${caras} cara${caras !== 1 ? 's' : ''}, ${cruces} cru${cruces !== 1 ? 'ces' : 'z'})
Patrón: ${interpretacionBase.titulo} — ${interpretacionBase.mensaje}

2 párrafos: qué dice este patrón en respuesta a la pregunta, perspectiva más profunda. Pregunta de reflexión final. Sin predicciones absolutas.`,
      userId,
      usarLite: true,
      cacheable: false,
      maxTokens: 200,
    })

    if (result.error) setErrorMsg(result.error)
    else setInterpretacion(result.texto)
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />
      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">
        <div className="flex items-center">
          <button onClick={() => { if (fase === 'resultado') setFase('preguntar'); else window.location.href = '/tradiciones' }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Oracle de Monedas</p>
            <p className="text-purple-300 text-xs">Cleromancia · Decisión y flujo</p>
          </div>
        </div>
        {fase === 'preguntar' && (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <p className="text-5xl mb-4">🪙</p>
              <p className="text-white/60 text-sm leading-relaxed">Tres monedas, seis posibles patrones. La aleatoriedad como espejo de la energía presente en tu pregunta.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu pregunta</p>
              <textarea value={pregunta} onChange={e => setPregunta(e.target.value)} placeholder="Formula tu pregunta con claridad..." rows={3} className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30" />
            </div>
            <button onClick={lanzar} disabled={!pregunta.trim()} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40">Lanzar las monedas</button>
          </div>
        )}
        {fase === 'resultado' && (
          <div className="flex flex-col gap-5">
            <div className="flex justify-center gap-6 py-4">
              {monedas.map((m, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-2xl font-bold ${m === 'cara' ? 'border-amber-400 bg-amber-400/10 text-amber-300' : 'border-white/30 bg-white/5 text-white/50'}`}>{m === 'cara' ? '☀' : '☽'}</div>
                  <p className="text-white/50 text-xs capitalize">{m}</p>
                </div>
              ))}
            </div>
            <div className="bg-white/5 border border-purple-500/20 rounded-3xl p-4 backdrop-blur text-center">
              <p className="text-purple-300 font-semibold">{getInterpretacion(monedas).titulo}</p>
              <p className="text-white/60 text-xs mt-1">{getInterpretacion(monedas).mensaje}</p>
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
              ) : errorMsg ? <p className="text-red-400 text-sm">{errorMsg}</p>
              : <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{interpretacion}</p>}
            </div>
            {!cargando && interpretacion && <Compartir titulo={`Oracle de Monedas: ${getInterpretacion(monedas).titulo}`} texto={interpretacion} hashtags={['CoinOracle', 'Universe', 'Cleromancia']} />}
            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">Explorar con mi Guía IA</button>
              <button onClick={() => { setFase('preguntar'); setMonedas([]); setInterpretacion(''); setErrorMsg('') }} className="w-full text-purple-300/60 text-sm py-2">Nueva tirada</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
