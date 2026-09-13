interface Props {
  titulo: string
  texto: string
  hashtags?: string[]
}

export default function Compartir({ titulo, texto, hashtags = [] }: Props) {
  const appUrl = 'https://universe-three-alpha.vercel.app'
  const url = window.location.href
  const tags = hashtags.length > 0 ? ' ' + hashtags.map(h => `#${h}`).join(' ') : ''

  // Texto corto para WhatsApp y nativo — solo gancho + enlace
  const textoCorto = `${titulo} 🌌\n\n${texto.substring(0, 120)}...\n\n✨ Descubre el tuyo en ${appUrl}${tags}`

  // Texto completo para copiar e Instagram
  const textoCompleto = `${titulo}\n\n${texto}${tags ? '\n\n' + tags : ''}\n\n🌌 ${appUrl}`

  // Tweet — máx 280 chars
  const tweet = `${titulo} 🌌\n\n${texto.substring(0, 180)}...\n\n${appUrl}${tags}`

  const compartirNativo = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, text: textoCorto, url: appUrl })
      } catch {}
    }
  }

  const copiarTexto = () => {
    navigator.clipboard.writeText(textoCompleto)
  }

  const compartirWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(textoCorto)}`, '_blank')
  }

  const compartirTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, '_blank')
  }

  const compartirInstagram = () => {
    navigator.clipboard.writeText(textoCompleto)
    alert('Texto copiado. Pégalo en Instagram.')
  }

  return (
    <div className="w-full bg-[#0d0015] border border-white/15 rounded-3xl p-5">
      <p className="text-purple-300 text-xs tracking-widest uppercase mb-4">Compartir lectura</p>

      {navigator.share ? (
        <button
          onClick={compartirNativo}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-full text-sm hover:opacity-90 transition mb-3"
        >
          Compartir
        </button>
      ) : null}

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={compartirWhatsApp}
          className="bg-green-600/20 border border-green-500/30 text-green-300 rounded-2xl py-3 text-xs font-semibold hover:bg-green-600/30 transition"
        >
          WhatsApp
        </button>
        <button
          onClick={compartirTwitter}
          className="bg-sky-600/20 border border-sky-500/30 text-sky-300 rounded-2xl py-3 text-xs font-semibold hover:bg-sky-600/30 transition"
        >
          X / Twitter
        </button>
        <button
          onClick={compartirInstagram}
          className="bg-pink-600/20 border border-pink-500/30 text-pink-300 rounded-2xl py-3 text-xs font-semibold hover:bg-pink-600/30 transition"
        >
          Instagram
        </button>
      </div>

      <button
        onClick={copiarTexto}
        className="w-full mt-3 bg-white/5 border border-white/10 text-white/50 rounded-2xl py-3 text-xs hover:bg-white/10 transition"
      >
        Copiar texto
      </button>
    </div>
  )
}