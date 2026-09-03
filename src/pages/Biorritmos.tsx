import { useState } from 'react'
import { calcularBiorritmos, getBiorritmoDia } from '../lib/motores/biorhythm'
import Compartir from '../components/Compartir'
import { supabase } from '../lib/supabase'
import { llamarGemini } from '../lib/gemini'

export default function Biorritmos() {
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [generado, setGenerado] = useState(false)
  const [fromCache, setFromCache] = useState(false)

  const nombre = localStorage.getItem('nombre') || 'viajero'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const biorritmos = calcularBiorritmos(fechaNacimiento)
  const hoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
  const fechaHoy = new Date().toISOString().split('T')[0]
  const cacheKey = `biorritmos-${fechaNacimiento}-${fechaHoy}`
  const userId = null

  const bgStyle = { backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }

  const generarLectura = async () => {
    setCargando(true)
    setGenerado(true)

    try {
      const { data: cached } = await supabase.from('ai_cache').select('respuesta').eq('cache_key', cacheKey).maybeSingle()
      if (cached?.respuesta) {
        setInterpretacion(`${nombre}, ${cached.respuesta}`)
        setFromCache(true)
        setCargando(false)
        return
      }
    } catch (err) { console.warn('[Biorritmos] Error caché:', err) }

    const result = await llamarGemini({
      herramienta: 'biorritmos',
      prompt: `Experto en biorritmología (herramienta de reflexión, no ciencia exacta).

Fecha: ${hoy}
Biorritmos:
- Físico: ${biorritmos.fisico}% (${biorritmos.fisico > 0 ? 'fase alta' : 'fase baja'})
- Emocional: ${biorritmos.emocional}% (${biorritmos.emocional > 0 ? 'fase alta' : 'fase baja'})
- Intelectual: ${biorritmos.intelectual}% (${biorritmos.intelectual > 0 ? 'fase alta' : 'fase baja'})
- Intuitivo: ${biorritmos.intuitivo}% (${biorritmos.intuitivo > 0 ? 'fase alta' : 'fase baja'})

3 párrafos: energía general del día, recomendaciones por área, 2-3 acciones concretas. Menciona brevemente que es herramienta de reflexión.`,
      userId,
      usarLite: false,
      cacheable: false,
      maxTokens: 350,
    })

    if (!result.error && result.texto) {
      setInterpretacion(`${nombre}, ${result.texto}`)
      setFromCache(false)
      supabase.from('ai_cache').insert({ cache_key: cacheKey, herramienta: 'biorritmos', prompt_hash: cacheKey, respuesta: result.texto, tokens_used: result.tokensUsados, expires_at: new Date(fechaHoy + 'T23:59:59').toISOString() }).then(() => {})
    } else {
      setInterpretacion('Los biorritmos guardan silencio. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  const BIORRITMOS_DATA = [
    { nombre: 'Físico', valor: biorritmos.fisico, descripcion: biorritmos.descripcionFisico, icono: '💪' },
    { nombre: 'Emocional', valor: biorritmos.emocional, descripcion: biorritmos.descripcionEmocional, icono: '❤️' },
    { nombre: 'Intelectual', valor: biorritmos.intelectual, descripcion: biorritmos.descripcionIntelectual, icono: '🧠' },
    { nombre: 'Intuitivo', valor: biorritmos.intuitivo, descripcion: biorritmos.descripcionIntuitivo, icono: '✨' },
  ]

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />
      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">
        <div className="flex items-center">
          <button onClick={() => window.location.href = '/universo'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Biorritmos</p>
            <p className="text-purple-300 text-xs capitalize">{hoy}</p>
          </div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 backdrop-blur">
          <p className="text-amber-400/80 text-xs">Herramienta de reflexión personal. La biorritmología no tiene base científica sólida pero es útil para la autoobservación.</p>
        </div>
        {BIORRITMOS_DATA.map(b => {
          const info = getBiorritmoDia(b.valor)
          return (
            <div key={b.nombre} className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{b.icono}</span>
                  <p className="text-white font-semibold">{b.nombre}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold" style={{ color: info.color }}>{info.label}</span>
                  <span className="text-white/50 text-xs">{b.valor > 0 ? '+' : ''}{b.valor}%</span>
                </div>
              </div>
              <div className="h-3 bg-white/10 rounded-full mb-2">
                <div className="h-3 rounded-full transition-all" style={{ width: `${info.porcentaje}%`, backgroundColor: info.color }} />
              </div>
              <p className="text-white/60 text-xs">{b.descripcion}</p>
            </div>
          )
        })}
        {!generado ? (
          <button onClick={generarLectura} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">Generar mi guía de biorritmos</button>
        ) : (
          <div className="bg-white/8 border border-white/20 rounded-3xl p-6 backdrop-blur" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-purple-300 text-xs tracking-widest uppercase">Tu guía de hoy</p>
              {fromCache && <span className="text-green-400 text-xs">⚡ Instantáneo</span>}
            </div>
            {cargando ? (
              <div className="flex gap-2 py-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{interpretacion}</p>}
          </div>
        )}
        {!cargando && interpretacion && <Compartir titulo="Mis Biorritmos de hoy" texto={interpretacion} hashtags={['Biorritmos', 'Universe', 'Bienestar', 'Autoconocimiento']} />}
        {generado && !cargando && <button onClick={() => window.location.href = '/guia'} className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full">Explorar con mi Guía IA</button>}
      </div>
    </div>
  )
}
