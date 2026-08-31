import { SimboloZodiaco, SimboloElemento, SimboloPlaneta } from '../components/Simbolos'

const signosZodiaco: Record<string, { nombre: string; elemento: string; modalidad: string; descripcion: string }> = {
  'Aries':      { nombre: 'Aries',      elemento: 'Fuego', modalidad: 'Cardinal',  descripcion: 'Pionero, valiente, impulsivo. Energía que abre caminos.' },
  'Tauro':      { nombre: 'Tauro',      elemento: 'Tierra', modalidad: 'Fijo',     descripcion: 'Paciente, sensual, persistente. Energía que construye.' },
  'Géminis':    { nombre: 'Géminis',    elemento: 'Aire',  modalidad: 'Mutable',   descripcion: 'Curioso, versátil, comunicativo. Energía que conecta.' },
  'Cáncer':     { nombre: 'Cáncer',     elemento: 'Agua',  modalidad: 'Cardinal',  descripcion: 'Intuitivo, protector, emocional. Energía que nutre.' },
  'Leo':        { nombre: 'Leo',        elemento: 'Fuego', modalidad: 'Fijo',      descripcion: 'Creativo, generoso, magnético. Energía que ilumina.' },
  'Virgo':      { nombre: 'Virgo',      elemento: 'Tierra', modalidad: 'Mutable',  descripcion: 'Analítico, preciso, servicial. Energía que perfecciona.' },
  'Libra':      { nombre: 'Libra',      elemento: 'Aire',  modalidad: 'Cardinal',  descripcion: 'Armonioso, diplomático, estético. Energía que equilibra.' },
  'Escorpio':   { nombre: 'Escorpio',   elemento: 'Agua',  modalidad: 'Fijo',      descripcion: 'Profundo, intenso, transformador. Energía que regenera.' },
  'Sagitario':  { nombre: 'Sagitario',  elemento: 'Fuego', modalidad: 'Mutable',   descripcion: 'Libre, filosófico, aventurero. Energía que expande.' },
  'Capricornio':{ nombre: 'Capricornio',elemento: 'Tierra', modalidad: 'Cardinal', descripcion: 'Ambicioso, disciplinado, sabio. Energía que persevera.' },
  'Acuario':    { nombre: 'Acuario',    elemento: 'Aire',  modalidad: 'Fijo',      descripcion: 'Visionario, original, humanitario. Energía que innova.' },
  'Piscis':     { nombre: 'Piscis',     elemento: 'Agua',  modalidad: 'Mutable',   descripcion: 'Sensible, compasivo, espiritual. Energía que trasciende.' },
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

const PERFIL_PRUEBA = {
  nombre: 'Luna',
  fechaNacimiento: '1991-08-15',
  ciudad: 'Madrid',
  elemento: 'Fuego',
  animal: 'Águila',
  decision: 'Intuición',
  intencion: 'Espiritualidad',
}

const interpretaciones: Record<string, string> = {
  'Fuego': 'Tu energía es iniciadora y apasionada. Llevas dentro una llama que impulsa la acción y la transformación. Inspiras a quienes te rodean con tu vitalidad natural.',
  'Tierra': 'Tu energía es sólida y constante. Tienes una conexión profunda con lo tangible y lo real. Eres el pilar que sostiene a quienes te rodean.',
  'Aire': 'Tu energía es mental y comunicativa. Tu mente fluye entre ideas con una velocidad única. Percibes conexiones que otros no ven.',
  'Agua': 'Tu energía es profunda e intuitiva. Sientes el mundo antes de comprenderlo. Tu sensibilidad es tu mayor fortaleza y tu guía más fiel.',
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

  const planetas = [
    { clave: 'sol', nombre: 'Sol', valor: signo.nombre },
    { clave: 'luna', nombre: 'Luna', valor: '—' },
    { clave: 'ascendente', nombre: 'Ascendente', valor: '—' },
    { clave: 'venus', nombre: 'Venus', valor: '—' },
    { clave: 'marte', nombre: 'Marte', valor: '—' },
    { clave: 'saturno', nombre: 'Saturno', valor: '—' },
  ]

  return (
    <div className="min-h-screen text-white flex flex-col items-center px-6 relative" style={bgStyle}>
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
          <p className="text-purple-300 text-xs tracking-widest uppercase">Signo Solar</p>
          <SimboloZodiaco signo={signo.nombre} />
          <p className="text-2xl font-semibold tracking-wide">{signo.nombre}</p>
          <div className="flex items-center gap-2 text-purple-300">
            <SimboloElemento elemento={signo.elemento} />
            <span className="text-sm tracking-wider uppercase">{signo.elemento}</span>
            <span className="text-white/30 text-sm">·</span>
            <span className="text-sm tracking-wider text-purple-300/70">{signo.modalidad}</span>
          </div>
          <p className="text-white/60 text-xs text-center leading-relaxed mt-1">{signo.descripcion}</p>
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
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-5">Mapa Planetario</p>
          <div className="grid grid-cols-3 gap-5">
            {planetas.map(p => (
              <div key={p.nombre} className="flex flex-col items-center gap-1">
                <SimboloPlaneta simbolo={p.clave} />
                <span className="text-white text-xs font-medium">{p.valor}</span>
                <span className="text-white/40 text-xs">{p.nombre}</span>
              </div>
            ))}
          </div>
          <p className="text-white/25 text-xs text-center mt-5">
            Añade tu hora de nacimiento para completar tu carta natal
          </p>
        </div>

        {/* Mi perfil espiritual */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-4">Perfil Espiritual</p>
          <div className="flex flex-col gap-3">
            {[
              { etiqueta: 'Animal', valor: localStorage.getItem('animal') || PERFIL_PRUEBA.animal },
              { etiqueta: 'Elemento', valor: localStorage.getItem('elemento')?.split('—')[0].trim() || PERFIL_PRUEBA.elemento },
              { etiqueta: 'Decisiones', valor: localStorage.getItem('decision') || PERFIL_PRUEBA.decision },
              { etiqueta: 'Intención', valor: localStorage.getItem('intencion') || PERFIL_PRUEBA.intencion },
            ].map(item => (
              <div key={item.etiqueta} className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-white/40 text-xs tracking-wide uppercase">{item.etiqueta}</span>
                <span className="text-white/80 text-sm">{item.valor}</span>
              </div>
            ))}
          </div>
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
          <button
            onClick={() => window.location.href = '/experto'}
            className="w-full bg-white/5 border border-purple-500/30 text-purple-300 font-semibold py-4 rounded-full text-base hover:bg-purple-500/10 transition backdrop-blur"
          >
            Hablar con un Experto
          </button>
        </div>

      </div>
    </div>
  )
}