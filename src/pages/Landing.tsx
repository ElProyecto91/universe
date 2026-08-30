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
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex flex-col items-center">

        <div className="mb-6 text-6xl" style={{ filter: 'drop-shadow(0 0 20px rgba(192,132,252,0.8))' }}>✨</div>

        <h1 className="text-5xl font-bold mb-4" style={{
          background: 'linear-gradient(to right, #c084fc, #f9a8d4, #e0c3fc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 2px 8px rgba(192,132,252,0.9))'
        }}>
          UNIVERSE
        </h1>

        <p className="text-white text-lg mb-1 font-light tracking-wide" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
          Tu guía personal de astrología,
        </p>
        <p className="text-white text-lg mb-12 font-light tracking-wide" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
          tarot y autodescubrimiento con IA.
        </p>

        <button
          onClick={() => window.location.href = '/onboarding'}
          className="bg-white/10 backdrop-blur border border-white/40 text-white font-semibold py-4 px-10 rounded-full text-lg hover:bg-white/20 transition"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
        >
          Explorar mi Universo
        </button>

        <div className="mt-10 flex gap-8 text-2xl">
          <div className="flex flex-col items-center gap-1">
            <span>❤️</span>
            <span className="text-xs text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>Amor</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span>🌙</span>
            <span className="text-xs text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>Mi futuro</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span>✨</span>
            <span className="text-xs text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>Mi camino</span>
          </div>
        </div>

      </div>
    </div>
  )
}