// src/pages/ExpertoPerfil.tsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Experto {
  id: string; slug: string; pin: string; nombre_artistico: string; bio: string
  especialidades: string[]; especialidad_tematica: string[]; metodos: string[]
  precio_minuto: number; minutos_gratis: number; idiomas: string[]
  disponible: boolean; estado: string; nivel: string; verificado: boolean
  valoracion_media: number; total_valoraciones: number; total_sesiones: number
  total_minutos: number; foto_url: string | null; video_url: string | null
  acepta_email: boolean; precio_email: number
  acepta_webinar: boolean; precio_webinar: number
  total_regalos: number; total_favoritos: number; ultima_sesion: string | null
}

interface Resena { id: string; valoracion: number; comentario: string; created_at: string }
interface Webinar { id: string; titulo: string; descripcion: string; fecha: string; precio_eur: number; participantes_actuales: number; max_participantes: number }

const REGALOS_DISPONIBLES = [
  { tipo: 'estrella',   emoji: '⭐', nombre: 'Estrella',      valor: 1.99 },
  { tipo: 'corazon',    emoji: '❤️', nombre: 'Corazón',       valor: 2.99 },
  { tipo: 'luna',       emoji: '🌙', nombre: 'Luna',          valor: 4.99 },
  { tipo: 'cristal',    emoji: '💎', nombre: 'Cristal',       valor: 9.99 },
  { tipo: 'universo',   emoji: '✨', nombre: 'Universo',      valor: 19.99 },
]

const NIVELES_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  diamant:    { label: '💎 Diamant',   color: 'text-cyan-300',   bg: 'bg-cyan-500/20 border-cyan-400/40' },
  premium:    { label: '✨ Premium',   color: 'text-amber-300',  bg: 'bg-amber-500/20 border-amber-400/40' },
  top:        { label: '🔥 Top',       color: 'text-orange-300', bg: 'bg-orange-500/20 border-orange-400/40' },
  verificado: { label: '✓ Verificado', color: 'text-purple-300', bg: 'bg-purple-500/20 border-purple-400/40' },
  nuevo:      { label: '⭐ Nuevo',     color: 'text-white/60',   bg: 'bg-white/10 border-white/20' },
}

const ESTADO_CONFIG: Record<string, { color: string; label: string; text: string }> = {
  online:  { color: 'bg-green-400',  label: '● Disponible ahora', text: 'text-green-300' },
  ocupado: { color: 'bg-amber-400',  label: '● En sesión',        text: 'text-amber-300' },
  offline: { color: 'bg-white/30',   label: '○ No disponible',    text: 'text-white/40' },
}

const AVATAR_COLORES = ['from-purple-600 to-pink-600','from-blue-600 to-purple-600','from-amber-500 to-orange-600','from-green-600 to-teal-600','from-pink-600 to-rose-600']

function formatearFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function ExpertoPerfil() {
  const [experto, setExperto] = useState<Experto | null>(null)
  const [resenas, setResenas] = useState<Resena[]>([])
  const [webinars, setWebinars] = useState<Webinar[]>([])
  const [cargando, setCargando] = useState(true)
  const [mostrarTodas, setMostrarTodas] = useState(false)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [mostrarRegalos, setMostrarRegalos] = useState(false)
  const [mostrarEmail, setMostrarEmail] = useState(false)
  const [esFavorito, setEsFavorito] = useState(false)
  const [preguntaEmail, setPreguntaEmail] = useState('')
  const [enviandoEmail, setEnviandoEmail] = useState(false)
  const [msgEmail, setMsgEmail] = useState('')
  const [regaloSeleccionado, setRegaloSeleccionado] = useState<typeof REGALOS_DISPONIBLES[0] | null>(null)
  const [mensajeRegalo, setMensajeRegalo] = useState('')
  const [enviandoRegalo, setEnviandoRegalo] = useState(false)

  const slug = window.location.pathname.split('/').pop() || ''

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  useEffect(() => {
    cargarExperto()
    verificarFavorito()
  }, [slug])

  async function cargarExperto() {
    const { data: exp } = await supabase.from('expertos').select('*').eq('slug', slug).eq('activo', true).single()
    if (exp) {
      setExperto(exp)
      const [{ data: rev }, { data: web }] = await Promise.all([
        supabase.from('resenas_experto').select('id,valoracion,comentario,created_at').eq('experto_id', exp.id).order('created_at', { ascending: false }).limit(20),
        supabase.from('webinars_experto').select('*').eq('experto_id', exp.id).eq('estado', 'programado').gte('fecha', new Date().toISOString()).order('fecha').limit(3),
      ])
      setResenas(rev ?? [])
      setWebinars(web ?? [])
    }
    setCargando(false)
  }

  async function verificarFavorito() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !experto) return
    const { data } = await supabase.from('favoritos_experto').select('id').eq('usuario_id', user.id).eq('experto_id', experto.id).maybeSingle()
    setEsFavorito(!!data)
  }

  async function toggleFavorito() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/auth'; return }
    if (!experto) return
    if (esFavorito) {
      await supabase.from('favoritos_experto').delete().eq('usuario_id', user.id).eq('experto_id', experto.id)
      setEsFavorito(false)
    } else {
      await supabase.from('favoritos_experto').insert({ usuario_id: user.id, experto_id: experto.id, notificar_conexion: true })
      setEsFavorito(true)
    }
  }

  async function enviarConsultaEmail() {
    if (!preguntaEmail.trim() || !experto) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/auth'; return }
    setEnviandoEmail(true)
    const { error } = await supabase.from('consultas_email').insert({
      experto_id: experto.id, usuario_id: user.id,
      pregunta: preguntaEmail, precio_eur: experto.precio_email, estado: 'pendiente',
    })
    setMsgEmail(error ? 'Error al enviar. Inténtalo de nuevo.' : '✅ Consulta enviada. El experto te responderá en 3 días.')
    setEnviandoEmail(false)
    if (!error) setPreguntaEmail('')
  }

  async function enviarRegalo() {
    if (!regaloSeleccionado || !experto) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/auth'; return }
    setEnviandoRegalo(true)
    await supabase.from('regalos_experto').insert({
      experto_id: experto.id, usuario_id: user.id,
      tipo: regaloSeleccionado.tipo, emoji: regaloSeleccionado.emoji,
      nombre: regaloSeleccionado.nombre, valor_eur: regaloSeleccionado.valor,
      mensaje: mensajeRegalo || null,
    })
    setMostrarRegalos(false)
    setRegaloSeleccionado(null)
    setMensajeRegalo('')
    setEnviandoRegalo(false)
  }

  async function iniciarSesion(tipo: 'chat' | 'llamada') {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/auth'; return }
    if (!experto) return
    const { data: historial } = await supabase.from('historial_lecturas').select('herramienta,titulo,created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
    const notas = historial?.map(h => `${h.herramienta}: ${h.titulo}`).join('\n') ?? ''
    const { data: sesion } = await supabase.from('sesiones_experto').insert({
      experto_id: experto.id, usuario_id: user.id, tipo,
      precio_minuto: experto.precio_minuto, notas_previas: notas, estado: 'pendiente',
    }).select().single()
    if (sesion) window.location.href = `/sesion/${sesion.id}`
  }

  if (cargando) return (
    <div className="min-h-screen flex items-center justify-center relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/88" />
      <div className="relative z-10 flex gap-2">
        {[0,150,300].map(d => <div key={d} className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
      </div>
    </div>
  )

  if (!experto) return (
    <div className="min-h-screen text-white flex items-center justify-center relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/88" />
      <div className="relative z-10 text-center px-6">
        <p className="text-5xl mb-4">🔮</p>
        <p className="text-white font-bold text-xl mb-4">Experto no encontrado</p>
        <button onClick={() => window.location.href = '/expertos'} className="text-purple-300 text-sm">← Volver al directorio</button>
      </div>
    </div>
  )

  const colorIndex = experto.slug.length % AVATAR_COLORES.length
  const nivelCfg = NIVELES_CONFIG[experto.nivel] ?? NIVELES_CONFIG.nuevo
  const estadoCfg = ESTADO_CONFIG[experto.estado] ?? ESTADO_CONFIG.offline
  const resenasVisibles = mostrarTodas ? resenas : resenas.slice(0, 3)

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/88" />

      {/* Modal consulta email */}
      {mostrarEmail && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
          <div className="w-full max-w-sm bg-black/95 border-t border-white/10 rounded-t-3xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-white font-bold">📧 Consulta por email</p>
              <button onClick={() => { setMostrarEmail(false); setMsgEmail('') }} className="text-white/30 text-2xl">✕</button>
            </div>
            <div className="bg-black/60 border border-white/15 rounded-2xl p-3">
              <p className="text-white/70 text-xs">Precio: <strong className="text-white">€{experto.precio_email?.toFixed(2)}</strong> · Respuesta en máx. 3 días</p>
            </div>
            {!msgEmail ? (
              <>
                <textarea value={preguntaEmail} onChange={e => setPreguntaEmail(e.target.value)}
                  placeholder="Escribe tu pregunta en detalle. Cuanto más específica, mejor respuesta recibirás..."
                  rows={6} className="w-full bg-black/50 border border-white/20 rounded-2xl px-4 py-3 text-white text-sm resize-none outline-none placeholder-white/30" />
                <button onClick={enviarConsultaEmail} disabled={!preguntaEmail.trim() || enviandoEmail}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-full disabled:opacity-40">
                  {enviandoEmail ? 'Enviando...' : `Enviar consulta · €${experto.precio_email?.toFixed(2)}`}
                </button>
              </>
            ) : (
              <div className="bg-green-500/15 border border-green-400/30 rounded-2xl p-4 text-center">
                <p className="text-green-300">{msgEmail}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal regalos */}
      {mostrarRegalos && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
          <div className="w-full max-w-sm bg-black/95 border-t border-white/10 rounded-t-3xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-white font-bold">🎁 Enviar un regalo</p>
              <button onClick={() => { setMostrarRegalos(false); setRegaloSeleccionado(null) }} className="text-white/30 text-2xl">✕</button>
            </div>
            <p className="text-white/60 text-xs">Los regalos son una forma de agradecer una sesión especial. El experto recibe el 70%.</p>
            <div className="grid grid-cols-5 gap-2">
              {REGALOS_DISPONIBLES.map(r => (
                <button key={r.tipo} onClick={() => setRegaloSeleccionado(r)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-2xl border transition ${regaloSeleccionado?.tipo === r.tipo ? 'bg-purple-600/40 border-purple-400' : 'bg-white/10 border-white/20'}`}>
                  <span className="text-2xl">{r.emoji}</span>
                  <span className="text-white text-xs">€{r.valor}</span>
                </button>
              ))}
            </div>
            {regaloSeleccionado && (
              <>
                <div className="bg-black/60 border border-white/15 rounded-2xl p-3 text-center">
                  <p className="text-white font-semibold">{regaloSeleccionado.emoji} {regaloSeleccionado.nombre} · €{regaloSeleccionado.valor}</p>
                </div>
                <input value={mensajeRegalo} onChange={e => setMensajeRegalo(e.target.value)}
                  placeholder="Mensaje para el experto (opcional)..."
                  className="w-full bg-black/50 border border-white/20 rounded-2xl px-4 py-3 text-white text-sm outline-none placeholder-white/30" />
                <button onClick={enviarRegalo} disabled={enviandoRegalo}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-full disabled:opacity-40">
                  {enviandoRegalo ? 'Enviando...' : `Enviar ${regaloSeleccionado.emoji} · €${regaloSeleccionado.valor}`}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal inicio sesión */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
          <div className="w-full max-w-sm bg-black/95 border-t border-white/10 rounded-t-3xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-white font-bold text-lg">Iniciar consulta</p>
              <button onClick={() => setMostrarModal(false)} className="text-white/30 text-2xl">✕</button>
            </div>
            <div className="flex items-center gap-3 bg-black/60 border border-white/15 rounded-2xl p-3">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${AVATAR_COLORES[colorIndex]} flex items-center justify-center font-bold text-white text-lg flex-shrink-0`}>
                {experto.nombre_artistico.charAt(0)}
              </div>
              <div>
                <p className="text-white font-semibold">{experto.nombre_artistico}</p>
                <p className="text-white/60 text-xs">PIN {experto.pin} · €{experto.precio_minuto?.toFixed(2)}/min</p>
              </div>
            </div>
            <div className="bg-green-500/10 border border-green-400/30 rounded-2xl p-3">
              <p className="text-green-300 text-sm font-semibold">🎁 {experto.minutos_gratis} minutos gratis</p>
              <p className="text-white/70 text-xs mt-0.5">Tu primera sesión comienza gratis. Solo se cobra desde el minuto {experto.minutos_gratis + 1}.</p>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => iniciarSesion('chat')}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-full text-base">
                💬 Iniciar chat ahora
              </button>
              <button onClick={() => iniciarSesion('llamada')}
                className="w-full bg-black/60 border border-white/25 text-white font-semibold py-4 rounded-full">
                📞 Llamada de voz
              </button>
            </div>
            <p className="text-white/30 text-xs text-center">Pago seguro. Cancela en cualquier momento.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 py-4">
        <button onClick={() => window.location.href = '/expertos'} className="text-purple-300 text-sm">← Expertos</button>
        <div className="flex items-center gap-2">
          {/* Favorito */}
          <button onClick={toggleFavorito}
            className={`w-9 h-9 rounded-full border flex items-center justify-center text-base transition ${esFavorito ? 'bg-pink-500/20 border-pink-400/50 text-pink-300' : 'bg-white/10 border-white/20 text-white/50'}`}>
            {esFavorito ? '❤️' : '🤍'}
          </button>
          {/* Regalar */}
          <button onClick={() => setMostrarRegalos(true)}
            className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-base">
            🎁
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="relative z-10 px-4 flex flex-col items-center gap-3 pb-5 border-b border-white/10">
        <div className="relative">
          {experto.foto_url ? (
            <img src={experto.foto_url} alt={experto.nombre_artistico}
              className="w-24 h-24 rounded-full object-cover border-2 border-purple-400/50" />
          ) : (
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${AVATAR_COLORES[colorIndex]} flex items-center justify-center text-3xl font-bold text-white border-2 border-purple-400/50`}>
              {experto.nombre_artistico.charAt(0)}
            </div>
          )}
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-black ${ESTADO_CONFIG[experto.estado]?.color ?? 'bg-white/30'}`} />
        </div>

        <div className="text-center">
          <p className="text-white font-bold text-2xl">{experto.nombre_artistico}</p>
          <p className="text-white/50 text-xs mt-0.5">PIN: {experto.pin}</p>
          <div className="flex items-center gap-2 justify-center mt-1.5">
            <span className={`text-xs px-2 py-0.5 rounded-full border ${nivelCfg.bg} ${nivelCfg.color}`}>{nivelCfg.label}</span>
            {experto.verificado && <span className="text-blue-400 text-xs">✓ Verificado</span>}
          </div>
          <p className={`text-sm font-medium mt-1.5 ${estadoCfg.text}`}>{estadoCfg.label}</p>
          {experto.estado === 'ocupado' && (
            <p className="text-amber-300/70 text-xs">En sesión · Disponible pronto</p>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-white font-bold text-xl">{experto.valoracion_media?.toFixed(1)}</p>
            <div className="flex gap-0.5 justify-center">
              {[1,2,3,4,5].map(i => <span key={i} className={`text-xs ${i <= Math.round(experto.valoracion_media) ? 'text-amber-400' : 'text-white/20'}`}>★</span>)}
            </div>
            <p className="text-white/50 text-xs">{experto.total_valoraciones} reseñas</p>
          </div>
          <div className="w-px bg-white/10" />
          <div className="text-center">
            <p className="text-white font-bold text-xl">{experto.total_sesiones}</p>
            <p className="text-white/50 text-xs">sesiones</p>
          </div>
          <div className="w-px bg-white/10" />
          <div className="text-center">
            <p className="text-white font-bold text-xl">€{experto.precio_minuto?.toFixed(2)}</p>
            <p className="text-white/50 text-xs">por minuto</p>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex-1 px-4 py-5 flex flex-col gap-4">

        {/* Vídeo presentación */}
        {experto.video_url && (
          <div className="bg-black/70 border border-white/15 rounded-2xl overflow-hidden">
            <p className="text-purple-300 text-xs tracking-widest uppercase px-4 pt-3 mb-2">🎥 Presentación</p>
            <video src={experto.video_url} controls className="w-full" style={{ maxHeight: '200px' }} />
          </div>
        )}

        {/* Bio */}
        <div className="bg-black/70 border border-white/15 rounded-2xl p-4">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Sobre mí</p>
          <p className="text-white text-sm leading-relaxed">{experto.bio}</p>
        </div>

        {/* Temáticas */}
        {experto.especialidad_tematica?.length > 0 && (
          <div className="bg-black/70 border border-white/15 rounded-2xl p-4">
            <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Te puedo ayudar con</p>
            <div className="flex flex-wrap gap-2">
              {experto.especialidad_tematica.map(t => (
                <span key={t} className="bg-white/10 text-white text-sm px-3 py-1 rounded-full border border-white/20">{t}</span>
              ))}
            </div>
          </div>
        )}

        {/* Especialidades y métodos */}
        <div className="bg-black/70 border border-white/15 rounded-2xl p-4">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Especialidades</p>
          <div className="flex flex-wrap gap-2">
            {experto.especialidades?.map(e => (
              <span key={e} className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-sm px-3 py-1 rounded-full">{e}</span>
            ))}
          </div>
        </div>

        <div className="bg-black/70 border border-white/15 rounded-2xl p-4">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Métodos de lectura</p>
          <div className="flex flex-col gap-2">
            {experto.metodos?.map(m => (
              <div key={m} className="flex items-center gap-2">
                <span className="text-purple-400 text-xs">✦</span>
                <p className="text-white text-sm">{m}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Precios */}
        <div className="bg-black/70 border border-white/15 rounded-2xl p-4">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Precios</p>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between"><span className="text-white text-sm">Chat por minuto</span><span className="text-white font-bold">€{experto.precio_minuto?.toFixed(2)}/min</span></div>
            <div className="flex justify-between"><span className="text-white text-sm">Sesión 30 min</span><span className="text-white font-bold">€{(experto.precio_minuto * 30 * 0.9).toFixed(0)}</span></div>
            <div className="flex justify-between"><span className="text-white text-sm">Sesión 60 min</span><span className="text-white font-bold">€{(experto.precio_minuto * 60 * 0.85).toFixed(0)}</span></div>
            {experto.acepta_email && (
              <div className="flex justify-between border-t border-white/10 pt-2 mt-1">
                <span className="text-white text-sm">📧 Consulta email</span>
                <span className="text-white font-bold">€{experto.precio_email?.toFixed(2)}</span>
              </div>
            )}
            {experto.acepta_webinar && (
              <div className="flex justify-between">
                <span className="text-white text-sm">🎥 Webinar grupal</span>
                <span className="text-white font-bold">desde €{experto.precio_webinar?.toFixed(2)}</span>
              </div>
            )}
            <div className="mt-1 pt-2 border-t border-white/10">
              <p className="text-green-300 text-sm font-semibold">🎁 {experto.minutos_gratis} minutos gratis en tu primera sesión</p>
            </div>
          </div>
        </div>

        {/* Webinars próximos */}
        {webinars.length > 0 && (
          <div className="bg-black/70 border border-white/15 rounded-2xl p-4">
            <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">🎥 Próximos webinars</p>
            <div className="flex flex-col gap-3">
              {webinars.map(w => (
                <div key={w.id} className="bg-white/8 border border-white/15 rounded-xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                  <p className="text-white font-semibold text-sm">{w.titulo}</p>
                  <p className="text-white/60 text-xs mt-0.5">{formatearFecha(w.fecha)}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-white/50 text-xs">{w.participantes_actuales}/{w.max_participantes} plazas</p>
                    <span className="text-white font-bold text-sm">€{w.precio_eur?.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Consulta email */}
        {experto.acepta_email && (
          <button onClick={() => setMostrarEmail(true)}
            className="w-full bg-black/70 border border-white/15 rounded-2xl p-4 text-left flex items-center gap-3">
            <span className="text-3xl">📧</span>
            <div>
              <p className="text-white font-semibold text-sm">Consulta por email</p>
              <p className="text-white/60 text-xs">Respuesta detallada en máx. 3 días · €{experto.precio_email?.toFixed(2)}</p>
            </div>
            <span className="ml-auto text-white/40">›</span>
          </button>
        )}

        {/* Idiomas */}
        {experto.idiomas?.length > 0 && (
          <div className="bg-black/70 border border-white/15 rounded-2xl p-4">
            <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Idiomas</p>
            <div className="flex gap-2 flex-wrap">
              {experto.idiomas.map(id => (
                <span key={id} className="bg-white/10 text-white border border-white/20 text-sm px-3 py-1 rounded-full">{id}</span>
              ))}
            </div>
          </div>
        )}

        {/* Reseñas */}
        {resenas.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-purple-300 text-xs tracking-widest uppercase">Reseñas verificadas</p>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => <span key={i} className={`text-xs ${i <= Math.round(experto.valoracion_media) ? 'text-amber-400' : 'text-white/20'}`}>★</span>)}
                <span className="text-white/60 text-xs ml-1">{experto.valoracion_media?.toFixed(1)}</span>
              </div>
            </div>
            {resenasVisibles.map(r => (
              <div key={r.id} className="bg-black/70 border border-white/15 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => <span key={i} className={`text-sm ${i <= r.valoracion ? 'text-amber-400' : 'text-white/20'}`}>★</span>)}
                  </div>
                  <p className="text-white/40 text-xs">{formatearFecha(r.created_at)}</p>
                </div>
                {r.comentario && <p className="text-white text-sm leading-relaxed">"{r.comentario}"</p>}
              </div>
            ))}
            {resenas.length > 3 && (
              <button onClick={() => setMostrarTodas(!mostrarTodas)} className="text-purple-300 text-sm text-center py-2">
                {mostrarTodas ? 'Ver menos' : `Ver ${resenas.length - 3} reseñas más`}
              </button>
            )}
          </div>
        )}

        {/* Aviso legal */}
        <div className="bg-black/50 border border-white/10 rounded-2xl p-3">
          <p className="text-white/40 text-xs leading-relaxed text-center">
            Las consultas con expertos son solo para entretenimiento y reflexión personal. No constituyen asesoramiento médico, psicológico, financiero ni legal.
          </p>
        </div>

      </div>

      {/* CTA fijo */}
      <div className="relative z-10 px-4 py-4 border-t border-white/10 bg-black/80 backdrop-blur">
        {experto.estado === 'online' ? (
          <button onClick={() => setMostrarModal(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-full text-base"
            style={{ boxShadow: '0 0 20px rgba(139,92,246,0.4)' }}>
            💬 Consultar ahora · {experto.minutos_gratis} min gratis
          </button>
        ) : experto.estado === 'ocupado' ? (
          <div className="flex flex-col gap-2">
            <button className="w-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-semibold py-4 rounded-full cursor-not-allowed">
              ● En sesión · Disponible pronto
            </button>
            {experto.acepta_email && (
              <button onClick={() => setMostrarEmail(true)}
                className="w-full bg-black/60 border border-white/20 text-white font-semibold py-3 rounded-full text-sm">
                📧 Enviar consulta por email · €{experto.precio_email?.toFixed(2)}
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <button className="w-full bg-white/10 border border-white/20 text-white/60 font-semibold py-4 rounded-full cursor-not-allowed">
              ○ No disponible ahora
            </button>
            {experto.acepta_email && (
              <button onClick={() => setMostrarEmail(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-full text-sm">
                📧 Consulta por email · €{experto.precio_email?.toFixed(2)}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
