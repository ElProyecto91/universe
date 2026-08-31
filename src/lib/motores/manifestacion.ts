export const METODOS_MANIFESTACION = [
  {
    id: '369',
    nombre: 'Método 369',
    descripcion: 'Escribe tu deseo 3 veces por la mañana, 6 veces al mediodía y 9 veces por la noche durante 33 días.',
    instrucciones: [
      'Escribe tu afirmación en presente positivo ("Tengo...", "Soy...", "Estoy...")',
      'Por la mañana: escríbela 3 veces con gratitud',
      'Al mediodía: escríbela 6 veces visualizando que ya es real',
      'Por la noche: escríbela 9 veces sintiéndote como si ya lo tuvieras',
      'Repite durante 33 días consecutivos',
    ],
    origen: 'Inspirado en la numerología de Nikola Tesla (3-6-9)',
  },
  {
    id: 'scripting',
    nombre: 'Scripting',
    descripcion: 'Escribe en tiempo pasado como si tu deseo ya se hubiera cumplido, describiendo cómo te sientes.',
    instrucciones: [
      'Elige una intención específica y alcanzable',
      'Escribe en tiempo pasado: "Hoy fue increíble porque..."',
      'Incluye detalles sensoriales: qué ves, oyes, sientes',
      'Expresa gratitud genuina por haber recibido',
      'Hazlo durante 10-15 minutos cada mañana',
    ],
    origen: 'Ley de Atracción · Abraham-Hicks',
  },
  {
    id: 'luna',
    nombre: 'Ritual de Luna Nueva',
    descripcion: 'La luna nueva es el momento más poderoso para plantar intenciones del próximo ciclo.',
    instrucciones: [
      'En luna nueva, escribe 10 deseos en presente positivo',
      'Sé específico pero no limitante',
      'Lee tus intenciones en voz alta bajo el cielo nocturno',
      'Dobla el papel y consérvalo hasta la luna llena',
      'En luna llena, quema o entierra el papel con gratitud',
    ],
    origen: 'Tradición lunar · Wicca y paganismo moderno',
  },
  {
    id: 'vision-board',
    nombre: 'Vision Board',
    descripcion: 'Un tablero visual de tus metas que programa tu mente subconsciente.',
    instrucciones: [
      'Elige imágenes, palabras y símbolos que representen tu vida ideal',
      'Organízalos en categorías: amor, trabajo, salud, hogar, espiritualidad',
      'Colócalo donde lo veas cada mañana',
      'Dedica 2 minutos cada día a visualizar que ya es tu realidad',
      'Actualízalo cuando manifiestes algo o cambien tus deseos',
    ],
    origen: 'Psicología cognitiva · Ley de Atracción',
  },
]

export const PROMPTS_DIARIO: Record<string, string[]> = {
  gratitud: [
    '¿Cuáles son las 3 cosas más pequeñas de hoy por las que sientes gratitud genuina?',
    '¿Qué persona en tu vida merece más gratitud de la que le expresas? ¿Por qué?',
    '¿Qué obstáculo reciente en realidad te ha regalado algo valioso?',
    '¿Qué parte de tu cuerpo merece tu gratitud hoy y por qué?',
    '¿Qué experiencia difícil del pasado ahora ves como una bendición?',
  ],
  intencion: [
    '¿Cuál es la versión de ti mismo que quieres encarnar esta semana?',
    '¿Qué necesitas soltar para que lo que deseas tenga espacio para llegar?',
    '¿Si supieras que no puedes fallar, qué intentarías hoy?',
    '¿Qué intención de las últimas semanas ya está manifestándose, aunque sea sutilmente?',
    '¿Cuál es el próximo paso más pequeño hacia tu deseo más importante?',
  ],
  reflexion: [
    '¿Qué patrón de pensamiento has notado esta semana que no te sirve?',
    '¿En qué momento de hoy te sentiste más alineado con quien quieres ser?',
    '¿Qué creencia sobre ti mismo está limitando tu manifestación?',
    '¿Cómo reaccionarías ante esta situación si ya fueras la persona que quieres ser?',
    '¿Qué te dice tu cuerpo que tu mente no quiere escuchar?',
  ],
}

export function getPromptDelDia(tipo: keyof typeof PROMPTS_DIARIO): string {
  const hoy = new Date()
  const semilla = hoy.getFullYear() * 10000 + (hoy.getMonth() + 1) * 100 + hoy.getDate()
  const prompts = PROMPTS_DIARIO[tipo]
  return prompts[semilla % prompts.length]
}