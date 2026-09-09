// src/pages/Cristales.tsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CRISTALES, getCristalDelDia, getCristalRecomendado } from '../lib/motores/cristales'
import { getSignoSolar } from '../lib/motores/horoscopo'
import { useUserPlan, incrementarConsulta } from '../hooks/useUserPlan'
import { useAnalytics } from '../hooks/useAnalytics'
import { guardarLectura } from '../hooks/useHistorial'
import { llamarGemini } from '../lib/gemini'
import { supabase } from '../lib/supabase'
import Compartir from '../components/Compartir'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import PageLayout from '../components/PageLayout'
import TextoIA from '../components/TextoIA'

const HERRAMIENTA = 'cristales'

export default function Cristales() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [cristalKey,     setCristalKey]     = useState<string | null>(null)
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando,       setCargando]       = useState(false)
  const [fase,           setFase]           = useState<'elegir' | 'resultado'>('elegir')
  const [fromCache,      setFromCache]      = useState(false)
  const [yaValorado,     setYaValorado]     = useState(false)
  const lecturaGuardadaRef                  = useRef(false)

  const nombre          = localStorage.getItem('nombre')          || 'viajero'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const intencion       = localStorage.getItem('intencion')       || 'Espiritualidad'
  const signo           = getSignoSolar(fechaNacimiento)
  const cristalDelDia   = getCristalDelDia()
  const cristalRecom    = getCristalRecomendado(signo, intencion)

  useEffect(() => {
    if (!userPlan.cargando) analytics.registrarApertura()
  }, [userPlan.cargando])

  const explorar = async (key: string) => {
    setCristalKey(key)
    setFase('resultado')
    setCargando(true)
    setFromCache(false)
    lecturaGuardadaRef.current = false
    const cristal = CRISTALES[key]
    const cacheKey = `cristal-${key.toLowerCase().replace(/ /g, '-')}-${signo.toLowerCase()}`
    const t0 = Date.now()

    try {
      // Caché permanente por cristal + signo
      const { data: cached } = await supabase.from('ai_cache').select('respuesta')
        .eq('cache_key', cacheKey).maybeSingle()

      if (cached?.respuesta) {
        setInterpretacion(cached.respuesta)
        setFromCache(true)
        analytics.registrarLectura({ desdCache: true, tiempoMs: Date.now() - t0, modeloIa: 'cache' })
        setCargando(false)
        return
      }

      const prompt = [
        'Eres un experto en cristaloterapia y simbolismo de piedras en tradiciones culturales.',
        'Escribe en español, en prosa, sin listas, sin asteriscos, sin markdown.',
        '',
        `El usuario se llama ${nombre} y su signo es ${signo}.`,
        `Va a trabajar con: ${key}. Keywords: ${cristal.keywords}. Chakra: ${cristal.chakra}. Planeta: ${cristal.planeta}.`,
        '',
        `Escribe exactamente 2 párrafos dirigiéndote a ${nombre} directamente. Sin introducción genérica.`,
        `Párrafo 1: energía y propiedades del cristal ${key} desde tradiciones históricas y su conexión con la energía de ${signo}.`,
        `Párrafo 2: instrucciones prácticas de uso y una afirmación poderosa para trabajar con este cristal.`,
        '',
        'Cada párrafo máximo 3 frases. Separa con línea en blanco. Termina siempre en punto.',
      ].join('\n')

      const result = await llamarGemini({
        herramienta: HERRAMIENTA,
        prompt,
        userId: userPlan.userId,
        usarLite: false,
        cacheable: false,
        maxTokens: 700,
        temperatura: 0.7,
      })

      if (!result.error && result.texto) {
        setInterpretacion(result.texto)
        setFromCache(false)
        // Caché permanente
        supabase.from('ai_cache').insert({
          cache_key: cacheKey, herramienta: HERRAMIENTA,
          prompt_hash: cacheKey, respuesta: result.texto,
          tokens_used: result.tokensUsados, expires_at: null,
        }).then(() => {})
        if (userPlan.userId) await incrementarConsulta(userPlan.userId)
        analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: result.modelo })
        if (!lecturaGuardadaRef.current) {
          lecturaGuardadaRef.current = true
          await guardarLectura({
            herramienta: HERRAMIENTA,
            titulo: `${key} · ${signo}`,
            contenido: result.texto,
            metadatos: { cristal: key, signo, nombre },
          })
        }
      } else {
        setInterpretacion('El cristal guarda silencio. Inténtalo de nuevo.')
      }
    } catch (err) {
      console.error('[Cristales]', err)
      setInterpretacion('Error inesperado. Inténtalo de nuevo.')
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
          <button onClick={() => fase === 'resultado' ? setFase('elegir') : navigate('/tradiciones')} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Cristaloterapia</p>
            <p className="text-purple-300 text-xs">Guía de cristales · Tradiciones del mundo</p>
          </div>
        </div>

        {fase === 'elegir' && (
          <div className="flex flex-col gap-5">

            {/* Recomendado */}
            <div className="bg-[#0d0015] border border-purple-500/50 rounded-3xl p-5">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">✨ Recomendado para ti</p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CRISTALES[cristalRecom]?.hex, boxShadow: `0 0 20px ${CRISTALES[cristalRecom]?.hex}60` }} />
                <div className="flex-1">
                  <p className="text-white font-bold">{cristalRecom}</p>
                  <p className="text-white/60 text-xs">{CRISTALES[cristalRecom]?.keywords}</p>
                  <p className="text-purple-400 text-xs mt-1">Para tu intención: {intencion}</p>
                </div>
                <button onClick={() => explorar(cristalRecom)}
                  className="text-purple-300 text-xs border border-purple-500/40 rounded-full px-3 py-1 hover:bg-purple-500/20 transition">
                  Explorar
                </button>
              </div>
            </div>

            {/* Cristal del día */}
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-4">
              <p className="text-white/50 text-xs tracking-widest uppercase mb-3">Cristal del día</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CRISTALES[cristalDelDia]?.hex }} />
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{cristalDelDia}</p>
                  <p className="text-white/50 text-xs">{CRISTALES[cristalDelDia]?.keywords}</p>
                </div>
                <button onClick={() => explorar(cristalDelDia)}
                  className="text-purple-300 text-xs border border-purple-500/40 rounded-full px-3 py-1 hover:bg-purple-500/20 transition">
                  Ver
                </button>
              </div>
            </div>

            <p className="text-white/50 text-xs tracking-widest uppercase">Todos los cristales</p>

            <div className="grid grid-cols-2 gap-3">
              {Object.entries(CRISTALES).map(([key, cristal]) => (
                <button key={key} onClick={() => explorar(key)}
                  className="bg-[#0d0015] border border-white/15 rounded-2xl p-4 text-left hover:border-purple-500/40 transition flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cristal.hex, boxShadow: `0 0 10px ${cristal.hex}40` }} />
                  <div>
                    <p className="text-white text-sm font-semibold">{key}</p>
                    <p className="text-white/40 text-xs">{cristal.keywords.split(' · ')[0]}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {fase === 'resultado' && cristalKey && CRISTALES[cristalKey] && (
          <div className="flex flex-col gap-5">

            {/* Card del cristal */}
            <div className="bg-[#0d0015] rounded-3xl p-6 flex flex-col items-center gap-4"
              style={{ border: `1px solid ${CRISTALES[cristalKey].hex}40` }}>
              <div className="w-24 h-24 rounded-full"
                style={{ backgroundColor: CRISTALES[cristalKey].hex, boxShadow: `0 0 40px ${CRISTALES[cristalKey].hex}60` }} />
              <p className="text-white text-2xl font-bold">{cristalKey}</p>
              <p className="text-sm text-center" style={{ color: CRISTALES[cristalKey].hex }}>
                {CRISTALES[cristalKey].keywords}
              </p>
            </div>

            {/* Atributos */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Chakra', valor: CRISTALES[cristalKey].chakra.split(' ')[0] },
                { label: 'Elemento', valor: CRISTALES[cristalKey].elemento.split(' · ')[0] },
                { label: 'Planeta', valor: CRISTALES[cristalKey].planeta.split(' · ')[0] },
              ].map(item => (
                <div key={item.label} className="bg-[#0d0015] border border-white/15 rounded-2xl p-3 text-center">
                  <p className="text-white/40 text-xs uppercase">{item.label}</p>
                  <p className="text-white text-xs font-semibold mt-1">{item.valor}</p>
                </div>
              ))}
            </div>

            {/* Propiedades */}
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">Propiedades</p>
              {CRISTALES[cristalKey].propiedades.map((p, i) => (
                <p key={i} className="text-white text-xs mb-1">· {p}</p>
              ))}
            </div>

            {/* Cómo usarlo */}
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">Cómo usarlo</p>
              {CRISTALES[cristalKey].usos.map((u, i) => (
                <p key={i} className="text-white text-xs mb-1">· {u}</p>
              ))}
            </div>

            {/* Afirmación */}
            <div className="bg-[#0d0015] border border-purple-500/40 rounded-2xl p-4">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-2">Afirmación</p>
              <p className="text-white font-medium text-sm italic">"{CRISTALES[cristalKey].afirmacion}"</p>
            </div>

            {/* Lectura IA */}
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-purple-400 text-xs tracking-widest uppercase">Tu lectura</p>
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
                <Compartir titulo={`Mi cristal: ${cristalKey}`} texto={interpretacion} hashtags={['Cristaloterapia', 'Universe', cristalKey]} />
              </>
            )}

            <button onClick={() => navigate('/guia')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">
              Explorar con mi Guía IA
            </button>
            <button onClick={() => { setFase('elegir'); setCristalKey(null); setInterpretacion(''); setFromCache(false) }}
              className="w-full text-purple-300/60 text-sm py-2">
              Explorar otro cristal
            </button>

          </div>
        )}

      </div>
    </PageLayout>
  )
}
