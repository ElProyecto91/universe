// src/pages/Historial.tsx
// ============================================================
// UNIVERSE — Historial de lecturas
// Las últimas 20 lecturas del usuario guardadas en Supabase
// ============================================================

import { useState, useEffect } from 'react'
import { cargarHistorial, borrarLectura, ICONOS_HERRAMIENTA, LecturaHistorial } from '../hooks/useHistorial'

export default function Historial() {
  const [lecturas, setLecturas] = useState<LecturaHistorial[]>([])
  const [cargando, setCargando] = useState(true)
  const [lecturaAbierta, setLecturaAbierta] = useState<LecturaHistorial | null>(null)

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  useEffect(() => {
    cargarHistorial(30).then(data => {
      setLecturas(data)
      setCargando(false)
    })
  }, [])

  const eliminar = async (id: string) => {
    await borrarLectura(id)
    setLecturas(prev => prev.filter(l => l.id !== id))
    if (lecturaAbierta?.id === id) setLecturaAbierta(null)
  }

  const formatearFecha = (iso: string) => {
    const fecha = new Date(iso)
    const ahora = new Date()
    const diffMs = ahora.getTime() - fecha.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    const diffH = Math.floor(diffMin / 60)
    const diffD = Math.floor(diffH / 24)

    if (diffMin < 60) return `Hace ${diffMin} min`
    if (diffH < 24) return `Hace ${diffH}h`
    if (diffD === 1) return 'Ayer'
    if (diffD < 7) return `Hace ${diffD} días`
    return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/80" />

      {/* Header */}
      <div className="relative z-10 flex items-center px-4 py-4 border-b border-white/10">
        <button onClick={() => window.history.back()} className="text-purple-300 text-sm">← Volver</button>
        <div className="flex-1 text-center">
          <p className="text-white font-semibold text-sm">Mis Lecturas</p>
          <p className="text-purple-300 text-xs">{lecturas.length} guardadas</p>
        </div>
        <div className="w-16" />
      </div>

      {/* Detalle de lectura abierta */}
      {lecturaAbierta && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
          <div className="w-full max-w-sm bg-black/95 border-t border-white/10 rounded-t-3xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xl">{ICONOS_HERRAMIENTA[lecturaAbierta.herramienta] || '✨'}</span>
                <div>
                  <p className="text-white font-semibold text-sm">{lecturaAbierta.titulo}</p>
                  <p className="text-white/40 text-xs">{formatearFecha(lecturaAbierta.created_at!)}</p>
                </div>
              </div>
              <button onClick={() => setLecturaAbierta(null)} className="text-white/30 text-2xl leading-none">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <p className="text-white/85 text-sm leading-relaxed whitespace-pre-wrap">{lecturaAbierta.contenido}</p>
            </div>
            <div className="px-5 py-4 border-t border-white/10">
              <button
                onClick={() => eliminar(lecturaAbierta.id!)}
                className="w-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm py-3 rounded-full"
              >
                Eliminar esta lectura
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido */}
      <div className="relative z-10 flex-1 px-4 py-5 flex flex-col gap-3">

        {cargando && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 rounded-2xl bg-white/10 animate-pulse" />
            ))}
          </div>
        )}

        {!cargando && lecturas.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-5xl">📭</p>
            <p className="text-white/60 text-sm text-center">Aún no tienes lecturas guardadas. Haz una tirada de tarot, consulta el I Ching o genera tu carta natal.</p>
            <button
              onClick={() => window.location.href = '/tarot'}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-3 rounded-full text-sm"
            >
              Ir al Tarot
            </button>
          </div>
        )}

        {!cargando && lecturas.map(lectura => (
          <button
            key={lectura.id}
            onClick={() => setLecturaAbierta(lectura)}
            className="w-full bg-white/8 border border-white/20 rounded-2xl p-4 text-left hover:bg-white/12 transition backdrop-blur"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{ICONOS_HERRAMIENTA[lectura.herramienta] || '✨'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-white font-semibold text-sm truncate">{lectura.titulo}</p>
                  <p className="text-white/30 text-xs flex-shrink-0">{formatearFecha(lectura.created_at!)}</p>
                </div>
                <p className="text-white/50 text-xs leading-relaxed line-clamp-2">{lectura.contenido}</p>
              </div>
            </div>
          </button>
        ))}

      </div>
    </div>
  )
}
