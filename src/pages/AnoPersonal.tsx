import { useState } from 'react'
import { calcularAnoPersonal, AÑOS_PERSONALES } from '../lib/motores/anoPersonal'
import Compartir from '../components/Compartir'
import { supabase } from '../lib/supabase'
import { llamarGemini } from '../lib/gemini'

export default function AnoPersonal() {
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [generado, setGenerado] = useState(false)
  const [fromCache, setFromCache] = useState(false)

  const nombre = localStorage.getItem('nombre') || 'viajero'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const numeroAno = calcularAnoPersonal(fechaNacimiento)
  const anoData = AÑOS_PERSONALES[numeroAno]
  const añoActual = new Date().getFullYear()
  const cacheKey = `ano-personal-${numeroAno}-${añoActual}`
  const userId = null // TODO: ID real

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
    } catch (err) { console.warn('[AnoPersonal] Error caché:', err) }

    const result = await llamarGemini({
      herramienta: 'ano-personal',
      prompt: `Experta en numerología personal y ciclos de vida.

Año: ${añoActual} · Año Personal: ${numeroAno} — ${anoData.titulo}
Descripción: ${anoData.descripcion}
Temas: ${anoData.temas.join(', ')}
Oportunidad: ${anoData.oportunidad} · Desafío: ${anoData.desafio}

3-4 párrafos: energía del Año Personal ${numeroAno}, oportunidades y desafíos, mención breve del año anterior (${numeroAno - 1 === 0 ? 9 : numeroAno - 1}) y siguiente (${numeroAno + 1 > 9 ? 1 : numeroAno + 1}), consejo final.
Tono reflexivo, simbólico. Máximo 250 palabras.`,
      userId,
      usarLite: false,
      cacheable: false,
      maxTokens: 450,
    })

    if (!result.error && result.texto) {
      setInterpretacion(`${nombre}, ${result.texto}`)
      setFromCache(false)
      supabase.from('ai_cache').insert({ cache_key: cacheKey, herramienta: 'ano-personal', prompt_hash: cacheKey, respuesta: result.texto, tokens_used: result.tokensUsados, expires_at: null }).then(() => {})
    } else {
      setInterpretacion('Los números guardan silencio. Inténtalo de nuevo.')
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
            <p className="text-white font-semibold text-sm">Año Personal {añoActual}</p>
            <p className="text-purple-300 text-xs">Numerología · Tu ciclo actual</p>
          </div>
        </div>
        <div className="bg-white/5 border border-purple-500/30 rounded-3xl p-6 backdrop-blur flex flex-col items-center gap-3">
          <p className="text-purple-300 text-xs tracking-widest uppercase">Tu Año Personal</p>
          <p className="text-8xl font-light text-purple-300" style={{ textShadow: '0 0 30px rgba(192,132,252,0.5)' }}>{numeroAno}</p>
          <p className="text-xl font-bold text-center">{anoData.titulo}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
          <p className="text-white/80 text-sm leading-relaxed">{anoData.descripcion}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {anoData.temas.map(t => <span key={t} className="bg-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full">{t}</span>)}
        </div>
        <div className="grid grid-cols-1 gap-3">
          {[['green-400','Oportunidad',anoData.oportunidad],['amber-400','Desafío',anoData.desafio],['purple-300','Consejo',anoData.consejo]].map(([color, label, text]) => (
            <div key={label as string} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <p className={`text-${color} text-xs tracking-widest uppercase mb-2`}>{label as string}</p>
              <p className="text-white/70 text-sm leading-relaxed">{text as string}</p>
            </div>
          ))}
        </div>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-4">Tu ciclo de 9 años</p>
          <div className="flex gap-2 flex-wrap justify-center">
            {[1,2,3,4,5,6,7,8,9].map(n => (
              <div key={n} className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition ${n === numeroAno ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/40'}`}>{n}</div>
            ))}
          </div>
        </div>
        {!generado ? (
          <button onClick={generarLectura} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">Generar mi lectura del año</button>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-3">
              <p className="text-purple-300 text-xs tracking-widest uppercase">Tu lectura completa</p>
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
        {!cargando && interpretacion && <Compartir titulo={`Mi Año Personal ${numeroAno}: ${anoData.titulo}`} texto={interpretacion} hashtags={['AnoPersonal', 'Universe', 'Numerologia', `Ano${numeroAno}`]} />}
        {generado && !cargando && <button onClick={() => window.location.href = '/guia'} className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full">Explorar con mi Guía IA</button>}
      </div>
    </div>
  )
}
