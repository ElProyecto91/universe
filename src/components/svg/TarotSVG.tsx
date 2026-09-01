const W = 'https://upload.wikimedia.org/wikipedia/commons'

const CARTA_IMAGENES: Record<string, string> = {
  // ARCANOS MAYORES — RWS verificadas
  'El Loco':               `${W}/9/90/RWS_Tarot_00_Fool.jpg`,
  'El Mago':               `${W}/d/de/RWS_Tarot_01_Magician.jpg`,
  'La Sacerdotisa':        `${W}/8/88/RWS_Tarot_02_High_Priestess.jpg`,
  'La Emperatriz':         `${W}/d/d2/RWS_Tarot_03_Empress.jpg`,
  'El Emperador':          `${W}/c/c3/RWS_Tarot_04_Emperor.jpg`,
  'El Sumo Sacerdote':     `${W}/8/8d/RWS_Tarot_05_Hierophant.jpg`,
  'Los Amantes':           `${W}/3/3a/TheLovers.jpg`,
  'El Carro':              `${W}/9/9b/RWS_Tarot_07_Chariot.jpg`,
  'La Fuerza':             `${W}/f/f5/RWS_Tarot_08_Strength.jpg`,
  'El Ermitaño':           `${W}/4/4d/RWS_Tarot_09_Hermit.jpg`,
  'La Rueda de la Fortuna':`${W}/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg`,
  'La Justicia':           `${W}/e/e0/RWS_Tarot_11_Justice.jpg`,
  'El Colgado':            `${W}/2/2b/RWS_Tarot_12_Hanged_Man.jpg`,
  'La Muerte':             `${W}/d/d7/RWS_Tarot_13_Death.jpg`,
  'La Templanza':          `${W}/f/f8/RWS_Tarot_14_Temperance.jpg`,
  'El Diablo':             `${W}/5/55/RWS_Tarot_15_Devil.jpg`,
  'La Torre':              `${W}/5/53/RWS_Tarot_16_Tower.jpg`,
  'La Estrella':           `${W}/d/db/RWS_Tarot_17_Star.jpg`,
  'La Luna':               `${W}/7/7f/RWS_Tarot_18_Moon.jpg`,
  'El Sol':                `${W}/1/17/RWS_Tarot_19_Sun.jpg`,
  'El Juicio':             `${W}/d/dd/RWS_Tarot_20_Judgement.jpg`,
  'El Mundo':              `${W}/f/ff/RWS_Tarot_21_World.jpg`,

  // BASTOS — verificadas
  'As de Bastos':        `${W}/1/11/Wands01.jpg`,
  'Dos de Bastos':       `${W}/0/0f/Wands02.jpg`,
  'Tres de Bastos':      `${W}/f/ff/Wands03.jpg`,
  'Cuatro de Bastos':    `${W}/a/a4/Wands04.jpg`,
  'Cinco de Bastos':     `${W}/9/9d/Wands05.jpg`,
  'Seis de Bastos':      `${W}/3/3b/Wands06.jpg`,
  'Siete de Bastos':     `${W}/e/e4/Wands07.jpg`,
  'Ocho de Bastos':      `${W}/6/6b/Wands08.jpg`,
  'Nueve de Bastos':     `${W}/4/4d/Tarot_Nine_of_Wands.jpg`,
  'Diez de Bastos':      `${W}/0/0b/Wands10.jpg`,
  'Sota de Bastos':      `${W}/6/6a/Wands11.jpg`,
  'Caballero de Bastos': `${W}/1/16/Wands12.jpg`,
  'Reina de Bastos':     `${W}/0/0d/Wands13.jpg`,
  'Rey de Bastos':       `${W}/c/ce/Wands14.jpg`,

  // COPAS — verificadas
  'As de Copas':        `${W}/3/36/Cups01.jpg`,
  'Dos de Copas':       `${W}/f/f8/Cups02.jpg`,
  'Tres de Copas':      `${W}/7/7a/Cups03.jpg`,
  'Cuatro de Copas':    `${W}/3/35/Cups04.jpg`,
  'Cinco de Copas':     `${W}/d/d7/Cups05.jpg`,
  'Seis de Copas':      `${W}/1/17/Cups06.jpg`,
  'Siete de Copas':     `${W}/a/ae/Cups07.jpg`,
  'Ocho de Copas':      `${W}/6/60/Cups08.jpg`,
  'Nueve de Copas':     `${W}/2/24/Cups09.jpg`,
  'Diez de Copas':      `${W}/8/84/Cups10.jpg`,
  'Sota de Copas':      `${W}/a/ad/Cups11.jpg`,
  'Caballero de Copas': `${W}/f/fa/Cups12.jpg`,
  'Reina de Copas':     `${W}/6/62/Cups13.jpg`,
  'Rey de Copas':       `${W}/0/04/Cups14.jpg`,

  // ESPADAS — verificadas
  'As de Espadas':        `${W}/1/1a/Swords01.jpg`,
  'Dos de Espadas':       `${W}/9/9e/Swords02.jpg`,
  'Tres de Espadas':      `${W}/0/02/Swords03.jpg`,
  'Cuatro de Espadas':    `${W}/b/bf/Swords04.jpg`,
  'Cinco de Espadas':     `${W}/2/23/Swords05.jpg`,
  'Seis de Espadas':      `${W}/2/29/Swords06.jpg`,
  'Siete de Espadas':     `${W}/3/34/Swords07.jpg`,
  'Ocho de Espadas':      `${W}/a/a7/Swords08.jpg`,
  'Nueve de Espadas':     `${W}/2/2f/Swords09.jpg`,
  'Diez de Espadas':      `${W}/d/d4/Swords10.jpg`,
  'Sota de Espadas':      `${W}/4/4c/Swords11.jpg`,
  'Caballero de Espadas': `${W}/b/b0/Swords12.jpg`,
  'Reina de Espadas':     `${W}/d/d4/Swords13.jpg`,
  'Rey de Espadas':       `${W}/3/33/Swords14.jpg`,

  // OROS — verificadas
  'As de Oros':        `${W}/f/fd/Pents01.jpg`,
  'Dos de Oros':       `${W}/9/9f/Pents02.jpg`,
  'Tres de Oros':      `${W}/4/42/Pents03.jpg`,
  'Cuatro de Oros':    `${W}/3/35/Pents04.jpg`,
  'Cinco de Oros':     `${W}/9/96/Pents05.jpg`,
  'Seis de Oros':      `${W}/a/a6/Pents06.jpg`,
  'Siete de Oros':     `${W}/6/6a/Pents07.jpg`,
  'Ocho de Oros':      `${W}/4/49/Pents08.jpg`,
  'Nueve de Oros':     `${W}/f/f0/Pents09.jpg`,
  'Diez de Oros':      `${W}/4/42/Pents10.jpg`,
  'Sota de Oros':      `${W}/e/ec/Pents11.jpg`,
  'Caballero de Oros': `${W}/d/d5/Pents12.jpg`,
  'Reina de Oros':     `${W}/8/88/Pents13.jpg`,
  'Rey de Oros':       `${W}/1/1c/Pents14.jpg`,
}

export function getCartaSVG(nombreCarta: string): JSX.Element {
  const src = CARTA_IMAGENES[nombreCarta]

  if (src) {
    return (
      <div className="w-full h-full relative">
        <img
          src={src}
          alt={nombreCarta}
          className="w-full h-full object-cover rounded-xl"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.onerror = null
            if (target.parentElement) {
              target.parentElement.innerHTML = `
                <div style="width:100%;height:100%;background:linear-gradient(135deg,#4c1d95,#1a0f2e);border-radius:8px;display:flex;align-items:center;justify-content:center;padding:4px;">
                  <div style="color:#c084fc;font-size:7px;text-align:center;line-height:1.4;font-family:serif;">${nombreCarta}</div>
                </div>
              `
            }
          }}
        />
      </div>
    )
  }

  return (
    <svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="120" height="200" fill="#1a0f2e" rx="8"/>
      <rect x="4" y="4" width="112" height="192" fill="none" stroke="#c084fc" strokeWidth="1" rx="6"/>
      {[...Array(5)].map((_, i) => (
        <ellipse key={i} cx="60" cy="100" rx={15 + i * 12} ry={25 + i * 18} fill="none" stroke="#7c3aed" strokeWidth="0.5" opacity={0.7 - i * 0.1}/>
      ))}
      <circle cx="60" cy="100" r="3" fill="#c084fc"/>
      <text x="60" y="155" textAnchor="middle" fill="#c084fc" fontSize="7" fontFamily="serif">{nombreCarta}</text>
    </svg>
  )
}

export function getImagenCarta(nombreCarta: string): string {
  return CARTA_IMAGENES[nombreCarta] || `${W}/d/de/RWS_Tarot_01_Magician.jpg`
}