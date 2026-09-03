import { useState } from 'react'
import { MEDITACIONES, getMeditacionDelDia } from '../lib/motores/meditacion'
import { getSignoSolar } from '../lib/motores/horoscopo'
import { getFaseLunar } from '../lib/motores/luna'
import Compartir from '../components/Compartir'
import { supabase } from '../lib/supabase'
import { llamarGemini } from '../lib/gemini'

export default function Meditacion() {
  const [meditacionActiva, setMeditacionActiva] = useState<any>(null)
  const [guia, setGuia] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fromCache, setFromCache] = useState(false)
  const [fase, setFase] = useState<'elegir' | 'meditando'>('elegir')

  const nombre = localStorage.getItem('nombre') || 'viajero'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const signo = getSignoSolar(fechaNacimiento)
  const faseLunar = getFaseLunar()
  const meditacionDelDia = getMeditacionDelDia(signo)
  const fechaHoy = new Date().toISOString().split('T')[0]
  const userId = null

  const bgStyle = { backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }

  const iniciar = async (meditacion: any) => {
    setMeditacionActiva(meditacion)
    setFase('meditando')
    setCargando(true)
    setFromCache(false)

    const cacheKey = `meditacion-${meditacion.id}-${signo.toLowerCase()}-${fechaHoy}`

    try {
      const { data: cached } = await supabase.from('horoscopo_cache').select('contenido').eq('signo', `med-${meditacion.id}-${signo.toLowerCase()}`).eq('fecha', fechaHoy).eq('tipo', 'meditacion').maybeSingle()
      if (cached?.contenido) {
        setGuia(cached.contenido)
        setFromCache(true)
        setCargando(false)
        return
      }
    } catch (err) { console.warn('[Meditacion] Error caché:', err) }

    const result = await llamarGemini({
      herramienta: 'meditacion',
      prompt: `Guía de meditación experto.

Nombre: ${nombre} · Signo: ${signo} · Luna: ${faseLunar.nombre}
Meditación: ${meditacion.nombre} (${meditacion.duracion} min)
Tema: ${meditacion.descripcion}

Guía de meditación de 3-4 pasos breves y concretos. Tono suave, en segunda persona, presente. Sin música sugerida. Sin apps.`,
      userId, usarLite: true, cacheable: false, maxTokens: 200,
    })

    if (!result.error && result.texto) {
      setGuia(result.texto)
      supabase.from('horoscopo_cache').insert({ signo: `med-${meditacion.id}-${signo.toLowerCase()}`, fecha: fechaHoy, tipo: 'meditacion', contenido: result.texto, tokens_used: result.tokensUsados }).then(() => {})
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/80" />
      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">
        <div className="flex items-center">
          <button onClick={() => { if (fase === 'meditando') setFase('elegir'); else window.location.href = '/universo' }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Meditación</p>
            <p className="text-purple-300 text-xs">{signo} · {faseLunar.nombre}</p>
          </div>
        </div>
        {fase === 'elegir' && (
          <div className="flex flex-col gap-4">
            <div className="bg-purple-600/20 border border-purple-400/30 rounded-3xl p-5 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Recomendada para ti hoy</p>
              <p className="text-white font-bold">{meditacionDelDia.nombre}</p>
              <p className="text-white/60 text-xs mt-1">{meditacionDelDia.duracion} min · {meditacionDelDia.descripcion}</p>
              <button onClick={() => iniciar(meditacionDelDia)} className="mt-3 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-full text-sm">Iniciar</button>
            </div>
            {MEDITACIONES.map(m => (
              <button key={m.id} onClick={() => iniciar(m)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-left hover:bg-white/10 transition backdrop-blur">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-semibold text-sm">{m.nombre}</p>
                    <p className="text-white/50 text-xs mt-1">{m.descripcion}</p>
                  </div>
                  <span className="text-purple-300 text-xs ml-3">{m.duracion} min</span>
                </div>
              </button>
            ))}
          </div>
        )}
        {fase === 'meditando' && meditacionActiva && (
          <div className="flex flex-col gap-5">
            <div className="text-center py-4">
              <p className="text-6xl mb-3">{meditacionActiva.icono || '🧘'}</p>
              <p className="text-2xl font-bold mb-1">{meditacionActiva.nombre}</p>
              <p className="text-purple-300 text-sm">{meditacionActiva.duracion} minutos</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <div className="flex items-center justify-between mb-3">
                <p className="text-purple-300 text-xs tracking-widest uppercase">Tu guía</p>
                {fromCache && <span className="text-green-400 text-xs">⚡ Instantáneo</span>}
              </div>
              {cargando ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{guia}</p>}
            </div>
            {!cargando && guia && <Compartir titulo={`Meditación: ${meditacionActiva.nombre}`} texto={guia} hashtags={['Meditacion', 'Universe', 'Mindfulness']} />}
            <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">Explorar con mi Guía IA</button>
          </div>
        )}
      </div>
    </div>
  )
}
