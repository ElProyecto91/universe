import { calcularNumerologia } from './numerologia'

export function calcularCompatibilidad(
  nombre1: string, fecha1: string,
  nombre2: string, fecha2: string
) {
  const n1 = calcularNumerologia(nombre1, fecha1)
  const n2 = calcularNumerologia(nombre2, fecha2)

  const suma = n1.numeroVida + n2.numeroVida
  const reducir = (n: number): number => {
    if (n === 11 || n === 22 || n === 33) return n
    if (n < 10) return n
    return reducir(n.toString().split('').reduce((a, b) => a + parseInt(b), 0))
  }

  const numeroConexion = reducir(suma)

  const TIPOS_CONEXION: Record<number, { titulo: string; descripcion: string; desafio: string; potencial: string }> = {
    1: { titulo: 'Conexión de Liderazgo', descripcion: 'Dos fuerzas independientes que pueden inspirarse mutuamente o competir. La clave está en dar espacio a la autonomía del otro.', desafio: 'Evitar la lucha por el control. Ambos necesitan sentirse líderes.', potencial: 'Juntos pueden iniciar proyectos extraordinarios y motivarse mutuamente.' },
    2: { titulo: 'Conexión de Armonía', descripcion: 'Una de las combinaciones más armoniosas. Sensibilidad mutua, intuición compartida y profunda comprensión emocional.', desafio: 'Evitar la codependencia. Cada uno necesita también tiempo propio.', potencial: 'Pueden crear una relación de profunda intimidad y comprensión mutua.' },
    3: { titulo: 'Conexión Creativa', descripcion: 'Alegría, creatividad y comunicación fluida. Esta combinación trae energía y optimismo a cualquier tipo de relación.', desafio: 'Evitar la superficialidad. La profundidad requiere esfuerzo consciente.', potencial: 'Una relación llena de creatividad, diversión y expresión compartida.' },
    4: { titulo: 'Conexión de Construcción', descripcion: 'Una combinación sólida y confiable. Juntos pueden construir algo duradero — ya sea una amistad, proyecto o familia.', desafio: 'Evitar caer en la rutina. La espontaneidad debe cultivarse activamente.', potencial: 'Estabilidad, confianza mutua y capacidad de construir algo que dure.' },
    5: { titulo: 'Conexión de Aventura', descripcion: 'Energía dinámica, cambio constante y mucha libertad. Esta relación nunca es aburrida pero requiere flexibilidad de ambas partes.', desafio: 'Establecer suficiente estabilidad para que la relación pueda crecer.', potencial: 'Aventura, crecimiento mutuo y experiencias extraordinarias juntos.' },
    6: { titulo: 'Conexión de Cuidado', descripcion: 'Una combinación cargada de amor, responsabilidad y cuidado mutuo. Ambos se preocupan profundamente por el bienestar del otro.', desafio: 'Evitar el perfeccionismo y el sacrificio excesivo de uno por el otro.', potencial: 'Una relación llena de amor genuino, apoyo y crecimiento compartido.' },
    7: { titulo: 'Conexión Espiritual', descripcion: 'Una combinación profunda e intelectualmente estimulante. Comparten la búsqueda de verdad y significado más allá de la superficie.', desafio: 'El exceso de análisis puede bloquear la espontaneidad emocional.', potencial: 'Crecimiento espiritual compartido y comprensión a niveles poco comunes.' },
    8: { titulo: 'Conexión de Poder', descripcion: 'Una combinación poderosa y ambiciosa. Juntos pueden lograr grandes cosas en el mundo material si canalizan bien su energía.', desafio: 'El poder puede generar conflictos de control si no se gestiona bien.', potencial: 'Manifestación conjunta de metas ambiciosas y éxito compartido.' },
    9: { titulo: 'Conexión Universal', descripcion: 'Una de las combinaciones más espirituales. Ambos tienen un sentido del propósito mayor y se inspiran mutuamente hacia el servicio.', desafio: 'Pueden descuidar las necesidades prácticas por las espirituales.', potencial: 'Una relación con sentido de misión compartida y profundo propósito.' },
    11: { titulo: 'Conexión Maestra', descripcion: 'Una combinación rara e intensa. Número maestro — esta relación tiene un potencial transformador extraordinario.', desafio: 'La intensidad puede ser abrumadora si no se maneja con madurez.', potencial: 'Transformación profunda y crecimiento espiritual acelerado para ambos.' },
    22: { titulo: 'Conexión Constructora Maestra', descripcion: 'Número maestro — juntos pueden manifestar visiones a gran escala que impactan más allá de ellos mismos.', desafio: 'La magnitud de la visión compartida puede generar presión excesiva.', potencial: 'Capacidad de construir algo que trasciende a los dos individualmente.' },
  }

  const conexion = TIPOS_CONEXION[numeroConexion] || TIPOS_CONEXION[9]

  return {
    persona1: { nombre: nombre1, numeroVida: n1.numeroVida },
    persona2: { nombre: nombre2, numeroVida: n2.numeroVida },
    numeroConexion,
    conexion,
  }
}