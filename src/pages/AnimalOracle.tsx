import { useState, useEffect } from 'react'
import PageLayout from '../components/PageLayout'
import Compartir from '../components/Compartir'
import Paywall from '../components/Paywall'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import TextoIA from '../components/TextoIA'
import { llamarGemini } from '../lib/gemini'
import { useUserPlan } from '../hooks/useUserPlan'
import { useAnalytics } from '../hooks/useAnalytics'

export default function AnimalOracle() {
  const [pregunta, setPregunta] = useState('')
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'preguntar' | 'resultado'>('preguntar')
  const [errorMsg, setErrorMsg] = useState('')
  const [tiempoInicio, setTiempoInicio] = useState(0)

  const nombre = localStorage.getItem('nombre') || 'viajero'
  const signo = localStorage.getItem('signo') || 'Leo'

  const { esPremium, userId, cargando: cargandoPlan, incrementarConsulta } = useUserPlan()
  const { registrarApertura, registrarLectura, registrarPaywall, registrarValoracion } = useAnalytics('animal-oracle', esPremium)

  useEffect(() => { registrarApertura() }, [])

  if (!cargandoPlan && !esPremium) {
    registrarPaywall()
    return <Paywall motivo="herramienta" herramienta="Simbolismo Animal" />
  }

  const consultar = async () => {
    if (!pregunta.trim()) return
    setFase('resultado')
    setCargando(true)
    setErrorMsg('')
    setTiempoInicio(Date.now())

    await incrementarConsulta()

    const result = await llamarGemini({
      herramienta: 'animal-oracle',
      prompt: [
        'Escribe en español, en prosa, sin listas, sin asteriscos, sin markdown.',
        'No uses saludos ni introducciones. Ve directo al contenido.',
        'Escribe exactamente 3 párrafos de 4 a 5 frases cada uno. No cortes ningún párrafo a la mitad.',
        `Eres un experto en simbolismo animal en tradiciones espirituales de todo el mundo.`,
        `El usuario se llama ${nombre} y su signo es ${signo}.`,
        `El usuario escribe: "${pregunta}"`,
        'Párrafo 1: el simbolismo del animal o situación mencionada en distintas tradiciones espirituales.',
        'Párrafo 2: el mensaje concreto que ese animal trae para este momento vital.',
        'Párrafo 3: una práctica o invitación concreta para trabajar con esta energía animal.',
      ].join('\n'),
      userId, usarLite: true, cacheable: false, maxTokens: 500,
    })

    const tiempoMs = Date.now() - tiempoInicio

    if (result.error) {
      setErrorMsg(result.error)
    } else {
      setInterpretacion(result.texto)
      registrarLectura({ desdCache: false, tiempoMs, modeloIa: result.modelo })
    }
    setCargando(false)
  }

  return (
    <PageLayout>
      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">
        <div className="flex items-center">
          <button
            onClick={() => { if (fase === 'resultado') { setFase('preguntar'); setInterpretacion(''); setErrorMsg('') } else window.location.href = '/tradiciones' }}
            className="text-purple-300 text-sm"
          >← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Simbolismo Animal</p>
            <p className="text-purple-300 text-xs">Arquetipos animales</p>
          </div>
          <span className="text-purple-400 text-xs border border-purple-400/30 rounded-full px-2 py-0.5">✨ Premium</span>
        </div>

        {fase === 'preguntar' && (
          <div className="flex flex-col gap-6">
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Animal o situación</p>
              <textarea
                value={pregunta}
                onChange={e => setPregunta(e.target.value)}
                placeholder="¿Qué animal o situación quieres explorar?"
                rows={4}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30"
              />
            </div>
            <DisclaimerIA compact />
            <button
              onClick={consultar}
              disabled={!pregunta.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full disabled:opacity-40"
            >Consultar</button>
          </div>
        )}

        {fase === 'resultado' && (
          <div className="flex flex-col gap-5">
            <div className="bg-[#0d0015] border border-white/15 rounded-2xl px-4 py-3">
              <p className="text-white/40 text-xs italic">"{pregunta}"</p>
            </div>
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Interpretación</p>
              {cargando ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : errorMsg
                ? <p className="text-red-400 text-sm">{errorMsg}</p>
                : <TextoIA texto={interpretacion} />
              }
            </div>
            {!cargando && interpretacion && (
              <>
                <DisclaimerIA />
                <Valoracion onValorar={registrarValoracion} />
                <Compartir titulo="Simbolismo Animal" texto={interpretacion} hashtags={['Universe', 'AnimalOracle']} />
                <div className="flex flex-col gap-3">
                  <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">Explorar con mi Guía IA</button>
                  <button onClick={() => { setFase('preguntar'); setInterpretacion(''); setErrorMsg('') }} className="w-full text-purple-300/60 text-sm py-2">Nueva consulta</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}