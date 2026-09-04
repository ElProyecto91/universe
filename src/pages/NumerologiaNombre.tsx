import { useState } from 'react'
import Compartir from '../components/Compartir'
import { supabase } from '../lib/supabase'
import { llamarGemini } from '../lib/gemini'

export default function NumerologiaNombre() {
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [generado, setGenerado] = useState(false)
  const [fromCache, setFromCache] = useState(false)

  const nombre = localStorage.getItem('nombre') || 'viajero'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const signo = localStorage.getItem('signo') || 'Leo'
  const añoActual = new Date().getFullYear()
  const cacheKey = `numerologia-nombre-${fechaNacimiento}-${añoActual}`
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
    } catch (err) { console.warn('[NumerologiaNombre] Error caché:', err) }

    const result = await llamarGemini({
      herramienta: 'numerologia-nombre',
      prompt: `Eres experto en Numerología del Nombre. Nombre: ${nombre}, Signo: ${signo}, Fecha de nacimiento: ${fechaNacimiento}. Genera una lectura profunda y personalizada de 3-4 párrafos. Reflexivo, simbólico, poético. Sin predicciones absolutas.`,
      userId, usarLite: false, cacheable: false, maxTokens: 400,
    })

    if (!result.error && result.texto) {
      setInterpretacion(`${nombre}, ${result.texto}`)
      setFromCache(false)
      supabase.from('ai_cache').insert({
        cache_key: cacheKey, herramienta: 'numerologia-nombre', prompt_hash: cacheKey,
        respuesta: result.texto, tokens_used: result.tokensUsados, expires_at: null
      }).then(() => {})
    } else {
      setInterpretacion('El universo guarda silencio. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />
      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">
        <div className="flex items-center">
          <button onClick={() => window.location.href = '/tradiciones'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Numerología del Nombre</p>
            <p className="text-purple-300 text-xs">Vibración de tu nombre</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur text-center">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Numerología del Nombre</p>
          <p className="text-white/60 text-sm">Nacimiento: {fechaNacimiento} · Signo: {signo}</p>
        </div>
        {!generado ? (
          <button onClick={generarLectura} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">Generar mi lectura</button>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-3">
              <p className="text-purple-300 text-xs tracking-widest uppercase">Tu lectura</p>
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
        {!cargando && interpretacion && <Compartir titulo="Numerología del Nombre" texto={interpretacion} hashtags={['Universe', 'NumerologiaNombre']} />}
        {generado && !cargando && <button onClick={() => window.location.href = '/guia'} className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full">Explorar con mi Guía IA</button>}
      </div>
    </div>
  )
}
