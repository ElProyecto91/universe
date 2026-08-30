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
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="relative z-10 flex flex-col items-center">

        <div className="mb-6 text-6xl">✨</div>
        
        <h1 className="text-5xl font-bold mb-4" style={{
          background: 'linear-gradient(to right, #c084fc, #f9a8d4, #e0c3fc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          UNIVERSE
        </h1>
        
        <p className="text-purple-200 text-lg mb-1 font-light tracking-wide">
          Your personal AI guide to astrology,
        </p>
        <p className="text-purple-200 text-lg mb-12 font-light tracking-wide">
          tarot and self-discovery.
        </p>

        <button
          onClick={() => window.location.href = '/onboarding'}
          className="bg-white/10 backdrop-blur border border-white/30 text-white font-semibold py-4 px-10 rounded-full text-lg hover:bg-white/20 transition"
        >
          Explore my Universe
        </button>

        <div className="mt-10 flex gap-8 text-2xl opacity-80">
          <div className="flex flex-col items-center gap-1">
            <span>❤️</span>
            <span className="text-xs text-purple-200">Love</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span>🌙</span>
            <span className="text-xs text-purple-200">My future</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span>✨</span>
            <span className="text-xs text-purple-200">My path</span>
          </div>
        </div>

      </div>
    </div>
  )
}