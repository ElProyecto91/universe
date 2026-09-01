export type FaseLunar = {
  nombre: string
  simbolo: string
  energia: string
  mensaje: string
  practica: string
  diasHastaLunaLlena: number
  porcentajeIluminacion: number
}

export function getFaseLunar(): FaseLunar {
  const hoy = new Date()
  // Referencia: luna nueva el 6 de enero de 2000
  const lunaReferencia = new Date('2000-01-06')
  const diasDesdeReferencia = Math.floor((hoy.getTime() - lunaReferencia.getTime()) / (1000 * 60 * 60 * 24))
  const cicloDias = 29.53059
  const diaEnCiclo = diasDesdeReferencia % cicloDias
  const porcentaje = diaEnCiclo / cicloDias

  let nombre: string
  let simbolo: string
  let energia: string
  let mensaje: string
  let practica: string
  let diasHastaLunaLlena: number
  let porcentajeIluminacion: number

  if (diaEnCiclo < 1.85) {
    nombre = 'Luna Nueva'
    simbolo = '🌑'
    energia = 'Nuevos comienzos · Intenciones · Semillas'
    mensaje = 'El cielo está oscuro pero lleno de potencial. Este es el momento más poderoso para plantar intenciones. Lo que inicias ahora tiene el impulso de todo el ciclo detrás.'
    practica = 'Escribe 10 intenciones en presente positivo. Enciende una vela blanca. Lee tus intenciones en voz alta.'
    diasHastaLunaLlena = Math.round(14.75 - diaEnCiclo)
    porcentajeIluminacion = 0
  } else if (diaEnCiclo < 7.38) {
    nombre = 'Luna Creciente'
    simbolo = '🌒'
    energia = 'Momentum · Acción · Construcción'
    mensaje = 'La luna crece y contigo crece la energía de lo que iniciaste. Es momento de tomar acción concreta hacia tus intenciones. El impulso está a tu favor.'
    practica = 'Da un paso concreto hacia tu intención de luna nueva. Actúa, no solo planees.'
    diasHastaLunaLlena = Math.round(14.75 - diaEnCiclo)
    porcentajeIluminacion = Math.round((diaEnCiclo / 14.75) * 100)
  } else if (diaEnCiclo < 9.22) {
    nombre = 'Cuarto Creciente'
    simbolo = '🌓'
    energia = 'Decisión · Compromiso · Superación de obstáculos'
    mensaje = 'El primer obstáculo real aparece. El cuarto creciente pide que te comprometas completamente con lo que empezaste. Este es el momento de decisión.'
    practica = 'Identifica el mayor obstáculo actual. Elige una acción para superarlo hoy.'
    diasHastaLunaLlena = Math.round(14.75 - diaEnCiclo)
    porcentajeIluminacion = 50
  } else if (diaEnCiclo < 14.77) {
    nombre = 'Luna Gibosa Creciente'
    simbolo = '🌔'
    energia = 'Refinamiento · Perfeccionamiento · Preparación'
    mensaje = 'Casi en la cima. La luna gibosa pide refinamiento — ajusta, mejora, prepárate para la culminación. Lo que cultivaste está a punto de florecer.'
    practica = 'Revisa tus intenciones. Ajusta lo que necesita ser ajustado. Prepárate para recibir.'
    diasHastaLunaLlena = Math.round(14.75 - diaEnCiclo)
    porcentajeIluminacion = Math.round((diaEnCiclo / 14.75) * 100)
  } else if (diaEnCiclo < 16.61) {
    nombre = 'Luna Llena'
    simbolo = '🌕'
    energia = 'Culminación · Gratitud · Liberación · Manifestación'
    mensaje = 'La luna llena es el momento de mayor poder del ciclo. Lo que plantaste en luna nueva llega a su plenitud. También es el momento de soltar lo que ya no sirve.'
    practica = 'Celebra lo que has logrado. Escribe lo que quieres soltar. Quema o entierra el papel.'
    diasHastaLunaLlena = 0
    porcentajeIluminacion = 100
  } else if (diaEnCiclo < 22.15) {
    nombre = 'Luna Gibosa Menguante'
    simbolo = '🌖'
    energia = 'Gratitud · Compartir · Integración'
    mensaje = 'La luna empieza a menguar. Es momento de compartir lo que has aprendido, de dar gracias y de integrar las lecciones del ciclo.'
    practica = 'Comparte algo valioso con alguien. Agradece. Integra lo aprendido.'
    diasHastaLunaLlena = Math.round(29.53 - diaEnCiclo + 14.75)
    porcentajeIluminacion = Math.round(((29.53 - diaEnCiclo) / 14.75) * 100)
  } else if (diaEnCiclo < 23.99) {
    nombre = 'Cuarto Menguante'
    simbolo = '🌗'
    energia = 'Liberación · Perdón · Transformación'
    mensaje = 'El cuarto menguante pide que sueltes lo que ya no sirve. Es un momento de perdón — hacia otros y hacia ti mismo.'
    practica = 'Escribe lo que quieres soltar. Practica el perdón activo. Limpia tu espacio.'
    diasHastaLunaLlena = Math.round(29.53 - diaEnCiclo + 14.75)
    porcentajeIluminacion = 50
  } else {
    nombre = 'Luna Balsámica'
    simbolo = '🌘'
    energia = 'Descanso · Introspección · Preparación para el nuevo ciclo'
    mensaje = 'La luna casi desaparece. Es el momento más sagrado de descanso y reflexión. Prepárate para el nuevo ciclo que llega. Deja ir todo lo del ciclo anterior.'
    practica = 'Descansa profundamente. Medita. Prepara espacio para lo que viene.'
    diasHastaLunaLlena = Math.round(29.53 - diaEnCiclo + 14.75)
    porcentajeIluminacion = Math.round(((29.53 - diaEnCiclo) / 14.75) * 100)
  }

  return { nombre, simbolo, energia, mensaje, practica, diasHastaLunaLlena: Math.max(0, diasHastaLunaLlena), porcentajeIluminacion }
}

export function getDiasHastaLunaLlena(): number {
  return getFaseLunar().diasHastaLunaLlena
}