const BASE = 'https://www.sacred-texts.com/tarot/pkt/img'

// Arcanos Mayores
const CARTA_IMAGENES: Record<string, string> = {
  'El Loco': `${BASE}/ar00.jpg`,
  'El Mago': `${BASE}/ar01.jpg`,
  'La Sacerdotisa': `${BASE}/ar02.jpg`,
  'La Emperatriz': `${BASE}/ar03.jpg`,
  'El Emperador': `${BASE}/ar04.jpg`,
  'El Sumo Sacerdote': `${BASE}/ar05.jpg`,
  'Los Amantes': `${BASE}/ar06.jpg`,
  'El Carro': `${BASE}/ar07.jpg`,
  'La Fuerza': `${BASE}/ar08.jpg`,
  'El Ermitaño': `${BASE}/ar09.jpg`,
  'La Rueda de la Fortuna': `${BASE}/ar10.jpg`,
  'La Justicia': `${BASE}/ar11.jpg`,
  'El Colgado': `${BASE}/ar12.jpg`,
  'La Muerte': `${BASE}/ar13.jpg`,
  'La Templanza': `${BASE}/ar14.jpg`,
  'El Diablo': `${BASE}/ar15.jpg`,
  'La Torre': `${BASE}/ar16.jpg`,
  'La Estrella': `${BASE}/ar17.jpg`,
  'La Luna': `${BASE}/ar18.jpg`,
  'El Sol': `${BASE}/ar19.jpg`,
  'El Juicio': `${BASE}/ar20.jpg`,
  'El Mundo': `${BASE}/ar21.jpg`,

  // Bastos (Wands)
  'As de Bastos': `${BASE}/waac.jpg`,
  'Dos de Bastos': `${BASE}/wa02.jpg`,
  'Tres de Bastos': `${BASE}/wa03.jpg`,
  'Cuatro de Bastos': `${BASE}/wa04.jpg`,
  'Cinco de Bastos': `${BASE}/wa05.jpg`,
  'Seis de Bastos': `${BASE}/wa06.jpg`,
  'Siete de Bastos': `${BASE}/wa07.jpg`,
  'Ocho de Bastos': `${BASE}/wa08.jpg`,
  'Nueve de Bastos': `${BASE}/wa09.jpg`,
  'Diez de Bastos': `${BASE}/wa10.jpg`,
  'Sota de Bastos': `${BASE}/wapa.jpg`,
  'Caballero de Bastos': `${BASE}/wakn.jpg`,
  'Reina de Bastos': `${BASE}/waqu.jpg`,
  'Rey de Bastos': `${BASE}/waki.jpg`,

  // Copas (Cups)
  'As de Copas': `${BASE}/cuac.jpg`,
  'Dos de Copas': `${BASE}/cu02.jpg`,
  'Tres de Copas': `${BASE}/cu03.jpg`,
  'Cuatro de Copas': `${BASE}/cu04.jpg`,
  'Cinco de Copas': `${BASE}/cu05.jpg`,
  'Seis de Copas': `${BASE}/cu06.jpg`,
  'Siete de Copas': `${BASE}/cu07.jpg`,
  'Ocho de Copas': `${BASE}/cu08.jpg`,
  'Nueve de Copas': `${BASE}/cu09.jpg`,
  'Diez de Copas': `${BASE}/cu10.jpg`,
  'Sota de Copas': `${BASE}/cupa.jpg`,
  'Caballero de Copas': `${BASE}/cukn.jpg`,
  'Reina de Copas': `${BASE}/cuqu.jpg`,
  'Rey de Copas': `${BASE}/cuki.jpg`,

  // Espadas (Swords)
  'As de Espadas': `${BASE}/swac.jpg`,
  'Dos de Espadas': `${BASE}/sw02.jpg`,
  'Tres de Espadas': `${BASE}/sw03.jpg`,
  'Cuatro de Espadas': `${BASE}/sw04.jpg`,
  'Cinco de Espadas': `${BASE}/sw05.jpg`,
  'Seis de Espadas': `${BASE}/sw06.jpg`,
  'Siete de Espadas': `${BASE}/sw07.jpg`,
  'Ocho de Espadas': `${BASE}/sw08.jpg`,
  'Nueve de Espadas': `${BASE}/sw09.jpg`,
  'Diez de Espadas': `${BASE}/sw10.jpg`,
  'Sota de Espadas': `${BASE}/swpa.jpg`,
  'Caballero de Espadas': `${BASE}/swkn.jpg`,
  'Reina de Espadas': `${BASE}/swqu.jpg`,
  'Rey de Espadas': `${BASE}/swki.jpg`,

  // Oros (Pentacles)
  'As de Oros': `${BASE}/peac.jpg`,
  'Dos de Oros': `${BASE}/pe02.jpg`,
  'Tres de Oros': `${BASE}/pe03.jpg`,
  'Cuatro de Oros': `${BASE}/pe04.jpg`,
  'Cinco de Oros': `${BASE}/pe05.jpg`,
  'Seis de Oros': `${BASE}/pe06.jpg`,
  'Siete de Oros': `${BASE}/pe07.jpg`,
  'Ocho de Oros': `${BASE}/pe08.jpg`,
  'Nueve de Oros': `${BASE}/pe09.jpg`,
  'Diez de Oros': `${BASE}/pe10.jpg`,
  'Sota de Oros': `${BASE}/pepa.jpg`,
  'Caballero de Oros': `${BASE}/pekn.jpg`,
  'Reina de Oros': `${BASE}/pequ.jpg`,
  'Rey de Oros': `${BASE}/peki.jpg`,
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
          crossOrigin="anonymous"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            if (target.parentElement) {
              target.parentElement.innerHTML = `
                <div style="width:100%;height:100%;background:linear-gradient(135deg,#4c1d95,#1a0f2e);border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4px;">
                  <div style="color:#c084fc;font-size:8px;text-align:center;line-height:1.3;">${nombreCarta}</div>
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
      {[...Array(6)].map((_, i) => (
        <ellipse key={i} cx="60" cy="100" rx={15 + i * 12} ry={25 + i * 18} fill="none" stroke="#7c3aed" strokeWidth="0.5" opacity={0.8 - i * 0.1}/>
      ))}
      <circle cx="60" cy="100" r="8" fill="none" stroke="#c084fc" strokeWidth="1.5"/>
      <circle cx="60" cy="100" r="3" fill="#c084fc"/>
      <text x="60" y="160" textAnchor="middle" fill="#c084fc" fontSize="7" fontFamily="serif">{nombreCarta}</text>
    </svg>
  )
}

export function getImagenCarta(nombreCarta: string): string {
  const BASE = 'https://www.sacred-texts.com/tarot/pkt/img'
  return CARTA_IMAGENES[nombreCarta] || `${BASE}/ar01.jpg`
}