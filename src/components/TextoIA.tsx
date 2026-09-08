// src/components/TextoIA.tsx
// ============================================================
// UNIVERSE — Renderizador de texto de IA
// Limpia markdown y cierra automáticamente si el texto
// se cortó antes de terminar la frase
// ============================================================

interface TextoIAProps {
  texto: string
  className?: string
}

export function limpiarMarkdown(texto: string): string {
  return texto
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/#{1,6}\s(.+)/g, '$1')
    .replace(/^[-•]\s/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// Si el texto termina sin punto/cierre, lo añade
function cerrarTexto(texto: string): string {
  const trimmed = texto.trimEnd()
  const ultimoChar = trimmed[trimmed.length - 1]
  const cierres = ['.', '!', '?', '…', '"', '»']
  if (!cierres.includes(ultimoChar)) {
    // Cortar en el último punto completo que encuentre
    const ultimoPunto = Math.max(
      trimmed.lastIndexOf('.'),
      trimmed.lastIndexOf('!'),
      trimmed.lastIndexOf('?'),
    )
    if (ultimoPunto > trimmed.length * 0.6) {
      return trimmed.substring(0, ultimoPunto + 1)
    }
    // Si no hay punto suficientemente avanzado, añadir cierre
    return trimmed + '.'
  }
  return trimmed
}

export default function TextoIA({ texto, className = '' }: TextoIAProps) {
  const limpio  = limpiarMarkdown(texto)
  const cerrado = cerrarTexto(limpio)

  return (
    <p className={`text-white text-sm leading-relaxed whitespace-pre-wrap ${className}`}>
      {cerrado}
    </p>
  )
}
