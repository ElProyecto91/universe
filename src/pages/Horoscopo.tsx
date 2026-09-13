import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserPlan, incrementarConsulta } from '../hooks/useUserPlan'
import { useAnalytics } from '../hooks/useAnalytics'
import { guardarLectura } from '../hooks/useHistorial'
import { llamarGemini } from '../lib/gemini'
import { supabase } from '../lib/supabase'
import { getHoroscopoDelDia, getSignoSolar, SIGNOS, SIGNO_EMOJIS } from '../lib/motores/horoscopo'
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

  const [vistaActual,    setVistaActual]    = useState<'mi-signo' | 'todos'>('mi-signo')
  const [signoViendo,    setSignoViendo]    = useState<string | null>(null)
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando,       setCargando]       = useState(false)
  const [fromCache,      setFromCache]      = useState(false)
  const [errorMsg,       setErrorMsg]       = useState('')
  const [yaValorado,     setYaValorado]     = useState(false)
  const lecturaGuardadaRef                  = useRef(false)

  const nombre          = localStorage.getItem('nombre') || 'viajero'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const signoUsuario    = getSignoSolar(fechaNacimiento)
  const signoActual     = signoViendo || signoUsuario
  const horoscopo       = getHoroscopoDelDia(signoActual)
  const fechaHoy        = new Date().toISOString().split('T')[0]
  const hoy             = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  useEffect(() => {
    if (!userPlan.cargando) analytics.registrarApertura()
  }, [userPlan.cargando])

  const generarIA = async () => {
    setCargando(true); setErrorMsg('')
    const t0 = Date.now()

    try {
      const { data: cached } = await supabase.from('horoscopo_cache')
        .select('contenido')
        .eq('signo', signoActual.toLowerCase())
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
          `Signo: ${signoActual}. Fecha: ${fechaHoy}.`,
          `Contexto base: ${horoscopo.energia}`,
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
          signo: signoActual.toLowerCase(), fecha: fechaHoy, tipo: HERRAMIENTA,
          contenido: result.texto, tokens_used: result.tokensUsados,
        }).then(() => {})
        if (!lecturaGuardadaRef.current) {
          lecturaGuardadaRef.current = true
          await guardarLectura({
            herramienta: HERRAMIENTA,
            titulo: `Horóscopo ${signoActual} · ${fechaHoy}`,
            contenido: result.texto,
            metadatos: { signo: signoActual, fecha: fechaHoy, nombre },
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
          <button
            onClick={() => signoViendo ? setSignoViendo(null) : navigate('/universo')}
            className="text-purple-300 text-sm"
          >← {signoViendo ? `Volver a mi signo (${signoUsuario})` : 'Volver'}</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Horóscopo</p>
            <p className="text-purple-300 text-xs capitalize">{hoy}</p>
          </div>
        </div>

        {/* Tabs */}
        {!signoViendo && (
          <div className="flex gap-1 bg-white/5 border border-white/10 rounded-2xl p-1">
            {(['mi-signo', 'todos'] as const).map(v => (
              <button
                key={v}
                onClick={() => setVistaActual(v)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
                  vistaActual === v ? 'bg-purple-600 text-white' : 'text-white/50 hover:text-white/70'
                }`}
              >
                {v === 'mi-signo' ? 'Mi horóscopo' : 'Todos los signos'}
              </button>
            ))}
          </div>
        )}

        {/* ── MI SIGNO ─────────────────────────────────── */}
        {(vistaActual === 'mi-signo' || signoViendo) && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5 text-center">
              <p className="text-4xl mb-2">{SIGNO_EMOJIS[signoActual] ?? '⭐'}</p>
              <p className="text-white text-xl font-bold">{signoActual}</p>
              {signoViendo && signoViendo !== signoUsuario && (
                <p className="text-purple-300 text-xs mt-1">Tu signo: {signoUsuario}</p>
              )}
            </div>

            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5 flex flex-col gap-4">
              <div>
                <p className="text-purple-400 text-xs tracking-widest uppercase mb-2">Energía del día</p>
                <p className="text-white/80 text-sm leading-relaxed">{horoscopo.energia}</p>
              </div>
              <div className="border-t border-white/10 pt-4">
                <p className="text-red-300 text-xs tracking-widest uppercase mb-2">❤️ Amor</p>
                <p className="text-white/80 text-sm leading-relaxed">{horoscopo.amor}</p>
              </div>
              <div className="border-t border-white/10 pt-4">
                <p className="text-amber-300 text-xs tracking-widest uppercase mb-2">💼 Trabajo</p>
                <p className="text-white/80 text-sm leading-relaxed">{horoscopo.trabajo}</p>
              </div>
              <div className="border-t border-white/10 pt-4">
                <p className="text-green-300 text-xs tracking-widest uppercase mb-2">🌿 Salud</p>
                <p className="text-white/80 text-sm leading-relaxed">{horoscopo.salud}</p>
              </div>
              <div className="border-t border-white/10 pt-4">
                <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">✨ Afirmación del día</p>
                <p className="text-white/80 text-sm leading-relaxed italic">"{horoscopo.afirmacion}"</p>
              </div>
            </div>

            {!interpretacion ? (
              <div className="flex flex-col gap-3">
                <DisclaimerIA compact />
                <button
                  onClick={generarIA}
                  disabled={cargando || !userPlan.puedeConsultar}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
                >
                  {cargando ? 'Generando...' : 'Generar horóscopo completo con IA'}
                </button>
              </div>
            ) : (
              <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <p className="text-purple-400 text-xs tracking-widest uppercase">Lectura IA</p>
                  {fromCache && <span className="text-green-400 text-xs">⚡ Instantáneo</span>}
                </div>
                {cargando ? (
                  <div className="flex gap-2 py-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                ) : <TextoIA texto={interpretacion} />}
                {!cargando && interpretacion && (
                  <>
                    <DisclaimerIA />
                    <Valoracion onValorar={handleValorar} />
                    <Compartir
                      titulo={`Horóscopo ${signoActual} · ${fechaHoy}`}
                      texto={interpretacion}
                      hashtags={['Universe', 'Horoscopo', signoActual]}
                    />
                  </>
                )}
              </div>
            )}

            {errorMsg && <p className="text-red-300 text-sm text-center">{errorMsg}</p>}
            <CtaUpsell consultasRestantes={userPlan.consultasRestantes} />
            <button onClick={() => navigate('/guia')} className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full">Explorar con mi Guía IA</button>
          </div>
        )}

        {/* ── TODOS LOS SIGNOS ─────────────────────────── */}
        {vistaActual === 'todos' && !signoViendo && (
          <div className="grid grid-cols-3 gap-2">
            {SIGNOS.map(signo => (
              <button
                key={signo}
                onClick={() => { setSignoViendo(signo); setInterpretacion(''); lecturaGuardadaRef.current = false }}
                className={`bg-[#0d0015] border rounded-2xl p-4 flex flex-col items-center gap-2 transition hover:border-purple-500/50 ${
                  signo === signoUsuario ? 'border-purple-500/50' : 'border-white/15'
                }`}
              >
                <span className="text-2xl">{SIGNO_EMOJIS[signo]}</span>
                <span className="text-white text-xs font-semibold">{signo}</span>
                {signo === signoUsuario && (
                  <span className="text-purple-300 text-xs">Tu signo</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}