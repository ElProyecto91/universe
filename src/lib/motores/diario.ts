export type EntradaDiario = {
  id: string
  fecha: string
  tipo: 'libre' | 'gratitud' | 'intencion' | 'sueno' | 'sincronicidad'
  contenido: string
  faseLunar?: string
  carta?: string
  humor?: number
}

export const TIPOS_ENTRADA = [
  { id: 'libre', nombre: 'Escritura libre', icono: '📝', descripcion: 'Sin estructura. Solo escribe.' },
  { id: 'gratitud', nombre: 'Gratitud', icono: '🙏', descripcion: '3 cosas por las que estás agradecido hoy.' },
  { id: 'intencion', nombre: 'Intención', icono: '✨', descripcion: 'Tu intención para hoy o para esta semana.' },
  { id: 'sueno', nombre: 'Sueño', icono: '🌙', descripcion: 'Registra un sueño antes de que se olvide.' },
  { id: 'sincronicidad', nombre: 'Sincronicidad', icono: '🔢', descripcion: 'Una señal o coincidencia significativa.' },
]

export function guardarEntrada(entrada: EntradaDiario): void {
  const entradas = cargarEntradas()
  entradas.unshift(entrada)
  // Máximo 100 entradas
  const top100 = entradas.slice(0, 100)
  localStorage.setItem('diario_entradas', JSON.stringify(top100))
}

export function cargarEntradas(): EntradaDiario[] {
  try {
    const raw = localStorage.getItem('diario_entradas')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function eliminarEntrada(id: string): void {
  const entradas = cargarEntradas().filter(e => e.id !== id)
  localStorage.setItem('diario_entradas', JSON.stringify(entradas))
}

export function getEstadisticasDiario() {
  const entradas = cargarEntradas()
  const tipos: Record<string, number> = {}
  entradas.forEach(e => { tipos[e.tipo] = (tipos[e.tipo] || 0) + 1 })
  const rachaActual = calcularRacha(entradas)
  return { total: entradas.length, tipos, rachaActual }
}

function calcularRacha(entradas: EntradaDiario[]): number {
  if (entradas.length === 0) return 0
  let racha = 0
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  let diaActual = new Date(hoy)

  for (let i = 0; i < 30; i++) {
    const fechaStr = diaActual.toISOString().split('T')[0]
    const tieneEntrada = entradas.some(e => e.fecha.startsWith(fechaStr))
    if (tieneEntrada) {
      racha++
      diaActual.setDate(diaActual.getDate() - 1)
    } else {
      break
    }
  }
  return racha
}