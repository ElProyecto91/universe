export type ResultadoMoneda = 'cara' | 'cruz'

export const INTERPRETACIONES_MONEDAS: Record<string, { titulo: string; mensaje: string }> = {
  'cara-cara-cara': { titulo: 'Tríada Solar', mensaje: 'Tres caras — energía Yang pura. El universo dice sí con claridad. La acción está alineada con el flujo. Avanza.' },
  'cruz-cruz-cruz': { titulo: 'Tríada Lunar', mensaje: 'Tres cruces — energía Yin pura. Este no es el momento de actuar. Espera, observa, deja que las cosas maduren.' },
  'cara-cara-cruz': { titulo: 'Mayoría Solar', mensaje: 'Predomina el sí, con una nota de cautela. La dirección es correcta pero hay un detalle que necesita atención.' },
  'cara-cruz-cruz': { titulo: 'Mayoría Lunar', mensaje: 'Predomina la espera, con un impulso de acción. Pausa antes de actuar, pero no indefinidamente.' },
  'cara-cruz-cara': { titulo: 'Alternancia', mensaje: 'Fuerzas en tensión creativa. Ni sí ni no — el momento pide discernimiento. ¿Qué dice tu intuición más profunda?' },
  'cruz-cara-cruz': { titulo: 'Reflexión', mensaje: 'Un momento de acción rodeado de pausa. La oportunidad existe pero requiere preparación.' },
}

export function lanzarMoneda(): ResultadoMoneda {
  return Math.random() > 0.5 ? 'cara' : 'cruz'
}

export function lanzar3Monedas(): ResultadoMoneda[] {
  return [lanzarMoneda(), lanzarMoneda(), lanzarMoneda()]
}

export function getInterpretacion(monedas: ResultadoMoneda[]): typeof INTERPRETACIONES_MONEDAS[string] {
  const clave = monedas.join('-')
  return INTERPRETACIONES_MONEDAS[clave] || INTERPRETACIONES_MONEDAS['cara-cruz-cara']
}