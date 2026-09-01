import { useState } from 'react'
import { LINEAS_MANO, MONTES_MANO } from '../lib/motores/palmisteria'
import Compartir from '../components/Compartir'

export default function Palmisteria() {
  const [lineaSeleccionada, setLineaSeleccionada] = useState<string | null>(null)
  const [respuestas, setRespuestas] = useState<Record<string, string>>({})
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'intro' | 'lineas' | 'resultado'>('intro')
  const [vista, setVista] = useState<'lineas' | 'montes'>('lineas')

  const nombre = localStorage.getItem('nombre') || 'viajero'

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const seleccionarInterpretacion = (lineaId: string, tipo: string) => {
    const nuevas = { ...respuestas, [lineaId]: tipo }
    setRespuestas(nuevas)
  }

  const generarLectura = async () => {
    setFase('resultado')
    setCargando(true)

    const descripcion = Object.entries(respuestas).map(([id, tipo]) => {
      const linea = LINEAS_MANO.find(l => l.id === id)
      const interp = linea?.interpretaciones.find(i => i.tipo === tipo)
      return `${linea?.nombre}: ${tipo} — ${interp?.significado}`
    }).join('\n')

    const prompt = `Eres un experto en quiromancia — el arte de la lectura de la mano presente en múltiples tradiciones culturales.

Nombre: ${nombre}
Descripción de las líneas de la mano:
${descripcion}

Escribe una lectura quiromántica de 3-4 párrafos para ${nombre}.
Primero describe la energía general que revelan sus líneas combinadas.
Luego profundiza en cada línea y lo que dice sobre esa área de vida.
Conecta las líneas entre sí — ¿hay armonía o tensión entre ellas?
Termina con el mensaje más importante que sus manos tienen para él/ella ahora.
Nota: La quiromancia es una práctica de reflexión simbólica con raíces históricas en muchas culturas. No es una predicción literal.`

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
      setInterpretacion('Las líneas guardan silencio. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => {
            if (fase === 'resultado') setFase('lineas')
            else window.location.href = '/tradiciones'
          }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Palmistería</p>
            <p className="text-purple-300 text-xs">Lectura de la mano · Tradiciones del mundo</p>
          </div>
        </div>

        {fase === 'intro' && (
          <div className="flex flex-col gap-6">
            <div className="bg-white/8 border border-white/20 rounded-3xl p-5 backdrop-blur text-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-7xl mb-4">🤚</p>
              <p className="text-white/70 text-sm leading-relaxed">
                La quiromancia es el arte de leer las líneas y montes de la mano. Presente en tradiciones de la India, China, Roma, Grecia y el mundo árabe durante milenios. No predice el futuro — refleja la energía y el carácter.
              </p>
            </div>

            <div className="bg-white/8 border border-white/20 rounded-3xl p-5 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Antes de empezar</p>
              <p className="text-white/70 text-sm mb-2">• Usa tu mano dominante (con la que escribes)</p>
              <p className="text-white/70 text-sm mb-2">• Abre la palma completamente bajo buena luz</p>
              <p className="text-white/70 text-sm">• Observa con curiosidad, sin buscar lo que quieres ver</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setFase('lineas'); setVista('lineas') }}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full"
              >
                Leer mis líneas
              </button>
              <button
                onClick={() => { setFase('lineas'); setVista('montes') }}
                className="flex-1 bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full"
              >
                Ver montes
              </button>
            </div>
          </div>
        )}

        {fase === 'lineas' && (
          <div className="flex flex-col gap-5">

            <div className="flex gap-2 bg-white/10 rounded-2xl p-1">
              <button
                onClick={() => setVista('lineas')}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${vista === 'lineas' ? 'bg-purple-600 text-white' : 'text-white/50'}`}
              >
                Líneas
              </button>
              <button
                onClick={() => setVista('montes')}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${vista === 'montes' ? 'bg-purple-600 text-white' : 'text-white/50'}`}
              >
                Montes
              </button>
            </div>

            {vista === 'montes' && (
              <div className="flex flex-col gap-3">
                {MONTES_MANO.map(monte => (
                  <div key={monte.nombre} className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur"
                    style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-semibold text-sm">{monte.nombre}</p>
                      <span className="text-purple-300 text-xs">{monte.planeta}</span>
                    </div>
                    <p className="text-white/50 text-xs mb-1">{monte.ubicacion}</p>
                    <p className="text-white/70 text-xs leading-relaxed">{monte.significado}</p>
                  </div>
                ))}
              </div>
            )}

            {vista === 'lineas' && (
              <>
                {LINEAS_MANO.map(linea => (
                  <div key={linea.id} className="bg-white/8 border border-white/20 rounded-3xl p-5 backdrop-blur"
                    style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderColor: lineaSeleccionada === linea.id ? 'rgba(192,132,252,0.5)' : undefined }}>
                    <button
                      onClick={() => setLineaSeleccionada(lineaSeleccionada === linea.id ? null : linea.id)}
                      className="w-full text-left"
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-white font-bold">{linea.nombre}</p>
                        <span className="text-purple-300">{lineaSeleccionada === linea.id ? '↑' : '↓'}</span>
                      </div>
                      <p className="text-white/50 text-xs mt-1">{linea.ubicacion}</p>
                      {respuestas[linea.id] && (
                        <p className="text-purple-300 text-xs mt-1">✓ {respuestas[linea.id]}</p>
                      )}
                    </button>

                    {lineaSeleccionada === linea.id && (
                      <div className="mt-4">
                        <p className="text-white/60 text-xs mb-3 leading-relaxed">{linea.descripcion}</p>
                        <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">¿Cómo es la tuya?</p>
                        <div className="flex flex-col gap-2">
                          {linea.interpretaciones.map(interp => (
                            <button
                              key={interp.tipo}
                              onClick={() => seleccionarInterpretacion(linea.id, interp.tipo)}
                              className={`text-left p-3 rounded-xl border text-xs transition ${respuestas[linea.id] === interp.tipo ? 'bg-purple-600/40 border-purple-400 text-white' : 'border-white/20 text-white/70 hover:border-purple-500/40'}`}
                              style={{ backgroundColor: respuestas[linea.id] === interp.tipo ? undefined : 'rgba(255,255,255,0.05)' }}
                            >
                              <p className="font-semibold mb-0.5">{interp.tipo}</p>
                              <p className="text-white/50">{interp.significado}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {Object.keys(respuestas).length >= 2 && (
                  <button
                    onClick={generarLectura}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
                  >
                    Generar mi lectura de mano
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {fase === 'resultado' && (
          <div className="flex flex-col gap-5">

            <div className="bg-white/8 border border-white/20 rounded-3xl p-6 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu lectura de mano</p>
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
                titulo="Mi lectura de palmistería"
                texto={interpretacion}
                hashtags={['Palmisteria', 'Universe', 'Quiromancia', 'LecturaDeMano']}
              />
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                Explorar con mi Guía IA
              </button>
              <button onClick={() => { setFase('intro'); setRespuestas({}); setLineaSeleccionada(null); setInterpretacion('') }} className="w-full text-purple-300/60 text-sm py-2">
                Nueva lectura
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}