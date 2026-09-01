// Cálculos aproximados de carta natal sin API externa
// Para cálculos precisos se necesitaría una API astronómica

export const PLANETAS_INFO: Record<string, {
  simbolo: string
  rige: string
  descripcion: string
  enSigno: (signo: string) => string
}> = {
  Sol: {
    simbolo: '☀️',
    rige: 'Identidad · Propósito · Ego',
    descripcion: 'El Sol representa tu identidad consciente, tu ego y tu propósito de vida.',
    enSigno: (s) => `Tu Sol en ${s} define el núcleo de tu identidad y la forma en que te expresas en el mundo.`,
  },
  Luna: {
    simbolo: '🌙',
    rige: 'Emociones · Instinto · Madre',
    descripcion: 'La Luna representa tus emociones, instintos y tu mundo interior.',
    enSigno: (s) => `Tu Luna en ${s} revela cómo procesas las emociones y qué necesitas para sentirte seguro.`,
  },
  Mercurio: {
    simbolo: '☿',
    rige: 'Mente · Comunicación · Aprendizaje',
    descripcion: 'Mercurio rige la forma en que piensas, aprendes y te comunicas.',
    enSigno: (s) => `Mercurio en ${s} describe tu estilo mental y cómo procesas y comunicas la información.`,
  },
  Venus: {
    simbolo: '♀',
    rige: 'Amor · Belleza · Valores',
    descripcion: 'Venus rige el amor, la belleza, los placeres y lo que valoras.',
    enSigno: (s) => `Venus en ${s} revela cómo amas, qué encuentras bello y qué valoras profundamente.`,
  },
  Marte: {
    simbolo: '♂',
    rige: 'Acción · Deseo · Energía',
    descripcion: 'Marte rige tu energía, impulso, sexualidad y cómo persigues tus deseos.',
    enSigno: (s) => `Marte en ${s} muestra cómo actúas, qué te impulsa y cómo expresas tu energía vital.`,
  },
  Júpiter: {
    simbolo: '♃',
    rige: 'Expansión · Fortuna · Sabiduría',
    descripcion: 'Júpiter rige la expansión, la fortuna, la filosofía y el crecimiento.',
    enSigno: (s) => `Júpiter en ${s} indica dónde encuentras fortuna, sabiduría y expansión en tu vida.`,
  },
  Saturno: {
    simbolo: '♄',
    rige: 'Estructura · Karma · Disciplina',
    descripcion: 'Saturno rige las limitaciones, el karma, la disciplina y las lecciones de vida.',
    enSigno: (s) => `Saturno en ${s} revela tus mayores lecciones kármicas y dónde necesitas desarrollar disciplina.`,
  },
  Urano: {
    simbolo: '⛢',
    rige: 'Revolución · Originalidad · Cambio',
    descripcion: 'Urano rige la originalidad, las disrupciones y el cambio radical.',
    enSigno: (s) => `Urano en ${s} muestra dónde buscas romper esquemas y cómo expresas tu originalidad generacional.`,
  },
  Neptuno: {
    simbolo: '♆',
    rige: 'Espiritualidad · Ilusión · Misticismo',
    descripcion: 'Neptuno rige la espiritualidad, los sueños, la intuición y la ilusión.',
    enSigno: (s) => `Neptuno en ${s} indica la naturaleza de tu espiritualidad y tu conexión con lo místico.`,
  },
  Plutón: {
    simbolo: '♇',
    rige: 'Transformación · Poder · Renacimiento',
    descripcion: 'Plutón rige la transformación profunda, el poder y la muerte/renacimiento.',
    enSigno: (s) => `Plutón en ${s} revela dónde experimentas las transformaciones más profundas de tu vida.`,
  },
}

export const CASAS_ASTROLOGICAS = [
  { numero: 1, nombre: 'Casa I — Ascendente', area: 'Personalidad · Apariencia · Cómo te ven', rige: 'Aries · Marte' },
  { numero: 2, nombre: 'Casa II', area: 'Recursos · Dinero · Valores materiales', rige: 'Tauro · Venus' },
  { numero: 3, nombre: 'Casa III', area: 'Comunicación · Hermanos · Entorno cercano', rige: 'Géminis · Mercurio' },
  { numero: 4, nombre: 'Casa IV — IC', area: 'Hogar · Familia · Raíces', rige: 'Cáncer · Luna' },
  { numero: 5, nombre: 'Casa V', area: 'Creatividad · Romance · Hijos', rige: 'Leo · Sol' },
  { numero: 6, nombre: 'Casa VI', area: 'Salud · Trabajo · Rutinas', rige: 'Virgo · Mercurio' },
  { numero: 7, nombre: 'Casa VII — DC', area: 'Relaciones · Pareja · Contratos', rige: 'Libra · Venus' },
  { numero: 8, nombre: 'Casa VIII', area: 'Transformación · Muerte · Recursos ajenos', rige: 'Escorpio · Plutón' },
  { numero: 9, nombre: 'Casa IX', area: 'Filosofía · Viajes · Espiritualidad', rige: 'Sagitario · Júpiter' },
  { numero: 10, nombre: 'Casa X — MC', area: 'Carrera · Reputación · Propósito público', rige: 'Capricornio · Saturno' },
  { numero: 11, nombre: 'Casa XI', area: 'Amistades · Comunidad · Sueños', rige: 'Acuario · Urano' },
  { numero: 12, nombre: 'Casa XII', area: 'Inconsciente · Karma · Vida oculta', rige: 'Piscis · Neptuno' },
]

// Cálculo aproximado del signo de la luna basado en la fecha
export function calcularSignoLunaAprox(fechaNacimiento: string): string {
  const SIGNOS = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis']
  const fecha = new Date(fechaNacimiento)
  const diasDesde2000 = Math.floor((fecha.getTime() - new Date('2000-01-01').getTime()) / (1000 * 60 * 60 * 24))
  const cicloLunar = diasDesde2000 % 354
  const indice = Math.floor(cicloLunar / 29.5) % 12
  return SIGNOS[indice]
}

export function calcularMercurioAprox(signoSolar: string): string {
  const SIGNOS = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis']
  const idx = SIGNOS.indexOf(signoSolar)
  const offset = Math.random() > 0.5 ? 1 : -1
  return SIGNOS[((idx + offset) + 12) % 12]
}

export function calcularVenusAprox(signoSolar: string): string {
  const SIGNOS = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis']
  const idx = SIGNOS.indexOf(signoSolar)
  const offset = [-2, -1, 0, 1, 2][Math.floor(Math.random() * 5)]
  return SIGNOS[((idx + offset) + 12) % 12]
}

export function calcularMarteAprox(fechaNacimiento: string): string {
  const SIGNOS = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis']
  const fecha = new Date(fechaNacimiento)
  const diasDesde2000 = Math.floor((fecha.getTime() - new Date('2000-01-01').getTime()) / (1000 * 60 * 60 * 24))
  return SIGNOS[Math.abs(diasDesde2000 % 687 % 12)]
}