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

const HERRAMIENTA = 'omikuji'

const FORTUNAS = [
  { nivel: 'Dai-kichi', kanji: '大吉', emoji: '🌟', desc: 'Gran Fortuna',       color: 'border-yellow-400', bg: 'from-yellow-50 to-amber-50',   texto: 'text-yellow-900' },
  { nivel: 'Kichi',     kanji: '吉',   emoji: '✨', desc: 'Fortuna',            color: 'border-gray-400',   bg: 'from-gray-50 to-white',         texto: 'text-gray-900'   },
  { nivel: 'Chū-kichi', kanji: '中吉', emoji: '🍀', desc: 'Fortuna Media',      color: 'border-green-500',  bg: 'from-green-50 to-emerald-50',   texto: 'text-green-900'  },
  { nivel: 'Shō-kichi', kanji: '小吉', emoji: '🌸', desc: 'Pequeña Fortuna',    color: 'border-pink-400',   bg: 'from-pink-50 to-rose-50',       texto: 'text-pink-900'   },
  { nivel: 'Han-kichi', kanji: '末吉', emoji: '🌿', desc: 'Fortuna Moderada',   color: 'border-teal-500',   bg: 'from-teal-50 to-green-50',      texto: 'text-teal-900'   },
  { nivel: 'Kyō',       kanji: '凶',   emoji: '🌑', desc: 'Mala Fortuna',       color: 'border-gray-700',   bg: 'from-gray-100 to-gray-200',     texto: 'text-gray-900'   },
]

function sortearFortuna() {
  const pesos = [15, 30, 25, 15, 10, 5]
  const total = pesos.reduce((a, b) => a + b, 0)
  let rand = Math.random() * total
  for (let i = 0; i < pesos.length; i++) {
    rand -= pesos[i]
    if (rand <= 0) return FORTUNAS[i]
  }
  return FORTUNAS[1]
}

export default function Omikuji() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [pregunta,       setPregunta]       = useState('')
  const [interpretacion, setInterpretacion] = useState('')
  const [fortuna,        setFortuna]        = useState<typeof FORTUNAS[0] | null>(null)
  const [cargando,       setCargando]       = useState(false)
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
    setFase('resultado'); setCargando(true); setErrorMsg('')
    const t0 = Date.now()

    const fortunaSorteada = sortearFortuna()
    setFortuna(fortunaSorteada)

    try {
      const prompt = [
        'Eres un sabio maestro del Omikuji japonés — el oráculo sagrado de los templos sintoístas.',
        'Responde SOLO con texto en español, en prosa continua. Sin asteriscos, sin guiones, sin cursivas, sin negritas, sin numeración, sin markdown.',
        'No empieces nunca con saludos ni con el nombre del usuario.',
        'Cada párrafo tiene máximo 3 frases cortas. Es obligatorio completar los 3 párrafos.',
        '',
        `El usuario se llama ${nombre}, su signo es ${signo}.`,
        `Su pregunta: "${pregunta}"`,
        `El nivel de fortuna sorteado es: ${fortunaSorteada.nivel} (${fortunaSorteada.desc})`,
        '',
        'Escribe exactamente 3 párrafos separados por línea en blanco.',
        `Párrafo 1: la fortuna general de ${fortunaSorteada.nivel} y su significado espiritual en la tradición japonesa.`,
        'Párrafo 2: el consejo específico del oráculo para la pregunta del usuario.',
        'Párrafo 3: una advertencia o precaución breve que el oráculo ofrece para este momento.',
        '',
        'Tono ceremonial, sereno y sabio. Termina en punto.',
      ].join('\n')

      const result = await llamarGemini({
        herramienta: HERRAMIENTA, prompt,
        userId: userPlan.userId, usarLite: true,
        cacheable: false, maxTokens: 400,
      })

      if (!result.error && result.texto) {
        setInterpretacion(result.texto)
        if (userPlan.userId) await incrementarConsulta(userPlan.userId)
        analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: result.modelo })
        if (!lecturaGuardadaRef.current) {
          lecturaGuardadaRef.current = true
          await guardarLectura({
            herramienta: HERRAMIENTA,
            titulo: `Omikuji · ${fortunaSorteada.nivel} · ${fechaHoy}`,
            contenido: `Pregunta: "${pregunta}"\nFortuna: ${fortunaSorteada.nivel}\n\n${result.texto}`,
            metadatos: { pregunta, fecha: fechaHoy, nombre, signo, fortuna: fortunaSorteada.nivel },
          })
        }
      } else {
        setErrorMsg(result.error || 'El oráculo guarda silencio. Inténtalo de nuevo.')
      }
    } catch (err) {
      console.error('[Omikuji]', err)
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
    setFase('preguntar')
    setInterpretacion('')
    setFortuna(null)
    setErrorMsg('')
    lecturaGuardadaRef.current = false
  }

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <button
            onClick={() => fase === 'resultado' ? resetear() : navigate('/tradiciones')}
            className="text-purple-300 text-sm"
          >← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Omikuji</p>
            <p className="text-purple-300 text-xs">Oráculo japonés del templo</p>
          </div>
          <span className="text-purple-400 text-xs border border-purple-400/30 rounded-full px-2 py-0.5">✨ Premium</span>
        </div>

        {fase === 'preguntar' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6 text-center">
              <p className="text-5xl mb-3">🎋</p>
              <p className="text-white/60 text-sm leading-relaxed">Escribe tu pregunta y el espíritu del templo sorteará tu fortuna.</p>
            </div>
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">Tu pregunta</p>
              <textarea
                value={pregunta}
                onChange={e => setPregunta(e.target.value)}
                placeholder="¿Qué quieres consultar al oráculo?"
                rows={4}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30"
              />
            </div>
            <DisclaimerIA compact />
            <button
              onClick={consultar}
              disabled={!pregunta.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >Consultar el oráculo</button>
          </div>
        )}

        {fase === 'resultado' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-white/15 rounded-2xl px-4 py-3">
              <p className="text-white/50 text-xs italic">"{pregunta}"</p>
            </div>

            {/* Papel omikuji */}
            {fortuna && (
              <div className={`relative mx-auto w-64 rounded-sm border-4 ${fortuna.color} bg-gradient-to-b ${fortuna.bg} shadow-2xl`}
                style={{ minHeight: '420px' }}
              >
                {/* Franja superior decorativa */}
                <div className={`w-full h-2 bg-gradient-to-r ${fortuna.color.replace('border-', 'from-')} to-transparent opacity-40`} />

                {/* Contenido del papel */}
                <div className="flex flex-col items-center px-5 py-6 gap-4">

                  {/* Línea decorativa superior */}
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex-1 h-px bg-gray-400/40" />
                    <p className="text-gray-500 text-xs">おみくじ</p>
                    <div className="flex-1 h-px bg-gray-400/40" />
                  </div>

                  {/* Kanji grande */}
                  <p className={`text-7xl font-bold ${fortuna.texto} leading-none`}
                    style={{ fontFamily: 'serif', textShadow: '1px 1px 2px rgba(0,0,0,0.15)' }}
                  >{fortuna.kanji}</p>

                  {/* Nombre y descripción */}
                  <div className="text-center">
                    <p className={`text-sm font-bold ${fortuna.texto} tracking-widest`}>{fortuna.nivel}</p>
                    <p className={`text-xs ${fortuna.texto} opacity-70`}>{fortuna.desc}</p>
                  </div>

                  {/* Línea decorativa */}
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex-1 h-px bg-gray-400/40" />
                    <p className="text-gray-400 text-xs">✦</p>
                    <div className="flex-1 h-px bg-gray-400/40" />
                  </div>

                  {/* Texto de la lectura */}
                  <div className={`w-full ${fortuna.texto} text-xs leading-relaxed text-center`}>
                    {cargando ? (
                      <div className="flex justify-center gap-2 py-4">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    ) : errorMsg
                      ? <p className="text-red-600 text-xs">{errorMsg}</p>
                      : <p className="whitespace-pre-wrap">{interpretacion}</p>
                    }
                  </div>

                  {/* Línea decorativa inferior */}
                  {interpretacion && (
                    <div className="flex items-center gap-2 w-full">
                      <div className="flex-1 h-px bg-gray-400/40" />
                      <p className="text-gray-400 text-xs">✦</p>
                      <div className="flex-1 h-px bg-gray-400/40" />
                    </div>
                  )}

                  {/* Fecha en japonés al pie */}
                  {interpretacion && (
                    <p className="text-gray-400 text-xs opacity-60" style={{ fontFamily: 'serif' }}>
                      {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  )}
                </div>

                {/* Franja inferior decorativa */}
                <div className={`w-full h-2 bg-gradient-to-r ${fortuna.color.replace('border-', 'from-')} to-transparent opacity-40`} />
              </div>
            )}

            {!cargando && interpretacion && (
              <>
                <DisclaimerIA />
                <Valoracion onValorar={handleValorar} />
                <Compartir
                  titulo={`Omikuji: ${fortuna?.nivel}`}
                  texto={`${fortuna?.kanji} ${fortuna?.nivel} — ${fortuna?.desc}\n\n${interpretacion}`}
                  hashtags={['Universe', 'Omikuji', 'Japon']}
                />
                <button onClick={() => navigate('/guia')} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">Explorar con mi Guía IA</button>
                <button onClick={resetear} className="w-full text-purple-300/60 text-sm py-2">Nueva consulta</button>
              </>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}