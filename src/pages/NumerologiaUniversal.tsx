import { useState } from 'react'
import { calcularAnoUniversal, calcularMesUniversal, calcularDiaUniversal, ENERGIA_DIA_UNIVERSAL } from '../lib/motores/numerologiaUniversal'
import { calcularAnoPersonal } from '../lib/motores/anoPersonal'
import Compartir from '../components/Compartir'

export default function NumerologiaUniversal() {
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [generado, setGenerado] = useState(false)

  const nombre = localStorage.getItem('nombre') || 'viajero'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const anoUniversal = calcularAnoUniversal()
  const mesUniversal = calcularMesUniversal()
  const diaUniversal = calcularDiaUniversal()
  const anoPersonal = calcularAnoPersonal(fechaNacimiento)
  const energiaDia = ENERGIA_DIA_UNIVERSAL[diaUniversal] || ENERGIA_DIA_UNIVERSAL[1]
  const hoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const generarLectura = async () => {
    setCargando(true)
    setGenerado(true)

    const prompt = `Eres una experta en numerología universal y personal.

Nombre: ${nombre}
Fecha: ${hoy}
Año Universal: ${anoUniversal}
Mes Universal: ${mesUniversal}
Día Universal: ${diaUniversal} — ${energiaDia.titulo}
Año Personal de ${nombre}: ${anoPersonal}

Escribe una guía numerológica del día de 3 párrafos para ${nombre}.
Primero describe la energía del Día Universal ${diaUniversal} y lo que significa para todos.
Luego personaliza para ${nombre} — cómo interactúa su Año Personal ${anoPersonal} con el Día Universal ${diaUniversal}.
Termina con recomendaciones específicas para aprovechar esta energía combinada hoy.
Sé específico y práctico.`

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
      setInterpretacion('Los números guardan silencio. Inténtalo de nuevo.')
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
            <p className="text-white font-semibold text-sm">Numerología del Día</p>
            <p className="text-purple-300 text-xs capitalize">{hoy}</p>
          </div>
        </div>

        {/* Números del día */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Año Universal', valor: anoUniversal, desc: `${new Date().getFullYear()}` },
            { label: 'Mes Universal', valor: mesUniversal, desc: new Date().toLocaleString('es-ES', { month: 'long' }) },
            { label: 'Día Universal', valor: diaUniversal, desc: 'Hoy' },
          ].map(item => (
            <div key={item.label} className="bg-white/8 border border-white/20 rounded-2xl p-3 text-center backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-4xl font-light text-purple-300">{item.valor}</p>
              <p className="text-white/40 text-xs">{item.label}</p>
              <p className="text-white/30 text-xs capitalize">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Tu año personal */}
        <div className="bg-purple-600/20 border border-purple-400/30 rounded-2xl p-4 backdrop-blur flex justify-between items-center">
          <div>
            <p className="text-purple-300 text-xs tracking-widest uppercase">Tu Año Personal</p>
            <p className="text-white font-bold">{anoPersonal} — {nombre}</p>
          </div>
          <p className="text-5xl font-light text-purple-300">{anoPersonal}</p>
        </div>

        {/* Energía del día */}
        <div className="bg-white/8 border border-white/20 rounded-3xl p-5 backdrop-blur"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Día Universal {diaUniversal}</p>
          <p className="text-white font-bold text-lg mb-3">{energiaDia.titulo}</p>
          <p className="text-purple-300 text-xs mb-3">{energiaDia.energia}</p>

          <div className="flex flex-col gap-2">
            <div>
              <p className="text-green-400 text-xs tracking-widest uppercase mb-1">Favorable para</p>
              <p className="text-white/70 text-xs">{energiaDia.favorable}</p>
            </div>
            <div>
              <p className="text-red-400 text-xs tracking-widest uppercase mb-1">Mejor evitar</p>
              <p className="text-white/70 text-xs">{energiaDia.evitar}</p>
            </div>
          </div>
        </div>

        {!generado ? (
          <button
            onClick={generarLectura}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
          >
            Mi guía numerológica personalizada
          </button>
        ) : (
          <div className="bg-white/8 border border-white/20 rounded-3xl p-6 backdrop-blur"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
            <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu guía de hoy</p>
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
            titulo={`Numerología del día ${diaUniversal} · ${hoy}`}
            texto={interpretacion}
            hashtags={['NumerologiaUniversal', 'Universe', `Dia${diaUniversal}`, 'Numerologia']}
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