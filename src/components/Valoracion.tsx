// src/components/Valoracion.tsx
// ============================================================
// UNIVERSE — Componente de valoración 👍👎
// Se muestra al final de cada lectura completada
// ============================================================

import { useState } from 'react'

interface ValoracionProps {
  onValorar: (valor: 1 | -1) => void
}

export default function Valoracion({ onValorar }: ValoracionProps) {
  const [valorado, setValorado] = useState<1 | -1 | null>(null)

  const votar = (v: 1 | -1) => {
    if (valorado) return
    setValorado(v)
    onValorar(v)
  }

  if (valorado) {
    return (
      <div className="flex items-center justify-center gap-2 py-2">
        <span className="text-white/40 text-xs">Gracias por tu valoración</span>
        <span>{valorado === 1 ? '✨' : '🙏'}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center gap-4 py-2">
      <span className="text-white/40 text-xs">¿Te ha resonado?</span>
      <button
        onClick={() => votar(1)}
        className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-green-500/20 hover:border-green-400/40 transition text-lg"
      >
        👍
      </button>
      <button
        onClick={() => votar(-1)}
        className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-red-500/20 hover:border-red-400/40 transition text-lg"
      >
        👎
      </button>
    </div>
  )
}
