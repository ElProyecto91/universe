export type SilabaMo = 'AH' | 'RA' | 'PA' | 'TSA' | 'NA' | 'DHI'

export type CombinacionMo = {
  silaba1: SilabaMo
  silaba2: SilabaMo
  energia: string
  mensaje: string
  consejo: string
  favorable: 'positivo' | 'neutro' | 'negativo'
}

export const SILABAS: Record<SilabaMo, { elemento: string; dominio: string; color: string }> = {
  AH:  { elemento: 'Espacio', dominio: 'Todo-pervadiente · Espíritu', color: '#C8A050' },
  RA:  { elemento: 'Fuego',   dominio: 'Voz · Deseos · Visión',      color: '#E05030' },
  PA:  { elemento: 'Agua',    dominio: 'Paz · Alegría · Material',   color: '#4090C0' },
  TSA: { elemento: 'Aire',    dominio: 'Mensajes · Cuerpo · Aliento',color: '#80C060' },
  NA:  { elemento: 'Tierra',  dominio: 'Crecimiento · País · Raíces',color: '#A06830' },
  DHI: { elemento: 'Sabiduría', dominio: 'Mente · Excelencia · Manjushri', color: '#E8D080' },
}

export const COMBINACIONES_MO: Record<string, CombinacionMo> = {
  'AH-AH': {
    silaba1: 'AH', silaba2: 'AH', favorable: 'neutro',
    energia: 'Ecuanimidad · Respuesta mediocre',
    mensaje: 'AH con AH indica una respuesta mediocre — ni grande victoria ni gran obstáculo. El espacio que rodea tu pregunta está en equilibrio, pero sin impulso claro. La situación no urgente pide paciencia.',
    consejo: 'Ni avances con fuerza ni retrocedas. El momento pide quietud y observación antes de actuar.',
  },
  'AH-RA': {
    silaba1: 'AH', silaba2: 'RA', favorable: 'negativo',
    energia: 'Obstáculos · Fuego interior',
    mensaje: 'AH seguido de RA indica que aunque el espíritu pervade todo, hay fuerzas de deseo y pasión que pueden crear obstáculos. La energía del fuego puede consumir si no se canaliza con sabiduría.',
    consejo: 'Modera los deseos y la impulsividad. El fuego que sientes puede ser tu aliado o tu enemigo según cómo lo dirijas.',
  },
  'AH-PA': {
    silaba1: 'AH', silaba2: 'PA', favorable: 'positivo',
    energia: 'Sin obstáculos · Paz material',
    mensaje: 'AH en segunda posición significa que no habrá obstáculos. PA trae paz y alegría material. Esta combinación augura un camino libre hacia lo que buscas, con fluidez y tranquilidad.',
    consejo: 'Avanza con confianza. El camino está despejado y la energía del agua fluye a tu favor.',
  },
  'AH-TSA': {
    silaba1: 'AH', silaba2: 'TSA', favorable: 'neutro',
    energia: 'Mensajes en el aire · Movimiento',
    mensaje: 'AH con TSA habla de mensajes que llegarán y movimiento en el aire. Hay comunicaciones importantes pendientes que afectarán el resultado de tu consulta.',
    consejo: 'Permanece atento a las señales y mensajes que lleguen en los próximos días. La información que recibirás es clave.',
  },
  'AH-NA': {
    silaba1: 'AH', silaba2: 'NA', favorable: 'positivo',
    energia: 'Crecimiento sin obstáculos · Tierra fértil',
    mensaje: 'AH sin obstáculos combinado con NA de crecimiento y tierra augura expansión y desarrollo favorable. Lo que plantas ahora tiene tierra fértil para crecer.',
    consejo: 'Es momento de sembrar — proyectos, relaciones, intenciones. La tierra está lista para recibir tu semilla.',
  },
  'AH-DHI': {
    silaba1: 'AH', silaba2: 'DHI', favorable: 'positivo',
    energia: 'Ecuanimidad · Sabiduría suprema',
    mensaje: 'AH con DHI es una combinación de gran poder espiritual. La ecuanimidad del espacio combinada con la sabiduría de Manjushri indica claridad mental excepcional y orientación divina.',
    consejo: 'Confía en tu sabiduría interior. La mente clara que tienes ahora es tu mayor recurso — úsala.',
  },
  'RA-AH': {
    silaba1: 'RA', silaba2: 'AH', favorable: 'negativo',
    energia: 'Deseos intensos · Respuesta mediocre',
    mensaje: 'RA en primera posición con AH indica que los deseos de la mente dominan la situación, pero la respuesta es mediocre. El fuego de tus intenciones no encuentra el combustible que necesita.',
    consejo: 'Examina si lo que deseas es realmente lo que necesitas. El fuego que persigues puede estar persiguiendo un espejismo.',
  },
  'RA-RA': {
    silaba1: 'RA', silaba2: 'RA', favorable: 'negativo',
    energia: 'Fuego doble · Pasión extrema · Cautela',
    mensaje: 'RA doble amplifica la energía del fuego y los deseos al máximo. Esta combinación advierte de pasiones que pueden descontrolarse o de situaciones que se intensifican rápidamente.',
    consejo: 'Cautela máxima con decisiones impulsivas. El fuego doble puede iluminar o quemar — la diferencia está en tu consciencia.',
  },
  'RA-PA': {
    silaba1: 'RA', silaba2: 'PA', favorable: 'positivo',
    energia: 'Fuego y agua · Transformación hacia la paz',
    mensaje: 'RA con PA combina fuego y agua en una danza de transformación. Lo que arde en ti puede encontrar calma y fluidez. Una situación intensa se encamina hacia resolución pacífica.',
    consejo: 'Permite que la intensidad se transforme en claridad. El fuego y el agua juntos crean vapor — energía poderosa y purificadora.',
  },
  'RA-TSA': {
    silaba1: 'RA', silaba2: 'TSA', favorable: 'negativo',
    energia: 'Violencia · Aire agitado · Tensión',
    mensaje: 'RA y TSA comparten una energía de violencia y la luna menguante. Esta combinación advierte de tensiones físicas o emocionales, conflictos con mensajes o comunicaciones que hieren.',
    consejo: 'Evita confrontaciones directas. El aire está cargado — espera a que la tormenta amaine antes de actuar.',
  },
  'RA-NA': {
    silaba1: 'RA', silaba2: 'NA', favorable: 'neutro',
    energia: 'Fuego sobre tierra · Lenta transformación',
    mensaje: 'RA sobre NA indica que el fuego de tus deseos actúa sobre la tierra del crecimiento. La transformación es posible pero lenta — el fuego que quema la tierra también la fertiliza.',
    consejo: 'Ten paciencia con los procesos de cambio. Lo que parece destrucción puede ser la preparación para algo nuevo.',
  },
  'RA-DHI': {
    silaba1: 'RA', silaba2: 'DHI', favorable: 'positivo',
    energia: 'Continuidad sin obstáculos · Sabiduría ardiente',
    mensaje: 'RA con DHI indica continuidad sin obstáculos y sabiduría que actúa con rapidez. La voz y los deseos de la mente encuentran la guía de Manjushri. El fuego de tu intención tiene dirección clara.',
    consejo: 'Actúa con la claridad que tienes ahora. La sabiduría y el deseo están alineados — es el momento de moverse.',
  },
  'PA-AH': {
    silaba1: 'PA', silaba2: 'AH', favorable: 'positivo',
    energia: 'Paz · Sin obstáculos · Fluidez',
    mensaje: 'PA con AH es una combinación favorable de paz y ausencia de obstáculos. El agua fluye sin resistencia. Lo que buscas en términos materiales y de bienestar encontrará su camino.',
    consejo: 'Fluye con la situación en lugar de forzarla. La resistencia es el único obstáculo real ahora.',
  },
  'PA-RA': {
    silaba1: 'PA', silaba2: 'RA', favorable: 'neutro',
    energia: 'Agua y fuego · Equilibrio delicado',
    mensaje: 'PA con RA pone en contacto el agua de la paz con el fuego del deseo. El equilibrio es posible pero delicado. Demasiada agua apaga el fuego; demasiado fuego evapora el agua.',
    consejo: 'Busca el punto medio entre la acción apasionada y la quietud receptiva. Ni demasiado ni demasiado poco.',
  },
  'PA-PA': {
    silaba1: 'PA', silaba2: 'PA', favorable: 'positivo',
    energia: 'Paz doble · Matrimonio · Alegría material',
    mensaje: 'PA doble es una de las combinaciones más favorables. Dobla la energía de la paz, la alegría y la prosperidad material. En asuntos de matrimonio, compromisos o bienestar material, es excelente augurio.',
    consejo: 'El momento es propicio para comprometerte con lo que más deseas. La energía apoya la estabilidad y la alegría.',
  },
  'PA-TSA': {
    silaba1: 'PA', silaba2: 'TSA', favorable: 'neutro',
    energia: 'Agua y aire · Mensajes que traen calma',
    mensaje: 'PA con TSA combina la paz del agua con los mensajes del aire. Noticias o comunicaciones llegarán que traerán más claridad a tu situación. El movimiento del aire sobre el agua crea suaves ondas.',
    consejo: 'Escucha los mensajes que llegan con mente abierta. La información que recibirás merece reflexión antes de actuar.',
  },
  'PA-NA': {
    silaba1: 'PA', silaba2: 'NA', favorable: 'positivo',
    energia: 'Agua y tierra · Crecimiento abundante',
    mensaje: 'PA con NA es la combinación del agua que nutre la tierra. El crecimiento que viene es sólido y abundante. En asuntos de trabajo, familia y salud, esta combinación augura desarrollo favorable.',
    consejo: 'Nutre lo que quieres ver crecer. El agua y la tierra juntas producen la vida más abundante.',
  },
  'PA-DHI': {
    silaba1: 'PA', silaba2: 'DHI', favorable: 'positivo',
    energia: 'Paz y sabiduría · Logro rápido',
    mensaje: 'PA con DHI indica que la paz material se une a la sabiduría de Manjushri para un logro rápido y favorable. Esta combinación sugiere que el compromiso con la sabiduría trae recompensa material.',
    consejo: 'Actúa desde la sabiduría y la paz interior. El logro que buscas llega más rápido cuando no está contaminado por la ansiedad.',
  },
  'TSA-AH': {
    silaba1: 'TSA', silaba2: 'AH', favorable: 'neutro',
    energia: 'Mensajes · Respuesta mediocre',
    mensaje: 'TSA con AH indica mensajes en movimiento pero con una respuesta mediocre. Habrá comunicaciones y movimiento, pero el resultado no será ni excepcional ni desastroso.',
    consejo: 'No pongas todas tus expectativas en los mensajes que esperan. El resultado será suficiente, no extraordinario.',
  },
  'TSA-RA': {
    silaba1: 'TSA', silaba2: 'RA', favorable: 'negativo',
    energia: 'Violencia · Tensión · Conflicto',
    mensaje: 'TSA con RA es una de las combinaciones más tensas. Ambas comparten energía de violencia y la luna menguante. Conflictos físicos, mensajes que hieren o situaciones que se intensifican de forma peligrosa.',
    consejo: 'Extrema cautela. Evita confrontaciones y decisiones impulsivas. Este no es el momento de actuar — es el momento de protegerte.',
  },
  'TSA-PA': {
    silaba1: 'TSA', silaba2: 'PA', favorable: 'positivo',
    energia: 'Mensajes de paz · Buenas noticias',
    mensaje: 'TSA con PA trae mensajes que conducen a la paz y la alegría. Las comunicaciones que llegarán serán favorables. El movimiento del aire lleva consigo agua que calma y nutre.',
    consejo: 'Presta atención a las noticias que lleguen — traen buenas perspectivas. Es buen momento para comunicarte y conectar.',
  },
  'TSA-TSA': {
    silaba1: 'TSA', silaba2: 'TSA', favorable: 'neutro',
    energia: 'Movimiento doble · Muchos mensajes',
    mensaje: 'TSA doble amplifica el movimiento, los mensajes y el aliento. Habrá mucha actividad comunicativa y física, pero puede dispersarse sin foco claro. El aire en movimiento puede ser brisa o tormenta.',
    consejo: 'Entre toda la actividad, mantén el foco en lo esencial. No todo movimiento es progreso.',
  },
  'TSA-NA': {
    silaba1: 'TSA', silaba2: 'NA', favorable: 'positivo',
    energia: 'Aire sobre tierra · Crecimiento con movimiento',
    mensaje: 'TSA con NA combina el movimiento del aire con el crecimiento de la tierra. Lo que se mueve ahora tiene un destino fértil. Los mensajes que circulan traen semillas de crecimiento.',
    consejo: 'El movimiento que ves es hacia algo mejor. Deja que el viento lleve las semillas donde deben caer.',
  },
  'TSA-DHI': {
    silaba1: 'TSA', silaba2: 'DHI', favorable: 'positivo',
    energia: 'Favor · Logro rápido · Sabiduría en movimiento',
    mensaje: 'TSA con DHI indica favor y alta probabilidad de logro rápido. La sabiduría de Manjushri se pone en movimiento a través del aire. Los mensajes que llegan llevan en sí mismos la guía que necesitas.',
    consejo: 'Actúa rápido cuando llegue la señal que esperas. El momento de acción será breve pero poderoso.',
  },
  'NA-AH': {
    silaba1: 'NA', silaba2: 'AH', favorable: 'neutro',
    energia: 'Crecimiento lento · Respuesta mediocre',
    mensaje: 'NA con AH indica crecimiento posible pero con respuesta mediocre. La tierra está presente pero el espíritu que la anima no tiene dirección clara todavía. El crecimiento será lento.',
    consejo: 'Siembra con paciencia sin esperar resultados inmediatos. Lo que crece en tierra firme tarde en aparecer pero dura más.',
  },
  'NA-RA': {
    silaba1: 'NA', silaba2: 'RA', favorable: 'neutro',
    energia: 'Tierra y fuego · Transformación necesaria',
    mensaje: 'NA con RA pone el fuego sobre la tierra. Hay energía de transformación pero también de tensión. El fuego puede quemar lo viejo para dejar paso a lo nuevo, o puede consumir sin dejar nada.',
    consejo: 'Identifica qué necesita arder en tu vida para que algo nuevo crezca. La transformación es necesaria aunque duela.',
  },
  'NA-PA': {
    silaba1: 'NA', silaba2: 'PA', favorable: 'positivo',
    energia: 'Tierra nutrida · Abundancia material',
    mensaje: 'NA con PA es la combinación perfecta de tierra y agua. La abundancia material y el crecimiento en el entorno cercano están favorecidos. Familia, hogar y bienes prosperan bajo esta energía.',
    consejo: 'Invierte en lo cercano y concreto. Las raíces que profundizas ahora en familia y hogar dan frutos duraderos.',
  },
  'NA-TSA': {
    silaba1: 'NA', silaba2: 'TSA', favorable: 'neutro',
    energia: 'Tierra y aire · Mensajes del entorno',
    mensaje: 'NA con TSA trae mensajes del entorno y del país cercano. Hay información que circula en tu ambiente inmediato que afecta tu crecimiento. El viento sobre la tierra trae noticias.',
    consejo: 'Presta atención a lo que sucede en tu entorno cercano. Las señales que necesitas están más cerca de lo que crees.',
  },
  'NA-NA': {
    silaba1: 'NA', silaba2: 'NA', favorable: 'positivo',
    energia: 'Tierra doble · Crecimiento sólido',
    mensaje: 'NA doble duplica la energía de la tierra, el crecimiento y las raíces. Todo lo relacionado con el entorno, la familia, la salud física y los bienes materiales tiene una base excepcionalmente sólida.',
    consejo: 'Este es el momento de construir sobre cimientos firmes. Lo que edifiques ahora tiene raíces de doble profundidad.',
  },
  'NA-DHI': {
    silaba1: 'NA', silaba2: 'DHI', favorable: 'positivo',
    energia: 'Tierra y sabiduría · Crecimiento con guía',
    mensaje: 'NA con DHI es una combinación excelente de crecimiento guiado por la sabiduría. Lo que crece ahora está orientado por Manjushri. El desarrollo que viene tiene tanto raíces como dirección clara.',
    consejo: 'Deja que la sabiduría guíe tu crecimiento. El árbol que crece hacia la luz crece más recto y más alto.',
  },
  'DHI-AH': {
    silaba1: 'DHI', silaba2: 'AH', favorable: 'positivo',
    energia: 'Sabiduría suprema · Ecuanimidad',
    mensaje: 'DHI con AH indica que la sabiduría de Manjushri pervade todo el espacio de tu consulta. La mente de Buda está presente y activa. Cualquier deseo será cumplido como una piedra preciosa que cae en tu mano.',
    consejo: 'Confía absolutamente en el proceso. La sabiduría suprema está contigo — cualquier camino que tomes es el correcto.',
  },
  'DHI-RA': {
    silaba1: 'DHI', silaba2: 'RA', favorable: 'neutro',
    energia: 'Sabiduría ardiente · Claridad con tensión',
    mensaje: 'DHI con RA combina la sabiduría con la energía del fuego y los deseos. La claridad mental es alta pero puede estar nublada por pasiones o urgencias. La espada de Manjushri corta, pero el fuego también quema.',
    consejo: 'Usa tu claridad mental para templar el fuego de los deseos. La sabiduría que tienes es tu mejor escudo.',
  },
  'DHI-PA': {
    silaba1: 'DHI', silaba2: 'PA', favorable: 'positivo',
    energia: 'Sabiduría y paz · Matrimonio espiritual',
    mensaje: 'DHI con PA une la sabiduría suprema con la paz y la alegría material. Esta es una de las combinaciones más auspiciosas del Mo. Lo espiritual y lo material se alinean perfectamente.',
    consejo: 'Lo que buscas tiene tanto fundamento espiritual como material. Avanza con confianza total.',
  },
  'DHI-TSA': {
    silaba1: 'DHI', silaba2: 'TSA', favorable: 'positivo',
    energia: 'Sabiduría en movimiento · Logro favorable',
    mensaje: 'DHI con TSA indica que la sabiduría se pone en movimiento a través de mensajes y comunicaciones. El favor de Manjushri llega a través de información, palabras o encuentros. El logro es probable y rápido.',
    consejo: 'Comunica tu sabiduría. Escribe, habla, comparte — el mensaje que transmitas ahora tiene especial poder.',
  },
  'DHI-NA': {
    silaba1: 'DHI', silaba2: 'NA', favorable: 'positivo',
    energia: 'Sabiduría arraigada · Crecimiento iluminado',
    mensaje: 'DHI con NA planta la sabiduría en la tierra del crecimiento. Lo que construyes ahora está guiado por la luz de Manjushri y tiene raíces profundas. El crecimiento que viene es sabio y duradero.',
    consejo: 'Invierte en aprendizaje y conocimiento — ese es el árbol que más frutos dará en tu situación actual.',
  },
  'DHI-DHI': {
    silaba1: 'DHI', silaba2: 'DHI', favorable: 'positivo',
    energia: 'Sabiduría suprema doble · Crecimiento total',
    mensaje: 'DHI doble es la combinación más auspiciosa del Mo — la sabiduría de Manjushri al máximo poder. Indica crecimiento en todos los sentidos, logro de deseos y la bendición directa del Bodhisattva de la sabiduría.',
    consejo: 'Este es un momento de gracia extraordinaria. Actúa desde tu sabiduría más profunda y el universo responde.',
  },
}

export function lanzarMo(): { silaba1: SilabaMo; silaba2: SilabaMo; combinacion: CombinacionMo } {
  const silabas: SilabaMo[] = ['AH', 'RA', 'PA', 'TSA', 'NA', 'DHI']
  const s1 = silabas[Math.floor(Math.random() * 6)]
  const s2 = silabas[Math.floor(Math.random() * 6)]
  const clave = `${s1}-${s2}`
  return { silaba1: s1, silaba2: s2, combinacion: COMBINACIONES_MO[clave] }
}