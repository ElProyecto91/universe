const CATEGORIAS = [
  {
    nombre: '⭐ Destacado',
    tradiciones: [
      { id: 'oracle-mix', nombre: 'Oracle Mix', subtitulo: 'La killer feature · Múltiples tradiciones', descripcion: 'Combina hasta 4 sistemas de sabiduría para explorar tu pregunta desde múltiples perspectivas a la vez.', ruta: '/oracle-mix', destacado: true },
      { id: 'astro-daily', nombre: 'Astro Daily', subtitulo: 'Tu signo solar · Cada día', descripcion: 'Mensaje astrológico diario personalizado basado en tu signo solar.', ruta: '/astro-daily', etiqueta: 'DIARIO' },
      { id: 'mirror', nombre: 'Mirror Oracle', subtitulo: 'Autoconocimiento · Reflexión profunda', descripcion: 'Preguntas que actúan como espejos para revelar tu sabiduría interior.', ruta: '/mirror', etiqueta: 'DIARIO' },
      { id: 'horoscopo', nombre: 'Horóscopo', subtitulo: 'Todos los signos · Cada día', descripcion: 'Horóscopo diario con amor, trabajo, salud y afirmación. Los 12 signos.', ruta: '/horoscopo', etiqueta: 'DIARIO' },
    ]
  },
  {
    nombre: '🔮 Oráculos',
    tradiciones: [
      { id: 'tarot-diario', nombre: 'Carta del Día', subtitulo: 'Tarot · Cada día', descripcion: 'Una carta del Tarot cambia cada amanecer.', ruta: '/tarot-diario', etiqueta: 'DIARIO' },
      { id: 'tarot', nombre: 'Tarot', subtitulo: 'Arcanos Mayores · Lectura completa', descripcion: 'Tiradas de 1, 3 o 5 cartas con imágenes Rider-Waite reales.', ruta: '/tarot' },
      { id: 'tarot78', nombre: 'Tarot 78 Arcanos', subtitulo: 'Mazo completo · Cruz Celta · Anual', descripcion: 'Tiradas completas con los 78 arcanos — mayores y menores.', ruta: '/tarot78' },
      { id: 'runas', nombre: 'Runas', subtitulo: 'Tradición germánica', descripcion: 'Sistema de escritura histórico germánico. Reconstrucción moderna en adivinación.', ruta: '/runas' },
      { id: 'ogham', nombre: 'Ogham', subtitulo: 'Alfabeto irlandés · Interpretación moderna', descripcion: 'Cada letra del Ogham corresponde a un árbol y sus cualidades simbólicas.', ruta: '/ogham' },
      { id: 'iching', nombre: 'I Ching', subtitulo: 'El Libro de los Cambios · China', descripcion: '64 hexagramas revelan la energía del momento.', ruta: '/iching' },
      { id: 'tibetan-mo', nombre: 'Mo Tibetano', subtitulo: 'Adivinación budista · Tibet', descripcion: 'Sistema de adivinación del budismo tibetano mediante dados. 36 posibles resultados.', ruta: '/tibetan-mo' },
      { id: 'geomancia', nombre: 'Geomancia', subtitulo: 'ʿIlm al-raml · Tradición árabe-medieval', descripcion: '16 figuras geománticas revelan la energía de tu pregunta.', ruta: '/geomancia' },
      { id: 'dados', nombre: 'Oracle de Dados', subtitulo: 'Cleromancia · Tradición antigua', descripcion: 'Lanza tres dados y explora el mensaje de los números.', ruta: '/dados' },
      { id: 'monedas', nombre: 'Oracle de Monedas', subtitulo: 'Cleromancia · Decisión', descripcion: 'Tres monedas, seis patrones posibles. El azar como espejo de la energía presente.', ruta: '/monedas' },
      { id: 'bibliomancia', nombre: 'Bibliomancia', subtitulo: 'Textos en dominio público', descripcion: 'Abre un texto sagrado o filosófico al azar y encuentra orientación.', ruta: '/bibliomancia' },
      { id: 'litomancia', nombre: 'Litomancia', subtitulo: 'Oracle de piedras', descripcion: 'Tres cristales son seleccionados para ti y la IA interpreta su mensaje.', ruta: '/litomancia' },
      { id: 'omikuji', nombre: 'Omikuji', subtitulo: 'Fortuna del día · Japón', descripcion: 'Como en los santuarios japoneses, extrae tu fortuna diaria.', ruta: '/omikuji', etiqueta: 'DIARIO' },
    ]
  },
  {
    nombre: '🌌 Astrología y Numerología',
    tradiciones: [
      { id: 'carta-natal', nombre: 'Carta Natal', subtitulo: 'Astrología occidental · Tu mapa estelar', descripcion: 'Sol, Luna, Mercurio, Venus, Marte y más. Tu carta natal interpretada con IA.', ruta: '/carta-natal' },
      { id: 'transitos', nombre: 'Tránsitos Planetarios', subtitulo: 'Luna · Retrógrados · Energía del día', descripcion: 'Qué planetas te afectan hoy y cómo trabajar con esa energía.', ruta: '/transitos', etiqueta: 'DIARIO' },
      { id: 'numerologia', nombre: 'Numerología', subtitulo: 'Tradición pitagórica · Número de vida', descripcion: 'Tu número de vida, propósito, fortalezas, desafíos y carrera.', ruta: '/numerologia' },
      { id: 'numerologia-nombre', nombre: 'Numerología del Nombre', subtitulo: 'Expresión · Alma · Personalidad', descripcion: 'Tres números ocultos en tu nombre revelan cómo te expresas y qué anhelas.', ruta: '/numerologia-nombre' },
      { id: 'numerologia-universal', nombre: 'Numerología del Día', subtitulo: 'Año · Mes · Día Universal', descripcion: 'La energía numerológica universal de hoy y cómo interactúa con tu año personal.', ruta: '/numerologia-universal', etiqueta: 'DIARIO' },
      { id: 'ano-personal', nombre: 'Año Personal', subtitulo: 'Numerología · Tu ciclo actual', descripcion: '¿En qué año personal estás? Cada año del ciclo de 9 tiene una energía única.', ruta: '/ano-personal' },
      { id: 'compatibilidad', nombre: 'Compatibilidad', subtitulo: 'Numerología · Dos personas', descripcion: 'Explora la energía numerológica entre dos personas.', ruta: '/compatibilidad' },
      { id: 'bazi', nombre: 'BaZi', subtitulo: 'Cuatro Pilares · China', descripcion: 'Tu energía esencial y ciclos de vida según la astrología china.', ruta: '/bazi' },
      { id: 'zi-wei', nombre: 'Zi Wei Dou Shu', subtitulo: 'Estrella Púrpura · China', descripcion: '12 palacios de vida. Explora el área que más te preocupa ahora.', ruta: '/zi-wei' },
      { id: 'tzolkin', nombre: 'Tzolkʼin', subtitulo: 'Calendario maya · Tradición viva', descripcion: 'Tu signo en el calendario sagrado maya de 260 días.', ruta: '/tzolkin' },
      { id: 'horoscopo-celtico', nombre: 'Horóscopo Celta', subtitulo: 'Los 13 árboles · Inspiración celta', descripcion: 'Cada fecha de nacimiento corresponde a un árbol sagrado celta.', ruta: '/horoscopo-celtico' },
      { id: 'biorritmos', nombre: 'Biorritmos', subtitulo: 'Ciclos físico · emocional · mental · intuitivo', descripcion: 'Tus cuatro ciclos vitales de hoy y cómo trabajar con ellos.', ruta: '/biorritmos', etiqueta: 'DIARIO' },
    ]
  },
  {
    nombre: '🌙 Místico',
    tradiciones: [
      { id: 'luna', nombre: 'Oracle Lunar', subtitulo: 'Fase lunar real · Hoy', descripcion: 'La fase lunar de hoy y su energía para tu vida.', ruta: '/luna', etiqueta: 'DIARIO' },
      { id: 'rueda', nombre: 'Rueda del Año', subtitulo: 'Ciclo estacional · Tradición pagana', descripcion: 'Los 8 Sabbats y la sabiduría de cada estación del año.', ruta: '/rueda' },
      { id: 'elementos', nombre: 'Oracle Elemental', subtitulo: 'Los cinco elementos', descripcion: 'Fuego, Agua, Tierra, Aire y Éter — explora desde la energía elemental.', ruta: '/elementos' },
      { id: 'chakras', nombre: 'Chakra Oracle', subtitulo: 'Sistema de chakras · Tradición hindú', descripcion: 'Explora los 7 chakras y cuál necesita atención en tu vida ahora mismo.', ruta: '/chakras' },
      { id: 'cristales', nombre: 'Cristaloterapia', subtitulo: '10 cristales · Tradiciones del mundo', descripcion: 'Propiedades, usos y lectura personalizada de cristales y piedras.', ruta: '/cristales' },
      { id: 'plantas', nombre: 'Plant Oracle', subtitulo: 'Simbolismo vegetal · Tradiciones del mundo', descripcion: 'Cada planta lleva un mensaje. Explora el simbolismo de la naturaleza.', ruta: '/plantas' },
      { id: 'color', nombre: 'Color Oracle', subtitulo: 'Cromoterapia simbólica · Tradiciones', descripcion: '¿Qué color te atrae hoy? Explora su significado en diferentes culturas.', ruta: '/color' },
      { id: 'suenos', nombre: 'Oracle de Sueños', subtitulo: 'Psicología · Simbolismo', descripcion: 'Interpreta tus sueños con psicología jungiana y simbolismo universal.', ruta: '/suenos' },
      { id: 'animales', nombre: 'Simbolismo Animal', subtitulo: 'Arquetipos · Tradiciones del mundo', descripcion: 'Explora el simbolismo de tu animal guía en diferentes culturas.', ruta: '/animales' },
      { id: 'presagios', nombre: 'Presagios y Señales', subtitulo: 'Sincronicidad · Simbolismo', descripcion: '¿Hay una señal que se repite en tu vida? Exploramos su significado.', ruta: '/presagios' },
      { id: 'sincronicidad', nombre: 'Sincronicidad', subtitulo: 'Números ángel · Patrones', descripcion: '¿Ves 11:11, 333, 444? Explora el significado de los números que se repiten.', ruta: '/sincronicidad' },
      { id: 'scrying', nombre: 'Scrying', subtitulo: 'Contemplación · Visión interior', descripcion: 'Contempla la esfera de cristal y deja emerger las visiones simbólicas.', ruta: '/scrying' },
    ]
  },
  {
    nombre: '🧘 Práctica Espiritual',
    tradiciones: [
      { id: 'meditacion', nombre: 'Meditación', subtitulo: '5 meditaciones guiadas · Timer integrado', descripcion: 'Respiración, body scan, luna llena, chakras y gratitud con timer paso a paso.', ruta: '/meditacion' },
      { id: 'rituales', nombre: 'Rituales', subtitulo: 'Paso a paso · Luna · Protección · Manifestación', descripcion: 'Guías completas para rituales de luna nueva, luna llena, protección y más.', ruta: '/rituales' },
      { id: 'afirmaciones', nombre: 'Afirmaciones', subtitulo: 'Por signo · Por tema · Modo práctica', descripcion: 'Afirmaciones diarias personalizadas con contador de repeticiones.', ruta: '/afirmaciones' },
      { id: 'manifestacion', nombre: 'Diario de Manifestación', subtitulo: 'Gratitud · Intención · Reflexión', descripcion: 'Journaling guiado con IA conectado a la fase lunar y tu año personal.', ruta: '/manifestacion' },
      { id: 'vision-board', nombre: 'Vision Board', subtitulo: '6 áreas de vida · IA activadora', descripcion: 'Define tus intenciones en 6 áreas y actívalas con IA y energía lunar.', ruta: '/vision-board' },
      { id: 'diario', nombre: 'Diario Espiritual', subtitulo: 'Sueños · Gratitud · Sincronicidades', descripcion: 'Tu diario personal con contexto lunar y carta del día integrados.', ruta: '/diario' },
      { id: 'mirror', nombre: 'Mirror Oracle', subtitulo: 'Autoconocimiento · Reflexión profunda', descripcion: 'Preguntas espejo que revelan tu sabiduría interior.', ruta: '/mirror' },
      { id: 'rueda-vida', nombre: 'Rueda de la Vida', subtitulo: '8 áreas · Evaluación · Coaching IA', descripcion: 'Evalúa 8 áreas de tu vida y recibe análisis y acciones concretas.', ruta: '/rueda-vida' },
      { id: 'palmisteria', nombre: 'Palmistería', subtitulo: 'Lectura de mano · Tradiciones del mundo', descripcion: 'Explora las líneas y montes de tu mano con interpretación IA.', ruta: '/palmisteria' },
    ]
  },
  {
    nombre: '🧙 Caminos Paganos',
    tradiciones: [
      { id: 'pagan', nombre: 'Caminos Paganos', subtitulo: 'Norse · Helénico · Egipcio · Celta · Eslavo · Wicca', descripcion: 'Explora preguntas desde seis grandes tradiciones espirituales del mundo.', ruta: '/pagan' },
    ]
  },
  {
    nombre: '🔬 Autoconocimiento',
    tradiciones: [
      { id: 'arquetipo', nombre: 'Test de Arquetipo', subtitulo: 'Psicología jungiana · 9 arquetipos', descripcion: '5 preguntas revelan tu arquetipo dominante y tu sombra personal.', ruta: '/arquetipo' },
      { id: 'biorritmos', nombre: 'Biorritmos', subtitulo: 'Ciclos vitales · Físico · Emocional · Mental', descripcion: 'Tus cuatro ciclos vitales de hoy y cómo trabajar con ellos.', ruta: '/biorritmos' },
      { id: 'rueda-vida', nombre: 'Rueda de la Vida', subtitulo: '8 áreas de vida · Evaluación', descripcion: 'Evaluación completa de tu vida con análisis IA y plan de acción.', ruta: '/rueda-vida' },
    ]
  },
]

export default function Tradiciones() {
  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-8">

        <div className="flex items-center">
          <button onClick={() => window.location.href = '/universo'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-bold text-base">Explorar Tradiciones</p>
            <p className="text-white/50 text-xs">55+ herramientas espirituales</p>
          </div>
        </div>

        {CATEGORIAS.map(cat => (
          <div key={cat.nombre} className="flex flex-col gap-3">
            <p className="text-purple-300 text-xs tracking-widest uppercase font-semibold">{cat.nombre}</p>
            {cat.tradiciones.map((t: any) => (
              <button
                key={t.id}
                onClick={() => window.location.href = t.ruta}
                className={`w-full border rounded-2xl p-4 text-left transition ${
                  t.destacado
                    ? 'bg-purple-600/30 border-purple-400/50 hover:bg-purple-600/40'
                    : 'border-white/20 hover:bg-white/12'
                }`}
                style={{ backgroundColor: t.destacado ? undefined : 'rgba(255,255,255,0.08)' }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-white font-semibold text-sm">{t.nombre}</p>
                      {t.etiqueta && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/40 text-purple-200 font-medium">
                          {t.etiqueta}
                        </span>
                      )}
                    </div>
                    <p className="text-purple-300 text-xs mb-1">{t.subtitulo}</p>
                    <p className="text-white/60 text-xs leading-relaxed">{t.descripcion}</p>
                  </div>
                  <span className="text-purple-300 text-xl flex-shrink-0">›</span>
                </div>
              </button>
            ))}
          </div>
        ))}

        <div className="bg-white/8 border border-white/15 rounded-2xl p-4 text-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-white/40 text-xs">Exploramos, no apropiamos. Cada tradición se presenta con su contexto cultural original.</p>
        </div>

        <button
          onClick={() => window.location.href = '/disclaimer'}
          className="text-white/25 text-xs text-center underline"
        >
          Aviso Legal
        </button>

      </div>
    </div>
  )
}