// src/pages/LunaOracle.tsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFaseLunar } from '../lib/motores/luna'
import { useUserPlan, incrementarConsulta } from '../hooks/useUserPlan'
import { useAnalytics } from '../hooks/useAnalytics'
import { guardarLectura } from '../hooks/useHistorial'
import { llamarGemini } from '../lib/gemini'
import { supabase } from '../lib/supabase'
import Compartir from '../components/Compartir'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import CtaUpsell from '../components/CtaUpsell'
import PageLayout from '../components/PageLayout'
import TextoIA from '../components/TextoIA'

const HERRAMIENTA = 'luna-oracle'

export default function LunaOracle() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [interpretacion, setInterpretacion] = useState('')
  const [cargando,       setCargando]       = useState(false)
  const [generado,       setGenerado]       = useState(false)
  const [fromCache,      setFromCache]      = useState(false)
  const [errorMsg,       setErrorMsg]       = useState('')
  const [yaValorado,     setYaValorado]     = useState(false)
  const lecturaGuardadaRef                  = useRef(false)

  const nombre   = localStorage.getItem('nombre') || 'viajero'
  const signo    = localStorage.getItem('signo')  || 'Leo'
  const fechaHoy = new Date().toISOString().split('T')[0]
  const hoy      = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
  const faseLunar = getFaseLunar()

  useEffect(() => {
    if (!userPlan.cargando) analytics.registrarApertura()
  }, [userPlan.cargando])

  const generarLectura = async () => {
    if (userPlan.cargando) return
    if (!userPlan.puedeConsultar) { analytics.registrarPaywall(); navigate('/premium'); return }
    if (!userPlan.esPremium && userPlan.consultasRestantes <= 0) {
      analytics.registrarLimite()
      setErrorMsg(`Has alcanzado tu límite diario de ${userPlan.limiteConsultasDia} consultas gratuitas.`)
      return
    }

    setCargando(true); setGenerado(true); setErrorMsg('')
    const t0 = Date.now()

    try {
      const { data: cached } = await supabase.from('horoscopo_cache').select('contenido')
        .eq('signo', `${signo.toLowerCase()}-${faseLunar.fase}`)
        .eq('fecha', fechaHoy).eq('tipo', HERRAMIENTA).maybeSingle()

      if (cached?.contenido) {
        setInterpretacion(cached.contenido); setFromCache(true)
        analytics.registrarLectura({ desdCache: true, tiempoMs: Date.now() - t0, modeloIa: 'cache' })
        setCargando(false); return
      }

      const prompt = [
        'Eres una guía lunar experta en astrología y ciclos de la luna.',
        'Escribe en español, en prosa fluida y continua. Sin asteriscos, sin guiones, sin markdown.',
        '',
        `El usuario se llama ${nombre}, signo ${signo}. Fase lunar actual: ${faseLunar.fase} (${faseLunar.descripcion}).`,
        '',
        'Escribe una guía lunar de 3 párrafos que fluyan naturalmente.',
        'Párrafo 1: qué energía trae esta fase lunar y cómo afecta a este signo en particular.',
        'Párrafo 2: qué áreas de vida están activadas y qué invita a trabajar esta luna.',
        'Párrafo 3: una práctica concreta para trabajar con esta energía lunar hoy.',
        '',
        'Tono poético y orientador. Separa párrafos con línea en blanco. Termina en punto.',
      ].join('\n')

      const result = await llamarGemini({ herramienta: HERRAMIENTA, prompt, userId: userPlan.userId, usarLite: true, cacheable: false, maxTokens: 600 })

      if (!result.error && result.texto) {
        setInterpretacion(result.texto); setFromCache(false)
        supabase.from('horoscopo_cache').insert({ signo: `${signo.toLowerCase()}-${faseLunar.fase}`, fecha: fechaHoy, tipo: HERRAMIENTA, contenido: result.texto, tokens_used: result.tokensUsados }).then(() => {})
        if (userPlan.userId) await incrementarConsulta(userPlan.userId)
        analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: result.modelo })
        if (!lecturaGuardadaRef.current) {
          lecturaGuardadaRef.current = true
          await guardarLectura({ herramienta: HERRAMIENTA, titulo: `Luna ${faseLunar.fase} · ${signo} · ${fechaHoy}`, contenido: result.texto, metadatos: { signo, fase: faseLunar.fase, fecha: fechaHoy, nombre } })
        }
      } else { setErrorMsg('La luna guarda silencio. Inténtalo de nuevo.') }
    } catch (err) { console.error('[LunaOracle]', err); setErrorMsg('Error inesperado.') }
    finally { setCargando(false) }
  }

  const handleValorar = (valor: 1 | -1) => { if (yaValorado) return; setYaValorado(true); analytics.registrarValoracion(valor) }

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <button onClick={() => navigate('/tradiciones')} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Luna Oracle</p>
            <p className="text-purple-300 text-xs">Ciclos lunares</p>
          </div>
          {!userPlan.cargando && !userPlan.esPremium && (
            <p className="text-white/40 text-xs">{userPlan.consultasRestantes}/{userPlan.limiteConsultasDia}</p>
          )}
        </div>

        <div className="bg-[#0d0015] border border-purple-500/50 rounded-3xl p-6 text-center">
          <p className="text-5xl mb-3">{faseLunar.emoji}</p>
          <p className="text-purple-400 text-xs tracking-widest uppercase mb-1">{faseLunar.fase}</p>
          <p className="text-white font-semibold text-sm">{signo} · {hoy}</p>
          <p className="text-white/50 text-xs mt-2">{faseLunar.descripcion}</p>
        </div>

        {!generado ? (
          <div className="flex flex-col gap-3">
            <DisclaimerIA compact />
            <button onClick={generarLectura} disabled={userPlan.cargando}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40">
              Mi guía lunar
            </button>
          </div>
        ) : (
          <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-purple-400 text-xs tracking-widest uppercase">Tu guía lunar</p>
              {fromCache && <span className="text-green-400 text-xs">⚡ Instantáneo</span>}
            </div>
            {cargando ? (
              <div className="flex gap-2 py-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : <TextoIA texto={interpretacion} />}
          </div>
        )}

        {errorMsg && (
          <div className="bg-[#0d0015] border border-red-400/50 rounded-2xl p-4">
            <p className="text-red-300 text-sm text-center">{errorMsg}</p>
            {!userPlan.esPremium && <button onClick={() => navigate('/premium')} className="mt-3 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold py-2 rounded-full">Hazte Premium</button>}
          </div>
        )}

        {!cargando && interpretacion && (
          <>
            <DisclaimerIA />
            <Valoracion onValorar={handleValorar} />
            <Compartir titulo={`Luna ${faseLunar.fase} · ${signo}`} texto={interpretacion} hashtags={['LunaOracle', 'Universe', signo]} />
            <CtaUpsell consultasRestantes={userPlan.consultasRestantes} />
            <button onClick={() => navigate('/guia')} className="w-full bg-[#0d0015] border border-white/15 text-white font-semibold py-4 rounded-full hover:border-purple-500/50 transition">Explorar con mi Guía IA</button>
          </>
        )}
      </div>
    </PageLayout>
  )
}
