import { useState } from 'react'
import { ELEMENTOS, getElementoDelDia } from '../lib/motores/elementos'
import Compartir from '../components/Compartir'

type ElementoKey = keyof typeof ELEMENTOS

export default function ElementOracle() {
  const [elementoKey, setElementoKey] = useState<ElementoKey | null>(null)
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'elegir' | 'resultado'>('elegir')
  const [pregunta, setPregunta] = useState('')
  const nombre = localStorage.getItem('nombre') || 'viajero'
  const elementoDelDia = getElementoDelDia()

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const consultar = async (key: ElementoKey) => {
    setElementoKey(key)
    setFase('resultado')
    setCargando(true)
    const elemento = ELEMENTOS[key]

    const tradicionesTexto = elemento.tradiciones.map(t =>
      `${t.nombre}: ${t.texto}`
    ).join('\n')

    const prompt = `Eres un guía experto en simbolismo elemental y su presencia en diferentes tradiciones espirituales del mundo.

Nombre: ${nombre}
${pregunta ? `Pregunta/situación: "${pregunta}"` : 'Sin pregunta específica — lectura general del elemento.'}
Elemento: ${elemento.nombre} ${elemento.simbolo}
Keywords: ${elemento.keywords}
Luz: ${elemento.luz}
Sombra: ${elemento.sombra}

Tradiciones:
${tradicionesTexto}

Escribe una lectura elemental de 3 párrafos para ${nombre}. Primero explora la energía de este elemento y lo que significa cuando aparece. Luego conecta con la situación de ${nombre} — qué aspecto del elemento está presente ahora, en luz o en sombra. Termina con la práctica sugerida adaptada a ${nombre}. Sé poético y concreto a la vez.`

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
      setInterpretacion('El elemento guarda silencio. Inténtalo de nuevo.')
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
            <p className="text-white font-semibold text-sm">Oracle Elemental</p>
            <p className="text-purple-300 text-xs">Los cinco elementos · Tradiciones del mundo</p>
          </div>
        </div>

        {fase === 'elegir' && (
          <div className="flex flex-col gap-5">

            <div className="bg-white/5 border border-purple-500/20 rounded-3xl p-4 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-1">Elemento del día</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{ELEMENTOS[elementoDelDia].simbolo}</span>
                <div>
                  <p className="text-white font-semibold">{ELEMENTOS[elementoDelDia].nombre}</p>
                  <p className="text-white/50 text-xs">{ELEMENTOS[elementoDelDia].keywords}</p>
                </div>
                <button
                  onClick={() => consultar(elementoDelDia)}
                  className="ml-auto text-purple-300 text-xs border border-purple-500/30 rounded-full px-3 py-1"
                >
                  Explorar
                </button>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu situación (opcional)</p>
              <textarea
                value={pregunta}
                onChange={e => setPregunta(e.target.value)}
                placeholder="¿Qué quieres explorar desde la energía elemental?"
                rows={2}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30"
              />
            </div>

            <div className="flex flex-col gap-3">
              {(Object.keys(ELEMENTOS) as ElementoKey[]).map(key => {
                const e = ELEMENTOS[key]
                return (
                  <button
                    key={key}
                    onClick={() => consultar(key)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-left hover:bg-white/10 transition backdrop-blur flex items-center gap-4"
                  >
                    <span className="text-3xl">{e.simbolo}</span>
                    <div>
                      <p className="text-white font-semibold">{e.nombre}</p>
                      <p className="text-white/40 text-xs">{e.keywords}</p>
                    </div>
                    <span className="ml-auto text-purple-300/50">›</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {fase === 'resultado' && elementoKey && (
          <div className="flex flex-col gap-5">

            <div
              className="bg-white/5 border rounded-3xl p-6 backdrop-blur flex flex-col items-center gap-3"
              style={{ borderColor: ELEMENTOS[elementoKey].color + '40' }}
            >
              <span className="text-6xl">{ELEMENTOS[elementoKey].simbolo}</span>
              <p className="text-2xl font-bold">{ELEMENTOS[elementoKey].nombre}</p>
              <p className="text-sm text-center" style={{ color: ELEMENTOS[elementoKey].color }}>{ELEMENTOS[elementoKey].keywords}</p>
              <p className="text-white/60 text-xs text-center leading-relaxed">{ELEMENTOS[elementoKey].descripcion}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
                <p className="text-green-400 text-xs tracking-widest uppercase mb-2">Luz</p>
                <p className="text-white/70 text-xs leading-relaxed">{ELEMENTOS[elementoKey].luz}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
                <p className="text-red-400 text-xs tracking-widest uppercase mb-2">Sombra</p>
                <p className="text-white/70 text-xs leading-relaxed">{ELEMENTOS[elementoKey].sombra}</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu lectura elemental</p>
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
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Práctica sugerida</p>
              <p className="text-white/70 text-sm leading-relaxed">{ELEMENTOS[elementoKey].practica}</p>
            </div>

            {!cargando && interpretacion && (
              <Compartir
                titulo={`Mi Oracle Elemental: ${ELEMENTOS[elementoKey].nombre} ${ELEMENTOS[elementoKey].simbolo}`}
                texto={interpretacion}
                hashtags={['ElementOracle', 'Universe', ELEMENTOS[elementoKey].nombre, 'Elementos']}
              />
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                Explorar con mi Guía IA
              </button>
              <button onClick={() => { setFase('elegir'); setInterpretacion('') }} className="w-full text-purple-300/60 text-sm py-2">
                Explorar otro elemento
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}