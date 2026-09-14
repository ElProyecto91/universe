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

const HERRAMIENTA = 'oracle-mix'

const ARCANOS = [
  { num: 'I',    nombre: 'El Mago',         simbolo: '🪄' },
  { num: 'II',   nombre: 'La Sacerdotisa',  simbolo: '🌙' },
  { num: 'III',  nombre: 'La Emperatriz',   simbolo: '🌿' },
  { num: 'IV',   nombre: 'El Emperador',    simbolo: '⚡' },
  { num: 'V',    nombre: 'El Hierofante',   simbolo: '🔑' },
  { num: 'VI',   nombre: 'Los Amantes',     simbolo: '♡' },
  { num: 'VII',  nombre: 'El Carro',        simbolo: '⚔' },
  { num: 'VIII', nombre: 'La Fuerza',       simbolo: '∞' },
  { num: 'IX',   nombre: 'El Ermitaño',     simbolo: '🕯' },
  { num: 'X',    nombre: 'Rueda Fortuna',   simbolo: '☸' },
  { num: 'XI',   nombre: 'La Justicia',     simbolo: '⚖' },
  { num: 'XII',  nombre: 'El Colgado',      simbolo: '⊕' },
  { num: 'XIII', nombre: 'La Muerte',       simbolo: '☽' },
  { num: 'XIV',  nombre: 'La Templanza',    simbolo: '◈' },
  { num: 'XV',   nombre: 'El Diablo',       simbolo: '⛓' },
  { num: 'XVI',  nombre: 'La Torre',        simbolo: '⚡' },
  { num: 'XVII', nombre: 'La Estrella',     simbolo: '★' },
  { num: 'XVIII',nombre: 'La Luna',         simbolo: '🌒' },
  { num: 'XIX',  nombre: 'El Sol',          simbolo: '☀' },
  { num: 'XX',   nombre: 'El Juicio',       simbolo: '🎺' },
  { num: 'XXI',  nombre: 'El Mundo',        simbolo: '🌍' },
  { num: '0',    nombre: 'El Loco',         simbolo: '∘' },
]

const PLANETAS = [
  { simbolo: '☉', nombre: 'Sol',     energia: 'Identidad · Propósito · Vitalidad' },
  { simbolo: '☽', nombre: 'Luna',    energia: 'Intuición · Emociones · Ciclos' },
  { simbolo: '☿', nombre: 'Mercurio',energia: 'Comunicación · Mente · Mensajes' },
  { simbolo: '♀', nombre: 'Venus',   energia: 'Amor · Belleza · Valores' },
  { simbolo: '♂', nombre: 'Marte',   energia: 'Acción · Voluntad · Energía' },
  { simbolo: '♃', nombre: 'Júpiter', energia: 'Expansión · Abundancia · Fe' },
  { simbolo: '♄', nombre: 'Saturno', energia: 'Disciplina · Karma · Tiempo' },
  { simbolo: '⛢', nombre: 'Urano',   energia: 'Innovación · Cambio · Libertad' },
]

function calcularNumHoy(): number {
  const hoy = new Date()
  const suma = `${hoy.getDate()}${hoy.getMonth() + 1}${hoy.getFullYear()}`
    .split('').reduce((a, b) => a + parseInt(b), 0)
  let n = suma
  while (n > 9) n = String(n).split('').reduce((a, b) => a + parseInt(b), 0)
  return n
}

const SIGNIFICADOS_NUM: Record<number, { nombre: string; energia: string }> = {
  1: { nombre: 'El Uno',    energia: 'Inicio · Liderazgo · Originalidad' },
  2: { nombre: 'El Dos',    energia: 'Dualidad · Cooperación · Intuición' },
  3: { nombre: 'El Tres',   energia: 'Creatividad · Expresión · Alegría' },
  4: { nombre: 'El Cuatro', energia: 'Estabilidad · Trabajo · Fundamentos' },
  5: { nombre: 'El Cinco',  energia: 'Cambio · Libertad · Aventura' },
  6: { nombre: 'El Seis',   energia: 'Armonía · Responsabilidad · Amor' },
  7: { nombre: 'El Siete',  energia: 'Sabiduría · Introspección · Misterio' },
  8: { nombre: 'El Ocho',   energia: 'Poder · Abundancia · Transformación' },
  9: { nombre: 'El Nueve',  energia: 'Completitud · Sabiduría · Servicio' },
}

function MandalaResultado({ arcano, planeta, numHoy }: {
  arcano: typeof ARCANOS[0]
  planeta: typeof PLANETAS[0]
  numHoy: number
}) {
  return (
    <svg width="100%" viewBox="0 0 380 380" role="img">
      <title>Oracle Mix — {arcano.nombre} · {planeta.nombre} · {numHoy}</title>
      <desc>Mandala de tres tradiciones: tarot, astrología y numerología</desc>
      <rect width="380" height="380" fill="#080810"/>
      <g transform="translate(190,190)">
        {/* Anillo exterior — Numerología */}
        <circle cx="0" cy="0" r="148" fill="none" stroke="#0d1a2a" strokeWidth="32"/>
        <circle cx="0" cy="0" r="148" fill="none" stroke="#1a4080" strokeWidth="1"/>
        <circle cx="0" cy="0" r="132" fill="none" stroke="#0d2040" strokeWidth="0.5"/>
        {/* Número grande arriba */}
        <text x="0" y="-138" fill="#4090C0" fontFamily="serif" fontSize="28" fontWeight="bold" textAnchor="middle">{numHoy}</text>
        <text x="0" y="-118" fill="#2a5080" fontFamily="serif" fontSize="10" textAnchor="middle" letterSpacing="1">{SIGNIFICADOS_NUM[numHoy]?.nombre}</text>
        {/* Números pequeños alrededor */}
        {[1,2,3,4,5,6,7,8,9].map((n, i) => {
          const angle = (i * 40 - 90) * Math.PI / 180
          const x = Math.cos(angle) * 148
          const y = Math.sin(angle) * 148
          return n !== numHoy ? (
            <text key={n} x={x} y={y + 4} fill="#1a3050" fontFamily="serif" fontSize="12" textAnchor="middle">{n}</text>
          ) : null
        })}

        {/* Anillo medio — Astrología */}
        <circle cx="0" cy="0" r="100" fill="none" stroke="#1a1508" strokeWidth="26"/>
        <circle cx="0" cy="0" r="100" fill="none" stroke="#806000" strokeWidth="1"/>
        <circle cx="0" cy="0" r="87" fill="none" stroke="#402800" strokeWidth="0.5"/>
        {/* Símbolo planeta grande */}
        <text x="0" y="8" fill="#FFD700" fontFamily="serif" fontSize="36" textAnchor="middle">{planeta.simbolo}</text>
        {/* Planetas pequeños */}
        {PLANETAS.map((p, i) => {
          const angle = (i * 45 - 90) * Math.PI / 180
          const x = Math.cos(angle) * 100
          const y = Math.sin(angle) * 100
          return p.simbolo !== planeta.simbolo ? (
            <text key={p.simbolo} x={x} y={y + 4} fill="#403000" fontFamily="serif" fontSize="14" textAnchor="middle">{p.simbolo}</text>
          ) : null
        })}
        <text x="0" y="28" fill="#806000" fontFamily="serif" fontSize="10" textAnchor="middle">{planeta.nombre}</text>

        {/* Círculo centro — Tarot */}
        <circle cx="0" cy="0" r="58" fill="#12082a" stroke="#4a2080" strokeWidth="1.5"/>
        <circle cx="0" cy="0" r="50" fill="none" stroke="#2a1050" strokeWidth="0.5"/>
        {/* Pentagrama sutil */}
        <polygon points="0,-42 10,-13 40,-13 17,6 26,35 0,17 -26,35 -17,6 -40,-13 -10,-13"
          fill="none" stroke="#3a1860" strokeWidth="0.6"/>
        {/* Número romano */}
        <text x="0" y="-16" fill="#9040E0" fontFamily="serif" fontSize="13" textAnchor="middle">{arcano.num}</text>
        {/* Nombre arcano */}
        <text x="0" y="4" fill="#C060FF" fontFamily="serif" fontSize="11" textAnchor="middle">{arcano.nombre.split(' ')[0]}</text>
        {arcano.nombre.split(' ').length > 1 && (
          <text x="0" y="17" fill="#C060FF" fontFamily="serif" fontSize="11" textAnchor="middle">{arcano.nombre.split(' ').slice(1).join(' ')}</text>
        )}
      </g>
    </svg>
  )
}

export default function OracleMix() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [pregunta,       setPregunta]       = useState('')
  const [arcano,         setArcano]         = useState<typeof ARCANOS[0] | null>(null)
  const [planeta,        setPlaneta]        = useState<typeof PLANETAS[0] | null>(null)
  const [numHoy,         setNumHoy]         = useState(0)
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
    await new Promise(r => setTimeout(r, 1200))

    const arcanoElegido  = ARCANOS[Math.floor(Math.random() * ARCANOS.length)]
    const planetaElegido = PLANETAS[Math.floor(Math.random() * PLANETAS.length)]
    const num            = calcularNumHoy()

    setArcano(arcanoElegido)
    setPlaneta(planetaElegido)
    setNumHoy(num)
    setRevelando(false)
    setFase('resultado')

    setCargando(true); setErrorMsg('')
    const t0 = Date.now()

    try {
      const prompt = [
        'Eres un oráculo que combina tarot, astrología y numerología en una sola lectura integrada.',
        `El consultante se llama ${nombre}, signo ${signo}. Su pregunta: "${pregunta}".`,
        `Arcano del Tarot: ${arcanoElegido.num} — ${arcanoElegido.nombre}.`,
        `Planeta astrológico: ${planetaElegido.nombre} (${planetaElegido.simbolo}) — ${planetaElegido.energia}.`,
        `Número numerológico del día: ${num} — ${SIGNIFICADOS_NUM[num]?.energia}.`,
        '',
        'Escribe en español, en prosa fluida y sabia, sin listas ni asteriscos. Sin saludar.',
        'Escribe exactamente 3 párrafos separados por línea en blanco. Cada párrafo máximo 3 frases.',
        `Párrafo 1: perspectiva del tarot — qué dice ${arcanoElegido.nombre} sobre la situación y qué energía arquetípica está presente.`,
        `Párrafo 2: perspectiva astrológica — cómo la energía de ${planetaElegido.nombre} ilumina esta situación y qué influencia planetaria está activa.`,
        `Párrafo 3: perspectiva numerológica — el número ${num} vibra hoy. Integra las tres tradiciones en un consejo concreto y unificado.`,
        'Tono poético, profundo y práctico. Termina en punto.',
      ].join('\n')

      const result = await llamarGemini({
        herramienta: HERRAMIENTA, prompt,
        userId: userPlan.userId, usarLite: true, cacheable: false, maxTokens: 500,
      })

      if (result.error || !result.texto) {
        setErrorMsg('El universo guarda silencio. Inténtalo de nuevo.')
        return
      }

      setInterpretacion(result.texto)
      if (userPlan.userId) await incrementarConsulta(userPlan.userId)
      analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: 'lite' })
      if (!lecturaGuardadaRef.current) {
        lecturaGuardadaRef.current = true
        await guardarLectura({
          herramienta: HERRAMIENTA,
          titulo: `Oracle Mix · ${arcanoElegido.nombre} · ${fechaHoy}`,
          contenido: `Consulta: "${pregunta}"\nTarot: ${arcanoElegido.nombre} · Planeta: ${planetaElegido.nombre} · Número: ${num}\n\n${result.texto}`,
          metadatos: { pregunta, arcano: arcanoElegido.nombre, planeta: planetaElegido.nombre, numero: num, fecha: fechaHoy, nombre, signo },
        })
      }
    } catch (err) {
      console.error('[OracleMix]', err)
      setErrorMsg('Error inesperado.')
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
    setFase('preguntar'); setPregunta(''); setArcano(null)
    setPlaneta(null); setNumHoy(0); setInterpretacion('')
    setErrorMsg(''); lecturaGuardadaRef.current = false
  }

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">

        <div className="flex items-center">
          <button onClick={() => fase !== 'preguntar' ? resetear() : navigate('/tradiciones')} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Oracle Mix</p>
            <p className="text-purple-300 text-xs">Tarot · Astrología · Numerología</p>
          </div>
          <span className="text-purple-400 text-xs border border-purple-400/30 rounded-full px-2 py-0.5">✨ Premium</span>
        </div>

        {/* FASE: PREGUNTAR */}
        {fase === 'preguntar' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#080810] border border-purple-900/40 rounded-3xl p-6 text-center">
              <p className="text-4xl mb-3">🔮</p>
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-2">Tres tradiciones · Una respuesta</p>
              <p className="text-white/60 text-xs leading-relaxed">El Oracle Mix combina el simbolismo arquetípico del Tarot, la energía planetaria de la Astrología y la vibración numérica del día. Tres voces antiguas para una sola pregunta.</p>
            </div>

            {/* Mini mandala estático de presentación */}
            <div className="rounded-3xl overflow-hidden border border-purple-900/30">
              <svg width="100%" viewBox="0 0 380 200" role="img">
                <title>Tres tradiciones</title>
                <desc>Representación de las tres tradiciones del Oracle Mix</desc>
                <rect width="380" height="200" fill="#080810"/>
                <g transform="translate(190,100)">
                  <circle cx="0" cy="0" r="88" fill="none" stroke="#0d1a2a" strokeWidth="20"/>
                  <circle cx="0" cy="0" r="88" fill="none" stroke="#1a4080" strokeWidth="0.8"/>
                  <text x="0" y="-76" fill="#4090C0" fontFamily="serif" fontSize="14" textAnchor="middle">7</text>
                  <text x="60" y="-56" fill="#2a5080" fontFamily="serif" fontSize="11" textAnchor="middle">3</text>
                  <text x="84" y="6" fill="#2a5080" fontFamily="serif" fontSize="11" textAnchor="middle">9</text>
                  <text x="54" y="64" fill="#2a5080" fontFamily="serif" fontSize="11" textAnchor="middle">1</text>
                  <text x="-54" y="64" fill="#2a5080" fontFamily="serif" fontSize="11" textAnchor="middle">5</text>
                  <text x="-84" y="6" fill="#2a5080" fontFamily="serif" fontSize="11" textAnchor="middle">8</text>
                  <text x="-60" y="-56" fill="#2a5080" fontFamily="serif" fontSize="11" textAnchor="middle">2</text>
                  <circle cx="0" cy="0" r="60" fill="none" stroke="#1a1508" strokeWidth="18"/>
                  <circle cx="0" cy="0" r="60" fill="none" stroke="#806000" strokeWidth="0.8"/>
                  <text x="0" y="-50" fill="#FFD700" fontFamily="serif" fontSize="18" textAnchor="middle">☉</text>
                  <text x="42" y="-28" fill="#403000" fontFamily="serif" fontSize="13" textAnchor="middle">☽</text>
                  <text x="50" y="18" fill="#403000" fontFamily="serif" fontSize="13" textAnchor="middle">♀</text>
                  <text x="26" y="52" fill="#403000" fontFamily="serif" fontSize="13" textAnchor="middle">♂</text>
                  <text x="-26" y="52" fill="#403000" fontFamily="serif" fontSize="13" textAnchor="middle">♃</text>
                  <text x="-50" y="18" fill="#403000" fontFamily="serif" fontSize="13" textAnchor="middle">♄</text>
                  <text x="-42" y="-28" fill="#403000" fontFamily="serif" fontSize="13" textAnchor="middle">☿</text>
                  <circle cx="0" cy="0" r="34" fill="#12082a" stroke="#4a2080" strokeWidth="1.2"/>
                  <polygon points="0,-28 7,-8 26,-8 11,4 17,23 0,12 -17,23 -11,4 -26,-8 -7,-8" fill="none" stroke="#3a1860" strokeWidth="0.5"/>
                  <text x="0" y="6" fill="#C060FF" fontFamily="serif" fontSize="12" textAnchor="middle">XVII</text>
                </g>
                <text x="60" y="188" fill="#2a5080" fontFamily="serif" fontSize="9" textAnchor="middle" letterSpacing="1">NUMEROLOGÍA</text>
                <text x="190" y="188" fill="#806000" fontFamily="serif" fontSize="9" textAnchor="middle" letterSpacing="1">ASTROLOGÍA</text>
                <text x="320" y="188" fill="#4a2080" fontFamily="serif" fontSize="9" textAnchor="middle" letterSpacing="1">TAROT</text>
              </svg>
            </div>

            <div className="bg-[#080810] border border-white/10 rounded-3xl p-6">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">Tu consulta</p>
              <textarea
                value={pregunta}
                onChange={e => setPregunta(e.target.value)}
                placeholder="¿Qué quieres explorar desde las tres tradiciones?"
                rows={4}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30"
              />
            </div>
            <DisclaimerIA compact />
            <button
              onClick={consultar}
              disabled={!pregunta.trim() || revelando}
              className="w-full bg-gradient-to-r from-purple-900 to-indigo-900 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40 border border-purple-700/50"
            >
              {revelando ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">✦</span> Alineando las tres tradiciones...
                </span>
              ) : 'Consultar el Oracle Mix'}
            </button>
          </div>
        )}

        {/* FASE: RESULTADO */}
        {fase === 'resultado' && arcano && planeta && (
          <div className="flex flex-col gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <p className="text-white/50 text-xs italic">"{pregunta}"</p>
            </div>

            {/* Mandala dinámico */}
            <div className="rounded-3xl overflow-hidden border border-purple-900/30">
              <MandalaResultado arcano={arcano} planeta={planeta} numHoy={numHoy} />
            </div>

            {/* Las tres capas */}
            <div className="flex flex-col gap-2">
              <div className="bg-[#080810] border border-purple-900/30 rounded-2xl p-3 flex items-center gap-3">
                <p className="text-purple-400 text-lg" style={{ fontFamily: 'serif' }}>{arcano.num}</p>
                <div>
                  <p className="text-purple-300 text-xs font-semibold">{arcano.nombre}</p>
                  <p className="text-purple-900 text-xs">Tarot · Arcano Mayor</p>
                </div>
              </div>
              <div className="bg-[#080810] border border-amber-900/30 rounded-2xl p-3 flex items-center gap-3">
                <p className="text-amber-400 text-2xl" style={{ fontFamily: 'serif' }}>{planeta.simbolo}</p>
                <div>
                  <p className="text-amber-300 text-xs font-semibold">{planeta.nombre}</p>
                  <p className="text-amber-900 text-xs">{planeta.energia}</p>
                </div>
              </div>
              <div className="bg-[#080810] border border-blue-900/30 rounded-2xl p-3 flex items-center gap-3">
                <p className="text-blue-400 text-2xl font-bold" style={{ fontFamily: 'serif' }}>{numHoy}</p>
                <div>
                  <p className="text-blue-300 text-xs font-semibold">{SIGNIFICADOS_NUM[numHoy]?.nombre}</p>
                  <p className="text-blue-900 text-xs">{SIGNIFICADOS_NUM[numHoy]?.energia}</p>
                </div>
              </div>
            </div>

            {/* Interpretación IA */}
            <div className="bg-[#080810] border border-white/10 rounded-3xl p-6">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-4">Las tres voces · Una lectura</p>
              {cargando ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
                  titulo="Oracle Mix"
                  texto={`${arcano.nombre} · ${planeta.nombre} · ${numHoy}\n\n${interpretacion}`}
                  hashtags={['Universe', 'OracleMix', 'Tarot']}
                />
                <button onClick={() => navigate('/guia')} className="w-full bg-gradient-to-r from-purple-900 to-indigo-900 text-white font-semibold py-4 rounded-full hover:opacity-90 transition border border-purple-700/50">Explorar con mi Guía IA</button>
                <button onClick={resetear} className="w-full text-purple-700/60 text-sm py-2">Nueva consulta</button>
              </>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}