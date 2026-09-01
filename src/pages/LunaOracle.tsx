import { useState, useEffect } from 'react'
import { getFaseLunar } from '../lib/motores/luna'
import { getFaseLunarAPI } from '../lib/apis'
import Compartir from '../components/Compartir'

export default function LunaOracle() {
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [generado, setGenerado] = useState(false)
  const [iluminacion, setIluminacion] = useState<number | null>(null)

  const nombre = localStorage.getItem('nombre') || 'viajero'
  const signo = localStorage.getItem('signo') || 'Leo'
  const faseLunar = getFaseLunar()
  const hoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  useEffect(() => {
    getFaseLunarAPI().then(data => {
      if (data?.illumination) setIluminacion(Math.round(data.illumination * 100))
    })
  }, [])

  const generarLectura = async () => {
    setCargando(true)
    setGenerado(true)

    const prompt = `Eres una experta en astrología lunar y rituales de luna.

Nombre: ${nombre} (${signo})
Fase lunar: ${faseLunar.nombre} ${faseLunar.simbolo}
Días para luna llena: ${faseLunar.diasHastaLunaLlena}
Iluminación: ${iluminacion !== null ? iluminacion + '%' : 'aproximadamente el 50%'}
Energía de la fase: ${faseLunar.energia}
Fecha: ${hoy}

Escribe una guía lunar de 3 párrafos para ${nombre}.
Primero describe la energía de esta fase lunar y qué significa cosmológicamente.
Luego personaliza para ${nombre} como ${signo} — cómo esta fase amplifica o desafía su energía natural.
Termina con 3 prácticas o rituales específicos para aprovechar esta fase lunar hoy.`

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
      setInterpretacion('La luna guarda silencio. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => window.location.href = '/tradiciones'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Oracle Lunar</p>
            <p className="text-purple-300 text-xs capitalize">{hoy}</p>
          </div>
        </div>

        {/* Luna principal */}
        <div className="bg-white/8 border border-white/20 rounded-3xl p-8 backdrop-blur flex flex-col items-center gap-4"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-8xl" style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,200,0.5))' }}>
            {faseLunar.simbolo}
          </p>
          <p className="text-2xl font-bold">{faseLunar.nombre}</p>
          {iluminacion !== null && (
            <div className="w-full">
              <div className="flex justify-between text-xs text-white/40 mb-1">
                <span>Iluminación</span>
                <span>{iluminacion}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full">
                <div
                  className="h-2 bg-gradient-to-r from-yellow-300 to-white rounded-full transition-all"
                  style={{ width: `${iluminacion}%` }}
                />
              </div>
            </div>
          )}
          <p className="text-white/60 text-sm text-center">{faseLunar.energia}</p>
          <p className="text-purple-300 text-xs">{faseLunar.diasHastaLunaLlena} días para luna llena</p>
        </div>

        {/* Mensaje de la fase */}
        <div className="bg-white/8 border border-white/20 rounded-3xl p-5 backdrop-blur"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Energía de la fase</p>
          <p className="text-white/80 text-sm leading-relaxed">{faseLunar.mensaje}</p>
        </div>

        {/* Práctica lunar */}
        <div className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Práctica recomendada</p>
          <p className="text-white/70 text-sm leading-relaxed">{faseLunar.practica}</p>
        </div>

        {!generado ? (
          <button
            onClick={generarLectura}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
          >
            Mi guía lunar personalizada
          </button>
        ) : (
          <div className="bg-white/8 border border-white/20 rounded-3xl p-6 backdrop-blur"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
            <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu guía lunar</p>
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
        )}

        {!cargando && interpretacion && (
          <Compartir
            titulo={`Oracle Lunar: ${faseLunar.nombre}`}
            texto={interpretacion}
            hashtags={['OracleLunar', 'Universe', faseLunar.nombre.replace(' ', ''), 'Luna']}
          />
        )}

        {generado && !cargando && (
          <button onClick={() => window.location.href = '/guia'} className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full">
            Explorar con mi Guía IA
          </button>
        )}

      </div>
    </div>
  )
}