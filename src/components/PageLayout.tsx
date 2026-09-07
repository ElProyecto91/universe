// src/components/PageLayout.tsx
// ============================================================
// UNIVERSE — Layout base para todas las páginas
// Fondo + overlay resueltos aquí una vez para siempre.
// El overlay usa style inline para garantizar que funciona
// independientemente de la configuración de Tailwind.
// ============================================================

import { ReactNode } from 'react'

interface PageLayoutProps {
  children: ReactNode
  fullWidth?: boolean
}

const bgStyle = {
  backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
}

// Overlay inline — NO depende de Tailwind, siempre funciona
const overlayStyle = {
  position: 'absolute' as const,
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.92)',
  zIndex: 0,
}

export default function PageLayout({ children, fullWidth = false }: PageLayoutProps) {
  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div style={overlayStyle} />
      <div className={`relative flex flex-col flex-1 ${
        fullWidth ? 'w-full' : 'w-full max-w-sm mx-auto px-6 py-10'
      }`} style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}
