const CARTA_IMAGENES: Record<string, string> = {
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
          style={{ imageRendering: 'auto' }}
        />
      </div>
    )
  }

  // Fallback genérico si no hay imagen
  return (
    <svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="120" height="200" fill="#1a0f2e" rx="8"/>
      <rect x="4" y="4" width="112" height="192" fill="none" stroke="#c084fc" strokeWidth="1" rx="6"/>
      {[...Array(6)].map((_, i) => (
        <ellipse key={i} cx="60" cy="100" rx={15 + i * 12} ry={25 + i * 18} fill="none" stroke="#7c3aed" strokeWidth="0.5" opacity={0.8 - i * 0.1}/>
      ))}
      <circle cx="60" cy="100" r="8" fill="none" stroke="#c084fc" strokeWidth="1.5"/>
      <circle cx="60" cy="100" r="3" fill="#c084fc"/>
      <text x="60" y="160" textAnchor="middle" fill="#c084fc" fontSize="8" fontFamily="serif">{nombreCarta}</text>
    </svg>
  )
}