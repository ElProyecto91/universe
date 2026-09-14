import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserPlan, incrementarConsulta } from '../hooks/useUserPlan'
import { useAnalytics } from '../hooks/useAnalytics'
import { guardarLectura } from '../hooks/useHistorial'
import { llamarGemini } from '../lib/gemini'
import { lanzarMo, SILABAS, SilabaMo, CombinacionMo } from '../lib/motores/tibetanMo'
import Compartir from '../components/Compartir'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import PageLayout from '../components/PageLayout'
import TextoIA from '../components/TextoIA'

const HERRAMIENTA = 'tibetan-mo'

const COLORES_FAVORABLE = {
  positivo: '#C8A050',
  neutro:   '#8B6FC0',
  negativo: '#8B3030',
}

function DadoSVG({ silaba, elemento }: { silaba: SilabaMo; elemento: string }) {
  return (
    <svg width="100%" viewBox="0 0 160 160" role="img">
      <title>Dado Mo — {silaba}</title>
      <desc>Dado tibetano con la sílaba {silaba}</desc>
      <rect x="8" y="8" width="144" height="144" rx="20" fill="#1a0a30" stroke="#6B3FA0" strokeWidth="2"/>
      <rect x="14" y="14" width="132" height="132" rx="16" fill="none" stroke="#9B6FD0" strokeWidth="0.5"/>
      <circle cx="30" cy="30" r="4" fill="#3A1A60"/>
      <circle cx="130" cy="30" r="4" fill="#3A1A60"/>
      <circle cx="30" cy="130" r="4" fill="#3A1A60"/>
      <circle cx="130" cy="130" r="4" fill="#3A1A60"/>
      <text x="80" y="96"
        fill={SILABAS[silaba].color}
        fontFamily="serif"
        fontSize={silaba === 'TSA' || silaba === 'DHI' ? '34' : '42'}
        fontWeight="bold"
        textAnchor="middle"
      >{silaba}</text>
      <text x="80" y="118"
        fill="#6A5090"
        fontFamily="serif"
        fontSize="11"
        textAnchor="middle"
        fontStyle="italic"
      >{elemento}</text>
    </svg>
  )
}

export default function TibetanMo() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [pregunta,       setPregunta]       = useState('')
  const [resultado,      setResultado]      = useState<{ silaba1: SilabaMo; silaba2: SilabaMo; combinacion: CombinacionMo } | null>(null)
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
    await new Promise(r => setTimeout(r, 1500))
    const res = lanzarMo()
    setResultado(res)
    setLanzando(false)
    setFase('resultado')
    consultar(res.silaba1, res.silaba2, res.combinacion)
  }

  const consultar = async (s1: SilabaMo, s2: SilabaMo, comb: CombinacionMo) => {
    setCargando(true); setErrorMsg('')
    const t0 = Date.now()
    try {
      const prompt = [
        'Eres un maestro del oráculo Mo tibetano, guiado por Manjushri, Bodhisattva de la Sabiduría.',
        `El consultante se llama ${nombre}. Su pregunta: "${pregunta}".`,
        `La combinación que han revelado los dados es ${s1}-${s2}.`,
        `Energía de esta combinación: ${comb.energia}. Carácter: ${comb.favorable}.`,
        `Las sílabas pertenecen al mantra de Manjushri: OM AH RA PA TSA NA DHI.`,
        '',
        'Escribe en español, en prosa directa y sabia, sin listas ni asteriscos. Sin saludar.',
        'Escribe exactamente 3 párrafos separados por línea en blanco. Cada párrafo máximo 3 frases.',
        `Párrafo 1: la respuesta directa del Mo — qué dice ${s1}-${s2} sobre esta situación.`,
        'Párrafo 2: qué obstáculos o apoyos señala el Mo en el camino del consultante.',
        'Párrafo 3: consejo práctico budista para actuar sabiamente con esta energía.',
        'Tono ancestral, compasivo y preciso. Termina en punto.',
      ].join('\n')

      const result = await llamarGemini({
        herramienta: HERRAMIENTA, prompt,
        userId: userPlan.userId, usarLite: true, cacheable: false, maxTokens: 500,
      })

      if (result.error || !result.texto) {
        setErrorMsg('Manjushri guarda silencio. Inténtalo de nuevo.')
        return
      }

      setInterpretacion(result.texto)
      if (userPlan.userId) await incrementarConsulta(userPlan.userId)
      analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: 'lite' })
      if (!lecturaGuardadaRef.current) {
        lecturaGuardadaRef.current = true
        await guardarLectura({
          herramienta: HERRAMIENTA,
          titulo: `Mo Tibetano · ${s1}-${s2} · ${fechaHoy}`,
          contenido: `Consulta: "${pregunta}"\nCombinación: ${s1}-${s2}\n\n${result.texto}`,
          metadatos: { pregunta, combinacion: `${s1}-${s2}`, fecha: fechaHoy, nombre },
        })
      }
    } catch (err) {
      console.error('[TibetanMo]', err)
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
    setFase('preguntar'); setPregunta(''); setResultado(null)
    setInterpretacion(''); setErrorMsg(''); lecturaGuardadaRef.current = false
  }

  const SILABAS_GRID: SilabaMo[] = ['AH', 'RA', 'PA', 'TSA', 'NA', 'DHI']

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">

        <div className="flex items-center">
          <button onClick={() => fase !== 'preguntar' ? resetear() : navigate('/tradiciones')} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Mo Tibetano · མོ་</p>
            <p className="text-purple-300 text-xs">Oráculo budista · Manjushri</p>
          </div>
          <span className="text-purple-400 text-xs border border-purple-400/30 rounded-full px-2 py-0.5">✨ Premium</span>
        </div>

        {/* FASE: PREGUNTAR */}
        {fase === 'preguntar' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0a0a1a] border border-red-900/40 rounded-3xl p-6 text-center">
              <p className="text-4xl mb-3">🎲</p>
              <p className="text-amber-700 text-xs tracking-widest uppercase mb-2">མོ་ · Mo Tibetano</p>
              <p className="text-white/60 text-xs leading-relaxed">El Mo es el oráculo sagrado del Tibet, guiado por Manjushri — Bodhisattva de la Sabiduría. Dos lanzamientos de dado revelan una de las 36 combinaciones del mantra sagrado.</p>
              <p className="text-amber-900/80 text-xs mt-3 tracking-widest">OM · AH · RA · PA · TSA · NA · DHI</p>
            </div>
            <div className="bg-[#0a0a1a] border border-white/10 rounded-3xl p-6">
              <p className="text-amber-700 text-xs tracking-widest uppercase mb-3">Tu consulta a Manjushri</p>
              <textarea
                value={pregunta}
                onChange={e => setPregunta(e.target.value)}
                placeholder="Formula tu pregunta con mente clara y corazón abierto..."
                rows={4}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30"
              />
            </div>
            <DisclaimerIA compact />
            <button
              onClick={() => setFase('lanzar')}
              disabled={!pregunta.trim()}
              className="w-full bg-gradient-to-r from-indigo-950 to-purple-900 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40 border border-purple-800/50"
            >
              Preparar los dados sagrados
            </button>
          </div>
        )}

        {/* FASE: LANZAR */}
        {fase === 'lanzar' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0a0a1a] border border-red-900/40 rounded-3xl p-8 text-center">
              <p className="text-5xl mb-4">🙏</p>
              <p className="text-amber-700 text-xs tracking-widest uppercase mb-3">Visualiza a Manjushri</p>
              <p className="text-white/60 text-xs leading-relaxed mb-4">
                Antes del lanzamiento, visualiza a Manjushri — joven de 16 años, espada de sabiduría en la mano derecha, loto azul en la izquierda. Sostén tu pregunta en la mente con claridad y respeto.
              </p>
              <p className="text-amber-900/80 text-xs tracking-widest mb-4">OM · AH · RA · PA · TSA · NA · DHI</p>
              <div className="bg-white/5 rounded-2xl px-4 py-3">
                <p className="text-white/50 text-xs italic">"{pregunta}"</p>
              </div>
            </div>
            <button
              onClick={handleLanzar}
              disabled={lanzando}
              className="w-full bg-gradient-to-r from-indigo-950 to-purple-900 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40 border border-purple-800/50"
            >
              {lanzando ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">✦</span> Lanzando los dados sagrados...
                </span>
              ) : 'Lanzar los dados'}
            </button>
          </div>
        )}

        {/* FASE: RESULTADO */}
        {fase === 'resultado' && resultado && (
          <div className="flex flex-col gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <p className="text-white/50 text-xs italic">"{pregunta}"</p>
            </div>

            {/* Los dos dados */}
            <div className="flex gap-3">
              <div className="flex-1">
                <DadoSVG silaba={resultado.silaba1} elemento={SILABAS[resultado.silaba1].elemento} />
                <p className="text-center text-purple-400/60 text-xs mt-1">{SILABAS[resultado.silaba1].dominio}</p>
              </div>
              <div className="flex-1">
                <DadoSVG silaba={resultado.silaba2} elemento={SILABAS[resultado.silaba2].elemento} />
                <p className="text-center text-purple-400/60 text-xs mt-1">{SILABAS[resultado.silaba2].dominio}</p>
              </div>
            </div>

            {/* Combinación */}
            <div
              className="rounded-3xl p-5 text-center border"
              style={{ background: '#0a0a1a', borderColor: `${COLORES_FAVORABLE[resultado.combinacion.favorable]}40` }}
            >
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: COLORES_FAVORABLE[resultado.combinacion.favorable] }}>
                Combinación revelada
              </p>
              <p className="text-white text-2xl font-bold mb-1" style={{ fontFamily: 'serif' }}>
                {resultado.silaba1} · {resultado.silaba2}
              </p>
              <p className="text-xs mb-3" style={{ color: COLORES_FAVORABLE[resultado.combinacion.favorable] }}>
                {resultado.combinacion.energia}
              </p>
              <div className="bg-white/5 rounded-2xl p-4 text-left">
                <p className="text-white/70 text-sm leading-relaxed">{resultado.combinacion.mensaje}</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-3 mt-3 text-left">
                <p className="text-xs tracking-widest uppercase mb-1" style={{ color: COLORES_FAVORABLE[resultado.combinacion.favorable] }}>Consejo</p>
                <p className="text-white/60 text-xs leading-relaxed">{resultado.combinacion.consejo}</p>
              </div>
            </div>

            {/* Interpretación IA */}
            <div className="bg-[#0a0a1a] border border-white/10 rounded-3xl p-6">
              <p className="text-amber-700 text-xs tracking-widest uppercase mb-4">La voz de Manjushri</p>
              {cargando ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 bg-purple-700 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-700 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-700 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : errorMsg ? (
                <p className="text-red-300 text-sm">{errorMsg}</p>
              ) : (
                <TextoIA texto={interpretacion} />
              )}
            </div>

            {/* Grid sílabas referencia */}
            <div className="bg-[#0a0a1a] border border-white/10 rounded-2xl p-4">
              <p className="text-white/30 text-xs text-center tracking-widest mb-3">Las seis sílabas del mantra</p>
              <div className="grid grid-cols-6 gap-1 text-center">
                {SILABAS_GRID.map(s => (
                  <div key={s} className={`py-2 rounded-xl ${s === resultado.silaba1 || s === resultado.silaba2 ? 'bg-purple-900/40' : ''}`}>
                    <p className="text-xs font-bold" style={{ color: SILABAS[s].color, fontFamily: 'serif' }}>{s}</p>
                    <p className="text-white/30 text-xs" style={{ fontSize: '9px' }}>{SILABAS[s].elemento}</p>
                  </div>
                ))}
              </div>
            </div>

            {!cargando && interpretacion && (
              <>
                <DisclaimerIA />
                <Valoracion onValorar={handleValorar} />
                <Compartir
                  titulo={`Mo Tibetano · ${resultado.silaba1}-${resultado.silaba2}`}
                  texto={`${resultado.silaba1} · ${resultado.silaba2}\n${resultado.combinacion.energia}\n\n${interpretacion}`}
                  hashtags={['Universe', 'TibetanMo', 'Manjushri']}
                />
                <button onClick={() => navigate('/guia')} className="w-full bg-gradient-to-r from-indigo-950 to-purple-900 text-white font-semibold py-4 rounded-full hover:opacity-90 transition border border-purple-800/50">Explorar con mi Guía IA</button>
                <button onClick={resetear} className="w-full text-purple-700/60 text-sm py-2">Nueva consulta</button>
              </>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}