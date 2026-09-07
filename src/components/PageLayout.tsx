// src/components/PageLayout.tsx
// ============================================================
// UNIVERSE — Layout base para todas las páginas
// Fondo + overlay sólido resueltos una sola vez aquí.
// NUNCA tocar el overlay en las páginas individuales.
// ============================================================

import { ReactNode } from 'react'

interface PageLayoutProps {
  children: ReactNode
  /** Desactiva el max-w-sm centrado — para páginas con layout propio (Admin, etc.) */
  fullWidth?: boolean
}

const bgStyle = {
  backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
}

export default function PageLayout({ children, fullWidth = false }: PageLayoutProps) {
  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      {/* Overlay sólido — fijo aquí para siempre, no en las páginas */}
      <div className="absolute inset-0 bg-black/92 z-0" />

      <div className={`relative z-10 flex flex-col flex-1 ${fullWidth ? 'w-full' : 'w-full max-w-sm mx-auto px-6 py-10'}`}>
        {children}
      </div>
    </div>
  )
}
