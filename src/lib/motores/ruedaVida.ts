export const AREAS_RUEDA = [
  {
    id: 'amor',
    nombre: 'Amor y Relaciones',
    simbolo: '❤️',
    color: '#f472b6',
    preguntas: [
      '¿Tus relaciones más importantes te nutren y te inspiran?',
      '¿Te sientes amado y valorado por quien más importa?',
      '¿Puedes mostrarte vulnerable en tus relaciones?',
    ],
    perspectiva: 'Venus · Chakra del corazón · Casa VII y VIII',
  },
  {
    id: 'trabajo',
    nombre: 'Trabajo y Carrera',
    simbolo: '💼',
    color: '#f59e0b',
    preguntas: [
      '¿Tu trabajo te da sentido y satisfacción genuina?',
      '¿Te sientes reconocido y compensado justamente?',
      '¿Estás usando tus talentos más profundos?',
    ],
    perspectiva: 'Saturno · Chakra del plexo solar · Casa X',
  },
  {
    id: 'dinero',
    nombre: 'Dinero y Abundancia',
    simbolo: '💰',
    color: '#22c55e',
    preguntas: [
      '¿Tu situación financiera te da seguridad y libertad?',
      '¿Tu relación con el dinero es sana y sin culpa?',
      '¿Puedes cubrir tus necesidades y algunos deseos?',
    ],
    perspectiva: 'Júpiter · Chakra raíz · Casa II y VIII',
  },
  {
    id: 'salud',
    nombre: 'Salud y Bienestar',
    simbolo: '🌿',
    color: '#34d399',
    preguntas: [
      '¿Tu cuerpo tiene la energía que necesitas para vivir bien?',
      '¿Cuidas tu salud mental con la misma atención que la física?',
      '¿Tu sueño, alimentación y movimiento son satisfactorios?',
    ],
    perspectiva: 'Virgo · Chakra del plexo solar · Casa VI',
  },
  {
    id: 'familia',
    nombre: 'Familia y Hogar',
    simbolo: '🏠',
    color: '#fb923c',
    preguntas: [
      '¿Tu hogar es un espacio que te nutre y te recarga?',
      '¿Tus relaciones familiares te dan apoyo o te drenan?',
      '¿Tienes claridad sobre lo que quieres construir como hogar?',
    ],
    perspectiva: 'Luna · Chakra raíz · Casa IV',
  },
  {
    id: 'crecimiento',
    nombre: 'Crecimiento Personal',
    simbolo: '🌱',
    color: '#a78bfa',
    preguntas: [
      '¿Estás aprendiendo y creciendo de forma continua?',
      '¿Tienes prácticas de autoconocimiento regulares?',
      '¿Estás trabajando en tus sombras y limitaciones?',
    ],
    perspectiva: 'Júpiter · Todos los chakras · Casa IX',
  },
  {
    id: 'espiritualidad',
    nombre: 'Espiritualidad',
    simbolo: '✨',
    color: '#c084fc',
    preguntas: [
      '¿Tienes una práctica espiritual que te nutra?',
      '¿Sientes conexión con algo más grande que tú mismo?',
      '¿Tu vida tiene sentido y propósito más allá del éxito material?',
    ],
    perspectiva: 'Neptuno · Chakra corona · Casa XII',
  },
  {
    id: 'social',
    nombre: 'Vida Social y Comunidad',
    simbolo: '👥',
    color: '#60a5fa',
    preguntas: [
      '¿Tu círculo social te inspira y te eleva?',
      '¿Tienes amistades genuinas con quienes ser tú mismo?',
      '¿Contribuyes a algo más grande que tú en tu comunidad?',
    ],
    perspectiva: 'Acuario · Chakra del corazón · Casa XI',
  },
]

export function calcularRueda(puntuaciones: Record<string, number>) {
  const areas = AREAS_RUEDA.map(area => ({
    ...area,
    puntuacion: puntuaciones[area.id] || 0,
  }))

  const promedio = areas.reduce((sum, a) => sum + a.puntuacion, 0) / areas.length
  const masBaja = areas.sort((a, b) => a.puntuacion - b.puntuacion)[0]
  const masAlta = [...areas].sort((a, b) => b.puntuacion - a.puntuacion)[0]

  return { areas, promedio: Math.round(promedio * 10) / 10, masBaja, masAlta }
}