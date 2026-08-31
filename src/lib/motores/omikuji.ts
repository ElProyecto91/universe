export type NivelSuerte = 'Dai-kichi' | 'Chu-kichi' | 'Sho-kichi' | 'Kichi' | 'Han-kichi' | 'Kyo'

export const NIVELES_SUERTE: Record<NivelSuerte, { español: string; color: string; descripcion: string }> = {
  'Dai-kichi': { español: 'Gran Fortuna', color: '#f59e0b', descripcion: 'La fortuna más alta. El universo te favorece plenamente.' },
  'Chu-kichi': { español: 'Fortuna Media', color: '#8b5cf6', descripcion: 'Fortuna estable y favorable. Las cosas fluyen con naturalidad.' },
  'Sho-kichi': { español: 'Pequeña Fortuna', color: '#06b6d4', descripcion: 'Fortuna modesta pero constante. Los pequeños pasos dan grandes resultados.' },
  'Kichi': { español: 'Fortuna', color: '#10b981', descripcion: 'Un día favorable. La atención y la gratitud multiplican tu fortuna.' },
  'Han-kichi': { español: 'Media Fortuna', color: '#6366f1', descripcion: 'El equilibrio es la clave hoy. Ni forzar ni retener.' },
  'Kyo': { español: 'Precaución', color: '#ef4444', descripcion: 'Un día para la reflexión y el cuidado. La adversidad enseña lo que el éxito no puede.' },
}

const PROBABILIDADES: NivelSuerte[] = [
  'Dai-kichi', 'Dai-kichi',
  'Chu-kichi', 'Chu-kichi', 'Chu-kichi',
  'Sho-kichi', 'Sho-kichi', 'Sho-kichi',
  'Kichi', 'Kichi', 'Kichi', 'Kichi',
  'Han-kichi', 'Han-kichi', 'Han-kichi',
  'Kyo', 'Kyo',
]

const MENSAJES_AMOR = [
  'Una conexión inesperada puede surgir cuando menos lo esperes.',
  'Abre tu corazón. Lo que buscas también te busca a ti.',
  'La paciencia en el amor siempre es recompensada.',
  'Comunica lo que sientes. Las palabras no dichas crean distancia.',
  'El amor que ya tienes merece más atención que el que buscas.',
  'Una conversación pendiente puede transformar una relación.',
]

const MENSAJES_TRABAJO = [
  'Tu esfuerzo es visible aunque no recibas reconocimiento inmediato.',
  'Una idea que tienes desde hace tiempo merece ser expresada.',
  'Colaborar con otros multiplicará tus resultados.',
  'La constancia supera al talento cuando el talento no trabaja.',
  'Un cambio de perspectiva puede resolver un problema persistente.',
  'Hoy es buen momento para iniciar algo nuevo en tu trabajo.',
]

const MENSAJES_SALUD = [
  'Escucha las señales de tu cuerpo. Descansar también es progresar.',
  'La energía mental y física están conectadas. Cuida ambas.',
  'Un pequeño hábito positivo puede transformar tu bienestar.',
  'La naturaleza tiene algo que ofrecerte hoy. Busca un momento al aire libre.',
  'Tu estado emocional influye en tu salud. Atiende lo que sientes.',
  'Hidratación, movimiento y silencio: los tres remedios más antiguos.',
]

const MENSAJES_CONSEJO = [
  'Lo que resistes persiste. Lo que aceptas puede transformarse.',
  'La gratitud abre puertas que el deseo cierra.',
  'No toda respuesta llega por el camino que esperamos.',
  'La sabiduría no es saber más, sino necesitar menos.',
  'Actúa desde tu centro, no desde tu miedo.',
  'El momento presente es el único lugar donde puedes vivir.',
]

function seleccionarAleatorio<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function obtenerSemillaDelDia(): number {
  const hoy = new Date()
  return hoy.getFullYear() * 10000 + (hoy.getMonth() + 1) * 100 + hoy.getDate()
}

export function generarOmikuji(userId?: string): {
  nivel: NivelSuerte
  amor: string
  trabajo: string
  salud: string
  consejo: string
} {
  const semilla = obtenerSemillaDelDia() + (userId ? userId.charCodeAt(0) : 0)
  const idx = semilla % PROBABILIDADES.length
  const nivel = PROBABILIDADES[idx]

  return {
    nivel,
    amor: seleccionarAleatorio(MENSAJES_AMOR),
    trabajo: seleccionarAleatorio(MENSAJES_TRABAJO),
    salud: seleccionarAleatorio(MENSAJES_SALUD),
    consejo: seleccionarAleatorio(MENSAJES_CONSEJO),
  }
}