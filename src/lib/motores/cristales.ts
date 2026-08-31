export const CRISTALES: Record<string, {
  color: string
  hex: string
  keywords: string
  propiedades: string[]
  usos: string[]
  chakra: string
  elemento: string
  planeta: string
  afirmacion: string
  tradiciones: { nombre: string; texto: string }[]
}> = {
  'Amatista': {
    color: 'Púrpura',
    hex: '#9b59b6',
    keywords: 'Intuición · Espiritualidad · Protección · Calma',
    propiedades: ['Amplifica la intuición', 'Protege contra energías negativas', 'Facilita la meditación', 'Calma la mente agitada'],
    usos: ['Meditar sosteniéndola en la mano izquierda', 'Colocarla bajo la almohada para sueños lúcidos', 'Ponerla en el espacio de trabajo para claridad mental'],
    chakra: 'Tercer ojo (Ajna) · Corona (Sahasrara)',
    elemento: 'Aire',
    planeta: 'Júpiter · Saturno',
    afirmacion: 'Mi intuición es clara y confiable. Estoy protegido por la luz divina.',
    tradiciones: [
      { nombre: 'Antigua Grecia', texto: 'Los griegos creían que la amatista prevenía la embriaguez. Amethystos significa "no embriagado".' },
      { nombre: 'Egipto antiguo', texto: 'Usada en amuletos de protección y joyas reales. Associated con el signo de Capricornio.' },
      { nombre: 'Cristaloterapia moderna', texto: 'Considerada la piedra de la espiritualidad por excelencia. Amplifica la conciencia superior.' },
    ],
  },
  'Cuarzo Rosa': {
    color: 'Rosa',
    hex: '#f4a7b9',
    keywords: 'Amor · Compasión · Sanación emocional · Autoestima',
    propiedades: ['Atrae el amor en todas sus formas', 'Sana heridas emocionales del pasado', 'Fomenta el amor propio', 'Abre el chakra del corazón'],
    usos: ['Llevarlo cerca del corazón', 'Colocarlo en el dormitorio para atraer amor', 'Sostenerlo durante momentos de tristeza o duelo'],
    chakra: 'Corazón (Anahata)',
    elemento: 'Agua · Tierra',
    planeta: 'Venus',
    afirmacion: 'Soy digno de amor. Mi corazón está abierto para dar y recibir amor incondicionalmente.',
    tradiciones: [
      { nombre: 'Roma antigua', texto: 'Asociado a Venus. Los romanos lo usaban en pociones de amor y como regalo entre amantes.' },
      { nombre: 'Egipto antiguo', texto: 'Se encontraron mascarillas de cuarzo rosa en tumbas egipcias — se creía que mantenía la piel joven.' },
      { nombre: 'Cristaloterapia moderna', texto: 'La piedra del amor incondicional. Trabaja tanto el amor romántico como el amor propio.' },
    ],
  },
  'Obsidiana': {
    color: 'Negro',
    hex: '#2c2c2c',
    keywords: 'Protección · Verdad · Sombra · Enraizamiento',
    propiedades: ['Protección psíquica poderosa', 'Revela verdades ocultas', 'Ayuda a trabajar con la sombra', 'Enraíza y ancla la energía'],
    usos: ['Llevarla como escudo energético en lugares de mucha gente', 'Meditación para explorar la sombra personal', 'Colocarla en la entrada del hogar como protección'],
    chakra: 'Raíz (Muladhara)',
    elemento: 'Fuego · Tierra',
    planeta: 'Saturno · Plutón',
    afirmacion: 'Estoy protegido. La verdad me libera. Abrazo todas mis partes con compasión.',
    tradiciones: [
      { nombre: 'Mesoamérica', texto: 'Los aztecas y mayas la usaban en espejos de adivinación — el tezcatlipoca — para ver el futuro y comunicarse con los dioses.' },
      { nombre: 'Tradición chamánica', texto: 'Usada por chamanes para viajes espirituales y protección durante el trabajo con el inframundo.' },
      { nombre: 'Cristaloterapia moderna', texto: 'La piedra espejo — refleja lo que necesitamos ver de nosotros mismos para sanar.' },
    ],
  },
  'Citrino': {
    color: 'Amarillo dorado',
    hex: '#f1c40f',
    keywords: 'Abundancia · Alegría · Manifestación · Energía solar',
    propiedades: ['Atrae la abundancia y la prosperidad', 'Eleva el estado de ánimo', 'Potencia la manifestación de intenciones', 'Activa la creatividad'],
    usos: ['Colocarlo en la cartera o caja de dinero', 'Llevarlo durante presentaciones o negociaciones', 'Sostenerlo al escribir intenciones o afirmaciones'],
    chakra: 'Plexo Solar (Manipura)',
    elemento: 'Fuego',
    planeta: 'Sol · Mercurio',
    afirmacion: 'Soy un imán para la abundancia. La prosperidad fluye hacia mí de formas esperadas e inesperadas.',
    tradiciones: [
      { nombre: 'Francia medieval', texto: 'Llamado "piedra de mercader" — los comerciantes la llevaban para atraer clientes y prosperidad.' },
      { nombre: 'Tradición hindú', texto: 'Asociado con Manipura chakra. Activa la voluntad y el poder personal para manifestar en el mundo material.' },
      { nombre: 'Cristaloterapia moderna', texto: 'Una de las pocas piedras que no acumula energía negativa — no necesita ser limpiada.' },
    ],
  },
  'Lapislázuli': {
    color: 'Azul profundo con dorado',
    hex: '#1a5276',
    keywords: 'Sabiduría · Verdad · Comunicación · Poder',
    propiedades: ['Activa la sabiduría interior', 'Potencia la comunicación auténtica', 'Abre la visión espiritual', 'Conecta con la verdad más profunda'],
    usos: ['Llevarlo al cuello para potenciar la voz', 'Sostenerlo durante escritura o comunicación importante', 'Meditación para acceder a la sabiduría interna'],
    chakra: 'Garganta (Vishuddha) · Tercer ojo (Ajna)',
    elemento: 'Agua · Aire',
    planeta: 'Venus · Júpiter',
    afirmacion: 'Hablo mi verdad con claridad y confianza. Mi sabiduría interior me guía.',
    tradiciones: [
      { nombre: 'Egipto antiguo', texto: 'Más valioso que el oro. Los faraones lo usaban en sus máscaras funerarias. Asociado a Ra y a la realeza divina.' },
      { nombre: 'Mesopotamia', texto: 'Usado en sellos y amuletos reales. Los sumerios creían que contenía la esencia de los dioses.' },
      { nombre: 'Renacimiento', texto: 'Molido para crear el pigmento azul ultramarino — el más valioso de la historia. Usado por Miguel Ángel y Rafael.' },
    ],
  },
  'Turmalina Negra': {
    color: 'Negro',
    hex: '#34495e',
    keywords: 'Protección · Límites · Enraizamiento · Purificación',
    propiedades: ['La protección más poderosa del reino mineral', 'Absorbe y transmuta energías negativas', 'Establece límites energéticos claros', 'Enraíza profundamente'],
    usos: ['Llevarla en el bolsillo izquierdo como escudo', 'Colocarla en las cuatro esquinas del hogar', 'Sostenerla cuando necesites poner límites'],
    chakra: 'Raíz (Muladhara)',
    elemento: 'Tierra',
    planeta: 'Saturno',
    afirmacion: 'Estoy completamente protegido. Mis límites son sagrados y respetados.',
    tradiciones: [
      { nombre: 'Tradición africana', texto: 'Usada por chamanes para protección durante ceremonias. Se enterraba en el umbral de las casas.' },
      { nombre: 'Alquimia medieval', texto: 'Considerada un escudo contra los espíritus maliciosos y la envidia ajena.' },
      { nombre: 'Cristaloterapia moderna', texto: 'La piedra de protección más recomendada para personas altamente sensibles o empáticas.' },
    ],
  },
  'Selenita': {
    color: 'Blanco perlado',
    hex: '#f0f0f0',
    keywords: 'Pureza · Claridad · Conexión angélica · Paz',
    propiedades: ['Purifica el espacio y otras piedras', 'Conecta con guías y ángeles', 'Trae paz mental y claridad', 'Limpia el aura'],
    usos: ['Colocarla en el centro del hogar para purificar el ambiente', 'Usarla para limpiar otras piedras', 'Sostenerla durante la meditación para elevar la vibración'],
    chakra: 'Corona (Sahasrara)',
    elemento: 'Éter · Aire',
    planeta: 'Luna',
    afirmacion: 'Estoy conectado con la luz divina. Mi espacio es sagrado y puro.',
    tradiciones: [
      { nombre: 'Etimología', texto: 'Su nombre viene de Selene, la diosa griega de la luna. Siempre ha estado asociada a la energía lunar.' },
      { nombre: 'Tradición wicca', texto: 'Usada en altares para purificación y para cargar otras herramientas rituales bajo la luna llena.' },
      { nombre: 'Cristaloterapia moderna', texto: 'Una de las pocas piedras que purifica a otras. Nunca necesita ser limpiada ella misma.' },
    ],
  },
  'Malaquita': {
    color: 'Verde bandas',
    hex: '#27ae60',
    keywords: 'Transformación · Crecimiento · Protección · Cambio',
    propiedades: ['Amplifica las emociones para facilitar la sanación', 'Protege de radiaciones y contaminación', 'Cataliza la transformación profunda', 'Absorbe energías negativas'],
    usos: ['Llevarla durante períodos de cambio o transformación', 'Colocarla sobre el corazón para sanar heridas emocionales', 'No usar en agua — es tóxica cuando se disuelve'],
    chakra: 'Corazón (Anahata) · Plexo Solar (Manipura)',
    elemento: 'Tierra · Fuego',
    planeta: 'Venus',
    afirmacion: 'Abrazo el cambio con valentía. Cada transformación me hace más auténtico.',
    tradiciones: [
      { nombre: 'Egipto antiguo', texto: 'Las minas del Sinaí fueron explotadas por los egipcios durante milenios. Protectora de viajeros y niños.' },
      { nombre: 'Grecia y Roma', texto: 'Asociada a Venus/Afrodita. Usada en joyas y como pigmento verde en pinturas.' },
      { nombre: 'Rusia zarista', texto: 'El palacio de Invierno tiene columnas enteras de malaquita. Símbolo de poder y transformación.' },
    ],
  },
  'Piedra Luna': {
    color: 'Blanco azulado iridiscente',
    hex: '#aed6f1',
    keywords: 'Ciclos · Intuición · Feminidad · Nuevos comienzos',
    propiedades: ['Conecta con los ciclos lunares', 'Potencia la intuición femenina', 'Facilita los nuevos comienzos', 'Equilibra las emociones'],
    usos: ['Llevarla durante la luna nueva para intenciones', 'Sostenerla para conectar con la intuición', 'Colocarla bajo la luna llena para cargarla'],
    chakra: 'Corona (Sahasrara) · Sacro (Svadhisthana)',
    elemento: 'Agua',
    planeta: 'Luna',
    afirmacion: 'Fluyo con los ciclos de la vida. Mi intuición me guía con claridad y gracia.',
    tradiciones: [
      { nombre: 'India', texto: 'Considerada sagrada — se creía que contenía luz lunar real. Usada en joyas de boda para traer armonía.' },
      { nombre: 'Roma antigua', texto: 'Los romanos creían que la piedra luna contenía la imagen de Diana, diosa de la luna.' },
      { nombre: 'Tradición árabe', texto: 'Usada por mujeres embarazadas como protección y para facilitar el parto.' },
    ],
  },
  'Cuarzo Transparente': {
    color: 'Transparente',
    hex: '#e8f8ff',
    keywords: 'Amplificación · Claridad · Maestro sanador · Energía universal',
    propiedades: ['Amplifica la energía de cualquier intención', 'La piedra maestra sanadora', 'Trae claridad mental y espiritual', 'Puede programarse con cualquier intención'],
    usos: ['Programarlo con una intención específica sosteniéndolo y visualizando', 'Usarlo para amplificar el efecto de otras piedras', 'Meditación para claridad absoluta'],
    chakra: 'Todos los chakras',
    elemento: 'Todos los elementos',
    planeta: 'Sol · Luna',
    afirmacion: 'Mi intención es clara y poderosa. El universo amplifica todo lo que dirijo con amor.',
    tradiciones: [
      { nombre: 'Muchas culturas', texto: 'Prácticamente todas las tradiciones espirituales del mundo reconocen el cuarzo como piedra sagrada.' },
      { nombre: 'Chamanes siberianos', texto: 'Lo llamaban "hielo eterno" y lo usaban como espejo para ver el pasado y el futuro.' },
      { nombre: 'Japón', texto: 'El cuarzo es símbolo de pureza y perfección en la tradición japonesa.' },
    ],
  },
}

export function getCristalRecomendado(signo: string, intencion: string): string {
  const recomendaciones: Record<string, Record<string, string>> = {
    amor: {
      Aries: 'Cuarzo Rosa', Tauro: 'Cuarzo Rosa', Géminis: 'Lapislázuli',
      Cáncer: 'Piedra Luna', Leo: 'Cuarzo Rosa', Virgo: 'Malaquita',
      Libra: 'Cuarzo Rosa', Escorpio: 'Obsidiana', Sagitario: 'Turmalina Negra',
      Capricornio: 'Cuarzo Rosa', Acuario: 'Lapislázuli', Piscis: 'Piedra Luna',
    },
    proteccion: {
      Aries: 'Obsidiana', Tauro: 'Turmalina Negra', Géminis: 'Turmalina Negra',
      Cáncer: 'Obsidiana', Leo: 'Citrino', Virgo: 'Turmalina Negra',
      Libra: 'Selenita', Escorpio: 'Obsidiana', Sagitario: 'Turmalina Negra',
      Capricornio: 'Turmalina Negra', Acuario: 'Obsidiana', Piscis: 'Turmalina Negra',
    },
    abundancia: {
      Aries: 'Citrino', Tauro: 'Citrino', Géminis: 'Citrino',
      Cáncer: 'Cuarzo Transparente', Leo: 'Citrino', Virgo: 'Citrino',
      Libra: 'Cuarzo Rosa', Escorpio: 'Citrino', Sagitario: 'Citrino',
      Capricornio: 'Citrino', Acuario: 'Lapislázuli', Piscis: 'Cuarzo Transparente',
    },
    espiritualidad: {
      Aries: 'Amatista', Tauro: 'Selenita', Géminis: 'Lapislázuli',
      Cáncer: 'Piedra Luna', Leo: 'Cuarzo Transparente', Virgo: 'Amatista',
      Libra: 'Selenita', Escorpio: 'Amatista', Sagitario: 'Lapislázuli',
      Capricornio: 'Obsidiana', Acuario: 'Amatista', Piscis: 'Selenita',
    },
  }

  const intencionKey = intencion.toLowerCase().includes('amor') ? 'amor'
    : intencion.toLowerCase().includes('protec') ? 'proteccion'
    : intencion.toLowerCase().includes('abund') || intencion.toLowerCase().includes('diner') ? 'abundancia'
    : 'espiritualidad'

  return recomendaciones[intencionKey]?.[signo] || 'Cuarzo Transparente'
}

export function getCristalDelDia(): string {
  const hoy = new Date()
  const semilla = hoy.getFullYear() * 10000 + (hoy.getMonth() + 1) * 100 + hoy.getDate()
  const cristales = Object.keys(CRISTALES)
  return cristales[semilla % cristales.length]
}