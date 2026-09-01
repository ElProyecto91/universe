export const TRANSITOS_HOY = [
  {
    planeta: 'Luna',
    simbolo: '🌙',
    tipo: 'Tránsito diario',
    descripcion: (signo: string) => `La Luna transita por ${signo} hoy, activando emociones relacionadas con ${LUNA_EN_SIGNOS[signo] || 'la intuición y el cuidado'}.`,
    impacto: 'Emociones · Instintos · Vida doméstica',
  },
  {
    planeta: 'Mercurio',
    simbolo: '☿',
    tipo: 'Tránsito mental',
    descripcion: (signo: string) => `Mercurio en ${signo} favorece ${MERCURIO_EN_SIGNOS[signo] || 'la comunicación y el pensamiento'}. Ideas que fluyen con mayor claridad.`,
    impacto: 'Comunicación · Mente · Aprendizaje',
  },
]

export const LUNA_EN_SIGNOS: Record<string, string> = {
  Aries: 'la acción impulsiva, la valentía y los nuevos comienzos. Energía alta pero impaciente',
  Tauro: 'la estabilidad, los placeres sensoriales y la necesidad de seguridad material',
  Géminis: 'la comunicación, la curiosidad y la necesidad de variedad e información',
  Cáncer: 'el hogar, la familia y las emociones profundas. Sensibilidad al máximo',
  Leo: 'la expresión creativa, el amor propio y el deseo de ser visto y reconocido',
  Virgo: 'el análisis, el orden y la necesidad de ser útil y eficiente',
  Libra: 'las relaciones, la armonía y la necesidad de equilibrio y belleza',
  Escorpio: 'la intensidad emocional, la transformación y los deseos más profundos',
  Sagitario: 'la libertad, la filosofía y el deseo de expansión y aventura',
  Capricornio: 'la ambición, la responsabilidad y la necesidad de lograr metas concretas',
  Acuario: 'la originalidad, la comunidad y la necesidad de libertad e innovación',
  Piscis: 'la espiritualidad, la empatía y la conexión con lo invisible',
}

export const MERCURIO_EN_SIGNOS: Record<string, string> = {
  Aries: 'el pensamiento directo, rápido e impulsivo. Habla antes de pensar',
  Tauro: 'el pensamiento lento, metódico y práctico. Las ideas necesitan tiempo para madurar',
  Géminis: 'la comunicación brillante, versátil y rápida. Ideas que fluyen en todas direcciones',
  Cáncer: 'el pensamiento intuitivo y emocional. La memoria y el pasado influyen en las decisiones',
  Leo: 'la expresión dramática, creativa y carismática. Las palabras tienen fuerza y presencia',
  Virgo: 'el análisis preciso y crítico. Atención al detalle y pensamiento metódico',
  Libra: 'la diplomacia y la capacidad de ver todos los lados. Indecisión como efecto secundario',
  Escorpio: 'la investigación profunda y el pensamiento estratégico. Mente que descubre secretos',
  Sagitario: 'el pensamiento filosófico y expansivo. Las grandes ideas más que los detalles',
  Capricornio: 'la planificación estratégica y el pensamiento práctico orientado a resultados',
  Acuario: 'el pensamiento original, innovador y poco convencional. Ideas adelantadas a su tiempo',
  Piscis: 'la intuición poética y el pensamiento no lineal. Imaginación desbordante',
}

export const RETROGRADOS_2026 = [
  { planeta: 'Mercurio', inicio: '2026-01-15', fin: '2026-02-03', signo: 'Capricornio', consejo: 'Revisa contratos, evita decisiones importantes, comunica con extra cuidado.' },
  { planeta: 'Mercurio', inicio: '2026-05-18', fin: '2026-06-11', signo: 'Géminis', consejo: 'Reorganiza tus pensamientos, evita firmar documentos, reconecta con amigos.' },
  { planeta: 'Mercurio', inicio: '2026-09-14', fin: '2026-10-07', signo: 'Libra', consejo: 'Revisa relaciones, evita compromisos nuevos, comunica con diplomacia extra.' },
  { planeta: 'Venus', inicio: '2026-03-01', fin: '2026-04-12', signo: 'Aries', consejo: 'Revisa relaciones pasadas, evita compras grandes, trabaja el amor propio.' },
  { planeta: 'Marte', inicio: '2026-07-22', fin: '2026-09-21', signo: 'Capricornio', consejo: 'Reorganiza proyectos, evita iniciar guerras, dirige la energía hacia dentro.' },
]

export function getRetrogradosActivos(): typeof RETROGRADOS_2026 {
  const hoy = new Date()
  return RETROGRADOS_2026.filter(r => {
    const inicio = new Date(r.inicio)
    const fin = new Date(r.fin)
    return hoy >= inicio && hoy <= fin
  })
}

export function getLunaEnSignoHoy(): string {
  const hoy = new Date()
  const SIGNOS = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis']
  const diasDesde2000 = Math.floor((hoy.getTime() - new Date('2000-01-06').getTime()) / (1000 * 60 * 60 * 24))
  const ciclo = diasDesde2000 % 354
  const idx = Math.floor(ciclo / (354 / 12))
  return SIGNOS[idx % 12]
}