import { useState } from 'react'
import { PLANTAS, getPlantaDelDia, getPlantaAleatoria } from '../lib/motores/plantas'
import Compartir from '../components/Compartir'

export default function PlantOracle() {
  const [plantaKey, setPlantaKey] = useState<string | null>(null)
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'elegir' | 'resultado'>('elegir')
  const [situacion, setSituacion] = useState('')
  const nombre = localStorage.getItem('nombre') || 'viajero'
  const plantaDelDia = getPlantaDelDia()

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const consultar = async (key: string) => {
    setPlantaKey(key)
    setFase('resultado')
    setCargando(true)
    const planta = PLANTAS[key]

    const tradicionesTexto = planta.tradiciones.map(t =>
      `${t.nombre}: ${t.significado}`
    ).join('\n')

    const prompt = `Eres un experto en simbolismo de plantas y hierbas en diferentes tradiciones culturales y espirituales del mundo.

Nombre: ${nombre}
${situacion ? `Situación: "${situacion}"` : 'Sin situación específica.'}
Planta: ${planta.simbolo} ${key.charAt(0).toUpperCase() + key.slice(1)}
Keywords: ${planta.keywords}
Propiedades simbólicas: ${planta.propiedades}

Tradiciones:
${tradicionesTexto}

Escribe una interpretación de 3 párrafos para ${nombre}. Primero explora el simbolismo de esta planta en diferentes culturas. Luego conecta ese simbolismo con la situación de ${nombre}. Termina con el mensaje que esta planta trae. Sé poético y respetuoso con las tradiciones. No hagas afirmaciones médicas.`

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
      setInterpretacion('La planta guarda silencio. Inténtalo de nuevo.')
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
            <p className="text-white font-semibold text-sm">Plant Oracle</p>
            <p className="text-purple-300 text-xs">Simbolismo vegetal · Tradiciones del mundo</p>
          </div>
        </div>

        {fase === 'elegir' && (
          <div className="flex flex-col gap-5">

            <div className="bg-white/5 border border-green-500/20 rounded-3xl p-4 backdrop-blur">
              <p className="text-green-400 text-xs tracking-widest uppercase mb-2">Planta del día</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{PLANTAS[plantaDelDia].simbolo}</span>
                <div className="flex-1">
                  <p className="text-white font-semibold capitalize">{plantaDelDia}</p>
                  <p className="text-white/50 text-xs">{PLANTAS[plantaDelDia].keywords}</p>
                </div>
                <button
                  onClick={() => consultar(plantaDelDia)}
                  className="text-green-400 text-xs border border-green-500/30 rounded-full px-3 py-1"
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
                placeholder="¿Qué está pasando en tu vida ahora?"
                rows={2}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {Object.entries(PLANTAS).map(([key, planta]) => (
                <button
                  key={key}
                  onClick={() => consultar(key)}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left hover:bg-green-600/20 hover:border-green-500/40 transition backdrop-blur"
                >
                  <span className="text-2xl block mb-1">{planta.simbolo}</span>
                  <p className="text-white text-sm capitalize font-medium">{key}</p>
                  <p className="text-white/40 text-xs mt-1">{planta.keywords.split(' · ')[0]}</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => consultar(getPlantaAleatoria())}
              className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full hover:bg-white/20 transition"
            >
              El universo elige por mí
            </button>
          </div>
        )}

        {fase === 'resultado' && plantaKey && (
          <div className="flex flex-col gap-5">

            <div className="bg-white/5 border border-green-500/20 rounded-3xl p-6 backdrop-blur flex flex-col items-center gap-3">
              <span className="text-6xl">{PLANTAS[plantaKey].simbolo}</span>
              <p className="text-2xl font-bold capitalize">{plantaKey}</p>
              <p className="text-green-400 text-sm text-center">{PLANTAS[plantaKey].keywords}</p>
              <p className="text-white/50 text-xs text-center">{PLANTAS[plantaKey].propiedades}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">En diferentes tradiciones</p>
              {PLANTAS[plantaKey].tradiciones.map((t, i) => (
                <div key={i} className="mb-3 last:mb-0">
                  <p className="text-white/60 text-xs font-semibold mb-1">{t.nombre}</p>
                  <p className="text-white/70 text-xs leading-relaxed">{t.significado}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu interpretación</p>
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
                titulo={`Plant Oracle: ${plantaKey} ${PLANTAS[plantaKey].simbolo}`}
                texto={interpretacion}
                hashtags={['PlantOracle', 'Universe', 'Plantas', 'Simbolismo']}
              />
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                Explorar con mi Guía IA
              </button>
              <button onClick={() => { setFase('elegir'); setPlantaKey(null); setInterpretacion('') }} className="w-full text-purple-300/60 text-sm py-2">
                Explorar otra planta
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}