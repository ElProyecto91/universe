// src/pages/Expertos.tsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Experto {
  id: string
  slug: string
  pin: string
  nombre_artistico: string
  bio: string
  especialidades: string[]
  especialidad_tematica: string[]
  precio_minuto: number
  minutos_gratis: number
  disponible: boolean
  estado: string
  nivel: string
  verificado: boolean
  valoracion_media: number
  total_valoraciones: number
  total_sesiones: number
  foto_url: string | null
  acepta_email: boolean
  acepta_webinar: boolean
  ultima_sesion: string | null
}

const TEMATICAS = [
  '🔍 Todas',
  '❤️ Amor y relaciones',
  '💼 Trabajo y dinero',
  '🌟 Camino de vida',
  '🔮 Decisiones difíciles',
  '💫 Energía personal',
  '🌙 Camino espiritual',
  '👨‍👩‍👧 Familia',
  '🌿 Salud y bienestar',
]

const NIVELES_CONFIG: Record<string, { label: string; color: string; bg: string; orden: number }> = {
  diamant:    { label: '💎 Diamant',   color: 'text-cyan-300',   bg: 'bg-cyan-500/20 border-cyan-400/40',   orden: 1 },
  premium:    { label: '✨ Premium',   color: 'text-amber-300',  bg: 'bg-amber-500/20 border-amber-400/40', orden: 2 },
  top:        { label: '🔥 Top',       color: 'text-orange-300', bg: 'bg-orange-500/20 border-orange-400/40', orden: 3 },
  verificado: { label: '✓ Verificado', color: 'text-purple-300', bg: 'bg-purple-500/20 border-purple-400/40', orden: 4 },
  nuevo:      { label: '⭐ Nuevo',     color: 'text-white/60',   bg: 'bg-white/10 border-white/20',         orden: 5 },
}

const ESTADO_CONFIG: Record<string, { color: string; label: string }> = {
  online:  { color: 'bg-green-400',  label: 'Disponible' },
  ocupado: { color: 'bg-amber-400',  label: 'En sesión' },
  offline: { color: 'bg-white/30',   label: 'No disponible' },
}

const AVATAR_COLORES = [
  'from-purple-600 to-pink-600',
  'from-blue-600 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-green-600 to-teal-600',
  'from-pink-600 to-rose-600',
]

function NivelBadge({ nivel }: { nivel: string }) {
  const cfg = NIVELES_CONFIG[nivel] ?? NIVELES_CONFIG.nuevo
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
      {cfg.label}
    </span>
  )
}

function EstadoBadge({ estado }: { estado: string }) {
  const cfg = ESTADO_CONFIG[estado] ?? ESTADO_CONFIG.offline
  return (
    <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${estado === 'online' ? 'bg-green-500/20 text-green-300' : estado === 'ocupado' ? 'bg-amber-500/20 text-amber-300' : 'bg-white/10 text-white/40'}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${cfg.color}`} />
      {cfg.label}
    </div>
  )
}

export default function Expertos() {
  const [expertos, setExpertos] = useState<Experto[]>([])
  const [cargando, setCargando] = useState(true)
  const [tematica, setTematica] = useState('🔍 Todas')
  const [soloDisponibles, setSoloDisponibles] = useState(false)
  const [ordenPor, setOrdenPor] = useState<'valoracion' | 'precio' | 'sesiones' | 'nivel'>('nivel')
  const [busquedaPin, setBusquedaPin] = useState('')

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  useEffect(() => { cargarExpertos() }, [])

  async function cargarExpertos() {
    const { data } = await supabase
      .from('expertos')
      .select('*')
      .eq('activo', true)
      .order('valoracion_media', { ascending: false })
    setExpertos(data ?? [])
    setCargando(false)
  }

  const expertosFiltrados = expertos
    .filter(e => {
      if (busquedaPin) return e.pin === busquedaPin || e.nombre_artistico.toLowerCase().includes(busquedaPin.toLowerCase())
      if (tematica !== '🔍 Todas') return e.especialidad_tematica?.some(t => t === tematica.slice(3).trim())
      return true
    })
    .filter(e => !soloDisponibles || e.estado === 'online')
    .sort((a, b) => {
      if (ordenPor === 'nivel') return (NIVELES_CONFIG[a.nivel]?.orden ?? 9) - (NIVELES_CONFIG[b.nivel]?.orden ?? 9)
      if (ordenPor === 'valoracion') return b.valoracion_media - a.valoracion_media
      if (ordenPor === 'precio') return a.precio_minuto - b.precio_minuto
      return b.total_sesiones - a.total_sesiones
    })

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/88" />

      {/* Header */}
      <div className="relative z-10 px-4 pt-10 pb-2">
        <div className="flex items-center mb-4">
          <button onClick={() => window.location.href = '/universo'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-bold text-base">Consulta con un Experto</p>
            <p className="text-purple-300 text-xs">Lecturas en tiempo real · Chat · Email · Webinar</p>
          </div>
        </div>

        {/* Banner 3 min gratis */}
        <div className="bg-gradient-to-r from-purple-900/70 to-pink-900/70 border border-purple-400/30 rounded-2xl p-3 mb-3 flex items-center gap-3">
          <span className="text-2xl flex-shrink-0">🎁</span>
          <div>
            <p className="text-white font-semibold text-sm">3 minutos gratis con cada experto nuevo</p>
            <p className="text-white/70 text-xs">Prueba la conexión antes de comprometerte.</p>
          </div>
        </div>

        {/* Búsqueda por PIN */}
        <div className="bg-black/60 border border-white/20 rounded-xl px-4 py-2.5 flex items-center gap-2 mb-3">
          <span className="text-white/40 text-sm">🔍</span>
          <input
            value={busquedaPin}
            onChange={e => setBusquedaPin(e.target.value)}
            placeholder="Buscar por nombre o PIN del experto..."
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-white/30"
          />
          {busquedaPin && (
            <button onClick={() => setBusquedaPin('')} className="text-white/40 text-sm">✕</button>
          )}
        </div>

        {/* Filtros disponibles + orden */}
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setSoloDisponibles(!soloDisponibles)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition ${soloDisponibles ? 'bg-green-500/20 border-green-400/50 text-green-300' : 'bg-white/10 border-white/20 text-white/70'}`}>
            <div className={`w-2 h-2 rounded-full ${soloDisponibles ? 'bg-green-400' : 'bg-white/30'}`} />
            Solo disponibles
          </button>
          <select value={ordenPor} onChange={e => setOrdenPor(e.target.value as any)}
            className="bg-black/60 border border-white/20 text-white text-xs rounded-xl px-3 py-1.5 outline-none">
            <option value="nivel" className="bg-black">💎 Por nivel</option>
            <option value="valoracion" className="bg-black">⭐ Mejor valorados</option>
            <option value="precio" className="bg-black">💰 Más económicos</option>
            <option value="sesiones" className="bg-black">🔥 Más populares</option>
          </select>
        </div>

        {/* Temáticas */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {TEMATICAS.map(t => (
            <button key={t} onClick={() => setTematica(t)}
              className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition flex-shrink-0 ${tematica === t ? 'bg-purple-600 border-purple-400 text-white' : 'bg-black/50 border-white/20 text-white/70'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div className="relative z-10 flex-1 px-4 pb-8 flex flex-col gap-3 mt-3">

        {cargando && [1,2,3].map(i => (
          <div key={i} className="h-40 rounded-3xl bg-white/10 animate-pulse" />
        ))}

        {!cargando && expertosFiltrados.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔮</p>
            <p className="text-white/70 text-sm">No hay expertos con estos filtros.</p>
          </div>
        )}

        {!cargando && expertosFiltrados.map(experto => {
          const colorIndex = experto.slug.length % AVATAR_COLORES.length
          return (
            <button key={experto.id}
              onClick={() => window.location.href = `/expertos/${experto.slug}`}
              className="w-full bg-black/65 border border-white/15 rounded-3xl p-4 text-left hover:border-purple-400/40 hover:bg-black/75 transition">

              <div className="flex gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {experto.foto_url ? (
                    <img src={experto.foto_url} alt={experto.nombre_artistico}
                      className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${AVATAR_COLORES[colorIndex]} flex items-center justify-center text-2xl font-bold text-white`}>
                      {experto.nombre_artistico.charAt(0)}
                    </div>
                  )}
                  {/* Estado dot */}
                  <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-black ${ESTADO_CONFIG[experto.estado]?.color ?? 'bg-white/30'}`} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="min-w-0">
                      <p className="text-white font-bold text-base truncate">{experto.nombre_artistico}</p>
                      <p className="text-white/50 text-xs">PIN: {experto.pin}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-white font-bold text-sm">€{experto.precio_minuto?.toFixed(2)}</p>
                      <p className="text-white/50 text-xs">por min</p>
                    </div>
                  </div>

                  {/* Nivel + valoración */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <NivelBadge nivel={experto.nivel} />
                    <div className="flex items-center gap-1">
                      <span className="text-amber-400 text-xs">★</span>
                      <span className="text-white text-xs">{experto.valoracion_media?.toFixed(1)}</span>
                      <span className="text-white/40 text-xs">({experto.total_valoraciones})</span>
                    </div>
                  </div>

                  <p className="text-white/70 text-xs leading-relaxed line-clamp-2 mb-2">{experto.bio}</p>

                  {/* Especialidades temáticas */}
                  {experto.especialidad_tematica?.length > 0 && (
                    <div className="flex gap-1 flex-wrap mb-2">
                      {experto.especialidad_tematica.slice(0, 2).map(t => (
                        <span key={t} className="text-xs bg-white/10 text-white/70 px-2 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-3 text-xs text-white/50">
                  <span>💬 {experto.total_sesiones}</span>
                  {experto.acepta_email && <span>📧 Email</span>}
                  {experto.acepta_webinar && <span>🎥 Webinar</span>}
                  <span>🎁 {experto.minutos_gratis} min gratis</span>
                </div>
                <EstadoBadge estado={experto.estado} />
              </div>
            </button>
          )
        })}

        {/* ¿Eres experto? */}
        <div className="bg-black/65 border border-white/15 rounded-2xl p-4 mt-2">
          <p className="text-white font-semibold text-sm mb-1">¿Eres tarotista o experto espiritual?</p>
          <p className="text-white/70 text-xs leading-relaxed mb-3">
            Primer mes sin comisión · Posición prioritaria · Sin cuota de alta
          </p>
          <button onClick={() => window.location.href = '/expertos/unirse'}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-full text-sm">
            Solicitar ser experto →
          </button>
        </div>

      </div>
    </div>
  )
}
