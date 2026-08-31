import { useState } from 'react'
import { calcularCompatibilidad } from '../lib/motores/compatibilidad'
import Compartir from '../components/Compartir'

export default function Compatibilidad() {
  const [nombre1, setNombre1] = useState(localStorage.getItem('nombre') || '')
  const [fecha1, setFecha1] = useState(localStorage.getItem('fechaNacimiento') || '')
  const [nombre2, setNombre2] = useState('')
  const [fecha2, setFecha2] = useState('')
  const [interpretacion, setInterpretacion] = useState('')
  const [resultado, setResultado] = useState<any>(null)
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'datos' | 'resultado'>('datos')

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const calcular = async () => {
    if (!nombre1 || !fecha1 || !nombre2 || !fecha2) return
    const res = calcularCompatibilidad(nombre1, fecha1, nombre2, fecha2)
    setResultado(res)
    setFase('resultado')
    setCargando(true)

    const prompt = `Eres una experta en numerología y compatibilidad entre personas.

Persona 1: ${nombre1} — Número de Vida ${res.persona1.numeroVida}
Persona 2: ${nombre2} — Número de Vida ${res.persona2.numeroVida}
Número de Conexión: ${res.numeroConexion} — ${res.conexion.titulo}

Descripción de la conexión: ${res.conexion.descripcion}
Desafío principal: ${res.conexion.desafio}
Potencial: ${res.conexion.potencial}

Escribe una lectura de compatibilidad de 3-4 párrafos. Primero describe la energía individual de cada número de vida. Luego explora qué aporta cada persona a la relación. Después habla del número de conexión y lo que significa para esta relación específica. Termina con un consejo práctico. Habla directamente a ${nombre1} y ${nombre2}. Sé equilibrado — no afirmes que la relación funcionará o no. Explora el potencial y los desafíos con honestidad.`

    try {
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
          }),
        }
      )
      const data = await r.json()
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
          <button onClick={() => {
            if (fase === 'resultado') setFase('datos')
            else window.location.href = '/tradiciones'
          }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Compatibilidad</p>
            <p className="text-purple-300 text-xs">Numerología · Dos personas</p>
          </div>
        </div>

        {fase === 'datos' && (
          <div className="flex flex-col gap-5">

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
              <p className="text-white/60 text-sm leading-relaxed text-center">
                Introduce los datos de dos personas para explorar su compatibilidad numerológica. Puede ser cualquier tipo de relación — amorosa, de amistad, familiar o profesional.
              </p>
            </div>

            <div className="bg-white/5 border border-purple-500/20 rounded-3xl p-5 backdrop-blur flex flex-col gap-3">
              <p className="text-purple-300 text-xs tracking-widest uppercase">Primera persona</p>
              <input
                type="text"
                placeholder="Nombre completo"
                value={nombre1}
                onChange={e => setNombre1(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-purple-400 text-sm"
              />
              <input
                type="date"
                value={fecha1}
                onChange={e => setFecha1(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white outline-none focus:border-purple-400 text-sm"
              />
            </div>

            <div className="bg-white/5 border border-pink-500/20 rounded-3xl p-5 backdrop-blur flex flex-col gap-3">
              <p className="text-pink-300 text-xs tracking-widest uppercase">Segunda persona</p>
              <input
                type="text"
                placeholder="Nombre completo"
                value={nombre2}
                onChange={e => setNombre2(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-pink-400 text-sm"
              />
              <input
                type="date"
                value={fecha2}
                onChange={e => setFecha2(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white outline-none focus:border-pink-400 text-sm"
              />
            </div>

            <button
              onClick={calcular}
              disabled={!nombre1 || !fecha1 || !nombre2 || !fecha2}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >
              Explorar compatibilidad
            </button>
          </div>
        )}

        {fase === 'resultado' && resultado && (
          <div className="flex flex-col gap-5">

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <div className="flex items-center justify-between mb-4">
                <div className="text-center flex-1">
                  <p className="text-purple-300 text-2xl font-bold">{resultado.persona1.numeroVida}</p>
                  <p className="text-white text-sm font-semibold">{resultado.persona1.nombre}</p>
                  <p className="text-white/40 text-xs">Número de Vida</p>
                </div>
                <div className="text-center px-4">
                  <p className="text-white/30 text-2xl">+</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-pink-300 text-2xl font-bold">{resultado.persona2.numeroVida}</p>
                  <p className="text-white text-sm font-semibold">{resultado.persona2.nombre}</p>
                  <p className="text-white/40 text-xs">Número de Vida</p>
                </div>
              </div>
              <div className="border-t border-white/10 pt-4 text-center">
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Número de Conexión</p>
                <p className="text-4xl font-bold text-white mb-1">{resultado.numeroConexion}</p>
                <p className="text-purple-300 font-semibold">{resultado.conexion.titulo}</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur flex flex-col gap-3">
              <p className="text-white/70 text-sm leading-relaxed">{resultado.conexion.descripcion}</p>
              <div className="border-t border-white/10 pt-3">
                <p className="text-amber-400 text-xs tracking-widest uppercase mb-1">Desafío</p>
                <p className="text-white/60 text-xs">{resultado.conexion.desafio}</p>
              </div>
              <div className="border-t border-white/10 pt-3">
                <p className="text-green-400 text-xs tracking-widest uppercase mb-1">Potencial</p>
                <p className="text-white/60 text-xs">{resultado.conexion.potencial}</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Lectura profunda</p>
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

            {!cargando && interpretacion && (
              <Compartir
                titulo={`Compatibilidad numerológica: ${resultado.persona1.nombre} y ${resultado.persona2.nombre}`}
                texto={`Número de Conexión ${resultado.numeroConexion}: ${resultado.conexion.titulo}\n\n${interpretacion}`}
                hashtags={['Compatibilidad', 'Universe', 'Numerologia', 'Amor']}
              />
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                Explorar con mi Guía IA
              </button>
              <button onClick={() => { setFase('datos'); setInterpretacion(''); setResultado(null) }} className="w-full text-purple-300/60 text-sm py-2">
                Nueva compatibilidad
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}