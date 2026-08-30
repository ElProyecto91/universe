import { useState } from 'react'

const pasos = [
  { id: 1, pregunta: "¿Cómo te llamas?", placeholder: "Tu nombre", tipo: "text" },
  { id: 2, pregunta: "¿Cuándo naciste?", placeholder: "", tipo: "date" },
  { id: 3, pregunta: "¿Dónde naciste?", placeholder: "Tu ciudad", tipo: "text" },
  { id: 4, pregunta: "¿Sabes tu hora de nacimiento?", placeholder: "HH:MM (opcional)", tipo: "time" },
]

const intenciones = [
  { emoji: "❤️", label: "Amor" },
  { emoji: "💼", label: "Trabajo" },
  { emoji: "💰", label: "Dinero" },
  { emoji: "🌱", label: "Crecimiento personal" },
  { emoji: "🔮", label: "Espiritualidad" },
  { emoji: "🌙", label: "Solo tengo curiosidad" },
]

export default function Onboarding() {
  const [paso, setPaso] = useState(1)
  const [data, setData] = useState({ nombre: '', fechaNacimiento: '', ciudad: '', horaNacimiento: '', intencion: '' })

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const siguiente = () => setPaso(p => p + 1)

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center px-6 relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative z-10 w-full max-w-sm">

        {/* Progreso */}
        <div className="flex gap-2 mb-10">
          {[1,2,3,4,5].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= paso ? 'bg-purple-400' : 'bg-white/20'}`} />
          ))}
        </div>

        {/* Pasos 1-4 */}
        {paso <= 4 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
              {pasos[paso - 1].pregunta}
            </h2>

            {pasos[paso - 1].tipo === 'date' ? (
              <input
                type="date"
                className="w-full bg-white/10 border border-white/30 rounded-2xl px-4 py-4 text-white text-center text-lg backdrop-blur outline-none focus:border-purple-400"
                onChange={e => setData(d => ({ ...d, fechaNacimiento: e.target.value }))}
              />
            ) : pasos[paso - 1].tipo === 'time' ? (
              <input
                type="time"
                className="w-full bg-white/10 border border-white/30 rounded-2xl px-4 py-4 text-white text-center text-lg backdrop-blur outline-none focus:border-purple-400"
                onChange={e => setData(d => ({ ...d, horaNacimiento: e.target.value }))}
              />
            ) : (
              <input
                type="text"
                placeholder={pasos[paso - 1].placeholder}
                className="w-full bg-white/10 border border-white/30 rounded-2xl px-4 py-4 text-white text-center text-lg backdrop-blur outline-none focus:border-purple-400 placeholder-white/40"
                onChange={e => {
                  if (paso === 1) setData(d => ({ ...d, nombre: e.target.value }))
                  if (paso === 3) setData(d => ({ ...d, ciudad: e.target.value }))
                }}
              />
            )}

            <button
              onClick={siguiente}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full text-lg hover:opacity-90 transition"
            >
              Continuar
            </button>

            {paso === 4 && (
              <button onClick={siguiente} className="text-white/50 text-sm text-center">
                Omitir — no sé mi hora de nacimiento
              </button>
            )}
          </div>
        )}

        {/* Paso 5 — Intención */}
        {paso === 5 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
              ¿Qué te trae aquí?
            </h2>

            <div className="flex flex-col gap-3">
              {intenciones.map(i => (
                <button
                  key={i.label}
                  onClick={() => {
                    setData(d => ({ ...d, intencion: i.label }))
                    window.location.href = '/universo'
                  }}
                  className="w-full bg-white/10 border border-white/30 backdrop-blur rounded-2xl px-4 py-4 text-left text-white hover:bg-white/20 transition flex items-center gap-3 text-lg"
                >
                  <span>{i.emoji}</span>
                  <span>{i.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}