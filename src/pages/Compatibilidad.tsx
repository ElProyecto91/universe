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
import { calcularCompatibilidad } from '../lib/motores/compatibilidad'
import { supabase } from '../lib/supabase'

const HERRAMIENTA = 'compatibilidad'

export default function Compatibilidad() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [nombre1,        setNombre1]        = useState(localStorage.getItem('nombre') || '')
  const [fecha1,         setFecha1]         = useState(localStorage.getItem('fechaNacimiento') || '')
  const [nombre2,        setNombre2]        = useState('')
  const [fecha2,         setFecha2]         = useState('')
  const [interpretacion, setInterpretacion] = useState('')
  const [resultado,      setResultado]      = useState<any>(null)
  const [cargando,       setCargando]       = useState(false)
  const [fase,           setFase]           = useState<'datos' | 'resultado'>('datos')
  const [fromCache,      setFromCache]      = useState(false)
  const [errorMsg,       setErrorMsg]       = useState('')
  const [yaValorado,     setYaValorado]     = useState(false)
  const lecturaGuardadaRef                  = useRef(false)

  const fechaHoy = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (!userPlan.cargando) analytics.registrarApertura()
  }, [userPlan.cargando])

  if (!userPlan.cargando && !userPlan.esPremium) {
    analytics.registrarPaywall(); navigate('/premium'); return null
  }

  const calcular = async () => {
    if (!nombre1 || !fecha1 || !nombre2 || !fecha2) return
    const res = calcularCompatibilidad(nombre1, fecha1, nombre2, fecha2)
    setResultado(res)
    setFase('resultado')
    setCargando(true)
    setFromCache(false)
    const t0 = Date.now()

    try {
      const fechasOrdenadas = [fecha1, fecha2].sort().join('-')
      const cacheKey = `compatibilidad-${fechasOrdenadas}`

      const { data: cached } = await supabase.from('ai_cache')
        .select('respuesta')
        .eq('cache_key', cacheKey)
        .maybeSingle()

      if (cached?.respuesta) {
        const textoPersonalizado = cached.respuesta
          .replace(/Persona 1/g, nombre1)
          .replace(/Persona 2/g, nombre2)
        setInterpretacion(textoPersonalizado)
        setFromCache(true)
        analytics.registrarLectura({ desdCache: true, tiempoMs: Date.now() - t0, modeloIa: 'cache' })
        setCargando(false)
        return
      }

      const prompt = [
        'Eres una experta en numerología y compatibilidad entre personas.',
        'Responde SOLO con texto en español, en prosa continua. Sin asteriscos, sin guiones, sin cursivas, sin negritas, sin numeración, sin markdown.',
        'No empieces nunca el texto con el nombre del usuario ni con saludos.',
        'Cada párrafo tiene máximo 3 frases cortas. Es obligatorio completar los 4 párrafos.',
        '',
        `Persona 1: ${nombre1} — Número de Vida ${res.persona1.numeroVida}`,
        `Persona 2: ${nombre2} — Número de Vida ${res.persona2.numeroVida}`,
        `Número de Conexión: ${res.numeroConexion} — ${res.conexion.titulo}`,
        `Descripción: ${res.conexion.descripcion}`,
        `Desafío: ${res.conexion.desafio}`,
        `Potencial: ${res.conexion.potencial}`,
        '',
        'Escribe exactamente 4 párrafos separados por línea en blanco.',
        `Párrafo 1: la energía del Número de Vida ${res.persona1.numeroVida} de ${nombre1}.`,
        `Párrafo 2: la energía del Número de Vida ${res.persona2.numeroVida} de ${nombre2}.`,
        `Párrafo 3: el significado del Número de Conexión ${res.numeroConexion} entre ambas personas.`,
        'Párrafo 4: un consejo práctico para aprovechar el potencial de esta relación.',
        '',
        'Tono equilibrado — explora potencial y desafíos sin afirmar que la relación funcionará o no. Termina en punto.',
      ].join('\n')

      const result = await llamarGemini({
        herramienta: HERRAMIENTA, prompt,
        userId: userPlan.userId, usarLite: true,
        cacheable: false, maxTokens: 500,
      })

      if (!result.error && result.texto) {
        setInterpretacion(result.texto)
        if (userPlan.userId) await incrementarConsulta(userPlan.userId)
        analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: result.modelo })
        supabase.from('ai_cache').insert({
          cache_key: cacheKey, herramienta: HERRAMIENTA,
          prompt_hash: cacheKey, respuesta: result.texto,
          tokens_used: result.tokensUsados, expires_at: null,
        }).then(() => {})
        if (!lecturaGuardadaRef.current) {
          lecturaGuardadaRef.current = true
          await guardarLectura({
            herramienta: HERRAMIENTA,
            titulo: `Compatibilidad: ${nombre1} y ${nombre2} · ${fechaHoy}`,
            contenido: `Número de Conexión ${res.numeroConexion}: ${res.conexion.titulo}\n\n${result.texto}`,
            metadatos: { nombre1, nombre2, fecha1, fecha2, numeroConexion: res.numeroConexion },
          })
        }
      } else {
        setErrorMsg(result.error || 'Los números guardan silencio. Inténtalo de nuevo.')
      }
    } catch (err) {
      console.error('[Compatibilidad]', err)
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
            onClick={() => fase === 'resultado' ? (setFase('datos'), setInterpretacion(''), setResultado(null), setFromCache(false), lecturaGuardadaRef.current = false) : navigate('/tradiciones')}
            className="text-purple-300 text-sm"
          >← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Compatibilidad</p>
            <p className="text-purple-300 text-xs">Numerología · Dos personas</p>
          </div>
          <span className="text-purple-400 text-xs border border-purple-400/30 rounded-full px-2 py-0.5">✨ Premium</span>
        </div>

        {fase === 'datos' && (
          <div className="flex flex-col gap-5">
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5">
              <p className="text-white/60 text-sm leading-relaxed text-center">Introduce los datos de dos personas para explorar su compatibilidad numerológica.</p>
            </div>
            <div className="bg-[#0d0015] border border-purple-500/30 rounded-3xl p-5 flex flex-col gap-3">
              <p className="text-purple-300 text-xs tracking-widest uppercase">Primera persona</p>
              <input type="text" placeholder="Nombre completo" value={nombre1} onChange={e => setNombre1(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-purple-400 text-sm" />
              <input type="date" value={fecha1} onChange={e => setFecha1(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white outline-none focus:border-purple-400 text-sm" />
            </div>
            <div className="bg-[#0d0015] border border-pink-500/30 rounded-3xl p-5 flex flex-col gap-3">
              <p className="text-pink-300 text-xs tracking-widest uppercase">Segunda persona</p>
              <input type="text" placeholder="Nombre completo" value={nombre2} onChange={e => setNombre2(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-pink-400 text-sm" />
              <input type="date" value={fecha2} onChange={e => setFecha2(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white outline-none focus:border-pink-400 text-sm" />
            </div>
            <DisclaimerIA compact />
            <button onClick={calcular} disabled={!nombre1 || !fecha1 || !nombre2 || !fecha2} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full disabled:opacity-40">Explorar compatibilidad</button>
          </div>
        )}

        {fase === 'resultado' && resultado && (
          <div className="flex flex-col gap-5">
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-center flex-1">
                  <p className="text-purple-300 text-2xl font-bold">{resultado.persona1.numeroVida}</p>
                  <p className="text-white text-sm font-semibold">{resultado.persona1.nombre}</p>
                  <p className="text-white/40 text-xs">Número de Vida</p>
                </div>
                <div className="text-center px-4">
                  <p className="text-white/30 text-2xl">+</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-pink-300 text-2xl font-bold">{resultado.persona2.numeroVida}</p>
                  <p className="text-white text-sm font-semibold">{resultado.persona2.nombre}</p>
                  <p className="text-white/40 text-xs">Número de Vida</p>
                </div>
              </div>
              <div className="border-t border-white/10 pt-4 text-center">
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Número de Conexión</p>
                <p className="text-4xl font-bold text-white mb-1">{resultado.numeroConexion}</p>
                <p className="text-purple-300 font-semibold">{resultado.conexion.titulo}</p>
              </div>
            </div>

            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5 flex flex-col gap-3">
              <p className="text-white/70 text-sm leading-relaxed">{resultado.conexion.descripcion}</p>
              <div className="border-t border-white/10 pt-3">
                <p className="text-amber-400 text-xs tracking-widest uppercase mb-1">Desafío</p>
                <p className="text-white/60 text-xs">{resultado.conexion.desafio}</p>
              </div>
              <div className="border-t border-white/10 pt-3">
                <p className="text-green-400 text-xs tracking-widest uppercase mb-1">Potencial</p>
                <p className="text-white/60 text-xs">{resultado.conexion.potencial}</p>
              </div>
            </div>

            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-purple-400 text-xs tracking-widest uppercase">Lectura profunda</p>
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

            {!cargando && interpretacion && (
              <>
                <DisclaimerIA />
                <Valoracion onValorar={handleValorar} />
                <Compartir
                  titulo={`Compatibilidad: ${resultado.persona1.nombre} y ${resultado.persona2.nombre}`}
                  texto={`Número de Conexión ${resultado.numeroConexion}: ${resultado.conexion.titulo}\n\n${interpretacion}`}
                  hashtags={['Compatibilidad', 'Universe', 'Numerologia']}
                />
                <button onClick={() => navigate('/guia')} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">Explorar con mi Guía IA</button>
                <button onClick={() => { setFase('datos'); setInterpretacion(''); setResultado(null); setFromCache(false); lecturaGuardadaRef.current = false }} className="w-full text-purple-300/60 text-sm py-2">Nueva compatibilidad</button>
              </>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}