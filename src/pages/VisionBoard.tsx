import { useState, useEffect } from 'react'
import { CATEGORIAS_VISION, guardarIntencionVision, cargarIntenciones, EntradaVision } from '../lib/motores/visionBoard'
import { getFaseLunar } from '../lib/motores/luna'
import Compartir from '../components/Compartir'

export default function VisionBoard() {
  const [intenciones, setIntenciones] = useState<EntradaVision[]>([])
  const [categoriaActiva, setCategoriaActiva] = useState<typeof CATEGORIAS_VISION[0] | null>(null)
  const [texto, setTexto] = useState('')
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'board' | 'editar' | 'resultado'>('board')

  const nombre = localStorage.getItem('nombre') || 'viajero'
  const faseLunar = getFaseLunar()

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  useEffect(() => {
    setIntenciones(cargarIntenciones())
  }, [fase])

  const getIntencionCategoria = (id: string) =>
    intenciones.find(i => i.categoriaId === id)

  const guardar = async () => {
    if (!texto.trim() || !categoriaActiva) return

    guardarIntencionVision({
      categoriaId: categoriaActiva.id,
      intencion: texto,
      fecha: new Date().toISOString(),
    })

    setFase('resultado')
    setCargando(true)

    const prompt = `Eres un coach de vida y manifestación experto en psicología positiva y espiritualidad.

Nombre: ${nombre}
Fase lunar: ${faseLunar.nombre}
Área del Vision Board: ${categoriaActiva.nombre}
Intención de ${nombre}: "${texto}"

Escribe una reflexión de manifestación de 2-3 párrafos para ${nombre}.
Primero refleja y amplifica su intención — muéstrale la versión más poderosa de lo que ha escrito.
Luego conecta con la energía de la fase lunar actual y cómo apoya esta intención.
Termina con una afirmación poderosa personalizada y una acción concreta para esta semana.
Sé inspirador, específico y práctico.`

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
          }),
        }
      )
      const data = await res.json()
      setInterpretacion(data.candidates?.[0]?.content?.parts?.[0]?.text || '')
    } catch {
      setInterpretacion('El universo guarda silencio. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  const completadas = intenciones.length
  const total = CATEGORIAS_VISION.length

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => {
            if (fase !== 'board') { setFase('board'); setTexto(''); setInterpretacion('') }
            else window.location.href = '/universo'
          }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Vision Board</p>
            <p className="text-purple-300 text-xs">{completadas}/{total} intenciones</p>
          </div>
        </div>

        {fase === 'board' && (
          <div className="flex flex-col gap-5">

            {/* Progreso */}
            <div className="bg-white/8 border border-white/20 rounded-3xl p-5 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <div className="flex justify-between mb-2">
                <p className="text-purple-300 text-xs tracking-widest uppercase">Tu Vision Board</p>
                <p className="text-white/50 text-xs">{completadas} de {total}</p>
              </div>
              <div className="h-2 bg-white/10 rounded-full">
                <div
                  className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                  style={{ width: `${(completadas / total) * 100}%` }}
                />
              </div>
              <p className="text-white/40 text-xs mt-2">{faseLunar.simbolo} {faseLunar.nombre} · Momento {faseLunar.nombre.includes('Nueva') ? 'ideal para plantar intenciones' : 'para revisar y ajustar'}</p>
            </div>

            {/* Grid de categorías */}
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIAS_VISION.map(cat => {
                const intencion = getIntencionCategoria(cat.id)
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setCategoriaActiva(cat)
                      setTexto(intencion?.intencion || '')
                      setFase('editar')
                    }}
                    className="rounded-2xl p-4 text-left transition border"
                    style={{
                      backgroundColor: intencion ? cat.color + '20' : 'rgba(255,255,255,0.08)',
                      borderColor: intencion ? cat.color + '40' : 'rgba(255,255,255,0.2)',
                    }}
                  >
                    <p className="text-2xl mb-2">{cat.simbolo}</p>
                    <p className="text-white font-semibold text-sm">{cat.nombre}</p>
                    {intencion ? (
                      <p className="text-white/60 text-xs mt-1 line-clamp-2">{intencion.intencion}</p>
                    ) : (
                      <p className="text-white/30 text-xs mt-1">Toca para añadir tu intención</p>
                    )}
                  </button>
                )
              })}
            </div>

            {completadas > 0 && (
              <button
                onClick={() => {
                  const todasIntenciones = intenciones.map(i => {
                    const cat = CATEGORIAS_VISION.find(c => c.id === i.categoriaId)
                    return `${cat?.nombre}: ${i.intencion}`
                  }).join('\n')
                  navigator.clipboard?.writeText(todasIntenciones)
                }}
                className="w-full bg-white/10 border border-white/20 text-white font-semibold py-3 rounded-full text-sm"
              >
                Copiar todas mis intenciones
              </button>
            )}
          </div>
        )}

        {fase === 'editar' && categoriaActiva && (
          <div className="flex flex-col gap-5">

            <div
              className="rounded-3xl p-5 backdrop-blur"
              style={{ backgroundColor: categoriaActiva.color + '20', border: `1px solid ${categoriaActiva.color}40` }}
            >
              <p className="text-4xl mb-2">{categoriaActiva.simbolo}</p>
              <p className="text-white font-bold text-xl">{categoriaActiva.nombre}</p>
            </div>

            <div className="bg-white/8 border border-white/20 rounded-3xl p-5 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Preguntas para inspirarte</p>
              {categoriaActiva.preguntas.map((p, i) => (
                <p key={i} className="text-white/60 text-xs mb-1">• {p}</p>
              ))}
            </div>

            <div className="bg-white/8 border border-white/20 rounded-3xl p-5 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu intención</p>
              <textarea
                value={texto}
                onChange={e => setTexto(e.target.value)}
                placeholder="Describe tu visión con todo el detalle que puedas. Escribe en presente, como si ya fuera tu realidad..."
                rows={6}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30 leading-relaxed"
                autoFocus
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <p className="text-white/40 text-xs tracking-widest uppercase mb-2">Afirmaciones de apoyo</p>
              {categoriaActiva.afirmaciones.map((af, i) => (
                <p key={i} className="text-white/60 text-xs mb-1 italic">"{af}"</p>
              ))}
            </div>

            <button
              onClick={guardar}
              disabled={!texto.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full disabled:opacity-40"
            >
              Guardar y activar con IA
            </button>
          </div>
        )}

        {fase === 'resultado' && categoriaActiva && (
          <div className="flex flex-col gap-5">

            <div
              className="rounded-2xl p-4 backdrop-blur"
              style={{ backgroundColor: categoriaActiva.color + '20', border: `1px solid ${categoriaActiva.color}40` }}
            >
              <p className="text-white font-semibold">{categoriaActiva.simbolo} {categoriaActiva.nombre}</p>
              <p className="text-white/70 text-sm mt-1 italic">"{texto}"</p>
            </div>

            <div className="bg-white/8 border border-white/20 rounded-3xl p-6 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu intención activada</p>
              {cargando ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : (
                <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{interpretacion}</p>
              )}
            </div>

            {!cargando && interpretacion && (
              <Compartir
                titulo={`Mi intención: ${categoriaActiva.nombre}`}
                texto={interpretacion}
                hashtags={['VisionBoard', 'Universe', 'Manifestacion', categoriaActiva.id]}
              />
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => setFase('board')} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                Volver a mi Vision Board
              </button>
              <button onClick={() => window.location.href = '/guia'} className="w-full text-purple-300/60 text-sm py-2">
                Explorar con mi Guía IA
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}