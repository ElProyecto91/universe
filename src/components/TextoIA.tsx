// src/components/TextoIA.tsx
// ============================================================
// UNIVERSE — Renderizador de texto de IA
// Limpia el markdown que devuelve Gemini antes de mostrar
// ============================================================

interface TextoIAProps {
  texto: string
  className?: string
}

export function limpiarMarkdown(texto: string): string {
  return texto
    .replace(/\*\*(.+?)\*\*/g, '$1')   // **negrita** → texto plano
    .replace(/\*(.+?)\*/g, '$1')        // *cursiva* → texto plano
    .replace(/#{1,6}\s(.+)/g, '$1')     // ## Título → Título
    .replace(/^[-•]\s/gm, '• ')         // - lista → • lista
    .replace(/\n{3,}/g, '\n\n')         // triple salto → doble
    .trim()
}

export default function TextoIA({ texto, className = '' }: TextoIAProps) {
  const limpio = limpiarMarkdown(texto)
  return (
    <p className={`text-white text-sm leading-relaxed whitespace-pre-wrap ${className}`}>
      {limpio}
    </p>
  )
}
