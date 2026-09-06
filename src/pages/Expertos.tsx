// src/pages/Expertos.tsx
// ============================================================
// UNIVERSE — Directorio de expertos espirituales
// ============================================================

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Experto {
  id: string
  slug: string
  nombre_artistico: string
  bio: string
  especialidades: string[]
  metodos: string[]
  precio_minuto: number
  minutos_gratis: number
  disponible: boolean
  verificado: boolean
  valoracion_media: number
  total_valoraciones: number
  total_sesiones: number
  foto_url: string | null
}

const ESPECIALIDADES_FILTRO = [
  'Todas', 'Tarot', 'Astrología', 'Runas', 'Numerología',
  'Relaciones', 'Carta natal', 'Oráculos', 'Desarrollo personal'
]

const AVATAR_COLORES = [
  'from-purple-600 to-pink-600',
  'from-blue-600 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-green-600 to-teal-600',
  'from-pink-600 to-rose-600',
]

function AvatarExperto({ experto, size = 'md' }: { experto: Experto; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-12 h-12 text-lg', md: 'w-16 h-16 text-2xl', lg: 'w-24 h-24 text-3xl' }
  const colorIndex = experto.slug.length % AVATAR_COLORES.length
  const inicial = experto.nombre_artistico.charAt(0).toUpperCase()

  if (experto.foto_url) {
    return (
      <img
        src={experto.foto_url}
        alt={experto.nombre_artistico}
        className={`${sizes[size]} rounded-full object-cover flex-shrink-0`}
      />
    )
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${AVATAR_COLORES[colorIndex]} flex items-center justify-center font-bold text-white flex-shrink-0`}>
      {inicial}
    </div>
  )
}

function Estrellas({ valoracion, size = 'sm' }: { valoracion: number; size?: 'sm' | 'md' }) {
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm'
  return (
    <div className={`flex items-center gap-0.5 ${textSize}`}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= Math.round(valoracion) ? 'text-amber-400' : 'text-white/20'}>★</span>
      ))}
    </div>
  )
}

export default function Expertos() {
  const [expertos, setExpertos] = useState<Experto[]>([])
  const [cargando, setCargando] = useState(true)
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('Todas')
  const [soloDiponibles, setSoloDisponibles] = useState(false)
  const [ordenPor, setOrdenPor] = useState<'valoracion' | 'precio' | 'sesiones'>('valoracion')

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  useEffect(() => {
    cargarExpertos()
  }, [])

  async function cargarExpertos() {
    try {
      const { data } = await supabase
        .from('expertos')
        .select('*')
        .eq('activo', true)
        .order('valoracion_media', { ascending: false })
      setExpertos(data ?? [])
    } catch (err) {
      console.error('[Expertos]', err)
    }
    setCargando(false)
  }

  const expertosFiltrados = expertos
    .filter(e => filtroEspecialidad === 'Todas' || e.especialidades?.includes(filtroEspecialidad))
    .filter(e => !soloDiponibles || e.disponible)
    .sort((a, b) => {
      if (ordenPor === 'valoracion') return b.valoracion_media - a.valoracion_media
      if (ordenPor === 'precio') return a.precio_minuto - b.precio_minuto
      return b.total_sesiones - a.total_sesiones
    })

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/88" />

      {/* Header */}
      <div className="relative z-10 px-4 pt-10 pb-4">
        <div className="flex items-center mb-6">
          <button onClick={() => window.location.href = '/universo'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-bold text-base">Consulta con un Experto</p>
            <p className="text-purple-300 text-xs">Lecturas en tiempo real · Chat y llamada</p>
          </div>
        </div>

        {/* Banner propuesta de valor */}
        <div className="bg-gradient-to-r from-purple-900/60 to-pink-900/60 border border-purple-400/30 rounded-2xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">🎁</span>
            <div>
              <p className="text-white font-semibold text-sm">3 minutos gratis con cada experto nuevo</p>
              <p className="text-white/60 text-xs mt-0.5 leading-relaxed">
                Prueba la conexión antes de comprometerte. Sin tarjeta de crédito para los primeros minutos.
              </p>
            </div>
          </div>
        </div>

        {/* Filtro disponibles */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setSoloDisponibles(!soloDiponibles)}
            className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border transition ${soloDiponibles ? 'bg-green-500/20 border-green-400/50 text-green-300' : 'bg-white/10 border-white/20 text-white/60'}`}
          >
            <div className={`w-2 h-2 rounded-full ${soloDiponibles ? 'bg-green-400' : 'bg-white/30'}`} />
            Solo disponibles
          </button>
          <select
            value={ordenPor}
            onChange={e => setOrdenPor(e.target.value as any)}
            className="bg-white/10 border border-white/20 text-white text-xs rounded-xl px-3 py-1.5 outline-none"
          >
            <option value="valoracion" className="bg-black">⭐ Mejor valorados</option>
            <option value="precio" className="bg-black">💰 Más económicos</option>
            <option value="sesiones" className="bg-black">🔥 Más populares</option>
          </select>
        </div>

        {/* Filtros especialidad */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {ESPECIALIDADES_FILTRO.map(esp => (
            <button
              key={esp}
              onClick={() => setFiltroEspecialidad(esp)}
              className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition flex-shrink-0 ${
                filtroEspecialidad === esp
                  ? 'bg-purple-600 border-purple-400 text-white'
                  : 'bg-white/8 border-white/20 text-white/60'
              }`}
              style={{ backgroundColor: filtroEspecialidad === esp ? undefined : 'rgba(255,255,255,0.08)' }}
            >
              {esp}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de expertos */}
      <div className="relative z-10 flex-1 px-4 pb-8 flex flex-col gap-3">

        {cargando && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-36 rounded-3xl bg-white/10 animate-pulse" />
            ))}
          </div>
        )}

        {!cargando && expertosFiltrados.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔮</p>
            <p className="text-white/60 text-sm">No hay expertos disponibles con estos filtros.</p>
          </div>
        )}

        {!cargando && expertosFiltrados.map(experto => (
          <button
            key={experto.id}
            onClick={() => window.location.href = `/expertos/${experto.slug}`}
            className="w-full bg-black/55 border border-white/15 rounded-3xl p-4 text-left hover:border-purple-400/40 hover:bg-black/70 transition"
          >
            <div className="flex gap-4">
              {/* Avatar con indicador online */}
              <div className="relative flex-shrink-0">
                <AvatarExperto experto={experto} size="md" />
                <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-black ${experto.disponible ? 'bg-green-400' : 'bg-white/30'}`} />
              </div>

              {/* Info principal */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-bold text-base leading-tight">{experto.nombre_artistico}</p>
                      {experto.verificado && <span className="text-blue-400 text-xs">✓</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Estrellas valoracion={experto.valoracion_media} />
                      <span className="text-white/50 text-xs">{experto.valoracion_media.toFixed(1)} ({experto.total_valoraciones})</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white font-bold text-sm">€{experto.precio_minuto.toFixed(2)}</p>
                    <p className="text-white/40 text-xs">por min</p>
                  </div>
                </div>

                <p className="text-white/60 text-xs leading-relaxed mt-2 line-clamp-2">{experto.bio}</p>

                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {experto.especialidades?.slice(0, 3).map(esp => (
                    <span key={esp} className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                      {esp}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-3 text-xs text-white/40">
                <span>💬 {experto.total_sesiones} sesiones</span>
                <span>🎁 {experto.minutos_gratis} min gratis</span>
              </div>
              <div className={`text-xs font-semibold px-3 py-1 rounded-full ${experto.disponible ? 'bg-green-500/20 text-green-300' : 'bg-white/10 text-white/40'}`}>
                {experto.disponible ? '● Disponible ahora' : '○ No disponible'}
              </div>
            </div>
          </button>
        ))}

        {/* ¿Eres experto? */}
        <div className="bg-black/50 border border-white/10 rounded-2xl p-4 mt-2">
          <p className="text-white font-semibold text-sm mb-1">¿Eres tarotista o experto espiritual?</p>
          <p className="text-white/50 text-xs leading-relaxed mb-3">Únete ahora y disfruta del <strong className="text-white">primer mes sin comisión</strong> y posición prioritaria en el directorio. Sin cuota de alta.</p>
          <button
            onClick={() => window.location.href = '/expertos/unirse'}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-full text-sm"
          >
            Solicitar ser experto →
          </button>
        </div>

      </div>
    </div>
  )
}
