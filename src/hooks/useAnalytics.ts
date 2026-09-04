// src/hooks/useAnalytics.ts
// ============================================================
// UNIVERSE — Hook de analíticas
// Registra eventos de uso en analytics_eventos
// Compatible con RGPD — sin contenido personal ni IP
// ============================================================

import { supabase } from '../lib/supabase'

// Generar o recuperar session_id anónimo
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('universe_session_id')
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36)
    sessionStorage.setItem('universe_session_id', sessionId)
  }
  return sessionId
}

// Detectar dispositivo
function getDispositivo(): 'mobile' | 'tablet' | 'desktop' {
  const ua = navigator.userAgent
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet'
  if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua)) return 'mobile'
  return 'desktop'
}

// Detectar navegador
function getNavegador(): string {
  const ua = navigator.userAgent
  if (ua.includes('Chrome')) return 'chrome'
  if (ua.includes('Safari')) return 'safari'
  if (ua.includes('Firefox')) return 'firefox'
  if (ua.includes('Edge')) return 'edge'
  return 'otro'
}

// Calcular rango de edad desde fecha de nacimiento
function getRangoEdad(fechaNacimiento: string): string {
  if (!fechaNacimiento) return ''
  const edad = new Date().getFullYear() - new Date(fechaNacimiento).getFullYear()
  if (edad < 25) return '<25'
  if (edad < 35) return '25-34'
  if (edad < 45) return '35-44'
  if (edad < 55) return '45-54'
  return '55+'
}

// Obtener país por IP (usando API gratuita, sin almacenar IP)
let paisCache: string | null = null
async function getPais(): Promise<string> {
  if (paisCache) return paisCache
  try {
    const res = await fetch('https://ipapi.co/country/', { signal: AbortSignal.timeout(2000) })
    if (res.ok) {
      paisCache = (await res.text()).trim()
      return paisCache
    }
  } catch { /* silencioso */ }
  return ''
}

// ── Tipos de eventos ─────────────────────────────────────────
type TipoEvento =
  | 'herramienta_abierta'
  | 'lectura_completada'
  | 'lectura_cacheada'
  | 'paywall_alcanzado'
  | 'valoracion'
  | 'limite_alcanzado'

interface RegistrarEventoParams {
  evento: TipoEvento
  herramienta?: string
  esPremium?: boolean
  desdCache?: boolean
  tiempoMs?: number
  modeloIa?: string
  valoracion?: 1 | -1
  llegoPaywall?: boolean
  limiteAlcanzado?: boolean
  completoLectura?: boolean
  herramientaAnterior?: string
}

// ── Función principal ────────────────────────────────────────
export async function registrarEvento(params: RegistrarEventoParams): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser()

    // Datos del perfil del usuario
    const fechaNacimiento = localStorage.getItem('fechaNacimiento') || ''
    const signo = localStorage.getItem('signo') || ''
    const intencion = localStorage.getItem('intencion') || ''

    // Número de sesión (cuántas veces ha vuelto)
    const numSesionStr = localStorage.getItem('universe_num_sesiones') || '1'
    const numSesion = parseInt(numSesionStr)
    const esNuevoUsuario = numSesion === 1

    const now = new Date()

    // País (async, no bloqueante)
    const pais = await getPais()

    await supabase.from('analytics_eventos').insert({
      user_id:              user?.id ?? null,
      session_id:           getSessionId(),
      es_nuevo_usuario:     esNuevoUsuario,
      num_sesion:           numSesion,
      es_premium:           params.esPremium ?? false,

      evento:               params.evento,
      herramienta:          params.herramienta ?? null,
      herramienta_anterior: params.herramientaAnterior ?? localStorage.getItem('universe_ultima_herramienta'),

      desde_cache:          params.desdCache ?? false,
      tiempo_ms:            params.tiempoMs ?? null,
      modelo_ia:            params.modeloIa ?? null,

      valoracion:           params.valoracion ?? null,
      llego_paywall:        params.llegoPaywall ?? false,
      limite_alcanzado:     params.limiteAlcanzado ?? false,
      completo_lectura:     params.completoLectura ?? false,

      signo_zodiacal:       signo || null,
      rango_edad:           getRangoEdad(fechaNacimiento) || null,
      intencion:            intencion || null,

      pais_iso:             pais || null,
      dispositivo:          getDispositivo(),
      navegador:            getNavegador(),
      idioma:               navigator.language?.substring(0, 2) || null,
      hora_dia:             now.getUTCHours(),
      dia_semana:           now.getDay(),
    })

    // Actualizar última herramienta visitada
    if (params.herramienta) {
      localStorage.setItem('universe_ultima_herramienta', params.herramienta)
    }

  } catch (err) {
    // Silencioso — las analíticas nunca deben romper la app
    console.warn('[analytics]', err)
  }
}

// ── Hook React para uso en componentes ──────────────────────
export function useAnalytics(herramienta: string, esPremium: boolean) {
  // Registrar apertura de herramienta al montar
  const registrarApertura = () => {
    registrarEvento({ evento: 'herramienta_abierta', herramienta, esPremium })
  }

  const registrarLectura = (params: {
    desdCache?: boolean
    tiempoMs?: number
    modeloIa?: string
  }) => {
    registrarEvento({
      evento: params.desdCache ? 'lectura_cacheada' : 'lectura_completada',
      herramienta,
      esPremium,
      desdCache: params.desdCache,
      tiempoMs: params.tiempoMs,
      modeloIa: params.modeloIa,
      completoLectura: true,
    })
  }

  const registrarPaywall = () => {
    registrarEvento({ evento: 'paywall_alcanzado', herramienta, esPremium: false, llegoPaywall: true })
  }

  const registrarValoracion = (valor: 1 | -1) => {
    registrarEvento({ evento: 'valoracion', herramienta, esPremium, valoracion: valor })
  }

  const registrarLimite = () => {
    registrarEvento({ evento: 'limite_alcanzado', herramienta, esPremium: false, limiteAlcanzado: true })
  }

  return { registrarApertura, registrarLectura, registrarPaywall, registrarValoracion, registrarLimite }
}
