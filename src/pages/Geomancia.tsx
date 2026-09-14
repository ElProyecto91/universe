// src/pages/Geomancia.tsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserPlan, incrementarConsulta } from '../hooks/useUserPlan'
import { useAnalytics } from '../hooks/useAnalytics'
import { guardarLectura } from '../hooks/useHistorial'
import { llamarGemini } from '../lib/gemini'
import { lanzarFigura, FiguraGeomantica } from '../lib/motores/geomancia'
import Compartir from '../components/Compartir'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import PageLayout from '../components/PageLayout'
import TextoIA from '../components/TextoIA'

const HERRAMIENTA = 'geomancia'

// SVG dinámico estilo manuscrito árabe medieval
function FiguraSVG({ figura }: { figura: FiguraGeomantica }) {
  const FILAS = [
    { arabe: 'رأس', latin: 'Caput' },
    { arabe: 'عنق', latin: 'Collum' },
    { arabe: 'جسم', latin: 'Corpus' },
    { arabe: 'قدم', latin: 'Pedes' },
  ]
  const Y_INICIO = 170
  const Y_PASO   = 70

  return (
    <svg width="100%" viewBox="0 0 380 520" role="img">
      <title>{figura.nombreLatin}</title>
      <desc>Figura geomántica {figura.nombreLatin} — {figura.energia}</desc>

      <defs>
        <radialGradient id="gPunto" cx="35%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#F0C830"/>
          <stop offset="100%" stopColor="#8B6000"/>
        </radialGradient>
      </defs>

      {/* Fondo pergamino */}
      <rect width="380" height="520" fill="#1a1208"/>

      {/* Marco exterior doble */}
      <rect x="18" y="18" width="344" height="484" rx="3" fill="none" stroke="#8B6914" strokeWidth="2"/>
      <rect x="24" y="24" width="332" height="472" rx="2" fill="none" stroke="#6B4F10" strokeWidth="0.8"/>

      {/* Líneas decorativas laterales */}
      <line x1="18" y1="60" x2="44" y2="60" stroke="#8B6914" strokeWidth="0.5"/>
      <line x1="336" y1="60" x2="362" y2="60" stroke="#8B6914" strokeWidth="0.5"/>
      <line x1="18" y1="460" x2="44" y2="460" stroke="#8B6914" strokeWidth="0.5"/>
      <line x1="336" y1="460" x2="362" y2="460" stroke="#8B6914" strokeWidth="0.5"/>

      {/* Ornamentos de esquina */}
      {[[18,18],[362,18],[18,502],[362,502]].map(([cx,cy], i) => (
        <rect key={i} x={cx-5} y={cy-5} width="10" height="10"
          transform={`rotate(45 ${cx} ${cy})`} fill="#8B6914"/>
      ))}

      {/* Título árabe */}
      <text x="190" y="58" fill="#C8980A"
        fontFamily="serif" fontSize="18" textAnchor="middle">
        عِلْمُ الرَّمْل
      </text>
      <line x1="60" y1="68" x2="320" y2="68" stroke="#8B6914" strokeWidth="0.5"/>
      <line x1="80" y1="72" x2="300" y2="72" stroke="#8B6914" strokeWidth="0.5"/>

      {/* Nombre latín */}
      <text x="190" y="102" fill="#D4A820"
        fontFamily="serif" fontSize="22" textAnchor="middle" fontStyle="italic">
        {figura.nombreLatin}
      </text>
      {/* Nombre árabe de la figura */}
      <text x="190" y="122" fill="#A07820"
        fontFamily="serif" fontSize="12" textAnchor="middle">
        {figura.nombreArabe}
      </text>

      <line x1="100" y1="132" x2="280" y2="132" stroke="#8B6914" strokeWidth="0.5"/>

      {/* Filas de puntos */}
      {figura.patron.map((val, i) => {
        const cy = Y_INICIO + i * Y_PASO
        return (
          <g key={i}>
            {/* Etiqueta árabe izquierda */}
            <text x="68" y={cy + 5} fill="#7A5C18"
              fontFamily="serif" fontSize="11" textAnchor="middle">
              {FILAS[i].arabe}
            </text>
            {/* Etiqueta latina derecha */}
            <text x="312" y={cy + 5} fill="#5A4010"
              fontFamily="serif" fontSize="11" textAnchor="middle">
              {FILAS[i].latin}
            </text>

            {val === 1 ? (
              /* 1 punto — impar/activo */
              <g>
                <circle cx="190" cy={cy} r="16" fill="url(#gPunto)"/>
                <circle cx="190" cy={cy} r="12" fill="none" stroke="#8B6000" strokeWidth="0.5"/>
              </g>
            ) : (
              /* 2 puntos — par/pasivo */
              <g>
                <circle cx="158" cy={cy} r="13" fill="url(#gPunto)"/>
                <circle cx="158" cy={cy} r="9" fill="none" stroke="#8B6000" strokeWidth="0.5"/>
                <circle cx="222" cy={cy} r="13" fill="url(#gPunto)"/>
                <circle cx="222" cy={cy} r="9" fill="none" stroke="#8B6000" strokeWidth="0.5"/>
              </g>
            )}

            {/* Línea divisoria entre filas */}
            {i < 3 && (
              <line x1="100" y1={cy + 35} x2="280" y2={cy + 35}
                stroke="#6B4F10" strokeWidth="0.5" strokeDasharray="3,3"/>
            )}
          </g>
        )
      })}

      {/* Separador inferior */}
      <line x1="80" y1="418" x2="300" y2="418" stroke="#8B6914" strokeWidth="0.5"/>
      <line x1="60" y1="422" x2="320" y2="422" stroke="#8B6914" strokeWidth="0.5"/>

      {/* Planeta y elemento */}
      <text x="190" y="446" fill="#A07820"
        fontFamily="serif" fontSize="13" textAnchor="middle" fontStyle="italic">
        {figura.planeta} · {figura.elemento}
      </text>
      <text x="190" y="464" fill="#7A5C18"
        fontFamily="serif" fontSize="11" textAnchor="middle">
        {figura.energia}
      </text>

      {/* Ornamento central inferior */}
      <circle cx="190" cy="484" r="4" fill="#8B6914"/>
      <line x1="160" y1="484" x2="180" y2="484" stroke="#8B6914" strokeWidth="0.5"/>
      <line x1="200" y1="484" x2="220" y2="484" stroke="#8B6914" strokeWidth="0.5"/>
    </svg>
  )
}

export default function Geomancia() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [pregunta,       setPregunta]       = useState('')
  const [figura,         setFigura]         = useState<FiguraGeomantica | null>(null)
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando,       setCargando]       = useState(false)
  const [lanzando,       setLanzando]       = useState(false)
  const [fase,           setFase]           = useState<'preguntar' | 'lanzar' | 'resultado'>('preguntar')
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

  const handleLanzar = async () => {
    setLanzando(true)
    await new Promise(r => setTimeout(r, 1800))
    const figuraResultado = lanzarFigura()
    setFigura(figuraResultado)
    setLanzando(false)
    setFase('resultado')
    consultar(figuraResultado)
  }

  const consultar = async (figuraActual: FiguraGeomantica) => {
    setCargando(true); setErrorMsg('')
    const t0 = Date.now()

    try {
      const prompt = [
        'Eres un maestro de geomancia árabe (ʿilm al-raml), la ciencia de la arena.',
        `El consultante se llama ${nombre}, signo ${signo}. Su pregunta: "${pregunta}".`,
        `La figura que ha caído es ${figuraActual.nombreLatin} (${figuraActual.nombreArabe}).`,
        `Planeta: ${figuraActual.planeta}. Elemento: ${figuraActual.elemento}. Energía: ${figuraActual.energia}.`,
        '',
        'Escribe en español, en prosa sabia y directa, sin listas ni asteriscos. Sin saludar.',
        'Escribe exactamente 3 párrafos separados por línea en blanco. Cada párrafo máximo 3 frases.',
        `Párrafo 1: qué dice ${figuraActual.nombreLatin} sobre la situación actual — su energía y lo que revela.`,
        'Párrafo 2: qué fuerzas o influencias señala esta figura en relación con la pregunta.',
        'Párrafo 3: el consejo práctico del geomante — qué hacer con esta información.',
        'Tono ancestral, preciso y sabio. Termina en punto.',
      ].join('\n')

      const result = await llamarGemini({
        herramienta: HERRAMIENTA,
        prompt,
        userId: userPlan.userId,
        usarLite: true,
        cacheable: false,
        maxTokens: 500,
      })

      if (result.error || !result.texto) {
        setErrorMsg('La arena guarda silencio. Inténtalo de nuevo.')
        return
      }

      setInterpretacion(result.texto)
      if (userPlan.userId) await incrementarConsulta(userPlan.userId)
      analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: 'lite' })
      if (!lecturaGuardadaRef.current) {
        lecturaGuardadaRef.current = true
        await guardarLectura({
          herramienta: HERRAMIENTA,
          titulo: `Geomancia · ${figuraActual.nombreLatin} · ${fechaHoy}`,
          contenido: `Consulta: "${pregunta}"\nFigura: ${figuraActual.nombreLatin}\n\n${result.texto}`,
          metadatos: { pregunta, figura: figuraActual.nombre, fecha: fechaHoy, nombre, signo },
        })
      }
    } catch (err) {
      console.error('[Geomancia]', err)
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
    setFase('preguntar'); setPregunta(''); setFigura(null)
    setInterpretacion(''); setErrorMsg(''); lecturaGuardadaRef.current = false
  }

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">

        <div className="flex items-center">
          <button
            onClick={() => fase !== 'preguntar' ? resetear() : navigate('/tradiciones')}
            className="text-purple-300 text-sm"
          >← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Geomancia · علم الرمل</p>
            <p className="text-purple-300 text-xs">Ciencia de la arena · Tradición árabe</p>
          </div>
          <span className="text-purple-400 text-xs border border-purple-400/30 rounded-full px-2 py-0.5">✨ Premium</span>
        </div>

        {/* FASE: PREGUNTAR */}
        {fase === 'preguntar' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-amber-800/40 rounded-3xl p-6 text-center">
              <p className="text-4xl mb-3">🏺</p>
              <p className="text-amber-600 text-xs tracking-widest uppercase mb-2">ʿIlm al-Raml · علم الرمل</p>
              <p className="text-white/60 text-xs leading-relaxed">La ciencia de la arena nació en el norte de África en el siglo IX. Dieciséis figuras formadas por puntos revelan la energía de cualquier pregunta. Patrimonio de la sabiduría islámica medieval.</p>
            </div>
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-amber-600 text-xs tracking-widest uppercase mb-3">Tu consulta al geomante</p>
              <textarea
                value={pregunta}
                onChange={e => setPregunta(e.target.value)}
                placeholder="Formula tu pregunta con precisión y honestidad..."
                rows={4}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30"
              />
            </div>
            <DisclaimerIA compact />
            <button
              onClick={() => setFase('lanzar')}
              disabled={!pregunta.trim()}
              className="w-full bg-gradient-to-r from-amber-900 to-yellow-800 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >
              Preparar el lanzamiento
            </button>
          </div>
        )}

        {/* FASE: LANZAR */}
        {fase === 'lanzar' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-amber-800/40 rounded-3xl p-8 text-center">
              <p className="text-5xl mb-4">✍️</p>
              <p className="text-amber-600 text-xs tracking-widest uppercase mb-3">El geomante traza los puntos</p>
              <p className="text-white/60 text-xs leading-relaxed mb-4">
                En la tradición árabe, el geomante traza hileras de puntos al azar sobre la arena — de derecha a izquierda, como la escritura árabe. Los puntos pares e impares revelan una de las 16 figuras sagradas.
              </p>
              <div className="bg-white/5 rounded-2xl px-4 py-3">
                <p className="text-white/50 text-xs italic">"{pregunta}"</p>
              </div>
            </div>
            <button
              onClick={handleLanzar}
              disabled={lanzando}
              className="w-full bg-gradient-to-r from-amber-900 to-yellow-800 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >
              {lanzando ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-pulse">✦</span> Trazando los puntos en la arena...
                </span>
              ) : 'Trazar los puntos'}
            </button>
          </div>
        )}

        {/* FASE: RESULTADO */}
        {fase === 'resultado' && figura && (
          <div className="flex flex-col gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <p className="text-white/50 text-xs italic">"{pregunta}"</p>
            </div>

            {/* SVG manuscrito */}
            <div className="rounded-3xl overflow-hidden border border-amber-900/40">
              <FiguraSVG figura={figura} />
            </div>

            {/* Mensaje estático de la figura */}
            <div className="bg-[#0d0015] border border-amber-900/30 rounded-2xl p-4">
              <p className="text-amber-600/80 text-xs tracking-widest uppercase mb-2">Energía de la figura</p>
              <p className="text-white/70 text-sm leading-relaxed">{figura.mensaje}</p>
            </div>

            {/* Interpretación IA */}
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-amber-600 text-xs tracking-widest uppercase mb-4">La lectura del geomante</p>
              {cargando ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 bg-amber-700 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-amber-700 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-amber-700 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
                  titulo={`Geomancia · ${figura.nombreLatin}`}
                  texto={`${figura.nombreLatin} (${figura.nombreArabe})\n${figura.energia}\n\n${interpretacion}`}
                  hashtags={['Universe', 'Geomancia', 'IlmAlRaml']}
                />
                <button
                  onClick={() => navigate('/guia')}
                  className="w-full bg-gradient-to-r from-amber-900 to-yellow-800 text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
                >
                  Explorar con mi Guía IA
                </button>
                <button
                  onClick={resetear}
                  className="w-full text-amber-700/60 text-sm py-2"
                >
                  Nueva consulta
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}