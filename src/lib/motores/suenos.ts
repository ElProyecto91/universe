export const SIMBOLOS_SUENOS: Record<string, { significados: string[]; jungiano: string; folklore: string }> = {
  agua: {
    significados: ['emociones profundas', 'el inconsciente', 'purificación', 'cambio'],
    jungiano: 'El agua representa el inconsciente colectivo y las emociones que no hemos procesado conscientemente.',
    folklore: 'En muchas tradiciones, soñar con agua clara augura prosperidad; con agua turbia, dificultades emocionales.',
  },
  fuego: {
    significados: ['transformación', 'pasión', 'destrucción creativa', 'purificación'],
    jungiano: 'El fuego simboliza la libido en sentido amplio — la energía vital que puede crear o destruir.',
    folklore: 'El fuego en sueños es señal de cambios profundos. Si calienta, trae buenas noticias; si quema, advertencia.',
  },
  serpiente: {
    significados: ['sabiduría', 'transformación', 'peligro', 'energía kundalini', 'renovación'],
    jungiano: 'La serpiente es uno de los arquetipos más universales: representa la sombra, la sabiduría oculta y la transformación.',
    folklore: 'En tradiciones occidentales puede simbolizar traición; en orientales, sabiduría y buena suerte.',
  },
  vuelo: {
    significados: ['libertad', 'perspectiva elevada', 'escape', 'ambición', 'espiritualidad'],
    jungiano: 'Volar representa el deseo de trascender las limitaciones del ego y ver la situación desde una perspectiva más amplia.',
    folklore: 'Soñar que vuelas se interpreta universalmente como señal de libertad y de que superas obstáculos.',
  },
  casa: {
    significados: ['el self', 'la psique', 'seguridad', 'familia', 'el cuerpo'],
    jungiano: 'La casa es uno de los símbolos más poderosos del self. Cada habitación representa una parte de la psique.',
    folklore: 'Una casa en ruinas puede indicar necesidad de renovación interior; una casa amplia, expansión personal.',
  },
  lobo: {
    significados: ['instinto', 'libertad', 'peligro', 'comunidad', 'guía'],
    jungiano: 'El lobo representa la sombra — los instintos primarios que la civilización intenta suprimir.',
    folklore: 'En tradiciones nórdicas, el lobo es un compañero sagrado de Odin; en otras, una advertencia.',
  },
  muerte: {
    significados: ['transformación', 'fin de ciclo', 'cambio profundo', 'renacimiento'],
    jungiano: 'La muerte en sueños raramente significa muerte literal. Es el símbolo más poderoso de transformación y cambio.',
    folklore: 'Casi universalmente interpretada como señal de cambio profundo, no de muerte real.',
  },
  niño: {
    significados: ['inocencia', 'el self emergente', 'potencial', 'vulnerabilidad', 'nuevo comienzo'],
    jungiano: 'El niño divino representa el self que está emergiendo, el potencial no realizado y la capacidad de renovación.',
    folklore: 'Un niño feliz en sueños anuncia alegría y nuevos comienzos; uno que llora, preocupaciones.',
  },
}

export function analizarSueno(texto: string): string[] {
  const simbolosEncontrados: string[] = []
  const textoMin = texto.toLowerCase()
  Object.keys(SIMBOLOS_SUENOS).forEach(simbolo => {
    if (textoMin.includes(simbolo)) {
      simbolosEncontrados.push(simbolo)
    }
  })
  return simbolosEncontrados
}