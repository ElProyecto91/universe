import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserPlan, incrementarConsulta } from '../hooks/useUserPlan'
import { useAnalytics } from '../hooks/useAnalytics'
import { guardarLectura } from '../hooks/useHistorial'
import { llamarGemini } from '../lib/gemini'
import { getSignoSolar } from '../lib/motores/horoscopo'
import { supabase } from '../lib/supabase'
import Compartir from '../components/Compartir'
import CtaUpsell from '../components/CtaUpsell'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import PageLayout from '../components/PageLayout'
import TextoIA from '../components/TextoIA'

const HERRAMIENTA = 'horoscopo'

export default function Horoscopo() {
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

  const nombre          = localStorage.getItem('nombre') || 'viajero'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const signo           = getSignoSolar(fechaNacimiento)
  const fechaHoy        = new Date().toISOString().split('T')[0]
  const hoy             = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  useEffect(() => {
    if (!userPlan.cargando) analytics.registrarApertura()
  }, [userPlan.cargando])

  const generarLectura = async () => {
    setCargando(true); setGenerado(true); setErrorMsg('')
    const t0 = Date.now()

    try {
      const { data: cached } = await supabase.from('horoscopo_cache')
        .select('contenido')
        .eq('signo', signo.toLowerCase())
        .eq('fecha', fechaHoy)
        .eq('tipo', HERRAMIENTA)
        .maybeSingle()

      if (cached?.contenido) {
        setInterpretacion(cached.contenido)
        setFromCache(true)
        analytics.registrarLectura({ desdCache: true, tiempoMs: Date.now() - t0, modeloIa: 'cache' })
        setCargando(false)
        return
      }

      const result = await llamarGemini({
        herramienta: HERRAMIENTA,
        prompt: [
          'Eres una astróloga experta en horóscopos diarios.',
          'Responde SOLO con texto en español, en prosa continua. Sin asteriscos, sin guiones, sin cursivas, sin negritas, sin numeración, sin markdown.',
          'PROHIBIDO empezar con saludos, con el nombre del usuario o con cualquier introducción. Empieza DIRECTAMENTE con el horóscopo.',
          'Cada párrafo tiene MÁXIMO 3 frases cortas. Obligatorio.',
          '',
          `Signo: ${signo}. Fecha: ${fechaHoy}.`,
          '',
          'Escribe exactamente 3 párrafos separados por línea en blanco.',
          'Párrafo 1: la energía general del día para este signo.',
          'Párrafo 2: amor y relaciones.',
          'Párrafo 3: trabajo, dinero y consejo práctico para hoy.',
          '',
          'Tono positivo, evocador y práctico. Termina en punto.',
        ].join('\n'),
        userId: userPlan.userId, usarLite: true,
        cacheable: false, maxTokens: 300,
      })

      if (!result.error && result.texto) {
        setInterpretacion(result.texto)
        setFromCache(false)
        if (userPlan.userId) await incrementarConsulta(userPlan.userId)
        analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: result.modelo })
        supabase.from('horoscopo_cache').insert({
          signo: signo.toLowerCase(), fecha: fechaHoy, tipo: HERRAMIENTA,
          contenido: result.texto, tokens_used: result.tokensUsados,
        }).then(() => {})
        if (!lecturaGuardadaRef.current) {
          lecturaGuardadaRef.current = true
          await guardarLectura({
            herramienta: HERRAMIENTA,
            titulo: `Horóscopo ${signo} · ${fechaHoy}`,
            contenido: result.texto,
            metadatos: { signo, fecha: fechaHoy, nombre },
          })
        }
      } else {
        setErrorMsg(result.error || 'El universo guarda silencio. Inténtalo de nuevo.')
      }
    } catch (err) {
      console.error('[Horoscopo]', err)
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

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <button onClick={() => navigate('/universo')} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Horóscopo Diario</p>
            <p className="text-purple-300 text-xs capitalize">{hoy}</p>
          </div>
        </div>

        <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5 text-center">
          <p className="text-purple-400 text-xs tracking-widest uppercase mb-1">Tu signo</p>
          <p className="text-white text-2xl font-bold">{signo}</p>
          <p className="text-white/40 text-xs mt-1">{fechaHoy}</p>
        </div>

        {!generado ? (
          <div className="flex flex-col gap-3">
            <DisclaimerIA compact />
            <button
              onClick={generarLectura}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
            >Ver mi horóscopo</button>
          </div>
        ) : (
          <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-purple-400 text-xs tracking-widest uppercase">Tu horóscopo</p>
              {fromCache && <span className="text-green-400 text-xs">⚡ Instantáneo</span>}
            </div>
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
        )}

        {!cargando && interpretacion && (
          <>
            <DisclaimerIA />
            <Valoracion onValorar={handleValorar} />
            <Compartir
              titulo={`Horóscopo ${signo} · ${fechaHoy}`}
              texto={interpretacion}
              hashtags={['Universe', 'Horoscopo', signo]}
            />
            <CtaUpsell consultasRestantes={userPlan.consultasRestantes} />
            <button onClick={() => navigate('/guia')} className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full">Explorar con mi Guía IA</button>
          </>
        )}
      </div>
    </PageLayout>
  )
}