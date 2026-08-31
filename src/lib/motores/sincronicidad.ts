export const NUMEROS_ANGEL: Record<string, {
  mensaje: string
  profundizacion: string
  accion: string
}> = {
  '111': { mensaje: 'Tus pensamientos se están manifestando rápidamente. Mantén tu mente enfocada en lo que deseas, no en lo que temes.', profundizacion: 'El 111 es el portal de la manifestación. Eres un creador poderoso en este momento.', accion: 'Escribe claramente lo que quieres crear en tu vida. Las semillas que plantas ahora germinarán pronto.' },
  '222': { mensaje: 'Todo está desarrollándose según el plan divino. Confía en el proceso aunque no puedas ver el cuadro completo.', profundizacion: 'El 222 pide fe y paciencia. Las cosas están en su lugar aunque no lo parezca.', accion: 'Suelta el control. Confía en que lo que necesitas llega en el momento correcto.' },
  '333': { mensaje: 'Los guías y maestros espirituales están cerca. No estás solo en este camino.', profundizacion: 'El 333 es el número del apoyo divino. Hay una energía de amor incondicional rodeándote.', accion: 'Pide apoyo — a personas de confianza, a tu práctica espiritual, a lo que sientas como tu fuente.' },
  '444': { mensaje: 'Estás protegido y apoyado. Los ángeles están contigo, especialmente cuando sientes que el camino es difícil.', profundizacion: 'El 444 es el número de la protección y los fundamentos sólidos. Algo sólido se está construyendo.', accion: 'Continúa. Lo que estás construyendo tiene fundamentos más sólidos de lo que crees.' },
  '555': { mensaje: 'Un cambio significativo está en camino. Prepárate para una transformación que te llevará hacia tu mayor bien.', profundizacion: 'El 555 es el número del cambio inevitable. Lo que viene no puede ser detenido — y está bien.', accion: 'Suelta lo que ya no sirve. Haz espacio para lo nuevo que está llegando.' },
  '666': { mensaje: 'Reequilibra tu atención entre lo material y lo espiritual. Ninguno excluye al otro.', profundizacion: 'El 666 pide equilibrio, no oscuridad. Es hora de cuidar tanto el alma como el cuerpo y los recursos.', accion: 'Atiende algo que has descuidado — ya sea una necesidad práctica o una necesidad espiritual.' },
  '777': { mensaje: 'Estás en el camino correcto. Tu crecimiento espiritual está siendo reconocido y apoyado.', profundizacion: 'El 777 es el número de la iluminación y el buen karma. Lo que has sembrado con autenticidad está dando frutos.', accion: 'Celebra tu progreso. Y comparte tu sabiduría con alguien que la necesite.' },
  '888': { mensaje: 'La abundancia está fluyendo hacia ti. Prepárate para recibir lo que has estado buscando.', profundizacion: 'El 888 es el número del flujo infinito y la abundancia. Los ciclos de esfuerzo están dando paso a los de recompensa.', accion: 'Permítete recibir sin culpa. La abundancia que llega es el resultado de tu trabajo.' },
  '999': { mensaje: 'Un ciclo importante está completándose. Suelta con gratitud lo que fue y prepárate para el nuevo comienzo.', profundizacion: 'El 999 marca el final de una era. Lo que termina abre espacio para algo más alineado con quien eres ahora.', accion: 'Completa lo que está pendiente. Perdona lo que necesita ser perdonado. Cierra el círculo.' },
  '000': { mensaje: 'Estás en el punto de origen — potencial puro. Todo es posible desde aquí.', profundizacion: 'El 000 es el vacío fértil del que emerge todo. Un momento de comienzo absoluto.', accion: 'Siéntate en el silencio. Deja que el próximo paso emerja desde la quietud, no desde la mente.' },
  '1111': { mensaje: 'Un portal se abre. Este es un momento de alineación extraordinaria — tus pensamientos y el universo están sincronizados.', profundizacion: 'El 1111 es el signo de sincronicidad más conocido. Algo importante está ocurriendo a nivel energético.', accion: 'Haz un deseo o set una intención ahora mismo. Este momento tiene una energía especial de manifestación.' },
  '1212': { mensaje: 'Tu intuición y tu corazón están alineados. Confía en lo que sientes — es tu guía más confiable ahora.', profundizacion: 'El 1212 combina el liderazgo del 1 con la cooperación del 2. Lidera desde el amor.', accion: 'Toma una decisión que llevas tiempo posponiendo. Tu corazón ya sabe la respuesta.' },
}

export function interpretarSincronicidad(input: string): {
  tipo: string
  interpretacion: typeof NUMEROS_ANGEL[string] | null
} {
  const limpio = input.replace(/[^0-9]/g, '')

  if (NUMEROS_ANGEL[limpio]) {
    return { tipo: 'numero_angel', interpretacion: NUMEROS_ANGEL[limpio] }
  }

  const repetidos = limpio.match(/(\d)\1{2,}/g)
  if (repetidos && repetidos[0] && NUMEROS_ANGEL[repetidos[0]]) {
    return { tipo: 'numero_repetido', interpretacion: NUMEROS_ANGEL[repetidos[0]] }
  }

  return { tipo: 'general', interpretacion: null }
}