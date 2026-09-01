import { useState } from 'react'
import { RITUALES, getRitualRecomendado } from '../lib/motores/rituales'
import { getFaseLunar } from '../lib/motores/luna'

export default function Rituales() {
  const [ritualActual, setRitualActual] = useState<typeof RITUALES[0] | null>(null)
  const [paso, setPaso] = useState(0)
  const [fase, setFase] = useState<'lista' | 'activo'>('lista')
  const faseLunar = getFaseLunar()
  const ritualRecomendado = getRitualRecomendado(faseLunar.nombre)

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const iniciar = (ritual: typeof RITUALES[0]) => {
    setRitualActual(ritual)
    setPaso(0)
    setFase('activo')
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => {
            if (fase === 'activo') setFase('lista')
            else window.location.href = '/universo'
          }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Rituales</p>
            <p className="text-purple-300 text-xs">Guías paso a paso</p>
          </div>
        </div>

        {fase === 'lista' && (
          <div className="flex flex-col gap-5">

            {/* Recomendado por fase lunar */}
            <div className="bg-purple-600/20 border border-purple-400/30 rounded-3xl p-5 backdrop-blur">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{faseLunar.simbolo}</span>
                <div>
                  <p className="text-purple-300 text-xs tracking-widest uppercase">Recomendado · {faseLunar.nombre}</p>
                </div>
              </div>
              <p className="text-white font-bold mb-1">{ritualRecomendado.nombre}</p>
              <p className="text-white/60 text-xs mb-3">{ritualRecomendado.intencion}</p>
              <button
                onClick={() => iniciar(ritualRecomendado)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-full text-sm"
              >
                Comenzar este ritual
              </button>
            </div>

            <p className="text-white/60 text-xs tracking-widest uppercase">Todos los rituales</p>

            {RITUALES.map(ritual => (
              <button
                key={ritual.id}
                onClick={() => iniciar(ritual)}
                className="bg-white/8 border border-white/20 rounded-2xl p-4 text-left hover:bg-white/15 transition backdrop-blur"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
              >
                <p className="text-white font-semibold mb-1">{ritual.nombre}</p>
                <p className="text-purple-300 text-xs mb-1">{ritual.cuando}</p>
                <p className="text-white/50 text-xs">{ritual.intencion}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-white/30 text-xs">{ritual.duracion}</span>
                  <span className="text-white/30 text-xs">·</span>
                  <span className="text-white/30 text-xs">{ritual.materiales.length} materiales</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {fase === 'activo' && ritualActual && (
          <div className="flex flex-col gap-5">

            <div className="text-center">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-1">{ritualActual.nombre}</p>
              <p className="text-white/50 text-xs">{ritualActual.cuando}</p>
            </div>

            {/* Progreso */}
            <div className="flex gap-1">
              {ritualActual.pasos.map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < paso ? 'bg-purple-400' : i === paso ? 'bg-purple-600' : 'bg-white/20'}`} />
              ))}
            </div>

            {paso === 0 && (
              <div className="bg-white/8 border border-white/20 rounded-3xl p-5 backdrop-blur"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Necesitarás</p>
                {ritualActual.materiales.map((m, i) => (
                  <p key={i} className="text-white/70 text-sm mb-1">• {m}</p>
                ))}
                <p className="text-white/30 text-xs mt-3 italic">{ritualActual.tradicion}</p>
              </div>
            )}

            <div className="bg-purple-600/20 border border-purple-400/30 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Paso {paso + 1} de {ritualActual.pasos.length}</p>
              <p className="text-white text-base leading-relaxed">
                {ritualActual.pasos[paso]}
              </p>
            </div>

            <div className="flex gap-3">
              {paso > 0 && (
                <button
                  onClick={() => setPaso(p => p - 1)}
                  className="flex-1 bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full"
                >
                  ← Anterior
                </button>
              )}
              {paso < ritualActual.pasos.length - 1 ? (
                <button
                  onClick={() => setPaso(p => p + 1)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full"
                >
                  Siguiente →
                </button>
              ) : (
                <button
                  onClick={() => { setFase('lista'); setPaso(0) }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full"
                >
                  ✓ Ritual completado
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  )
}