import { useState } from 'react'
import { calcularNumerologia, SIGNIFICADOS_NUMEROLOGICOS } from '../lib/motores/numerologia'

export default function Numerologia() {
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [generado, setGenerado] = useState(false)

  const nombre = localStorage.getItem('nombre') || 'Luna'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const { numeroVida, numeroNombre, numeroDestino } = calcularNumerologia(nombre, fechaNacimiento)
  const significado = SIGNIFICADOS_NUMEROLOGICOS[numeroVida]

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const generarLectura = async () => {
    setCargando(true)
    setGenerado(true)

    const prompt = `Eres una experta en numerología pitagórica y su conexión con la psicología profunda.

Nombre: ${nombre}
Fecha de nacimiento: ${fechaNacimiento}
Número de Vida: ${numeroVida} (${significado?.titulo})
Número del Nombre: ${numeroNombre}
Número de Destino: ${numeroDestino}

Escribe una lectura numerológica personal de 3-4 párrafos para ${nombre}. Comienza con el Número de Vida y lo que revela sobre su misión y energía esencial. Habla de la tensión o armonía entre los tres números. Menciona el período actual de vida. Termina con un mensaje de orientación. Habla directamente a ${nombre}. Sé poético pero preciso.`

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
      setInterpretacion(data.candidates?.[0]?.content?.parts?.[0]?.text || significado?.descripcion || '')
    } catch {
      setInterpretacion(significado?.descripcion || '')
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
            <p className="text-white font-semibold text-sm">Numerología</p>
            <p className="text-purple-300 text-xs">Tradición pitagórica</p>
          </div>
        </div>

        {/* Números principales */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Vida', numero: numeroVida, desc: 'Tu misión' },
            { label: 'Nombre', numero: numeroNombre, desc: 'Tu expresión' },
            { label: 'Destino', numero: numeroDestino, desc: 'Tu camino' },
          ].map(item => (
            <div key={item.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-1 backdrop-blur">
              <p className="text-5xl font-light text-purple-300" style={{ textShadow: '0 0 20px rgba(192,132,252,0.5)' }}>{item.numero}</p>
              <p className="text-white text-xs font-semibold">{item.label}</p>
              <p className="text-white/30 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Número de vida principal */}
        {significado && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
            <p className="text-purple-300 text-xs tracking-widest uppercase mb-1">Número {numeroVida}</p>
            <p className="text-xl font-bold mb-3">{significado.titulo}</p>
            <p className="text-white/70 text-sm leading-relaxed mb-4">{significado.descripcion}</p>
            <div className="border-t border-white/10 pt-4">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-1">Fortalezas</p>
              <p className="text-white/60 text-sm">{significado.fortalezas}</p>
            </div>
            <div className="border-t border-white/10 pt-4 mt-4">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-1">Sombra</p>
              <p className="text-white/50 text-sm italic">{significado.sombra}</p>
            </div>
          </div>
        )}

        {!generado ? (
          <button
            onClick={generarLectura}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
          >
            Generar mi lectura numerológica
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

        {generado && !cargando && (
          <button onClick={() => window.location.href = '/guia'} className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full">
            Explorar con mi Guía IA
          </button>
        )}

      </div>
    </div>
  )
}