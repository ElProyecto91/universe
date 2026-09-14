interface Props {
  titulo: string
  texto: string
  hashtags?: string[]
}

export default function Compartir({ titulo, texto, hashtags = [] }: Props) {
  const appUrl = 'https://universe-three-alpha.vercel.app'
  const tags = hashtags.length > 0 ? hashtags.map(h => `#${h}`).join(' ') : ''
  const textoCorto = `${titulo} 🌌\n\n${texto.substring(0, 120)}...\n\n✨ ${appUrl}`
  const tweet = `${titulo} 🌌\n\n${texto.substring(0, 180)}...\n\n${appUrl}`

  const generarImagenYCompartir = async () => {
    try {
      const W = 1080
      const PAD = 60
      const CARD_PAD_X = 70
      const FONT_TITULO = 'bold 48px serif'
      const FONT_TEXTO = '34px sans-serif'
      const FONT_APP = 'bold 32px sans-serif'
      const FONT_LOGO = 'bold 36px serif'
      const LINE_H_TITULO = 60
      const LINE_H_TEXTO = 52
      const MAX_TEXT_W = W - PAD * 2 - CARD_PAD_X * 2

      // Canvas temporal para medir
      const tmp = document.createElement('canvas')
      tmp.width = W
      const t = tmp.getContext('2d')!

      // Medir título
      t.font = FONT_TITULO
      const nLinTitulo = contarLineas(t, titulo, MAX_TEXT_W)

      // Medir texto completo
      t.font = FONT_TEXTO
      const nLinTexto = contarLineasParrafos(t, texto, MAX_TEXT_W, LINE_H_TEXTO)

      // Calcular altura total
      const yLogo        = PAD + 80
      const ySep1        = yLogo + 30
      const yTitulo      = ySep1 + 60
      const ySep2        = yTitulo + nLinTitulo * LINE_H_TITULO + 30
      const yTexto       = ySep2 + 50
      const yTextoFin    = yTexto + nLinTexto * LINE_H_TEXTO
      const ySep3        = yTextoFin + 40
      const yUrl         = ySep3 + 60
      const yTags        = tags ? yUrl + 44 : yUrl
      const H            = (tags ? yTags + 50 : yUrl + 50) + PAD

      // Canvas real
      const canvas = document.createElement('canvas')
      canvas.width  = W
      canvas.height = H
      const ctx = canvas.getContext('2d')!

      // Fondo degradado
      const grad = ctx.createLinearGradient(0, 0, 0, H)
      grad.addColorStop(0, '#0d0015')
      grad.addColorStop(1, '#1a0030')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      // Estrellas
      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      for (let i = 0; i < 80; i++) {
        const sx = Math.random() * W
        const sy = Math.random() * H
        const r  = Math.random() * 2
        ctx.beginPath()
        ctx.arc(sx, sy, r, 0, Math.PI * 2)
        ctx.fill()
      }

      // Card
      const cardX = PAD
      const cardY = PAD
      const cardW = W - PAD * 2
      const cardH = H - PAD * 2
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
      ctx.fillStyle = 'rgba(13,0,21,0.90)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'
      ctx.lineWidth = 2
      ctx.stroke()

      // Logo
      ctx.fillStyle = '#c084fc'
      ctx.font = FONT_LOGO
      ctx.textAlign = 'center'
      ctx.fillText('✦ UNIVERSE ✦', W / 2, yLogo)

      // Sep 1
      dibujarSep(ctx, cardX + 60, cardX + cardW - 60, ySep1)

      // Título
      ctx.fillStyle = '#e9d5ff'
      ctx.font = FONT_TITULO
      ctx.textAlign = 'center'
      dibujarTextoWrap(ctx, titulo, W / 2, yTitulo, MAX_TEXT_W, LINE_H_TITULO, 'center')

      // Sep 2
      dibujarSep(ctx, cardX + 60, cardX + cardW - 60, ySep2, 0.2)

      // Texto
      ctx.fillStyle = 'rgba(255,255,255,0.88)'
      ctx.font = FONT_TEXTO
      ctx.textAlign = 'left'
      dibujarTextoParrafos(ctx, texto, cardX + CARD_PAD_X, yTexto, MAX_TEXT_W, LINE_H_TEXTO)

      // Sep 3
      dibujarSep(ctx, cardX + 60, cardX + cardW - 60, ySep3)

      // URL
      ctx.fillStyle = '#a855f7'
      ctx.font = FONT_APP
      ctx.textAlign = 'center'
      ctx.fillText('🌌 ' + appUrl, W / 2, yUrl)

      // Hashtags
      if (tags) {
        ctx.fillStyle = 'rgba(192,132,252,0.6)'
        ctx.font = '26px sans-serif'
        ctx.fillText(tags, W / 2, yTags)
      }

      // Compartir
      canvas.toBlob(async (blob) => {
        if (!blob) return
        const file = new File([blob], 'universe-lectura.png', { type: 'image/png' })
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({ title: titulo, text: `✨ ${appUrl}`, files: [file] })
        } else {
          const a = document.createElement('a')
          a.href = URL.createObjectURL(blob)
          a.download = 'universe-lectura.png'
          a.click()
        }
      }, 'image/png')

    } catch (err) {
      console.error('[Compartir]', err)
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
      <button
        onClick={generarImagenYCompartir}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-full text-sm hover:opacity-90 transition mb-3"
      >
        📸 Compartir como imagen
      </button>
      <div className="grid grid-cols-3 gap-2">
        <button onClick={compartirWhatsApp} className="bg-green-600/20 border border-green-500/30 text-green-300 rounded-2xl py-3 text-xs font-semibold hover:bg-green-600/30 transition">WhatsApp</button>
        <button onClick={compartirTwitter}  className="bg-sky-600/20 border border-sky-500/30 text-sky-300 rounded-2xl py-3 text-xs font-semibold hover:bg-sky-600/30 transition">X / Twitter</button>
        <button onClick={compartirInstagram} className="bg-pink-600/20 border border-pink-500/30 text-pink-300 rounded-2xl py-3 text-xs font-semibold hover:bg-pink-600/30 transition">Instagram</button>
      </div>
      <button onClick={copiarEnlace} className="w-full mt-3 bg-white/5 border border-white/10 text-white/50 rounded-2xl py-3 text-xs hover:bg-white/10 transition">Copiar enlace</button>
    </div>
  )
}

// Helpers
function dibujarSep(ctx: CanvasRenderingContext2D, x1: number, x2: number, y: number, opacity = 0.3) {
  ctx.strokeStyle = `rgba(192,132,252,${opacity})`
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x1, y)
  ctx.lineTo(x2, y)
  ctx.stroke()
}

function contarLineas(ctx: CanvasRenderingContext2D, texto: string, maxW: number): number {
  const words = texto.split(' ')
  let line = ''
  let lines = 1
  for (const word of words) {
    const test = line + word + ' '
    if (ctx.measureText(test).width > maxW && line !== '') {
      line = word + ' '
      lines++
    } else {
      line = test
    }
  }
  return lines
}

function contarLineasParrafos(ctx: CanvasRenderingContext2D, texto: string, maxW: number, _lineH: number): number {
  const parrafos = texto.split('\n')
  let total = 0
  for (const p of parrafos) {
    if (p.trim() === '') { total++; continue }
    total += contarLineas(ctx, p, maxW)
  }
  return total
}

function dibujarTextoWrap(
  ctx: CanvasRenderingContext2D,
  texto: string,
  x: number,
  y: number,
  maxW: number,
  lineH: number,
  align: 'center' | 'left' = 'left'
): number {
  ctx.textAlign = align
  const words = texto.split(' ')
  let line = ''
  let lines = 0
  for (const word of words) {
    const test = line + word + ' '
    if (ctx.measureText(test).width > maxW && line !== '') {
      ctx.fillText(line.trim(), x, y + lines * lineH)
      line = word + ' '
      lines++
    } else {
      line = test
    }
  }
  ctx.fillText(line.trim(), x, y + lines * lineH)
  return lines + 1
}

function dibujarTextoParrafos(
  ctx: CanvasRenderingContext2D,
  texto: string,
  x: number,
  y: number,
  maxW: number,
  lineH: number
): number {
  const parrafos = texto.split('\n')
  let totalLines = 0
  for (const p of parrafos) {
    if (p.trim() === '') {
      totalLines++
      continue
    }
    const words = p.split(' ')
    let line = ''
    for (const word of words) {
      const test = line + word + ' '
      if (ctx.measureText(test).width > maxW && line !== '') {
        ctx.fillText(line.trim(), x, y + totalLines * lineH)
        line = word + ' '
        totalLines++
      } else {
        line = test
      }
    }
    ctx.fillText(line.trim(), x, y + totalLines * lineH)
    totalLines++
  }
  return totalLines
}