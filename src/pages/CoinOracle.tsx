import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserPlan, incrementarConsulta } from '../hooks/useUserPlan'
import { useAnalytics } from '../hooks/useAnalytics'
import { guardarLectura } from '../hooks/useHistorial'
import { llamarGemini } from '../lib/gemini'
import { lanzar3Monedas, getInterpretacion, ResultadoMoneda } from '../lib/motores/coinOracle'
import Compartir from '../components/Compartir'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import PageLayout from '../components/PageLayout'
import TextoIA from '../components/TextoIA'

const HERRAMIENTA = 'coin-oracle'

export default function CoinOracle() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [monedas,        setMonedas]        = useState<ResultadoMoneda[]>([])
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
    const resultado = lanzar3Monedas()
    setMonedas(resultado)
    setFase('resultado')
    setCargando(true)
    setErrorMsg('')

    try {
      const interpretacionBase = getInterpretacion(resultado)
      const caras = resultado.filter(m => m === 'cara').length
      const cruces = resultado.filter(m => m === 'cruz').length

      const result = await llamarGemini({
        herramienta: HERRAMIENTA,
        prompt: [
          'Eres un intérprete experto en oráculos de monedas y cleromancia.',
          'Responde SOLO con texto en español, en prosa continua. Sin asteriscos, sin guiones, sin cursivas, sin negritas, sin numeración, sin markdown.',
          'PROHIBIDO empezar con saludos, con el nombre del usuario o con cualquier introducción. Empieza DIRECTAMENTE con la interpretación.',
          'Cada párrafo tiene MÁXIMO 3 frases cortas. Obligatorio.',
          '',
          `El usuario se llama ${nombre}.`,
          `Pregunta: "${pregunta}"`,
          `Resultado: ${resultado.join(', ')} (${caras} cara${caras !== 1 ? 's' : ''}, ${cruces} cru${cruces !== 1 ? 'ces' : 'z'})`,
          `Patrón: ${interpretacionBase.titulo} — ${interpretacionBase.mensaje}`,
          '',
          'Escribe exactamente 2 párrafos separados por línea en blanco.',
          'Párrafo 1: qué dice este patrón en respuesta a la pregunta.',
          'Párrafo 2: una perspectiva más profunda y una pregunta de reflexión final.',
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
            titulo: `Monedas: ${interpretacionBase.titulo} · ${fechaHoy}`,
            contenido: `Pregunta: "${pregunta}"\nResultado: ${resultado.join(', ')}\n\n${result.texto}`,
            metadatos: { pregunta, monedas: resultado, patron: interpretacionBase.titulo, fecha: fechaHoy, nombre },
          })
        }
      } else {
        setErrorMsg(result.error || 'El oráculo guarda silencio. Inténtalo de nuevo.')
      }
    } catch (err) {
      console.error('[CoinOracle]', err)
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
    setMonedas([])
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
            <p className="text-white font-semibold text-sm">Oracle de Monedas</p>
            <p className="text-purple-300 text-xs">Cleromancia · Decisión y flujo</p>
          </div>
          <span className="text-purple-400 text-xs border border-purple-400/30 rounded-full px-2 py-0.5">✨ Premium</span>
        </div>

        {fase === 'preguntar' && (
          <div className="flex flex-col gap-6">
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6 text-center">
              <p className="text-5xl mb-4">🪙</p>
              <p className="text-white/60 text-sm leading-relaxed">Tres monedas, seis posibles patrones. La aleatoriedad como espejo de la energía presente en tu pregunta.</p>
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
            >Lanzar las monedas</button>
          </div>
        )}

        {fase === 'resultado' && (
          <div className="flex flex-col gap-5">
            <div className="flex justify-center gap-6 py-4">
              {monedas.map((m, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-2xl font-bold ${m === 'cara' ? 'border-amber-400 bg-amber-400/10 text-amber-300' : 'border-white/30 bg-white/5 text-white/50'}`}>
                    {m === 'cara' ? '☀' : '☽'}
                  </div>
                  <p className="text-white/50 text-xs capitalize">{m}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#0d0015] border border-purple-500/30 rounded-3xl p-4 text-center">
              <p className="text-purple-300 font-semibold">{getInterpretacion(monedas).titulo}</p>
              <p className="text-white/60 text-xs mt-1">{getInterpretacion(monedas).mensaje}</p>
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
                  titulo={`Oracle de Monedas: ${getInterpretacion(monedas).titulo}`}
                  texto={interpretacion}
                  hashtags={['CoinOracle', 'Universe', 'Cleromancia']}
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