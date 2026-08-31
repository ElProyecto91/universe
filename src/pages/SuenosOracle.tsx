import { useState } from 'react'
import { SIMBOLOS_SUENOS, analizarSueno } from '../lib/motores/suenos'
import Compartir from '../components/Compartir'

export default function SuenosOracle() {
  const [sueno, setSueno] = useState('')
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'escribir' | 'resultado'>('escribir')
  const nombre = localStorage.getItem('nombre') || 'viajero'
  const signo = localStorage.getItem('signo') || 'Leo'

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const interpretar = async () => {
    if (!sueno.trim()) return
    setCargando(true)
    setFase('resultado')

    const simbolosEncontrados = analizarSueno(sueno)
    const contextoSimbolos = simbolosEncontrados.length > 0
      ? 'Símbolos detectados: ' + simbolosEncontrados.map(s => {
        const info = SIMBOLOS_SUENOS[s]
        return `${s} (jungiano: ${info.jungiano})`
      }).join('; ')
      : ''

    const prompt = `Eres un intérprete de sueños que combina psicología jungiana, simbolismo universal y tradiciones espirituales de diferentes culturas.

Nombre: ${nombre} (${signo})
Sueño: "${sueno}"
${contextoSimbolos}

Escribe una interpretación de sueños de 3-4 párrafos. Primero identifica los símbolos principales y su significado arquetípico. Luego explora el posible mensaje psicológico o espiritual. Menciona brevemente cómo diferentes tradiciones interpretarían elementos clave. Termina con una pregunta de reflexión profunda. Habla directamente a ${nombre}.`

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
      const texto = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (texto) {
        setInterpretacion(texto)
      } else {
        setInterpretacion('Error: ' + JSON.stringify(data).substring(0, 300))
      }
    } catch (err) {
      setInterpretacion('Error de conexión: ' + String(err))
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
            <p className="text-white font-semibold text-sm">Oracle de Sueños</p>
            <p className="text-purple-300 text-xs">Psicología · Simbolismo · Tradición</p>
          </div>
        </div>

        {fase === 'escribir' && (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <p className="text-6xl mb-4">🌙</p>
              <p className="text-white/60 text-sm leading-relaxed">
                Los sueños son el lenguaje del inconsciente. Describe tu sueño con el mayor detalle posible.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Describe tu sueño</p>
              <textarea
                value={sueno}
                onChange={e => setSueno(e.target.value)}
                placeholder="Soñé que estaba en un bosque oscuro y de repente apareció..."
                rows={6}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30 leading-relaxed"
              />
            </div>

            <button
              onClick={interpretar}
              disabled={!sueno.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >
              Interpretar mi sueño
            </button>
          </div>
        )}

        {fase === 'resultado' && (
          <div className="flex flex-col gap-5">

            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur">
              <p className="text-white/40 text-xs mb-1">Tu sueño</p>
              <p className="text-white/70 text-sm italic">"{sueno.substring(0, 100)}{sueno.length > 100 ? '...' : ''}"</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Interpretación</p>
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

            {!cargando && interpretacion && !interpretacion.startsWith('Error') && (
              <Compartir
                titulo="Mi interpretación de sueños"
                texto={interpretacion}
                hashtags={['Suenos', 'Universe', 'DreamOracle']}
              />
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                Explorar con mi Guía IA
              </button>
              <button onClick={() => { setFase('escribir'); setSueno(''); setInterpretacion('') }} className="w-full text-purple-300/60 text-sm py-2">
                Interpretar otro sueño
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}