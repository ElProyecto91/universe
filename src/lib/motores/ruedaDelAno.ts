export type Sabbat = {
  nombre: string
  nombreIngles: string
  fecha: string
  hemisferio: 'norte'
  descripcion: string
  temas: string[]
  practica: string
  tarot: string
  runa: string
  color: string
}

export const SABBATS: Sabbat[] = [
  {
    nombre: 'Samhain',
    nombreIngles: 'Samhain',
    fecha: '31 octubre — 1 noviembre',
    hemisferio: 'norte',
    descripcion: 'El velo entre los mundos se adelgaza. Es el Año Nuevo celta, el momento de honrar a los ancestros y reflexionar sobre lo que termina para que algo nuevo pueda comenzar.',
    temas: ['Ancestros', 'Muerte y renacimiento', 'Lo que termina', 'El mundo invisible'],
    practica: 'Honra a quienes ya no están. Escribe los nombres de tus ancestros. Reflexiona sobre qué necesitas soltar antes de que comience el nuevo ciclo.',
    tarot: 'La Muerte · El Ermitaño',
    runa: 'ᛟ Othala — herencia y ancestros',
    color: '#7c3aed',
  },
  {
    nombre: 'Yule',
    nombreIngles: 'Yule',
    fecha: '21-22 diciembre',
    hemisferio: 'norte',
    descripcion: 'El solsticio de invierno. La noche más larga del año. A partir de aquí, la luz regresa. Es el momento de la esperanza en la oscuridad, del renacimiento del sol.',
    temas: ['Renacimiento', 'Esperanza', 'La luz que regresa', 'Introspección profunda'],
    practica: 'Enciende una vela en la oscuridad. Reflexiona sobre las semillas que quieres plantar en el nuevo ciclo. Celebra que la luz siempre regresa.',
    tarot: 'La Estrella · El Sol',
    runa: 'ᛞ Dagaz — el amanecer y la transformación',
    color: '#1e40af',
  },
  {
    nombre: 'Imbolc',
    nombreIngles: 'Imbolc',
    fecha: '1-2 febrero',
    hemisferio: 'norte',
    descripcion: 'Los primeros signos de la primavera que llega. La diosa Brigid trae la inspiración creativa, la sanación y el fuego sagrado. Es el momento de las primeras intenciones del año.',
    temas: ['Primeros brotes', 'Inspiración', 'Purificación', 'Nuevos comienzos'],
    practica: 'Limpia tu espacio físico y mental. Escribe tus intenciones creativas para el año. Enciende una vela blanca por la sanación.',
    tarot: 'El Mago · La Emperatriz',
    runa: 'ᛒ Berkano — crecimiento y fertilidad',
    color: '#ffffff',
  },
  {
    nombre: 'Ostara',
    nombreIngles: 'Ostara',
    fecha: '20-21 marzo',
    hemisferio: 'norte',
    descripcion: 'El equinoccio de primavera. La luz y la oscuridad están en perfecto equilibrio. La naturaleza despierta y todo florece. Momento de equilibrio, acción y nuevos comienzos.',
    temas: ['Equilibrio', 'Florecimiento', 'Fertilidad', 'Acción'],
    practica: 'Planta algo — literalmente o metafóricamente. ¿Qué proyecto quieres ver florecer esta primavera? Da un primer paso concreto hoy.',
    tarot: 'El Loco · La Emperatriz',
    runa: 'ᛜ Ingwaz — potencial que emerge',
    color: '#22c55e',
  },
  {
    nombre: 'Beltane',
    nombreIngles: 'Beltane',
    fecha: '30 abril — 1 mayo',
    hemisferio: 'norte',
    descripcion: 'El fuego de Bel, el dios solar. La primavera está en su apogeo, todo florece y se une. Es la celebración de la vitalidad, el amor y la creatividad en su máxima expresión.',
    temas: ['Amor', 'Vitalidad', 'Creatividad', 'Unión'],
    practica: 'Celebra lo que amas. Baila, canta, crea algo con tus manos. Expresa tu vitalidad sin censura. ¿Qué te da más vida?',
    tarot: 'Los Amantes · La Fuerza',
    runa: 'ᚠ Fehu — abundancia y vitalidad',
    color: '#ef4444',
  },
  {
    nombre: 'Litha',
    nombreIngles: 'Litha',
    fecha: '21-22 junio',
    hemisferio: 'norte',
    descripcion: 'El solsticio de verano. El sol está en su punto más alto. Después de hoy, la luz comenzará a decrecer. Es el momento de máxima energía, claridad y celebración.',
    temas: ['Máxima energía', 'Logros', 'Claridad', 'Abundancia'],
    practica: 'Celebra lo que has logrado hasta ahora. ¿Qué ha florecido en tu vida este año? Toma nota de tus victorias, grandes y pequeñas.',
    tarot: 'El Sol · La Rueda de la Fortuna',
    runa: 'ᛋ Sowilo — el sol victorioso',
    color: '#f59e0b',
  },
  {
    nombre: 'Lughnasadh',
    nombreIngles: 'Lughnasadh',
    fecha: '1-2 agosto',
    hemisferio: 'norte',
    descripcion: 'La primera cosecha. El dios Lugh celebra la abundancia. Es el momento de agradecer los frutos del trabajo y reconocer que el ciclo comienza a girar hacia el reposo.',
    temas: ['Primera cosecha', 'Gratitud', 'Trabajo completado', 'Compartir'],
    practica: 'Haz una lista de todo lo que has cosechado este año. Comparte algo con alguien. Agradece el trabajo que te ha traído hasta aquí.',
    tarot: 'La Rueda de la Fortuna · La Justicia',
    runa: 'ᛃ Jera — la cosecha y los ciclos',
    color: '#d97706',
  },
  {
    nombre: 'Mabon',
    nombreIngles: 'Mabon',
    fecha: '22-23 septiembre',
    hemisferio: 'norte',
    descripcion: 'El equinoccio de otoño. La segunda cosecha. La luz y la oscuridad se equilibran de nuevo antes de que el invierno llegue. Es momento de gratitud y de prepararse para el descanso.',
    temas: ['Segunda cosecha', 'Equilibrio', 'Gratitud', 'Preparación para el invierno'],
    practica: 'Reflexiona sobre lo que ha dado fruto y lo que no. Agradece ambos. Prepara tu espacio interior para el período de reflexión que se acerca.',
    tarot: 'La Justicia · El Ermitaño',
    runa: 'ᛚ Laguz — fluir con los ciclos',
    color: '#b45309',
  },
]

export function getSabbatActual(): Sabbat & { diasHasta: number } {
  const hoy = new Date()
  const año = hoy.getFullYear()

  const fechasSabbats = [
    { idx: 0, mes: 10, dia: 31 },
    { idx: 1, mes: 11, dia: 21 },
    { idx: 2, mes: 1, dia: 1 },
    { idx: 3, mes: 2, dia: 20 },
    { idx: 4, mes: 4, dia: 30 },
    { idx: 5, mes: 5, dia: 21 },
    { idx: 6, mes: 7, dia: 1 },
    { idx: 7, mes: 8, dia: 22 },
  ]

  let proximoIdx = 0
  let diasHasta = 999

  for (const s of fechasSabbats) {
    const fechaSabbat = new Date(año, s.mes, s.dia)
    if (fechaSabbat < hoy) fechaSabbat.setFullYear(año + 1)
    const diff = Math.ceil((fechaSabbat.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
    if (diff < diasHasta) {
      diasHasta = diff
      proximoIdx = s.idx
    }
  }

  return { ...SABBATS[proximoIdx], diasHasta }
}