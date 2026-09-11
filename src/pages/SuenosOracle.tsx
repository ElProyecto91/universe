// src/pages/SuenosOracle.tsx
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

const HERRAMIENTA = 'suenos-oracle'

export default function SuenosOracle() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [sueno,          setSueno]          = useState('')
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando,       setCargando]       = useState(false)
  const [fase,           setFase]           = useState<'escribir' | 'resultado'>('escribir')
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

  const interpretar = async () => {
    if (!sueno.trim()) return
    setFase('resultado'); setCargando(true); setErrorMsg('')
    const t0 = Date.now()

    try {
      const prompt = [
        'Eres un experto en interpretación de sueños desde la psicología junguiana y el simbolismo universal.',
        'Escribe en español, en prosa fluida y continua. Sin asteriscos, sin guiones, sin markdown.',
        '',
        `El usuario se llama ${nombre}, signo ${signo}. Su sueño: "${sueno}".`,
        '',
        'Escribe una interpretación de 3 párrafos que fluyan naturalmente.',
        'Párrafo 1: qué símbolos principales aparecen en el sueño y qué representan en el inconsciente.',
        'Párrafo 2: qué mensaje o proceso interno está intentando comunicar este sueño.',
        'Párrafo 3: cómo conecta con la vida actual de esta persona y una pregunta reflexiva de cierre.',
        '',
        'Tono profundo y empático. Separa párrafos con línea en blanco. Termina en punto.',
      ].join('\n')

      const result = await llamarGemini({ herramienta: HERRAMIENTA, prompt, userId: userPlan.userId, usarLite: true, cacheable: false, maxTokens: 700 })

      if (!result.error && result.texto) {
        setInterpretacion(result.texto)
        if (userPlan.userId) await incrementarConsulta(userPlan.userId)
        analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: result.modelo })
        if (!lecturaGuardadaRef.current) {
          lecturaGuardadaRef.current = true
          await guardarLectura({ herramienta: HERRAMIENTA, titulo: `Sueño · ${fechaHoy}`, contenido: `Sueño: "${sueno}"\n\n${result.texto}`, metadatos: { sueno, fecha: fechaHoy, nombre, signo } })
        }
      } else { setErrorMsg(result.error || 'El oráculo guarda silencio. Inténtalo de nuevo.') }
    } catch (err) { console.error('[SuenosOracle]', err); setErrorMsg('Error inesperado.') }
    finally { setCargando(false) }
  }

  const handleValorar = (valor: 1 | -1) => { if (yaValorado) return; setYaValorado(true); analytics.registrarValoracion(valor) }

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <button onClick={() => fase === 'resultado' ? setFase('escribir') : navigate('/tradiciones')} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Diario de Sueños</p>
            <p className="text-purple-300 text-xs">Interpretación onírica</p>
          </div>
          <span className="text-purple-400 text-xs border border-purple-400/30 rounded-full px-2 py-0.5">✨ Premium</span>
        </div>

        {fase === 'escribir' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">Describe tu sueño</p>
              <textarea value={sueno} onChange={e => setSueno(e.target.value)}
                placeholder="Escribe todo lo que recuerdes..." rows={6}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30" />
            </div>
            <DisclaimerIA compact />
            <button onClick={interpretar} disabled={!sueno.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40">
              Interpretar mi sueño
            </button>
          </div>
        )}

        {fase === 'resultado' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-white/15 rounded-2xl px-4 py-3">
              <p className="text-white/50 text-xs italic line-clamp-3">"{sueno}"</p>
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
                <Compartir titulo="Diario de Sueños" texto={interpretacion} hashtags={['Universe', 'Suenos']} />
                <button onClick={() => navigate('/guia')} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">Explorar con mi Guía IA</button>
                <button onClick={() => { setFase('escribir'); setInterpretacion(''); setErrorMsg(''); setSueno(''); lecturaGuardadaRef.current = false }} className="w-full text-purple-300/60 text-sm py-2">Nuevo sueño</button>
              </>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
