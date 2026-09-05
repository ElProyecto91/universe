import CookieBanner from '../components/CookieBanner'

export default function Landing() {
  return (
    <div
      className="min-h-screen text-white flex flex-col items-center justify-center px-6 text-center relative"
      style={{
        backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm">

        <div className="mb-6 text-7xl" style={{ filter: 'drop-shadow(0 0 30px rgba(192,132,252,1))' }}>✨</div>

        <h1 className="text-6xl font-bold mb-3" style={{
          background: 'linear-gradient(to right, #c084fc, #f9a8d4, #e0c3fc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 2px 12px rgba(192,132,252,1))'
        }}>
          UNIVERSE
        </h1>

        <p className="text-white/90 text-lg mb-2 font-light tracking-wide" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
          Tu guía personal de astrología,
        </p>
        <p className="text-white/90 text-lg mb-10 font-light tracking-wide" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
          tarot y autodescubrimiento con IA.
        </p>

        {/* Estadísticas */}
        <div className="flex gap-6 mb-10">
          {[
            { numero: '30+', label: 'Tradiciones' },
            { numero: '∞', label: 'Lecturas IA' },
            { numero: '24/7', label: 'Disponible' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <p className="text-2xl font-bold text-purple-300">{item.numero}</p>
              <p className="text-white/50 text-xs">{item.label}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => window.location.href = '/auth'}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-5 rounded-full text-lg hover:opacity-90 transition mb-4 shadow-lg"
          style={{ boxShadow: '0 0 30px rgba(139,92,246,0.5)' }}
        >
          Explorar mi Universo
        </button>

        <button
          onClick={() => window.location.href = '/onboarding'}
          className="text-white/50 text-sm mb-10 hover:text-white/80 transition"
        >
          Continuar sin cuenta →
        </button>

        {/* Categorías */}
        <div className="grid grid-cols-3 gap-3 w-full mb-8">
          {[
            { icono: '🃏', label: 'Tarot' },
            { icono: '☯', label: 'I Ching' },
            { icono: '🌙', label: 'Luna' },
            { icono: 'ᚠ', label: 'Runas' },
            { icono: '∞', label: 'Numerología' },
            { icono: '🔮', label: 'Oráculos' },
          ].map(item => (
            <div
              key={item.label}
              className="bg-white/10 border border-white/20 rounded-2xl py-3 flex flex-col items-center gap-1 backdrop-blur"
            >
              <span className="text-xl">{item.icono}</span>
              <span className="text-white/70 text-xs">{item.label}</span>
            </div>
          ))}
        </div>

        <p className="text-white/30 text-xs text-center leading-relaxed max-w-xs">
          Solo para entretenimiento y reflexión personal. Las lecturas no constituyen asesoramiento profesional de ningún tipo.
        </p>

        <button
          onClick={() => window.location.href = '/legal'}
          className="text-white/25 text-xs mt-2 underline"
        >
          Aviso Legal completo
        </button>

      </div>

      {/* Banner de cookies — aparece en primer acceso */}
      <CookieBanner />
    </div>
  )
}
