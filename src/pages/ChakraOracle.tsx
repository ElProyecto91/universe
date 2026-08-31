import { useState } from 'react'
import { CHAKRAS, getChakraDelDia } from '../lib/motores/chakras'
import Compartir from '../components/Compartir'

export default function ChakraOracle() {
  const [chakraIdx, setChakraIdx] = useState<number | null>(null)
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'elegir' | 'resultado'>('elegir')
  const [situacion, setSituacion] = useState('')
  const nombre = localStorage.getItem('nombre') || 'viajero'
  const chakraDelDia = getChakraDelDia()

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const consultar = async (idx: number) => {
    setChakraIdx(idx)
    setFase('resultado')
    setCargando(true)
    const chakra = CHAKRAS[idx]

    const prompt = `Eres un experto en el sistema de chakras del yoga y la tradición hindú, con conocimiento de cómo este sistema ha sido adoptado en espiritualidad occidental moderna.

Nombre: ${nombre}
${situacion ? `Situación: "${situacion}"` : 'Sin situación específica.'}
Chakra: ${chakra.nombreEspanol} (${chakra.nombre})
Ubicación: ${chakra.ubicacion}
Keywords: ${chakra.keywords}
Elemento: ${chakra.elemento}
Equilibrado: ${chakra.equilibrado}
Desequilibrado: ${chakra.desequilibrado}

Escribe una lectura de chakra de 3 párrafos para ${nombre}. Primero describe la energía de este chakra y qué gobierna. Luego explora si este chakra podría estar necesitando atención en la vida de ${nombre} ahora mismo — señales de equilibrio o desequilibrio. Termina con la práctica sugerida adaptada a ${nombre}. No hagas diagnósticos médicos. El sistema de chakras es una herramienta de autoconocimiento espiritual de origen hindú.`

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
      setInterpretacion('El chakra guarda silencio. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => {
            if (fase === 'resultado') setFase('elegir')
            else window.location.href = '/tradiciones'
          }} className="text-purple-300 text-sm">← Volver</button>
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
                <button
                  onClick={() => consultar(CHAKRAS.indexOf(chakraDelDia))}
                  className="text-purple-300 text-xs border border-purple-500/30 rounded-full px-3 py-1"
                >
                  Explorar
                </button>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu situación (opcional)</p>
              <textarea
                value={situacion}
                onChange={e => setSituacion(e.target.value)}
                placeholder="¿Qué área de tu vida quieres explorar?"
                rows={2}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30"
              />
            </div>

            <div className="flex flex-col gap-2">
              {CHAKRAS.map((chakra, idx) => (
                <button
                  key={idx}
                  onClick={() => consultar(idx)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-left hover:bg-white/10 transition backdrop-blur flex items-center gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                    style={{ backgroundColor: chakra.color + '30', border: `2px solid ${chakra.color}60` }}
                  >
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
            const chakra = CHAKRAS[chakraIdx]

            <div
              className="bg-white/5 border rounded-3xl p-6 backdrop-blur flex flex-col items-center gap-3"
              style={{ borderColor: CHAKRAS[chakraIdx].color + '40' }}
            >
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
              ) : (
                <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{interpretacion}</p>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Práctica</p>
              <p className="text-white/70 text-sm leading-relaxed">{CHAKRAS[chakraIdx].practica}</p>
            </div>

            {!cargando && interpretacion && (
              <Compartir
                titulo={`Chakra Oracle: ${CHAKRAS[chakraIdx].nombreEspanol}`}
                texto={interpretacion}
                hashtags={['ChakraOracle', 'Universe', 'Chakras', 'Hinduismo']}
              />
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                Explorar con mi Guía IA
              </button>
              <button onClick={() => { setFase('elegir'); setChakraIdx(null); setInterpretacion('') }} className="w-full text-purple-300/60 text-sm py-2">
                Explorar otro chakra
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}