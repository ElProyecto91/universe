// src/components/AvisoIA.tsx
// ============================================================
// UNIVERSE — Aviso de IA en la Guía (obligatorio AI Act UE)
// Deja claro que el usuario habla con una IA, no con un humano
// ============================================================

import { useState } from 'react'

export default function AvisoIA() {
  const [cerrado, setCerrado] = useState(false)

  if (cerrado) return null

  return (
    <div className="bg-purple-950/70 border border-purple-400/40 rounded-2xl px-4 py-3 flex items-start gap-3">
      <span className="text-purple-400 text-base flex-shrink-0 mt-0.5">🤖</span>
      <div className="flex-1">
        <p className="text-purple-300 text-xs font-semibold mb-0.5">Estás hablando con una IA</p>
        <p className="text-white/80 text-xs leading-relaxed">
          UNIVERSE es una inteligencia artificial, no un humano ni un experto real. Sus respuestas son simbólicas y orientativas. Para consultas profesionales, habla con un especialista.
        </p>
      </div>
      <button onClick={() => setCerrado(true)} className="text-white/20 text-lg leading-none flex-shrink-0">✕</button>
    </div>
  )
}
