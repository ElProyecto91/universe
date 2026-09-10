// src/pages/MirrorOracle.tsx
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

const HERRAMIENTA = 'mirror-oracle'

export default function MirrorOracle() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [pregunta,       setPregunta]       = useState('')
  const [interpretacion, setInterpretacion] = useState('')
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
    analytics.registrarPaywall()
    navigate('/premium')
    return null
  }

  const consultar = async () => {
    if (!pregunta.trim()) return
    setFase('resultado')
    setCargando(true)
    setErrorMsg('')
    const t0 = Date.now()

    try {
      const prompt = [
        'Eres un guía de reflexión profunda. Escribe en español, en prosa simple y directa.',
        'REGLAS ESTRICTAS: frases cortas. Máximo 15 palabras por frase. Sin subordinadas largas. Sin listas. Sin asteriscos. Sin markdown.',
        '',
        `El usuario se llama ${nombre} y su signo es ${signo}. Su situación es: "${pregunta}".`,
        '',
        `Escribe exactamente 4 párrafos cortos dirigiéndote a ${nombre} directamente. Sin introducción genérica.`,
        `Párrafo 1: qué refleja esta situación sobre su mundo interior.`,
        `Párrafo 2: qué patrón o creencia subyacente podría estar influyendo.`,
        `Párrafo 3: qué puede hacer hoy para transformar esta situación desde adentro.`,
        `Párrafo 4: una pregunta reflexiva poderosa para que ${nombre} explore en profundidad.`,
        '',
        'Cada párrafo exactamente 2 frases. Frases cortas. Termina siempre en punto. Nunca dejes una frase incompleta.',
      ].join('\n')

      const result = await llamarGemini({
        herramienta: HERRAMIENTA,
        prompt,
        userId: userPlan.userId,
        usarLite: false,
        cacheable: false,
        maxTokens: 1500,
        temperatura: 0.7,
      })

      if (!result.error && result.texto) {
        setInterpretacion(result.texto)
        if (userPlan.userId) await incrementarConsulta(userPlan.userId)
        analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: result.modelo })
        if (!lecturaGuardadaRef.current) {
          lecturaGuardadaRef.current = true
          await guardarLectura({
            herramienta: HERRAMIENTA,
            titulo: `Mirror Oracle · ${fechaHoy}`,
            contenido: `Consulta: "${pregunta}"\n\n${result.texto}`,
            metadatos: { pregunta, fecha: fechaHoy, nombre, signo },
          })
        }
      } else {
        setErrorMsg(result.error || 'El universo guarda silencio. Inténtalo de nuevo.')
      }
    } catch (err) {
      console.error('[MirrorOracle]', err)
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

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">

        <div className="flex items-center">
          <button onClick={() => fase === 'resultado' ? setFase('preguntar') : navigate('/tradiciones')} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Mirror Oracle</p>
            <p className="text-purple-300 text-xs">Reflexión interior</p>
          </div>
          <span className="text-purple-400 text-xs border border-purple-400/30 rounded-full px-2 py-0.5">✨ Premium</span>
        </div>

        {fase === 'preguntar' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">Tu consulta</p>
              <textarea value={pregunta} onChange={e => setPregunta(e.target.value)}
                placeholder="¿Qué quieres explorar?" rows={4}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30" />
            </div>
            <DisclaimerIA compact />
            <button onClick={consultar} disabled={!pregunta.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40">
              Consultar
            </button>
          </div>
        )}

        {fase === 'resultado' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-white/15 rounded-2xl px-4 py-3">
              <p className="text-white/50 text-xs italic">"{pregunta}"</p>
            </div>
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">Interpretación</p>
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
                <Compartir titulo="Mirror Oracle" texto={interpretacion} hashtags={['Universe', 'MirrorOracle']} />
                <button onClick={() => navigate('/guia')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">
                  Explorar con mi Guía IA
                </button>
                <button onClick={() => { setFase('preguntar'); setInterpretacion(''); setErrorMsg(''); lecturaGuardadaRef.current = false }}
                  className="w-full text-purple-300/60 text-sm py-2">
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
