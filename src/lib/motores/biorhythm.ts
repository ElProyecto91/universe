export type FaseBiorritmo = 'alta' | 'ascenso' | 'descenso' | 'baja'

export interface LecturaBiorritmos {
  fisico: string
  emocional: string
  intelectual: string
  consejo: string
}

const TEXTOS_FISICO: Record<FaseBiorritmo, string[]> = {
  alta: [
    'Tu cuerpo opera hoy con una vitalidad excepcional. La energía física fluye sin resistencia — úsala para lo que exige más de ti.',
    'Tu resistencia física está en su punto más alto. Es el momento ideal para el esfuerzo sostenido y los retos corporales.',
    'La fuerza que sientes hoy no es casualidad. Tu ciclo físico alcanza su cima — muévete, actúa, rinde.',
  ],
  ascenso: [
    'Tu energía física lleva días creciendo y hoy se nota. El cuerpo responde con más agilidad de lo habitual.',
    'Estás en la fase ascendente de tu ciclo físico. Cada día que pasa tienes más capacidad — aprovecha el impulso.',
    'Tu vitalidad aumenta progresivamente. Lo que ayer costaba más, hoy fluye con mayor facilidad.',
  ],
  descenso: [
    'Tu ciclo físico comienza a descender. No es debilidad — es el cuerpo pidiendo que ajustes la intensidad.',
    'La energía física mengua gradualmente. Escucha las señales de tu cuerpo y no fuerces lo que no fluye.',
    'Estás en la fase de descenso físico. Mantén el movimiento, pero sin exigirte el máximo de otros días.',
  ],
  baja: [
    'Tu ciclo físico está en su punto más bajo. El cuerpo necesita recuperación — el descanso hoy es tan productivo como el esfuerzo.',
    'Es un día de restitución física. No lo interpretes como fracaso: los ciclos bajos son donde el cuerpo se regenera.',
    'Tu energía corporal pide pausa. Honrar ese ritmo es inteligencia, no rendición.',
  ],
}

const TEXTOS_EMOCIONAL: Record<FaseBiorritmo, string[]> = {
  alta: [
    'Tu mundo emocional brilla hoy con claridad. Las relaciones fluyen y la conexión con los demás se siente genuina y profunda.',
    'Estás en el punto más luminoso de tu ciclo emocional. Tu capacidad de dar y recibir afecto es extraordinaria hoy.',
    'Las emociones te llevan hoy hacia donde necesitas ir. Confía en lo que sientes — tu corazón está calibrado.',
  ],
  ascenso: [
    'Tu estado emocional mejora progresivamente. Lo que antes pesaba, ahora se lleva con más ligereza.',
    'El ciclo emocional asciende. Notarás más apertura, más disposición a conectar y más claridad interior.',
    'Tu mundo interior gana equilibrio cada día. Hoy es un buen momento para retomar conversaciones pendientes.',
  ],
  descenso: [
    'Tu ciclo emocional empieza a bajar. Es normal sentir algo más de sensibilidad o menor tolerancia — obsérvalo sin juzgarlo.',
    'Las emociones pueden ser algo más intensas o inestables hoy. No tomes decisiones importantes desde ese lugar.',
    'Estás en la fase de descenso emocional. El autocuidado y la calma son tus mejores aliados ahora.',
  ],
  baja: [
    'Tu ciclo emocional está en su punto más vulnerable. Busca entornos seguros y personas que te recarguen, no que te drenen.',
    'Es un día para la introspección más que para la exposición. Tu mundo interior necesita silencio y gentileza.',
    'Las emociones en su fase baja piden paciencia. Lo que sientes hoy es temporal — el ciclo siempre asciende.',
  ],
}

const TEXTOS_INTELECTUAL: Record<FaseBiorritmo, string[]> = {
  alta: [
    'Tu mente opera hoy con una claridad y velocidad poco habituales. Es el día ideal para las decisiones complejas y el pensamiento profundo.',
    'El ciclo intelectual está en su cima. Analiza, decide, crea — tu capacidad cognitiva rara vez estará tan afilada.',
    'La agudeza mental de hoy es un recurso valioso. Úsala para los problemas que llevan tiempo esperando solución.',
  ],
  ascenso: [
    'Tu mente gana claridad día a día. Las ideas conectan con más facilidad y el foco mejora notablemente.',
    'El ciclo intelectual asciende. Es buen momento para aprender algo nuevo o retomar un proyecto que exige concentración.',
    'Tu capacidad analítica mejora progresivamente. Lo que antes parecía confuso empieza a tener forma.',
  ],
  descenso: [
    'Tu ciclo intelectual comienza a bajar. Evita las decisiones irreversibles y apóyate en notas y recordatorios.',
    'La mente no está en su momento más agudo. Prioriza tareas mecánicas y deja las que exigen máxima concentración para otro día.',
    'El pensamiento puede ser algo más lento hoy. No es el momento de exigirte brillantez — es el momento de consolidar.',
  ],
  baja: [
    'Tu ciclo intelectual está en su punto más bajo. El cerebro procesa más despacio — es normal y pasajero.',
    'Hoy no es el día para las grandes decisiones ni los análisis complejos. Simplifica, delega, descansa la mente.',
    'La mente en su fase baja necesita estímulos suaves. Una lectura ligera o una conversación tranquila la nutren mejor que el esfuerzo forzado.',
  ],
}

const TEXTOS_CONSEJO: Record<string, string[]> = {
  'alta-alta-alta': [
    'Tus tres ciclos alcanzan hoy su punto máximo simultáneamente. Días así son raros — aprovecha cada hora.',
    'La alineación de los tres ciclos en su cima ocurre pocas veces. Actúa con todo lo que tienes hoy.',
  ],
  'baja-baja-baja': [
    'Los tres ciclos coinciden en su punto más bajo. Tómalo como una señal clara: hoy es día de pausa total y regeneración.',
    'Cuando los tres ritmos descansan a la vez, el cuerpo y la mente piden lo mismo. Escúchalos sin resistencia.',
  ],
  default: [
    'Usa tu energía más alta para las tareas que más la exigen, y reserva los momentos de menor impulso para el descanso o las tareas rutinarias.',
    'Conocer tus ciclos es una ventaja real. Planifica tu día según dónde está cada ritmo y notarás la diferencia.',
    'La clave no es forzar los ciclos bajos ni desperdiciar los altos. Sincroniza tus acciones con tu energía natural.',
    'Cada ciclo tiene su propósito. Los altos para avanzar, los bajos para integrar. Ambos son necesarios.',
  ],
}

function getFase(valor: number): FaseBiorritmo {
  if (valor > 0.5)  return 'alta'
  if (valor > 0)    return 'ascenso'
  if (valor > -0.5) return 'descenso'
  return 'baja'
}

export function calcularBiorritmos(fechaNacimiento: string): {
  fases: { fisico: FaseBiorritmo; emocional: FaseBiorritmo; intelectual: FaseBiorritmo }
  valores: { fisico: number; emocional: number; intelectual: number }
} {
  const nac  = new Date(fechaNacimiento).getTime()
  const hoy  = new Date().setHours(0, 0, 0, 0)
  const dias = Math.floor((hoy - nac) / 86400000)

  const vFisico      = Math.sin(2 * Math.PI * dias / 23)
  const vEmocional   = Math.sin(2 * Math.PI * dias / 28)
  const vIntelectual = Math.sin(2 * Math.PI * dias / 33)

  return {
    fases: {
      fisico:      getFase(vFisico),
      emocional:   getFase(vEmocional),
      intelectual: getFase(vIntelectual),
    },
    valores: {
      fisico:      Math.round(vFisico * 100),
      emocional:   Math.round(vEmocional * 100),
      intelectual: Math.round(vIntelectual * 100),
    },
  }
}

export function getLecturaBiorritmos(fechaNacimiento: string): LecturaBiorritmos {
  const { fases } = calcularBiorritmos(fechaNacimiento)
  const hoy     = new Date()
  const semilla = hoy.getFullYear() * 10000 + (hoy.getMonth() + 1) * 100 + hoy.getDate()

  const claveConsejo  = `${fases.fisico}-${fases.emocional}-${fases.intelectual}`
  const textosConsejo = TEXTOS_CONSEJO[claveConsejo] ?? TEXTOS_CONSEJO.default

  return {
    fisico:      TEXTOS_FISICO[fases.fisico][semilla % TEXTOS_FISICO[fases.fisico].length],
    emocional:   TEXTOS_EMOCIONAL[fases.emocional][semilla % TEXTOS_EMOCIONAL[fases.emocional].length],
    intelectual: TEXTOS_INTELECTUAL[fases.intelectual][semilla % TEXTOS_INTELECTUAL[fases.intelectual].length],
    consejo:     textosConsejo[semilla % textosConsejo.length],
  }
}