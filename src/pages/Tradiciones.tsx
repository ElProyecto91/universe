const CATEGORIAS = [
  {
    nombre: '🔮 Oráculos',
    tradiciones: [
      { id: 'tarot-diario', nombre: 'Carta del Día', subtitulo: 'Tarot · Cada día', descripcion: 'Una carta del Tarot cambia cada amanecer.', ruta: '/tarot-diario', etiqueta: 'DIARIO' },
      { id: 'tarot', nombre: 'Tarot', subtitulo: 'Lectura completa', descripcion: 'Tiradas de 1, 3 o 5 cartas para explorar cualquier situación.', ruta: '/tarot' },
      { id: 'runas', nombre: 'Runas', subtitulo: 'Tradición germánica', descripcion: 'Sistema de escritura histórico germánico. Reconstrucción moderna en adivinación.', ruta: '/runas' },
      { id: 'iching', nombre: 'I Ching', subtitulo: 'El Libro de los Cambios · China', descripcion: '64 hexagramas revelan la energía del momento.', ruta: '/iching' },
      { id: 'omikuji', nombre: 'Omikuji', subtitulo: 'Fortuna del día · Japón', descripcion: 'Como en los santuarios japoneses, extrae tu fortuna diaria.', ruta: '/omikuji', etiqueta: 'DIARIO' },
      { id: 'numerologia', nombre: 'Numerología', subtitulo: 'Tradición pitagórica', descripcion: 'Tu nombre y fecha de nacimiento revelan tu misión.', ruta: '/numerologia' },
      { id: 'bazi', nombre: 'BaZi', subtitulo: 'Cuatro Pilares · China', descripcion: 'Tu energía esencial y ciclos de vida.', ruta: '/bazi' },
    ]
  },
  {
    nombre: '🌙 Místico',
    tradiciones: [
      { id: 'luna', nombre: 'Oracle Lunar', subtitulo: 'Fase lunar real · Hoy', descripcion: 'La fase lunar de hoy y su energía para tu vida.', ruta: '/luna', etiqueta: 'DIARIO' },
      { id: 'suenos', nombre: 'Oracle de Sueños', subtitulo: 'Psicología · Simbolismo', descripcion: 'Interpreta tus sueños con psicología jungiana y simbolismo universal.', ruta: '/suenos' },
    ]
  },
  {
    nombre: '🌌 Cósmico',
    tradiciones: [
      { id: 'vedico', nombre: 'Astrología Védica', subtitulo: 'Jyotisha · India', descripcion: 'El sistema astrológico más antiguo del mundo.', ruta: '/vedico', etiqueta: 'PRÓXIMAMENTE' },
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
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-8">

        <div className="flex items-center">
          <button onClick={() => window.location.href = '/universo'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Explorar Tradiciones</p>
          </div>
        </div>

        <p className="text-white/50 text-sm text-center">Sistemas de sabiduría de diferentes culturas. Cada uno ofrece una perspectiva única.</p>

        {CATEGORIAS.map(cat => (
          <div key={cat.nombre} className="flex flex-col gap-3">
            <p className="text-white/60 text-xs tracking-widest uppercase">{cat.nombre}</p>
            {cat.tradiciones.map(t => (
              <button
                key={t.id}
                onClick={() => { if (t.etiqueta !== 'PRÓXIMAMENTE') window.location.href = t.ruta }}
                className={`w-full bg-white/5 border rounded-3xl p-5 text-left backdrop-blur transition border-white/10 ${t.etiqueta !== 'PRÓXIMAMENTE' ? 'hover:bg-white/10' : 'opacity-50 cursor-not-allowed'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-semibold">{t.nombre}</p>
                      {t.etiqueta && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${t.etiqueta === 'DIARIO' ? 'bg-purple-500/30 text-purple-300' : t.etiqueta === 'PRÓXIMAMENTE' ? 'bg-white/10 text-white/40' : ''}`}>
                          {t.etiqueta}
                        </span>
                      )}
                    </div>
                    <p className="text-purple-300/70 text-xs mb-1">{t.subtitulo}</p>
                    <p className="text-white/50 text-xs leading-relaxed">{t.descripcion}</p>
                  </div>
                  {t.etiqueta !== 'PRÓXIMAMENTE' && <span className="text-purple-300/50 text-lg">›</span>}
                </div>
              </button>
            ))}
          </div>
        ))}

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur text-center">
          <p className="text-white/30 text-xs">Cada tradición se presenta con su contexto cultural original. Exploramos, no apropiamos.</p>
        </div>

      </div>
    </div>
  )
}