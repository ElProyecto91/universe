import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserPlan, incrementarConsulta } from '../hooks/useUserPlan'
import { useAnalytics } from '../hooks/useAnalytics'
import { guardarLectura } from '../hooks/useHistorial'
import { llamarGemini } from '../lib/gemini'
import Compartir from '../components/Compartir'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import PageLayout from '../components/PageLayout'
import TextoIA from '../components/TextoIA'

const HERRAMIENTA = 'chakra-oracle'

type Chakra = {
  id: string
  nombre: string
  nombreSanscrito: string
  mantraBija: string
  colorNombre: string
  numero: number
  color: string
  colorSecundario: string
  elemento: string
  ubicacion: string
  petalos: number
  simbolismo: string
  desequilibrio: string
  equilibrio: string
  palabrasClave: string[]
}

const CHAKRAS: Chakra[] = [
  {
    id: 'muladhara', nombre: 'Raíz', nombreSanscrito: 'Muladhara', mantraBija: 'LAM',
    colorNombre: 'rojo',
    numero: 1, color: '#dc2626', colorSecundario: '#7f1d1d',
    elemento: 'Tierra', ubicacion: 'Base de la columna', petalos: 4,
    simbolismo: 'Supervivencia · Seguridad · Arraigo · Instinto',
    desequilibrio: 'Miedo, inseguridad, desconexión del cuerpo, problemas materiales',
    equilibrio: 'Seguridad, estabilidad, presencia plena, conexión con la tierra',
    palabrasClave: ['miedo', 'inseguridad', 'dinero', 'hogar', 'trabajo', 'estabilidad', 'cuerpo', 'supervivencia', 'raíz', 'tierra', 'material', 'familia'],
  },
  {
    id: 'svadhisthana', nombre: 'Sacro', nombreSanscrito: 'Svadhisthana', mantraBija: 'VAM',
    colorNombre: 'naranja',
    numero: 2, color: '#ea580c', colorSecundario: '#7c2d12',
    elemento: 'Agua', ubicacion: 'Bajo vientre', petalos: 6,
    simbolismo: 'Creatividad · Placer · Emoción · Sexualidad',
    desequilibrio: 'Bloqueo creativo, culpa, dependencia emocional, frigidez o exceso sexual',
    equilibrio: 'Fluidez emocional, creatividad, placer sano, relaciones equilibradas',
    palabrasClave: ['creatividad', 'sexualidad', 'placer', 'emoción', 'relaciones', 'pasión', 'culpa', 'vergüenza', 'fluir', 'agua', 'pareja'],
  },
  {
    id: 'manipura', nombre: 'Plexo Solar', nombreSanscrito: 'Manipura', mantraBija: 'RAM',
    colorNombre: 'amarillo dorado',
    numero: 3, color: '#ca8a04', colorSecundario: '#713f12',
    elemento: 'Fuego', ubicacion: 'Plexo solar', petalos: 10,
    simbolismo: 'Poder personal · Voluntad · Autoestima · Acción',
    desequilibrio: 'Falta de confianza, indecisión, problemas digestivos, control excesivo',
    equilibrio: 'Confianza, determinación, poder personal, autoestima sólida',
    palabrasClave: ['confianza', 'poder', 'autoestima', 'voluntad', 'acción', 'decisión', 'control', 'ego', 'fuego', 'energía', 'propósito', 'fuerza'],
  },
  {
    id: 'anahata', nombre: 'Corazón', nombreSanscrito: 'Anahata', mantraBija: 'YAM',
    colorNombre: 'verde',
    numero: 4, color: '#16a34a', colorSecundario: '#14532d',
    elemento: 'Aire', ubicacion: 'Centro del pecho', petalos: 12,
    simbolismo: 'Amor · Compasión · Perdón · Conexión',
    desequilibrio: 'Corazón cerrado, codependencia, falta de amor propio, resentimiento',
    equilibrio: 'Amor incondicional, compasión, perdón, apertura del corazón',
    palabrasClave: ['amor', 'corazón', 'compasión', 'perdón', 'relación', 'duelo', 'soledad', 'herida', 'apertura', 'empatía', 'conexión', 'pareja'],
  },
  {
    id: 'vishuddha', nombre: 'Garganta', nombreSanscrito: 'Vishuddha', mantraBija: 'HAM',
    colorNombre: 'azul cielo',
    numero: 5, color: '#0284c7', colorSecundario: '#0c4a6e',
    elemento: 'Éter', ubicacion: 'Garganta', petalos: 16,
    simbolismo: 'Comunicación · Verdad · Expresión · Escucha',
    desequilibrio: 'Dificultad para expresarse, mentiras, miedo a hablar, problemas de garganta',
    equilibrio: 'Comunicación auténtica, expresión creativa, escucha activa, verdad',
    palabrasClave: ['comunicación', 'expresión', 'verdad', 'hablar', 'voz', 'escucha', 'mentira', 'silencio', 'palabra', 'arte', 'creatividad', 'garganta'],
  },
  {
    id: 'ajna', nombre: 'Tercer Ojo', nombreSanscrito: 'Ajna', mantraBija: 'OM',
    colorNombre: 'índigo',
    numero: 6, color: '#7c3aed', colorSecundario: '#3b0764',
    elemento: 'Luz', ubicacion: 'Entre las cejas', petalos: 2,
    simbolismo: 'Intuición · Clarividencia · Sabiduría · Percepción',
    desequilibrio: 'Confusión, falta de intuición, rigidez mental, ilusión',
    equilibrio: 'Claridad mental, intuición afilada, visión interior, sabiduría',
    palabrasClave: ['intuición', 'claridad', 'visión', 'percepción', 'confusión', 'mente', 'sabiduría', 'sueños', 'clarividencia', 'insight', 'meditación'],
  },
  {
    id: 'sahasrara', nombre: 'Corona', nombreSanscrito: 'Sahasrara', mantraBija: 'AH',
    colorNombre: 'violeta',
    numero: 7, color: '#9333ea', colorSecundario: '#581c87',
    elemento: 'Consciencia', ubicacion: 'Coronilla', petalos: 1000,
    simbolismo: 'Conexión divina · Iluminación · Propósito · Unidad',
    desequilibrio: 'Desconexión espiritual, cinismo, falta de propósito, apego excesivo',
    equilibrio: 'Conexión con lo sagrado, propósito de vida, paz interior, unidad',
    palabrasClave: ['espiritualidad', 'propósito', 'divino', 'iluminación', 'consciencia', 'universo', 'fe', 'sentido', 'corona', 'conexión', 'sagrado', 'alma'],
  },
]

function seleccionarChakra(consulta: string): Chakra {
  const texto = consulta.toLowerCase()
  let mejor: Chakra | null = null
  let maxCoincidencias = 0
  for (const chakra of CHAKRAS) {
    const coincidencias = chakra.palabrasClave.filter(kw => texto.includes(kw)).length
    if (coincidencias > maxCoincidencias) {
      maxCoincidencias = coincidencias
      mejor = chakra
    }
  }
  if (mejor && maxCoincidencias > 0) return mejor
  const hoy = new Date()
  const semilla = hoy.getFullYear() * 10000 + (hoy.getMonth() + 1) * 100 + hoy.getDate()
  return CHAKRAS[semilla % 7]
}

function ChakraSVG({ chakra }: { chakra: Chakra }) {
  const cx = 190
  const cy = 190
  const numPetalos = Math.min(chakra.petalos, 16)
  const petalos = Array.from({ length: numPetalos }, (_, i) => {
    const angle = (i * 360 / numPetalos - 90) * Math.PI / 180
    const px = cx + Math.cos(angle) * 95
    const py = cy + Math.sin(angle) * 95
    return { px, py }
  })

  return (
    <svg width="100%" viewBox="0 0 380 380" role="img">
      <title>{chakra.nombreSanscrito} — {chakra.nombre}</title>
      <desc>Mandala del chakra {chakra.nombre}</desc>
      <rect width="380" height="380" fill="#080810"/>
      <circle cx={cx} cy={cy} r="150" fill="none" stroke={chakra.color} strokeWidth="0.5" strokeDasharray="4,6" opacity="0.3"/>
      <circle cx={cx} cy={cy} r="140" fill="none" stroke={chakra.color} strokeWidth="0.5" opacity="0.4"/>
      {petalos.map((p, i) => (
        <ellipse key={i} cx={p.px} cy={p.py} rx="18" ry="32"
          transform={`rotate(${i * 360 / numPetalos}, ${p.px}, ${p.py})`}
          fill={chakra.color} fillOpacity="0.15"
          stroke={chakra.color} strokeWidth="0.8" strokeOpacity="0.6"/>
      ))}
      <circle cx={cx} cy={cy} r="80" fill={chakra.colorSecundario} fillOpacity="0.4" stroke={chakra.color} strokeWidth="1.5"/>
      <circle cx={cx} cy={cy} r="65" fill="none" stroke={chakra.color} strokeWidth="0.5" strokeOpacity="0.5"/>
      {chakra.id === 'muladhara' && <rect x={cx-28} y={cy-28} width="56" height="56" fill="none" stroke={chakra.color} strokeWidth="2" transform={`rotate(45 ${cx} ${cy})`}/>}
      {chakra.id === 'svadhisthana' && <circle cx={cx} cy={cy} r="28" fill="none" stroke={chakra.color} strokeWidth="2"/>}
      {chakra.id === 'manipura' && <polygon points={`${cx},${cy-32} ${cx+28},${cy+16} ${cx-28},${cy+16}`} fill="none" stroke={chakra.color} strokeWidth="2"/>}
      {chakra.id === 'anahata' && <g><polygon points={`${cx},${cy-30} ${cx+26},${cy+15} ${cx-26},${cy+15}`} fill="none" stroke={chakra.color} strokeWidth="2"/><polygon points={`${cx},${cy+30} ${cx+26},${cy-15} ${cx-26},${cy-15}`} fill="none" stroke={chakra.color} strokeWidth="2"/></g>}
      {chakra.id === 'vishuddha' && <g><circle cx={cx} cy={cy} r="28" fill="none" stroke={chakra.color} strokeWidth="2"/><polygon points={`${cx},${cy-28} ${cx+24},${cy+14} ${cx-24},${cy+14}`} fill="none" stroke={chakra.color} strokeWidth="1.5"/></g>}
      {chakra.id === 'ajna' && <g><ellipse cx={cx} cy={cy} rx="30" ry="20" fill="none" stroke={chakra.color} strokeWidth="2"/><circle cx={cx} cy={cy} r="8" fill={chakra.color} fillOpacity="0.6"/></g>}
      {chakra.id === 'sahasrara' && <g>{Array.from({ length: 12 }, (_, i) => { const a = (i * 30 - 90) * Math.PI / 180; return <line key={i} x1={cx + Math.cos(a) * 15} y1={cy + Math.sin(a) * 15} x2={cx + Math.cos(a) * 30} y2={cy + Math.sin(a) * 30} stroke={chakra.color} strokeWidth="1.5"/> })}<circle cx={cx} cy={cy} r="14" fill={chakra.color} fillOpacity="0.4" stroke={chakra.color} strokeWidth="1.5"/></g>}
      <text x={cx} y={cy-48} fill={chakra.color} fontFamily="serif" fontSize="11" textAnchor="middle" letterSpacing="2" opacity="0.7">{chakra.nombreSanscrito.toUpperCase()}</text>
      <text x={cx} y={cy+52} fill={chakra.color} fontFamily="serif" fontSize="22" textAnchor="middle" fontWeight="bold">{chakra.mantraBija}</text>
      <text x={cx} y={cy+5} fill={chakra.color} fontFamily="serif" fontSize="13" textAnchor="middle" opacity="0.5">{chakra.numero}</text>
      {Array.from({ length: numPetalos }, (_, i) => {
        const angle = (i * 360 / numPetalos - 90) * Math.PI / 180
        return <line key={i} x1={cx + Math.cos(angle) * 68} y1={cy + Math.sin(angle) * 68} x2={cx + Math.cos(angle) * 78} y2={cy + Math.sin(angle) * 78} stroke={chakra.color} strokeWidth="0.5" opacity="0.4"/>
      })}
      <text x={cx} y="350" fill={chakra.color} fontFamily="serif" fontSize="10" textAnchor="middle" opacity="0.5" letterSpacing="1">{chakra.elemento} · {chakra.ubicacion}</text>
    </svg>
  )
}

export default function ChakraOracle() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [pregunta,       setPregunta]       = useState('')
  const [chakra,         setChakra]         = useState<Chakra | null>(null)
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando,       setCargando]       = useState(false)
  const [revelando,      setRevelando]      = useState(false)
  const [fase,           setFase]           = useState<'preguntar' | 'resultado'>('preguntar')
  const [errorMsg,       setErrorMsg]       = useState('')
  const [yaValorado,     setYaValorado]     = useState(false)
  const lecturaGuardadaRef                  = useRef(false)

  const nombre   = localStorage.getItem('nombre') || 'viajero'
  const signo    = localStorage.getItem('signo')  || 'Leo'
  const fechaHoy = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (!userPlan.cargando) analytics.registrarApertura()
  }, [userPlan.cargando])

  if (!userPlan.cargando && !userPlan.esPremium) {
    analytics.registrarPaywall(); navigate('/premium'); return null
  }

  const consultar = async () => {
    if (!pregunta.trim()) return
    setRevelando(true)
    const chakraElegido = seleccionarChakra(pregunta)
    setChakra(chakraElegido)
    await new Promise(r => setTimeout(r, 800))
    setRevelando(false)
    setFase('resultado')
    setCargando(true); setErrorMsg('')
    const t0 = Date.now()

    try {
      const prompt = [
        'Eres un experto en el sistema de chakras de la tradición hindú y del yoga kundalini.',
        `El usuario se llama ${nombre}, signo ${signo}. Su situación: "${pregunta}".`,
        `El chakra que resuena con esta situación es ${chakraElegido.nombreSanscrito} (${chakraElegido.nombre}), el chakra ${chakraElegido.numero}.`,
        `Elemento: ${chakraElegido.elemento}. Mantra bija: ${chakraElegido.mantraBija}. Color: ${chakraElegido.colorNombre}.`,
        `Simbolismo: ${chakraElegido.simbolismo}.`,
        `Señales de desequilibrio: ${chakraElegido.desequilibrio}.`,
        `Estado de equilibrio: ${chakraElegido.equilibrio}.`,
        '',
        'Escribe en español, en prosa, sin listas ni asteriscos. Sin saludar ni usar el nombre al inicio.',
        'Escribe exactamente 3 párrafos separados por línea en blanco. Cada párrafo máximo 3 frases.',
        `Párrafo 1: por qué ${chakraElegido.nombreSanscrito} resuena con esta situación y qué señales de desequilibrio o activación están presentes.`,
        `Párrafo 2: qué bloqueo o flujo de energía está presente en este chakra y cómo se manifiesta en la vida del consultante.`,
        `Párrafo 3: una práctica concreta (respiración, mantra ${chakraElegido.mantraBija} o movimiento corporal) para equilibrar este chakra hoy, y una pregunta reflexiva de cierre. NO menciones ningún color ni código en este párrafo.`,
        'Tono sabio y compasivo. Termina en punto.',
      ].join('\n')

      const result = await llamarGemini({
        herramienta: HERRAMIENTA, prompt,
        userId: userPlan.userId, usarLite: true, cacheable: false, maxTokens: 500,
      })

      if (result.error || !result.texto) {
        setErrorMsg('El chakra guarda silencio. Inténtalo de nuevo.')
        return
      }

      setInterpretacion(result.texto)
      if (userPlan.userId) await incrementarConsulta(userPlan.userId)
      analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: 'lite' })
      if (!lecturaGuardadaRef.current) {
        lecturaGuardadaRef.current = true
        await guardarLectura({
          herramienta: HERRAMIENTA,
          titulo: `Chakra Oracle · ${chakraElegido.nombreSanscrito} · ${fechaHoy}`,
          contenido: `Consulta: "${pregunta}"\nChakra: ${chakraElegido.nombreSanscrito}\n\n${result.texto}`,
          metadatos: { pregunta, chakra: chakraElegido.id, fecha: fechaHoy, nombre, signo },
        })
      }
    } catch (err) {
      console.error('[ChakraOracle]', err)
      setErrorMsg('Error inesperado. Inténtalo de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  const handleValorar = (valor: 1 | -1) => {
    if (yaValorado) return
    setYaValorado(true)
    analytics.registrarValoracion(valor)
  }

  const resetear = () => {
    setFase('preguntar'); setChakra(null); setInterpretacion('')
    setErrorMsg(''); setPregunta(''); lecturaGuardadaRef.current = false
  }

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <button onClick={() => fase !== 'preguntar' ? resetear() : navigate('/tradiciones')} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Chakra Oracle</p>
            <p className="text-purple-300 text-xs">Sistema de chakras · Tradición hindú</p>
          </div>
          <span className="text-purple-400 text-xs border border-purple-400/30 rounded-full px-2 py-0.5">✨ Premium</span>
        </div>

        {fase === 'preguntar' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#080810] border border-purple-900/40 rounded-3xl p-6 text-center">
              <div className="flex justify-center gap-2 mb-3">
                {CHAKRAS.map(c => (
                  <div key={c.id} className="w-4 h-4 rounded-full" style={{ backgroundColor: c.color, opacity: 0.8 }}/>
                ))}
              </div>
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-2">Los 7 Chakras</p>
              <p className="text-white/60 text-xs leading-relaxed">El sistema de chakras describe 7 centros de energía a lo largo de la columna vertebral. Cada uno rige un aspecto diferente de tu vida — desde la supervivencia hasta la conexión espiritual.</p>
            </div>
            <div className="bg-[#080810] border border-white/10 rounded-3xl p-6">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">Tu consulta</p>
              <textarea
                value={pregunta}
                onChange={e => setPregunta(e.target.value)}
                placeholder="¿Qué situación quieres explorar?"
                rows={4}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30"
              />
            </div>
            <DisclaimerIA compact />
            <button
              onClick={consultar}
              disabled={!pregunta.trim() || revelando}
              className="w-full bg-gradient-to-r from-purple-700 to-violet-700 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >
              {revelando ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-pulse">◈</span> Activando el chakra...
                </span>
              ) : 'Consultar el Chakra Oracle'}
            </button>
          </div>
        )}

        {fase === 'resultado' && chakra && (
          <div className="flex flex-col gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <p className="text-white/50 text-xs italic">"{pregunta}"</p>
            </div>
            <div className="rounded-3xl overflow-hidden border" style={{ borderColor: `${chakra.color}30` }}>
              <ChakraSVG chakra={chakra} />
            </div>
            <div className="rounded-3xl p-5 border" style={{ background: '#080810', borderColor: `${chakra.color}30` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: chakra.color }}/>
                <div>
                  <p className="text-white font-bold">{chakra.nombreSanscrito} · {chakra.nombre}</p>
                  <p className="text-xs" style={{ color: chakra.color }}>Chakra {chakra.numero} · {chakra.petalos} pétalos · Mantra: {chakra.mantraBija}</p>
                </div>
              </div>
              <p className="text-white/50 text-xs mb-2">{chakra.simbolismo}</p>
              <div className="border-t border-white/10 pt-3 mt-3">
                <p className="text-white/30 text-xs">{chakra.elemento} · {chakra.ubicacion}</p>
              </div>
            </div>
            <div className="bg-[#080810] border border-white/10 rounded-3xl p-6">
              <p className="text-xs tracking-widest uppercase mb-4" style={{ color: chakra.color }}>Lectura del chakra</p>
              {cargando ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: chakra.color, animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: chakra.color, animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: chakra.color, animationDelay: '300ms' }} />
                </div>
              ) : errorMsg ? (
                <p className="text-red-300 text-sm">{errorMsg}</p>
              ) : (
                <TextoIA texto={interpretacion} />
              )}
            </div>
            {!cargando && interpretacion && (
              <>
                <DisclaimerIA />
                <Valoracion onValorar={handleValorar} />
                <Compartir
                  titulo={`Chakra Oracle · ${chakra.nombreSanscrito}`}
                  texto={`${chakra.nombreSanscrito} · ${chakra.simbolismo}\n\n${interpretacion}`}
                  hashtags={['Universe', 'ChakraOracle', chakra.nombreSanscrito]}
                />
                <button
                  onClick={() => navigate('/guia')}
                  className="w-full text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
                  style={{ background: `linear-gradient(to right, ${chakra.color}99, ${chakra.color}66)` }}
                >
                  Explorar con mi Guía IA
                </button>
                <button onClick={resetear} className="w-full text-sm py-2" style={{ color: `${chakra.color}60` }}>Nueva consulta</button>
              </>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}