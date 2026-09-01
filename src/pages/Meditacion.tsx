import { useState, useEffect, useRef } from 'react'
import { MEDITACIONES, getMeditacionDelDia } from '../lib/motores/meditacion'

export default function Meditacion() {
  const [meditacionActual, setMeditacionActual] = useState<typeof MEDITACIONES[0] | null>(null)
  const [fase, setFase] = useState<'lista' | 'activa' | 'completada'>('lista')
  const [pasoActual, setPasoActual] = useState(0)
  const [segundos, setSegundos] = useState(0)
  const [activo, setActivo] = useState(false)
  const intervalRef = useRef<any>(null)
  const meditacionDelDia = getMeditacionDelDia()

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  useEffect(() => {
    if (activo && meditacionActual) {
      intervalRef.current = setInterval(() => {
        setSegundos(s => {
          const duracionPaso = meditacionActual.pasos[pasoActual]?.duracion || 30
          if (s >= duracionPaso - 1) {
            if (pasoActual < meditacionActual.pasos.length - 1) {
              setPasoActual(p => p + 1)
              return 0
            } else {
              setActivo(false)
              setFase('completada')
              return 0
            }
          }
          return s + 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [activo, pasoActual, meditacionActual])

  const iniciar = (med: typeof MEDITACIONES[0]) => {
    setMeditacionActual(med)
    setPasoActual(0)
    setSegundos(0)
    setActivo(true)
    setFase('activa')
  }

  const pausar = () => setActivo(!activo)

  const duracionTotal = meditacionActual?.pasos.reduce((sum, p) => sum + p.duracion, 0) || 0
  const progresoPasos = meditacionActual ? ((pasoActual) / meditacionActual.pasos.length) * 100 : 0

  const CATEGORIAS_COLOR: Record<string, string> = {
    'Calma': '#3b82f6',
    'Conexión': '#8b5cf6',
    'Espiritual': '#c084fc',
    'Energía': '#f59e0b',
    'Bienestar': '#22c55e',
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => {
            if (fase !== 'lista') { setActivo(false); setFase('lista') }
            else window.location.href = '/universo'
          }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Meditación</p>
            <p className="text-purple-300 text-xs">Guiada · IA · Espiritual</p>
          </div>
        </div>

        {fase === 'lista' && (
          <div className="flex flex-col gap-5">

            {/* Meditación del día */}
            <button
              onClick={() => iniciar(meditacionDelDia)}
              className="bg-purple-600/30 border border-purple-400/50 rounded-3xl p-5 backdrop-blur text-left hover:bg-purple-600/40 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-purple-300 text-xs tracking-widest uppercase">Meditación del día</p>
                <span className="text-purple-300 text-xs">{meditacionDelDia.duracion}</span>
              </div>
              <p className="text-white font-bold text-lg">{meditacionDelDia.nombre}</p>
              <p className="text-white/60 text-xs mt-1">{meditacionDelDia.descripcion}</p>
              <p className="text-purple-300 text-xs mt-2">▶ Comenzar</p>
            </button>

            {/* Lista completa */}
            <p className="text-white/60 text-xs tracking-widest uppercase">Todas las meditaciones</p>
            {MEDITACIONES.map(med => (
              <button
                key={med.id}
                onClick={() => iniciar(med)}
                className="bg-white/8 border border-white/20 rounded-2xl p-4 text-left hover:bg-white/15 transition backdrop-blur"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white font-semibold">{med.nombre}</p>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: (CATEGORIAS_COLOR[med.categoria] || '#8b5cf6') + '30', color: CATEGORIAS_COLOR[med.categoria] || '#c084fc' }}
                  >
                    {med.categoria}
                  </span>
                </div>
                <div className="flex gap-3 text-white/40 text-xs">
                  <span>{med.duracion}</span>
                  <span>·</span>
                  <span>{med.nivel}</span>
                  <span>·</span>
                  <span>{med.chakra}</span>
                </div>
                <p className="text-white/60 text-xs mt-2 leading-relaxed">{med.descripcion}</p>
              </button>
            ))}
          </div>
        )}

        {fase === 'activa' && meditacionActual && (
          <div className="flex flex-col gap-6 items-center">

            {/* Título */}
            <div className="text-center">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-1">{meditacionActual.nombre}</p>
              <p className="text-white/40 text-xs">{meditacionActual.duracion}</p>
            </div>

            {/* Progreso circular */}
            <div className="relative w-48 h-48">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3"/>
                <circle
                  cx="50" cy="50" r="45" fill="none"
                  stroke="#c084fc" strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progresoPasos / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-4xl font-light text-white">{meditacionActual.pasos[pasoActual]?.duracion - segundos}</p>
                <p className="text-white/40 text-xs">segundos</p>
                <p className="text-purple-300 text-xs mt-1">{pasoActual + 1}/{meditacionActual.pasos.length}</p>
              </div>
            </div>

            {/* Instrucción actual */}
            <div className="bg-white/8 border border-purple-500/20 rounded-3xl p-6 backdrop-blur text-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-white text-base leading-relaxed">
                {meditacionActual.pasos[pasoActual]?.texto}
              </p>
            </div>

            {/* Próximo paso */}
            {pasoActual < meditacionActual.pasos.length - 1 && (
              <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                <p className="text-white/30 text-xs">Próximo: {meditacionActual.pasos[pasoActual + 1]?.texto.substring(0, 50)}...</p>
              </div>
            )}

            {/* Controles */}
            <div className="flex gap-4">
              <button
                onClick={pausar}
                className="w-16 h-16 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-2xl"
              >
                {activo ? '⏸' : '▶'}
              </button>
              <button
                onClick={() => { setActivo(false); setFase('lista') }}
                className="w-16 h-16 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-2xl"
              >
                ⏹
              </button>
            </div>

          </div>
        )}

        {fase === 'completada' && meditacionActual && (
          <div className="flex flex-col gap-6 items-center text-center">

            <div className="text-8xl">✨</div>

            <div>
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Meditación completada</p>
              <p className="text-2xl font-bold">{meditacionActual.nombre}</p>
            </div>

            <div className="bg-purple-600/20 border border-purple-400/30 rounded-3xl p-6 backdrop-blur w-full">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Beneficios que acabas de activar</p>
              {meditacionActual.beneficios.map((b, i) => (
                <p key={i} className="text-white/80 text-sm mb-1">✓ {b}</p>
              ))}
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => iniciar(meditacionActual)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full"
              >
                Repetir esta meditación
              </button>
              <button
                onClick={() => setFase('lista')}
                className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full"
              >
                Ver otras meditaciones
              </button>
              <button
                onClick={() => window.location.href = '/guia'}
                className="w-full text-purple-300/60 text-sm py-2"
              >
                Explorar con mi Guía IA
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}