// Biorritmología - pseudociencia popular pero muy usada en apps espirituales
// Se presenta con contexto apropiado

export function calcularBiorritmos(fechaNacimiento: string): {
  fisico: number
  emocional: number
  intelectual: number
  intuitivo: number
  descripcionFisico: string
  descripcionEmocional: string
  descripcionIntelectual: string
  descripcionIntuitivo: string
} {
  const nacimiento = new Date(fechaNacimiento)
  const hoy = new Date()
  const dias = Math.floor((hoy.getTime() - nacimiento.getTime()) / (1000 * 60 * 60 * 24))

  const fisico = Math.sin(2 * Math.PI * dias / 23) * 100
  const emocional = Math.sin(2 * Math.PI * dias / 28) * 100
  const intelectual = Math.sin(2 * Math.PI * dias / 33) * 100
  const intuitivo = Math.sin(2 * Math.PI * dias / 38) * 100

  const describir = (valor: number, tipo: string): string => {
    if (valor > 50) return `Tu ${tipo} está en fase alta. Aprovecha esta energía.`
    if (valor > 0) return `Tu ${tipo} está en fase moderada. Energía disponible con consciencia.`
    if (valor > -50) return `Tu ${tipo} está en fase de transición. Ve con calma.`
    return `Tu ${tipo} está en fase baja. Descansa y recarga.`
  }

  return {
    fisico: Math.round(fisico),
    emocional: Math.round(emocional),
    intelectual: Math.round(intelectual),
    intuitivo: Math.round(intuitivo),
    descripcionFisico: describir(fisico, 'energía física'),
    descripcionEmocional: describir(emocional, 'mundo emocional'),
    descripcionIntelectual: describir(intelectual, 'capacidad mental'),
    descripcionIntuitivo: describir(intuitivo, 'intuición'),
  }
}

export function getBiorritmoDia(valor: number): { label: string; color: string; porcentaje: number } {
  const porcentaje = (valor + 100) / 2
  if (valor > 50) return { label: 'Alto', color: '#22c55e', porcentaje }
  if (valor > 0) return { label: 'Moderado', color: '#84cc16', porcentaje }
  if (valor > -50) return { label: 'Transición', color: '#f59e0b', porcentaje }
  return { label: 'Bajo', color: '#ef4444', porcentaje }
}