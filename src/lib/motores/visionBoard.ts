export const CATEGORIAS_VISION = [
  {
    id: 'amor',
    nombre: 'Amor y Relaciones',
    simbolo: '❤️',
    color: '#f472b6',
    preguntas: [
      '¿Cómo es tu relación ideal?',
      '¿Cómo te sientes en esa relación?',
      '¿Qué das y qué recibes?',
    ],
    afirmaciones: [
      'Merezco un amor profundo, auténtico y recíproco.',
      'Mis relaciones son espejos sagrados de mi crecimiento.',
      'El amor fluye hacia mí de formas que aún no imagino.',
    ],
  },
  {
    id: 'carrera',
    nombre: 'Trabajo y Vocación',
    simbolo: '💼',
    color: '#f59e0b',
    preguntas: [
      '¿Cuál es tu trabajo ideal?',
      '¿Qué impacto quieres tener?',
      '¿Cómo te sientes en tu trabajo ideal?',
    ],
    afirmaciones: [
      'Mi trabajo es una expresión de mis talentos más profundos.',
      'Soy compensado generosamente por lo que amo hacer.',
      'Mi vocación tiene impacto real en el mundo.',
    ],
  },
  {
    id: 'salud',
    nombre: 'Salud y Bienestar',
    simbolo: '🌿',
    color: '#22c55e',
    preguntas: [
      '¿Cómo es tu cuerpo y tu salud ideal?',
      '¿Qué rutinas tienes en tu vida ideal?',
      '¿Cómo te sientes en tu cuerpo?',
    ],
    afirmaciones: [
      'Mi cuerpo es fuerte, vital y lleno de energía.',
      'Cuido mi salud con amor y disciplina constante.',
      'Mi bienestar es mi mayor inversión.',
    ],
  },
  {
    id: 'abundancia',
    nombre: 'Abundancia y Dinero',
    simbolo: '💰',
    color: '#eab308',
    preguntas: [
      '¿Cuánto dinero necesitas para vivir libre?',
      '¿Qué comprarías o experimentarías?',
      '¿Cómo usarías tu abundancia para el bien?',
    ],
    afirmaciones: [
      'La abundancia fluye hacia mí de formas esperadas e inesperadas.',
      'Soy un canal de prosperidad para mí y para otros.',
      'El dinero es una herramienta para vivir mi propósito.',
    ],
  },
  {
    id: 'hogar',
    nombre: 'Hogar y Familia',
    simbolo: '🏠',
    color: '#fb923c',
    preguntas: [
      '¿Cómo es tu hogar ideal?',
      '¿Con quién compartes tu vida?',
      '¿Qué ambiente has creado?',
    ],
    afirmaciones: [
      'Mi hogar es un refugio de paz, amor y belleza.',
      'Creo un ambiente sagrado donde todos florecemos.',
      'Mi familia es mi mayor tesoro y mi mayor apoyo.',
    ],
  },
  {
    id: 'espiritualidad',
    nombre: 'Espiritualidad y Propósito',
    simbolo: '✨',
    color: '#8b5cf6',
    preguntas: [
      '¿Cuál es tu misión de vida?',
      '¿Cómo sirves al mundo?',
      '¿Qué práctica espiritual tiene tu vida ideal?',
    ],
    afirmaciones: [
      'Tengo un propósito único que solo yo puedo cumplir.',
      'Sirvo al mundo siendo auténticamente yo mismo.',
      'Mi vida espiritual guía todas mis decisiones.',
    ],
  },
]

export type EntradaVision = {
  categoriaId: string
  intencion: string
  fecha: string
}

export function guardarIntencionVision(entrada: EntradaVision): void {
  const intenciones = cargarIntenciones()
  const idx = intenciones.findIndex(i => i.categoriaId === entrada.categoriaId)
  if (idx >= 0) {
    intenciones[idx] = entrada
  } else {
    intenciones.push(entrada)
  }
  localStorage.setItem('vision_board', JSON.stringify(intenciones))
}

export function cargarIntenciones(): EntradaVision[] {
  try {
    const raw = localStorage.getItem('vision_board')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}