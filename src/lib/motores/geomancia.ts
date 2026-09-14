export type FiguraGeomantica = {
  nombre: string
  nombreArabe: string
  nombreLatin: string
  simbolo: string
  planeta: string
  elemento: string
  energia: string
  mensaje: string
  patron: [number, number, number, number] // 1=impar(●), 2=par(●●) × 4 filas
}

export const FIGURAS_GEOMANTICAS: FiguraGeomantica[] = [
  {
    nombre: 'Via',
    nombreArabe: 'الطريق',
    nombreLatin: 'Via',
    simbolo: '⊕',
    planeta: 'Luna',
    elemento: 'Agua',
    energia: 'Camino · Movimiento · Viaje',
    patron: [2, 2, 2, 2],
    mensaje: 'Via señala un camino abierto y en movimiento. Lo que consultas está en transición — nada está fijo todavía. El movimiento es la respuesta: avanza, no esperes.',
  },
  {
    nombre: 'Populus',
    nombreArabe: 'الجماعة',
    nombreLatin: 'Populus',
    simbolo: '⊗',
    planeta: 'Luna',
    elemento: 'Agua',
    energia: 'Colectivo · Masa · Neutralidad',
    patron: [1, 2, 2, 2],
    mensaje: 'Populus representa la masa y la neutralidad. La situación refleja lo que el entorno colectivo dicta. Busca tu voz individual dentro del grupo — la respuesta no está en seguir a la mayoría.',
  },
  {
    nombre: 'Albus',
    nombreArabe: 'الأبيض',
    nombreLatin: 'Albus',
    simbolo: '☽',
    planeta: 'Mercurio',
    elemento: 'Aire',
    energia: 'Claridad · Sabiduría · Paz',
    patron: [2, 2, 1, 2],
    mensaje: 'Albus trae claridad y mente despejada. La sabiduría que necesitas ya está en ti — este es el momento de confiar en el pensamiento claro y las palabras precisas. La paz es posible.',
  },
  {
    nombre: 'Conjunctio',
    nombreArabe: 'الاجتماع',
    nombreLatin: 'Conjunctio',
    simbolo: '✕',
    planeta: 'Mercurio',
    elemento: 'Aire',
    energia: 'Unión · Encuentro · Recuperación',
    patron: [2, 1, 1, 2],
    mensaje: 'Conjunctio anuncia un encuentro o reunión. Lo que se había separado puede volver a unirse. Presta atención a las conexiones que se forman — una de ellas tiene el poder de cambiar el resultado.',
  },
  {
    nombre: 'Puella',
    nombreArabe: 'البنت',
    nombreLatin: 'Puella',
    simbolo: '♀',
    planeta: 'Venus',
    elemento: 'Agua',
    energia: 'Belleza · Armonía · Amor',
    patron: [2, 1, 2, 1],
    mensaje: 'Puella trae belleza, armonía y amor. La situación se beneficia de la suavidad y la receptividad. No forces — deja que la situación fluya hacia su forma natural más bella.',
  },
  {
    nombre: 'Amissio',
    nombreArabe: 'الخسارة',
    nombreLatin: 'Amissio',
    simbolo: '↓',
    planeta: 'Venus',
    elemento: 'Fuego',
    energia: 'Pérdida · Liberación · Soltar',
    patron: [1, 2, 2, 1],
    mensaje: 'Amissio señala pérdida o liberación. Lo que se va no puede ser retenido — pero lo que se suelta con gracia deja espacio para algo mejor. La pérdida de hoy es la liberación de mañana.',
  },
  {
    nombre: 'Fortuna Major',
    nombreArabe: 'النصرة الداخلة',
    nombreLatin: 'Fortuna Major',
    simbolo: '☀',
    planeta: 'Sol',
    elemento: 'Fuego',
    energia: 'Gran fortuna · Éxito · Protección interior',
    patron: [2, 1, 1, 1],
    mensaje: 'Fortuna Major anuncia gran fortuna que viene desde dentro. El éxito que buscas está ya en tu interior — tus propias capacidades son la fuente de la buena suerte. Confía en ti.',
  },
  {
    nombre: 'Fortuna Minor',
    nombreArabe: 'النصرة الخارجة',
    nombreLatin: 'Fortuna Minor',
    simbolo: '◑',
    planeta: 'Sol',
    elemento: 'Fuego',
    energia: 'Fortuna externa · Rapidez · Ayuda',
    patron: [1, 2, 1, 2],
    mensaje: 'Fortuna Minor trae buena suerte rápida que viene del exterior. Una persona, circunstancia o evento externo actúa a tu favor. Mantente receptivo a la ayuda que llega desde fuera.',
  },
  {
    nombre: 'Puer',
    nombreArabe: 'الفتى',
    nombreLatin: 'Puer',
    simbolo: '♂',
    planeta: 'Marte',
    elemento: 'Fuego',
    energia: 'Acción · Impulsividad · Valor',
    patron: [1, 1, 2, 1],
    mensaje: 'Puer trae energía de acción e impulso. La situación exige valentía y decisión rápida. El exceso de reflexión es el único peligro aquí — actúa con valor y sin titubear.',
  },
  {
    nombre: 'Rubeus',
    nombreArabe: 'الأحمر',
    nombreLatin: 'Rubeus',
    simbolo: '⬡',
    planeta: 'Marte',
    elemento: 'Fuego',
    energia: 'Pasión · Peligro · Transformación por fuego',
    patron: [2, 1, 1, 1],
    mensaje: 'Rubeus advierte de pasiones intensas y peligro potencial. La energía presente es poderosa pero puede quemarte si no la canalizas. Actúa con consciencia — el fuego transforma o destruye según quien lo maneja.',
  },
  {
    nombre: 'Acquisitio',
    nombreArabe: 'الربح',
    nombreLatin: 'Acquisitio',
    simbolo: '↑',
    planeta: 'Júpiter',
    elemento: 'Aire',
    energia: 'Ganancia · Abundancia · Logro',
    patron: [1, 2, 1, 1],
    mensaje: 'Acquisitio es la figura de la ganancia y la abundancia. Lo que buscas puede obtenerse — las condiciones son favorables. Actúa con intención clara y la recompensa llegará.',
  },
  {
    nombre: 'Laetitia',
    nombreArabe: 'الفرح',
    nombreLatin: 'Laetitia',
    simbolo: '☺',
    planeta: 'Júpiter',
    elemento: 'Aire',
    energia: 'Alegría · Expansión · Optimismo',
    patron: [1, 1, 2, 2],
    mensaje: 'Laetitia trae alegría genuina y expansión. La situación se mueve hacia un resultado positivo — confía en el proceso. La ligereza y el optimismo son las herramientas correctas ahora.',
  },
  {
    nombre: 'Tristitia',
    nombreArabe: 'الحزن',
    nombreLatin: 'Tristitia',
    simbolo: '☹',
    planeta: 'Saturno',
    elemento: 'Tierra',
    energia: 'Tristeza · Restricción · Profundidad',
    patron: [2, 2, 1, 1],
    mensaje: 'Tristitia señala un período de restricción o tristeza interior. No es un mal augurio sino una invitación a la profundidad. Lo que se aprende en los momentos difíciles tiene raíces más hondas.',
  },
  {
    nombre: 'Carcer',
    nombreArabe: 'الحبس',
    nombreLatin: 'Carcer',
    simbolo: '⬛',
    planeta: 'Saturno',
    elemento: 'Tierra',
    energia: 'Límite · Restricción · Necesidad de paciencia',
    patron: [1, 1, 1, 1],
    mensaje: 'Carcer indica una situación de límites y restricción. No es el momento de forzar la salida — la paciencia y la aceptación son la clave. Lo que parece una prisión puede ser también un lugar de concentración y preparación.',
  },
  {
    nombre: 'Caput Draconis',
    nombreArabe: 'رأس الجوزهر',
    nombreLatin: 'Caput Draconis',
    simbolo: '☊',
    planeta: 'Nodo Norte',
    elemento: 'Tierra/Aire',
    energia: 'Entrada · Inicio favorable · Crecimiento',
    patron: [1, 1, 2, 1],
    mensaje: 'Caput Draconis marca una entrada favorable y un inicio lleno de potencial. Lo que comienza ahora tiene el viento a favor. Es el momento de iniciar, entrar y abrirse a lo nuevo.',
  },
  {
    nombre: 'Cauda Draconis',
    nombreArabe: 'ذنب الجوزهر',
    nombreLatin: 'Cauda Draconis',
    simbolo: '☋',
    planeta: 'Nodo Sur',
    elemento: 'Fuego/Agua',
    energia: 'Salida · Cierre · Liberación final',
    patron: [1, 2, 1, 1],
    mensaje: 'Cauda Draconis marca una salida o cierre necesario. Lo que debe terminar, termina. No te aferres a lo que pide ser liberado — la puerta que se cierra aquí abre otra en otro lugar.',
  },
]

export function lanzarFigura(): FiguraGeomantica {
  // 4 filas, cada una par(2) o impar(1) según puntos al azar
  const patron: [number, number, number, number] = [
    Math.random() > 0.5 ? 1 : 2,
    Math.random() > 0.5 ? 1 : 2,
    Math.random() > 0.5 ? 1 : 2,
    Math.random() > 0.5 ? 1 : 2,
  ]
  // Busca la figura que coincide con el patrón
  const figura = FIGURAS_GEOMANTICAS.find(f =>
    f.patron[0] === patron[0] &&
    f.patron[1] === patron[1] &&
    f.patron[2] === patron[2] &&
    f.patron[3] === patron[3]
  )
  // Fallback aleatorio si no hay match exacto
  return figura ?? FIGURAS_GEOMANTICAS[Math.floor(Math.random() * FIGURAS_GEOMANTICAS.length)]
}

export function renderizarPatron(patron: [number, number, number, number]): string[] {
  return patron.map(p => p === 1 ? '●' : '● ●')
}