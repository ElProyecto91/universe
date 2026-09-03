import { useState } from 'react'
import Compartir from '../components/Compartir'
import { llamarGemini } from '../lib/gemini'

export default function OracleMix() {
  const [pregunta, setPregunta] = useState('')
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'preguntar' | 'resultado'>('preguntar')
  const [errorMsg, setErrorMsg] = useState('')
  const nombre = localStorage.getItem('nombre') || 'viajero'
  const signo = localStorage.getItem('signo') || 'Leo'
  const userId = null
  const bgStyle = { backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }

  const consultar = async () => {
    if (!pregunta.trim()) return
    setFase('resultado')
    setCargando(true)
    setErrorMsg('')
    const result = await llamarGemini({
      herramienta: 'oracle-mix',
      prompt: `Experto en Oracle Mix. Nombre: ${nombre}, Signo: ${signo}. Situación o pregunta: "${pregunta}". 3 párrafos reflexivos y simbólicos. Sin predicciones absolutas.`,
      userId, usarLite: false, cacheable: false, maxTokens: 400,
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
            <p className="text-white font-semibold text-sm">Oracle Mix</p>
            <p className="text-purple-300 text-xs">Combinación de tradiciones</p>
          </div>
        </div>
        {fase === 'preguntar' && (
          <div className="flex flex-col gap-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu pregunta o situación</p>
              <textarea value={pregunta} onChange={e => setPregunta(e.target.value)} placeholder="¿Qué quieres explorar?" rows={4} className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30" />
            </div>
            <button onClick={consultar} disabled={!pregunta.trim()} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full disabled:opacity-40">Consultar</button>
          </div>
        )}
        {fase === 'resultado' && (
          <div className="flex flex-col gap-5">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur"><p className="text-white/40 text-xs italic">"{pregunta}"</p></div>
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
            {!cargando && interpretacion && <Compartir titulo="Oracle Mix" texto={interpretacion} hashtags={['Universe', 'OracleMix']} />}
            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">Explorar con mi Guía IA</button>
              <button onClick={() => { setFase('preguntar'); setInterpretacion(''); setErrorMsg('') }} className="w-full text-purple-300/60 text-sm py-2">Nueva consulta</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
