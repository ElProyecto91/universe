// src/hooks/useHistorial.ts
// ============================================================
// UNIVERSE — Hook de historial de lecturas
// Guarda y lee las últimas lecturas del usuario en Supabase
// ============================================================

import { supabase } from '../lib/supabase'

export interface LecturaHistorial {
  id?: string
  user_id?: string
  herramienta: string
  titulo: string
  contenido: string
  metadatos?: Record<string, any>
  created_at?: string
}

// Guardar una lectura en el historial
export async function guardarLectura(lectura: LecturaHistorial): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return // Sin sesión no guardamos

    await supabase.from('historial_lecturas').insert({
      user_id: user.id,
      herramienta: lectura.herramienta,
      titulo: lectura.titulo,
      contenido: lectura.contenido,
      metadatos: lectura.metadatos ?? {},
    })
  } catch (err) {
    console.warn('[useHistorial] Error guardando lectura:', err)
  }
}

// Leer las últimas N lecturas del usuario
export async function cargarHistorial(limite = 20): Promise<LecturaHistorial[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data } = await supabase
      .from('historial_lecturas')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limite)

    return data ?? []
  } catch (err) {
    console.warn('[useHistorial] Error cargando historial:', err)
    return []
  }
}

// Borrar una lectura del historial
export async function borrarLectura(id: string): Promise<void> {
  try {
    await supabase.from('historial_lecturas').delete().eq('id', id)
  } catch (err) {
    console.warn('[useHistorial] Error borrando lectura:', err)
  }
}

// Iconos por herramienta
export const ICONOS_HERRAMIENTA: Record<string, string> = {
  tarot: '🃏',
  runas: 'ᚠ',
  iching: '☯',
  'carta-natal': '🌌',
  'pagan-norse': '⚡',
  'pagan-hellenic': '🏛️',
  'pagan-egyptian': '𓂀',
  'pagan-celtic': '🌿',
  'pagan-slavic': '🐺',
  'pagan-wicca': '🌙',
  'guia-ia': '✨',
  'dice-oracle': '⚄',
  'coin-oracle': '🪙',
  'diario-suenos': '💭',
  horoscopo: '♈',
  'astro-daily': '🪐',
}
