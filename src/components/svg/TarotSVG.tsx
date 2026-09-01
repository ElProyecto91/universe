// Wikimedia Commons — dominio público, CORS abierto, alta calidad
const W = 'https://upload.wikimedia.org/wikipedia/commons'

const CARTA_IMAGENES: Record<string, string> = {
  // Arcanos Mayores — ya los tenemos locales, usamos los locales como primarios
  'El Loco': '/tarot/fool.jpg',
  'El Mago': '/tarot/magician.jpg',
  'La Sacerdotisa': '/tarot/priestess.jpg',
  'La Emperatriz': '/tarot/empress.jpg',
  'El Emperador': '/tarot/emperor.jpg',
  'El Sumo Sacerdote': '/tarot/hierophant.jpg',
  'Los Amantes': '/tarot/lovers.jpg',
  'El Carro': '/tarot/chariot.jpg',
  'La Fuerza': '/tarot/strength.jpg',
  'El Ermitaño': '/tarot/hermit.jpg',
  'La Rueda de la Fortuna': '/tarot/wheel.jpg',
  'La Justicia': '/tarot/justice.jpg',
  'El Colgado': '/tarot/hanged.jpg',
  'La Muerte': '/tarot/death.jpg',
  'La Templanza': '/tarot/temperance.jpg',
  'El Diablo': '/tarot/devil.jpg',
  'La Torre': '/tarot/tower.jpg',
  'La Estrella': '/tarot/star.jpg',
  'La Luna': '/tarot/moon.jpg',
  'El Sol': '/tarot/sun.jpg',
  'El Juicio': '/tarot/judgement.jpg',
  'El Mundo': '/tarot/world.jpg',

  // Arcanos Menores — Wikimedia Commons
  // Bastos (Wands)
  'As de Bastos': `${W}/1/11/Wands01.jpg`,
  'Dos de Bastos': `${W}/0/0d/Wands02.jpg`,
  'Tres de Bastos': `${W}/f/ff/Wands03.jpg`,
  'Cuatro de Bastos': `${W}/a/a4/Wands04.jpg`,
  'Cinco de Bastos': `${W}/9/9d/Wands05.jpg`,
  'Seis de Bastos': `${W}/3/3b/Wands06.jpg`,
  'Siete de Bastos': `${W}/e/e4/Wands07.jpg`,
  'Ocho de Bastos': `${W}/6/6b/Wands08.jpg`,
  'Nueve de Bastos': `${W}/e/e5/Wands09.jpg`,
  'Diez de Bastos': `${W}/0/0b/Wands10.jpg`,
  'Sota de Bastos': `${W}/6/6a/Wands11.jpg`,
  'Caballero de Bastos': `${W}/1/16/Wands12.jpg`,
  'Reina de Bastos': `${W}/0/0d/Wands13.jpg`,
  'Rey de Bastos': `${W}/c/ce/Wands14.jpg`,

  // Copas (Cups)
  'As de Copas': `${W}/3/36/Cups01.jpg`,
  'Dos de Copas': `${W}/f/f8/Cups02.jpg`,
  'Tres de Copas': `${W}/7/7a/Cups03.jpg`,
  'Cuatro de Copas': `${W}/3/35/Cups04.jpg`,
  'Cinco de Copas': `${W}/d/d7/Cups05.jpg`,
  'Seis de Copas': `${W}/1/17/Cups06.jpg`,
  'Siete de Copas': `${W}/a/ae/Cups07.jpg`,
  'Ocho de Copas': `${W}/6/60/Cups08.jpg`,
  'Nueve de Copas': `${W}/2/24/Cups09.jpg`,
  'Diez de Copas': `${W}/8/84/Cups10.jpg`,
  'Sota de Copas': `${W}/a/ad/Cups11.jpg`,
  'Caballero de Copas': `${W}/f/fa/Cups12.jpg`,
  'Reina de Copas': `${W}/6/62/Cups13.jpg`,
  'Rey de Copas': `${W}/0/04/Cups14.jpg`,

  // Espadas (Swords)
  'As de Espadas': `${W}/1/1a/Swords01.jpg`,
  'Dos de Espadas': `${W}/9/9e/Swords02.jpg`,
  'Tres de Espadas': `${W}/0/02/Swords03.jpg`,
  'Cuatro de Espadas': `${W}/b/bf/Swords04.jpg`,
  'Cinco de Espadas': `${W}/2/23/Swords05.jpg`,
  'Seis de Espadas': `${W}/2/29/Swords06.jpg`,
  'Siete de Espadas': `${W}/3/34/Swords07.jpg`,
  'Ocho de Espadas': `${W}/a/a7/Swords08.jpg`,
  'Nueve de Espadas': `${W}/2/2f/Swords09.jpg`,
  'Diez de Espadas': `${W}/d/d4/Swords10.jpg`,
  'Sota de Espadas': `${W}/4/4c/Swords11.jpg`,
  'Caballero de Espadas': `${W}/b/b0/Swords12.jpg`,
  'Reina de Espadas': `${W}/d/d4/Swords13.jpg`,
  'Rey de Espadas': `${W}/3/33/Swords14.jpg`,

  // Oros (Pentacles)
  'As de Oros': `${W}/f/fd/Pents01.jpg`,
  'Dos de Oros': `${W}/9/9f/Pents02.jpg`,
  'Tres de Oros': `${W}/4/42/Pents03.jpg`,
  'Cuatro de Oros': `${W}/3/35/Pents04.jpg`,
  'Cinco de Oros': `${W}/9/96/Pents05.jpg`,
  'Seis de Oros': `${W}/a/a6/Pents06.jpg`,
  'Siete de Oros': `${W}/6/6a/Pents07.jpg`,
  'Ocho de Oros': `${W}/4/49/Pents08.jpg`,
  'Nueve de Oros': `${W}/f/f0/Pents09.jpg`,
  'Diez de Oros': `${W}/4/42/Pents10.jpg`,
  'Sota de Oros': `${W}/e/ec/Pents11.jpg`,
  'Caballero de Oros': `${W}/d/d5/Pents12.jpg`,
  'Reina de Oros': `${W}/8/88/Pents13.jpg`,
  'Rey de Oros': `${W}/1/1c/Pents14.jpg`,
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
            // Fallback: learntarot como segunda opción
            const BASE = 'https://www.learntarot.com/bigjpgs'
            const fallbacks: Record<string, string> = {
              'As de Bastos': `${BASE}/wa01.jpg`,
              'Dos de Bastos': `${BASE}/wa02.jpg`,
              'Tres de Bastos': `${BASE}/wa03.jpg`,
              'Cuatro de Bastos': `${BASE}/wa04.jpg`,
              'Cinco de Bastos': `${BASE}/wa05.jpg`,
              'Seis de Bastos': `${BASE}/wa06.jpg`,
              'Siete de Bastos': `${BASE}/wa07.jpg`,
              'Ocho de Bastos': `${BASE}/wa08.jpg`,
              'Nueve de Bastos': `${BASE}/wa09.jpg`,
              'Diez de Bastos': `${BASE}/wa10.jpg`,
              'Sota de Bastos': `${BASE}/wa11.jpg`,
              'Caballero de Bastos': `${BASE}/wa12.jpg`,
              'Reina de Bastos': `${BASE}/wa13.jpg`,
              'Rey de Bastos': `${BASE}/wa14.jpg`,
              'As de Copas': `${BASE}/cu01.jpg`,
              'Dos de Copas': `${BASE}/cu02.jpg`,
              'Tres de Copas': `${BASE}/cu03.jpg`,
              'Cuatro de Copas': `${BASE}/cu04.jpg`,
              'Cinco de Copas': `${BASE}/cu05.jpg`,
              'Seis de Copas': `${BASE}/cu06.jpg`,
              'Siete de Copas': `${BASE}/cu07.jpg`,
              'Ocho de Copas': `${BASE}/cu08.jpg`,
              'Nueve de Copas': `${BASE}/cu09.jpg`,
              'Diez de Copas': `${BASE}/cu10.jpg`,
              'Sota de Copas': `${BASE}/cu11.jpg`,
              'Caballero de Copas': `${BASE}/cu12.jpg`,
              'Reina de Copas': `${BASE}/cu13.jpg`,
              'Rey de Copas': `${BASE}/cu14.jpg`,
              'As de Espadas': `${BASE}/sw01.jpg`,
              'Dos de Espadas': `${BASE}/sw02.jpg`,
              'Tres de Espadas': `${BASE}/sw03.jpg`,
              'Cuatro de Espadas': `${BASE}/sw04.jpg`,
              'Cinco de Espadas': `${BASE}/sw05.jpg`,
              'Seis de Espadas': `${BASE}/sw06.jpg`,
              'Siete de Espadas': `${BASE}/sw07.jpg`,
              'Ocho de Espadas': `${BASE}/sw08.jpg`,
              'Nueve de Espadas': `${BASE}/sw09.jpg`,
              'Diez de Espadas': `${BASE}/sw10.jpg`,
              'Sota de Espadas': `${BASE}/sw11.jpg`,
              'Caballero de Espadas': `${BASE}/sw12.jpg`,
              'Reina de Espadas': `${BASE}/sw13.jpg`,
              'Rey de Espadas': `${BASE}/sw14.jpg`,
              'As de Oros': `${BASE}/pe01.jpg`,
              'Dos de Oros': `${BASE}/pe02.jpg`,
              'Tres de Oros': `${BASE}/pe03.jpg`,
              'Cuatro de Oros': `${BASE}/pe04.jpg`,
              'Cinco de Oros': `${BASE}/pe05.jpg`,
              'Seis de Oros': `${BASE}/pe06.jpg`,
              'Siete de Oros': `${BASE}/pe07.jpg`,
              'Ocho de Oros': `${BASE}/pe08.jpg`,
              'Nueve de Oros': `${BASE}/pe09.jpg`,
              'Diez de Oros': `${BASE}/pe10.jpg`,
              'Sota de Oros': `${BASE}/pe11.jpg`,
              'Caballero de Oros': `${BASE}/pe12.jpg`,
              'Reina de Oros': `${BASE}/pe13.jpg`,
              'Rey de Oros': `${BASE}/pe14.jpg`,
            }
            if (fallbacks[nombreCarta]) {
              target.src = fallbacks[nombreCarta]
            } else {
              target.style.display = 'none'
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
      <circle cx="60" cy="100" r="3" fill="#c084fc"/>
      <text x="60" y="160" textAnchor="middle" fill="#c084fc" fontSize="7" fontFamily="serif">{nombreCarta}</text>
    </svg>
  )
}

export function getImagenCarta(nombreCarta: string): string {
  return CARTA_IMAGENES[nombreCarta] || '/tarot/magician.jpg'
}