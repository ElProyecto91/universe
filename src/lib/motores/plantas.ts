export const PLANTAS: Record<string, {
  simbolo: string
  keywords: string
  tradiciones: { nombre: string; significado: string }[]
  mensaje: string
  propiedades: string
}> = {
  lavanda: {
    simbolo: '💜',
    keywords: 'Calma · Purificación · Sueño · Protección',
    propiedades: 'Relajante, purificadora, protectora',
    tradiciones: [
      { nombre: 'Tradición europea', significado: 'La lavanda se usaba para purificar hogares y proteger del mal. En la Provenza francesa es símbolo de amor y fidelidad.' },
      { nombre: 'Magia herbal moderna', significado: 'Asociada a la calma mental, la claridad espiritual y la protección del hogar. Se quema para purificar espacios.' },
      { nombre: 'Medicina tradicional', significado: 'Históricamente usada para calmar la ansiedad, mejorar el sueño y aliviar dolores de cabeza.' },
    ],
    mensaje: 'La lavanda te invita a encontrar calma en medio del caos. Hay algo en tu entorno que necesita ser purificado — una situación, una relación, un espacio mental.',
  },
  roble: {
    simbolo: '🌳',
    keywords: 'Fortaleza · Sabiduría · Longevidad · Protección',
    propiedades: 'Enraizante, protector, fortalecedor',
    tradiciones: [
      { nombre: 'Tradición celta', significado: 'El roble era el árbol sagrado de los druidas, el rey del bosque. Duir en Ogham. Centro del mundo, puerta entre mundos.' },
      { nombre: 'Tradición griega y romana', significado: 'Sagrado para Zeus/Júpiter. El roble de Dodona era el árbol oracular más antiguo de Grecia.' },
      { nombre: 'Tradición nórdica', significado: 'Asociado a Thor. El roble atraía el rayo — la fuerza divina que purifica y transforma.' },
    ],
    mensaje: 'El roble te recuerda que la fortaleza más profunda tiene raíces igualmente profundas. ¿En qué necesitas echar raíces más sólidas antes de crecer más alto?',
  },
  rosa: {
    simbolo: '🌹',
    keywords: 'Amor · Belleza · Misterio · Dualidad',
    propiedades: 'Amorosa, sanadora del corazón, misteriosa',
    tradiciones: [
      { nombre: 'Tradición occidental', significado: 'La rosa es el símbolo más universal del amor. También aparece en la alquimia como símbolo de lo sagrado oculto.' },
      { nombre: 'Sufismo', significado: 'La rosa es el corazón abierto al amor divino. Rumi usaba la rosa como metáfora del alma que busca a Dios.' },
      { nombre: 'Alquimia', significado: 'La Rosarium Philosophorum es uno de los textos alquímicos más importantes. La rosa representa la perfección espiritual alcanzada.' },
    ],
    mensaje: 'La rosa recuerda que la belleza más profunda coexiste con las espinas. El amor verdadero — hacia ti mismo o hacia otros — requiere aceptar toda la planta, no solo las flores.',
  },
  salvia: {
    simbolo: '🌿',
    keywords: 'Sabiduría · Purificación · Claridad · Memoria',
    propiedades: 'Purificadora, clarificadora, protectora',
    tradiciones: [
      { nombre: 'Tradición latina', significado: 'Salvia viene de salvare — salvar, curar. Era la planta medicinal más importante de la Europa medieval.' },
      { nombre: 'Tradición nativa americana', significado: 'La salvia blanca (Salvia apiana) es sagrada para muchas naciones. Se usa en ceremonias de purificación.' },
      { nombre: 'Tradición árabe', significado: 'La salvia era conocida como la planta de la inmortalidad. Cultivada en jardines de mezquitas por su valor medicinal y espiritual.' },
    ],
    mensaje: 'La salvia llega cuando algo necesita ser purificado. Un pensamiento tóxico, un patrón viejo, una energía que ya no te sirve. ¿Qué necesitas dejar ir para recuperar la claridad?',
  },
  loto: {
    simbolo: '🪷',
    keywords: 'Iluminación · Renacimiento · Pureza · Trascendencia',
    propiedades: 'Espiritual, transformadora, trascendente',
    tradiciones: [
      { nombre: 'Hinduismo y budismo', significado: 'El loto nace del barro y florece inmaculado. Símbolo de la iluminación: el alma que surge del mundo material hacia la pureza espiritual.' },
      { nombre: 'Antiguo Egipto', significado: 'El loto azul era símbolo del sol naciente y la creación. Nefertem, dios de la salida del sol, emergía de una flor de loto.' },
      { nombre: 'Simbolismo universal', significado: 'El loto representa la capacidad de florecer en condiciones adversas. La belleza que emerge del sufrimiento.' },
    ],
    mensaje: 'El loto te recuerda que tus raíces en el barro no definen la flor que puedes ser. Todo lo que has vivido — incluyendo lo difícil — es el suelo del que emerges.',
  },
  rowan: {
    simbolo: '🌲',
    keywords: 'Protección · Visión · Magia · Umbral',
    propiedades: 'Protectora, visionaria, mágica',
    tradiciones: [
      { nombre: 'Tradición celta', significado: 'El serbal (rowan) es Luis en Ogham. Protege contra la magia dañina y abre la visión espiritual.' },
      { nombre: 'Tradición nórdica', significado: 'El serbal salvó a Thor de ser arrastrado por el río del inframundo. Símbolo de protección en situaciones de peligro.' },
      { nombre: 'Folklore escocés e irlandés', significado: 'Se plantaba junto a las casas para protegerlas. Sus bayas rojas y su cruz natural lo hacían poderoso contra fuerzas negativas.' },
    ],
    mensaje: 'El serbal aparece cuando necesitas protección y claridad de visión. Algo en tu vida requiere que actives tu discernimiento — no todo lo que brilla merece tu confianza.',
  },
  girasol: {
    simbolo: '🌻',
    keywords: 'Alegría · Lealtad · Energía solar · Claridad',
    propiedades: 'Luminosa, enraizante, solar',
    tradiciones: [
      { nombre: 'Mitología griega', significado: 'Clytie, ninfa enamorada de Apolo, fue transformada en girasol. Siempre mira hacia el sol como el alma que busca lo divino.' },
      { nombre: 'Tradición inca', significado: 'El girasol era sagrado para los incas como representación del dios sol Inti. Las sacerdotisas llevaban coronas de girasoles de oro.' },
      { nombre: 'Simbolismo moderno', significado: 'El girasol representa la lealtad, la alegría y la capacidad de seguir la luz incluso en los días grises.' },
    ],
    mensaje: 'El girasol te recuerda que puedes elegir dónde dirigir tu atención. ¿Estás mirando hacia la luz o hacia la sombra? Tu energía sigue tu mirada.',
  },
  hiedra: {
    simbolo: '🍃',
    keywords: 'Determinación · Resiliencia · Vínculos · Crecimiento',
    propiedades: 'Tenaz, vinculante, persistente',
    tradiciones: [
      { nombre: 'Tradición celta', significado: 'Gort en Ogham. La hiedra crece en espiral, símbolo de la vida que persiste y se expande sin importar las condiciones.' },
      { nombre: 'Tradición griega', significado: 'Sagrada para Dioniso. La hiedra representa la vida que persiste incluso en invierno, la inmortalidad y la fidelidad.' },
      { nombre: 'Folklore europeo', significado: 'La hiedra que crece en una casa se consideraba protectora. Su capacidad de cubrir lo viejo simbolizaba la renovación.' },
    ],
    mensaje: 'La hiedra te habla de lo que crece lento pero imparable. ¿Hay algo en tu vida que has subestimado por su lentitud? La constancia supera a los grandes gestos.',
  },
}

export function getPlantaAleatoria(): string {
  const plantas = Object.keys(PLANTAS)
  return plantas[Math.floor(Math.random() * plantas.length)]
}

export function getPlantaDelDia(): string {
  const hoy = new Date()
  const semilla = hoy.getFullYear() * 10000 + (hoy.getMonth() + 1) * 100 + hoy.getDate()
  const plantas = Object.keys(PLANTAS)
  return plantas[semilla % plantas.length]
}