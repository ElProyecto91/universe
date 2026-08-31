import { useState } from 'react'
import { getCartaDiaria } from '../lib/motores/tarotDiario'
import { getCartaSVG } from '../components/svg/TarotSVG'
import Compartir from '../components/Compartir'

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
      setInterpretacion(data.candidates?.[0]?.content?.parts?.[0]?.text || carta.mensaje)
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

        <div className="w-full flex items-center">
          <button onClick={() => window.location.href = '/universo'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-purple-300 text-xs tracking-widest uppercase">Carta del Día</p>
          </div>
        </div>

        <p className="text-white/40 text-xs tracking-wide capitalize">{hoy}</p>

        {!revelada ? (
          <div className="flex flex-col items-center gap-8">
            {/* Carta boca abajo */}
            <div
              className="w-36 h-56 rounded-xl cursor-pointer hover:scale-105 transition-transform"
              onClick={revelarCarta}
              style={{ boxShadow: '0 0 30px rgba(139,92,246,0.4)' }}
            >
              <svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <rect width="120" height="200" fill="#1a0f2e" rx="8"/>
                <rect x="4" y="4" width="112" height="192" fill="none" stroke="#c084fc" strokeWidth="1" rx="6"/>
                <rect x="8" y="8" width="104" height="184" fill="none" stroke="#7c3aed" strokeWidth="0.5" rx="4" strokeDasharray="3 3"/>
                {/* Patrón de dorso */}
                {[...Array(6)].map((_, i) => (
                  <ellipse key={i} cx="60" cy="100" rx={15 + i * 12} ry={25 + i * 18} fill="none" stroke="#7c3aed" strokeWidth="0.5" opacity={0.8 - i * 0.1}/>
                ))}
                <circle cx="60" cy="100" r="8" fill="none" stroke="#c084fc" strokeWidth="1.5"/>
                <circle cx="60" cy="100" r="3" fill="#c084fc"/>
                {/* Estrellas decorativas */}
                {[[20,30],[100,30],[20,170],[100,170],[60,15],[60,185]].map(([x,y],i) => (
                  <path key={i} d={`M${x} ${y-4} L${x+1} ${y-1} L${x+4} ${y-1} L${x+2} ${y+1} L${x+3} ${y+4} L${x} ${y+2} L${x-3} ${y+4} L${x-2} ${y+1} L${x-4} ${y-1} L${x-1} ${y-1} Z`} fill="#7c3aed" opacity="0.6"/>
                ))}
              </svg>
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
            {/* Carta SVG real */}
            <div
              className="w-36 h-56 rounded-xl overflow-hidden"
              style={{ boxShadow: '0 0 40px rgba(192,132,252,0.5)' }}
            >
              {getCartaSVG(carta.nombre)}
            </div>

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

            {!cargando && interpretacion && (
              <Compartir
                titulo={`Mi carta del día: ${carta.nombre}`}
                texto={interpretacion}
                hashtags={['Tarot', 'Universe', 'CartaDelDia', 'Astrologia']}
              />
            )}

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