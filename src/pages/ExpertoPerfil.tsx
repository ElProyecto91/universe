// src/pages/ExpertoPerfil.tsx
// ============================================================
// UNIVERSE — Perfil del experto espiritual
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
  idiomas: string[]
  disponible: boolean
  verificado: boolean
  valoracion_media: number
  total_valoraciones: number
  total_sesiones: number
  total_minutos: number
  foto_url: string | null
}

interface Resena {
  id: string
  valoracion: number
  comentario: string
  created_at: string
}

const AVATAR_COLORES = [
  'from-purple-600 to-pink-600',
  'from-blue-600 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-green-600 to-teal-600',
  'from-pink-600 to-rose-600',
]

function Estrellas({ valoracion, size = 'md' }: { valoracion: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-lg' }
  return (
    <div className={`flex items-center gap-0.5 ${sizes[size]}`}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= Math.round(valoracion) ? 'text-amber-400' : 'text-white/20'}>★</span>
      ))}
    </div>
  )
}

function formatearFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function ExpertoPerfil() {
  const [experto, setExperto] = useState<Experto | null>(null)
  const [resenas, setResenas] = useState<Resena[]>([])
  const [cargando, setCargando] = useState(true)
  const [mostrarTodas, setMostrarTodas] = useState(false)
  const [mostrarModal, setMostrarModal] = useState(false)

  // Obtener slug de la URL
  const slug = window.location.pathname.split('/').pop() || ''

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  useEffect(() => {
    cargarExperto()
  }, [slug])

  async function cargarExperto() {
    try {
      const { data: exp } = await supabase
        .from('expertos')
        .select('*')
        .eq('slug', slug)
        .eq('activo', true)
        .single()

      if (exp) {
        setExperto(exp)
        const { data: rev } = await supabase
          .from('resenas_experto')
          .select('id, valoracion, comentario, created_at')
          .eq('experto_id', exp.id)
          .order('created_at', { ascending: false })
          .limit(20)
        setResenas(rev ?? [])
      }
    } catch (err) {
      console.error('[ExpertoPerfil]', err)
    }
    setCargando(false)
  }

  const iniciarSesion = async (tipo: 'chat' | 'llamada') => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/auth'; return }
    if (!experto) return

    // Obtener historial de lecturas para contexto
    const { data: historial } = await supabase
      .from('historial_lecturas')
      .select('herramienta, titulo, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    const notasPrevias = historial?.map(h => `${h.herramienta}: ${h.titulo}`).join('\n') ?? ''

    // Crear sesión
    const { data: sesion } = await supabase
      .from('sesiones_experto')
      .insert({
        experto_id: experto.id,
        usuario_id: user.id,
        tipo,
        precio_minuto: experto.precio_minuto,
        notas_previas: notasPrevias,
        estado: 'pendiente',
      })
      .select()
      .single()

    if (sesion) {
      window.location.href = `/sesion/${sesion.id}`
    }
  }

  if (cargando) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center relative" style={bgStyle}>
        <div className="absolute inset-0 bg-black/82" />
        <div className="relative z-10 flex gap-2">
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    )
  }

  if (!experto) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center relative" style={bgStyle}>
        <div className="absolute inset-0 bg-black/82" />
        <div className="relative z-10 text-center px-6">
          <p className="text-5xl mb-4">🔮</p>
          <p className="text-white font-bold text-xl mb-2">Experto no encontrado</p>
          <button onClick={() => window.location.href = '/expertos'} className="text-purple-300 text-sm mt-4">← Volver al directorio</button>
        </div>
      </div>
    )
  }

  const colorIndex = experto.slug.length % AVATAR_COLORES.length
  const resenasVisibles = mostrarTodas ? resenas : resenas.slice(0, 3)

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/82" />

      {/* Modal de inicio de sesión */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
          <div className="w-full max-w-sm bg-black/95 border-t border-white/10 rounded-t-3xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-white font-bold text-lg">Iniciar consulta</p>
              <button onClick={() => setMostrarModal(false)} className="text-white/30 text-2xl">✕</button>
            </div>

            <div className="flex items-center gap-3 bg-white/8 border border-white/15 rounded-2xl p-3"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${AVATAR_COLORES[colorIndex]} flex items-center justify-center font-bold text-white text-lg flex-shrink-0`}>
                {experto.nombre_artistico.charAt(0)}
              </div>
              <div>
                <p className="text-white font-semibold">{experto.nombre_artistico}</p>
                <p className="text-white/50 text-xs">€{experto.precio_minuto.toFixed(2)}/min</p>
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-400/30 rounded-2xl p-3">
              <p className="text-green-300 text-sm font-semibold">🎁 {experto.minutos_gratis} minutos gratis</p>
              <p className="text-white/60 text-xs mt-0.5">Tu primera sesión con {experto.nombre_artistico} empieza gratis. Solo se cobra a partir del minuto {experto.minutos_gratis + 1}.</p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => iniciarSesion('chat')}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-full text-base"
              >
                💬 Iniciar chat ahora
              </button>
              <button
                onClick={() => iniciarSesion('llamada')}
                className="w-full bg-black/50 border border-white/25 text-white font-semibold py-4 rounded-full"
              >
                📞 Llamada de voz
              </button>
            </div>

            <p className="text-white/25 text-xs text-center">
              Pago seguro. Cancela en cualquier momento. Sin permanencia.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 flex items-center px-4 py-4">
        <button onClick={() => window.location.href = '/expertos'} className="text-purple-300 text-sm">← Expertos</button>
      </div>

      {/* Perfil hero */}
      <div className="relative z-10 px-4 flex flex-col items-center gap-4 pb-6 border-b border-white/10">
        <div className="relative">
          {experto.foto_url ? (
            <img src={experto.foto_url} alt={experto.nombre_artistico}
              className="w-24 h-24 rounded-full object-cover border-2 border-purple-400/50" />
          ) : (
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${AVATAR_COLORES[colorIndex]} flex items-center justify-center text-3xl font-bold text-white border-2 border-purple-400/50`}>
              {experto.nombre_artistico.charAt(0)}
            </div>
          )}
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-black ${experto.disponible ? 'bg-green-400' : 'bg-white/30'}`} />
        </div>

        <div className="text-center">
          <div className="flex items-center gap-2 justify-center">
            <p className="text-white font-bold text-2xl">{experto.nombre_artistico}</p>
            {experto.verificado && (
              <span className="bg-blue-500/20 text-blue-300 text-xs border border-blue-400/30 px-2 py-0.5 rounded-full">✓ Verificado</span>
            )}
          </div>
          <p className={`text-sm font-medium mt-1 ${experto.disponible ? 'text-green-300' : 'text-white/40'}`}>
            {experto.disponible ? '● Disponible ahora' : '○ No disponible'}
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-white font-bold text-xl">{experto.valoracion_media.toFixed(1)}</p>
            <Estrellas valoracion={experto.valoracion_media} size="sm" />
            <p className="text-white/40 text-xs mt-0.5">{experto.total_valoraciones} reseñas</p>
          </div>
          <div className="w-px bg-white/10" />
          <div className="text-center">
            <p className="text-white font-bold text-xl">{experto.total_sesiones}</p>
            <p className="text-white/40 text-xs">sesiones</p>
          </div>
          <div className="w-px bg-white/10" />
          <div className="text-center">
            <p className="text-white font-bold text-xl">€{experto.precio_minuto.toFixed(2)}</p>
            <p className="text-white/40 text-xs">por minuto</p>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex-1 px-4 py-5 flex flex-col gap-5">

        {/* Bio */}
        <div className="bg-black/55 border border-white/15 rounded-2xl p-4">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Sobre mí</p>
          <p className="text-white text-sm leading-relaxed">{experto.bio}</p>
        </div>

        {/* Especialidades */}
        <div className="bg-black/55 border border-white/15 rounded-2xl p-4">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Especialidades</p>
          <div className="flex flex-wrap gap-2">
            {experto.especialidades?.map(esp => (
              <span key={esp} className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-sm px-3 py-1 rounded-full">
                {esp}
              </span>
            ))}
          </div>
        </div>

        {/* Métodos */}
        <div className="bg-black/55 border border-white/15 rounded-2xl p-4">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Métodos de lectura</p>
          <div className="flex flex-col gap-2">
            {experto.metodos?.map(met => (
              <div key={met} className="flex items-center gap-2">
                <span className="text-purple-400 text-xs">✦</span>
                <p className="text-white text-sm">{met}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Idiomas */}
        {experto.idiomas && experto.idiomas.length > 0 && (
          <div className="bg-black/55 border border-white/15 rounded-2xl p-4">
            <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Idiomas</p>
            <div className="flex gap-2">
              {experto.idiomas.map(id => (
                <span key={id} className="bg-white/10 text-white/70 border border-white/20 text-sm px-3 py-1 rounded-full">{id}</span>
              ))}
            </div>
          </div>
        )}

        {/* Precio */}
        <div className="bg-black/55 border border-white/15 rounded-2xl p-4">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Precios</p>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-white text-sm">Chat por minuto</span>
              <span className="text-white font-bold">€{experto.precio_minuto.toFixed(2)}/min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white text-sm">Sesión 30 minutos</span>
              <span className="text-white font-bold">€{(experto.precio_minuto * 30 * 0.9).toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white text-sm">Sesión 60 minutos</span>
              <span className="text-white font-bold">€{(experto.precio_minuto * 60 * 0.85).toFixed(0)}</span>
            </div>
            <div className="mt-1 pt-2 border-t border-white/10">
              <p className="text-green-300 text-sm font-semibold">🎁 {experto.minutos_gratis} minutos gratis en tu primera sesión</p>
            </div>
          </div>
        </div>

        {/* Reseñas */}
        {resenas.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-purple-300 text-xs tracking-widest uppercase">Reseñas verificadas</p>
              <div className="flex items-center gap-1">
                <Estrellas valoracion={experto.valoracion_media} size="sm" />
                <span className="text-white/50 text-xs">{experto.valoracion_media.toFixed(1)}</span>
              </div>
            </div>

            {resenasVisibles.map(resena => (
              <div key={resena.id} className="bg-black/55 border border-white/15 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <Estrellas valoracion={resena.valoracion} size="sm" />
                  <p className="text-white/30 text-xs">{formatearFecha(resena.created_at)}</p>
                </div>
                {resena.comentario && (
                  <p className="text-white/80 text-sm leading-relaxed">"{resena.comentario}"</p>
                )}
              </div>
            ))}

            {resenas.length > 3 && (
              <button
                onClick={() => setMostrarTodas(!mostrarTodas)}
                className="text-purple-300 text-sm text-center py-2"
              >
                {mostrarTodas ? 'Ver menos' : `Ver las ${resenas.length - 3} reseñas restantes`}
              </button>
            )}
          </div>
        )}

        {/* Aviso legal */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-3">
          <p className="text-white/30 text-xs leading-relaxed text-center">
            Las consultas con expertos son solo para entretenimiento y reflexión personal. No constituyen asesoramiento médico, psicológico, financiero ni legal.
          </p>
        </div>

      </div>

      {/* CTA fijo en el fondo */}
      <div className="relative z-10 px-4 py-4 border-t border-white/10 bg-black/80 backdrop-blur">
        {experto.disponible ? (
          <button
            onClick={() => setMostrarModal(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-full text-base"
            style={{ boxShadow: '0 0 20px rgba(139,92,246,0.4)' }}
          >
            💬 Consultar ahora · {experto.minutos_gratis} min gratis
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <button className="w-full bg-white/10 border border-white/20 text-white/60 font-semibold py-4 rounded-full cursor-not-allowed">
              ○ No disponible ahora
            </button>
            <p className="text-white/30 text-xs text-center">Vuelve más tarde o explora otros expertos</p>
          </div>
        )}
      </div>
    </div>
  )
}