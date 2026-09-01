import { useState } from 'react'
import { getRetrogradosActivos, getLunaEnSignoHoy, LUNA_EN_SIGNOS, RETROGRADOS_2026 } from '../lib/motores/transitos'
import { getFaseLunar } from '../lib/motores/luna'
import { getSignoSolar } from '../lib/motores/horoscopo'
import Compartir from '../components/Compartir'

export default function Transitos() {
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [generado, setGenerado] = useState(false)

  const nombre = localStorage.getItem('nombre') || 'viajero'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const signoSolar = getSignoSolar(fechaNacimiento)
  const faseLunar = getFaseLunar()
  const lunaEnSigno = getLunaEnSignoHoy()
  const retrogradosActivos = getRetrogradosActivos()
  const hoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const generarLectura = async () => {
    setCargando(true)
    setGenerado(true)

    const retrogradosTexto = retrogradosActivos.length > 0
      ? retrogradosActivos.map(r => `${r.planeta} retrógrado en ${r.signo}: ${r.consejo}`).join('. ')
      : 'No hay planetas retrógrados activos.'

    const prompt = `Eres una astróloga experta en tránsitos planetarios y su influencia en la vida cotidiana.

Nombre: ${nombre} (${signoSolar})
Fecha: ${hoy}
Luna en: ${lunaEnSigno}
Fase lunar: ${faseLunar.nombre}
Retrógrados activos: ${retrogradosTexto}

Escribe una guía de tránsitos del día de 3 párrafos para ${nombre}.
Primero describe la energía lunar del día — la luna en ${lunaEnSigno} y cómo afecta emocionalmente.
Luego habla de los retrógrados activos y qué significa para ${nombre} como ${signoSolar}.
Termina con 3 recomendaciones concretas para trabajar bien con la energía de hoy.
Sé específico y práctico, no genérico.`

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
      setInterpretacion('Los planetas guardan silencio. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => window.location.href = '/universo'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Tránsitos Planetarios</p>
            <p className="text-purple-300 text-xs capitalize">{hoy}</p>
          </div>
        </div>

        {/* Luna del día */}
        <div className="bg-white/8 border border-white/20 rounded-3xl p-5 backdrop-blur"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{faseLunar.simbolo}</span>
            <div>
              <p className="text-white font-bold">Luna en {lunaEnSigno}</p>
              <p className="text-purple-300 text-xs">{faseLunar.nombre}</p>
            </div>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            {LUNA_EN_SIGNOS[lunaEnSigno] || 'Energía lunar activa y presente.'}
          </p>
        </div>

        {/* Retrógrados */}
        {retrogradosActivos.length > 0 ? (
          <div className="flex flex-col gap-3">
            <p className="text-amber-400 text-xs tracking-widest uppercase">⚠️ Planetas Retrógrados Activos</p>
            {retrogradosActivos.map(r => (
              <div key={r.planeta} className="bg-amber-500/15 border border-amber-500/30 rounded-2xl p-4 backdrop-blur">
                <p className="text-amber-300 font-bold">{r.planeta} Retrógrado en {r.signo}</p>
                <p className="text-white/60 text-xs mt-1">{r.consejo}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-green-500/15 border border-green-500/30 rounded-2xl p-4 backdrop-blur">
            <p className="text-green-400 font-semibold text-sm">✓ Sin planetas retrógrados activos</p>
            <p className="text-white/60 text-xs mt-1">Energía directa y favorable para avanzar.</p>
          </div>
        )}

        {/* Calendario retrógrados 2026 */}
        <div className="bg-white/8 border border-white/20 rounded-3xl p-5 backdrop-blur"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-4">Calendario Retrógrados 2026</p>
          {RETROGRADOS_2026.map((r, i) => {
            const activo = retrogradosActivos.some(ra => ra.planeta === r.planeta && ra.inicio === r.inicio)
            return (
              <div key={i} className={`flex items-center gap-3 py-2 border-b border-white/5 last:border-0 ${activo ? 'text-amber-300' : 'text-white/50'}`}>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{r.planeta} en {r.signo}</p>
                  <p className="text-xs opacity-60">{r.inicio} → {r.fin}</p>
                </div>
                {activo && <span className="text-xs bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded-full">Activo</span>}
              </div>
            )
          })}
        </div>

        {!generado ? (
          <button
            onClick={generarLectura}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
          >
            Mi guía de tránsitos de hoy
          </button>
        ) : (
          <div className="bg-white/8 border border-white/20 rounded-3xl p-6 backdrop-blur"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
            <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu guía planetaria</p>
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
            titulo={`Mis tránsitos de hoy · ${signoSolar}`}
            texto={interpretacion}
            hashtags={['Transitos', 'Universe', signoSolar, 'Astrologia']}
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