export type AreaBagua = {
  id: string
  nombre: string
  nombreChino: string
  emoji: string
  elemento: string
  colores: string[]
  colorHex: string
  trigrama: string
  descripcion: string
  activadores: string[]
  posicion: string
}

export const AREAS_BAGUA: AreaBagua[] = [
  {
    id: 'prosperidad',
    nombre: 'Prosperidad',
    nombreChino: '巽 Xun',
    emoji: '💰',
    elemento: 'Madera',
    colores: ['Púrpura', 'Verde', 'Dorado'],
    colorHex: '#7c3aed',
    trigrama: 'Viento',
    posicion: 'Esquina superior izquierda',
    descripcion: 'El área de la abundancia material y espiritual. Gobierna el flujo del dinero, la gratitud y la capacidad de recibir. Cuando esta área está bloqueada, el esfuerzo no se traduce en recompensa.',
    activadores: ['Plantas sanas y exuberantes', 'Objetos de color púrpura o dorado', 'Fuente de agua en movimiento', 'Símbolo de abundancia que te resuene', 'Mantén limpio y libre de desorden'],
  },
  {
    id: 'fama',
    nombre: 'Fama y Reputación',
    nombreChino: '離 Lí',
    emoji: '🔥',
    elemento: 'Fuego',
    colores: ['Rojo', 'Naranja', 'Fucsia'],
    colorHex: '#dc2626',
    trigrama: 'Fuego',
    posicion: 'Centro superior',
    descripcion: 'El área de cómo te ven en el mundo, tu reputación y tu autenticidad. Gobierna el reconocimiento, el propósito y la claridad de tu visión. Actívala cuando quieras ser visto o cuando sientas que tu voz no llega.',
    activadores: ['Velas o luz real', 'Objetos rojos o de color fuego', 'Diplomas, logros o reconocimientos', 'Imágenes que representen tu meta', 'Formas triangulares o puntiagudas'],
  },
  {
    id: 'amor',
    nombre: 'Amor y Relaciones',
    nombreChino: '坤 Kūn',
    emoji: '💞',
    elemento: 'Tierra',
    colores: ['Rosa', 'Rojo', 'Blanco'],
    colorHex: '#db2777',
    trigrama: 'Tierra receptiva',
    posicion: 'Esquina superior derecha',
    descripcion: 'El área de las relaciones de pareja, la autoestima y el amor en todas sus formas. Cuando esta área está bloqueada, aparecen dificultades para conectar, soledad o relaciones desequilibradas.',
    activadores: ['Objetos en pares (velas, figuras)', 'Colores rosas y rojos', 'Cristales de cuarzo rosa', 'Imágenes de amor y conexión', 'Elimina objetos solitarios o rotos'],
  },
  {
    id: 'familia',
    nombre: 'Familia y Salud',
    nombreChino: '震 Zhèn',
    emoji: '🌿',
    elemento: 'Madera',
    colores: ['Verde', 'Azul', 'Turquesa'],
    colorHex: '#16a34a',
    trigrama: 'Trueno',
    posicion: 'Centro izquierda',
    descripcion: 'El área de los vínculos familiares, los ancestros y la salud general. Gobierna las raíces, la estabilidad emocional y la capacidad de sanar. Actívala para mejorar relaciones familiares o la salud física.',
    activadores: ['Plantas verdes y saludables', 'Fotos de familia en momentos felices', 'Objetos de madera natural', 'Colores verdes y azules', 'Flores frescas'],
  },
  {
    id: 'centro',
    nombre: 'Salud y Bienestar',
    nombreChino: '中 Zhōng',
    emoji: '☯️',
    elemento: 'Tierra',
    colores: ['Amarillo', 'Beige', 'Naranja suave'],
    colorHex: '#ca8a04',
    trigrama: 'Centro',
    posicion: 'Centro del espacio',
    descripcion: 'El corazón del Bagua. Afecta a todas las demás áreas — cuando el centro está equilibrado, todo fluye mejor. Gobierna la salud, el equilibrio y la conexión con uno mismo.',
    activadores: ['Mantén el centro despejado y limpio', 'Objetos amarillos o de barro', 'Cristales de citrino o cuarzo', 'Símbolo del Yin-Yang', 'Evita muebles pesados en el centro'],
  },
  {
    id: 'creatividad',
    nombre: 'Creatividad e Hijos',
    nombreChino: '兌 Duì',
    emoji: '✨',
    elemento: 'Metal',
    colores: ['Blanco', 'Gris', 'Plata'],
    colorHex: '#94a3b8',
    trigrama: 'Lago',
    posicion: 'Centro derecha',
    descripcion: 'El área de la creatividad, la expresión y los proyectos que das a luz. También rige la relación con los hijos o con lo que creas. Actívala cuando quieras iniciar algo nuevo o desbloquear tu expresión creativa.',
    activadores: ['Objetos metálicos o plateados', 'Arte propio o que te inspire', 'Colores blancos y grises', 'Instrumentos o materiales creativos', 'Formas redondas u ovaladas'],
  },
  {
    id: 'sabiduria',
    nombre: 'Sabiduría y Conocimiento',
    nombreChino: '艮 Gèn',
    emoji: '📚',
    elemento: 'Tierra',
    colores: ['Azul oscuro', 'Verde', 'Negro'],
    colorHex: '#1e40af',
    trigrama: 'Montaña',
    posicion: 'Esquina inferior izquierda',
    descripcion: 'El área del aprendizaje, la sabiduría interior y el autoconocimiento. Gobierna la meditación, el estudio y la capacidad de tomar decisiones desde la claridad. Actívala cuando necesites aprender o encontrar tu camino.',
    activadores: ['Libros y materiales de estudio', 'Espacio tranquilo para meditar', 'Colores azul oscuro y verde', 'Imágenes de montañas o naturaleza quieta', 'Objetos que representen sabiduría'],
  },
  {
    id: 'carrera',
    nombre: 'Carrera y Propósito',
    nombreChino: '坎 Kǎn',
    emoji: '🌊',
    elemento: 'Agua',
    colores: ['Negro', 'Azul oscuro', 'Marino'],
    colorHex: '#0f172a',
    trigrama: 'Agua',
    posicion: 'Centro inferior',
    descripcion: 'El área del camino de vida, la carrera y el propósito. Gobierna el flujo de tu vida profesional y la claridad sobre hacia dónde vas. Actívala cuando sientas estancamiento laboral o falta de dirección.',
    activadores: ['Fuente de agua o imagen de agua en movimiento', 'Colores negros y azul marino', 'Espejos que reflejen luz', 'Objetos que representen tu profesión', 'Camino despejado hacia la puerta'],
  },
  {
    id: 'viajes',
    nombre: 'Viajes y Mentores',
    nombreChino: '乾 Qián',
    emoji: '🌍',
    elemento: 'Metal',
    colores: ['Gris', 'Blanco', 'Plata'],
    colorHex: '#6b7280',
    trigrama: 'Cielo',
    posicion: 'Esquina inferior derecha',
    descripcion: 'El área de las personas que te ayudan, los viajes y las oportunidades que llegan a través de otros. Governa la sincronía, el apoyo externo y la capacidad de recibir ayuda cuando la necesitas.',
    activadores: ['Fotografías de lugares que quieres visitar', 'Objetos metálicos o plateados', 'Imágenes de mentores o figuras inspiradoras', 'Colores grises y blancos', 'Globos terráqueos o mapas'],
  },
]

export function getAreaBagua(id: string): AreaBagua {
  return AREAS_BAGUA.find(a => a.id === id) ?? AREAS_BAGUA[0]
}