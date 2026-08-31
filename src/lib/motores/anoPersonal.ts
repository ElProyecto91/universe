export const AÑOS_PERSONALES: Record<number, {
  titulo: string
  descripcion: string
  temas: string[]
  oportunidad: string
  desafio: string
  consejo: string
}> = {
  1: {
    titulo: 'Año Personal 1 — El Comienzo',
    descripcion: 'Estás en el inicio de un nuevo ciclo de 9 años. La energía de este año pide iniciativa, independencia y valentía para empezar algo nuevo.',
    temas: ['Nuevos comienzos', 'Independencia', 'Liderazgo', 'Iniciativa'],
    oportunidad: 'Iniciar proyectos que has postergado. Definir tu dirección para los próximos años. Fortalecer tu identidad.',
    desafio: 'La impaciencia y el egocentrismo. Aprender a liderar sin atropellar.',
    consejo: 'Planta las semillas ahora. Lo que inicies este año marcará la dirección de los próximos 9.',
  },
  2: {
    titulo: 'Año Personal 2 — La Paciencia',
    descripcion: 'Un año de cooperación, paciencia y desarrollo de relaciones. Las semillas del año 1 necesitan tiempo para germinar — no fuerces el crecimiento.',
    temas: ['Cooperación', 'Paciencia', 'Relaciones', 'Sensibilidad'],
    oportunidad: 'Fortalecer relaciones importantes. Desarrollar la intuición. Colaborar en lugar de competir.',
    desafio: 'La impaciencia cuando las cosas van lentas. La dependencia excesiva de la opinión de otros.',
    consejo: 'Escucha más que hablas. Las mejores decisiones de este año vienen de la colaboración.',
  },
  3: {
    titulo: 'Año Personal 3 — La Expresión',
    descripcion: 'Un año de creatividad, comunicación y expansión social. Es momento de expresarte, de compartir tus dones y de disfrutar la vida.',
    temas: ['Creatividad', 'Comunicación', 'Alegría', 'Expansión'],
    oportunidad: 'Expresar tu creatividad. Ampliar tu círculo social. Comunicar lo que antes callabas.',
    desafio: 'La dispersión y la superficialidad. Comprometerse con demasiadas cosas a la vez.',
    consejo: 'Canaliza tu creatividad en un proyecto que te apasione. La alegría de este año es combustible.',
  },
  4: {
    titulo: 'Año Personal 4 — El Trabajo',
    descripcion: 'Un año de trabajo duro, construcción y establecimiento de fundamentos. No es el año más glamuroso pero es el más importante para construir algo duradero.',
    temas: ['Trabajo', 'Disciplina', 'Fundamentos', 'Estructura'],
    oportunidad: 'Construir algo sólido. Establecer rutinas saludables. Poner orden en tu vida.',
    desafio: 'El agotamiento y la rigidez. La resistencia al esfuerzo que se requiere.',
    consejo: 'Trabaja con constancia sin esperar reconocimiento inmediato. Los cimientos que construyes ahora sostendrán todo lo que viene.',
  },
  5: {
    titulo: 'Año Personal 5 — El Cambio',
    descripcion: 'Un año de cambios, libertad y nuevas experiencias. La energía del 5 trae movimiento — prepárate para lo inesperado.',
    temas: ['Cambio', 'Libertad', 'Aventura', 'Adaptabilidad'],
    oportunidad: 'Abrirte a nuevas experiencias. Liberarte de lo que te limita. Viajar, explorar, experimentar.',
    desafio: 'La impulsividad y la inconsistencia. Huir de los compromisos necesarios.',
    consejo: 'Abraza el cambio en lugar de resistirlo. Lo que se mueve este año no puede detenerse — fluye con ello.',
  },
  6: {
    titulo: 'Año Personal 6 — La Responsabilidad',
    descripcion: 'Un año centrado en el hogar, la familia, las relaciones y el servicio. La energía del 6 pide que cuides a quienes amas — y a ti mismo.',
    temas: ['Familia', 'Responsabilidad', 'Servicio', 'Amor'],
    oportunidad: 'Fortalecer vínculos familiares. Crear o mejorar el hogar. Servir desde el amor.',
    desafio: 'El perfeccionismo y el mártir. Dar tanto que te olvidas de ti mismo.',
    consejo: 'Cuida a los demás sin descuidarte. El amor que das necesita también incluirte a ti.',
  },
  7: {
    titulo: 'Año Personal 7 — La Búsqueda',
    descripcion: 'Un año de introspección, espiritualidad y búsqueda de conocimiento. La energía del 7 pide profundidad — no es el año para la acción sino para la comprensión.',
    temas: ['Espiritualidad', 'Introspección', 'Conocimiento', 'Soledad'],
    oportunidad: 'Profundizar en tu práctica espiritual. Estudiar. Meditar. Comprender el significado de tu vida.',
    desafio: 'El aislamiento excesivo y el cinismo. La dificultad para relacionarse con otros.',
    consejo: 'Acepta la soledad como un regalo. Lo que descubres este año sobre ti mismo es invaluable.',
  },
  8: {
    titulo: 'Año Personal 8 — El Poder',
    descripcion: 'Un año de manifestación, éxito material y reconocimiento. La energía del 8 trae oportunidades de poder — económico, profesional y personal.',
    temas: ['Éxito', 'Poder', 'Abundancia', 'Manifestación'],
    oportunidad: 'Lograr metas profesionales y económicas. Recibir reconocimiento. Manifestar lo que llevas tiempo construyendo.',
    desafio: 'El materialismo y el abuso de poder. Perder de vista lo que realmente importa.',
    consejo: 'El poder que manifiestas este año viene con responsabilidad. Úsalo para construir, no para controlar.',
  },
  9: {
    titulo: 'Año Personal 9 — El Cierre',
    descripcion: 'El último año del ciclo. Un año de completar, soltar y prepararse para el nuevo comienzo. La energía del 9 pide compasión y desapego.',
    temas: ['Cierre', 'Soltar', 'Compasión', 'Transformación'],
    oportunidad: 'Completar lo que está pendiente. Perdonar y ser perdonado. Preparar el espacio para el nuevo ciclo.',
    desafio: 'Aferrarse a lo que ya debe terminar. La resistencia al cierre necesario.',
    consejo: 'Suelta con gracia lo que ya cumplió su propósito. El espacio que crees es donde florecerá tu próximo ciclo.',
  },
}

export function calcularAnoPersonal(fechaNacimiento: string): number {
  if (!fechaNacimiento) return 1
  const fecha = new Date(fechaNacimiento)
  const hoy = new Date()
  const mes = fecha.getMonth() + 1
  const dia = fecha.getDate()
  const año = hoy.getFullYear()

  const suma = dia + mes + año.toString().split('').reduce((a, b) => a + parseInt(b), 0)
  const reducir = (n: number): number => {
    if (n < 10) return n
    return reducir(n.toString().split('').reduce((a, b) => a + parseInt(b), 0))
  }

  return reducir(suma)
}