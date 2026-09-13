interface Props {
  titulo: string
  texto: string
  hashtags?: string[]
}

export default function Compartir({ titulo, texto, hashtags = [] }: Props) {
  const appUrl = 'https://universe-three-alpha.vercel.app'
  const tags = hashtags.length > 0 ? hashtags.map(h => `#${h}`).join(' ') : ''
  const textoCorto = `${titulo} 🌌\n\n${texto.substring(0, 120)}...\n\n✨ ${appUrl}`
  const textoCompleto = `${titulo}\n\n${texto}${tags ? '\n\n' + tags : ''}\n\n🌌 ${appUrl}`
  const tweet = `${titulo} 🌌\n\n${texto.substring(0, 180)}...\n\n${appUrl}`

  const generarImagenYCompartir = async () => {
    try {
      const canvas = document.createElement('canvas')
      const W = 1080
      const H = 1350
      canvas.width = W
      canvas.height = H
      const ctx = canvas.getContext('2d')!

      // Fondo oscuro degradado
      const grad = ctx.createLinearGradient(0, 0, 0, H)
      grad.addColorStop(0, '#0d0015')
      grad.addColorStop(1, '#1a0030')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      // Estrellas decorativas
      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      for (let i = 0; i < 80; i++) {
        const x = Math.random() * W
        const y = Math.random() * H
        const r = Math.random() * 2
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }

      // Card central
      const pad = 60
      const cardX = pad
      const cardY = pad
      const cardW = W - pad * 2
      const cardH = H - pad * 2
      const radio = 40

      ctx.beginPath()
      ctx.moveTo(cardX + radio, cardY)
      ctx.lineTo(cardX + cardW - radio, cardY)
      ctx.arcTo(cardX + cardW, cardY, cardX + cardW, cardY + radio, radio)
      ctx.lineTo(cardX + cardW, cardY + cardH - radio)
      ctx.arcTo(cardX + cardW, cardY + cardH, cardX + cardW - radio, cardY + cardH, radio)
      ctx.lineTo(cardX + radio, cardY + cardH)
      ctx.arcTo(cardX, cardY + cardH, cardX, cardY + cardH - radio, radio)
      ctx.lineTo(cardX, cardY + radio)
      ctx.arcTo(cardX, cardY, cardX + radio, cardY, radio)
      ctx.closePath()
      ctx.fillStyle = 'rgba(13,0,21,0.85)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'
      ctx.lineWidth = 2
      ctx.stroke()

      // Logo / título app
      ctx.fillStyle = '#c084fc'
      ctx.font = 'bold 36px serif'
      ctx.textAlign = 'center'
      ctx.fillText('✦ UNIVERSE ✦', W / 2, cardY + 80)

      // Línea separadora
      ctx.strokeStyle = 'rgba(192,132,252,0.3)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(cardX + 60, cardY + 100)
      ctx.lineTo(cardX + cardW - 60, cardY + 100)
      ctx.stroke()

      // Título de la lectura
      ctx.fillStyle = '#e9d5ff'
      ctx.font = 'bold 48px serif'
      ctx.textAlign = 'center'
      const tituloLineas = wrapText(ctx, titulo, W / 2, cardY + 170, cardW - 120, 60)

      // Línea separadora
      const yDespuesTitulo = cardY + 170 + tituloLineas * 60 + 30
      ctx.strokeStyle = 'rgba(192,132,252,0.2)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(cardX + 60, yDespuesTitulo)
      ctx.lineTo(cardX + cardW - 60, yDespuesTitulo)
      ctx.stroke()

      // Texto de la lectura
      ctx.fillStyle = 'rgba(255,255,255,0.85)'
      ctx.font = '34px sans-serif'
      ctx.textAlign = 'left'
      const textoRecortado = texto.length > 400 ? texto.substring(0, 400) + '...' : texto
      wrapTextLeft(ctx, textoRecortado, cardX + 70, yDespuesTitulo + 50, cardW - 140, 50)

      // Línea inferior
      ctx.strokeStyle = 'rgba(192,132,252,0.3)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(cardX + 60, cardY + cardH - 120)
      ctx.lineTo(cardX + cardW - 60, cardY + cardH - 120)
      ctx.stroke()

      // URL y hashtags
      ctx.fillStyle = '#a855f7'
      ctx.font = 'bold 32px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('🌌 ' + appUrl, W / 2, cardY + cardH - 80)

      if (tags) {
        ctx.fillStyle = 'rgba(192,132,252,0.6)'
        ctx.font = '26px sans-serif'
        ctx.fillText(tags, W / 2, cardY + cardH - 40)
      }

      // Convertir a blob y compartir
      canvas.toBlob(async (blob) => {
        if (!blob) return
        const file = new File([blob], 'universe-lectura.png', { type: 'image/png' })
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: titulo,
            text: `✨ ${appUrl}`,
            files: [file],
          })
        } else {
          // Fallback — descargar imagen
          const a = document.createElement('a')
          a.href = URL.createObjectURL(blob)
          a.download = 'universe-lectura.png'
          a.click()
        }
      }, 'image/png')

    } catch (err) {
      console.error('[Compartir]', err)
      // Fallback al texto corto
      if (navigator.share) {
        await navigator.share({ title: titulo, text: textoCorto, url: appUrl })
      }
    }
  }

  const compartirWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(textoCorto)}`, '_blank')
  }

  const compartirTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, '_blank')
  }

  const compartirInstagram = () => {
    navigator.clipboard.writeText(appUrl)
    alert('Enlace copiado. Pégalo en Instagram.')
  }

  const copiarEnlace = () => {
    navigator.clipboard.writeText(appUrl)
  }

  return (
    <div className="w-full bg-[#0d0015] border border-white/15 rounded-3xl p-5">
      <p className="text-purple-300 text-xs tracking-widest uppercase mb-4">Compartir lectura</p>

      {/* Botón principal — genera imagen */}
      <button
        onClick={generarImagenYCompartir}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-full text-sm hover:opacity-90 transition mb-3"
      >
        📸 Compartir como imagen
      </button>

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
        onClick={copiarEnlace}
        className="w-full mt-3 bg-white/5 border border-white/10 text-white/50 rounded-2xl py-3 text-xs hover:bg-white/10 transition"
      >
        Copiar enlace
      </button>
    </div>
  )
}

// Helper — texto centrado con saltos de línea
function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number {
  const words = text.split(' ')
  let line = ''
  let lines = 0
  for (const word of words) {
    const test = line + word + ' '
    if (ctx.measureText(test).width > maxWidth && line !== '') {
      ctx.fillText(line.trim(), x, y + lines * lineHeight)
      line = word + ' '
      lines++
    } else {
      line = test
    }
  }
  ctx.fillText(line.trim(), x, y + lines * lineHeight)
  return lines + 1
}

// Helper — texto alineado a la izquierda con saltos de línea
function wrapTextLeft(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number {
  const paragraphs = text.split('\n')
  let totalLines = 0
  for (const para of paragraphs) {
    if (para.trim() === '') { totalLines++; continue }
    const words = para.split(' ')
    let line = ''
    for (const word of words) {
      const test = line + word + ' '
      if (ctx.measureText(test).width > maxWidth && line !== '') {
        ctx.fillText(line.trim(), x, y + totalLines * lineHeight)
        line = word + ' '
        totalLines++
      } else {
        line = test
      }
    }
    ctx.fillText(line.trim(), x, y + totalLines * lineHeight)
    totalLines++
  }
  return totalLines
} 