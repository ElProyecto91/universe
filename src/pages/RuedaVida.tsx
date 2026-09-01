import { useState } from 'react'
import { AREAS_RUEDA, calcularRueda } from '../lib/motores/ruedaVida'
import Compartir from '../components/Compartir'

export default function RuedaVida() {
  const [puntuaciones, setPuntuaciones] = useState<Record<string, number>>({})
  const [areaActual, setAreaActual] = useState(0)
  const [fase, setFase] = useState<'evaluacion' | 'resultado'>('evaluacion')
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)

  const nombre = localStorage.getItem('nombre') || 'viajero'

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const puntuar = (area: string, valor: number) => {
    const nuevas = { ...puntuaciones, [area]: valor }
    setPuntuaciones(nuevas)

    if (areaActual < AREAS_RUEDA.length - 1) {
      setTimeout(() => setAreaActual(a => a + 1), 300)
    } else {
      completar(nuevas)
    }
  }

  const completar = async (pts: Record<string, number>) => {
    setFase('resultado')
    setCargando(true)
    const { areas, promedio, masBaja, masAlta } = calcularRueda(pts)

    const resumen = areas.map(a => `${a.nombre}: ${a.puntuacion}/10`).join(', ')

    const prompt = `Eres un coach espiritual y de vida que combina psicología positiva con perspectiva astrológica y espiritual.

Nombre: ${nombre}
Rueda de la Vida — resultados:
${resumen}
Promedio general: ${promedio}/10
Área más baja: ${masBaja.nombre} (${masBaja.puntuacion}/10)
Área más alta: ${masAlta.nombre} (${masAlta.puntuacion}/10)

Escribe un análisis de la Rueda de la Vida de 4 párrafos para ${nombre}.
Primero describe el panorama general — cómo se ve la rueda y qué dice sobre la vida actual.
Luego profundiza en el área más baja — qué podría estar pasando y qué necesita atención.
Después celebra el área más alta — cuál es la fortaleza principal y cómo puede servir de apoyo.
Termina con 3 acciones concretas y específicas que ${nombre} puede tomar esta semana para empezar a equilibrar su rueda.
Sé honesto, compasivo y práctico.`

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
      setInterpretacion('El universo guarda silencio. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  const { areas, promedio, masBaja, masAlta } = calcularRueda(puntuaciones)

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => window.location.href = '/tradiciones'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Rueda de la Vida</p>
            <p className="text-purple-300 text-xs">8 áreas · Perspectiva espiritual</p>
          </div>
        </div>

        {fase === 'evaluacion' && (
          <div className="flex flex-col gap-6">

            {/* Progreso */}
            <div className="flex gap-1">
              {AREAS_RUEDA.map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < areaActual ? 'bg-purple-400' : i === areaActual ? 'bg-purple-600' : 'bg-white/20'}`} />
              ))}
            </div>

            {/* Área actual */}
            <div className="bg-white/8 border border-white/20 rounded-3xl p-6 backdrop-blur text-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderColor: AREAS_RUEDA[areaActual].color + '40' }}>
              <p className="text-4xl mb-2">{AREAS_RUEDA[areaActual].simbolo}</p>
              <p className="text-xl font-bold mb-1">{AREAS_RUEDA[areaActual].nombre}</p>
              <p className="text-white/50 text-xs mb-4">{AREAS_RUEDA[areaActual].perspectiva}</p>
              <p className="text-white/70 text-sm leading-relaxed">
                {AREAS_RUEDA[areaActual].preguntas[0]}
              </p>
            </div>

            {/* Escala */}
            <div className="flex flex-col gap-3">
              <p className="text-white/60 text-xs text-center">¿Cómo puntuarías esta área de tu vida? (1 = muy insatisfecho, 10 = plena satisfacción)</p>
              <div className="flex gap-2 flex-wrap justify-center">
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <button
                    key={n}
                    onClick={() => puntuar(AREAS_RUEDA[areaActual].id, n)}
                    className="w-12 h-12 rounded-full border-2 font-bold text-sm transition hover:scale-110 active:scale-95"
                    style={{
                      borderColor: n <= 3 ? '#ef4444' : n <= 6 ? '#f59e0b' : '#22c55e',
                      color: n <= 3 ? '#ef4444' : n <= 6 ? '#f59e0b' : '#22c55e',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {fase === 'resultado' && (
          <div className="flex flex-col gap-5">

            {/* Rueda visual */}
            <div className="bg-white/8 border border-white/20 rounded-3xl p-5 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-4">Tu Rueda de la Vida</p>
              <div className="flex flex-col gap-2">
                {areas.map(area => (
                  <div key={area.id} className="flex items-center gap-3">
                    <span className="text-lg w-6">{area.simbolo}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <p className="text-white/70 text-xs">{area.nombre}</p>
                        <p className="text-white font-bold text-xs">{area.puntuacion}/10</p>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{ width: `${area.puntuacion * 10}%`, backgroundColor: area.color }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 mt-4 pt-4 flex justify-between">
                <span className="text-white/50 text-xs">Promedio general</span>
                <span className="text-white font-bold">{promedio}/10</span>
              </div>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-500/15 border border-green-500/30 rounded-2xl p-4 backdrop-blur">
                <p className="text-green-400 text-xs tracking-widest uppercase mb-1">Fortaleza</p>
                <p className="text-white font-semibold text-sm">{masAlta.nombre}</p>
                <p className="text-green-300 text-xs">{masAlta.puntuacion}/10</p>
              </div>
              <div className="bg-amber-500/15 border border-amber-500/30 rounded-2xl p-4 backdrop-blur">
                <p className="text-amber-400 text-xs tracking-widest uppercase mb-1">Atención</p>
                <p className="text-white font-semibold text-sm">{masBaja.nombre}</p>
                <p className="text-amber-300 text-xs">{masBaja.puntuacion}/10</p>
              </div>
            </div>

            {/* Interpretación IA */}
            <div className="bg-white/8 border border-white/20 rounded-3xl p-6 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu análisis</p>
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
                titulo="Mi Rueda de la Vida espiritual"
                texto={`Área más desarrollada: ${masAlta.nombre} (${masAlta.puntuacion}/10)\nÁrea a trabajar: ${masBaja.nombre} (${masBaja.puntuacion}/10)\n\n${interpretacion}`}
                hashtags={['RuedaDeLaVida', 'Universe', 'Crecimiento', 'Coaching']}
              />
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                Explorar con mi Guía IA
              </button>
              <button onClick={() => { setFase('evaluacion'); setAreaActual(0); setPuntuaciones({}); setInterpretacion('') }} className="w-full text-purple-300/60 text-sm py-2">
                Repetir evaluación
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}