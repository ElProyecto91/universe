// src/pages/PanelExperto.tsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import FiscalExperto from '../components/FiscalExperto'

interface Experto {
  id: string; slug: string; pin: string; nombre_artistico: string
  disponible: boolean; estado: string; nivel: string
  precio_minuto: number; precio_email: number; precio_webinar: number
  valoracion_media: number; total_valoraciones: number
  total_sesiones: number; total_minutos: number
  acepta_email: boolean; acepta_webinar: boolean
  total_regalos: number; total_favoritos: number
}

interface Sesion {
  id: string; estado: string; tipo: string
  duracion_minutos: number; importe_total: number
  importe_experto: number; created_at: string
}

interface Resena {
  id: string; valoracion: number; comentario: string; created_at: string
}

interface ConsultaEmail {
  id: string; pregunta: string; respuesta: string | null
  precio_eur: number; estado: string; created_at: string
}

interface Webinar {
  id: string; titulo: string; descripcion: string; fecha: string
  duracion_minutos: number; precio_eur: number
  max_participantes: number; participantes_actuales: number; estado: string
}

interface Regalo {
  id: string; emoji: string; nombre: string; valor_eur: number
  mensaje: string | null; created_at: string
}

const TABS = [
  { id: 'resumen',   label: '📊 Resumen' },
  { id: 'sesiones',  label: '💬 Sesiones' },
  { id: 'emails',    label: '📧 Emails' },
  { id: 'webinars',  label: '🎥 Webinars' },
  { id: 'resenas',   label: '⭐ Reseñas' },
  { id: 'regalos',   label: '🎁 Regalos' },
  { id: 'fiscal',    label: '🧾 Fiscal' },
  { id: 'ajustes',   label: '⚙️ Ajustes' },
]

const NIVELES: Record<string, { label: string; desc: string; requisito: string }> = {
  nuevo:      { label: '⭐ Nuevo',      desc: 'Recién incorporado',                    requisito: 'Automático al unirse' },
  verificado: { label: '✓ Verificado',  desc: 'Identidad y experiencia verificadas',   requisito: 'Verificación completada' },
  top:        { label: '🔥 Top',        desc: '+50 sesiones y valoración > 4.5',       requisito: '50 sesiones · 4.5★' },
  premium:    { label: '✨ Premium',    desc: '+200 sesiones y valoración > 4.7',      requisito: '200 sesiones · 4.7★' },
  diamant:    { label: '💎 Diamant',    desc: '+500 sesiones y valoración > 4.8',      requisito: '500 sesiones · 4.8★' },
}

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

// ── Componente edición de perfil ────────────────────────────
function EditarPerfil({ experto, onGuardado }: { experto: any; onGuardado: (datos: any) => void }) {
  const [abierto, setAbierto] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [form, setForm] = useState({
    nombre_artistico: experto.nombre_artistico ?? '',
    bio: experto.bio ?? '',
    foto_url: experto.foto_url ?? '',
    video_url: experto.video_url ?? '',
    idiomas: experto.idiomas?.join(', ') ?? 'Español',
    especialidades: experto.especialidades?.join(', ') ?? '',
    metodos: experto.metodos?.join(', ') ?? '',
    especialidad_tematica: experto.especialidad_tematica?.join(', ') ?? '',
  })

  const TEMATICAS_OPCIONES = [
    'Amor y relaciones', 'Trabajo y dinero', 'Camino de vida',
    'Decisiones difíciles', 'Energía personal', 'Camino espiritual',
    'Familia', 'Salud y bienestar',
  ]

  function toggleTematica(t: string) {
    const actual = form.especialidad_tematica ? form.especialidad_tematica.split(', ').filter(Boolean) : []
    const nueva = actual.includes(t) ? actual.filter(x => x !== t) : [...actual, t]
    setForm(f => ({ ...f, especialidad_tematica: nueva.join(', ') }))
  }

  async function guardar() {
    setGuardando(true)
    const datos = {
      nombre_artistico: form.nombre_artistico.trim(),
      bio: form.bio.trim(),
      foto_url: form.foto_url.trim() || null,
      video_url: form.video_url.trim() || null,
      idiomas: form.idiomas.split(',').map(s => s.trim()).filter(Boolean),
      especialidades: form.especialidades.split(',').map(s => s.trim()).filter(Boolean),
      metodos: form.metodos.split(',').map(s => s.trim()).filter(Boolean),
      especialidad_tematica: form.especialidad_tematica.split(',').map(s => s.trim()).filter(Boolean),
    }
    const { error } = await supabase.from('expertos').update(datos).eq('id', experto.id)
    if (!error) { onGuardado(datos); setAbierto(false) }
    setGuardando(false)
  }

  return (
    <div className="bg-[#0d0015] border border-white/15 rounded-2xl overflow-hidden">
      <button onClick={() => setAbierto(!abierto)}
        className="w-full p-4 flex items-center justify-between text-left">
        <div>
          <p className="text-purple-300 text-xs tracking-widest uppercase">✏️ Editar mi perfil</p>
          <p className="text-white/70 text-xs mt-0.5">Bio, foto, especialidades, temáticas...</p>
        </div>
        <span className="text-white/40 text-lg">{abierto ? '▲' : '▼'}</span>
      </button>

      {abierto && (
        <div className="px-4 pb-4 flex flex-col gap-4 border-t border-white/10 pt-4">

          <div>
            <p className="text-white/80 text-xs mb-1">Nombre artístico</p>
            <input value={form.nombre_artistico} onChange={e => setForm(f => ({ ...f, nombre_artistico: e.target.value }))}
              className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-purple-400" />
          </div>

          <div>
            <p className="text-white/80 text-xs mb-1">Bio pública</p>
            <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              rows={5} className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm resize-none outline-none focus:border-purple-400 leading-relaxed" />
            <p className="text-white/30 text-xs mt-0.5">{form.bio.length} caracteres</p>
          </div>

          <div>
            <p className="text-white/80 text-xs mb-1">URL de foto de perfil</p>
            <input value={form.foto_url} onChange={e => setForm(f => ({ ...f, foto_url: e.target.value }))}
              placeholder="https://..." className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-purple-400 placeholder-white/30" />
            <p className="text-white/30 text-xs mt-0.5">Sube tu foto a imgbb.com o similar y pega la URL</p>
          </div>

          <div>
            <p className="text-white/80 text-xs mb-1">URL de vídeo de presentación (opcional)</p>
            <input value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))}
              placeholder="https://..." className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-purple-400 placeholder-white/30" />
          </div>

          <div>
            <p className="text-white/80 text-xs mb-1">Especialidades <span className="text-white/40">(separadas por comas)</span></p>
            <input value={form.especialidades} onChange={e => setForm(f => ({ ...f, especialidades: e.target.value }))}
              placeholder="Tarot, Astrología, Runas..."
              className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-purple-400 placeholder-white/30" />
          </div>

          <div>
            <p className="text-white/80 text-xs mb-1">Métodos de lectura <span className="text-white/40">(separados por comas)</span></p>
            <input value={form.metodos} onChange={e => setForm(f => ({ ...f, metodos: e.target.value }))}
              placeholder="Tarot Rider-Waite, Cruz Celta..."
              className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-purple-400 placeholder-white/30" />
          </div>

          <div>
            <p className="text-white/80 text-xs mb-2">Puedo ayudarte con <span className="text-white/40">(selecciona las que apliquen)</span></p>
            <div className="flex flex-wrap gap-2">
              {TEMATICAS_OPCIONES.map(t => {
                const seleccionada = form.especialidad_tematica.includes(t)
                return (
                  <button key={t} onClick={() => toggleTematica(t)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition ${seleccionada ? 'bg-purple-600 border-purple-400 text-white' : 'bg-white/10 border-white/20 text-white/70'}`}>
                    {t}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <p className="text-white/80 text-xs mb-1">Idiomas <span className="text-white/40">(separados por comas)</span></p>
            <input value={form.idiomas} onChange={e => setForm(f => ({ ...f, idiomas: e.target.value }))}
              placeholder="Español, English..."
              className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-purple-400 placeholder-white/30" />
          </div>

          <button onClick={guardar} disabled={guardando || !form.nombre_artistico.trim() || !form.bio.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-full disabled:opacity-40">
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>

        </div>
      )}
    </div>
  )
}

export default function PanelExperto() {
  const [experto, setExperto] = useState<Experto | null>(null)
  const [sesiones, setSesiones] = useState<Sesion[]>([])
  const [resenas, setResenas] = useState<Resena[]>([])
  const [emails, setEmails] = useState<ConsultaEmail[]>([])
  const [webinars, setWebinars] = useState<Webinar[]>([])
  const [regalos, setRegalos] = useState<Regalo[]>([])
  const [tab, setTab] = useState('resumen')
  const [cargando, setCargando] = useState(true)
  const [noAutorizado, setNoAutorizado] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [msg, setMsg] = useState('')
  const [exportando, setExportando] = useState(false)
  const [anioFiscal, setAnioFiscal] = useState(new Date().getFullYear())

  // Webinar form
  const [mostrarFormWebinar, setMostrarFormWebinar] = useState(false)
  const [formWebinar, setFormWebinar] = useState({
    titulo: '', descripcion: '', fecha: '', duracion_minutos: '60',
    precio_eur: '', max_participantes: '20',
  })

  // Email respuesta
  const [emailRespondiendo, setEmailRespondiendo] = useState<string | null>(null)
  const [respuestaEmail, setRespuestaEmail] = useState('')

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover', backgroundPosition: 'center',
  }

  useEffect(() => { cargarDatos() }, [])

  async function cargarDatos() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/auth'; return }

    const { data: exp } = await supabase.from('expertos').select('*').eq('user_id', user.id).single()
    if (!exp) { setNoAutorizado(true); setCargando(false); return }
    setExperto(exp)

    const [
      { data: ses }, { data: rev }, { data: em },
      { data: web }, { data: reg }
    ] = await Promise.all([
      supabase.from('sesiones_experto').select('*').eq('experto_id', exp.id).eq('estado', 'completada').order('created_at', { ascending: false }).limit(100),
      supabase.from('resenas_experto').select('*').eq('experto_id', exp.id).order('created_at', { ascending: false }),
      supabase.from('consultas_email').select('*').eq('experto_id', exp.id).order('created_at', { ascending: false }),
      supabase.from('webinars_experto').select('*').eq('experto_id', exp.id).order('fecha', { ascending: false }),
      supabase.from('regalos_experto').select('*').eq('experto_id', exp.id).order('created_at', { ascending: false }),
    ])

    setSesiones(ses ?? [])
    setResenas(rev ?? [])
    setEmails(em ?? [])
    setWebinars(web ?? [])
    setRegalos(reg ?? [])
    setCargando(false)
  }

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  async function toggleDisponible() {
    if (!experto) return
    const nuevoEstado = experto.estado === 'online' ? 'offline' : 'online'
    await supabase.from('expertos').update({ disponible: nuevoEstado === 'online', estado: nuevoEstado }).eq('id', experto.id)
    setExperto({ ...experto, estado: nuevoEstado, disponible: nuevoEstado === 'online' })
    flash(nuevoEstado === 'online' ? '🟢 Ahora estás disponible' : '⚫ Ahora estás inactivo')
  }

  async function guardarPrecio(campo: string, valor: number) {
    if (!experto) return
    setGuardando(true)
    await supabase.from('expertos').update({ [campo]: valor }).eq('id', experto.id)
    setExperto({ ...experto, [campo]: valor })
    flash('✅ Precio actualizado')
    setGuardando(false)
  }

  async function toggleServicio(campo: string) {
    if (!experto) return
    const nuevoValor = !(experto as any)[campo]
    await supabase.from('expertos').update({ [campo]: nuevoValor }).eq('id', experto.id)
    setExperto({ ...experto, [campo]: nuevoValor })
    flash('✅ Actualizado')
  }

  async function crearWebinar() {
    if (!experto || !formWebinar.titulo || !formWebinar.fecha || !formWebinar.precio_eur) return
    setGuardando(true)
    const { error } = await supabase.from('webinars_experto').insert({
      experto_id: experto.id,
      titulo: formWebinar.titulo,
      descripcion: formWebinar.descripcion,
      fecha: formWebinar.fecha,
      duracion_minutos: parseInt(formWebinar.duracion_minutos),
      precio_eur: parseFloat(formWebinar.precio_eur),
      max_participantes: parseInt(formWebinar.max_participantes),
      estado: 'programado',
    })
    if (!error) {
      flash('✅ Webinar creado')
      setMostrarFormWebinar(false)
      setFormWebinar({ titulo: '', descripcion: '', fecha: '', duracion_minutos: '60', precio_eur: '', max_participantes: '20' })
      cargarDatos()
    } else flash('❌ Error al crear webinar')
    setGuardando(false)
  }

  async function cancelarWebinar(id: string) {
    await supabase.from('webinars_experto').update({ estado: 'cancelado' }).eq('id', id)
    setWebinars(prev => prev.map(w => w.id === id ? { ...w, estado: 'cancelado' } : w))
    flash('Webinar cancelado')
  }

  async function responderEmail(id: string) {
    if (!respuestaEmail.trim()) return
    setGuardando(true)
    await supabase.from('consultas_email').update({
      respuesta: respuestaEmail, estado: 'respondida',
      respondida_at: new Date().toISOString(),
    }).eq('id', id)
    setEmails(prev => prev.map(e => e.id === id ? { ...e, respuesta: respuestaEmail, estado: 'respondida' } : e))
    setEmailRespondiendo(null)
    setRespuestaEmail('')
    flash('✅ Respuesta enviada')
    setGuardando(false)
  }

  function descargarCSV(data: any[], nombre: string) {
    if (!data.length) return
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(r => Object.values(r).map(v => `"${v ?? ''}"`).join(','))
    const csv = [headers, ...rows].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${nombre}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  async function exportarSesiones() {
    setExportando(true)
    descargarCSV(sesiones.map(s => ({
      fecha: new Date(s.created_at).toLocaleDateString('es-ES'),
      tipo: s.tipo, duracion_min: s.duracion_minutos,
      importe_total: s.importe_total?.toFixed(2),
      ingreso_experto: s.importe_experto?.toFixed(2),
    })), `universe_sesiones_${anioFiscal}`)
    setExportando(false)
  }

  async function exportarInformeFiscal() {
    setExportando(true)
    const sesionesFiscal = sesiones.filter(s => new Date(s.created_at).getFullYear() === anioFiscal)
    const porMes = MESES.map((mes, i) => {
      const sesMes = sesionesFiscal.filter(s => new Date(s.created_at).getMonth() === i)
      const neto = sesMes.reduce((acc, s) => acc + (s.importe_experto ?? 0), 0)
      const bruto = neto / 0.7
      return { mes, sesiones: sesMes.length, ingreso_bruto: bruto.toFixed(2), ingreso_neto: neto.toFixed(2), comision_30pct: (bruto * 0.3).toFixed(2) }
    })
    descargarCSV(porMes, `universe_fiscal_${anioFiscal}`)
    setExportando(false)
  }

  function formatFecha(iso: string) {
    return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  // Stats
  const ingresosMes = sesiones.filter(s => new Date(s.created_at).getMonth() === new Date().getMonth()).reduce((acc, s) => acc + (s.importe_experto ?? 0), 0)
  const ingresosTotal = sesiones.reduce((acc, s) => acc + (s.importe_experto ?? 0), 0)
  const emailsPendientes = emails.filter(e => e.estado === 'pendiente').length
  const regalosTotalEur = regalos.reduce((acc, r) => acc + (r.valor_eur ?? 0), 0)
  const webinarsProgramados = webinars.filter(w => w.estado === 'programado').length

  if (noAutorizado) return (
    <div className="min-h-screen text-white flex items-center justify-center relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/95" />
      <div className="relative z-10 text-center px-6 flex flex-col items-center gap-4">
        <p className="text-5xl">🔒</p>
        <p className="text-white font-bold text-xl">No tienes perfil de experto</p>
        <button onClick={() => window.location.href = '/expertos/unirse'}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-6 py-3 rounded-full text-sm">
          Solicitar ser experto
        </button>
      </div>
    </div>
  )

  if (cargando || !experto) return (
    <div className="min-h-screen flex items-center justify-center relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/95" />
      <div className="relative z-10 flex gap-2">
        {[0,150,300].map(d => <div key={d} className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/95" />

      {/* Header */}
      <div className="relative z-10 flex items-center px-4 py-4 border-b border-white/10">
        <button onClick={() => window.location.href = '/universo'} className="text-purple-300 text-sm">← Inicio</button>
        <div className="flex-1 text-center">
          <p className="text-white font-bold text-sm">{experto.nombre_artistico}</p>
          <p className="text-purple-300 text-xs">PIN {experto.pin} · Panel del Experto</p>
        </div>
        <button onClick={toggleDisponible}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition ${experto.estado === 'online' ? 'bg-green-500/20 border-green-400/50 text-green-300' : 'bg-white/10 border-white/20 text-white/70'}`}>
          <div className={`w-2 h-2 rounded-full ${experto.estado === 'online' ? 'bg-green-400' : 'bg-white/30'}`} />
          {experto.estado === 'online' ? 'Activo' : 'Inactivo'}
        </button>
      </div>

      {/* Flash msg */}
      {msg && (
        <div className="relative z-10 mx-4 mt-3 bg-purple-600/30 border border-purple-400/40 rounded-2xl px-4 py-2 text-center text-sm text-white">
          {msg}
        </div>
      )}

      {/* Tabs */}
      <div className="relative z-10 flex gap-1 px-4 pt-4 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`whitespace-nowrap py-2 px-3 rounded-xl text-xs font-semibold transition flex-shrink-0 ${tab === t.id ? 'bg-purple-600 text-white' : 'bg-[#150020] text-white/70'}`}>
            {t.label}
            {t.id === 'emails' && emailsPendientes > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5">{emailsPendientes}</span>
            )}
          </button>
        ))}
      </div>

      <div className="relative z-10 flex-1 px-4 py-4 flex flex-col gap-4 pb-8">

        {/* ── RESUMEN ─────────────────────────────────────── */}
        {tab === 'resumen' && (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Ingresos este mes', val: `€${ingresosMes.toFixed(2)}`, icon: '💶', color: 'text-green-300' },
                { label: 'Ingresos totales', val: `€${ingresosTotal.toFixed(2)}`, icon: '📈', color: 'text-green-300' },
                { label: 'Sesiones completadas', val: experto.total_sesiones, icon: '💬', color: 'text-purple-300' },
                { label: 'Valoración media', val: `${experto.valoracion_media?.toFixed(1)} ★`, icon: '⭐', color: 'text-amber-300' },
                { label: 'Emails pendientes', val: emailsPendientes, icon: '📧', color: emailsPendientes > 0 ? 'text-red-300' : 'text-white' },
                { label: 'Webinars programados', val: webinarsProgramados, icon: '🎥', color: 'text-blue-300' },
                { label: 'Regalos recibidos', val: `€${regalosTotalEur.toFixed(2)}`, icon: '🎁', color: 'text-pink-300' },
                { label: 'Favoritos', val: experto.total_favoritos ?? 0, icon: '❤️', color: 'text-pink-300' },
              ].map((k, i) => (
                <div key={i} className="bg-[#0d0015] border border-white/15 rounded-2xl p-4">
                  <p className="text-xl mb-1">{k.icon}</p>
                  <p className={`text-2xl font-bold ${k.color}`}>{k.val}</p>
                  <p className="text-white/70 text-xs">{k.label}</p>
                </div>
              ))}
            </div>

            {/* Nivel actual y progresión */}
            <div className="bg-[#0d0015] border border-white/15 rounded-2xl p-4">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">🏆 Tu nivel</p>
              <div className="flex flex-col gap-2">
                {Object.entries(NIVELES).map(([key, cfg]) => (
                  <div key={key} className={`flex items-center justify-between p-2.5 rounded-xl border ${experto.nivel === key ? 'bg-purple-600/20 border-purple-400/40' : 'border-white/10'}`}>
                    <div>
                      <p className={`text-sm font-semibold ${experto.nivel === key ? 'text-white' : 'text-white/50'}`}>{cfg.label}</p>
                      <p className="text-white/40 text-xs">{cfg.requisito}</p>
                    </div>
                    {experto.nivel === key && <span className="text-purple-300 text-xs">← Actual</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Desglose ingresos */}
            <div className="bg-[#0d0015] border border-white/15 rounded-2xl p-4">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">💰 Distribución de ingresos</p>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Facturación bruta', val: `€${(ingresosTotal / 0.7).toFixed(2)}` },
                  { label: 'Comisión UNIVERSE 30%', val: `-€${(ingresosTotal / 0.7 * 0.3).toFixed(2)}`, neg: true },
                  { label: 'Comisión Stripe ~2%', val: `-€${(ingresosTotal / 0.7 * 0.02).toFixed(2)}`, neg: true },
                  { label: 'Tus ingresos netos', val: `€${ingresosTotal.toFixed(2)}`, bold: true },
                ].map((s, i) => (
                  <div key={i} className={`flex justify-between py-1.5 border-b border-white/8 last:border-0 ${s.bold ? 'pt-2' : ''}`}>
                    <p className={`text-sm ${s.bold ? 'text-white font-bold' : 'text-white/80'}`}>{s.label}</p>
                    <p className={`font-bold text-sm ${s.neg ? 'text-red-400' : s.bold ? 'text-green-300' : 'text-white'}`}>{s.val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Acceso rápido perfil público */}
            <button onClick={() => window.location.href = `/expertos/${experto.slug}`}
              className="w-full bg-[#0d0015] border border-white/15 rounded-2xl p-4 text-left flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-sm">Ver mi perfil público</p>
                <p className="text-white/60 text-xs">universe.app/expertos/{experto.slug}</p>
              </div>
              <span className="text-purple-300">›</span>
            </button>
          </>
        )}

        {/* ── SESIONES ────────────────────────────────────── */}
        {tab === 'sesiones' && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-white/70 text-xs">{sesiones.length} sesiones completadas</p>
              <button onClick={exportarSesiones} disabled={exportando}
                className="text-xs bg-purple-600/30 border border-purple-400/40 text-purple-300 px-3 py-1.5 rounded-full">
                {exportando ? '...' : '↓ CSV'}
              </button>
            </div>

            {/* Desglose mensual */}
            <div className="bg-[#0d0015] border border-white/15 rounded-2xl p-4">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">📊 Por mes ({new Date().getFullYear()})</p>
              {MESES.map((mes, i) => {
                const sesMes = sesiones.filter(s => new Date(s.created_at).getFullYear() === new Date().getFullYear() && new Date(s.created_at).getMonth() === i)
                const neto = sesMes.reduce((acc, s) => acc + (s.importe_experto ?? 0), 0)
                return (
                  <div key={mes} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
                    <span className="text-white/80 text-sm">{mes}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-white/50 text-xs">{sesMes.length} ses.</span>
                      <span className={`font-semibold text-sm ${neto > 0 ? 'text-green-300' : 'text-white/30'}`}>€{neto.toFixed(2)}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {sesiones.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">💬</p>
                <p className="text-white/70 text-sm">Aún no tienes sesiones completadas.</p>
              </div>
            ) : sesiones.slice(0, 30).map(s => (
              <div key={s.id} className="bg-[#0d0015] border border-white/15 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-semibold">{formatFecha(s.created_at)}</p>
                    <p className="text-white/60 text-xs">{s.duracion_minutos} min · {s.tipo === 'chat' ? '💬 Chat' : '📞 Llamada'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-300 font-bold text-sm">+€{s.importe_experto?.toFixed(2)}</p>
                    <p className="text-white/40 text-xs">de €{s.importe_total?.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── EMAILS ──────────────────────────────────────── */}
        {tab === 'emails' && (
          <>
            <div className="bg-[#0d0015] border border-white/15 rounded-2xl p-4">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">📧 Consultas por email</p>
              <p className="text-white/70 text-xs">Responde en máximo 3 días. Recibes €{(experto.precio_email * 0.7).toFixed(2)} por cada respuesta completada.</p>
            </div>

            {emails.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-white/70 text-sm">No tienes consultas de email aún.</p>
              </div>
            ) : emails.map(em => (
              <div key={em.id} className={`bg-[#0d0015] border rounded-2xl p-4 ${em.estado === 'pendiente' ? 'border-amber-400/40' : 'border-white/15'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${em.estado === 'pendiente' ? 'bg-amber-500/20 text-amber-300' : 'bg-green-500/20 text-green-300'}`}>
                    {em.estado === 'pendiente' ? '⏳ Pendiente' : '✅ Respondida'}
                  </span>
                  <p className="text-white/50 text-xs">{formatFecha(em.created_at)}</p>
                </div>
                <p className="text-white text-sm leading-relaxed mb-2">"{em.pregunta}"</p>
                {em.respuesta && (
                  <div className="bg-black/40 border border-white/10 rounded-xl p-3 mb-2">
                    <p className="text-white/60 text-xs mb-1">Tu respuesta:</p>
                    <p className="text-white text-xs leading-relaxed">{em.respuesta}</p>
                  </div>
                )}
                {em.estado === 'pendiente' && (
                  emailRespondiendo === em.id ? (
                    <div className="flex flex-col gap-2 mt-2">
                      <textarea value={respuestaEmail} onChange={e => setRespuestaEmail(e.target.value)}
                        placeholder="Escribe tu respuesta detallada..."
                        rows={5} className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-white text-sm resize-none outline-none placeholder-white/30" />
                      <div className="flex gap-2">
                        <button onClick={() => setEmailRespondiendo(null)}
                          className="flex-1 bg-white/10 border border-white/20 text-white text-sm py-2 rounded-xl">Cancelar</button>
                        <button onClick={() => responderEmail(em.id)} disabled={!respuestaEmail.trim() || guardando}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold py-2 rounded-xl disabled:opacity-40">
                          {guardando ? '...' : 'Enviar respuesta'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => { setEmailRespondiendo(em.id); setRespuestaEmail('') }}
                      className="w-full bg-purple-600/30 border border-purple-400/40 text-purple-300 text-sm font-semibold py-2.5 rounded-xl mt-1">
                      Responder · +€{(em.precio_eur * 0.7).toFixed(2)}
                    </button>
                  )
                )}
              </div>
            ))}
          </>
        )}

        {/* ── WEBINARS ────────────────────────────────────── */}
        {tab === 'webinars' && (
          <>
            <div className="bg-[#0d0015] border border-white/15 rounded-2xl p-4">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-1">🎥 Webinars grupales</p>
              <p className="text-white/70 text-xs">Sesiones en grupo. Hasta {20} participantes. Tú decides el precio y la fecha.</p>
            </div>

            <button onClick={() => setMostrarFormWebinar(!mostrarFormWebinar)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-full text-sm">
              {mostrarFormWebinar ? 'Cancelar' : '+ Crear nuevo webinar'}
            </button>

            {mostrarFormWebinar && (
              <div className="bg-[#0d0015] border border-purple-400/30 rounded-2xl p-4 flex flex-col gap-3">
                <p className="text-purple-300 text-xs tracking-widest uppercase">Nuevo webinar</p>
                {[
                  { label: 'Título', key: 'titulo', placeholder: 'Ej: Tarot para principiantes', type: 'text' },
                  { label: 'Descripción', key: 'descripcion', placeholder: 'Describe qué aprenderán...', type: 'text' },
                  { label: 'Fecha y hora', key: 'fecha', placeholder: '', type: 'datetime-local' },
                  { label: 'Duración (minutos)', key: 'duracion_minutos', placeholder: '60', type: 'number' },
                  { label: 'Precio por persona (€)', key: 'precio_eur', placeholder: '19.99', type: 'number' },
                  { label: 'Plazas máximas', key: 'max_participantes', placeholder: '20', type: 'number' },
                ].map(f => (
                  <div key={f.key}>
                    <p className="text-white/70 text-xs mb-1">{f.label}</p>
                    <input type={f.type} value={(formWebinar as any)[f.key]}
                      onChange={e => setFormWebinar(prev => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm outline-none placeholder-white/30" />
                  </div>
                ))}
                {formWebinar.precio_eur && (
                  <div className="bg-black/40 border border-white/10 rounded-xl p-3">
                    <p className="text-white/60 text-xs">Con {formWebinar.max_participantes} participantes a €{formWebinar.precio_eur} → recibes <strong className="text-green-300">€{(parseFloat(formWebinar.precio_eur || '0') * parseInt(formWebinar.max_participantes || '0') * 0.7).toFixed(2)}</strong></p>
                  </div>
                )}
                <button onClick={crearWebinar} disabled={guardando || !formWebinar.titulo || !formWebinar.fecha || !formWebinar.precio_eur}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-full disabled:opacity-40">
                  {guardando ? 'Creando...' : 'Crear webinar'}
                </button>
              </div>
            )}

            {webinars.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">🎥</p>
                <p className="text-white/70 text-sm">Aún no has creado ningún webinar.</p>
              </div>
            ) : webinars.map(w => (
              <div key={w.id} className={`bg-[#0d0015] border rounded-2xl p-4 ${w.estado === 'programado' ? 'border-purple-400/30' : 'border-white/10'}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-white font-semibold text-sm">{w.titulo}</p>
                    <p className="text-white/60 text-xs mt-0.5">{formatFecha(w.fecha)}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${w.estado === 'programado' ? 'bg-purple-500/20 text-purple-300' : w.estado === 'completado' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {w.estado}
                  </span>
                </div>
                {w.descripcion && <p className="text-white/60 text-xs mb-2">{w.descripcion}</p>}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-white/60">
                    <span>👥 {w.participantes_actuales}/{w.max_participantes}</span>
                    <span>⏱ {w.duracion_minutos} min</span>
                    <span className="text-green-300 font-semibold">€{w.precio_eur?.toFixed(2)}/persona</span>
                  </div>
                  {w.estado === 'programado' && (
                    <button onClick={() => cancelarWebinar(w.id)}
                      className="text-xs text-red-400 border border-red-400/30 px-2 py-1 rounded-lg">
                      Cancelar
                    </button>
                  )}
                </div>
                {w.estado === 'programado' && (
                  <div className="mt-2 bg-black/30 border border-white/10 rounded-xl p-2">
                    <p className="text-white/50 text-xs">Ingresos estimados (lleno): <strong className="text-green-300">€{(w.precio_eur * w.max_participantes * 0.7).toFixed(2)}</strong></p>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* ── RESEÑAS ─────────────────────────────────────── */}
        {tab === 'resenas' && (
          <>
            <div className="bg-[#0d0015] border border-white/15 rounded-2xl p-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-4xl font-bold text-amber-300">{experto.valoracion_media?.toFixed(1)}</p>
                  <div className="flex justify-center gap-0.5 mt-1">
                    {[1,2,3,4,5].map(i => <span key={i} className={`text-sm ${i <= Math.round(experto.valoracion_media) ? 'text-amber-400' : 'text-white/20'}`}>★</span>)}
                  </div>
                  <p className="text-white/60 text-xs mt-1">{experto.total_valoraciones} reseñas</p>
                </div>
                <div className="flex-1">
                  {[5,4,3,2,1].map(n => {
                    const count = resenas.filter(r => r.valoracion === n).length
                    const pct = resenas.length > 0 ? (count / resenas.length) * 100 : 0
                    return (
                      <div key={n} className="flex items-center gap-2 mb-1">
                        <span className="text-white/60 text-xs w-3">{n}</span>
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-white/40 text-xs w-4">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {resenas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">⭐</p>
                <p className="text-white/70 text-sm">Completa sesiones para recibir reseñas.</p>
              </div>
            ) : resenas.map(r => (
              <div key={r.id} className="bg-[#0d0015] border border-white/15 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => <span key={i} className={`text-sm ${i <= r.valoracion ? 'text-amber-400' : 'text-white/20'}`}>★</span>)}
                  </div>
                  <p className="text-white/50 text-xs">{formatFecha(r.created_at)}</p>
                </div>
                {r.comentario && <p className="text-white text-sm leading-relaxed">"{r.comentario}"</p>}
              </div>
            ))}
          </>
        )}

        {/* ── REGALOS ─────────────────────────────────────── */}
        {tab === 'regalos' && (
          <>
            <div className="bg-[#0d0015] border border-white/15 rounded-2xl p-4">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">🎁 Regalos recibidos</p>
              <div className="flex justify-between">
                <div>
                  <p className="text-2xl font-bold text-pink-300">€{regalosTotalEur.toFixed(2)}</p>
                  <p className="text-white/60 text-xs">Total recibido ({regalos.length} regalos)</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-300">€{(regalosTotalEur * 0.7).toFixed(2)}</p>
                  <p className="text-white/60 text-xs">Tus ingresos (70%)</p>
                </div>
              </div>
            </div>

            {regalos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">🎁</p>
                <p className="text-white/70 text-sm">Aún no has recibido regalos.</p>
              </div>
            ) : regalos.map(r => (
              <div key={r.id} className="bg-[#0d0015] border border-white/15 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{r.emoji}</span>
                    <div>
                      <p className="text-white font-semibold text-sm">{r.nombre}</p>
                      {r.mensaje && <p className="text-white/60 text-xs mt-0.5">"{r.mensaje}"</p>}
                      <p className="text-white/40 text-xs">{formatFecha(r.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-pink-300 font-bold text-sm">€{r.valor_eur?.toFixed(2)}</p>
                    <p className="text-green-300 text-xs">+€{(r.valor_eur * 0.7).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── FISCAL ──────────────────────────────────────── */}
        {tab === 'fiscal' && (
          <>
            <div className="bg-[#0d0015] border border-white/15 rounded-2xl p-4">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">📅 Exportar datos fiscales</p>
              <div className="flex gap-2 mb-3">
                {[new Date().getFullYear() - 1, new Date().getFullYear()].map(anio => (
                  <button key={anio} onClick={() => setAnioFiscal(anio)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition ${anioFiscal === anio ? 'bg-purple-600 border-purple-400 text-white' : 'bg-white/10 border-white/20 text-white/70'}`}>
                    {anio}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={exportarSesiones} disabled={exportando}
                  className="w-full bg-white/10 border border-white/20 text-white font-semibold py-3 rounded-xl text-sm disabled:opacity-40">
                  {exportando ? '...' : '↓ Exportar sesiones (CSV)'}
                </button>
                <button onClick={exportarInformeFiscal} disabled={exportando}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl text-sm disabled:opacity-40">
                  {exportando ? '...' : `↓ Informe fiscal ${anioFiscal} (CSV)`}
                </button>
              </div>
            </div>
            <FiscalExperto anioFiscal={anioFiscal} sesiones={sesiones} />
          </>
        )}

        {/* ── AJUSTES ─────────────────────────────────────── */}
        {tab === 'ajustes' && (
          <>
            {/* Precio por minuto */}
            <div className="bg-[#0d0015] border border-white/15 rounded-2xl p-4">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">💶 Precio por minuto</p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {['0.99','1.99','2.50','3.50','4.50','5.50','7.00','9.00','9.99'].map(p => (
                  <button key={p} onClick={() => guardarPrecio('precio_minuto', parseFloat(p))} disabled={guardando}
                    className={`py-3 rounded-xl text-sm font-semibold border transition ${experto.precio_minuto === parseFloat(p) ? 'bg-purple-600 border-purple-400 text-white' : 'bg-white/10 border-white/20 text-white/80'}`}>
                    €{p}
                  </button>
                ))}
              </div>
              <div className="bg-black/40 border border-white/10 rounded-xl p-3">
                <p className="text-white/70 text-xs">Con €{experto.precio_minuto?.toFixed(2)}/min → recibes <strong className="text-green-300">€{(experto.precio_minuto * 0.7).toFixed(2)}/min</strong> · Sesión 30 min = <strong className="text-green-300">€{(experto.precio_minuto * 0.7 * 30).toFixed(0)}</strong></p>
              </div>
            </div>

            {/* Servicios disponibles */}
            <div className="bg-[#0d0015] border border-white/15 rounded-2xl p-4">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">🛎️ Servicios activos</p>
              {[
                { campo: 'acepta_email', label: '📧 Consultas por email', precioCampo: 'precio_email', precios: ['4.99','9.99','14.99','19.99','29.99'] },
                { campo: 'acepta_webinar', label: '🎥 Webinars grupales', precioCampo: 'precio_webinar', precios: ['9.99','19.99','29.99','49.99'] },
              ].map(s => (
                <div key={s.campo} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-semibold text-sm">{s.label}</p>
                    <button onClick={() => toggleServicio(s.campo)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${(experto as any)[s.campo] ? 'bg-green-500' : 'bg-white/20'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${(experto as any)[s.campo] ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  {(experto as any)[s.campo] && (
                    <div className="flex gap-2 flex-wrap">
                      {s.precios.map(p => (
                        <button key={p} onClick={() => guardarPrecio(s.precioCampo, parseFloat(p))} disabled={guardando}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${(experto as any)[s.precioCampo] === parseFloat(p) ? 'bg-purple-600 border-purple-400 text-white' : 'bg-white/10 border-white/20 text-white/70'}`}>
                          €{p}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Disponibilidad */}
            <div className="bg-[#0d0015] border border-white/15 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">Estado actual</p>
                  <p className="text-white/70 text-xs mt-0.5">{experto.estado === 'online' ? 'Recibes sesiones' : 'No recibes sesiones'}</p>
                </div>
                <button onClick={toggleDisponible}
                  className={`w-14 h-7 rounded-full transition-colors relative ${experto.estado === 'online' ? 'bg-green-500' : 'bg-white/20'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${experto.estado === 'online' ? 'left-8' : 'left-1'}`} />
                </button>
              </div>
            </div>

            {/* Editar perfil */}
            <EditarPerfil experto={experto} onGuardado={(datos) => { setExperto({ ...experto, ...datos }); flash('✅ Perfil actualizado') }} />

            {/* Soporte */}
            <div className="bg-[#0d0015] border border-white/15 rounded-2xl p-4">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">🆘 Soporte</p>
              <p className="text-white/70 text-xs mb-3">¿Problemas con sesiones, pagos o tu perfil? Te respondemos en menos de 24h.</p>
              <button onClick={() => window.location.href = `mailto:esxdinero@gmail.com?subject=Soporte Experto - ${experto.nombre_artistico} PIN ${experto.pin}`}
                className="w-full bg-white/10 border border-white/20 text-white font-semibold py-3 rounded-xl text-sm">
                Contactar soporte →
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
