// src/lib/paginaHelper.ts
// ============================================================
// UNIVERSE — Helper compartido para todas las páginas
// Evita repetir imports y lógica común en cada componente
// ============================================================

// Re-exporta todo lo que necesitan las páginas
export { supabase, getUser } from './supabase'
export { llamarGemini } from './gemini'
export { useUserPlan } from '../hooks/useUserPlan'
export { useAnalytics, registrarEvento } from '../hooks/useAnalytics'

// Estilos comunes
export const bgStyle = {
  backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
  backgroundSize: 'cover' as const,
  backgroundPosition: 'center' as const,
}

