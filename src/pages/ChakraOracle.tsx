import { useState } from 'react'
import { CHAKRAS, getChakraDelDia } from '../lib/motores/chakras'
import Compartir from '../components/Compartir'
import { llamarGemini } from '../lib/gemini'

export default function ChakraOracle() {
  const [chakraIdx, setChakraIdx] = useState<number | null>(null)
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'elegir' | 'resultado'>('elegir')
  const [situacion, setSituacion] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const nombre = localStorage.getItem('nombre') || 'viajero'
  const chakraDelDia = getChakraDelDia()
  const userId = null

  const bgStyle = { backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }

  const consultar = async (idx: number) => {
    setChakraIdx(idx)
    setFase('resultado')
    setCargando(true)
    setErrorMsg('')
    const chakra = CHAKRAS[idx]

    const result = await llamarGemini({
      herramienta: 'chakra-oracle',
      prompt: `Experto en chakras (yoga/tradición hindú, adoptado en espiritualidad occidental moderna).

Nombre: ${nombre}
${situacion ? `Situación: "${situacion}"` : ''}
Chakra: ${chakra.nombreEspanol} (${chakra.nombre})
Ubicación: ${chakra.ubicacion} · Elemento: ${chakra.elemento}
Keywords: ${chakra.keywords}
Equilibrado: ${chakra.equilibrado}
Desequilibrado: ${chakra.desequilibrado}

3 párrafos: energía y función del chakra, señales de equilibrio/desequilibrio para ${nombre} ahora, práctica adaptada. Sin diagnósticos médicos.`,
      userId,
      usarLite: false,
      cacheable: false,
      maxTokens: 350,
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
          <button onClick={() => { if (fase === 'resultado') setFase('elegir'); else window.location.href = '/tradiciones' }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Chakra Oracle</p>
            <p className="text-purple-300 text-xs">Sistema de chakras · Tradición hindú</p>
          </div>
        </div>
        {fase === 'elegir' && (
          <div className="flex flex-col gap-5">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Chakra del día</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{chakraDelDia.simbolo}</span>
                <div className="flex-1">
                  <p className="text-white font-semibold">{chakraDelDia.nombreEspanol}</p>
                  <p className="text-white/50 text-xs">{chakraDelDia.keywords}</p>
                </div>
                <button onClick={() => consultar(CHAKRAS.indexOf(chakraDelDia))} className="text-purple-300 text-xs border border-purple-500/30 rounded-full px-3 py-1">Explorar</button>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu situación (opcional)</p>
              <textarea value={situacion} onChange={e => setSituacion(e.target.value)} placeholder="¿Qué área de tu vida quieres explorar?" rows={2} className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30" />
            </div>
            <div className="flex flex-col gap-2">
              {CHAKRAS.map((chakra, idx) => (
                <button key={idx} onClick={() => consultar(idx)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-left hover:bg-white/10 transition backdrop-blur flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ backgroundColor: chakra.color + '30', border: `2px solid ${chakra.color}60` }}>
                    <span>{chakra.numero}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{chakra.nombreEspanol}</p>
                    <p className="text-white/40 text-xs">{chakra.keywords.split(' · ').slice(0, 2).join(' · ')}</p>
                  </div>
                  <span className="ml-auto text-purple-300/50">›</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {fase === 'resultado' && chakraIdx !== null && (
          <div className="flex flex-col gap-5">
            <div className="bg-white/5 border rounded-3xl p-6 backdrop-blur flex flex-col items-center gap-3" style={{ borderColor: CHAKRAS[chakraIdx].color + '40' }}>
              <span className="text-6xl">{CHAKRAS[chakraIdx].simbolo}</span>
              <p className="text-2xl font-bold">{CHAKRAS[chakraIdx].nombreEspanol}</p>
              <p className="text-sm" style={{ color: CHAKRAS[chakraIdx].color }}>{CHAKRAS[chakraIdx].nombre}</p>
              <p className="text-white/50 text-xs text-center">{CHAKRAS[chakraIdx].ubicacion} · {CHAKRAS[chakraIdx].elemento}</p>
              <p className="text-white/60 text-xs text-center">{CHAKRAS[chakraIdx].keywords}</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
                <p className="text-green-400 text-xs tracking-widest uppercase mb-2">Equilibrado</p>
                <p className="text-white/70 text-xs leading-relaxed">{CHAKRAS[chakraIdx].equilibrado}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
                <p className="text-red-400 text-xs tracking-widest uppercase mb-2">Desequilibrado</p>
                <p className="text-white/70 text-xs leading-relaxed">{CHAKRAS[chakraIdx].desequilibrado}</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu lectura</p>
              {cargando ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : errorMsg ? <p className="text-red-400 text-sm">{errorMsg}</p>
              : <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{interpretacion}</p>}
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Práctica</p>
              <p className="text-white/70 text-sm leading-relaxed">{CHAKRAS[chakraIdx].practica}</p>
            </div>
            {!cargando && interpretacion && <Compartir titulo={`Chakra Oracle: ${CHAKRAS[chakraIdx].nombreEspanol}`} texto={interpretacion} hashtags={['ChakraOracle', 'Universe', 'Chakras', 'Hinduismo']} />}
            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">Explorar con mi Guía IA</button>
              <button onClick={() => { setFase('elegir'); setChakraIdx(null); setInterpretacion(''); setErrorMsg('') }} className="w-full text-purple-300/60 text-sm py-2">Explorar otro chakra</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
