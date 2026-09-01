import { useState } from 'react'
import { ARCANOS_MENORES, PALOS_INFO, cartaAleatoriaMenor } from '../lib/motores/taro78'
import { getCartaSVG } from '../components/svg/TarotSVG'
import Compartir from '../components/Compartir'

const ARCANOS_MAYORES_NAMES = [
  'El Loco', 'El Mago', 'La Sacerdotisa', 'La Emperatriz', 'El Emperador',
  'El Sumo Sacerdote', 'Los Amantes', 'El Carro', 'La Fuerza', 'El Ermitaño',
  'La Rueda de la Fortuna', 'La Justicia', 'El Colgado', 'La Muerte', 'La Templanza',
  'El Diablo', 'La Torre', 'La Estrella', 'La Luna', 'El Sol', 'El Juicio', 'El Mundo',
]

const TIRADAS_78 = [
  { id: 'celta', nombre: 'Cruz Celta', descripcion: '10 cartas · La tirada más completa', cantidad: 10, posiciones: ['Situación actual', 'Obstáculo cruzado', 'Base', 'Pasado', 'Corona/Meta', 'Futuro próximo', 'Tú', 'Entorno', 'Esperanzas y miedos', 'Resultado final'] },
  { id: 'horseshoe', nombre: 'Herradura', descripcion: '7 cartas · Visión completa', cantidad: 7, posiciones: ['Pasado', 'Presente', 'Futuro', 'Fundamento', 'Influencias externas', 'Esperanzas', 'Resultado'] },
  { id: 'anio', nombre: 'Tirada Anual', descripcion: '12 cartas · Un mes por carta', cantidad: 12, posiciones: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'] },
]

function cartaAleatoria78() {
  const esMayor = Math.random() > 0.5
  if (esMayor) {
    const nombre = ARCANOS_MAYORES_NAMES[Math.floor(Math.random() * ARCANOS_MAYORES_NAMES.length)]
    return { nombre, palo: 'mayor', invertida: Math.random() > 0.7, keywords: '', esMayor: true }
  } else {
    const carta = cartaAleatoriaMenor()
    return { ...carta, esMayor: false }
  }
}

export default function Tarot78() {
  const [tiradaSeleccionada, setTiradaSeleccionada] = useState<typeof TIRADAS_78[0] | null>(null)
  const [cartas, setCartas] = useState<any[]>([])
  const [cartaActiva, setCartaActiva] = useState<number | null>(null)
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'elegir' | 'tirada' | 'interpretar'>('elegir')

  const nombre = localStorage.getItem('nombre') || 'viajero'
  const signo = localStorage.getItem('signo') || 'Leo'

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const iniciarTirada = (tirada: typeof TIRADAS_78[0]) => {
    setTiradaSeleccionada(tirada)
    const nuevasCartas = Array.from({ length: tirada.cantidad }, cartaAleatoria78)
    setCartas(nuevasCartas)
    setFase('tirada')
  }

  const interpretar = async () => {
    setCargando(true)
    setFase('interpretar')

    const descripcion = cartas.map((c, i) => {
      const pos = tiradaSeleccionada?.posiciones[i] || `Posición ${i + 1}`
      return `${pos}: ${c.nombre}${c.invertida ? ' (invertida)' : ''}`
    }).join('\n')

    const prompt = `Eres una tarotista experta con conocimiento profundo de los 78 arcanos del tarot Rider-Waite.

Nombre: ${nombre} (${signo})
Tirada: ${tiradaSeleccionada?.nombre} — ${tiradaSeleccionada?.descripcion}

Cartas por posición:
${descripcion}

Escribe una interpretación profunda y personal de esta tirada para ${nombre}.
Interpreta cada posición en relación con las demás — el tarot es una historia, no una lista de significados.
Identifica los patrones dominantes: ¿qué palos predominan? ¿hay muchas cartas invertidas? ¿qué arcanos mayores aparecen?
Habla directamente a ${nombre} con empatía y profundidad.
Termina con el mensaje más importante que esta tirada tiene para él/ella ahora mismo.
Máximo 400 palabras.`

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
      setInterpretacion('Las cartas guardan silencio. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => {
            if (fase !== 'elegir') setFase('elegir')
            else window.location.href = '/tradiciones'
          }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Tarot Completo · 78 Arcanos</p>
          </div>
        </div>

        {fase === 'elegir' && (
          <div className="flex flex-col gap-5">
            <div className="bg-white/8 border border-white/20 rounded-3xl p-5 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-white/60 text-sm leading-relaxed">
                Tiradas con los 78 arcanos completos — 22 mayores y 56 menores. Para lecturas más profundas y detalladas.
              </p>
            </div>

            {/* Info de palos */}
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(PALOS_INFO).map(([key, palo]) => (
                <div key={key} className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur">
                  <p className="font-semibold text-sm" style={{ color: palo.color }}>{palo.nombre}</p>
                  <p className="text-white/40 text-xs">{palo.elemento}</p>
                  <p className="text-white/60 text-xs mt-1">{palo.area}</p>
                </div>
              ))}
            </div>

            {TIRADAS_78.map(t => (
              <button
                key={t.id}
                onClick={() => iniciarTirada(t)}
                className="bg-white/8 border border-white/20 rounded-2xl p-4 text-left hover:bg-purple-600/20 hover:border-purple-500/40 transition backdrop-blur"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
              >
                <p className="text-white font-bold">{t.nombre}</p>
                <p className="text-purple-300/70 text-xs mt-1">{t.descripcion}</p>
              </button>
            ))}
          </div>
        )}

        {fase === 'tirada' && tiradaSeleccionada && (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-1">{tiradaSeleccionada.nombre}</p>
              <p className="text-white/40 text-xs">Toca cada carta para ver su posición</p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {cartas.map((carta, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => setCartaActiva(cartaActiva === i ? null : i)}
                    className="rounded-lg overflow-hidden"
                    style={{
                      width: '55px',
                      height: '88px',
                      transform: carta.invertida ? 'rotate(180deg)' : 'none',
                      boxShadow: cartaActiva === i ? '0 0 15px rgba(192,132,252,0.6)' : 'none',
                      border: cartaActiva === i ? '1px solid rgba(192,132,252,0.6)' : 'none',
                    }}
                  >
                    {carta.esMayor ? (
                      getCartaSVG(carta.nombre)
                    ) : (
                      <div className="w-full h-full bg-purple-900/80 flex items-center justify-center p-1">
                        <p className="text-white text-center" style={{ fontSize: '6px', lineHeight: '1.2' }}>{carta.nombre}</p>
                      </div>
                    )}
                  </button>
                  <p className="text-white/40 text-center" style={{ fontSize: '8px', maxWidth: '55px' }}>
                    {tiradaSeleccionada.posiciones[i]?.split('/')[0]}
                  </p>
                </div>
              ))}
            </div>

            {cartaActiva !== null && (
              <div className="bg-purple-600/20 border border-purple-400/30 rounded-2xl p-4 backdrop-blur">
                <p className="text-purple-300 text-xs mb-1">{tiradaSeleccionada.posiciones[cartaActiva]}</p>
                <p className="text-white font-bold">{cartas[cartaActiva].nombre}</p>
                {cartas[cartaActiva].invertida && <p className="text-purple-400 text-xs">Invertida</p>}
                {cartas[cartaActiva].keywords && <p className="text-white/50 text-xs mt-1">{cartas[cartaActiva].keywords}</p>}
              </div>
            )}

            <button
              onClick={interpretar}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full"
            >
              Interpretar la tirada completa
            </button>
          </div>
        )}

        {fase === 'interpretar' && (
          <div className="flex flex-col gap-5">

            <div className="bg-white/8 border border-white/20 rounded-3xl p-6 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">
                {tiradaSeleccionada?.nombre} — Interpretación
              </p>
              {cargando ? (
                <div className="flex gap-2 py-4">
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
                titulo={`Mi tirada ${tiradaSeleccionada?.nombre} — 78 arcanos`}
                texto={interpretacion}
                hashtags={['Tarot78', 'Universe', 'CruzCelta', 'Tarot']}
              />
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                Explorar con mi Guía IA
              </button>
              <button onClick={() => { setFase('elegir'); setCartas([]); setInterpretacion('') }} className="w-full text-purple-300/60 text-sm py-2">
                Nueva tirada
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}