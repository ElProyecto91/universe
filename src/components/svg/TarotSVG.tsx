// learntarot.com — dominio público, sin CORS, 350x600px
const BASE_MAJOR = 'https://www.learntarot.com/bigjpgs'
const BASE_MINOR = 'https://www.learntarot.com/bigjpgs'

const CARTA_IMAGENES: Record<string, string> = {
  // Arcanos Mayores — maj00.jpg a maj21.jpg
  'El Loco': `${BASE_MAJOR}/maj00.jpg`,
  'El Mago': `${BASE_MAJOR}/maj01.jpg`,
  'La Sacerdotisa': `${BASE_MAJOR}/maj02.jpg`,
  'La Emperatriz': `${BASE_MAJOR}/maj03.jpg`,
  'El Emperador': `${BASE_MAJOR}/maj04.jpg`,
  'El Sumo Sacerdote': `${BASE_MAJOR}/maj05.jpg`,
  'Los Amantes': `${BASE_MAJOR}/maj06.jpg`,
  'El Carro': `${BASE_MAJOR}/maj07.jpg`,
  'La Fuerza': `${BASE_MAJOR}/maj08.jpg`,
  'El Ermitaño': `${BASE_MAJOR}/maj09.jpg`,
  'La Rueda de la Fortuna': `${BASE_MAJOR}/maj10.jpg`,
  'La Justicia': `${BASE_MAJOR}/maj11.jpg`,
  'El Colgado': `${BASE_MAJOR}/maj12.jpg`,
  'La Muerte': `${BASE_MAJOR}/maj13.jpg`,
  'La Templanza': `${BASE_MAJOR}/maj14.jpg`,
  'El Diablo': `${BASE_MAJOR}/maj15.jpg`,
  'La Torre': `${BASE_MAJOR}/maj16.jpg`,
  'La Estrella': `${BASE_MAJOR}/maj17.jpg`,
  'La Luna': `${BASE_MAJOR}/maj18.jpg`,
  'El Sol': `${BASE_MAJOR}/maj19.jpg`,
  'El Juicio': `${BASE_MAJOR}/maj20.jpg`,
  'El Mundo': `${BASE_MAJOR}/maj21.jpg`,

  // Bastos — wands: wa01.jpg a wa14.jpg
  'As de Bastos': `${BASE_MINOR}/wa01.jpg`,
  'Dos de Bastos': `${BASE_MINOR}/wa02.jpg`,
  'Tres de Bastos': `${BASE_MINOR}/wa03.jpg`,
  'Cuatro de Bastos': `${BASE_MINOR}/wa04.jpg`,
  'Cinco de Bastos': `${BASE_MINOR}/wa05.jpg`,
  'Seis de Bastos': `${BASE_MINOR}/wa06.jpg`,
  'Siete de Bastos': `${BASE_MINOR}/wa07.jpg`,
  'Ocho de Bastos': `${BASE_MINOR}/wa08.jpg`,
  'Nueve de Bastos': `${BASE_MINOR}/wa09.jpg`,
  'Diez de Bastos': `${BASE_MINOR}/wa10.jpg`,
  'Sota de Bastos': `${BASE_MINOR}/wa11.jpg`,
  'Caballero de Bastos': `${BASE_MINOR}/wa12.jpg`,
  'Reina de Bastos': `${BASE_MINOR}/wa13.jpg`,
  'Rey de Bastos': `${BASE_MINOR}/wa14.jpg`,

  // Copas — cups: cu01.jpg a cu14.jpg
  'As de Copas': `${BASE_MINOR}/cu01.jpg`,
  'Dos de Copas': `${BASE_MINOR}/cu02.jpg`,
  'Tres de Copas': `${BASE_MINOR}/cu03.jpg`,
  'Cuatro de Copas': `${BASE_MINOR}/cu04.jpg`,
  'Cinco de Copas': `${BASE_MINOR}/cu05.jpg`,
  'Seis de Copas': `${BASE_MINOR}/cu06.jpg`,
  'Siete de Copas': `${BASE_MINOR}/cu07.jpg`,
  'Ocho de Copas': `${BASE_MINOR}/cu08.jpg`,
  'Nueve de Copas': `${BASE_MINOR}/cu09.jpg`,
  'Diez de Copas': `${BASE_MINOR}/cu10.jpg`,
  'Sota de Copas': `${BASE_MINOR}/cu11.jpg`,
  'Caballero de Copas': `${BASE_MINOR}/cu12.jpg`,
  'Reina de Copas': `${BASE_MINOR}/cu13.jpg`,
  'Rey de Copas': `${BASE_MINOR}/cu14.jpg`,

  // Espadas — swords: sw01.jpg a sw14.jpg
  'As de Espadas': `${BASE_MINOR}/sw01.jpg`,
  'Dos de Espadas': `${BASE_MINOR}/sw02.jpg`,
  'Tres de Espadas': `${BASE_MINOR}/sw03.jpg`,
  'Cuatro de Espadas': `${BASE_MINOR}/sw04.jpg`,
  'Cinco de Espadas': `${BASE_MINOR}/sw05.jpg`,
  'Seis de Espadas': `${BASE_MINOR}/sw06.jpg`,
  'Siete de Espadas': `${BASE_MINOR}/sw07.jpg`,
  'Ocho de Espadas': `${BASE_MINOR}/sw08.jpg`,
  'Nueve de Espadas': `${BASE_MINOR}/sw09.jpg`,
  'Diez de Espadas': `${BASE_MINOR}/sw10.jpg`,
  'Sota de Espadas': `${BASE_MINOR}/sw11.jpg`,
  'Caballero de Espadas': `${BASE_MINOR}/sw12.jpg`,
  'Reina de Espadas': `${BASE_MINOR}/sw13.jpg`,
  'Rey de Espadas': `${BASE_MINOR}/sw14.jpg`,

  // Oros — pentacles: pe01.jpg a pe14.jpg
  'As de Oros': `${BASE_MINOR}/pe01.jpg`,
  'Dos de Oros': `${BASE_MINOR}/pe02.jpg`,
  'Tres de Oros': `${BASE_MINOR}/pe03.jpg`,
  'Cuatro de Oros': `${BASE_MINOR}/pe04.jpg`,
  'Cinco de Oros': `${BASE_MINOR}/pe05.jpg`,
  'Seis de Oros': `${BASE_MINOR}/pe06.jpg`,
  'Siete de Oros': `${BASE_MINOR}/pe07.jpg`,
  'Ocho de Oros': `${BASE_MINOR}/pe08.jpg`,
  'Nueve de Oros': `${BASE_MINOR}/pe09.jpg`,
  'Diez de Oros': `${BASE_MINOR}/pe10.jpg`,
  'Sota de Oros': `${BASE_MINOR}/pe11.jpg`,
  'Caballero de Oros': `${BASE_MINOR}/pe12.jpg`,
  'Reina de Oros': `${BASE_MINOR}/pe13.jpg`,
  'Rey de Oros': `${BASE_MINOR}/pe14.jpg`,
}

export function getCartaSVG(nombreCarta: string): JSX.Element {
  const src = CARTA_IMAGENES[nombreCarta]

  if (src) {
    return (
      <div className="w-full h-full relative bg-amber-950/20">
        <img
          src={src}
          alt={nombreCarta}
          className="w-full h-full object-cover rounded-xl"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.onerror = null
            // Fallback a las imágenes locales que ya tenemos
            const localMap: Record<string, string> = {
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
              'El Loco': '/tarot/fool.jpg',
            }
            target.src = localMap[nombreCarta] || '/tarot/magician.jpg'
          }}
        />
      </div>
    )
  }

  // Fallback SVG
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