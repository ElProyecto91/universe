import { getCartaDiaria } from '../lib/motores/tarotDiario'
import { getFaseLunar } from '../lib/motores/luna'
import { getSignoSolar } from '../lib/motores/horoscopo'
import { getAfirmacionDelDia } from '../lib/motores/afirmaciones'
import { getRetrogradosActivos } from '../lib/motores/transitos'
import { getImagenCarta } from '../components/svg/TarotSVG'

export default function Universo() {
  const nombre = localStorage.getItem('nombre') || 'Viajero'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const signo = localStorage.getItem('signo') || getSignoSolar(fechaNacimiento)
  const carta = getCartaDiaria()
  const faseLunar = getFaseLunar()
  const afirmacion = getAfirmacionDelDia(signo)
  const retrogradosActivos = getRetrogradosActivos()

  const SIMBOLOS_SIGNOS: Record<string, string> = {
    Aries: '♈', Tauro: '♉', Géminis: '♊', Cáncer: '♋',
    Leo: '♌', Virgo: '♍', Libra: '♎', Escorpio: '♏',
    Sagitario: '♐', Capricornio: '♑', Acuario: '♒', Piscis: '♓',
  }

  const hoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const ACCESOS_RAPIDOS = [
    { icono: '🃏', label: 'Carta del Día', ruta: '/tarot-diario' },
    { icono: '📊', label: 'Horóscopo', ruta: '/horoscopo' },
    { icono: '🌙', label: 'Luna', ruta: '/luna' },
    { icono: '🔮', label: 'Oracle Mix', ruta: '/oracle-mix' },
    { icono: '✨', label: 'Afirmaciones', ruta: '/afirmaciones' },
    { icono: '📖', label: 'Diario', ruta: '/diario' },
    { icono: '🪐', label: 'Tránsitos', ruta: '/transitos' },
    { icono: '💎', label: 'Cristales', ruta: '/cristales' },
  ]

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-4 py-8 gap-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/50 text-xs capitalize">{hoy}</p>
            <p className="text-white text-xl font-bold">Hola, {nombre} ✨</p>
          </div>
          <button
            onClick={() => window.location.href = '/guia'}
            className="bg-purple-600/40 border border-purple-400/50 rounded-full px-4 py-2 text-purple-300 text-xs font-semibold"
          >
            Guía IA
          </button>
        </div>

        {/* Alerta retrógrado */}
        {retrogradosActivos.length > 0 && (
          <div className="bg-amber-500/15 border border-amber-500/30 rounded-2xl p-3 backdrop-blur">
            <p className="text-amber-300 text-xs font-semibold">
              ⚠️ {retrogradosActivos.map(r => `${r.planeta} Retrógrado`).join(' · ')}
            </p>
            <p className="text-white/50 text-xs mt-0.5">{retrogradosActivos[0]?.consejo}</p>
          </div>
        )}

        {/* Carta del día */}
        <button
          onClick={() => window.location.href = '/tarot-diario'}
          className="bg-white/8 border border-white/20 rounded-3xl p-5 backdrop-blur text-left hover:bg-white/12 transition"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
        >
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Carta del día</p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-20 rounded-lg overflow-hidden flex-shrink-0"
              style={{ boxShadow: '0 0 15px rgba(192,132,252,0.3)' }}>
              <img
                src={getImagenCarta(carta.nombre)}
                alt={carta.nombre}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://www.sacred-texts.com/tarot/pkt/img/ar01.jpg'
                }}
              />
            </div>
            <div>
              <p className="text-white font-bold text-lg">{carta.nombre}</p>
              <p className="text-white/50 text-xs mt-1">{carta.keywords}</p>
              <p className="text-purple-300 text-xs mt-2">Ver interpretación →</p>
            </div>
          </div>
        </button>

        {/* Afirmación del día */}
        <div className="bg-purple-600/20 border border-purple-400/30 rounded-2xl p-4 backdrop-blur">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Afirmación · {signo}</p>
          <p className="text-white text-sm leading-relaxed italic">"{afirmacion}"</p>
        </div>

        {/* Luna y Signo */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => window.location.href = '/luna'}
            className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur text-center hover:bg-white/12 transition"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
          >
            <p className="text-3xl mb-1">{faseLunar.simbolo}</p>
            <p className="text-white font-semibold text-sm">{faseLunar.nombre}</p>
            <p className="text-white/40 text-xs mt-0.5">
              {faseLunar.diasHastaLunaLlena > 0
                ? `${faseLunar.diasHastaLunaLlena}d para luna llena`
                : '¡Luna llena hoy!'}
            </p>
          </button>
          <button
            onClick={() => window.location.href = '/horoscopo'}
            className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur text-center hover:bg-white/12 transition"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
          >
            <p className="text-3xl mb-1" style={{ fontFamily: 'serif' }}>
              {SIMBOLOS_SIGNOS[signo] || '♌'}
            </p>
            <p className="text-white font-semibold text-sm">{signo}</p>
            <p className="text-white/40 text-xs mt-0.5">Tu horóscopo →</p>
          </button>
        </div>

        {/* Accesos rápidos */}
        <div>
          <p className="text-white/60 text-xs tracking-widest uppercase mb-3">Accesos rápidos</p>
          <div className="grid grid-cols-4 gap-2">
            {ACCESOS_RAPIDOS.map(item => (
              <button
                key={item.ruta}
                onClick={() => window.location.href = item.ruta}
                className="bg-white/8 border border-white/20 rounded-2xl py-3 flex flex-col items-center gap-1 hover:bg-white/15 transition backdrop-blur"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
              >
                <span className="text-xl">{item.icono}</span>
                <span className="text-white/60 text-xs leading-tight text-center">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Explorar */}
        <button
          onClick={() => window.location.href = '/tradiciones'}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-5 rounded-full hover:opacity-90 transition"
          style={{ boxShadow: '0 0 20px rgba(139,92,246,0.4)' }}
        >
          Explorar 55+ tradiciones espirituales
        </button>

        {/* Consulta un experto — próximamente */}
        <div className="bg-white/8 border border-white/20 rounded-3xl p-5 backdrop-blur"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">Consulta con un Experto</p>
              <p className="text-white/50 text-xs mt-1">Chat en tiempo real con expertos espirituales humanos</p>
            </div>
            <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-1 rounded-full flex-shrink-0 ml-3">Próximamente</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center gap-6 text-white/20 text-xs">
          <button onClick={() => window.location.href = '/carta-natal'}>Carta natal</button>
          <button onClick={() => window.location.href = '/diario'}>Diario</button>
          <button onClick={() => window.location.href = '/disclaimer'}>Aviso Legal</button>
        </div>

      </div>
    </div>
  )
}