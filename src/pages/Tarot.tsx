import { useState } from 'react'

const ARCANOS_MAYORES = [
  { nombre: 'El Mago', numero: 'I', keywords: 'Voluntad · Poder · Acción' },
  { nombre: 'La Sacerdotisa', numero: 'II', keywords: 'Intuición · Misterio · Sabiduría interior' },
  { nombre: 'La Emperatriz', numero: 'III', keywords: 'Abundancia · Creatividad · Naturaleza' },
  { nombre: 'El Emperador', numero: 'IV', keywords: 'Autoridad · Estructura · Protección' },
  { nombre: 'El Sumo Sacerdote', numero: 'V', keywords: 'Tradición · Guía espiritual · Fe' },
  { nombre: 'Los Amantes', numero: 'VI', keywords: 'Unión · Elección · Armonía' },
  { nombre: 'El Carro', numero: 'VII', keywords: 'Control · Victoria · Determinación' },
  { nombre: 'La Fuerza', numero: 'VIII', keywords: 'Coraje · Paciencia · Compasión' },
  { nombre: 'El Ermitaño', numero: 'IX', keywords: 'Soledad · Reflexión · Búsqueda interior' },
  { nombre: 'La Rueda de la Fortuna', numero: 'X', keywords: 'Ciclos · Destino · Cambio' },
  { nombre: 'La Justicia', numero: 'XI', keywords: 'Equilibrio · Verdad · Causa y efecto' },
  { nombre: 'El Colgado', numero: 'XII', keywords: 'Pausa · Sacrificio · Nueva perspectiva' },
  { nombre: 'La Muerte', numero: 'XIII', keywords: 'Transformación · Fin de ciclo · Renacimiento' },
  { nombre: 'La Templanza', numero: 'XIV', keywords: 'Moderación · Paciencia · Propósito' },
  { nombre: 'El Diablo', numero: 'XV', keywords: 'Ataduras · Sombra · Materialismo' },
  { nombre: 'La Torre', numero: 'XVI', keywords: 'Ruptura · Revelación · Caos necesario' },
  { nombre: 'La Estrella', numero: 'XVII', keywords: 'Esperanza · Inspiración · Renovación' },
  { nombre: 'La Luna', numero: 'XVIII', keywords: 'Ilusión · Inconsciente · Miedos' },
  { nombre: 'El Sol', numero: 'XIX', keywords: 'Alegría · Claridad · Éxito' },
  { nombre: 'El Juicio', numero: 'XX', keywords: 'Despertar · Absolución · Llamada interior' },
  { nombre: 'El Mundo', numero: 'XXI', keywords: 'Plenitud · Integración · Completitud' },
  { nombre: 'El Loco', numero: '0', keywords: 'Inicio · Libertad · Potencial infinito' },
]

const TIRADAS = [
  { id: 'una', nombre: '1 carta', descripcion: 'Mensaje del día', cantidad: 1 },
  { id: 'tres', nombre: '3 cartas', descripcion: 'Pasado · Presente · Futuro', cantidad: 3 },
  { id: 'relacion', nombre: 'Relación', descripcion: 'Tú · Él/Ella · Conexión', cantidad: 3 },
  { id: 'profunda', nombre: 'Lectura profunda', descripcion: '5 cartas · Visión completa', cantidad: 5 },
]

function cartaAleatoria() {
  const carta = ARCANOS_MAYORES[Math.floor(Math.random() * ARCANOS_MAYORES.length)]
  const invertida = Math.random() > 0.7
  return { ...carta, invertida }
}

function CartaSVG({ numero, invertida }: { numero: string; invertida: boolean }) {
  return (
    <div
      className="flex flex-col items-center justify-between bg-gradient-to-b from-purple-900/80 to-black/80 border border-purple-500/40 rounded-2xl p-4 backdrop-blur"
      style={{
        width: '90px',
        height: '140px',
        transform: invertida ? 'rotate(180deg)' : 'none',
      }}
    >
      <div className="text-purple-300 text-xs font-light tracking-widest">{numero}</div>
      <svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-16">
        <circle cx="30" cy="30" r="15" stroke="#c084fc" strokeWidth="1.5" opacity="0.6"/>
        <path d="M30 5 L30 55 M5 30 L55 30" stroke="#c084fc" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
        <path d="M15 15 L45 45 M45 15 L15 45" stroke="#c084fc" strokeWidth="1" strokeLinecap="round" opacity="0.3"/>
        <circle cx="30" cy="30" r="4" fill="#c084fc" opacity="0.8"/>
        <path d="M30 15 L33 25 L44 25 L35 31 L38 42 L30 36 L22 42 L25 31 L16 25 L27 25 Z" stroke="#e879f9" strokeWidth="1" fill="none" opacity="0.5"/>
      </svg>
      <div className="text-purple-400 text-xs font-light">✦</div>
    </div>
  )
}

export default function Tarot() {
  const [tiradaSeleccionada, setTiradaSeleccionada] = useState<string | null>(null)
  const [cartas, setCartas] = useState<any[]>([])
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'elegir' | 'revelar' | 'interpretar'>('elegir')

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const nombre = localStorage.getItem('nombre') || 'Luna'
  const signo = localStorage.getItem('signo') || 'Leo'

  const iniciarTirada = (tirada: typeof TIRADAS[0]) => {
    setTiradaSeleccionada(tirada.id)
    const nuevasCartas = Array.from({ length: tirada.cantidad }, cartaAleatoria)
    setCartas(nuevasCartas)
    setFase('revelar')
  }

  const interpretarCartas = async () => {
    setCargando(true)
    setFase('interpretar')

    const nombresCartas = cartas.map(c => `${c.nombre} ${c.invertida ? '(invertida)' : ''}`).join(', ')
    const tirada = TIRADAS.find(t => t.id === tiradaSeleccionada)

    const prompt = `Eres una tarotista sabia y poética. Interpreta estas cartas para ${nombre}, signo ${signo}.
Tirada: ${tirada?.descripcion}
Cartas: ${nombresCartas}

Da una interpretación profunda, poética y personal. Conecta las cartas entre sí. No seas genérica. Habla directamente a ${nombre}. Máximo 200 palabras. Termina con una pregunta de reflexión.`

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
      const texto = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Las cartas guardan silencio por un momento.'
      setInterpretacion(texto)
    } catch {
      setInterpretacion('Las cartas guardan silencio por un momento. Inténtalo de nuevo.')
    }

    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      {/* Header */}
      <div className="relative z-10 flex items-center px-4 py-4 border-b border-white/10">
        <button onClick={() => window.location.href = '/universo'} className="text-purple-300 text-sm">← Volver</button>
        <div className="flex-1 text-center">
          <p className="text-white font-semibold text-sm">Tarot · UNIVERSE</p>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 py-8 gap-8">

        {/* Elegir tirada */}
        {fase === 'elegir' && (
          <>
            <div className="text-center">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Elige tu lectura</p>
              <p className="text-white/60 text-sm">Respira. Centra tu mente. Elige.</p>
            </div>
            <div className="w-full max-w-sm flex flex-col gap-3">
              {TIRADAS.map(t => (
                <button
                  key={t.id}
                  onClick={() => iniciarTirada(t)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-left hover:bg-purple-600/20 hover:border-purple-500/40 transition backdrop-blur"
                >
                  <p className="text-white font-semibold">{t.nombre}</p>
                  <p className="text-purple-300/70 text-xs mt-1">{t.descripcion}</p>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Revelar cartas */}
        {fase === 'revelar' && (
          <>
            <div className="text-center">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Tus cartas</p>
              <p className="text-white/60 text-sm">Las cartas han hablado</p>
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              {cartas.map((carta, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <CartaSVG numero={carta.numero} invertida={carta.invertida} />
                  <p className="text-white text-xs font-medium text-center max-w-20">{carta.nombre}</p>
                  {carta.invertida && <p className="text-purple-400 text-xs">Invertida</p>}
                  <p className="text-white/40 text-xs text-center max-w-24">{carta.keywords}</p>
                </div>
              ))}
            </div>
            <button
              onClick={interpretarCartas}
              className="w-full max-w-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
            >
              Interpretar mis cartas
            </button>
          </>
        )}

        {/* Interpretación */}
        {fase === 'interpretar' && (
          <>
            <div className="flex gap-3 flex-wrap justify-center">
              {cartas.map((carta, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <CartaSVG numero={carta.numero} invertida={carta.invertida} />
                  <p className="text-white/60 text-xs text-center max-w-20">{carta.nombre}</p>
                </div>
              ))}
            </div>

            <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-4">Interpretación</p>
              {cargando ? (
                <div className="flex gap-2 justify-center py-4">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : (
                <p className="text-white/90 text-sm leading-relaxed">{interpretacion}</p>
              )}
            </div>

            {!cargando && (
              <div className="w-full max-w-sm flex flex-col gap-3">
                <button
                  onClick={() => window.location.href = '/guia'}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
                >
                  Explorar con mi Guía IA
                </button>
                <button
                  onClick={() => window.location.href = '/experto'}
                  className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full hover:bg-white/20 transition backdrop-blur"
                >
                  Hablar con un Experto
                </button>
                <button
                  onClick={() => { setFase('elegir'); setCartas([]); setInterpretacion('') }}
                  className="w-full text-purple-300/60 text-sm py-2"
                >
                  Nueva tirada
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}