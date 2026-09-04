// src/hooks/useUserPlan.ts
// ============================================================
// UNIVERSE — Hook de plan del usuario
// Lee el plan desde Supabase profiles y expone helpers
// ============================================================

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface UserPlan {
  plan: 'free' | 'premium'
  esPremium: boolean
  planFin: Date | null
  consultasHoy: number
  limiteConsultasDia: number
  consultasRestantes: number
  puedeConsultar: boolean
  stripeCustomerId: string | null
  userId: string | null
  cargando: boolean
}

const LIMITE_FREE = 5
const LIMITE_PREMIUM = 200

export function useUserPlan(): UserPlan {
  const [plan, setPlan] = useState<'free' | 'premium'>('free')
  const [planFin, setPlanFin] = useState<Date | null>(null)
  const [consultasHoy, setConsultasHoy] = useState(0)
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function cargar() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || cancelled) { setCargando(false); return }

        setUserId(user.id)

        const { data: profile } = await supabase
          .from('profiles')
          .select('plan, plan_fin, consultas_hoy, consultas_hoy_fecha, stripe_customer_id')
          .eq('id', user.id)
          .single()

        if (!profile || cancelled) { setCargando(false); return }

        // Verificar si el plan premium ha expirado
        const finDate = profile.plan_fin ? new Date(profile.plan_fin) : null
        const planActivo = profile.plan === 'premium' && finDate && finDate > new Date()
          ? 'premium'
          : 'free'

        // Si expiró, actualizar en Supabase
        if (profile.plan === 'premium' && planActivo === 'free') {
          supabase.from('profiles').update({ plan: 'free', plan_fin: null }).eq('id', user.id).then(() => {})
        }

        if (!cancelled) {
          setPlan(planActivo)
          setPlanFin(finDate)
          setConsultasHoy(profile.consultas_hoy ?? 0)
          setStripeCustomerId(profile.stripe_customer_id)
          setCargando(false)
        }
      } catch (err) {
        console.error('[useUserPlan]', err)
        if (!cancelled) setCargando(false)
      }
    }

    cargar()
    return () => { cancelled = true }
  }, [])

  const esPremium = plan === 'premium'
  const limiteConsultasDia = esPremium ? LIMITE_PREMIUM : LIMITE_FREE
  const consultasRestantes = Math.max(0, limiteConsultasDia - consultasHoy)
  const puedeConsultar = consultasRestantes > 0

  return {
    plan,
    esPremium,
    planFin,
    consultasHoy,
    limiteConsultasDia,
    consultasRestantes,
    puedeConsultar,
    stripeCustomerId,
    userId,
    cargando,
  }
}

// ── Helper para incrementar el contador de consultas ────────
export async function incrementarConsulta(userId: string) {
  await supabase.rpc('incrementar_consulta', { user_id_param: userId })
}
