import { useState } from 'react'
import { AFIRMACIONES_TEMATICAS, getAfirmacionDelDia, getAfirmacionTematica } from '../lib/motores/afirmaciones'
import { getSignoSolar } from '../lib/motores/horoscopo'
import Compartir from '../components/Compartir'
import { supabase } from '../lib/supabase'
import { llamarGemini } from '../lib/gemini'

const TEMAS = [
  { id: 'amor', label: 'Amor', icono: '❤️' },
  { id: 'abundancia', label: 'Abundancia', icono: '💰' },
  { id: 'salud', label: 'Salud', icono: '🌿' },
  { id: 'proposito', label: 'Propósito', icono: '✨' },
  { id: 'paz', label: 'Paz', icono: '☮️' },
] as const

export default function Afirmaciones() {
  const [vista, setVista] = useState<'diaria' | 'tematica' | 'practica'>('diaria')
  const [temaActivo, setTemaActivo] = useState<typeof TEMAS[number]['id']>('amor')
  const [afirmacionPersonalizada, setAfirmacionPersonalizada] = useState('')
  const [repeticiones, setRepeticiones] = useState(0)
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fromCache, setFromCache] = useState(false)

  const nombre = localStorage.getItem('nombre') || 'viajero'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const signo = getSignoSolar(fechaNacimiento)
  const afirmacionDiaria = getAfirmacionDelDia(signo)
  const afirmacionTema = getAfirmacionTematica(temaActivo)
  const hoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
  const fechaHoy = new Date().toISOString().split('T')[0]
  const userId = null // TODO: ID real del usuario

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const generarAfirmacion = async () => {
    setCargando(true)

    // ── 1. Buscar en caché ─────────────────────────────────
    try {
      const { data: cached } = await supabase
        .from('horoscopo_cache')
        .select('contenido')
        .eq('signo', signo.toLowerCase())
        .eq('fecha', fechaHoy)
        .eq('tipo', 'afirmaciones')
        .maybeSingle()

      if (cached?.contenido) {
        setInterpretacion(cached.contenido)
        setFromCache(true)
        setCargando(false)
        return
      }
    } catch (err) {
      console.warn('[Afirmaciones] Error leyendo caché:', err)
    }

    // ── 2. Fallback: Gemini Lite (respuesta corta, 3 líneas) ─
    const result = await llamarGemini({
      herramienta: 'afirmaciones',
      prompt: `Experto en psicología positiva. Crea 3 afirmaciones poderosas para ${signo} hoy.
Afirmación base: "${afirmacionDiaria}"
Cada una en primera persona presente, una por línea, sin numeración. Máximo 3 líneas.`,
      userId,
      usarLite: true,
      cacheable: false, // el caché lo gestionamos manualmente arriba
      maxTokens: 150,
    })

    if (!result.error && result.texto) {
      setInterpretacion(result.texto)
      setFromCache(false)

      supabase.from('horoscopo_cache').insert({
        signo: signo.toLowerCase(),
        fecha: fechaHoy,
        tipo: 'afirmaciones',
        contenido: result.texto,
        tokens_used: result.tokensUsados,
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
          <button onClick={() => window.location.href = '/universo'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Afirmaciones</p>
            <p className="text-purple-300 text-xs capitalize">{hoy}</p>
          </div>
        </div>
        <div className="flex gap-1 bg-white/10 rounded-2xl p-1">
          {[{ id: 'diaria', label: 'Diaria' },{ id: 'tematica', label: 'Temática' },{ id: 'practica', label: 'Práctica' }].map(tab => (
            <button key={tab.id} onClick={() => setVista(tab.id as any)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${vista === tab.id ? 'bg-purple-600 text-white' : 'text-white/50'}`}>
              {tab.label}
            </button>
          ))}
        </div>
        {vista === 'diaria' && (
          <div className="flex flex-col gap-5">
            <div className="bg-purple-600/25 border border-purple-400/40 rounded-3xl p-8 backdrop-blur text-center">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-4">Tu afirmación de hoy · {signo}</p>
              <p className="text-white text-xl leading-relaxed font-medium">"{afirmacionDiaria}"</p>
            </div>
            <div className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-white/60 text-xs leading-relaxed text-center">Di esta afirmación en voz alta 3 veces. Coloca la mano en tu corazón. Cierra los ojos. Siente que ya es verdad.</p>
            </div>
            <button onClick={() => setVista('practica')} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">
              Practicar esta afirmación
            </button>
            {!interpretacion ? (
              <button onClick={generarAfirmacion} disabled={cargando}
                className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full hover:bg-white/20 transition disabled:opacity-40">
                {cargando ? 'Generando...' : 'Generar 3 afirmaciones personalizadas con IA'}
              </button>
            ) : (
              <div className="bg-white/8 border border-white/20 rounded-3xl p-6 backdrop-blur" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-purple-300 text-xs tracking-widest uppercase">Tus afirmaciones personalizadas</p>
                  {fromCache && <span className="text-green-400 text-xs">⚡ Instantáneo</span>}
                </div>
                {interpretacion.split('\n').filter(l => l.trim()).map((linea, i) => (
                  <div key={i} className="bg-purple-600/15 border border-purple-400/20 rounded-2xl p-4 mb-3">
                    <p className="text-white text-sm leading-relaxed italic">"{linea.trim()}"</p>
                  </div>
                ))}
              </div>
            )}
            {interpretacion && (
              <Compartir titulo={`Mi afirmación de hoy: ${signo}`} texto={`"${afirmacionDiaria}"\n\n${interpretacion}`} hashtags={['Afirmaciones', 'Universe', signo, 'Manifestacion']} />
            )}
          </div>
        )}
        {vista === 'tematica' && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-3 gap-2">
              {TEMAS.map(tema => (
                <button key={tema.id} onClick={() => setTemaActivo(tema.id)}
                  className={`rounded-2xl p-3 flex flex-col items-center gap-1 transition border ${temaActivo === tema.id ? 'bg-purple-600/40 border-purple-400' : 'border-white/20'}`}
                  style={{ backgroundColor: temaActivo === tema.id ? undefined : 'rgba(255,255,255,0.08)' }}>
                  <span className="text-xl">{tema.icono}</span>
                  <span className="text-xs text-white">{tema.label}</span>
                </button>
              ))}
            </div>
            <div className="bg-purple-600/25 border border-purple-400/40 rounded-3xl p-8 backdrop-blur text-center">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-4">{TEMAS.find(t => t.id === temaActivo)?.icono} {TEMAS.find(t => t.id === temaActivo)?.label}</p>
              <p className="text-white text-xl leading-relaxed font-medium">"{afirmacionTema}"</p>
            </div>
            <p className="text-white/60 text-xs tracking-widest uppercase">Todas las afirmaciones</p>
            {AFIRMACIONES_TEMATICAS[temaActivo].map((af, i) => (
              <div key={i} className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <p className="text-white/80 text-sm italic">"{af}"</p>
              </div>
            ))}
          </div>
        )}
        {vista === 'practica' && (
          <div className="flex flex-col gap-6 items-center">
            <div className="text-center">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-4">Modo práctica</p>
              <p className="text-white/60 text-sm">Lee la afirmación en voz alta. Toca el botón cada vez que la repitas.</p>
            </div>
            <div className="bg-purple-600/25 border border-purple-400/40 rounded-3xl p-8 backdrop-blur text-center w-full">
              <p className="text-white text-lg leading-relaxed font-medium">"{afirmacionPersonalizada || afirmacionDiaria}"</p>
            </div>
            <div className="text-center">
              <p className="text-8xl font-bold text-purple-300">{repeticiones}</p>
              <p className="text-white/40 text-sm">repeticiones</p>
              {repeticiones >= 3 && <p className="text-green-400 text-sm mt-2">✓ Práctica completada</p>}
              {repeticiones >= 7 && <p className="text-purple-300 text-sm">✦ Nivel profundo</p>}
            </div>
            <button onClick={() => setRepeticiones(r => r + 1)}
              className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-full hover:opacity-90 transition active:scale-95"
              style={{ boxShadow: '0 0 30px rgba(139,92,246,0.4)' }}>✓</button>
            <div className="flex gap-3 w-full">
              <button onClick={() => setRepeticiones(0)} className="flex-1 bg-white/10 border border-white/20 text-white/60 text-sm py-3 rounded-full">Reiniciar</button>
              <button onClick={() => { setVista('diaria'); setRepeticiones(0) }} className="flex-1 bg-white/10 border border-white/20 text-white/60 text-sm py-3 rounded-full">Volver</button>
            </div>
            <div className="w-full bg-white/8 border border-white/20 rounded-3xl p-5 backdrop-blur" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Escribe tu propia</p>
              <textarea value={afirmacionPersonalizada} onChange={e => setAfirmacionPersonalizada(e.target.value)}
                placeholder="Escribe una afirmación personal..." rows={2}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
