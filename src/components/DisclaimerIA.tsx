// src/components/DisclaimerIA.tsx
// ============================================================
// UNIVERSE — Disclaimer de IA
// Obligatorio por el AI Act (agosto 2026) en cada herramienta
// Debe mostrarse ANTES de que el usuario reciba la respuesta de IA
// ============================================================

interface DisclaimerIAProps {
  compact?: boolean  // versión compacta para mostrar junto al botón
}

export default function DisclaimerIA({ compact = false }: DisclaimerIAProps) {
  if (compact) {
    return (
      <p className="text-white/25 text-xs text-center leading-relaxed">
        ✦ Contenido generado por IA · Solo entretenimiento y reflexión personal
      </p>
    )
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur">
      <p className="text-white/40 text-xs leading-relaxed text-center">
        Esta lectura es generada por inteligencia artificial con fines de entretenimiento y reflexión personal.
        No constituye asesoramiento médico, psicológico, financiero ni de ningún otro tipo.
      </p>
    </div>
  )
}
