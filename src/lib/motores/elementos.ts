export const ELEMENTOS = {
  fuego: {
    nombre: 'Fuego',
    simbolo: '🔥',
    latin: 'Ignis',
    keywords: 'Pasión · Transformación · Acción · Voluntad',
    color: '#ef4444',
    descripcion: 'El fuego transforma todo lo que toca. Es el elemento de la voluntad, la pasión y el cambio radical. Donde hay fuego, nada permanece igual.',
    luz: 'Iniciativa, liderazgo, creatividad, coraje, entusiasmo.',
    sombra: 'Impulsividad, destrucción, agresividad, agotamiento por exceso.',
    tradiciones: [
      { nombre: 'Alquimia', texto: 'El triángulo hacia arriba. Principio activo y masculino. El fuego del horno transmuta los metales impuros en oro.' },
      { nombre: 'Astrología', texto: 'Aries, Leo y Sagitario. Energía cardinal, fija y mutable del fuego. Espíritu, inspiración y acción.' },
      { nombre: 'Tarot', texto: 'El palo de Bastos. Voluntad, creatividad y emprendimiento.' },
      { nombre: 'Hinduismo', texto: 'Agni, el dios del fuego sagrado. Mensajero entre los mundos humano y divino.' },
    ],
    practica: 'Enciende una vela con intención. Observa la llama y deja que tu mente se calme. ¿Qué necesitas transformar hoy?',
  },
  agua: {
    nombre: 'Agua',
    simbolo: '🌊',
    latin: 'Aqua',
    keywords: 'Emoción · Intuición · Fluidez · Inconsciente',
    color: '#3b82f6',
    descripcion: 'El agua fluye alrededor de todos los obstáculos sin perder su naturaleza. Es el elemento de las emociones profundas, la intuición y el inconsciente.',
    luz: 'Empatía, intuición, adaptabilidad, compasión, creatividad emocional.',
    sombra: 'Sobre-emotividad, evasión, dependencia emocional, estancamiento.',
    tradiciones: [
      { nombre: 'Alquimia', texto: 'El triángulo hacia abajo. Principio receptivo y femenino. El agua disuelve, purifica y transforma por inmersión.' },
      { nombre: 'Astrología', texto: 'Cáncer, Escorpio y Piscis. Profundidad emocional, intuición y conexión con lo invisible.' },
      { nombre: 'Tarot', texto: 'El palo de Copas. Emociones, relaciones y mundo interior.' },
      { nombre: 'Taoísmo', texto: 'El agua es el símbolo del Tao mismo: fluye sin esfuerzo, ocupa los lugares más bajos y vence a la roca.' },
    ],
    practica: 'Siéntate frente a un vaso de agua o junto a cualquier cuerpo de agua. Observa sin juzgar. ¿Qué emoción lleva tiempo sin ser escuchada?',
  },
  tierra: {
    nombre: 'Tierra',
    simbolo: '🌍',
    latin: 'Terra',
    keywords: 'Estabilidad · Cuerpo · Manifestación · Paciencia',
    color: '#22c55e',
    descripcion: 'La tierra es la base sobre la que todo descansa. Es el elemento de la manifestación concreta, la paciencia y la conexión con el cuerpo y la naturaleza.',
    luz: 'Practicidad, fiabilidad, constancia, conexión con la naturaleza, capacidad de manifestar.',
    sombra: 'Rigidez, materialismo, resistencia al cambio, terquedad.',
    tradiciones: [
      { nombre: 'Alquimia', texto: 'El triángulo hacia abajo con línea. Seco y frío. La tierra es la base de toda manifestación material.' },
      { nombre: 'Astrología', texto: 'Tauro, Virgo y Capricornio. Concreción, trabajo y manifestación en el plano físico.' },
      { nombre: 'Tarot', texto: 'El palo de Oros/Pentáculos. Recursos materiales, trabajo y el mundo físico.' },
      { nombre: 'Cosmovisión andina', texto: 'Pachamama, la Madre Tierra, es una deidad viva que sustenta toda vida y merece reciprocidad.' },
    ],
    practica: 'Descálzate y pon los pies en la tierra, la hierba o el suelo. Respira. Siente el peso de tu cuerpo. ¿Qué necesitas construir con más paciencia?',
  },
  aire: {
    nombre: 'Aire',
    simbolo: '💨',
    latin: 'Aer',
    keywords: 'Pensamiento · Comunicación · Libertad · Cambio',
    color: '#f59e0b',
    descripcion: 'El aire es invisible pero esencial. Es el elemento del pensamiento, la comunicación y la libertad. Donde el aire circula, las ideas se mueven y todo puede cambiar.',
    luz: 'Inteligencia, comunicación, adaptabilidad, perspectiva amplia, creatividad mental.',
    sombra: 'Dispersión, superficialidad, exceso mental, desconexión del cuerpo.',
    tradiciones: [
      { nombre: 'Alquimia', texto: 'El triángulo hacia arriba con línea. Cálido y húmedo. El aire conecta el fuego y el agua, mediando entre opuestos.' },
      { nombre: 'Astrología', texto: 'Géminis, Libra y Acuario. Comunicación, relaciones y pensamiento.' },
      { nombre: 'Tarot', texto: 'El palo de Espadas. Mente, conflicto, verdad y decisión.' },
      { nombre: 'Tradición griega', texto: 'Aither es el aire puro que respiran los dioses, diferente del aer mortal. La pneuma es el soplo vital.' },
    ],
    practica: 'Sal al exterior y respira conscientemente durante 5 minutos. Observa el viento. ¿Qué pensamiento llevas demasiado tiempo rumiando?',
  },
  eter: {
    nombre: 'Éter',
    simbolo: '✨',
    latin: 'Aether',
    keywords: 'Espíritu · Conexión · Trascendencia · Unidad',
    color: '#8b5cf6',
    descripcion: 'El éter es el quinto elemento — el que contiene a todos los demás. Es el espíritu, la conciencia pura y la conexión con algo más grande que uno mismo.',
    luz: 'Espiritualidad, conexión con el todo, trascendencia, conciencia expandida.',
    sombra: 'Disociación, pérdida del sentido práctico, fuga de la realidad.',
    tradiciones: [
      { nombre: 'Tradición griega', texto: 'Aristóteles propuso el éter como el quinto elemento del que están hechos los cuerpos celestes, incorruptible e inmutable.' },
      { nombre: 'Hinduismo', texto: 'Akasha es el espacio primordial del que emergen los otros cuatro elementos. Es el registro de todo lo que ha sido.' },
      { nombre: 'Alquimia', texto: 'La Quinta Essentia era lo que los alquimistas buscaban extraer de la materia — la esencia pura y espiritual de todas las cosas.' },
      { nombre: 'Wicca', texto: 'El Espíritu es el quinto punto de la pentágrama, que corona y unifica los cuatro elementos materiales.' },
    ],
    practica: 'Siéntate en silencio y observa tu propia conciencia observando. ¿Quién es el que observa? Permanece en esa pregunta sin buscar respuesta.',
  },
}

export function getElementoDelDia(): keyof typeof ELEMENTOS {
  const hoy = new Date()
  const semilla = hoy.getFullYear() * 10000 + (hoy.getMonth() + 1) * 100 + hoy.getDate()
  const elementos = Object.keys(ELEMENTOS) as Array<keyof typeof ELEMENTOS>
  return elementos[semilla % elementos.length]
}