import { useState, useEffect } from 'react'
import { TIPOS_ENTRADA, guardarEntrada, cargarEntradas, eliminarEntrada, getEstadisticasDiario, EntradaDiario } from '../lib/motores/diario'
import { getFaseLunar } from '../lib/motores/luna'
import { getCartaDiaria } from '../lib/motores/tarotDiario'

export default function Diario() {
  const [entradas, setEntradas] = useState<EntradaDiario[]>([])
  const [fase, setFase] = useState<'lista' | 'nueva' | 'ver'>('lista')
  const [tipoActivo, setTipoActivo] = useState('libre')
  const [contenido, setContenido] = useState('')
  const [humor, setHumor] = useState(5)
  const [entradaVista, setEntradaVista] = useState<EntradaDiario | null>(null)
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)

  const nombre = localStorage.getItem('nombre') || 'viajero'
  const faseLunar = getFaseLunar()
  const cartaDiaria = getCartaDiaria()
  const stats = getEstadisticasDiario()
  const hoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  useEffect(() => {
    setEntradas(cargarEntradas())
  }, [fase])

  const guardar = async () => {
    if (!contenido.trim()) return

    const entrada: EntradaDiario = {
      id: Date.now().toString(),
      fecha: new Date().toISOString(),
      tipo: tipoActivo as any,
      contenido,
      faseLunar: faseLunar.nombre,
      carta: cartaDiaria.nombre,
      humor,
    }

    guardarEntrada(entrada)
    setEntradas(cargarEntradas())

    if (tipoActivo === 'sueno') {
      setCargando(true)
      try {
        const prompt = `Eres un intérprete de sueños experto en psicología jungiana y simbolismo universal.

Nombre: ${nombre}
Sueño registrado: "${contenido}"

Escribe una interpretación breve (2 párrafos) del sueño de ${nombre}. Identifica los símbolos principales y su significado. Termina con una pregunta de reflexión.`

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
        setInterpretacion('')
      }
      setCargando(false)
    }

    setContenido('')
    setFase('lista')
  }

  const eliminar = (id: string) => {
    eliminarEntrada(id)
    setEntradas(cargarEntradas())
  }

  const HUMOR_EMOJIS = ['😞', '😔', '😐', '🙂', '😊', '😄', '🌟', '✨', '🔥', '💫', '🌈']

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => {
            if (fase !== 'lista') setFase('lista')
            else window.location.href = '/universo'
          }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Diario Espiritual</p>
            <p className="text-purple-300 text-xs capitalize">{hoy}</p>
          </div>
          {fase === 'lista' && (
            <button
              onClick={() => setFase('nueva')}
              className="text-purple-300 text-sm border border-purple-500/30 rounded-full px-3 py-1"
            >
              + Nueva
            </button>
          )}
        </div>

        {fase === 'lista' && (
          <div className="flex flex-col gap-5">

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/8 border border-white/20 rounded-2xl p-3 text-center backdrop-blur"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <p className="text-2xl font-bold text-purple-300">{stats.total}</p>
                <p className="text-white/40 text-xs">Entradas</p>
              </div>
              <div className="bg-white/8 border border-white/20 rounded-2xl p-3 text-center backdrop-blur"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <p className="text-2xl font-bold text-purple-300">{stats.rachaActual}</p>
                <p className="text-white/40 text-xs">Días seguidos</p>
              </div>
              <div className="bg-white/8 border border-white/20 rounded-2xl p-3 text-center backdrop-blur"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <p className="text-2xl">{faseLunar.simbolo}</p>
                <p className="text-white/40 text-xs">{faseLunar.nombre}</p>
              </div>
            </div>

            {/* Contexto del día */}
            <div className="bg-purple-600/20 border border-purple-400/30 rounded-2xl p-4 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Contexto de hoy</p>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">🃏 {cartaDiaria.nombre}</span>
                <span className="text-white/70">{faseLunar.simbolo} {faseLunar.nombre}</span>
              </div>
            </div>

            {/* Prompt del día */}
            <button
              onClick={() => { setTipoActivo('libre'); setFase('nueva') }}
              className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur text-left hover:bg-white/15 transition"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
            >
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-1">Escribe hoy</p>
              <p className="text-white/70 text-sm">¿Qué necesitas procesar, celebrar o soltar hoy?</p>
            </button>

            {/* Lista de entradas */}
            {entradas.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-5xl mb-3">📖</p>
                <p className="text-white/40 text-sm">Tu diario está vacío.</p>
                <p className="text-white/30 text-xs mt-1">Empieza escribiendo algo hoy.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-white/60 text-xs tracking-widest uppercase">Tus entradas</p>
                {entradas.map(entrada => {
                  const tipo = TIPOS_ENTRADA.find(t => t.id === entrada.tipo)
                  const fecha = new Date(entrada.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
                  return (
                    <div
                      key={entrada.id}
                      className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur"
                      style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1" onClick={() => { setEntradaVista(entrada); setFase('ver') }}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm">{tipo?.icono}</span>
                            <p className="text-white/60 text-xs">{fecha}</p>
                            {entrada.faseLunar && <p className="text-purple-300/50 text-xs">{entrada.faseLunar}</p>}
                          </div>
                          <p className="text-white/80 text-sm leading-relaxed line-clamp-2">
                            {entrada.contenido}
                          </p>
                        </div>
                        <button
                          onClick={() => eliminar(entrada.id)}
                          className="text-white/20 text-xs hover:text-red-400 transition flex-shrink-0"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

          </div>
        )}

        {fase === 'nueva' && (
          <div className="flex flex-col gap-5">

            {/* Tipo de entrada */}
            <div className="grid grid-cols-3 gap-2">
              {TIPOS_ENTRADA.map(tipo => (
                <button
                  key={tipo.id}
                  onClick={() => setTipoActivo(tipo.id)}
                  className={`rounded-2xl p-3 flex flex-col items-center gap-1 transition border text-center ${tipoActivo === tipo.id ? 'bg-purple-600/40 border-purple-400' : 'border-white/20'}`}
                  style={{ backgroundColor: tipoActivo === tipo.id ? undefined : 'rgba(255,255,255,0.08)' }}
                >
                  <span className="text-xl">{tipo.icono}</span>
                  <span className="text-xs text-white leading-tight">{tipo.nombre}</span>
                </button>
              ))}
            </div>

            {/* Contexto automático */}
            <div className="flex gap-2 text-xs text-white/40">
              <span>🃏 {cartaDiaria.nombre}</span>
              <span>·</span>
              <span>{faseLunar.simbolo} {faseLunar.nombre}</span>
            </div>

            {/* Área de escritura */}
            <div className="bg-white/8 border border-white/20 rounded-3xl p-5 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">
                {TIPOS_ENTRADA.find(t => t.id === tipoActivo)?.descripcion}
              </p>
              <textarea
                value={contenido}
                onChange={e => setContenido(e.target.value)}
                placeholder="Escribe aquí..."
                rows={8}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30 leading-relaxed"
                autoFocus
              />
            </div>

            {/* Humor */}
            <div className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-white/60 text-xs tracking-widest uppercase mb-3">¿Cómo te sientes? {HUMOR_EMOJIS[humor]}</p>
              <input
                type="range"
                min="0"
                max="10"
                value={humor}
                onChange={e => setHumor(parseInt(e.target.value))}
                className="w-full accent-purple-500"
              />
              <div className="flex justify-between text-xs text-white/30 mt-1">
                <span>😞</span>
                <span>😐</span>
                <span>🌈</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setFase('lista')}
                className="flex-1 bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full"
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                disabled={!contenido.trim()}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full disabled:opacity-40"
              >
                Guardar
              </button>
            </div>

          </div>
        )}

        {fase === 'ver' && entradaVista && (
          <div className="flex flex-col gap-5">

            <div className="bg-white/8 border border-white/20 rounded-3xl p-6 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span>{TIPOS_ENTRADA.find(t => t.id === entradaVista.tipo)?.icono}</span>
                <p className="text-white/50 text-xs">
                  {new Date(entradaVista.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
              <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{entradaVista.contenido}</p>
              <div className="flex gap-3 mt-4 pt-4 border-t border-white/10 text-xs text-white/30">
                {entradaVista.faseLunar && <span>🌙 {entradaVista.faseLunar}</span>}
                {entradaVista.carta && <span>🃏 {entradaVista.carta}</span>}
                {entradaVista.humor !== undefined && <span>{HUMOR_EMOJIS[entradaVista.humor]}</span>}
              </div>
            </div>

            {entradaVista.tipo === 'sueno' && !interpretacion && (
              <button
                onClick={async () => {
                  setCargando(true)
                  try {
                    const prompt = `Eres un intérprete de sueños experto. Nombre: ${nombre}. Sueño: "${entradaVista.contenido}". Escribe una interpretación de 2 párrafos con psicología jungiana. Termina con una pregunta de reflexión.`
                    const res = await fetch(
                      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
                      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] }) }
                    )
                    const data = await res.json()
                    setInterpretacion(data.candidates?.[0]?.content?.parts?.[0]?.text || '')
                  } catch { setInterpretacion('') }
                  setCargando(false)
                }}
                className="w-full bg-purple-600/30 border border-purple-400/40 text-white font-semibold py-4 rounded-full"
              >
                Interpretar este sueño
              </button>
            )}

            {cargando && (
              <div className="flex gap-2 justify-center py-4">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}

            {interpretacion && (
              <div className="bg-white/8 border border-white/20 rounded-3xl p-5 backdrop-blur"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Interpretación</p>
                <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{interpretacion}</p>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  )
}