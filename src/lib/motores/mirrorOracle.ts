export const PREGUNTAS_MIRROR = [
  {
    categoria: 'Autoconocimiento',
    pregunta: '¿Qué parte de ti mismo has estado ignorando últimamente?',
    profundizacion: '¿Qué pasaría si le dedicaras atención plena durante una semana?',
  },
  {
    categoria: 'Relaciones',
    pregunta: '¿Qué es lo que más temes perder en tus relaciones más importantes?',
    profundizacion: '¿Ese miedo te acerca o te aleja de las personas que amas?',
  },
  {
    categoria: 'Propósito',
    pregunta: '¿Qué harías diferente si supieras que no puedes fallar?',
    profundizacion: '¿Qué te impide intentarlo aun sabiendo que sí puedes fallar?',
  },
  {
    categoria: 'Sombra',
    pregunta: '¿Qué es lo que más criticas en los demás?',
    profundizacion: '¿Dónde vive esa misma cualidad —que criticas— dentro de ti?',
  },
  {
    categoria: 'Crecimiento',
    pregunta: '¿Cuál es la versión de ti mismo que más miedo te da convertirte?',
    profundizacion: '¿Y cuál es la versión que más deseas ser?',
  },
  {
    categoria: 'Presente',
    pregunta: '¿Qué estarías haciendo ahora si vivieras completamente en el presente?',
    profundizacion: '¿Qué te impide hacer exactamente eso?',
  },
  {
    categoria: 'Legado',
    pregunta: '¿Qué quieres que recuerden de ti las personas que más quieres?',
    profundizacion: '¿Tu vida actual está construyendo ese legado?',
  },
  {
    categoria: 'Gratitud',
    pregunta: '¿Qué aspecto de tu vida actual das por sentado pero perdería mucho valor si desapareciera?',
    profundizacion: '¿Cómo cambiaría tu día si lo valoraras conscientemente?',
  },
  {
    categoria: 'Límites',
    pregunta: '¿Dónde en tu vida estás diciendo sí cuando tu alma dice no?',
    profundizacion: '¿Qué pasaría si dijeras no en ese lugar?',
  },
  {
    categoria: 'Autenticidad',
    pregunta: '¿En qué momentos de tu vida no eres completamente tú mismo?',
    profundizacion: '¿Qué necesitarías para serlo?',
  },
  {
    categoria: 'Transformación',
    pregunta: '¿Qué hábito o patrón sabes que necesitas cambiar pero llevas tiempo posponiendo?',
    profundizacion: '¿Qué es lo que realmente te cuesta de ese cambio?',
  },
  {
    categoria: 'Conexión',
    pregunta: '¿Con quién en tu vida sientes que has perdido conexión y echas de menos?',
    profundizacion: '¿Qué necesitarías hacer para reconectar?',
  },
]

export function getPreguntaDelDia() {
  const hoy = new Date()
  const semilla = hoy.getFullYear() * 10000 + (hoy.getMonth() + 1) * 100 + hoy.getDate()
  return PREGUNTAS_MIRROR[semilla % PREGUNTAS_MIRROR.length]
}

export function getPreguntaAleatoria() {
  return PREGUNTAS_MIRROR[Math.floor(Math.random() * PREGUNTAS_MIRROR.length)]
}