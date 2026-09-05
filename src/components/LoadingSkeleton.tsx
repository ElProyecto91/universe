// src/components/LoadingSkeleton.tsx
// ============================================================
// UNIVERSE — Skeletons de carga
// Muestra placeholders animados mientras cargan los datos
// ============================================================

// Skeleton genérico de bloque
export function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl bg-white/10 animate-pulse ${className}`}
    />
  )
}

// Skeleton para páginas con lectura IA (Horoscopo, AstroDaily, etc.)
export function SkeletonPagina() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <SkeletonBlock className="h-32" />
      <SkeletonBlock className="h-20" />
      <div className="grid grid-cols-2 gap-3">
        <SkeletonBlock className="h-24" />
        <SkeletonBlock className="h-24" />
      </div>
      <SkeletonBlock className="h-12 rounded-full" />
    </div>
  )
}

// Skeleton para el plan del usuario (Perfil)
export function SkeletonPlan() {
  return (
    <div className="bg-white/8 border border-white/20 rounded-2xl p-4 animate-pulse"
      style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
      <div className="flex justify-between items-center mb-3">
        <SkeletonBlock className="h-5 w-32" />
        <SkeletonBlock className="h-7 w-20 rounded-full" />
      </div>
      <SkeletonBlock className="h-1.5 w-full rounded-full" />
      <SkeletonBlock className="h-3 w-40 mt-2" />
    </div>
  )
}

// Spinner simple para botones
export function Spinner({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const s = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'
  return (
    <div className={`${s} border-2 border-white/30 border-t-white rounded-full animate-spin`} />
  )
}
