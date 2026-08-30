export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
      
      <div className="mb-8 text-6xl">✨</div>
      
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        UNIVERSE
      </h1>
      
      <p className="text-gray-400 text-lg mb-2">
        Your personal AI guide to astrology,
      </p>
      <p className="text-gray-400 text-lg mb-12">
        tarot and self-discovery.
      </p>

      <button
        onClick={() => window.location.href = '/onboarding'}
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-10 rounded-full text-lg hover:opacity-90 transition"
      >
        Explore my Universe
      </button>

      <div className="mt-10 flex gap-6 text-2xl">
        <span>❤️</span>
        <span>🌙</span>
        <span>✨</span>
      </div>

    </div>
  )
}