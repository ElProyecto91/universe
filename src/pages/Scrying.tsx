import { useState, useEffect, useRef } from 'react'
import Compartir from '../components/Compartir'

export default function Scrying() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [vision, setVision] = useState('')
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'contemplar' | 'resultado'>('contemplar')
  const [pregunta, setPregunta] = useState('')
  const nombre = localStorage.getItem('nombre') || 'viajero'
  const animRef = useRef<number>(0)

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const VISIONES = [
    { simbolo: 'Una espiral que se expande hacia afuera', energia: 'crecimiento y expansión' },
    { simbolo: 'Una llama que baila sola en la oscuridad', energia: 'transformación y guía' },
    { simbolo: 'Un camino que se bifurca en el bosque', energia: 'decisión y elección' },
    { simbolo: 'Un lago perfectamente inmóvil bajo la luna', energia: 'quietud y reflexión' },
    { simbolo: 'Una puerta entreabierta con luz al otro lado', energia: 'oportunidad y umbral' },
    { simbolo: 'Una semilla germinando en tierra oscura', energia: 'potencial oculto y comienzo' },
    { simbolo: 'Un pájaro que vuela hacia el horizonte', energia: 'libertad y perspectiva' },
    { simbolo: 'Un río que fluye alrededor de las piedras', energia: 'adaptabilidad y perseverancia' },
    { simbolo: 'Una estrella solitaria en el cielo nocturno', energia: 'guía y esperanza' },
    { simbolo: 'Un laberinto con salida visible desde arriba', energia: 'complejidad que tiene solución' },
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let t = 0
    const animar = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const grad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      )
      grad.addColorStop(0, `rgba(139, 92, 246, ${0.3 + Math.sin(t * 0.5) * 0.1})`)
      grad.addColorStop(0.5, `rgba(88, 28, 220, ${0.2 + Math.cos(t * 0.3) * 0.05})`)
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.9)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < 5; i++) {
        const x = canvas.width / 2 + Math.sin(t * 0.3 + i * 1.2) * (40 + i * 15)
        const y = canvas.height / 2 + Math.cos(t * 0.4 + i * 0.8) * (30 + i * 12)
        const r = 3 + Math.sin(t + i) * 2
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(192, 132, 252, ${0.4 + Math.sin(t + i) * 0.2})`
        ctx.fill()
      }

      t += 0.02
      animRef.current = requestAnimationFrame(animar)
    }

    animar()
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  const revelar = async () => {
    const visionSeleccionada = VISIONES[Math.floor(Math.random() * VISIONES.length)]
    setVision(visionSeleccionada.simbolo)
    setFase('resultado')
    setCargando(true)

    const prompt = `Eres un intérprete de scrying — la práctica contemplativa de buscar visiones en superficies reflectantes o transparentes, presente en muchas culturas históricas.

Nombre: ${nombre}
${pregunta ? `Pregunta o intención: "${pregunta}"` : 'Sin pregunta específica.'}
Visión que emerge: "${visionSeleccionada.simbolo}" (energía: ${visionSeleccionada.energia})

Escribe una interpretación de 2-3 párrafos para ${nombre}. Explora qué podría significar esta visión simbólica en el contexto de su vida. Conecta el simbolismo con su situación. El scrying es una práctica contemplativa y simbólica — no una predicción literal. Termina con una invitación a la reflexión.`

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
      setInterpretacion('La esfera guarda silencio. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => {
            if (fase === 'resultado') setFase('contemplar')
            else window.location.href = '/tradiciones'
          }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Scrying</p>
            <p className="text-purple-300 text-xs">Contemplación · Visión interior</p>
          </div>
        </div>

        {fase === 'contemplar' && (
          <div className="flex flex-col gap-6 items-center">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
              <p className="text-white/60 text-sm leading-relaxed text-center">
                El scrying es la práctica contemplativa de buscar visiones en superficies reflectantes. Respira, formula tu intención y deja que las imágenes emerjan.
              </p>
            </div>

            <canvas
              ref={canvasRef}
              width={240}
              height={240}
              className="rounded-full cursor-pointer"
              style={{ boxShadow: '0 0 40px rgba(139,92,246,0.4)' }}
              onClick={revelar}
            />

            <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu intención (opcional)</p>
              <textarea
                value={pregunta}
                onChange={e => setPregunta(e.target.value)}
                placeholder="¿Qué quieres ver con más claridad?"
                rows={2}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30"
              />
            </div>

            <button
              onClick={revelar}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
            >
              Contemplar la esfera
            </button>
          </div>
        )}

        {fase === 'resultado' && (
          <div className="flex flex-col gap-5">

            <div className="bg-white/5 border border-purple-500/20 rounded-3xl p-6 backdrop-blur text-center">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">La visión que emerge</p>
              <p className="text-white text-base italic leading-relaxed">"{vision}"</p>
            </div>

            {pregunta && (
              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur">
                <p className="text-white/40 text-xs">Intención: <span className="text-white/70 italic">"{pregunta}"</span></p>
              </div>
            )}

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

            {!cargando && interpretacion && (
              <Compartir
                titulo="Mi visión en la esfera de cristal"
                texto={`Visión: "${vision}"\n\n${interpretacion}`}
                hashtags={['Scrying', 'Universe', 'Vision', 'Contemplacion']}
              />
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                Explorar con mi Guía IA
              </button>
              <button onClick={() => { setFase('contemplar'); setVision(''); setInterpretacion('') }} className="w-full text-purple-300/60 text-sm py-2">
                Nueva contemplación
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}