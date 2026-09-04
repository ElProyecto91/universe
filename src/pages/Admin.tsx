// src/pages/Admin.tsx
// ============================================================
// UNIVERSE — Panel de administración
// Acceso restringido: solo esxdinero@gmail.com
// ============================================================

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const ADMIN_EMAIL = 'esxdinero@gmail.com'

// ── Tipos ────────────────────────────────────────────────────
interface ResumenGeneral {
  totalUsuarios: number
  usuariosPremium: number
  consultasHoy: number
  gastoHoy: number
  gastoMes: number
  cacheHits: number
  cacheMisses: number
}

interface HerramientaRanking {
  herramienta: string
  total: number
  usuarios_unicos: number
}

interface UsoPorHora {
  hora: number
  total: number
}

interface ConfigIA {
  kill_switch: boolean
  presupuesto_diario: number
  presupuesto_mensual: number
}

interface Usuario {
  id: string
  email: string
  plan: string
  created_at: string
  consultas_hoy: number
}

// ── Componente principal ─────────────────────────────────────
export default function Admin() {
  const [autorizado, setAutorizado] = useState<boolean | null>(null)
  const [tab, setTab] = useState<'general' | 'analiticas' | 'ia' | 'usuarios'>('general')
  const [cargando, setCargando] = useState(true)

  // Datos
  const [resumen, setResumen] = useState<ResumenGeneral | null>(null)
  const [ranking, setRanking] = useState<HerramientaRanking[]>([])
  const [usoPorHora, setUsoPorHora] = useState<UsoPorHora[]>([])
  const [configIA, setConfigIA] = useState<ConfigIA | null>(null)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [busquedaUsuario, setBusquedaUsuario] = useState('')
  const [exportando, setExportando] = useState(false)
  const [guardandoConfig, setGuardandoConfig] = useState(false)
  const [msg, setMsg] = useState('')

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  // ── Verificar acceso ───────────────────────────────────────
  useEffect(() => {
    async function verificar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email === ADMIN_EMAIL) {
        setAutorizado(true)
        cargarTodo()
      } else {
        setAutorizado(false)
        setCargando(false)
      }
    }
    verificar()
  }, [])

  // ── Cargar todos los datos ─────────────────────────────────
  async function cargarTodo() {
    setCargando(true)
    await Promise.all([
      cargarResumen(),
      cargarRanking(),
      cargarUsoPorHora(),
      cargarConfigIA(),
      cargarUsuarios(),
    ])
    setCargando(false)
  }

  async function cargarResumen() {
    try {
      // Usuarios totales y premium
      const { count: totalUsuarios } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      const { count: usuariosPremium } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('plan', 'premium')

      // Consultas hoy
      const hoy = new Date().toISOString().split('T')[0]
      const { count: consultasHoy } = await supabase
        .from('analytics_eventos')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', hoy)

      // Gasto IA
      const { data: gastoHoyData } = await supabase
        .from('ai_gasto_hoy')
        .select('*')
        .maybeSingle()

      const { data: gastoMesData } = await supabase
        .from('ai_gasto_mes')
        .select('*')
        .maybeSingle()

      // Cache hits/misses
      const { count: cacheHits } = await supabase
        .from('analytics_eventos')
        .select('*', { count: 'exact', head: true })
        .eq('desde_cache', true)
        .gte('created_at', hoy)

      const { count: cacheMisses } = await supabase
        .from('analytics_eventos')
        .select('*', { count: 'exact', head: true })
        .eq('desde_cache', false)
        .gte('created_at', hoy)

      setResumen({
        totalUsuarios: totalUsuarios ?? 0,
        usuariosPremium: usuariosPremium ?? 0,
        consultasHoy: consultasHoy ?? 0,
        gastoHoy: gastoHoyData?.total_eur ?? 0,
        gastoMes: gastoMesData?.total_eur ?? 0,
        cacheHits: cacheHits ?? 0,
        cacheMisses: cacheMisses ?? 0,
      })
    } catch (err) {
      console.error('[Admin] Error resumen:', err)
    }
  }

  async function cargarRanking() {
    try {
      const { data } = await supabase
        .from('v_herramientas_ranking')
        .select('*')
        .limit(15)
      setRanking(data ?? [])
    } catch (err) {
      console.error('[Admin] Error ranking:', err)
    }
  }

  async function cargarUsoPorHora() {
    try {
      const { data } = await supabase
        .from('v_uso_por_hora')
        .select('*')
        .order('hora')
      setUsoPorHora(data ?? [])
    } catch (err) {
      console.error('[Admin] Error uso por hora:', err)
    }
  }

  async function cargarConfigIA() {
    try {
      const { data } = await supabase
        .from('ai_config')
        .select('*')
        .maybeSingle()
      if (data) setConfigIA(data)
    } catch (err) {
      console.error('[Admin] Error config IA:', err)
    }
  }

  async function cargarUsuarios() {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, email, plan, created_at, consultas_hoy')
        .order('created_at', { ascending: false })
        .limit(100)
      setUsuarios(data ?? [])
    } catch (err) {
      console.error('[Admin] Error usuarios:', err)
    }
  }

  // ── Kill switch ────────────────────────────────────────────
  async function toggleKillSwitch() {
    if (!configIA) return
    setGuardandoConfig(true)
    const nuevoValor = !configIA.kill_switch
    const { error } = await supabase
      .from('ai_config')
      .update({ kill_switch: nuevoValor })
      .eq('id', 1)

    if (!error) {
      setConfigIA({ ...configIA, kill_switch: nuevoValor })
      setMsg(nuevoValor ? '🔴 IA desactivada' : '🟢 IA activada')
    }
    setGuardandoConfig(false)
    setTimeout(() => setMsg(''), 3000)
  }

  async function guardarPresupuestos() {
    if (!configIA) return
    setGuardandoConfig(true)
    const { error } = await supabase
      .from('ai_config')
      .update({
        presupuesto_diario: configIA.presupuesto_diario,
        presupuesto_mensual: configIA.presupuesto_mensual,
      })
      .eq('id', 1)

    setMsg(error ? '❌ Error al guardar' : '✅ Presupuestos guardados')
    setGuardandoConfig(false)
    setTimeout(() => setMsg(''), 3000)
  }

  // ── Gestión usuarios ───────────────────────────────────────
  async function cambiarPlan(userId: string, nuevoPlan: 'free' | 'premium') {
    const planFin = nuevoPlan === 'premium'
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      : null

    const { error } = await supabase
      .from('profiles')
      .update({ plan: nuevoPlan, plan_fin: planFin })
      .eq('id', userId)

    if (!error) {
      setUsuarios(prev => prev.map(u => u.id === userId ? { ...u, plan: nuevoPlan } : u))
      setMsg(`✅ Plan actualizado a ${nuevoPlan}`)
    } else {
      setMsg('❌ Error al actualizar plan')
    }
    setTimeout(() => setMsg(''), 3000)
  }

  // ── Exportar CSV ───────────────────────────────────────────
  async function exportarCSV(tipo: 'usuarios' | 'eventos' | 'ia') {
    setExportando(true)
    try {
      let data: any[] = []
      let nombre = ''

      if (tipo === 'usuarios') {
        const { data: d } = await supabase
          .from('profiles')
          .select('id, email, plan, created_at, consultas_hoy, plan_inicio, plan_fin')
          .order('created_at', { ascending: false })
        data = d ?? []
        nombre = 'usuarios'
      } else if (tipo === 'eventos') {
        const { data: d } = await supabase
          .from('analytics_eventos')
          .select('herramienta, accion, created_at, desde_cache, tiempo_respuesta_ms, signo, dispositivo, pais')
          .order('created_at', { ascending: false })
          .limit(5000)
        data = d ?? []
        nombre = 'eventos'
      } else if (tipo === 'ia') {
        const { data: d } = await supabase
          .from('ai_usage')
          .select('herramienta, modelo, tokens_entrada, tokens_salida, coste_eur, created_at')
          .order('created_at', { ascending: false })
          .limit(5000)
        data = d ?? []
        nombre = 'costes_ia'
      }

      if (data.length === 0) { setMsg('Sin datos para exportar'); setExportando(false); return }

      const headers = Object.keys(data[0]).join(',')
      const rows = data.map(r => Object.values(r).map(v => `"${v ?? ''}"`).join(','))
      const csv = [headers, ...rows].join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `universe_${nombre}_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      setMsg('✅ CSV descargado')
    } catch (err) {
      setMsg('❌ Error al exportar')
    }
    setExportando(false)
    setTimeout(() => setMsg(''), 3000)
  }

  // ── Render: no autorizado ──────────────────────────────────
  if (autorizado === false) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center relative" style={bgStyle}>
        <div className="absolute inset-0 bg-black/85" />
        <div className="relative z-10 text-center px-6">
          <p className="text-5xl mb-4">🔒</p>
          <p className="text-white font-bold text-xl mb-2">Acceso restringido</p>
          <p className="text-white/50 text-sm">Esta sección es solo para administradores.</p>
          <button onClick={() => window.location.href = '/universo'} className="mt-6 text-purple-300 text-sm">← Volver</button>
        </div>
      </div>
    )
  }

  // ── Render: cargando ───────────────────────────────────────
  if (autorizado === null || cargando) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center relative" style={bgStyle}>
        <div className="absolute inset-0 bg-black/85" />
        <div className="relative z-10 flex gap-2">
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    )
  }

  const usuariosFiltrados = usuarios.filter(u =>
    !busquedaUsuario || u.email?.toLowerCase().includes(busquedaUsuario.toLowerCase())
  )

  const cacheRatio = resumen
    ? resumen.cacheHits + resumen.cacheMisses > 0
      ? Math.round((resumen.cacheHits / (resumen.cacheHits + resumen.cacheMisses)) * 100)
      : 0
    : 0

  const maxRanking = ranking[0]?.total ?? 1

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/85" />

      {/* Header */}
      <div className="relative z-10 flex items-center px-4 py-4 border-b border-white/10 backdrop-blur">
        <button onClick={() => window.location.href = '/universo'} className="text-purple-300 text-sm">← Volver</button>
        <div className="flex-1 text-center">
          <p className="text-white font-bold text-sm">⚙️ Admin · UNIVERSE</p>
          <p className="text-purple-300 text-xs">Panel de control</p>
        </div>
        <button onClick={cargarTodo} className="text-purple-300 text-xs border border-purple-500/30 rounded-full px-3 py-1">↺ Actualizar</button>
      </div>

      {/* Mensaje flash */}
      {msg && (
        <div className="relative z-10 mx-4 mt-3 bg-white/10 border border-white/20 rounded-2xl px-4 py-2 text-center text-sm text-white">
          {msg}
        </div>
      )}

      {/* Tabs */}
      <div className="relative z-10 flex gap-1 px-4 pt-4 pb-0">
        {[
          { id: 'general', label: '📊 General' },
          { id: 'analiticas', label: '📈 Analíticas' },
          { id: 'ia', label: '🤖 IA' },
          { id: 'usuarios', label: '👥 Usuarios' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${tab === t.id ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">

        {/* ── TAB: GENERAL ───────────────────────────────── */}
        {tab === 'general' && resumen && (
          <>
            {/* KPIs principales */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Usuarios totales', val: resumen.totalUsuarios, icon: '👤', color: 'text-white' },
                { label: 'Usuarios premium', val: resumen.usuariosPremium, icon: '✨', color: 'text-amber-300' },
                { label: 'Consultas hoy', val: resumen.consultasHoy, icon: '💬', color: 'text-purple-300' },
                { label: 'Cache ratio hoy', val: `${cacheRatio}%`, icon: '⚡', color: 'text-green-300' },
              ].map((k, i) => (
                <div key={i} className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                  <p className="text-xl mb-1">{k.icon}</p>
                  <p className={`text-2xl font-bold ${k.color}`}>{k.val}</p>
                  <p className="text-white/40 text-xs">{k.label}</p>
                </div>
              ))}
            </div>

            {/* Costes IA */}
            <div className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">💶 Costes IA</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-2xl font-bold text-white">€{resumen.gastoHoy.toFixed(4)}</p>
                  <p className="text-white/40 text-xs">Hoy</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">€{resumen.gastoMes.toFixed(4)}</p>
                  <p className="text-white/40 text-xs">Este mes</p>
                </div>
              </div>
              {configIA && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Límite diario: €{configIA.presupuesto_diario}</span>
                    <span className={resumen.gastoHoy > configIA.presupuesto_diario * 0.8 ? 'text-red-400' : 'text-green-400'}>
                      {Math.round((resumen.gastoHoy / configIA.presupuesto_diario) * 100)}% usado
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (resumen.gastoHoy / configIA.presupuesto_diario) * 100)}%`,
                        backgroundColor: resumen.gastoHoy > configIA.presupuesto_diario * 0.8 ? '#f87171' : '#a78bfa',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Cache hits */}
            <div className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">⚡ Caché hoy</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xl font-bold text-green-300">{resumen.cacheHits}</p>
                  <p className="text-white/40 text-xs">Hits (€0)</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-amber-300">{resumen.cacheMisses}</p>
                  <p className="text-white/40 text-xs">Misses (con coste)</p>
                </div>
              </div>
            </div>

            {/* Exportar */}
            <div className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">📥 Exportar CSV</p>
              <div className="flex flex-col gap-2">
                {[
                  { tipo: 'usuarios' as const, label: 'Usuarios (para asesoría)' },
                  { tipo: 'eventos' as const, label: 'Eventos analíticos' },
                  { tipo: 'ia' as const, label: 'Costes IA (para Hacienda)' },
                ].map(e => (
                  <button key={e.tipo} onClick={() => exportarCSV(e.tipo)} disabled={exportando}
                    className="w-full bg-white/10 border border-white/20 text-white text-sm py-3 rounded-xl hover:bg-white/20 transition disabled:opacity-40 text-left px-4">
                    {exportando ? '⏳ Exportando...' : `↓ ${e.label}`}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── TAB: ANALÍTICAS ────────────────────────────── */}
        {tab === 'analiticas' && (
          <>
            {/* Ranking herramientas */}
            <div className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">🏆 Top herramientas</p>
              {ranking.length === 0 ? (
                <p className="text-white/40 text-sm text-center py-4">Sin datos aún</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {ranking.map((r, i) => (
                    <div key={r.herramienta}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white/30 text-xs w-4">{i + 1}</span>
                          <span className="text-white text-sm">{r.herramienta}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white/40 text-xs">{r.usuarios_unicos}u</span>
                          <span className="text-white font-semibold text-sm">{r.total}</span>
                        </div>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(r.total / maxRanking) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Uso por hora */}
            <div className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">🕐 Uso por hora</p>
              {usoPorHora.length === 0 ? (
                <p className="text-white/40 text-sm text-center py-4">Sin datos aún</p>
              ) : (
                <div className="flex items-end gap-1 h-20">
                  {Array.from({ length: 24 }, (_, h) => {
                    const dato = usoPorHora.find(u => u.hora === h)
                    const max = Math.max(...usoPorHora.map(u => u.total), 1)
                    const altura = dato ? Math.max(4, (dato.total / max) * 100) : 4
                    return (
                      <div key={h} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t"
                          style={{ height: `${altura}%`, backgroundColor: dato ? 'rgba(167,139,250,0.7)' : 'rgba(255,255,255,0.1)' }}
                        />
                        {h % 6 === 0 && <span className="text-white/20 text-xs">{h}h</span>}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Nota sobre más vistas */}
            <div className="bg-purple-600/10 border border-purple-500/20 rounded-2xl p-4 backdrop-blur">
              <p className="text-purple-300 text-xs">💡 Tienes 14 vistas SQL en Supabase: país, dispositivo, signo, edad, paywalls, satisfacción, retención... Consúltalas directamente en el dashboard de Supabase para análisis detallados.</p>
            </div>
          </>
        )}

        {/* ── TAB: IA ────────────────────────────────────── */}
        {tab === 'ia' && configIA && (
          <>
            {/* Kill switch */}
            <div className="bg-white/8 border border-white/20 rounded-2xl p-5 backdrop-blur" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">Kill Switch IA</p>
                  <p className="text-white/40 text-xs mt-0.5">
                    {configIA.kill_switch ? '🔴 IA desactivada globalmente' : '🟢 IA activa'}
                  </p>
                </div>
                <button
                  onClick={toggleKillSwitch}
                  disabled={guardandoConfig}
                  className={`w-14 h-7 rounded-full transition-colors relative ${configIA.kill_switch ? 'bg-red-500' : 'bg-green-500'} disabled:opacity-40`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${configIA.kill_switch ? 'left-1' : 'left-8'}`} />
                </button>
              </div>
              {configIA.kill_switch && (
                <div className="mt-3 bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                  <p className="text-red-400 text-xs">⚠️ La IA está desactivada. Todas las llamadas a Gemini fallarán hasta que la reactives.</p>
                </div>
              )}
            </div>

            {/* Presupuestos */}
            <div className="bg-white/8 border border-white/20 rounded-2xl p-5 backdrop-blur" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-4">💶 Límites de presupuesto</p>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Límite diario (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={configIA.presupuesto_diario}
                    onChange={e => setConfigIA({ ...configIA, presupuesto_diario: parseFloat(e.target.value) })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Límite mensual (€)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={configIA.presupuesto_mensual}
                    onChange={e => setConfigIA({ ...configIA, presupuesto_mensual: parseFloat(e.target.value) })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-purple-400"
                  />
                </div>
                <button
                  onClick={guardarPresupuestos}
                  disabled={guardandoConfig}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-full disabled:opacity-40"
                >
                  {guardandoConfig ? 'Guardando...' : 'Guardar límites'}
                </button>
              </div>
            </div>

            {/* Info modelos */}
            <div className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">🤖 Modelos activos</p>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-white text-sm">gemini-3.5-flash</span>
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">Flash · Principal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white text-sm">gemini-2.0-flash-lite</span>
                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">Lite · Económico</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── TAB: USUARIOS ──────────────────────────────── */}
        {tab === 'usuarios' && (
          <>
            <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 flex items-center gap-2">
              <span className="text-white/40">🔍</span>
              <input
                value={busquedaUsuario}
                onChange={e => setBusquedaUsuario(e.target.value)}
                placeholder="Buscar por email..."
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder-white/30"
              />
            </div>

            <p className="text-white/40 text-xs">{usuariosFiltrados.length} usuarios</p>

            {usuariosFiltrados.map(u => (
              <div key={u.id} className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{u.email || 'Sin email'}</p>
                    <p className="text-white/40 text-xs mt-0.5">
                      {new Date(u.created_at).toLocaleDateString('es-ES')} · {u.consultas_hoy ?? 0} consultas hoy
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${u.plan === 'premium' ? 'bg-amber-400/20 text-amber-300' : 'bg-white/10 text-white/40'}`}>
                    {u.plan === 'premium' ? '✨ Premium' : 'Free'}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  {u.plan !== 'premium' ? (
                    <button
                      onClick={() => cambiarPlan(u.id, 'premium')}
                      className="flex-1 bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs py-2 rounded-xl hover:bg-amber-400/30 transition"
                    >
                      → Premium (30d)
                    </button>
                  ) : (
                    <button
                      onClick={() => cambiarPlan(u.id, 'free')}
                      className="flex-1 bg-white/10 border border-white/20 text-white/60 text-xs py-2 rounded-xl hover:bg-white/20 transition"
                    >
                      → Bajar a Free
                    </button>
                  )}
                </div>
              </div>
            ))}

            {usuariosFiltrados.length === 0 && (
              <p className="text-white/40 text-sm text-center py-8">No se encontraron usuarios</p>
            )}
          </>
        )}

      </div>
    </div>
  )
}
