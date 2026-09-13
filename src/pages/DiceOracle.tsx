import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserPlan, incrementarConsulta } from '../hooks/useUserPlan'
import { useAnalytics } from '../hooks/useAnalytics'
import { guardarLectura } from '../hooks/useHistorial'
import { llamarGemini } from '../lib/gemini'
import { lanzar3Dados } from '../lib/motores/dados'
import Compartir from '../components/Compartir'
import Paywall from '../components/Paywall'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import PageLayout from '../components/PageLayout'
import TextoIA from '../components/TextoIA'

const HERRAMIENTA = 'dice-oracle'
const CARAS_DADO = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅']

export default function DiceOracle() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [dados,          setDados]          = useState<number[]>([])
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando,       setCargando]       = useState(false)
  const [fase,           setFase]           = useState<'preguntar' | 'resultado'>('preguntar')
  const [pregunta,       setPregunta]       = useState('')
  const [errorMsg,       setErrorMsg]       = useState('')
  const [yaValorado,     setYaValorado]     = useState(false)
  const lecturaGuardadaRef                  = useRef(false)

  const nombre   = localStorage.getItem('nombre') || 'viajero'
  const fechaHoy = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (!userPlan.cargando) analytics.registrarApertura()
  }, [userPlan.cargando])

  if (!userPlan.cargando && !userPlan.esPremium) {
    analytics.registrarPaywall(); navigate('/premium'); return null
  }

  const lanzar = async () => {
    if (!pregunta.trim()) return
    const t0 = Date.now()
    const resultado = lanzar3Dados()
    setDados(resultado)
    setFase('resultado')
    setCargando(true)
    setErrorMsg('')

    try {
      const suma = resultado.reduce((a, b) => a + b, 0)

      const result = await llamarGemini({
        herramienta: HERRAMIENTA,
        prompt: [
          'Eres un intérprete experto en cleromancia y oráculos de dados.',
          'Responde SOLO con texto en español, en prosa continua. Sin asteriscos, sin guiones, sin cursivas, sin negritas, sin numeración, sin markdown.',
          'No empieces nunca con saludos ni con el nombre del usuario.',
          'Cada párrafo tiene máximo 3 frases cortas. Es obligatorio completar los 2 párrafos.',
          '',
          `El usuario se llama ${nombre}.`,
          `Pregunta: "${pregunta}"`,
          `Dados: ${resultado.join(', ')} (suma: ${suma})`,
          'Dado 1 = mente/pensamiento · Dado 2 = corazón/emoción · Dado 3 = acción/cuerpo',
          '',
          'Escribe exactamente 2 párrafos separados por línea en blanco.',
          'Párrafo 1: conecta los números con la pregunta y qué perspectiva ofrecen.',
          'Párrafo 2: un consejo concreto y una pregunta de reflexión final.',
          '',
          'Sin predicciones absolutas. Tono evocador y directo. Termina en punto.',
        ].join('\n'),
        userId: userPlan.userId, usarLite: true,
        cacheable: false, maxTokens: 300,
      })

      if (!result.error && result.texto) {
        setInterpretacion(result.texto)
        if (userPlan.userId) await incrementarConsulta(userPlan.userId)
        analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: result.modelo })
        if (!lecturaGuardadaRef.current) {
          lecturaGuardadaRef.current = true
          await guardarLectura({
            herramienta: HERRAMIENTA,
            titulo: `Dados: ${resultado.join('-')} · ${fechaHoy}`,
            contenido: `Pregunta: "${pregunta}"\nDados: ${resultado.join(', ')}\n\n${result.texto}`,
            metadatos: { pregunta, dados: resultado, fecha: fechaHoy, nombre },
          })
        }
      } else {
        setErrorMsg(result.error || 'El oráculo guarda silencio. Inténtalo de nuevo.')
      }
    } catch (err) {
      console.error('[DiceOracle]', err)
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
    setDados([])
    setInterpretacion('')
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
            <p className="text-white font-semibold text-sm">Oracle de Dados</p>
            <p className="text-purple-300 text-xs">Cleromancia · Tradición antigua</p>
          </div>
          <span className="text-purple-400 text-xs border border-purple-400/30 rounded-full px-2 py-0.5">✨ Premium</span>
        </div>

        {fase === 'preguntar' && (
          <div className="flex flex-col gap-6">
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6 text-center">
              <p className="text-5xl mb-4">⚄</p>
              <p className="text-white/60 text-sm leading-relaxed">La cleromancia — adivinación mediante objetos lanzados al azar — es una de las prácticas más antiguas de la humanidad.</p>
            </div>
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">Tu pregunta</p>
              <textarea
                value={pregunta}
                onChange={e => setPregunta(e.target.value)}
                placeholder="Formula tu pregunta con claridad..."
                rows={3}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30"
              />
            </div>
            <DisclaimerIA compact />
            <button
              onClick={lanzar}
              disabled={!pregunta.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >Lanzar los dados</button>
          </div>
        )}

        {fase === 'resultado' && (
          <div className="flex flex-col gap-5">
            <div className="flex justify-center gap-6 py-4">
              {dados.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <span className="text-6xl">{CARAS_DADO[d]}</span>
                  <span className="text-white/40 text-xs">{['Mente', 'Corazón', 'Acción'][i]}</span>
                </div>
              ))}
            </div>

            <div className="bg-[#0d0015] border border-white/15 rounded-2xl px-4 py-3">
              <p className="text-white/50 text-xs italic">"{pregunta}"</p>
            </div>

            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-4">Interpretación</p>
              {cargando ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : errorMsg
                ? <p className="text-red-300 text-sm">{errorMsg}</p>
                : <TextoIA texto={interpretacion} />
              }
            </div>

            {!cargando && interpretacion && (
              <>
                <DisclaimerIA />
                <Valoracion onValorar={handleValorar} />
                <Compartir
                  titulo={`Oracle de Dados: ${dados.join('-')}`}
                  texto={interpretacion}
                  hashtags={['DiceOracle', 'Universe', 'Cleromancia']}
                />
                <button onClick={() => navigate('/guia')} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">Explorar con mi Guía IA</button>
                <button onClick={resetear} className="w-full text-purple-300/60 text-sm py-2">Nueva tirada</button>
              </>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}