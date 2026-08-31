const MENSAJES_SIGNOS: Record<string, {
  hoy: string[]
  amor: string[]
  trabajo: string[]
  energia: string[]
}> = {
  Aries: {
    hoy: [
      'Tu energía de Aries pide acción hoy. No analices en exceso — confía en tu primer impulso.',
      'El fuego de Aries arde fuerte. Usa esa energía para iniciar algo que llevas posponiendo.',
      'Aries necesita movimiento. La quietud forzada te agota más que la acción.',
    ],
    amor: [
      'Tu directness es un regalo en el amor. Hoy, di lo que sientes sin rodeos.',
      'La pasión de Aries puede quemar o calentar. Elige conscientemente su intensidad hoy.',
      'El amor necesita también escucha. Hoy, deja hablar antes de responder.',
    ],
    trabajo: [
      'Tu capacidad de liderazgo brilla hoy. Toma la iniciativa en lugar de esperar permiso.',
      'Aries en el trabajo: la velocidad es tu virtud, la impaciencia tu sombra. Equilibra ambas.',
      'Un proyecto nuevo te llama. La energía de Aries es perfecta para empezar, no para terminar — recuérdalo.',
    ],
    energia: ['Alta · Iniciadora · Impaciente', 'Vibrante · Directa · Impulsiva', 'Pionera · Apasionada · Urgente'],
  },
  Tauro: {
    hoy: [
      'La energía de Tauro pide presencia hoy. Siente el suelo bajo tus pies, la comida en tu boca, la textura de las cosas.',
      'Tauro sabe que lo duradero se construye despacio. Hoy, no te apresures.',
      'Tu conexión con lo bello es un superpoder. Rodéate de belleza y productividad seguirá.',
    ],
    amor: [
      'Tauro ama con constancia. Hoy, un pequeño gesto cotidiano vale más que un gran gesto ocasional.',
      'La sensualidad de Tauro es un don. Hoy, conecta con tu pareja a través de los sentidos.',
      'La seguridad que buscas en el amor empieza por la seguridad que te das a ti mismo.',
    ],
    trabajo: [
      'Tu paciencia y determinación son tus mayores activos profesionales hoy.',
      'Tauro en el trabajo: construyes para durar. No te dejes presionar por quienes quieren resultados inmediatos.',
      'Hoy es buen día para consolidar lo que ya tienes, no para expandirte.',
    ],
    energia: ['Estable · Sensual · Paciente', 'Firme · Constante · Placentera', 'Anclada · Nutritiva · Persistente'],
  },
  Géminis: {
    hoy: [
      'Tu mente de Géminis procesa más información que la mayoría. Hoy, filtra: no todo merece tu atención.',
      'La curiosidad de Géminis es tu motor. Sigue el hilo de lo que te fascina hoy.',
      'Géminis necesita variedad. Si te sientes inquieto, cambia de entorno, de tarea o de interlocutor.',
    ],
    amor: [
      'La comunicación es tu lenguaje del amor. Hoy, una conversación honesta puede cambiar todo.',
      'Géminis puede conectar con casi cualquiera. Hoy, conecta con profundidad en lugar de amplitud.',
      'Tu humor y tu ingenio son seductores. Úsalos, pero no los uses para evitar la vulnerabilidad.',
    ],
    trabajo: [
      'Tu versatilidad es hoy tu mayor activo. Puedes manejar varios frentes a la vez — con límites.',
      'Géminis comunica brillantemente. Hoy es buen día para presentar ideas, escribir o negociar.',
      'Tu mente saltar de idea en idea. Anótalas todas, luego elige una y termínala.',
    ],
    energia: ['Ágil · Curiosa · Dispersa', 'Mental · Comunicativa · Inquieta', 'Versátil · Brillante · Inconstante'],
  },
  Cáncer: {
    hoy: [
      'Tu intuición de Cáncer es especialmente aguda hoy. Confía en lo que sientes antes de lo que piensas.',
      'El hogar — físico o interior — es tu fuente de energía. Dedica tiempo a cuidarlo hoy.',
      'Cáncer protege a quienes ama. Hoy, asegúrate de incluirte en esa lista.',
    ],
    amor: [
      'Tu capacidad de cuidar es infinita. Hoy, permite también ser cuidado.',
      'Cáncer ama profundamente y teme el abandono. Hoy, communica ese miedo en lugar de actuar desde él.',
      'La intimidad que buscas empieza por mostrarte vulnerable con quien te merece.',
    ],
    trabajo: [
      'Tu memoria emocional y tu intuición son activos profesionales subestimados. Úsalos hoy.',
      'Cáncer crea ambientes donde otros florecen. Tu talento para el equipo brilla hoy.',
      'Hoy, protege tu energía en el trabajo. No todos merecen acceso a tu mundo interior.',
    ],
    energia: ['Intuitiva · Protectora · Sensible', 'Nutritiva · Emocional · Cíclica', 'Profunda · Memorativa · Receptiva'],
  },
  Leo: {
    hoy: [
      'El sol de Leo brilla en ti hoy. No te disculpes por ocupar espacio — irradia.',
      'Tu generosidad es legendaria. Hoy, asegúrate de que no venga de la necesidad de aprobación.',
      'Leo necesita crear y ser visto. Hoy, comparte algo tuyo con el mundo.',
    ],
    amor: [
      'Amas con grandeza y esperas lo mismo. Hoy, verifica que tus expectativas son comunicadas, no supuestas.',
      'Tu lealtad es total cuando amas. Hoy, recibe la lealtad de los demás con la misma apertura.',
      'El romance de Leo es cinematográfico. Hoy, un gesto ordinario con atención extraordinaria.',
    ],
    trabajo: [
      'Tu liderazgo natural inspira hoy. Las personas siguen a quien cree en sí mismo — y tú lo haces.',
      'Leo en el trabajo necesita reconocimiento para florecer. No es vanidad — es combustible.',
      'Hoy es buen día para presentarte, liderar o crear algo que lleve tu nombre.',
    ],
    energia: ['Radiante · Generosa · Orgullosa', 'Creativa · Magnética · Dramática', 'Solar · Leal · Expansiva'],
  },
  Virgo: {
    hoy: [
      'Tu mente analítica de Virgo ve lo que otros pasan por alto. Hoy, usa esa visión para mejorar, no para criticar.',
      'Virgo sirve porque ama. Hoy, asegúrate de que tu servicio viene de la plenitud, no del miedo.',
      'Tu atención al detalle es tu superpoder. Hoy, aplícala donde realmente importa.',
    ],
    amor: [
      'Muestras amor a través de actos de servicio. Hoy, verifica que tu pareja también lo recibe así.',
      'Virgo puede ser hipercrítico consigo mismo en el amor. Hoy, date la misma compasión que das a otros.',
      'La perfección que buscas en el amor no existe. La autenticidad sí.',
    ],
    trabajo: [
      'Tu precisión y metodología brillan hoy. Los detalles que otros ignoran son donde tú ganas.',
      'Virgo en el trabajo: excelente para analizar, mejorar y organizar. Hoy, confía en tu proceso.',
      'Hoy es buen día para revisar, editar o perfeccionar algo que ya tienes.',
    ],
    energia: ['Analítica · Precisa · Servicial', 'Metódica · Crítica · Práctica', 'Detallista · Humilde · Eficiente'],
  },
  Libra: {
    hoy: [
      'Tu búsqueda de equilibrio de Libra es sabia. Hoy, recuerda que el equilibrio no siempre es mitad y mitad.',
      'La armonía que buscas fuera empieza por la armonía interior. Hoy, ¿qué necesita ser reconciliado en ti?',
      'Libra ve todos los ángulos. Hoy, toma una decisión aunque no tengas toda la información.',
    ],
    amor: [
      'Eres un compañero extraordinario. Hoy, asegúrate de que también te cuidas a ti en la relación.',
      'Libra evita el conflicto por amor a la paz. Hoy, una conversación difícil puede traer más paz que el silencio.',
      'Tu sentido estético en el amor es fino. Hoy, crea un momento de belleza para compartir.',
    ],
    trabajo: [
      'Tu capacidad de ver todos los lados te hace un mediador natural. Hoy, ese talento es especialmente valioso.',
      'Libra en el trabajo necesita colaboración para florecer. Busca alianzas hoy.',
      'Tu sentido de la justicia es agudo. Si algo no es justo en tu entorno laboral, hoy puedes nombrarlo.',
    ],
    energia: ['Armoniosa · Diplomática · Indecisa', 'Estética · Relacional · Equilibrante', 'Justa · Sociable · Reflexiva'],
  },
  Escorpio: {
    hoy: [
      'Tu intensidad de Escorpio percibe lo que hay debajo de la superficie. Hoy, confía en esa percepción.',
      'Escorpio transforma todo lo que toca. Hoy, elige conscientemente qué quieres transformar.',
      'Tu poder es enorme. Hoy, úsalo para sanar, no para controlar.',
    ],
    amor: [
      'Amas con una profundidad que pocos pueden sostener. Hoy, da tiempo a quien está aprendiendo a hacerlo.',
      'Escorpio teme la traición más que cualquier cosa. Hoy, verifica si ese miedo está respondiendo al presente o al pasado.',
      'La intimidad que buscas requiere vulnerabilidad. Hoy, muestra una capa más de lo que normalmente muestras.',
    ],
    trabajo: [
      'Tu capacidad de investigar y encontrar lo oculto es incomparable. Hoy, esa habilidad abre puertas.',
      'Escorpio en el trabajo: estratégico, profundo, determinado. Hoy, confía en tu visión de largo plazo.',
      'Tu poder de concentración es total cuando algo te apasiona. Hoy, encuentra qué te apasiona en tu trabajo.',
    ],
    energia: ['Intensa · Transformadora · Magnética', 'Profunda · Estratégica · Apasionada', 'Penetrante · Regenerativa · Poderosa'],
  },
  Sagitario: {
    hoy: [
      'Tu visión de Sagitario ve más allá del horizonte. Hoy, comparte esa visión con alguien.',
      'La libertad es tu necesidad más profunda. Hoy, identifica qué te hace sentir libre y hazlo.',
      'Sagitario busca la verdad. Hoy, sé honesto aunque sea incómodo.',
    ],
    amor: [
      'Tu entusiasmo en el amor es contagioso. Hoy, comparte tu aventura favorita con quien amas.',
      'Sagitario necesita espacio incluso en el amor. Hoy, comunica esa necesidad con honestidad.',
      'La verdad que amas tanto puede herir si se entrega sin compasión. Hoy, combina honestidad con delicadeza.',
    ],
    trabajo: [
      'Tu visión del panorama completo es tu mayor activo profesional. Hoy, comparte esa perspectiva.',
      'Sagitario necesita sentido y propósito en el trabajo. Hoy, conecta con el por qué de lo que haces.',
      'Tu optimismo es una fuerza. Hoy, inspira a alguien que está perdiendo la fe.',
    ],
    energia: ['Expansiva · Optimista · Filosófica', 'Aventurera · Directa · Libre', 'Visionaria · Entusiasta · Impaciente'],
  },
  Capricornio: {
    hoy: [
      'Tu determinación de Capricornio es legendaria. Hoy, recuerda que el descanso también es productivo.',
      'Capricornio construye para durar. Hoy, trabaja en los cimientos, no en la fachada.',
      'Tu sentido de la responsabilidad es profundo. Hoy, asegúrate de que incluye responsabilidad hacia ti mismo.',
    ],
    amor: [
      'Muestras amor a través de actos concretos y confiables. Hoy, un pequeño gesto consistente vale más que una gran promesa.',
      'Capricornio puede parecer frío cuando en realidad es profundamente leal. Hoy, muestra esa lealtad de forma visible.',
      'El amor no es solo trabajo. Hoy, permite el juego y la espontaneidad.',
    ],
    trabajo: [
      'Tu ambición disciplinada es tu motor más potente. Hoy, da un paso más hacia tu meta de largo plazo.',
      'Capricornio en el trabajo: maestro de la estrategia y la paciencia. Hoy, confía en el proceso.',
      'Tu reputación importa y la cuidas. Hoy es buen día para reforzar esa credibilidad.',
    ],
    energia: ['Disciplinada · Ambiciosa · Paciente', 'Estructurada · Responsable · Persistente', 'Estratégica · Seria · Confiable'],
  },
  Acuario: {
    hoy: [
      'Tu visión de Acuario está siempre adelantada a su tiempo. Hoy, no te disculpes por ver lo que otros aún no ven.',
      'La humanidad te importa profundamente. Hoy, comienza por la persona que tienes más cerca.',
      'Acuario necesita libertad mental. Hoy, date permiso para pensar de forma no convencional.',
    ],
    amor: [
      'Tu originalidad en el amor es refrescante. Hoy, sorprende con algo inesperado.',
      'Acuario ama la humanidad en abstracto y puede descuidar las personas concretas. Hoy, elige a alguien específico.',
      'La independencia que necesitas en el amor puede ser un regalo si se comunica bien.',
    ],
    trabajo: [
      'Tu pensamiento innovador es lo que el mundo necesita hoy. No te autocensures.',
      'Acuario en el trabajo: mejor en equipos donde la creatividad es bienvenida. Hoy, busca esos espacios.',
      'Tu capacidad de ver sistemas y patrones es extraordinaria. Hoy, úsala para resolver un problema que otros no pueden.',
    ],
    energia: ['Innovadora · Humanitaria · Excéntrica', 'Original · Independiente · Visionaria', 'Progresista · Desapegada · Brillante'],
  },
  Piscis: {
    hoy: [
      'Tu sensibilidad de Piscis es tu mayor don. Hoy, protégela de quien no sabe valorarla.',
      'Piscis disuelve fronteras — entre tú y los demás, entre lo real y lo soñado. Hoy, mantén algunos límites.',
      'Tu conexión con lo invisible es real. Hoy, confía en lo que sientes aunque no puedas explicarlo.',
    ],
    amor: [
      'Amas con una totalidad que puede perderse en el otro. Hoy, recuerda quién eres independientemente de tus relaciones.',
      'Tu empatía en el amor es extraordinaria. Hoy, asegúrate de que no estás cargando el dolor del otro como si fuera tuyo.',
      'El romance de Piscis es poético y profundo. Hoy, expresa ese mundo interior a quien amas.',
    ],
    trabajo: [
      'Tu intuición en el trabajo vale más que cualquier análisis. Hoy, confía en ella.',
      'Piscis en el trabajo: creativo, empático, visionario. Hoy, aplica esas cualidades a un problema concreto.',
      'Tu sensibilidad puede hacer difíciles los entornos competitivos. Hoy, encuentra aliados en lugar de competidores.',
    ],
    energia: ['Sensible · Intuitiva · Compasiva', 'Soñadora · Espiritual · Fluida', 'Empática · Creativa · Trascendente'],
  },
}

export function getMensajeDiario(signo: string): {
  mensaje: string
  amor: string
  trabajo: string
  energia: string
} {
  const hoy = new Date()
  const semilla = hoy.getFullYear() * 10000 + (hoy.getMonth() + 1) * 100 + hoy.getDate()
  const data = MENSAJES_SIGNOS[signo] || MENSAJES_SIGNOS['Leo']

  return {
    mensaje: data.hoy[semilla % data.hoy.length],
    amor: data.amor[semilla % data.amor.length],
    trabajo: data.trabajo[semilla % data.trabajo.length],
    energia: data.energia[semilla % data.energia.length],
  }
}

export function getSignoSolar(fechaNacimiento: string): string {
  if (!fechaNacimiento) return 'Leo'
  const fecha = new Date(fechaNacimiento)
  const mes = fecha.getMonth() + 1
  const dia = fecha.getDate()
  if ((mes === 3 && dia >= 21) || (mes === 4 && dia <= 19)) return 'Aries'
  if ((mes === 4 && dia >= 20) || (mes === 5 && dia <= 20)) return 'Tauro'
  if ((mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)) return 'Géminis'
  if ((mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)) return 'Cáncer'
  if ((mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)) return 'Leo'
  if ((mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)) return 'Virgo'
  if ((mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)) return 'Libra'
  if ((mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)) return 'Escorpio'
  if ((mes === 11 && dia >= 22) || (mes === 12 && dia <= 21)) return 'Sagitario'
  if ((mes === 12 && dia >= 22) || (mes === 1 && dia <= 19)) return 'Capricornio'
  if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) return 'Acuario'
  return 'Piscis'
}