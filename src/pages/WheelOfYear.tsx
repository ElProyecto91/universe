// src/pages/WheelOfYear.tsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSabbatActual, SABBATS } from '../lib/motores/ruedaDelAno'
import { useUserPlan, incrementarConsulta } from '../hooks/useUserPlan'
import { useAnalytics } from '../hooks/useAnalytics'
import { guardarLectura } from '../hooks/useHistorial'
import { llamarGemini } from '../lib/gemini'
import { supabase } from '../lib/supabase'
import Compartir from '../components/Compartir'
import DisclaimerIA from '../components/DisclaimerIA'
import PageLayout from '../components/PageLayout'
import TextoIA from '../components/TextoIA'

const HERRAMIENTA = 'wheel-of-year'

export default function WheelOfYear() {
  const navigate   = useNavigate()
  const userPlan   = useUserPlan()
  const analytics  = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [interpretacion, setInterpretacion] = useState('')
  const [cargando,       setCargando]       = useState(false)
  const [generado,       setGenerado]       = useState(false)
  const [fromCache,      setFromCache]      = useState(false)
  const lecturaGuardadaRef                  = useRef(false)

  const nombre       = localStorage.getItem('nombre') || 'viajero'
  const sabbatActual = getSabbatActual()
  const cacheKey     = `sabbat-${sabbatActual.nombre.toLowerCase().replace(/ /g, '-')}-${new Date().getFullYear()}`
  const fechaHoy     = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (!userPlan.cargando) analytics.registrarApertura()
  }, [userPlan.cargando])

  const generarLectura = async () => {
    setCargando(true)
    setGenerado(true)
    const t0 = Date.now()

    try {
      // Caché permanente por Sabbat
      const { data: cached } = await supabase.from('ai_cache').select('respuesta').eq('cache_key', cacheKey).maybeSingle()
      if (cached?.respuesta) {
        setInterpretacion(cached.respuesta)
        setFromCache(true)
        analytics.registrarLectura({ desdCache: true, tiempoMs: Date.now() - t0, modeloIa: 'cache' })
        setCargando(false)
        return
      }

      const base = `Eres una guía espiritual de la Rueda del Año. Sabbat actual: ${sabbatActual.nombre}, fecha: ${sabbatActual.fecha}, temas: ${sabbatActual.temas.join(', ')}. Responde SOLO con el texto en español, en prosa continua. Sin asteriscos, sin guiones, sin markdown, sin etiquetas, sin títulos. Exactamente 3 frases seguidas terminadas en punto.`

      const r1 = await llamarGemini({ herramienta: HERRAMIENTA, prompt: `${base} Habla sobre qué energía trae este Sabbat y qué significa en el ciclo de la naturaleza.`, userId: userPlan.userId, usarLite: true, cacheable: false, maxTokens: 250 })
      if (r1.error) { setInterpretacion('La rueda guarda silencio. Inténtalo de nuevo.'); return }

      await new Promise(r => setTimeout(r, 500))
      const r2 = await llamarGemini({ herramienta: HERRAMIENTA, prompt: `${base} Continuando desde: "${r1.texto.trim()}" — habla sobre qué están siendo llamadas a honrar, soltar o celebrar las personas en esta época.`, userId: userPlan.userId, usarLite: true, cacheable: false, maxTokens: 250 })
      if (r2.error) { setInterpretacion('La rueda guarda silencio. Inténtalo de nuevo.'); return }

      await new Promise(r => setTimeout(r, 500))
      const r3 = await llamarGemini({ herramienta: HERRAMIENTA, prompt: `${base} Continuando desde: "${r1.texto.trim()} ${r2.texto.trim()}" — nombra dos acciones concretas y sencillas para alinearse con esta energía hoy.`, userId: userPlan.userId, usarLite: true, cacheable: false, maxTokens: 250 })
      if (r3.error) { setInterpretacion('La rueda guarda silencio. Inténtalo de nuevo.'); return }

      const texto = [r1.texto, r2.texto, r3.texto].map(t => t.trim()).filter(Boolean).join('\n\n')
      setInterpretacion(texto)
      setFromCache(false)

      // Guardar en caché permanente
      supabase.from('ai_cache').insert({ cache_key: cacheKey, herramienta: HERRAMIENTA, prompt_hash: cacheKey, respuesta: texto, tokens_used: 0, expires_at: null }).then(() => {})
      if (userPlan.userId) await incrementarConsulta(userPlan.userId)
      analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: 'lite' })

      if (!lecturaGuardadaRef.current) {
        lecturaGuardadaRef.current = true
        await guardarLectura({ herramienta: HERRAMIENTA, titulo: `${sabbatActual.nombre} · ${fechaHoy}`, contenido: texto, metadatos: { sabbat: sabbatActual.nombre, fecha: fechaHoy, nombre } })
      }
    } catch (err) {
      console.error('[WheelOfYear]', err)
      setInterpretacion('La rueda guarda silencio. Inténtalo de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">

        <div className="flex items-center">
          <button onClick={() => navigate('/tradiciones')} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Rueda del Año</p>
            <p className="text-purple-300 text-xs">Ciclo estacional · Tradición pagana</p>
          </div>
        </div>

        <div className="bg-[#0d0015] border border-purple-500/50 rounded-3xl p-6">
          <p className="text-purple-400 text-xs tracking-widest uppercase mb-2">Próximo Sabbat</p>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white text-2xl font-bold">{sabbatActual.nombre}</h2>
            <span className="text-purple-300 text-sm">{sabbatActual.diasHasta}d</span>
          </div>
          <p className="text-white/50 text-xs mb-3">{sabbatActual.fecha}</p>
          <p className="text-white/70 text-sm leading-relaxed">{sabbatActual.descripcion}</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {sabbatActual.temas.map(t => (
            <span key={t} className="bg-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full">{t}</span>
          ))}
        </div>

        <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5">
          <p className="text-purple-400 text-xs tracking-widest uppercase mb-4">Conexiones simbólicas</p>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-white/40 text-xs uppercase">Tarot</span>
              <span className="text-white text-sm">{sabbatActual.tarot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40 text-xs uppercase">Runa</span>
              <span className="text-white text-sm">{sabbatActual.runa}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5">
          <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">Práctica estacional</p>
          <p className="text-white text-sm leading-relaxed">{sabbatActual.practica}</p>
        </div>

        <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5">
          <p className="text-purple-400 text-xs tracking-widest uppercase mb-4">La Rueda completa</p>
          <div className="flex flex-col gap-2">
            {SABBATS.map(s => (
              <div key={s.nombre} className={`flex justify-between items-center py-2 border-b border-white/5 last:border-0 ${s.nombre === sabbatActual.nombre ? 'text-purple-300' : 'text-white/50'}`}>
                <span className="text-sm font-medium">{s.nombre}</span>
                <span className="text-xs">{s.fecha}</span>
              </div>
            ))}
          </div>
        </div>

        {!generado ? (
          <button onClick={generarLectura} disabled={userPlan.cargando}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40">
            Mi guía estacional personal
          </button>
        ) : (
          <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-purple-400 text-xs tracking-widest uppercase">Tu guía personal</p>
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

        {!cargando && interpretacion && (
          <>
            <DisclaimerIA />
            <Compartir titulo={`${sabbatActual.nombre} · Rueda del Año`} texto={interpretacion} hashtags={['RuedaDelAno', 'Universe', sabbatActual.nombre]} />
          </>
        )}

        {generado && !cargando && (
          <button onClick={() => navigate('/guia')} className="w-full bg-[#0d0015] border border-white/15 text-white font-semibold py-4 rounded-full hover:border-purple-500/50 transition">
            Explorar con mi Guía IA
          </button>
        )}

      </div>
    </PageLayout>
  )
}
