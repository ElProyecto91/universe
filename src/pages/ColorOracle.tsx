import { useState } from 'react'
import { COLORES, getColorDelDia, getColorAleatorio } from '../lib/motores/colorOracle'
import Compartir from '../components/Compartir'
import { supabase } from '../lib/supabase'
import { llamarGemini } from '../lib/gemini'

type ColorKey = keyof typeof COLORES

export default function ColorOracle() {
  const [colorKey, setColorKey] = useState<ColorKey | null>(null)
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'elegir' | 'resultado'>('elegir')
  const [situacion, setSituacion] = useState('')
  const [fromCache, setFromCache] = useState(false)

  const nombre = localStorage.getItem('nombre') || 'viajero'
  const colorDelDia = getColorDelDia()
  const userId = null

  const bgStyle = { backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }

  const consultar = async (key: ColorKey) => {
    setColorKey(key)
    setFase('resultado')
    setCargando(true)
    setFromCache(false)
    const color = COLORES[key]
    // Cacheable permanente por color (el simbolismo no cambia)
    const cacheKey = `color-oracle-${key}`

    try {
      const { data: cached } = await supabase.from('ai_cache').select('respuesta').eq('cache_key', cacheKey).maybeSingle()
      if (cached?.respuesta) {
        setInterpretacion(`${nombre}, ${cached.respuesta}`)
        setFromCache(true)
        setCargando(false)
        return
      }
    } catch (err) { console.warn('[ColorOracle] Error caché:', err) }

    const tradicionesTexto = color.tradiciones.map(t => `${t.nombre}: ${t.texto}`).join('\n')
    const result = await llamarGemini({
      herramienta: 'color-oracle',
      prompt: `Experto en cromoterapia simbólica y significado de colores en tradiciones culturales.

Color: ${color.nombre} · Keywords: ${color.keywords}
Tradiciones:
${tradicionesTexto}

3 párrafos: simbolismo del color en diferentes culturas, qué podría estar comunicando este color ahora, mensaje específico y concreto. Poético.`,
      userId, usarLite: false, cacheable: false, maxTokens: 350,
    })

    if (!result.error && result.texto) {
      setInterpretacion(`${nombre}, ${result.texto}`)
      supabase.from('ai_cache').insert({ cache_key: cacheKey, herramienta: 'color-oracle', prompt_hash: cacheKey, respuesta: result.texto, tokens_used: result.tokensUsados, expires_at: null }).then(() => {})
    } else setInterpretacion('El color guarda silencio. Inténtalo de nuevo.')
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />
      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">
        <div className="flex items-center">
          <button onClick={() => { if (fase === 'resultado') setFase('elegir'); else window.location.href = '/tradiciones' }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Color Oracle</p>
            <p className="text-purple-300 text-xs">Cromoterapia simbólica · Tradiciones</p>
          </div>
        </div>
        {fase === 'elegir' && (
          <div className="flex flex-col gap-5">
            <div className="bg-white/5 border rounded-3xl p-4 backdrop-blur" style={{ borderColor: COLORES[colorDelDia].hex + '40' }}>
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Color del día</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: COLORES[colorDelDia].hex }} />
                <div className="flex-1">
                  <p className="text-white font-semibold">{COLORES[colorDelDia].nombre}</p>
                  <p className="text-white/50 text-xs">{COLORES[colorDelDia].keywords}</p>
                </div>
                <button onClick={() => consultar(colorDelDia)} className="text-purple-300 text-xs border border-purple-500/30 rounded-full px-3 py-1">Explorar</button>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu situación (opcional)</p>
              <textarea value={situacion} onChange={e => setSituacion(e.target.value)} placeholder="¿Qué color te atrae hoy?" rows={2} className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(COLORES) as ColorKey[]).map(key => (
                <button key={key} onClick={() => consultar(key)} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-white/10 transition backdrop-blur">
                  <div className="w-10 h-10 rounded-full" style={{ backgroundColor: COLORES[key].hex, boxShadow: `0 0 12px ${COLORES[key].hex}60` }} />
                  <p className="text-white text-xs capitalize">{COLORES[key].nombre}</p>
                </button>
              ))}
            </div>
            <button onClick={() => consultar(getColorAleatorio())} className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full hover:bg-white/20 transition">El universo elige por mí</button>
          </div>
        )}
        {fase === 'resultado' && colorKey && (
          <div className="flex flex-col gap-5">
            <div className="bg-white/5 border rounded-3xl p-6 backdrop-blur flex flex-col items-center gap-4" style={{ borderColor: COLORES[colorKey].hex + '40' }}>
              <div className="w-24 h-24 rounded-full" style={{ backgroundColor: COLORES[colorKey].hex, boxShadow: `0 0 40px ${COLORES[colorKey].hex}60` }} />
              <p className="text-2xl font-bold">{COLORES[colorKey].nombre}</p>
              <p className="text-sm text-center" style={{ color: COLORES[colorKey].hex }}>{COLORES[colorKey].keywords}</p>
              <p className="text-white/60 text-xs text-center leading-relaxed">{COLORES[colorKey].descripcion}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">En diferentes tradiciones</p>
              {COLORES[colorKey].tradiciones.map((t, i) => (
                <div key={i} className="mb-3 last:mb-0">
                  <p className="text-white/60 text-xs font-semibold mb-1">{t.nombre}</p>
                  <p className="text-white/70 text-xs leading-relaxed">{t.texto}</p>
                </div>
              ))}
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <div className="flex items-center justify-between mb-3">
                <p className="text-purple-300 text-xs tracking-widest uppercase">Tu interpretación</p>
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
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <p className="text-white/60 text-sm italic text-center">"{COLORES[colorKey].mensaje}"</p>
            </div>
            {!cargando && interpretacion && <Compartir titulo={`Color Oracle: ${COLORES[colorKey].nombre}`} texto={interpretacion} hashtags={['ColorOracle', 'Universe', COLORES[colorKey].nombre, 'Cromoterapia']} />}
            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">Explorar con mi Guía IA</button>
              <button onClick={() => { setFase('elegir'); setInterpretacion(''); setFromCache(false) }} className="w-full text-purple-300/60 text-sm py-2">Explorar otro color</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
