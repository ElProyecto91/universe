import { useState } from 'react'
import { seleccionarPiedras, PIEDRAS } from '../lib/motores/lithomancy'
import Compartir from '../components/Compartir'
import { llamarGemini } from '../lib/gemini'

export default function Lithomancy() {
  const [piedras, setPiedras] = useState<any[]>([])
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'elegir' | 'resultado'>('elegir')
  const [pregunta, setPregunta] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const nombre = localStorage.getItem('nombre') || 'viajero'
  const userId = null

  const bgStyle = { backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }

  const lanzar = async () => {
    const seleccionadas = seleccionarPiedras(3)
    setPiedras(seleccionadas)
    setFase('resultado')
    setCargando(true)
    setErrorMsg('')

    const descripcion = seleccionadas.map((p, i) => `Piedra ${i + 1}: ${p.nombre} — ${p.keywords}`).join('\n')

    const result = await llamarGemini({
      herramienta: 'lithomancy',
      prompt: `Experto en litomancia — adivinación mediante piedras y cristales.

Nombre: ${nombre}
${pregunta ? `Pregunta: "${pregunta}"` : 'Lectura general.'}
Piedras:
${descripcion}

2-3 párrafos: energía de cada piedra, conexión entre las tres y con la situación de ${nombre}, consejo concreto final.`,
      userId, usarLite: false, cacheable: false, maxTokens: 350,
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
          <button onClick={() => window.location.href = '/tradiciones'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Litomancia</p>
            <p className="text-purple-300 text-xs">Oracle de piedras y cristales</p>
          </div>
        </div>
        {fase === 'elegir' && (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <p className="text-5xl mb-4">💎</p>
              <p className="text-white/60 text-sm leading-relaxed">La litomancia interpreta el simbolismo de las piedras. Cada cristal lleva una energía y un mensaje. Tres piedras serán seleccionadas para ti.</p>
            </div>
            <div className="flex gap-3 flex-wrap justify-center py-2">
              {PIEDRAS.slice(0, 6).map(p => <div key={p.nombre} className="w-8 h-8 rounded-full opacity-70" style={{ backgroundColor: p.hex }} />)}
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Pregunta (opcional)</p>
              <textarea value={pregunta} onChange={e => setPregunta(e.target.value)} placeholder="¿Qué quieres explorar? Puedes dejarlo en blanco para una lectura general." rows={3} className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30" />
            </div>
            <button onClick={lanzar} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">Lanzar las piedras</button>
          </div>
        )}
        {fase === 'resultado' && (
          <div className="flex flex-col gap-5">
            <div className="flex gap-4 justify-center py-4">
              {piedras.map((p, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-lg" style={{ backgroundColor: p.hex, boxShadow: `0 0 20px ${p.hex}60` }}>{p.nombre.substring(0, 2)}</div>
                  <p className="text-white text-xs font-medium text-center max-w-20">{p.nombre}</p>
                  <p className="text-white/40 text-xs text-center max-w-20">{p.keywords.split(' · ')[0]}</p>
                </div>
              ))}
            </div>
            {pregunta && <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur"><p className="text-white/40 text-xs">Pregunta: <span className="text-white/70 italic">"{pregunta}"</span></p></div>}
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
            {!cargando && interpretacion && <Compartir titulo={`Mi lectura de piedras: ${piedras.map(p => p.nombre).join(', ')}`} texto={interpretacion} hashtags={['Litomancia', 'Universe', 'Cristales', 'Piedras']} />}
            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">Explorar con mi Guía IA</button>
              <button onClick={() => { setFase('elegir'); setPiedras([]); setInterpretacion(''); setErrorMsg('') }} className="w-full text-purple-300/60 text-sm py-2">Nueva lectura</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
