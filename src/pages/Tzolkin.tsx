import { useState } from 'react'
import Compartir from '../components/Compartir'

const SIGNOS_DIA = [
  { nombre: 'Imix', numero: 1, keywords: 'Cocodrilo · Origen · Nutrición · Protección', descripcion: 'El primer signo del Tzolkʼin. Imix es el cocodrilo primordial, la matriz de toda vida. Energía de origen, nutrición y protección.' },
  { nombre: 'Ikʼ', numero: 2, keywords: 'Viento · Espíritu · Comunicación · Aliento', descripcion: 'Ikʼ es el viento y el aliento de vida. Energía de comunicación, espíritu e inspiración. El mensajero entre mundos.' },
  { nombre: 'Akʼbal', numero: 3, keywords: 'Noche · Oscuridad · Misterio · Sueño', descripcion: 'Akʼbal es la noche profunda y el hogar de los sueños. Energía de introspección, misterio y el conocimiento oculto.' },
  { nombre: 'Kʼan', numero: 4, keywords: 'Lagarto · Semilla · Red · Abundancia', descripcion: 'Kʼan es la semilla de maíz y la red de la vida. Energía de abundancia, crecimiento y las conexiones que nos sostienen.' },
  { nombre: 'Chikchan', numero: 5, keywords: 'Serpiente · Kundalini · Conocimiento · Fuerza', descripcion: 'Chikchan es la serpiente de fuerza vital. Energía de poder, conocimiento sagrado y la energía que sube por la columna.' },
  { nombre: 'Kimi', numero: 6, keywords: 'Muerte · Transformación · Ancestros · Umbral', descripcion: 'Kimi es el señor de la muerte y la transformación. No es el fin — es el umbral entre mundos y la conexión con los ancestros.' },
  { nombre: 'Manikʼ', numero: 7, keywords: 'Venado · Sanación · Abundancia · Herramientas', descripcion: 'Manikʼ es el venado y las manos que sanan. Energía de sanación, abundancia material y las herramientas del oficio.' },
  { nombre: 'Lamat', numero: 8, keywords: 'Estrella · Venus · Semilla · Multiplicación', descripcion: 'Lamat es Venus, la estrella del amanecer. Energía de multiplicación, fertilidad y la belleza que se reproduce.' },
  { nombre: 'Muluk', numero: 9, keywords: 'Agua · Luna · Lluvia · Emoción', descripcion: 'Muluk es el agua y la luna. Energía de emociones profundas, lluvia que nutre y los ciclos del corazón.' },
  { nombre: 'Ok', numero: 10, keywords: 'Perro · Guía · Lealtad · Amor', descripcion: 'Ok es el perro, el guía fiel del inframundo. Energía de lealtad, amor incondicional y la guía en la oscuridad.' },
  { nombre: 'Chuwen', numero: 11, keywords: 'Mono · Artista · Tiempo · Creación', descripcion: 'Chuwen es el mono artista, maestro del tiempo y la creación. Energía de creatividad, juego y el tejido del tiempo.' },
  { nombre: 'Eb', numero: 12, keywords: 'Diente · Camino · Servicio · Humildad', descripcion: 'Eb es el camino y el viaje. Energía de servicio, humildad y el trabajo que se hace paso a paso.' },
  { nombre: 'Ben', numero: 13, keywords: 'Caña · Crecimiento · Maíz · Columna', descripcion: 'Ben es la caña de maíz que crece hacia el cielo. Energía de crecimiento, familia, hogar y la conexión entre tierra y cielo.' },
  { nombre: 'Ix', numero: 14, keywords: 'Jaguar · Magia · Noche · Chamán', descripcion: 'Ix es el jaguar, el señor de la noche y la magia. Energía de poder chamánico, misterio y la conexión con los espíritus.' },
  { nombre: 'Men', numero: 15, keywords: 'Águila · Visión · Mente · Libertad', descripcion: 'Men es el águila que ve desde las alturas. Energía de visión amplia, mente libre y la perspectiva elevada.' },
  { nombre: 'Kib', numero: 16, keywords: 'Búho · Karma · Sabiduría · Purificación', descripcion: 'Kib es el búho y la vela que alumbra. Energía de karma, sabiduría acumulada y la purificación de lo viejo.' },
  { nombre: 'Kabán', numero: 17, keywords: 'Tierra · Pensamiento · Evolución · Movimiento', descripcion: 'Kabán es la tierra en movimiento y el pensamiento evolutivo. Energía de ideas que transforman, progreso y la mente colectiva.' },
  { nombre: 'Etznabʼ', numero: 18, keywords: 'Cuchillo · Espejo · Verdad · Sacrificio', descripcion: 'Etznabʼ es el espejo de obsidiana que refleja la verdad. Energía de corte limpio, sacrificio consciente y la verdad que libera.' },
  { nombre: 'Kawak', numero: 19, keywords: 'Tormenta · Lluvia · Comunidad · Fuego del cielo', descripcion: 'Kawak es la tormenta y el rayo. Energía de purificación súbita, comunidad que se une ante el desafío y el fuego que transforma.' },
  { nombre: 'Ajaw', numero: 20, keywords: 'Sol · Señor · Iluminación · Flor', descripcion: 'Ajaw es el sol y el señor del día. El signo más elevado del Tzolkʼin. Energía de iluminación, plenitud y la flor que se abre completamente.' },
]

const NUMEROS_SAGRADOS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

const SIGNIFICADO_NUMERO: Record<number, string> = {
  1: 'Unidad, origen, semilla. El inicio puro.',
  2: 'Dualidad, desafío, polaridad. Las fuerzas opuestas.',
  3: 'Ritmo, movimiento, acción. La energía en marcha.',
  4: 'Estabilidad, definición, forma. La estructura emerge.',
  5: 'Poder, centro, comandante. El núcleo de la energía.',
  6: 'Flujo, equilibrio, organización. El ritmo se establece.',
  7: 'Reflexión, punto de resonancia, intuición. El momento de profundizar.',
  8: 'Armonía, integridad, modelado. La forma perfecta.',
  9: 'Pulsación, realización, conclusión del primer ciclo.',
  10: 'Manifestación, desafío, intención. Lo que se crea.',
  11: 'Resolución, liberación, disolución. Soltar para avanzar.',
  12: 'Complejidad, comprensión, elaboración. La síntesis.',
  13: 'Ascendencia, presencia, immanencia. La energía en su plenitud.',
}

function calcularTzolkin(fecha: string): { signo: typeof SIGNOS_DIA[0]; numero: number } {
  const f = new Date(fecha)
  const referencia = new Date(1983, 11, 8)
  const diff = Math.floor((f.getTime() - referencia.getTime()) / (1000 * 60 * 60 * 24))

  const signoIdx = ((diff % 20) + 20) % 20
  const numeroIdx = ((diff % 13) + 13) % 13
  const numero = numeroIdx === 0 ? 13 : numeroIdx

  return {
    signo: SIGNOS_DIA[signoIdx],
    numero: numero,
  }
}

export default function Tzolkin() {
  const [resultado, setResultado] = useState<any>(null)
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'datos' | 'resultado'>('datos')
  const [fecha, setFecha] = useState(localStorage.getItem('fechaNacimiento') || '')
  const nombre = localStorage.getItem('nombre') || 'viajero'

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const calcular = async () => {
    if (!fecha) return
    const res = calcularTzolkin(fecha)
    setResultado(res)
    setFase('resultado')
    setCargando(true)

    const prompt = `Eres un experto en el Tzolkʼin — el calendario sagrado de 260 días utilizado por los pueblos mayas. Presentas este conocimiento con respeto hacia las tradiciones vivas de los pueblos mayas actuales.

Nombre: ${nombre}
Fecha de nacimiento: ${fecha}
Signo del día: ${res.signo.nombre} (${res.signo.keywords})
Número sagrado: ${res.numero} — ${SIGNIFICADO_NUMERO[res.numero]}

Escribe una interpretación del signo Tzolkʼin de 3 párrafos. 
Primero describe la energía del signo del día — su simbolismo y lo que representa en la cosmología maya.
Luego interpreta la combinación del signo con el número sagrado — cómo modifica o amplifica la energía.
Termina con el mensaje que esta combinación trae para ${nombre} en su vida actual.
Nota: El Tzolkʼin es un sistema calendárico vivo que sigue siendo practicado por comunidades mayas hoy. Presénta con el respeto que merece.`

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
      setInterpretacion('El calendario guarda silencio. Inténtalo de nuevo.')
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
            <p className="text-white font-semibold text-sm">Tzolkʼin · 𝕿𝖟𝖔𝖑𝖐'𝖎𝖓</p>
            <p className="text-purple-300 text-xs">Calendario sagrado maya · Tradición viva</p>
          </div>
        </div>

        {fase === 'datos' && (
          <div className="flex flex-col gap-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
              <p className="text-white/60 text-sm leading-relaxed">
                El Tzolkʼin es un calendario de 260 días (20 signos × 13 números) utilizado por los pueblos mayas. Cada día tiene una energía única determinada por la combinación de signo y número sagrado. El calendario Tzolkʼin sigue siendo utilizado hoy por comunidades mayas como guía espiritual.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu fecha de nacimiento</p>
              <input
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white outline-none focus:border-purple-400 text-sm"
              />
            </div>

            <button
              onClick={calcular}
              disabled={!fecha}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >
              Descubrir mi signo Tzolkʼin
            </button>
          </div>
        )}

        {fase === 'resultado' && resultado && (
          <div className="flex flex-col gap-5">

            <div className="bg-white/5 border border-purple-500/20 rounded-3xl p-6 backdrop-blur text-center">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu signo Tzolkʼin</p>
              <div className="flex items-center justify-center gap-4 mb-3">
                <div className="text-center">
                  <p className="text-5xl font-bold text-purple-300">{resultado.numero}</p>
                  <p className="text-white/40 text-xs">Número sagrado</p>
                </div>
                <p className="text-white/20 text-2xl">·</p>
                <div className="text-center">
                  <p className="text-2xl font-bold">{resultado.signo.nombre}</p>
                  <p className="text-white/40 text-xs">Signo del día</p>
                </div>
              </div>
              <p className="text-purple-300 text-sm">{resultado.signo.keywords}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <p className="text-white/60 text-xs font-semibold mb-1">Número {resultado.numero}</p>
              <p className="text-white/70 text-xs">{SIGNIFICADO_NUMERO[resultado.numero]}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <p className="text-white/60 text-xs font-semibold mb-1">{resultado.signo.nombre}</p>
              <p className="text-white/70 text-xs leading-relaxed">{resultado.signo.descripcion}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu interpretación</p>
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
                titulo={`Mi signo Tzolkʼin: ${resultado.numero} ${resultado.signo.nombre}`}
                texto={interpretacion}
                hashtags={['Tzolkin', 'Universe', 'Maya', 'CalendarioMaya']}
              />
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                Explorar con mi Guía IA
              </button>
              <button onClick={() => { setFase('datos'); setInterpretacion('') }} className="w-full text-purple-300/60 text-sm py-2">
                Calcular otra fecha
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}