// src/lib/motores/luna.ts — reemplaza todo el contenido

export type FaseLunar = {
  nombre: string
  simbolo: string
  energia: string
  mensaje: string
  practica: string
  diasHastaLunaLlena: number
  porcentajeIluminacion: number
}

export type NombreFase =
  | 'Luna Nueva'
  | 'Luna Creciente'
  | 'Cuarto Creciente'
  | 'Luna Gibosa Creciente'
  | 'Luna Llena'
  | 'Luna Gibosa Menguante'
  | 'Cuarto Menguante'
  | 'Luna Balsámica'

const MENSAJES_POR_SIGNO: Record<NombreFase, Record<string, string>> = {
  'Luna Nueva': {
    Aries:       'La luna nueva enciende en ti una chispa de iniciativa que rara vez se apaga sola. Es el momento de lanzarte hacia lo que llevas tiempo postergando — el universo respalda tu audacia.',
    Tauro:       'La luna nueva te invita a plantar semillas que crecen despacio pero con raíces profundas. Define con claridad qué quieres construir — tu paciencia es tu mayor aliada ahora.',
    Géminis:     'La luna nueva activa tu mente con ideas frescas y conexiones inesperadas. Es el momento ideal para iniciar conversaciones, proyectos creativos o aprendizajes nuevos.',
    Cáncer:      'La luna nueva toca tu mundo más íntimo. Las intenciones que plantes hoy desde el corazón tienen una fuerza especial — conecta con lo que realmente deseas, no con lo que crees que deberías desear.',
    Leo:         'La luna nueva ilumina tu sentido de identidad y propósito. Es momento de iniciar algo que exprese quién eres realmente — no quién los demás esperan que seas.',
    Virgo:       'La luna nueva te pide claridad y precisión en tus intenciones. Define exactamente qué quieres mejorar o crear — los detalles importan y tú lo sabes mejor que nadie.',
    Libra:       'La luna nueva abre un ciclo de equilibrio y nuevas conexiones. Es el momento de iniciar relaciones, proyectos colaborativos o cualquier cosa que florezca mejor en compañía.',
    Escorpio:    'La luna nueva activa en ti una transformación profunda. Las intenciones que plantes ahora tienen una intensidad especial — ve a lo que realmente importa, sin miedo a la profundidad.',
    Sagitario:   'La luna nueva expande tu horizonte. Es el momento de iniciar un aprendizaje, un viaje o una aventura filosófica que amplíe tu visión del mundo.',
    Capricornio: 'La luna nueva activa tu ambición y tu sentido de la responsabilidad. Define una meta concreta y trazable — tu disciplina natural hará el resto.',
    Acuario:     'La luna nueva despierta tu visión de futuro. Es el momento de iniciar proyectos que sirvan a algo más grande que tú — tus ideas tienen el potencial de impactar a muchos.',
    Piscis:      'La luna nueva abre un portal de intuición y sueños. Las intenciones que nazcan de tu mundo interior en este momento tienen una conexión especial con el universo.',
  },
  'Luna Creciente': {
    Aries:       'La luna creciente alimenta tu impulso natural. Lo que iniciaste ya tiene momentum — no pares ahora, el fuego que llevas dentro es exactamente lo que este ciclo necesita.',
    Tauro:       'La luna creciente pide acción constante y deliberada. Cada paso que das ahora construye algo sólido — no te desanimes si el progreso parece lento, está ocurriendo.',
    Géminis:     'La luna creciente multiplica tus ideas y conexiones. Es el momento de comunicar, compartir y hacer crecer lo que iniciaste — tus palabras tienen más poder del que imaginas.',
    Cáncer:      'La luna creciente nutre lo que plantaste. Cuida tus intenciones como cuidas a quienes amas — con atención, presencia y sin forzar los tiempos.',
    Leo:         'La luna creciente amplifica tu energía creativa. Es el momento de mostrar lo que estás construyendo — la visibilidad que temes es exactamente lo que tu proyecto necesita.',
    Virgo:       'La luna creciente pide refinamiento y mejora continua. Ajusta, corrige, optimiza — tu capacidad de perfeccionar los detalles es un regalo en esta fase.',
    Libra:       'La luna creciente fortalece tus vínculos y colaboraciones. Las relaciones que nutres ahora florecerán con el ciclo — invierte tiempo en las personas que importan.',
    Escorpio:    'La luna creciente profundiza tu compromiso. Lo que iniciaste pide ahora toda tu intensidad — no te quedes en la superficie cuando puedes ir al fondo.',
    Sagitario:   'La luna creciente expande tu entusiasmo y tu visión. Comparte lo que estás aprendiendo — tu optimismo es contagioso y mueve a otros a actuar.',
    Capricornio: 'La luna creciente fortalece tu disciplina. Cada esfuerzo que haces ahora es una piedra en la estructura que estás construyendo — sigue, aunque no lo veas aún.',
    Acuario:     'La luna creciente amplifica tu originalidad. Es el momento de llevar tus ideas al mundo — lo que parece radical hoy puede ser el estándar de mañana.',
    Piscis:      'La luna creciente eleva tu sensibilidad e intuición. Deja que tu mundo interior guíe tus pasos — la lógica tiene sus límites, pero tu intuición no los tiene.',
  },
  'Cuarto Creciente': {
    Aries:       'El cuarto creciente pone a prueba tu determinación. El primer obstáculo real aparece — pero tú naciste para superarlo. Decide y actúa sin mirar atrás.',
    Tauro:       'El cuarto creciente pide que te comprometas completamente. La comodidad puede tentarte a detenerte — resiste. Lo que construyes vale el esfuerzo extra.',
    Géminis:     'El cuarto creciente pide claridad en medio de la complejidad. Elige una dirección entre las múltiples que ves y comprométete — la dispersión es el único enemigo real ahora.',
    Cáncer:      'El cuarto creciente activa tu fuerza interior. Las dudas emocionales pueden aparecer — confía en lo que plantaste con el corazón y sigue adelante.',
    Leo:         'El cuarto creciente pone a prueba tu liderazgo. Es el momento de demostrar — no solo de prometer. Tu acción inspira más que tus palabras.',
    Virgo:       'El cuarto creciente revela los ajustes necesarios. No como señal de fracaso sino como información — tu precisión es una ventaja aquí.',
    Libra:       'El cuarto creciente pide una decisión que has estado evitando. La indecisión tiene un coste — confía en tu sentido de la justicia y elige.',
    Escorpio:    'El cuarto creciente activa tu poder de transformación. El obstáculo que aparece es exactamente lo que necesitas superar para llegar al siguiente nivel.',
    Sagitario:   'El cuarto creciente pone a prueba tu fe en el proceso. No abandones la visión cuando los detalles se complican — el panorama completo sigue siendo válido.',
    Capricornio: 'El cuarto creciente refuerza tu disciplina. Los resultados no llegan aún pero el esfuerzo se está acumulando — confía en el proceso que conoces tan bien.',
    Acuario:     'El cuarto creciente pone a prueba tu originalidad. La presión para conformarte puede aparecer — mantén tu visión aunque parezca solitaria.',
    Piscis:      'El cuarto creciente pide que ancles tu intuición en la acción. Los sueños son el mapa — ahora necesitas caminar el terreno.',
  },
  'Luna Gibosa Creciente': {
    Aries:       'La luna gibosa creciente pide que afines tu impulso. Casi en la cima — ahora es cuando la impaciencia puede sabotearte. Respira, ajusta y prepárate para la culminación.',
    Tauro:       'La luna gibosa creciente pide paciencia en el tramo final. Lo que construiste con tanto cuidado está a punto de mostrar su forma completa — no fuerces el último paso.',
    Géminis:     'La luna gibosa creciente refina tus ideas. Es el momento de pulir, editar y preparar lo que pronto compartirás con el mundo — la claridad es tu aliada ahora.',
    Cáncer:      'La luna gibosa creciente profundiza tu preparación emocional. Revisa tus intenciones con el corazón — ¿siguen siendo tuyas? Ajusta lo que necesita ser ajustado.',
    Leo:         'La luna gibosa creciente prepara tu gran momento. Afina tu presentación, tu proyecto, tu expresión — lo que mostrarás pronto merece tu máximo cuidado.',
    Virgo:       'La luna gibosa creciente es tu fase natural. El refinamiento que buscas está al alcance — confía en tu capacidad de llevarlo a la perfección sin caer en el perfeccionismo.',
    Libra:       'La luna gibosa creciente equilibra los últimos detalles. Revisa las relaciones y colaboraciones involucradas — ¿todo está en armonía? Ajusta con diplomacia.',
    Escorpio:    'La luna gibosa creciente profundiza tu proceso. La transformación está casi completa — solo falta soltar lo último que ya no sirve antes de la culminación.',
    Sagitario:   'La luna gibosa creciente amplía tu visión en el tramo final. Revisa si el camino que tomaste sigue alineado con tu verdad — aún hay tiempo de ajustar el rumbo.',
    Capricornio: 'La luna gibosa creciente consolida tu trabajo. El esfuerzo acumulado está a punto de dar sus frutos — la disciplina que has mantenido tiene su recompensa cerca.',
    Acuario:     'La luna gibosa creciente refina tu visión innovadora. Prepara cómo presentar tus ideas al mundo — la originalidad necesita también claridad para ser recibida.',
    Piscis:      'La luna gibosa creciente eleva tu sensibilidad a su punto máximo. Confía en lo que percibes — tu intuición te señala exactamente qué ajustar antes de la luna llena.',
  },
  'Luna Llena': {
    Aries:       'La luna llena ilumina tu poder y tu coraje. Lo que iniciaste llega a su plenitud — celebra lo logrado y suelta lo que ya cumplió su función. Eres luz y fuerza hoy.',
    Tauro:       'La luna llena culmina lo que construiste con paciencia. Los frutos de tu constancia son visibles ahora — recíbelos con gratitud y suelta lo que ya no necesitas cargar.',
    Géminis:     'La luna llena ilumina tus conexiones y conversaciones. Las verdades que necesitaban ser dichas salen a la luz — acógelas con apertura y suelta lo que ya no resuena.',
    Cáncer:      'La luna llena toca tu mundo emocional en su punto más profundo. Las emociones que guardaste salen a la superficie — no las temas. Son mensajes sagrados.',
    Leo:         'La luna llena amplifica tu brillo natural. Es el momento de mayor visibilidad y reconocimiento — recíbelo con gracia y comparte tu luz con generosidad.',
    Virgo:       'La luna llena revela el resultado de tu trabajo meticuloso. Lo que perfeccionaste con tanto cuidado brilla ahora — permite que sea visto tal como es.',
    Libra:       'La luna llena ilumina tus relaciones. Las dinámicas ocultas salen a la luz — es el momento de restablecer el equilibrio con honestidad y amor.',
    Escorpio:    'La luna llena activa tu poder de transformación en su punto máximo. Lo que muere ahora hace espacio para algo nuevo — confía en el proceso aunque duela.',
    Sagitario:   'La luna llena expande tu verdad. Lo que has aprendido y vivido llega a su culminación — compártelo, enséñalo, celébralo. Tu visión tiene valor.',
    Capricornio: 'La luna llena reconoce tu esfuerzo. Los resultados de tu disciplina son visibles ahora — permítete celebrar sin minimizar lo que has construido.',
    Acuario:     'La luna llena ilumina tu visión colectiva. Lo que iniciaste para el bien común llega a su plenitud — el impacto de tus ideas es más real de lo que imaginas.',
    Piscis:      'La luna llena abre tu mundo espiritual al máximo. Los sueños, las sincronías y las señales son especialmente claros ahora — escucha con todo tu ser.',
  },
  'Luna Gibosa Menguante': {
    Aries:       'La luna gibosa menguante te invita a compartir lo que aprendiste. Tu energía más impulsiva descansa un poco — es el momento de integrar y transmitir, no de conquistar.',
    Tauro:       'La luna gibosa menguante pide gratitud por lo cosechado. Comparte tu abundancia — lo que das con generosidad regresa multiplicado en el próximo ciclo.',
    Géminis:     'La luna gibosa menguante integra las lecciones del ciclo. Escribe, habla, comparte lo que aprendiste — procesar en voz alta es tu forma natural de integrar.',
    Cáncer:      'La luna gibosa menguante nutre el cierre del ciclo. Agradece, cuida y cierra con amor — tu capacidad de cuidar incluye también cuidar el final de los ciclos.',
    Leo:         'La luna gibosa menguante comparte la luz que acumulaste. La generosidad es tu naturaleza — dar lo que aprendiste multiplica tu brillo en lugar de disminuirlo.',
    Virgo:       'La luna gibosa menguante integra las mejoras del ciclo. Documenta lo que funcionó y lo que no — ese conocimiento es oro para el próximo ciclo.',
    Libra:       'La luna gibosa menguante armoniza los vínculos del ciclo. Agradece a quienes te acompañaron — las relaciones que nutres ahora se fortalecen para lo que viene.',
    Escorpio:    'La luna gibosa menguante integra la transformación. Lo que murió en luna llena deja espacio para algo nuevo — honra el proceso completo con gratitud.',
    Sagitario:   'La luna gibosa menguante comparte la sabiduría ganada. Enseña lo que aprendiste — la generosidad intelectual es una de tus formas más auténticas de dar.',
    Capricornio: 'La luna gibosa menguante integra los logros del ciclo. Reconoce lo construido y planifica cómo consolidarlo — tu visión a largo plazo encuentra aquí su lugar.',
    Acuario:     'La luna gibosa menguante comparte tus ideas con la comunidad. Lo que descubriste tiene valor colectivo — no lo guardes solo para ti.',
    Piscis:      'La luna gibosa menguante integra las experiencias espirituales del ciclo. Lo que sentiste y percibiste tiene un mensaje — tómate el tiempo de escucharlo.',
  },
  'Cuarto Menguante': {
    Aries:       'El cuarto menguante pide que sueltes lo que ya no impulsa. Tu tendencia a seguir adelante puede resistir el cierre — pero soltar es también un acto de fuerza.',
    Tauro:       'El cuarto menguante pide que liberes lo que acumulas sin necesidad. La seguridad no viene de lo que guardas sino de lo que eres — suelta con confianza.',
    Géminis:     'El cuarto menguante pide que sueltes las ideas que ya no resuenan. No todas las conversaciones necesitan continuar — elige las que merecen tu energía.',
    Cáncer:      'El cuarto menguante invita a soltar lo que guardas emocionalmente. El perdón — hacia ti y hacia otros — es el acto más liberador que puedes hacer ahora.',
    Leo:         'El cuarto menguante pide que sueltes la necesidad de reconocimiento. Tu valor no depende de la validación externa — libérate de esa carga.',
    Virgo:       'El cuarto menguante suelta la búsqueda de perfección. Lo que hiciste fue suficiente — perfecto es enemigo de completado. Cierra con paz.',
    Libra:       'El cuarto menguante suelta los desequilibrios del ciclo. El perdón y la aceptación restauran la armonía que buscas — empieza por perdonarte a ti mismo.',
    Escorpio:    'El cuarto menguante profundiza la liberación. Lo que necesita morir para que algo nuevo nazca está claro — suéltalo con toda la intensidad que caracteriza tu amor.',
    Sagitario:   'El cuarto menguante suelta las creencias que ya no expanden. La libertad que buscas empieza por liberarte de las ideas que te limitan.',
    Capricornio: 'El cuarto menguante suelta el control excesivo. No todo puede ser planificado — confía en que el universo también trabaja a tu favor.',
    Acuario:     'El cuarto menguante suelta la resistencia al cambio que ya ocurrió. Paradójicamente, quien más abraza el cambio a veces más resiste el cambio personal.',
    Piscis:      'El cuarto menguante disuelve lo que ya cumplió su ciclo. Tu porosidad natural facilita este proceso — permite que lo viejo se vaya como el agua.',
  },
  'Luna Balsámica': {
    Aries:       'La luna balsámica pide algo inusual para ti: pausa. El descanso que evitas es exactamente lo que prepara el terreno para tu próximo gran comienzo.',
    Tauro:       'La luna balsámica es tu fase más natural. El descanso profundo y la quietud son exactamente lo que tu cuerpo y tu alma necesitan ahora — dátelos sin culpa.',
    Géminis:     'La luna balsámica silencia el ruido mental. Es el momento de escuchar lo que hay debajo de los pensamientos — la quietud te dice más que cualquier conversación.',
    Cáncer:      'La luna balsámica te lleva a tu mundo más interior. Descansa, sueña y permite que las emociones del ciclo se asienten — la claridad llegará sola.',
    Leo:         'La luna balsámica apaga las luces por un momento. El descanso del escenario no disminuye tu brillo — lo prepara para brillar con más fuerza en el próximo ciclo.',
    Virgo:       'La luna balsámica invita a soltar el análisis. No todo necesita ser procesado con la mente — algunos ciclos se cierran simplemente descansando.',
    Libra:       'La luna balsámica restaura el equilibrio interno. El silencio y la soledad que evitas son exactamente lo que tu sistema necesita para reequilibrarse.',
    Escorpio:    'La luna balsámica es tu preparación para el renacimiento. El silencio más profundo precede a la transformación más poderosa — confía en esta oscuridad.',
    Sagitario:   'La luna balsámica calma tu impulso de explorar. El viaje más importante ahora es interno — y no necesita pasaporte ni equipaje.',
    Capricornio: 'La luna balsámica pide que pares de construir por un momento. El descanso forma parte de la estructura — inclúyelo en tu plan sin sentirte improductivo.',
    Acuario:     'La luna balsámica desconecta el ruido colectivo. Es el momento de volver a ti mismo antes del próximo ciclo — ¿qué quieres tú, más allá de lo que el mundo necesita?',
    Piscis:      'La luna balsámica es tu hogar natural. Los sueños, la meditación y el silencio sagrado te preparan para recibir todo lo que el nuevo ciclo traerá.',
  },
}

const PRACTICAS: Record<NombreFase, string> = {
  'Luna Nueva':             'Escribe 3 intenciones en presente positivo. Enciende una vela. Lee tus intenciones en voz alta.',
  'Luna Creciente':         'Da un paso concreto hacia tu intención de luna nueva. Actúa, no solo planees.',
  'Cuarto Creciente':       'Identifica el mayor obstáculo actual. Elige una acción concreta para superarlo hoy.',
  'Luna Gibosa Creciente':  'Revisa tus intenciones. Ajusta lo que necesita ser ajustado. Prepárate para recibir.',
  'Luna Llena':             'Celebra lo que has logrado. Escribe lo que quieres soltar. Quema o entierra el papel.',
  'Luna Gibosa Menguante':  'Comparte algo valioso con alguien. Agradece. Integra lo aprendido.',
  'Cuarto Menguante':       'Escribe lo que quieres soltar. Practica el perdón activo. Limpia tu espacio físico.',
  'Luna Balsámica':         'Descansa profundamente. Medita en silencio. Prepara espacio interior para lo que viene.',
}

function getNombreFase(diaEnCiclo: number): NombreFase {
  if (diaEnCiclo < 1.85)  return 'Luna Nueva'
  if (diaEnCiclo < 7.38)  return 'Luna Creciente'
  if (diaEnCiclo < 9.22)  return 'Cuarto Creciente'
  if (diaEnCiclo < 14.77) return 'Luna Gibosa Creciente'
  if (diaEnCiclo < 16.61) return 'Luna Llena'
  if (diaEnCiclo < 22.15) return 'Luna Gibosa Menguante'
  if (diaEnCiclo < 23.99) return 'Cuarto Menguante'
  return 'Luna Balsámica'
}

const SIMBOLOS: Record<NombreFase, string> = {
  'Luna Nueva':            '🌑',
  'Luna Creciente':        '🌒',
  'Cuarto Creciente':      '🌓',
  'Luna Gibosa Creciente': '🌔',
  'Luna Llena':            '🌕',
  'Luna Gibosa Menguante': '🌖',
  'Cuarto Menguante':      '🌗',
  'Luna Balsámica':        '🌘',
}

const ENERGIAS: Record<NombreFase, string> = {
  'Luna Nueva':            'Nuevos comienzos · Intenciones · Semillas',
  'Luna Creciente':        'Momentum · Acción · Construcción',
  'Cuarto Creciente':      'Decisión · Compromiso · Superación',
  'Luna Gibosa Creciente': 'Refinamiento · Perfeccionamiento · Preparación',
  'Luna Llena':            'Culminación · Gratitud · Liberación · Manifestación',
  'Luna Gibosa Menguante': 'Gratitud · Compartir · Integración',
  'Cuarto Menguante':      'Liberación · Perdón · Transformación',
  'Luna Balsámica':        'Descanso · Introspección · Preparación',
}

export function getFaseLunar(signo = 'Leo'): FaseLunar {
  const hoy                  = new Date()
  const lunaReferencia     