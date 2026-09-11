// src/pages/Bibliomancia.tsx
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

const HERRAMIENTA = 'bibliomancia'

export default function Bibliomancia() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [pregunta,       setPregunta]       = useState('')
  const [pasaje,         setPasaje]         = useState('')
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando,       setCargando]       = useState(false)
  const [fase,           setFase]           = useState<'preguntar' | 'pasaje' | 'resultado'>('preguntar')
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

  const generarPasaje = async () => {
    if (!pregunta.trim()) return
    setCargando(true)
    try {
      const result = await llamarGemini({
        herramienta: HERRAMIENTA,
        prompt: `Genera un pasaje literario breve (2-3 frases) de alguna obra clásica de la literatura universal que pueda servir como mensaje oracular para esta pregunta: "${pregunta}". Incluye el título y autor entre paréntesis al final. Solo el pasaje y la referencia, nada más.`,
        userId: userPlan.userId, usarLite: true, cacheable: false, maxTokens: 150,
      })
      if (!result.error && result.texto) {
        setPasaje(result.texto)
        setFase('pasaje')
      }
    } catch (err) { console.error('[Bibliomancia]', err) }
    finally { setCargando(false) }
  }

  const interpretar = async () => {
    setFase('resultado'); setCargando(true); setErrorMsg('')
    const t0 = Date.now()

    try {
      const prompt = [
        'Eres un experto en bibliomancia y hermenéutica literaria.',
        'Escribe en español, en prosa fluida. Sin asteriscos, sin guiones, sin markdown.',
        '',
        `El usuario se llama ${nombre}, signo ${signo}. Su pregunta: "${pregunta}".`,
        `El pasaje que el universo le ha revelado: "${pasaje}".`,
        '',
        'Escribe una interpretación de 2 párrafos.',
        'Párrafo 1: cómo resuena este pasaje literario con la pregunta del usuario y qué mensaje trae.',
        'Párrafo 2: cómo aplicar esta sabiduría literaria a su situación concreta hoy.',
        '',
        'Tono reflexivo y literario. Separa con línea en blanco. Termina en punto.',
      ].join('\n')

      const result = await llamarGemini({ herramienta: HERRAMIENTA, prompt, userId: userPlan.userId, usarLite: true, cacheable: false, maxTokens: 500 })

      if (!result.error && result.texto) {
        setInterpretacion(result.texto)
        if (userPlan.userId) await incrementarConsulta(userPlan.userId)
        analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: result.modelo })
        if (!lecturaGuardadaRef.current) {
          lecturaGuardadaRef.current = true
          await guardarLectura({ herramienta: HERRAMIENTA, titulo: `Bibliomancia · ${fechaHoy}`, contenido: `Pregunta: "${pregunta}"\nPasaje: "${pasaje}"\n\n${result.texto}`, metadatos: { pregunta, pasaje, fecha: fechaHoy, nombre } })
        }
      } else { setErrorMsg('El libro guarda silencio. Inténtalo de nuevo.') }
    } catch (err) { console.error('[Bibliomancia]', err); setErrorMsg('Error inesperado.') }
    finally { setCargando(false) }
  }

  const handleValorar = (valor: 1 | -1) => { if (yaValorado) return; setYaValorado(true); analytics.registrarValoracion(valor) }

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <button onClick={() => { if (fase === 'resultado') { setFase('pasaje'); setInterpretacion('') } else if (fase === 'pasaje') { setFase('preguntar'); setPasaje('') } else navigate('/tradiciones') }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Bibliomancia</p>
            <p className="text-purple-300 text-xs">Sabiduría de los libros</p>
          </div>
          <span className="text-purple-400 text-xs border border-purple-400/30 rounded-full px-2 py-0.5">✨ Premium</span>
        </div>

        {fase === 'preguntar' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">Tu pregunta al universo</p>
              <textarea value={pregunta} onChange={e => setPregunta(e.target.value)} placeholder="Formula tu pregunta con intención..." rows={4} className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30" />
            </div>
            <DisclaimerIA compact />
            <button onClick={generarPasaje} disabled={!pregunta.trim() || cargando}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40">
              {cargando ? 'Buscando el pasaje...' : 'Abrir el libro al azar'}
            </button>
          </div>
        )}

        {fase === 'pasaje' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-purple-500/50 rounded-3xl p-6 text-center">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-4">El libro te responde</p>
              <p className="text-white text-sm leading-relaxed italic">"{pasaje}"</p>
            </div>
            <button onClick={interpretar} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">Interpretar este pasaje</button>
          </div>
        )}

        {fase === 'resultado' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-purple-500/30 rounded-2xl p-4">
              <p className="text-white/50 text-xs italic">"{pasaje}"</p>
            </div>
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-4">Interpretación</p>
              {cargando ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : errorMsg ? <p className="text-red-300 text-sm">{errorMsg}</p> : <TextoIA texto={interpretacion} />}
            </div>
            {!cargando && interpretacion && (
              <>
                <DisclaimerIA />
                <Valoracion onValorar={handleValorar} />
                <Compartir titulo="Bibliomancia" texto={`"${pasaje}"\n\n${interpretacion}`} hashtags={['Universe', 'Bibliomancia']} />
                <button onClick={() => navigate('/guia')} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">Explorar con mi Guía IA</button>
                <button onClick={() => { setFase('preguntar'); setInterpretacion(''); setPasaje(''); setPregunta(''); lecturaGuardadaRef.current = false }} className="w-full text-purple-300/60 text-sm py-2">Nueva consulta</button>
              </>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
