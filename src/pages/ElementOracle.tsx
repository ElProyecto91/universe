import { useState } from 'react'
import { ELEMENTOS, getElementoDelDia } from '../lib/motores/elementos'
import Compartir from '../components/Compartir'
import { supabase } from '../lib/supabase'
import { llamarGemini } from '../lib/gemini'

type ElementoKey = keyof typeof ELEMENTOS

export default function ElementOracle() {
  const [elementoKey, setElementoKey] = useState<ElementoKey | null>(null)
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'elegir' | 'resultado'>('elegir')
  const [pregunta, setPregunta] = useState('')
  const [fromCache, setFromCache] = useState(false)
  const nombre = localStorage.getItem('nombre') || 'viajero'
  const elementoDelDia = getElementoDelDia()
  const userId = null

  const bgStyle = { backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }

  const consultar = async (key: ElementoKey) => {
    setElementoKey(key)
    setFase('resultado')
    setCargando(true)
    setFromCache(false)
    const elemento = ELEMENTOS[key]
    // Solo 5 elementos — cacheable permanente
    const cacheKey = `elemento-oracle-${key}`

    try {
      const { data: cached } = await supabase.from('ai_cache').select('respuesta').eq('cache_key', cacheKey).maybeSingle()
      if (cached?.respuesta) {
        setInterpretacion(`${nombre}, ${cached.respuesta}`)
        setFromCache(true)
        setCargando(false)
        return
      }
    } catch (err) { console.warn('[ElementOracle] Error caché:', err) }

    const tradicionesTexto = elemento.tradiciones.map(t => `${t.nombre}: ${t.texto}`).join('\n')
    const result = await llamarGemini({
      herramienta: 'element-oracle',
      prompt: `Guía experto en simbolismo elemental y su presencia en tradiciones espirituales del mundo.

Elemento: ${elemento.nombre} ${elemento.simbolo}
Keywords: ${elemento.keywords}
Luz: ${elemento.luz} · Sombra: ${elemento.sombra}
Tradiciones:
${tradicionesTexto}

3 párrafos: energía del elemento y qué significa cuando aparece, aspecto del elemento presente ahora (luz o sombra), práctica sugerida. Poético y concreto.`,
      userId, usarLite: false, cacheable: false, maxTokens: 350,
    })

    if (!result.error && result.texto) {
      setInterpretacion(`${nombre}, ${result.texto}`)
      supabase.from('ai_cache').insert({ cache_key: cacheKey, herramienta: 'element-oracle', prompt_hash: cacheKey, respuesta: result.texto, tokens_used: result.tokensUsados, expires_at: null }).then(() => {})
    } else setInterpretacion('El elemento guarda silencio. Inténtalo de nuevo.')
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />
      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">
        <div className="flex items-center">
          <button onClick={() => { if (fase === 'resultado') setFase('elegir'); else window.location.href = '/tradiciones' }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Oracle Elemental</p>
            <p className="text-purple-300 text-xs">Los cinco elementos · Tradiciones del mundo</p>
          </div>
        </div>
        {fase === 'elegir' && (
          <div className="flex flex-col gap-5">
            <div className="bg-white/5 border border-purple-500/20 rounded-3xl p-4 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-1">Elemento del día</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{ELEMENTOS[elementoDelDia].simbolo}</span>
                <div>
                  <p className="text-white font-semibold">{ELEMENTOS[elementoDelDia].nombre}</p>
                  <p className="text-white/50 text-xs">{ELEMENTOS[elementoDelDia].keywords}</p>
                </div>
                <button onClick={() => consultar(elementoDelDia)} className="ml-auto text-purple-300 text-xs border border-purple-500/30 rounded-full px-3 py-1">Explorar</button>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu situación (opcional)</p>
              <textarea value={pregunta} onChange={e => setPregunta(e.target.value)} placeholder="¿Qué quieres explorar desde la energía elemental?" rows={2} className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30" />
            </div>
            <div className="flex flex-col gap-3">
              {(Object.keys(ELEMENTOS) as ElementoKey[]).map(key => (
                <button key={key} onClick={() => consultar(key)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-left hover:bg-white/10 transition backdrop-blur flex items-center gap-4">
                  <span className="text-3xl">{ELEMENTOS[key].simbolo}</span>
                  <div>
                    <p className="text-white font-semibold">{ELEMENTOS[key].nombre}</p>
                    <p className="text-white/40 text-xs">{ELEMENTOS[key].keywords}</p>
                  </div>
                  <span className="ml-auto text-purple-300/50">›</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {fase === 'resultado' && elementoKey && (
          <div className="flex flex-col gap-5">
            <div className="bg-white/5 border rounded-3xl p-6 backdrop-blur flex flex-col items-center gap-3" style={{ borderColor: ELEMENTOS[elementoKey].color + '40' }}>
              <span className="text-6xl">{ELEMENTOS[elementoKey].simbolo}</span>
              <p className="text-2xl font-bold">{ELEMENTOS[elementoKey].nombre}</p>
              <p className="text-sm text-center" style={{ color: ELEMENTOS[elementoKey].color }}>{ELEMENTOS[elementoKey].keywords}</p>
              <p className="text-white/60 text-xs text-center leading-relaxed">{ELEMENTOS[elementoKey].descripcion}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
                <p className="text-green-400 text-xs tracking-widest uppercase mb-2">Luz</p>
                <p className="text-white/70 text-xs leading-relaxed">{ELEMENTOS[elementoKey].luz}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
                <p className="text-red-400 text-xs tracking-widest uppercase mb-2">Sombra</p>
                <p className="text-white/70 text-xs leading-relaxed">{ELEMENTOS[elementoKey].sombra}</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <div className="flex items-center justify-between mb-3">
                <p className="text-purple-300 text-xs tracking-widest uppercase">Tu lectura elemental</p>
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
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Práctica sugerida</p>
              <p className="text-white/70 text-sm leading-relaxed">{ELEMENTOS[elementoKey].practica}</p>
            </div>
            {!cargando && interpretacion && <Compartir titulo={`Oracle Elemental: ${ELEMENTOS[elementoKey].nombre} ${ELEMENTOS[elementoKey].simbolo}`} texto={interpretacion} hashtags={['ElementOracle', 'Universe', ELEMENTOS[elementoKey].nombre, 'Elementos']} />}
            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">Explorar con mi Guía IA</button>
              <button onClick={() => { setFase('elegir'); setInterpretacion(''); setFromCache(false) }} className="w-full text-purple-300/60 text-sm py-2">Explorar otro elemento</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
