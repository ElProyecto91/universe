import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserPlan, incrementarConsulta } from '../hooks/useUserPlan'
import { useAnalytics } from '../hooks/useAnalytics'
import { guardarLectura } from '../hooks/useHistorial'
import { llamarGemini } from '../lib/gemini'
import { getCartaDiaria } from '../lib/motores/tarotDiario'
import { getCartaSVG } from '../components/svg/TarotSVG'
import Compartir from '../components/Compartir'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import CtaUpsell from '../components/CtaUpsell'
import PageLayout from '../components/PageLayout'
import TextoIA from '../components/TextoIA'
import { supabase } from '../lib/supabase'

const HERRAMIENTA = 'tarot-diario'

export default function TarotDiario() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [revelada,       setRevelada]       = useState(false)
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando,       setCargando]       = useState(false)
  const [fromCache,      setFromCache]      = useState(false)
  const [errorMsg,       setErrorMsg]       = useState('')
  const [yaValorado,     setYaValorado]     = useState(false)
  const lecturaGuardadaRef                  = useRef(false)

  const nombre   = localStorage.getItem('nombre') || 'viajero'
  const signo    = localStorage.getItem('signo')  || 'Leo'
  const fechaHoy = new Date().toISOString().split('T')[0]
  const hoy      = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  const carta = getCartaDiaria()

  useEffect(() => {
    if (!userPlan.cargando) analytics.registrarApertura()
  }, [userPlan.cargando])

  const revelarCarta = async () => {
    setRevelada(true)
    setCargando(true)
    setErrorMsg('')
    const t0 = Date.now()

    try {
      // Caché diaria por carta (la carta es la misma para todos hoy)
      const { data: cached } = await supabase.from('horoscopo_cache')
        .select('contenido')
        .eq('signo', carta.nombre) // usamos nombre de carta como clave
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

      const prompt = [
        'Eres una tarotista sabia y poética.',
        'Responde SOLO con texto en español, en prosa continua. Sin asteriscos, sin guiones, sin cursivas, sin negritas, sin numeración, sin markdown.',
        'No empieces nunca con saludos ni con el nombre del usuario.',
        'Escribe exactamente 3 frases. No más.',
        '',
        `La carta del día para ${nombre} (${signo}) es "${carta.nombre}" (${carta.keywords}).`,
        '',
        'Interpreta el mensaje de esta carta para el día de hoy de forma poética y personal.',
        'Conecta la energía de la carta con situaciones que pueden surgir hoy.',
        'No expliques qué es la carta — interpreta su mensaje directo para este momento.',
        '',
        'Tono evocador y directo. Termina en punto.',
      ].join('\n')

      const result = await llamarGemini({
        herramienta: HERRAMIENTA, prompt,
        userId: userPlan.userId, usarLite: true,
        cacheable: false, maxTokens: 200,
      })

      if (!result.error && result.texto) {
        setInterpretacion(result.texto)
        setFromCache(false)
        if (userPlan.userId) await incrementarConsulta(userPlan.userId)
        analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: result.modelo })
        supabase.from('horoscopo_cache').insert({
          signo: carta.nombre, fecha: fechaHoy, tipo: HERRAMIENTA,
          contenido: result.texto, tokens_used: result.tokensUsados,
        }).then(() => {})
        if (!lecturaGuardadaRef.current) {
          lecturaGuardadaRef.current = true
          await guardarLectura({
            herramienta: HERRAMIENTA,
            titulo: `Carta del Día: ${carta.nombre} · ${fechaHoy}`,
            contenido: result.texto,
            metadatos: { carta: carta.nombre, fecha: fechaHoy, nombre, signo },
          })
        }
      } else {
        setInterpretacion(carta.mensaje) // fallback al mensaje estático
        setErrorMsg('')
      }
    } catch (err) {
      console.error('[TarotDiario]', err)
      setInterpretacion(carta.mensaje) // fallback al mensaje estático
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
      <div className="flex flex-col items-center gap-6">

        <div className="w-full flex items-center">
          <button onClick={() => navigate('/universo')} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-purple-400 text-xs tracking-widest uppercase">Carta del Día</p>
          </div>
          {!userPlan.cargando && !userPlan.esPremium && (
            <p className="text-white/40 text-xs">{userPlan.consultasRestantes}/{userPlan.limiteConsultasDia}</p>
          )}
        </div>

        <p className="text-white/40 text-xs tracking-wide capitalize">{hoy}</p>

        {!revelada ? (
          <div className="flex flex-col items-center gap-8 w-full">
            {/* Carta boca abajo */}
            <div
              className="w-36 h-56 rounded-xl cursor-pointer hover:scale-105 transition-transform"
              onClick={revelarCarta}
              style={{ boxShadow: '0 0 30px rgba(139,92,246,0.4)' }}
            >
              <svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <rect width="120" height="200" fill="#1a0f2e" rx="8"/>
                <rect x="4" y="4" width="112" height="192" fill="none" stroke="#c084fc" strokeWidth="1" rx="6"/>
                <rect x="8" y="8" width="104" height="184" fill="none" stroke="#7c3aed" strokeWidth="0.5" rx="4" strokeDasharray="3 3"/>
                {[...Array(6)].map((_, i) => (
                  <ellipse key={i} cx="60" cy="100" rx={15 + i * 12} ry={25 + i * 18} fill="none" stroke="#7c3aed" strokeWidth="0.5" opacity={0.8 - i * 0.1}/>
                ))}
                <circle cx="60" cy="100" r="8" fill="none" stroke="#c084fc" strokeWidth="1.5"/>
                <circle cx="60" cy="100" r="3" fill="#c084fc"/>
                {[[20,30],[100,30],[20,170],[100,170],[60,15],[60,185]].map(([x,y],i) => (
                  <path key={i} d={`M${x} ${y-4} L${x+1} ${y-1} L${x+4} ${y-1} L${x+2} ${y+1} L${x+3} ${y+4} L${x} ${y+2} L${x-3} ${y+4} L${x-2} ${y+1} L${x-4} ${y-1} L${x-1} ${y-1} Z`} fill="#7c3aed" opacity="0.6"/>
                ))}
              </svg>
            </div>
            <div className="text-center flex flex-col gap-4">
              <p className="text-white/60 text-sm">Centra tu mente. Cuando estés listo, toca la carta.</p>
              <button onClick={revelarCarta} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-10 rounded-full hover:opacity-90 transition">
                Revelar mi carta
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 w-full">
            {/* Carta real */}
            <div className="w-36 h-56 rounded-xl overflow-hidden" style={{ boxShadow: '0 0 40px rgba(192,132,252,0.5)' }}>
              {getCartaSVG(carta.nombre)}
            </div>

            <div className="text-center">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-1">{carta.numero}</p>
              <h2 className="text-2xl font-bold mb-2" style={{ textShadow: '0 0 20px rgba(192,132,252,0.6)' }}>{carta.nombre}</h2>
              <p className="text-white/40 text-xs tracking-wide">{carta.keywords}</p>
            </div>

            <div className="w-full bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-purple-400 text-xs tracking-widest uppercase">Tu mensaje de hoy</p>
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

            {!cargando && interpretacion && (
              <>
                <DisclaimerIA />
                <Valoracion onValorar={handleValorar} />
                <Compartir
                  titulo={`Mi carta del día: ${carta.nombre}`}
                  texto={interpretacion}
                  hashtags={['Tarot', 'Universe', 'CartaDelDia']}
                />
                <CtaUpsell consultasRestantes={userPlan.consultasRestantes} />
                <div className="w-full flex flex-col gap-3">
                  <button onClick={() => navigate('/guia')} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">
                    Explorar con mi Guía IA
                  </button>
                  <button onClick={() => navigate('/tarot')} className="w-full bg-[#0d0015] border border-white/15 text-white font-semibold py-4 rounded-full hover:border-white/30 transition">
                    Tirada completa de Tarot
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}