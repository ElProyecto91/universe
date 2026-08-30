import { useState } from 'react'

const pasos = [
  { id: 1, pregunta: "¿Cómo te llamas?", placeholder: "Tu nombre", tipo: "text", campo: "nombre" },
  { id: 2, pregunta: "¿Cuándo naciste?", placeholder: "", tipo: "date", campo: "fechaNacimiento" },
  { id: 3, pregunta: "¿Dónde naciste?", placeholder: "Tu ciudad", tipo: "text", campo: "ciudad" },
  { id: 4, pregunta: "¿Sabes tu hora de nacimiento?", placeholder: "HH:MM (opcional)", tipo: "time", campo: "horaNacimiento" },
]

const preguntasEspeciales = [
  {
    id: 5,
    pregunta: "¿Qué te trae aquí?",
    campo: "intencion",
    opciones: ["❤️ Amor", "💼 Trabajo", "💰 Dinero", "🌱 Crecimiento personal", "🔮 Espiritualidad", "🌙 Solo tengo curiosidad"]
  },
  {
    id: 6,
    pregunta: "¿Con qué elemento conectas más?",
    campo: "elemento",
    opciones: ["🔥 Fuego — Pasión y acción", "🌊 Agua — Emoción y fluidez", "🌍 Tierra — Estabilidad y calma", "💨 Aire — Pensamiento y libertad"]
  },
  {
    id: 7,
    pregunta: "¿Qué animal sientes que te representa?",
    campo: "animal",
    opciones: ["🦁 León — Valentía", "🦋 Mariposa — Transformación", "🦅 Águila — Visión", "🐺 Lobo — Intuición", "🐬 Delfín — Sabiduría", "🦊 Zorro — Astucia", "🐉 Dragón — Poder", "🦉 Búho — Conocimiento"]
  },
  {
    id: 8,
    pregunta: "¿Cómo tomas tus decisiones importantes?",
    campo: "decision",
    opciones: ["🧠 Con la razón siempre", "❤️ Con el corazón siempre", "⚖️ Equilibrando ambos", "🔮 Sigo mi intuición"]
  },
]

const totalPasos = pasos.length + preguntasEspeciales.length

export default function Onboarding() {
  const [paso, setPaso] = useState(1)
  const [valor, setValor] = useState('')
  const [data, setData] = useState<Record<string, string>>({})

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const guardarYseguir = (v?: string) => {
    const val = v ?? valor
    const campo = paso <= pasos.length
      ? pasos[paso - 1].campo
      : preguntasEspeciales[paso - pasos.length - 1].campo
    setData(d => ({ ...d, [campo]: val }))
    setValor('')
    if (paso < totalPasos) {
      setPaso(p => p + 1)
    } else {
      window.location.href = '/universo'
    }
  }

  const pasoActual = paso <= pasos.length
    ? pasos[paso - 1]
    : preguntasEspeciales[paso - pasos.length - 1]

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center px-6 relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative z-10 w-full max-w-sm">

        {/* Progreso */}
        <div className="flex gap-1 mb-10">
          {Array.from({ length: totalPasos }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${i < paso ? 'bg-purple-400' : 'bg-white/20'}`}
            />
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-center mb-8" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
          {pasoActual.pregunta}
        </h2>

        {/* Inputs texto/fecha/hora */}
        {'tipo' in pasoActual && (
          <div className="flex flex-col gap-4">
            <input
              key={paso}
              type={pasoActual.tipo}
              placeholder={'placeholder' in pasoActual ? pasoActual.placeholder : ''}
              value={valor}
              className="w-full bg-white/10 border border-white/30 rounded-2xl px-4 py-4 text-white text-center text-lg backdrop-blur outline-none focus:border-purple-400 placeholder-white/40"
              onChange={e => setValor(e.target.value)}
            />
            <button
              onClick={() => guardarYseguir()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full text-lg hover:opacity-90 transition"
            >
              Continuar
            </button>
            {pasoActual.tipo === 'time' && (
              <button onClick={() => guardarYseguir('no sé')} className="text-white/50 text-sm text-center">
                Omitir — no sé mi hora de nacimiento
              </button>
            )}
          </div>
        )}

        {/* Opciones */}
        {'opciones' in pasoActual && (
          <div className="flex flex-col gap-3">
            {pasoActual.opciones.map((op: string) => (
              <button
                key={op}
                onClick={() => guardarYseguir(op)}
                className="w-full bg-white/10 border border-white/30 backdrop-blur rounded-2xl px-4 py-3 text-left text-white hover:bg-purple-600/40 hover:border-purple-400 transition text-base"
              >
                {op}
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}