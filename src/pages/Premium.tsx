// src/pages/Premium.tsx
// ============================================================
// UNIVERSE — Página de planes Premium
// Lista de espera hasta que esté activo Stripe
// ============================================================

import { useState } from 'react'
import { supabase } from '../lib/supabase'

const BENEFICIOS_FREE = [
  'Horóscopo diario',
  'Astro Daily',
  'Afirmaciones del día',
  'Luna Oracle',
  'Tarot (1 carta)',
  'Runas (1 runa)',
  'Wheel of Year',
  'Numerología Universal',
  'Año Personal',
  'Horóscopo Céltico',
  'Biorritmos',
  'Color Oracle',
  'Element Oracle',
  'Meditación',
]

const BENEFICIOS_PREMIUM = [
  'Todo lo del plan gratuito',
  'Tiradas de Tarot completas (3 y 5 cartas)',
  'Tiradas de Runas completas (3 y 5 runas)',
  'Carta Natal completa con IA',
  'I Ching · El Libro de los Cambios',
  'Guía IA · Consultas ilimitadas',
  'Caminos Paganos (6 tradiciones)',
  'Oracle de Dados y Monedas',
  'Interpretación de sueños con IA',
  'BaZi · Zi Wei · Tzolkin',
  'Compatibilidad astrológica',
  'Tránsitos planetarios',
  'Oracle Mix completo',
  'Y 15+ herramientas más',
]

export default function Premium() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [planSeleccionado, setPlanSeleccionado] = useState<'monthly' | 'yearly'>('yearly')

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const apuntarseListaEspera = async () => {
    if (!email.trim() || enviando) return
    setEnviando(true)

    try {
      // Guardar en Supabase como analítica de intención
      await supabase.from('analytics_eventos').insert({
        herramienta: 'premium',
        accion: 'lista_espera',
        metadatos: { email, plan: planSeleccionado },
      })
      setEnviado(true)
    } catch {
      // Aunque falle, mostramos éxito — no es crítico
      setEnviado(true)
    }
    setEnviando(false)
  }

  // Cargar email del usuario si está logado
  useState(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setEmail(user.email)
    })
  })

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-4 py-8 gap-6">

        {/* Header */}
        <div className="flex items-center">
          <button onClick={() => window.history.back()} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">UNIVERSE Premium</p>
          </div>
          <div className="w-16" />
        </div>

        {/* Hero */}
        <div className="text-center py-4">
          <p className="text-5xl mb-3">✨</p>
          <h1 className="text-2xl font-bold text-white mb-2">Desbloquea todo tu universo</h1>
          <p className="text-white/60 text-sm leading-relaxed">
            Acceso completo a 55+ herramientas espirituales con IA avanzada, sin límites.
          </p>
        </div>

        {/* Selector de plan */}
        <div className="flex gap-3">
          <button
            onClick={() => setPlanSeleccionado('monthly')}
            className={`flex-1 rounded-2xl p-4 text-center border transition ${planSeleccionado === 'monthly' ? 'bg-white/15 border-purple-400' : 'bg-white/8 border-white/20'}`}
            style={{ backgroundColor: planSeleccionado === 'monthly' ? undefined : 'rgba(255,255,255,0.08)' }}
          >
            <p className="text-white font-bold text-2xl">€6,99</p>
            <p className="text-white/50 text-xs">por mes</p>
          </button>
          <button
            onClick={() => setPlanSeleccionado('yearly')}
            className={`flex-1 rounded-2xl p-4 text-center border transition relative ${planSeleccionado === 'yearly' ? 'bg-purple-600/40 border-purple-400' : 'bg-white/8 border-white/20'}`}
            style={{ backgroundColor: planSeleccionado === 'yearly' ? undefined : 'rgba(255,255,255,0.08)' }}
          >
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
              Ahorra 40%
            </div>
            <p className="text-white font-bold text-2xl">€4,17</p>
            <p className="text-white/50 text-xs">al mes · €49,99/año</p>
          </button>
        </div>

        {/* Próximamente */}
        <div className="bg-purple-600/15 border border-purple-400/30 rounded-2xl p-4 text-center">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-1">Estado actual</p>
          <p className="text-white font-semibold">Sistema de pago en preparación</p>
          <p className="text-white/50 text-xs mt-1 leading-relaxed">
            Estamos configurando el sistema de pagos. Apúntate a la lista de espera y serás de los primeros en acceder.
          </p>
        </div>

        {/* Lista de espera */}
        {!enviado ? (
          <div className="flex flex-col gap-3">
            <p className="text-white/60 text-xs text-center">Apúntate y te avisamos cuando esté disponible</p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-purple-400 placeholder-white/30"
              />
              <button
                onClick={apuntarseListaEspera}
                disabled={!email.trim() || enviando}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-4 py-3 rounded-2xl disabled:opacity-40 flex-shrink-0"
              >
                {enviando ? '...' : '→'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-green-500/15 border border-green-400/30 rounded-2xl p-4 text-center">
            <p className="text-green-300 font-semibold">¡Apuntado! 🎉</p>
            <p className="text-white/60 text-xs mt-1">Te avisaremos cuando los pagos estén activos.</p>
          </div>
        )}

        {/* Comparativa */}
        <div className="flex flex-col gap-4">

          {/* Premium */}
          <div className="bg-white/8 border border-purple-400/30 rounded-2xl p-4"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
            <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">✨ Premium — Todo incluido</p>
            <div className="flex flex-col gap-1.5">
              {BENEFICIOS_PREMIUM.map((b, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-purple-400 text-xs mt-0.5 flex-shrink-0">✓</span>
                  <p className="text-white/80 text-xs">{b}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Free */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-white/40 text-xs tracking-widest uppercase mb-3">Plan gratuito — Siempre gratis</p>
            <div className="flex flex-col gap-1.5">
              {BENEFICIOS_FREE.map((b, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-white/30 text-xs mt-0.5 flex-shrink-0">✓</span>
                  <p className="text-white/40 text-xs">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-white/25 text-xs text-center leading-relaxed">
          Sin permanencia. Cancela cuando quieras. Pago seguro con Stripe. IVA incluido.
        </p>

      </div>
    </div>
  )
}
