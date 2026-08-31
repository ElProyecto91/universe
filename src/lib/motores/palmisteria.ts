export const LINEAS_MANO = [
  {
    id: 'vida',
    nombre: 'Línea de la Vida',
    ubicacion: 'Rodea el monte de Venus (base del pulgar)',
    descripcion: 'Contrariamente a la creencia popular, no indica cuánto vivirás — indica la calidad y vitalidad de tu vida.',
    interpretaciones: [
      { tipo: 'Larga y profunda', significado: 'Vida llena de vitalidad, salud robusta y gran resistencia física y emocional.' },
      { tipo: 'Corta', significado: 'No indica muerte temprana — indica que tomas el control de tu propio destino, no que te dominen las circunstancias.' },
      { tipo: 'Con bifurcación al final', significado: 'Un gran viaje o cambio de vida en la madurez. Posiblemente dos caminos muy diferentes.' },
      { tipo: 'Con islas o interrupciones', significado: 'Períodos de dificultad que superarás. Cada interrupción es seguida por continuación.' },
      { tipo: 'Doble línea', significado: 'Una segunda energía o influencia protectora. Vitalidad extraordinaria.' },
    ],
  },
  {
    id: 'corazon',
    nombre: 'Línea del Corazón',
    ubicacion: 'La línea superior horizontal de la palma',
    descripcion: 'Representa la vida emocional, las relaciones y la salud cardíaca en el sentido más amplio.',
    interpretaciones: [
      { tipo: 'Larga y curva hacia arriba', significado: 'Persona apasionada, expresiva en el amor. Busca la conexión emocional profunda.' },
      { tipo: 'Recta y horizontal', significado: 'Más cerebral en el amor. Prioriza la compatibilidad intelectual sobre la pasión.' },
      { tipo: 'Comienza bajo el índice', significado: 'Selectivo en el amor. Pocas relaciones pero muy significativas.' },
      { tipo: 'Comienza bajo el dedo medio', significado: 'Pragmático en el amor. Las relaciones tienen una dimensión práctica importante.' },
      { tipo: 'Con muchas ramas', significado: 'Múltiples conexiones emocionales importantes a lo largo de la vida.' },
    ],
  },
  {
    id: 'cabeza',
    nombre: 'Línea de la Cabeza',
    ubicacion: 'La línea horizontal central de la palma',
    descripcion: 'Representa el estilo mental, la forma de pensar y la capacidad intelectual.',
    interpretaciones: [
      { tipo: 'Larga y recta', significado: 'Pensamiento lógico, materialista y práctico. Excelente para negocios y análisis.' },
      { tipo: 'Larga y curva', significado: 'Pensamiento creativo e imaginativo. Tendencia hacia las artes, la espiritualidad y la filosofía.' },
      { tipo: 'Corta', significado: 'Pensador directo y pragmático. No se pierde en abstracciones innecesarias.' },
      { tipo: 'Separada de la línea de la vida', significado: 'Independencia de pensamiento. Tendencia a asumir riesgos calculados.' },
      { tipo: 'Unida a la línea de la vida', significado: 'Pensamiento muy influenciado por la familia y las emociones en la infancia.' },
    ],
  },
  {
    id: 'destino',
    nombre: 'Línea del Destino',
    ubicacion: 'Línea vertical que sube por el centro de la palma',
    descripcion: 'Indica la influencia de factores externos en la vida. No todos la tienen marcada.',
    interpretaciones: [
      { tipo: 'Profunda y larga', significado: 'Vida muy influenciada por el destino o el karma. Tendencia a sentir que hay un propósito mayor.' },
      { tipo: 'Ausente o débil', significado: 'Gran libertad para crear tu propio destino. Menos influencia kármica, más libre albedrío.' },
      { tipo: 'Comienza en la muñeca', significado: 'El propósito de vida está claro desde temprano. Determinación constante.' },
      { tipo: 'Comienza en la mitad', significado: 'El propósito se clarifica en la madurez. La segunda mitad de la vida es más significativa.' },
      { tipo: 'Bifurcada', significado: 'Dos caminos posibles de vida. Una gran decisión que divide el destino en dos direcciones.' },
    ],
  },
]

export const MONTES_MANO = [
  {
    nombre: 'Monte de Venus',
    ubicacion: 'Base del pulgar',
    planeta: 'Venus',
    significado: 'Amor, belleza, sensualidad y vitalidad. Un monte prominente indica una persona apasionada y amante de los placeres.',
  },
  {
    nombre: 'Monte de Júpiter',
    ubicacion: 'Base del índice',
    planeta: 'Júpiter',
    significado: 'Ambición, liderazgo y espiritualidad. Un monte prominente indica un líder nato con grandes aspiraciones.',
  },
  {
    nombre: 'Monte de Saturno',
    ubicacion: 'Base del dedo medio',
    planeta: 'Saturno',
    significado: 'Sabiduría, responsabilidad y karma. Un monte prominente indica seriedad, disciplina y conexión con el destino.',
  },
  {
    nombre: 'Monte del Sol',
    ubicacion: 'Base del anular',
    planeta: 'Sol',
    significado: 'Creatividad, fama y éxito. Un monte prominente indica talento artístico y deseo de reconocimiento.',
  },
  {
    nombre: 'Monte de Mercurio',
    ubicacion: 'Base del meñique',
    planeta: 'Mercurio',
    significado: 'Comunicación, negocios e ingenio. Un monte prominente indica habilidad para los negocios y la comunicación.',
  },
  {
    nombre: 'Monte de la Luna',
    ubicacion: 'Borde exterior opuesto al pulgar',
    planeta: 'Luna',
    significado: 'Intuición, imaginación y el inconsciente. Un monte prominente indica una persona muy intuitiva y creativa.',
  },
]

export function getPreguntasPalmisteria(): string[] {
  return [
    '¿Tu línea de la vida es larga, corta o tiene interrupciones visibles?',
    '¿Tu línea del corazón es curva (sube) o más recta y horizontal?',
    '¿Tu línea de la cabeza es larga y recta o larga y curva?',
    '¿Tienes una línea del destino visible en el centro de tu palma?',
    '¿Cuál de los montes (base de los dedos) es el más prominente?',
  ]
}