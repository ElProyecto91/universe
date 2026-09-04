import { useState, useEffect } from 'react'
import Compartir from '../components/Compartir'
import Paywall from '../components/Paywall'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import { llamarGemini } from '../lib/gemini'
import { useUserPlan } from '../hooks/useUserPlan'
import { useAnalytics } from '../hooks/useAnalytics'
import { supabase } from '../lib/supabase'

export default function OracleMix() {
  const [pregunta, setPregunta] = useState('')
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'preguntar' | 'resultado'>('preguntar')
  const [errorMsg, setErrorMsg] = useState('')
  const [fromCache, setFromCache] = useState(false)
  const [tiempoInicio, setTiempoInicio] = useState(0)

  const nombre = localStorage.getItem('nombre') || 'viajero'
  const signo = localStorage.getItem('signo') || 'Leo'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const añoActual = new Date().getFullYear()
  const { esPremium, userId, cargando: cargandoPlan } = useUserPlan()
  const { registrarApertura, registrarLectura, registrarPaywall, registrarValoracion } = useAnalytics('oracle-mix', esPremium)

  useEffect(() => {
    registrarApertura()
  }, [])

  // Mostrar paywall si no es premium
  if (!cargandoPlan && !esPremium) {
    registrarPaywall()
    return <Paywall motivo="herramienta" herramienta="Oracle Mix" />
  }

  

  const consultar = async () => {
    if (!pregunta.trim()) return
    setFase('resultado')
    setCargando(true)
    setErrorMsg('')
    setTiempoInicio(Date.now())

    

    const result = await llamarGemini({
      herramienta: 'oracle-mix',
      prompt: `Eres un oráculo que combina tarot, astrología y numerología. Nombre: ${nombre}, Signo: ${signo}. Pregunta: "${pregunta}". Respuesta integrando 3 perspectivas distintas.`,
      userId, usarLite: false, cacheable: false, maxTokens: 400,
    })

    const tiempoMs = Date.now() - tiempoInicio

    if (result.error) {
      setErrorMsg(result.error)
    } else {
      setInterpretacion(result.texto)
      setFromCache(false)
      registrarLectura({ desdCache: false, tiempoMs, modeloIa: result.modelo })
      
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={{ backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-black/75" />
      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">
        <div className="flex items-center">
          <button onClick={() => { if (fase === 'resultado') setFase('preguntar'); else window.location.href = '/tradiciones' }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Oracle Mix</p>
            <p className="text-purple-300 text-xs">Múltiples tradiciones</p>
          </div>
          <span className="text-purple-400 text-xs border border-purple-400/30 rounded-full px-2 py-0.5">✨ Premium</span>
        </div>
        {fase === 'preguntar' && (
          <div className="flex flex-col gap-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu pregunta o situación</p>
              <textarea value={pregunta} onChange={e => setPregunta(e.target.value)} placeholder="¿Qué quieres explorar?" rows={4} className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30" />
            </div>
            <DisclaimerIA compact />
            <button onClick={consultar} disabled={!pregunta.trim()} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full disabled:opacity-40">Consultar</button>
          </div>
        )}
        {fase === 'resultado' && (
          <div className="flex flex-col gap-5">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur">
              <p className="text-white/40 text-xs italic">"{pregunta}"</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <div className="flex items-center justify-between mb-3">
                <p className="text-purple-300 text-xs tracking-widest uppercase">Interpretación</p>
                {fromCache && <span className="text-green-400 text-xs">⚡ Instantáneo</span>}
              </div>
              {cargando ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : errorMsg ? <p className="text-red-400 text-sm">{errorMsg}</p>
              : <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{interpretacion}</p>}
            </div>
            {!cargando && interpretacion && (
              <>
                <DisclaimerIA />
                <Valoracion onValorar={registrarValoracion} />
                <Compartir titulo="Oracle Mix" texto={interpretacion} hashtags={['Universe', 'OracleMix']} />
                <div className="flex flex-col gap-3">
                  <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">Explorar con mi Guía IA</button>
                  <button onClick={() => { setFase('preguntar'); setInterpretacion(''); setErrorMsg('') }} className="w-full text-purple-300/60 text-sm py-2">Nueva consulta</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
