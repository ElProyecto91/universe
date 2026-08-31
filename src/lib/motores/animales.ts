export const ANIMALES: Record<string, {
  simbolo: string
  keywords: string
  tradiciones: { nombre: string; significado: string }[]
  mensaje: string
}> = {
  lobo: {
    simbolo: '🐺',
    keywords: 'Instinto · Manada · Libertad · Intuición',
    tradiciones: [
      { nombre: 'Tradición Nórdica', significado: 'El lobo es sagrado para Odin. Fenrir representa las fuerzas primordiales que no pueden ser domesticadas. Geri y Freki son los compañeros fieles del dios.' },
      { nombre: 'Tradición Nativa americana', significado: 'En muchas naciones, el lobo es maestro, guía y símbolo de lealtad al clan. Es el camino del explorador.' },
      { nombre: 'Psicología jungiana', significado: 'El lobo representa la sombra — los instintos que la civilización intenta suprimir pero que contienen sabiduría vital.' },
      { nombre: 'Folklore europeo', significado: 'En el folklore occidental, el lobo es frecuentemente el peligro del bosque oscuro, aunque también aparece como protector en algunas tradiciones.' },
    ],
    mensaje: 'El lobo te visita para recordarte que confíes en tu instinto. Tu manada — quienes realmente te apoyan — importa. La libertad y la lealtad no son opuestos.',
  },
  águila: {
    simbolo: '🦅',
    keywords: 'Visión · Perspectiva · Libertad · Mensajero',
    tradiciones: [
      { nombre: 'Tradición Nativa americana', significado: 'El águila es el mensajero entre el mundo humano y el espiritual. Vuela más alto que cualquier otro pájaro y lleva las oraciones al cielo.' },
      { nombre: 'Tradición Romana', significado: 'El águila era el animal sagrado de Júpiter y símbolo del poder romano. Representaba la conexión entre los dioses y los emperadores.' },
      { nombre: 'Tradición Azteca', significado: 'El águila y el jaguar eran los guerreros sagrados. El águila representa el sol y la fuerza diurna.' },
      { nombre: 'Simbolismo universal', significado: 'La perspectiva elevada del águila simboliza la capacidad de ver la situación completa sin perderse en los detalles.' },
    ],
    mensaje: 'El águila te invita a elevar tu perspectiva. Lo que desde abajo parece un problema, desde las alturas puede ser una oportunidad. Confía en tu visión de largo alcance.',
  },
  serpiente: {
    simbolo: '🐍',
    keywords: 'Transformación · Sabiduría · Renovación · Dualidad',
    tradiciones: [
      { nombre: 'Tradición griega', significado: 'La serpiente es símbolo de Asclepio, dios de la medicina. El caduceo con dos serpientes representa el equilibrio de fuerzas opuestas.' },
      { nombre: 'Tradición hindú', significado: 'Kundalini es la serpiente de energía espiritual dormida en la base de la columna. Cuando despierta, lleva a la iluminación.' },
      { nombre: 'Tradición egipcia', significado: 'La serpiente Uraeus era símbolo de realeza y protección divina. Apofis era el caos primordial; Ra lo vencía cada noche.' },
      { nombre: 'Psicología jungiana', significado: 'La serpiente es uno de los símbolos más universales del inconsciente, la sabiduría oculta y la capacidad de renovación.' },
    ],
    mensaje: 'La serpiente muda de piel sin morir. Te invita a soltar lo que ya no eres para revelarte en tu nueva forma. La transformación que temes ya está en marcha.',
  },
  cuervo: {
    simbolo: '🐦‍⬛',
    keywords: 'Magia · Misterio · Mensajes · Inteligencia',
    tradiciones: [
      { nombre: 'Tradición Nórdica', significado: 'Huginn y Muninn son los cuervos de Odin que vuelan por los nueve mundos cada día y le traen información. Representan el pensamiento y la memoria.' },
      { nombre: 'Tradición Celta', significado: 'El cuervo está asociado a la Morrigan, diosa de la batalla y la transformación. Es un mensajero entre mundos.' },
      { nombre: 'Tradición japonesa', significado: 'Yatagarasu, el cuervo de tres patas, es una deidad solar y guía divino en la mitología japonesa.' },
      { nombre: 'Simbolismo universal', significado: 'El cuervo es universalmente asociado con la magia, el misterio y la inteligencia. Su aparición suele anunciar un mensaje importante.' },
    ],
    mensaje: 'El cuervo trae un mensaje. Presta atención a lo que has estado ignorando — en los márgenes, en los sueños, en las coincidencias. La magia está en los detalles.',
  },
  mariposa: {
    simbolo: '🦋',
    keywords: 'Transformación · Renacimiento · Ligereza · Alegría',
    tradiciones: [
      { nombre: 'Tradición griega', significado: 'Psyche (alma) se representa con alas de mariposa. La mariposa es el alma liberada de la crisálida del cuerpo.' },
      { nombre: 'Tradición azteca', significado: 'Las mariposas monarca eran consideradas almas de los guerreros caídos que regresaban cada año.' },
      { nombre: 'Tradición japonesa', significado: 'En Japón, la mariposa representa la transformación del alma. También simboliza la alegría y la longevidad.' },
      { nombre: 'Simbolismo universal', significado: 'La mariposa es el símbolo más universal de la transformación completa — de oruga a algo radicalmente diferente y más libre.' },
    ],
    mensaje: 'La mariposa recuerda que la crisálida no es una tumba sino un laboratorio de transformación. Lo que parece confinamiento puede ser exactamente el proceso que necesitas.',
  },
  delfín: {
    simbolo: '🐬',
    keywords: 'Alegría · Inteligencia · Juego · Comunicación',
    tradiciones: [
      { nombre: 'Tradición griega', significado: 'Los delfines eran mensajeros de Poseidón y salvadores de náufragos. Apolo tomó forma de delfín para guiar a los sacerdotes a Delfos.' },
      { nombre: 'Tradición celta', significado: 'En el folklore celta, los delfines eran guardianes del mar y compañeros de los viajeros en travesías peligrosas.' },
      { nombre: 'Simbolismo moderno', significado: 'El delfín representa la inteligencia emocional, la alegría y la capacidad de navegar entre el mundo consciente y el inconsciente.' },
    ],
    mensaje: 'El delfín te invita a no tomarte todo tan en serio. La alegría y el juego no son lujos — son el combustible de la inteligencia y la creatividad.',
  },
  oso: {
    simbolo: '🐻',
    keywords: 'Fuerza · Introspección · Sanación · Protección',
    tradiciones: [
      { nombre: 'Tradición nórdica', significado: 'Los berserkers guerreros tomaban la fuerza del oso sagrado. Björn (oso) era uno de los nombres más poderosos.' },
      { nombre: 'Tradición nativa americana', significado: 'El oso es el gran sanador y el guardián del oeste. La hibernación representa la introspección y el viaje interior.' },
      { nombre: 'Tradición eslava', significado: 'El oso era el ancestro sagrado de muchos pueblos eslavos, considerado el rey del bosque y símbolo de la tierra misma.' },
    ],
    mensaje: 'El oso te pide que cuides de ti mismo con la misma fiereza con que proteges a quienes amas. Es tiempo de introspección, de hibernar si es necesario, de sanar.',
  },
  búho: {
    simbolo: '🦉',
    keywords: 'Sabiduría · Visión nocturna · Misterio · Verdad',
    tradiciones: [
      { nombre: 'Tradición griega', significado: 'El búho es el animal sagrado de Atenea, diosa de la sabiduría. Su visión en la oscuridad representa la capacidad de ver la verdad cuando otros no pueden.' },
      { nombre: 'Tradición nativa americana', significado: 'En algunas naciones, el búho es mensajero del mundo espiritual. En otras, anuncia cambios importantes.' },
      { nombre: 'Tradición japonesa', significado: 'El búho (fukuro) representa la buena suerte y la protección. Su capacidad de girar la cabeza simboliza una perspectiva amplia.' },
    ],
    mensaje: 'El búho ve en la oscuridad lo que el día oculta. Te invita a confiar en tu percepción cuando otros dudan, a buscar la verdad más allá de las apariencias.',
  },
  zorro: {
    simbolo: '🦊',
    keywords: 'Astucia · Adaptabilidad · Ingenio · Observación',
    tradiciones: [
      { nombre: 'Tradición japonesa', significado: 'El kitsune (zorro) es una criatura mágica con gran inteligencia. Los zorros de múltiples colas son mensajeros de Inari, deidad de la abundancia.' },
      { nombre: 'Tradición celta', significado: 'El zorro es el observador del bosque, el que conoce todos los caminos ocultos. Representa la sabiduría práctica y el ingenio.' },
      { nombre: 'Folklore europeo', significado: 'En las fábulas europeas, el zorro es el trickster — el que usa la inteligencia donde otros usan la fuerza.' },
    ],
    mensaje: 'El zorro te recuerda que la inteligencia supera a la fuerza. Observa más, habla menos. El momento adecuado para actuar llegará — y lo reconocerás.',
  },
  dragón: {
    simbolo: '🐉',
    keywords: 'Poder · Sabiduría · Transformación · Fuego',
    tradiciones: [
      { nombre: 'Tradición china', significado: 'El dragón chino es símbolo de fortuna, prosperidad y poder imperial. No es enemigo sino protector y fuente de sabiduría.' },
      { nombre: 'Tradición europea', significado: 'En Europa, el dragón guarda tesoros y representa las fuerzas primordiales que el héroe debe enfrentar y transformar.' },
      { nombre: 'Tradición galesa', significado: 'El dragón rojo de Gales simboliza la fuerza de la nación y la resistencia ante la adversidad.' },
    ],
    mensaje: 'El dragón es el guardián del tesoro interior. Lo que más te asusta contiene exactamente lo que más necesitas. La fuerza que buscas ya existe dentro de ti.',
  },
}

export function getAnimalPorNombre(texto: string): string | null {
  const textoMin = texto.toLowerCase()
  const animales = Object.keys(ANIMALES)
  for (const animal of animales) {
    if (textoMin.includes(animal)) return animal
  }
  return null
}

export function getAnimalAleatorio(): string {
  const animales = Object.keys(ANIMALES)
  return animales[Math.floor(Math.random() * animales.length)]
}