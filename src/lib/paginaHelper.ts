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

// Componente de carga animado reutilizable
export const LoadingDots = () => (
  <div className="flex gap-2 py-2">
    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
  </div>
)
