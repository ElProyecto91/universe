import { useState } from 'react'
import { getCartaDiaria, getCartaDiariaSVG } from '../lib/motores/tarotDiario'

export default function TarotDiario() {
  const [revelada, setRevelada] = useState(false)
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const carta = getCartaDiaria()
  const nombre = localStorage.getItem('nombre') || 'viajero'
  const signo = localStorage.getItem('signo') || 'Leo'

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const revelarCarta = async () => {
    setRevelada(true)
    setCargando(true)

    const prompt = `Eres una tarotista sabia y poética. La carta del día para ${nombre} (${signo}) es "${carta.nombre}" (${carta.keywords}).

Escribe una interpretación del día profunda, personal y poética de máximo 3 frases. Conecta la carta con el tipo de energía y situaciones que pueden surgir en el día de hoy. Habla directamente a ${nombre}. No expliques qué es la carta, interpreta su mensaje para hoy.`

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
          }),
        }
      )
      const data = await res.json()
      const texto = data.candidates?.[0]?.content?.parts?.[0]?.text || carta.mensaje
      setInterpretacion(texto)
    } catch {
      setInterpretacion(carta.mensaje)
    }
    setCargando(false)
  }

  const hoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="min-h-screen text-white flex flex-col items-center relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center px-6 py-10 gap-8">

        {/* Header */}
        <div className="w-full flex items-center">
          <button onClick={() => window.location.href = '/universo'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-purple-300 text-xs tracking-widest uppercase">Carta del Día</p>
          </div>
        </div>

        {/* Fecha */}
        <p className="text-white/40 text-xs tracking-wide capitalize">{hoy}</p>

        {/* Carta */}
        {!revelada ? (
          <div className="flex flex-col items-center gap-8">
            <div className="relative">
              <div
                className="w-32 h-48 rounded-xl border border-purple-500/40 bg-gradient-to-b from-purple-900/60 to-black/60 backdrop-blur flex items-center justify-center cursor-pointer hover:border-purple-400 transition"
                onClick={revelarCarta}
              >
                <svg viewBox="0 0 80 120" fill="none" className="w-20 h-28 opacity-40">
                  <rect x="2" y="2" width="76" height="116" rx="8" stroke="#8b5cf6" strokeWidth="1.5"/>
                  <path d="M40 20 L40 100 M10 60 L70 60" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="4 4"/>
                  <circle cx="40" cy="60" r="20" stroke="#8b5cf6" strokeWidth="1"/>
                  <circle cx="40" cy="60" r="4" fill="#8b5cf6" opacity="0.5"/>
                </svg>
              </div>
            </div>

            <div className="text-center">
              <p className="text-white/60 text-sm mb-6">Centra tu mente. Cuando estés listo, toca la carta.</p>
              <button
                onClick={revelarCarta}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-10 rounded-full hover:opacity-90 transition"
              >
                Revelar mi carta
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 w-full">
            {getCartaDiariaSVG(carta.numero)}

            <div className="text-center">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-1">{carta.numero}</p>
              <h2 className="text-2xl font-bold mb-2" style={{ textShadow: '0 0 20px rgba(192,132,252,0.6)' }}>{carta.nombre}</h2>
              <p className="text-white/40 text-xs tracking-wide">{carta.keywords}</p>
            </div>

            <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu mensaje de hoy</p>
              {cargando ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : (
                <p className="text-white/90 text-sm leading-relaxed">{interpretacion}</p>
              )}
            </div>

            <div className="w-full flex flex-col gap-3">
              <button
                onClick={() => window.location.href = '/guia'}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
              >
                Explorar con mi Guía IA
              </button>
              <button
                onClick={() => window.location.href = '/tarot'}
                className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full hover:bg-white/20 transition"
              >
                Tirada completa de Tarot
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}