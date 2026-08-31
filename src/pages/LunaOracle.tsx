import { getFaseLunar, getDiasHastaLunaLlena } from '../lib/motores/luna'
import { useState } from 'react'
import Compartir from '../components/Compartir'

export default function LunaOracle() {
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [generado, setGenerado] = useState(false)
  const fase = getFaseLunar()
  const diasHastaLlena = getDiasHastaLunaLlena()
  const nombre = localStorage.getItem('nombre') || 'viajero'

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const generarLectura = async () => {
    setCargando(true)
    setGenerado(true)

    const prompt = `Eres una guía lunar sabia que combina astronomía real con simbolismo espiritual.

Nombre: ${nombre}
Fase lunar actual: ${fase.nombre} ${fase.simbolo}
Energía: ${fase.energia}
Días hasta luna llena: ${diasHastaLlena}

Escribe una lectura lunar personal de 3 párrafos para ${nombre}. Conecta la fase lunar real con su situación personal. Habla de qué tipo de energía está disponible ahora, qué acciones son más alineadas con este momento del ciclo y qué debería soltar o potenciar. Termina con una pregunta de reflexión. Sé poético y preciso.`

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
      setInterpretacion(data.candidates?.[0]?.content?.parts?.[0]?.text || fase.mensaje)
    } catch {
      setInterpretacion(fase.mensaje)
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
            <p className="text-purple-300 text-xs">Fase lunar real · Hoy</p>
          </div>
        </div>

        {/* Fase actual */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur flex flex-col items-center gap-4">
          <p className="text-8xl">{fase.simbolo}</p>
          <p className="text-2xl font-bold text-center">{fase.nombre}</p>
          <p className="text-purple-300 text-sm tracking-wide text-center">{fase.energia}</p>
          <p className="text-white/50 text-xs text-center">{diasHastaLlena} días hasta la luna llena</p>
        </div>

        {/* Mensaje */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Energía del ciclo</p>
          <p className="text-white/90 text-sm leading-relaxed">{fase.mensaje}</p>
        </div>

        {/* Ritual */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Práctica sugerida</p>
          <p className="text-white/80 text-sm leading-relaxed">{fase.ritual}</p>
        </div>

        {/* Conexiones */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-4">Conexiones simbólicas</p>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-white/40 text-xs uppercase">Tarot</span>
              <span className="text-white/80 text-sm">{fase.tarot}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/40 text-xs uppercase">Runa</span>
              <span className="text-white/80 text-sm">{fase.runa}</span>
            </div>
          </div>
        </div>

        {!generado ? (
          <button
            onClick={generarLectura}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
          >
            Generar mi lectura lunar
          </button>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
            <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu lectura personal</p>
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
            titulo={`Mi lectura lunar: ${fase.nombre} ${fase.simbolo}`}
            texto={interpretacion}
            hashtags={['Luna', 'Universe', 'LunaLlena', 'LunarOracle']}
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