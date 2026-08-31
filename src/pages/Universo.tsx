const signosZodiaco: Record<string, { simbolo: string; nombre: string; elemento: string; simboloElemento: string }> = {
  'Aries': { simbolo: '♈', nombre: 'Aries', elemento: 'Fuego', simboloElemento: '🜂' },
  'Tauro': { simbolo: '♉', nombre: 'Tauro', elemento: 'Tierra', simboloElemento: '🜃' },
  'Géminis': { simbolo: '♊', nombre: 'Géminis', elemento: 'Aire', simboloElemento: '🜁' },
  'Cáncer': { simbolo: '♋', nombre: 'Cáncer', elemento: 'Agua', simboloElemento: '🜄' },
  'Leo': { simbolo: '♌', nombre: 'Leo', elemento: 'Fuego', simboloElemento: '🜂' },
  'Virgo': { simbolo: '♍', nombre: 'Virgo', elemento: 'Tierra', simboloElemento: '🜃' },
  'Libra': { simbolo: '♎', nombre: 'Libra', elemento: 'Aire', simboloElemento: '🜁' },
  'Escorpio': { simbolo: '♏', nombre: 'Escorpio', elemento: 'Agua', simboloElemento: '🜄' },
  'Sagitario': { simbolo: '♐', nombre: 'Sagitario', elemento: 'Fuego', simboloElemento: '🜂' },
  'Capricornio': { simbolo: '♑', nombre: 'Capricornio', elemento: 'Tierra', simboloElemento: '🜃' },
  'Acuario': { simbolo: '♒', nombre: 'Acuario', elemento: 'Aire', simboloElemento: '🜁' },
  'Piscis': { simbolo: '♓', nombre: 'Piscis', elemento: 'Agua', simboloElemento: '🜄' },
}

function getSignoSolar(fechaNacimiento: string): string {
  if (!fechaNacimiento) return 'Leo'
  const fecha = new Date(fechaNacimiento)
  const mes = fecha.getMonth() + 1
  const dia = fecha.getDate()
  if ((mes === 3 && dia >= 21) || (mes === 4 && dia <= 19)) return 'Aries'
  if ((mes === 4 && dia >= 20) || (mes === 5 && dia <= 20)) return 'Tauro'
  if ((mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)) return 'Géminis'
  if ((mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)) return 'Cáncer'
  if ((mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)) return 'Leo'
  if ((mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)) return 'Virgo'
  if ((mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)) return 'Libra'
  if ((mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)) return 'Escorpio'
  if ((mes === 11 && dia >= 22) || (mes === 12 && dia <= 21)) return 'Sagitario'
  if ((mes === 12 && dia >= 22) || (mes === 1 && dia <= 19)) return 'Capricornio'
  if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) return 'Acuario'
  return 'Piscis'
}

// PERFIL DE PRUEBA — se usa si no hay datos reales
const PERFIL_PRUEBA = {
  nombre: 'Luna',
  fechaNacimiento: '1991-08-15',
  ciudad: 'Madrid',
  elemento: '🜂 Fuego — Pasión y acción',
  animal: 'Águila — Visión',
  decision: 'Sigo mi intuición',
  intencion: 'Espiritualidad',
}

export default function Universo() {
  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const nombre = localStorage.getItem('nombre') || PERFIL_PRUEBA.nombre
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || PERFIL_PRUEBA.fechaNacimiento

  const signoNombre = getSignoSolar(fechaNacimiento)
  const signo = signosZodiaco[signoNombre]

  const interpretaciones: Record<string, string> = {
    'Fuego': 'Tu energía es iniciadora y apasionada. Llevas dentro una llama que impulsa la acción y la transformación. Inspiras a quienes te rodean.',
    'Tierra': 'Tu energía es sólida y constante. Tienes una conexión profunda con lo tangible y lo real. Eres el pilar que sostiene a los demás.',
    'Aire': 'Tu energía es mental y comunicativa. Tu mente fluye entre ideas con una velocidad única. Ves conexiones que otros no perciben.',
    'Agua': 'Tu energía es profunda e intuitiva. Sientes el mundo antes de comprenderlo. Tu sensibilidad es tu mayor fortaleza.',
  }

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center px-6 relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-6 py-10">

        {/* Encabezado */}
        <div className="text-center">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-1">Tu Universo</p>
          <h1 className="text-3xl font-bold" style={{ textShadow: '0 2px 12px rgba(192,132,252,0.8)' }}>
            {nombre}
          </h1>
        </div>

        {/* Signo solar */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center gap-3 backdrop-blur">
          <p className="text-purple-300 text-xs tracking-widest uppercase">☉ Signo Solar</p>
          <div
            className="text-8xl font-thin text-white"
            style={{ textShadow: '0 0 40px rgba(192,132,252,0.9)', fontFamily: 'serif' }}
          >
            {signo.simbolo}
          </div>
          <p className="text-2xl font-semibold tracking-wide">{signo.nombre}</p>
          <div className="flex items-center gap-2 text-purple-300">
            <span className="text-lg">{signo.simboloElemento}</span>
            <span className="text-sm tracking-wider uppercase">{signo.elemento}</span>
          </div>
        </div>

        {/* Tu energía */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu Energía</p>
          <p className="text-white/90 leading-relaxed text-sm">
            {interpretaciones[signo.elemento]}
          </p>
        </div>

        {/* Mapa planetario */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-4">Mapa Planetario</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { simbolo: '☉', nombre: 'Sol', valor: signo.nombre },
              { simbolo: '☽', nombre: 'Luna', valor: '—' },
              { simbolo: '↑', nombre: 'Ascendente', valor: '—' },
              { simbolo: '♀', nombre: 'Venus', valor: '—' },
              { simbolo: '♂', nombre: 'Marte', valor: '—' },
              { simbolo: '♄', nombre: 'Saturno', valor: '—' },
            ].map(p => (
              <div key={p.nombre} className="flex flex-col items-center gap-1">
                <span className="text-2xl text-purple-300" style={{ fontFamily: 'serif' }}>{p.simbolo}</span>
                <span className="text-white text-xs font-medium">{p.valor}</span>
                <span className="text-white/40 text-xs">{p.nombre}</span>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-xs text-center mt-4">
            Añade tu hora de nacimiento para completar tu carta natal
          </p>
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => window.location.href = '/guia'}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full text-base hover:opacity-90 transition"
          >
            Hablar con mi Guía IA
          </button>
          <button
            onClick={() => window.location.href = '/tarot'}
            className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full text-base hover:bg-white/20 transition backdrop-blur"
          >
            Tirada de Tarot
          </button>
        </div>

      </div>
    </div>
  )
}