import { getSabbatActual, SABBATS } from '../lib/motores/ruedaDelAno'
import { useState } from 'react'
import Compartir from '../components/Compartir'

export default function WheelOfYear() {
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [generado, setGenerado] = useState(false)
  const sabbatActual = getSabbatActual()
  const nombre = localStorage.getItem('nombre') || 'viajero'

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const generarLectura = async () => {
    setCargando(true)
    setGenerado(true)

    const prompt = `Eres una guía experta en la Rueda del Año y las tradiciones paganas estacionales.

Nombre: ${nombre}
Próximo Sabbat: ${sabbatActual.nombre} (en ${sabbatActual.diasHasta} días)
Fecha: ${sabbatActual.fecha}
Descripción: ${sabbatActual.descripcion}
Temas: ${sabbatActual.temas.join(', ')}

Escribe una guía estacional personal de 3 párrafos para ${nombre}. Primero describe la energía de este momento del año y qué significa. Luego conecta los temas del Sabbat con la vida de ${nombre} — qué está siendo llamado a honrar, soltar o celebrar. Termina con dos acciones concretas que ${nombre} podría hacer en los próximos días para alinearse con esta energía estacional.`

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
      setInterpretacion('La rueda guarda silencio. Inténtalo de nuevo.')
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
            <p className="text-white font-semibold text-sm">Rueda del Año</p>
            <p className="text-purple-300 text-xs">Ciclo estacional · Tradición pagana moderna</p>
          </div>
        </div>

        {/* Próximo Sabbat */}
        <div className="bg-white/5 border border-purple-500/30 rounded-3xl p-6 backdrop-blur">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Próximo Sabbat</p>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-bold">{sabbatActual.nombre}</h2>
            <span className="text-purple-300 text-sm">{sabbatActual.diasHasta}d</span>
          </div>
          <p className="text-white/50 text-xs mb-3">{sabbatActual.fecha}</p>
          <p className="text-white/70 text-sm leading-relaxed">{sabbatActual.descripcion}</p>
        </div>

        {/* Temas */}
        <div className="flex gap-2 flex-wrap">
          {sabbatActual.temas.map(t => (
            <span key={t} className="bg-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full">{t}</span>
          ))}
        </div>

        {/* Conexiones */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-4">Conexiones simbólicas</p>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-white/40 text-xs uppercase">Tarot</span>
              <span className="text-white/80 text-sm">{sabbatActual.tarot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40 text-xs uppercase">Runa</span>
              <span className="text-white/80 text-sm">{sabbatActual.runa}</span>
            </div>
          </div>
        </div>

        {/* Práctica */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Práctica estacional</p>
          <p className="text-white/80 text-sm leading-relaxed">{sabbatActual.practica}</p>
        </div>

        {/* Todos los Sabbats */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-4">La Rueda completa</p>
          <div className="flex flex-col gap-2">
            {SABBATS.map(s => (
              <div key={s.nombre} className={`flex justify-between items-center py-2 border-b border-white/5 last:border-0 ${s.nombre === sabbatActual.nombre ? 'text-purple-300' : 'text-white/50'}`}>
                <span className="text-sm font-medium">{s.nombre}</span>
                <span className="text-xs">{s.fecha}</span>
              </div>
            ))}
          </div>
        </div>

        {!generado ? (
          <button
            onClick={generarLectura}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
          >
            Mi guía estacional personal
          </button>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
            <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu guía personal</p>
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
            titulo={`${sabbatActual.nombre} · Rueda del Año`}
            texto={interpretacion}
            hashtags={['RuedaDelAno', 'Universe', sabbatActual.nombre, 'Pagan']}
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