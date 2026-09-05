// src/pages/Perfil.tsx
// ============================================================
// UNIVERSE — Perfil de usuario
// Plan, consultas, datos personales, eliminar cuenta, legal
// ============================================================

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useUserPlan } from '../hooks/useUserPlan'

export default function Perfil() {
  const { plan, esPremium, consultasHoy, limiteConsultasDia, consultasRestantes, planFin, cargando } = useUserPlan()
  const [email, setEmail] = useState('')
  const [confirmandoEliminar, setConfirmandoEliminar] = useState(false)
  const [eliminando, setEliminando] = useState(false)
  const [msgEliminar, setMsgEliminar] = useState('')
  const [cerrandoSesion, setCerrandoSesion] = useState(false)

  const nombre = localStorage.getItem('nombre') || 'Viajero'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || ''
  const signo = localStorage.getItem('signo') || ''
  const elemento = localStorage.getItem('elemento') || ''
  const intencion = localStorage.getItem('intencion') || ''

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setEmail(user.email)
    })
  }, [])

  // ── Cerrar sesión ──────────────────────────────────────────
  const cerrarSesion = async () => {
    setCerrandoSesion(true)
    await supabase.auth.signOut()
    localStorage.clear()
    window.location.href = '/'
  }

  // ── Eliminar cuenta ────────────────────────────────────────
  const eliminarCuenta = async () => {
    setEliminando(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setMsgEliminar('No se encontró tu sesión.'); setEliminando(false); return }

      // 1. Borrar datos de perfil
      await supabase.from('profiles').delete().eq('id', user.id)

      // 2. Borrar analíticas del usuario
      await supabase.from('analytics_eventos').delete().eq('user_id', user.id)

      // 3. Cerrar sesión (la cuenta de auth se puede borrar desde Supabase admin o con función edge)
      await supabase.auth.signOut()

      // 4. Limpiar localStorage
      localStorage.clear()

      // Redirigir
      window.location.href = '/?cuenta=eliminada'
    } catch (err) {
      setMsgEliminar('Error al eliminar la cuenta. Escríbenos a esxdinero@gmail.com.')
      setEliminando(false)
    }
  }

  const porcentajeConsultas = Math.round((consultasHoy / limiteConsultasDia) * 100)

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/80" />

      {/* Header */}
      <div className="relative z-10 flex items-center px-4 py-4 border-b border-white/10">
        <button onClick={() => window.location.href = '/universo'} className="text-purple-300 text-sm">← Volver</button>
        <div className="flex-1 text-center">
          <p className="text-white font-semibold text-sm">Mi Perfil</p>
        </div>
        <div className="w-16" />
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-4 py-6 gap-5">

        {/* Avatar y nombre */}
        <div className="flex flex-col items-center gap-2 py-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl font-bold">
            {nombre.charAt(0).toUpperCase()}
          </div>
          <p className="text-white font-bold text-xl">{nombre}</p>
          {signo && <p className="text-purple-300 text-sm">{signo} · {elemento}</p>}
          {email && <p className="text-white/40 text-xs">{email}</p>}
        </div>

        {/* Plan actual */}
        <div className={`rounded-2xl p-4 border ${esPremium ? 'bg-amber-400/10 border-amber-400/30' : 'bg-white/8 border-white/20'}`}
          style={!esPremium ? { backgroundColor: 'rgba(255,255,255,0.08)' } : {}}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white font-semibold">
                {esPremium ? '✨ Plan Premium' : 'Plan Gratuito'}
              </p>
              {esPremium && planFin && (
                <p className="text-amber-300/70 text-xs mt-0.5">
                  Válido hasta {planFin.toLocaleDateString('es-ES')}
                </p>
              )}
            </div>
            {!esPremium && (
              <button
                onClick={() => window.location.href = '/premium'}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-full"
              >
                Mejorar
              </button>
            )}
          </div>

          {/* Barra de consultas */}
          {!cargando && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/50">Consultas hoy</span>
                <span className="text-white/70">{consultasHoy} / {limiteConsultasDia}</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, porcentajeConsultas)}%`,
                    backgroundColor: porcentajeConsultas > 80 ? '#f87171' : '#a78bfa',
                  }}
                />
              </div>
              <p className="text-white/30 text-xs mt-1">
                {consultasRestantes > 0
                  ? `${consultasRestantes} consultas restantes hoy`
                  : 'Límite diario alcanzado'}
              </p>
            </div>
          )}
        </div>

        {/* Datos espirituales */}
        {(fechaNacimiento || intencion) && (
          <div className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
            <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu perfil espiritual</p>
            <div className="flex flex-col gap-2">
              {fechaNacimiento && (
                <div className="flex justify-between">
                  <span className="text-white/50 text-sm">Nacimiento</span>
                  <span className="text-white text-sm">{fechaNacimiento}</span>
                </div>
              )}
              {signo && (
                <div className="flex justify-between">
                  <span className="text-white/50 text-sm">Signo solar</span>
                  <span className="text-white text-sm">{signo}</span>
                </div>
              )}
              {elemento && (
                <div className="flex justify-between">
                  <span className="text-white/50 text-sm">Elemento</span>
                  <span className="text-white text-sm">{elemento}</span>
                </div>
              )}
              {intencion && (
                <div className="flex justify-between">
                  <span className="text-white/50 text-sm">Intención</span>
                  <span className="text-white text-sm">{intencion}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex flex-col gap-3">

          <button
            onClick={() => window.location.href = '/diario'}
            className="w-full bg-white/8 border border-white/20 text-white text-sm font-semibold py-4 rounded-2xl text-left px-4 hover:bg-white/15 transition backdrop-blur"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
          >
            📖 Mi Diario Espiritual
          </button>

          <button
            onClick={() => window.location.href = '/carta-natal'}
            className="w-full bg-white/8 border border-white/20 text-white text-sm font-semibold py-4 rounded-2xl text-left px-4 hover:bg-white/15 transition backdrop-blur"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
          >
            🌌 Mi Carta Natal
          </button>

        </div>

        {/* Legal */}
        <div className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Legal y privacidad</p>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Aviso Legal', hash: 'aviso' },
              { label: 'Política de Privacidad', hash: 'privacidad' },
              { label: 'Política de Cookies', hash: 'cookies' },
              { label: 'Términos de Uso', hash: 'terminos' },
            ].map(l => (
              <button
                key={l.hash}
                onClick={() => window.location.href = `/legal#${l.hash}`}
                className="flex justify-between items-center text-sm py-1"
              >
                <span className="text-white/70">{l.label}</span>
                <span className="text-white/30">›</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cerrar sesión */}
        <button
          onClick={cerrarSesion}
          disabled={cerrandoSesion}
          className="w-full bg-white/10 border border-white/20 text-white/70 font-semibold py-4 rounded-2xl hover:bg-white/20 transition disabled:opacity-40"
        >
          {cerrandoSesion ? 'Cerrando sesión...' : 'Cerrar sesión'}
        </button>

        {/* Zona peligrosa — eliminar cuenta */}
        <div className="border border-red-500/20 rounded-2xl p-4">
          <p className="text-red-400 text-xs tracking-widest uppercase mb-3">⚠️ Zona peligrosa</p>

          {!confirmandoEliminar ? (
            <button
              onClick={() => setConfirmandoEliminar(true)}
              className="w-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold py-3 rounded-xl hover:bg-red-500/20 transition"
            >
              Eliminar mi cuenta
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="bg-red-500/10 rounded-xl p-3">
                <p className="text-red-300 text-sm font-semibold mb-1">¿Estás seguro?</p>
                <p className="text-white/50 text-xs leading-relaxed">
                  Esta acción es <strong className="text-white">permanente e irreversible</strong>. Se eliminarán tu cuenta, historial y datos de nuestros servidores. Los datos locales en tu dispositivo permanecerán hasta que limpies el navegador.
                </p>
              </div>

              {msgEliminar && (
                <p className="text-red-400 text-xs text-center">{msgEliminar}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => { setConfirmandoEliminar(false); setMsgEliminar('') }}
                  className="flex-1 bg-white/10 border border-white/20 text-white text-sm font-semibold py-3 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  onClick={eliminarCuenta}
                  disabled={eliminando}
                  className="flex-1 bg-red-500/80 text-white text-sm font-semibold py-3 rounded-xl hover:bg-red-500 transition disabled:opacity-40"
                >
                  {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
                </button>
              </div>
            </div>
          )}

          <p className="text-white/25 text-xs text-center mt-3">
            También puedes escribir a esxdinero@gmail.com para solicitar la eliminación de tus datos (RGPD Art. 17)
          </p>
        </div>

        <div className="h-4" />
      </div>
    </div>
  )
}
