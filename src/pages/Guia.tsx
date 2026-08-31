import { useState, useRef, useEffect } from 'react'

interface Mensaje {
  rol: 'usuario' | 'asistente'
  contenido: string
}

const PERFIL_PRUEBA = {
  nombre: 'Luna',
  signo: 'Leo',
  elemento: 'Fuego',
  animal: 'Águila',
  intencion: 'Espiritualidad',
}

export default function Guia() {
  const nombre = localStorage.getItem('nombre') || PERFIL_PRUEBA.nombre
  const signo = localStorage.getItem('signo') || PERFIL_PRUEBA.signo
  const elemento = localStorage.getItem('elemento') || PERFIL_PRUEBA.elemento
  const animal = localStorage.getItem('animal') || PERFIL_PRUEBA.animal
  const intencion = localStorage.getItem('intencion') || PERFIL_PRUEBA.intencion

  const systemPrompt = `Eres una guía espiritual sabia, profunda y empática llamada UNIVERSE. Tu manera de comunicarte es cálida, poética y significativa. Nunca eres superficial. Siempre conectas tus respuestas con el cosmos, la energía y el camino interior del usuario.

Perfil del usuario:
- Nombre: ${nombre}
- Signo solar: ${signo}
- Elemento: ${elemento}
- Animal guía: ${animal}
- Intención: ${intencion}

Cuando el usuario haga una pregunta, antes de responder directamente, ofrécele diferentes perspectivas para explorar. Si pregunta sobre amor, trabajo, dinero o el futuro, conecta siempre con su perfil astrológico y espiritual. Puedes sugerir una tirada de tarot o una consulta con un experto humano cuando sientas que la situación lo requiere. Nunca des respuestas de sí o no. Siempre abre puertas, nunca las cierras. Responde siempre en el idioma en que el usuario escribe.`

  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      rol: 'asistente',
      contenido: `Bienvenida, ${nombre}. Soy tu guía en este universo interior.\n\nComo ${signo}, tu energía de ${elemento} te da una visión única del mundo. Estoy aquí para acompañarte en cualquier pregunta que lleves en el corazón.\n\n¿Qué quieres explorar hoy?`,
    }
  ])
  const [input, setInput] = useState('')
  const [cargando, setCargando] = useState(false)
  const [sugerencias] = useState([
    '¿Qué me dice mi carta astral sobre el amor?',
    'Quiero una tirada de tarot',
    '¿Cómo está mi energía ahora mismo?',
  ])
  const finRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes])

  const enviar = async (texto?: string) => {
    const pregunta = texto || input
    if (!pregunta.trim()) return

    const nuevosMensajes: Mensaje[] = [...mensajes, { rol: 'usuario', contenido: pregunta }]
    setMensajes(nuevosMensajes)
    setInput('')
    setCargando(true)

    try {
      const historial = nuevosMensajes.map(m => ({
        role: m.rol === 'usuario' ? 'user' : 'model',
        parts: [{ text: m.contenido }]
      }))

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: historial,
          }),
        }
      )

      const data = await res.json()
      const respuesta = data.candidates?.[0]?.content?.parts?.[0]?.text || 'El universo guarda silencio por un momento. Inténtalo de nuevo.'

      setMensajes([...nuevosMensajes, { rol: 'asistente', contenido: respuesta }])
    } catch {
      setMensajes([...nuevosMensajes, { rol: 'asistente', contenido: 'El universo guarda silencio por un momento. Inténtalo de nuevo.' }])
    }

    setCargando(false)
  }

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-4 py-4 border-b border-white/10 backdrop-blur">
        <button onClick={() => window.location.href = '/universo'} className="text-purple-300 text-sm">← Volver</button>
        <div className="flex-1 text-center">
          <p className="text-white font-semibold text-sm">Guía IA · UNIVERSE</p>
          <p className="text-purple-300 text-xs">Disponible 24/7</p>
        </div>
        <button
          onClick={() => window.location.href = '/tarot'}
          className="text-purple-300 text-xs border border-purple-500/30 rounded-full px-3 py-1"
        >
          Tarot
        </button>
      </div>

      {/* Mensajes */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4">
        {mensajes.map((m, i) => (
          <div key={i} className={`flex ${m.rol === 'usuario' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                m.rol === 'usuario'
                  ? 'bg-purple-600/80 text-white rounded-br-sm'
                  : 'bg-white/10 backdrop-blur border border-white/10 text-white/90 rounded-bl-sm'
              }`}
            >
              {m.contenido}
            </div>
          </div>
        ))}

        {cargando && (
          <div className="flex justify-start">
            <div className="bg-white/10 backdrop-blur border border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={finRef} />
      </div>

      {/* Sugerencias */}
      {mensajes.length === 1 && (
        <div className="relative z-10 px-4 pb-2 flex gap-2 overflow-x-auto">
          {sugerencias.map(s => (
            <button
              key={s}
              onClick={() => enviar(s)}
              className="whitespace-nowrap bg-white/10 border border-white/20 text-white/80 text-xs px-3 py-2 rounded-full hover:bg-purple-600/30 transition flex-shrink-0"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="relative z-10 px-4 py-4 border-t border-white/10 backdrop-blur flex gap-3 items-end">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar() } }}
          placeholder="Escribe tu pregunta..."
          rows={1}
          className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white text-sm resize-none outline-none focus:border-purple-400 placeholder-white/30 backdrop-blur"
        />
        <button
          onClick={() => enviar()}
          disabled={cargando || !input.trim()}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full w-11 h-11 flex items-center justify-center hover:opacity-90 transition disabled:opacity-40 flex-shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
            <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

    </div>
  )
}