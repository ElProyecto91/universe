// src/lib/planUtils.ts
// ============================================================
// UNIVERSE — Configuración de planes y herramientas
// Define qué herramientas son free/premium
// ============================================================

// Herramientas accesibles en plan GRATUITO
// Criterio: caché + Lite = coste ~€0 por usuario
export const HERRAMIENTAS_FREE = new Set([
  'horoscopo',
  'astro-daily',
  'afirmaciones',
  'luna-oracle',
  'meditacion',
  'tarot-diario',
  'wheel-of-year',
  'numerologia-universal',
  'ano-personal',
  'horoscopo-celtico',
  'biorritmos',
  'color-oracle',
  'element-oracle',
])

// Herramientas PREMIUM (Flash, no cacheables o avanzadas)
export const HERRAMIENTAS_PREMIUM = new Set([
  'tarot',           // tiradas completas (3 y 5 cartas)
  'tarot78',
  'runas',           // tiradas completas (3 y 5 runas)
  'carta-natal',
  'transitos',
  'compatibilidad',
  'bazi',
  'zi-wei',
  'tzolkin',
  'iching',
  'scrying',
  'mirror-oracle',
  'geomancia',
  'guia-ia',
  'oracle-mix',
  'pagan-paths',
  'chakra-oracle',
  'animal-oracle',
  'plant-oracle',
  'suenos-oracle',
  'diario-suenos',
  'manifestacion',
  'vision-board',
  'rueda-vida',
  'palmisteria',
  'numerologia',
  'numerologia-nombre',
  'test-arquetipo',
  'rituales',
  'ogham-oracle',
  'omikuji',
  'omens-oracle',
  'sincronicidad',
  'tibetan-mo',
  'lithomancy',
  'bibliomancia',
  'dice-oracle',
  'coin-oracle',
])

export function esPremium(herramienta: string): boolean {
  return HERRAMIENTAS_PREMIUM.has(herramienta)
}

export function esFree(herramienta: string): boolean {
  return HERRAMIENTAS_FREE.has(herramienta)
}

// Límites de consultas por plan
export const LIMITES = {
  free: {
    porDia: 5,
    porHora: 10,
  },
  premium: {
    porDia: 200,
    porHora: 50,
  },
  anonimo: {
    porDia: 3,  // Sin cuenta: más restrictivo para incentivar registro
    porHora: 5,
  },
}

// Herramientas con funcionalidad parcial gratuita
// Tarot: 1 carta gratis, 3 y 5 cartas Premium
// Runas: 1 runa gratis, 3 y 5 runas Premium
export const ACCESO_PARCIAL = {
  tarot: { free: ['una'], premium: ['tres', 'relacion', 'profunda'] },
  runas: { free: ['una'], premium: ['tres', 'cinco'] },
}
