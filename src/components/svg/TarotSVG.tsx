export const ARCANOS_SVG: Record<string, JSX.Element> = {
  'El Loco': (
    <svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="120" height="200" fill="#1a0f2e" rx="8"/>
      <rect x="4" y="4" width="112" height="192" fill="none" stroke="#c084fc" strokeWidth="1" rx="6"/>
      <rect x="8" y="8" width="104" height="184" fill="none" stroke="#7c3aed" strokeWidth="0.5" rx="4" strokeDasharray="3 3"/>
      {/* Sol */}
      <circle cx="90" cy="25" r="12" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
      <line x1="90" y1="10" x2="90" y2="6" stroke="#fbbf24" strokeWidth="1.5"/>
      <line x1="90" y1="40" x2="90" y2="44" stroke="#fbbf24" strokeWidth="1.5"/>
      <line x1="75" y1="25" x2="71" y2="25" stroke="#fbbf24" strokeWidth="1.5"/>
      <line x1="105" y1="25" x2="109" y2="25" stroke="#fbbf24" strokeWidth="1.5"/>
      <line x1="79.5" y1="14.5" x2="76.5" y2="11.5" stroke="#fbbf24" strokeWidth="1.5"/>
      <line x1="100.5" y1="35.5" x2="103.5" y2="38.5" stroke="#fbbf24" strokeWidth="1.5"/>
      <line x1="100.5" y1="14.5" x2="103.5" y2="11.5" stroke="#fbbf24" strokeWidth="1.5"/>
      <line x1="79.5" y1="35.5" x2="76.5" y2="38.5" stroke="#fbbf24" strokeWidth="1.5"/>
      {/* Figura del Loco */}
      <circle cx="50" cy="55" r="10" fill="none" stroke="#e2c4ff" strokeWidth="1.5"/>
      <line x1="50" y1="65" x2="50" y2="110" stroke="#e2c4ff" strokeWidth="1.5"/>
      <line x1="50" y1="80" x2="30" y2="95" stroke="#e2c4ff" strokeWidth="1.5"/>
      <line x1="50" y1="80" x2="75" y2="70" stroke="#e2c4ff" strokeWidth="1.5"/>
      <line x1="50" y1="110" x2="35" y2="135" stroke="#e2c4ff" strokeWidth="1.5"/>
      <line x1="50" y1="110" x2="65" y2="135" stroke="#e2c4ff" strokeWidth="1.5"/>
      {/* Bastón con bolsa */}
      <line x1="75" y1="70" x2="85" y2="50" stroke="#e2c4ff" strokeWidth="1.5"/>
      <circle cx="85" cy="48" r="6" fill="none" stroke="#c084fc" strokeWidth="1"/>
      {/* Precipicio */}
      <path d="M15 145 L35 135 L65 138 L105 130 L105 150 L15 150 Z" fill="none" stroke="#7c3aed" strokeWidth="1"/>
      <path d="M15 150 L105 150" stroke="#7c3aed" strokeWidth="1"/>
      {/* Montañas */}
      <path d="M15 145 L35 115 L55 130 L75 105 L105 130" fill="none" stroke="#6d28d9" strokeWidth="1"/>
      {/* Perro */}
      <path d="M25 138 Q30 128 38 132 Q42 128 45 133 L45 140 L25 140 Z" fill="none" stroke="#e2c4ff" strokeWidth="1"/>
      {/* Número */}
      <text x="60" y="175" textAnchor="middle" fill="#c084fc" fontSize="9" fontFamily="serif">0</text>
      <text x="60" y="188" textAnchor="middle" fill="#9ca3af" fontSize="7" fontFamily="serif">EL LOCO</text>
    </svg>
  ),

  'El Mago': (
    <svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="120" height="200" fill="#1a0f2e" rx="8"/>
      <rect x="4" y="4" width="112" height="192" fill="none" stroke="#c084fc" strokeWidth="1" rx="6"/>
      <rect x="8" y="8" width="104" height="184" fill="none" stroke="#7c3aed" strokeWidth="0.5" rx="4" strokeDasharray="3 3"/>
      {/* Símbolo del infinito sobre la cabeza */}
      <path d="M40 25 Q50 18 60 25 Q70 32 80 25 Q70 18 60 25 Q50 32 40 25" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
      {/* Figura del Mago */}
      <circle cx="60" cy="50" r="10" fill="none" stroke="#e2c4ff" strokeWidth="1.5"/>
      <line x1="60" y1="60" x2="60" y2="105" stroke="#e2c4ff" strokeWidth="1.5"/>
      {/* Brazos extendidos */}
      <line x1="60" y1="75" x2="35" y2="65" stroke="#e2c4ff" strokeWidth="1.5"/>
      <line x1="60" y1="75" x2="85" y2="65" stroke="#e2c4ff" strokeWidth="1.5"/>
      {/* Varita */}
      <line x1="85" y1="65" x2="90" y2="50" stroke="#fbbf24" strokeWidth="2"/>
      <circle cx="90" cy="48" r="3" fill="#fbbf24"/>
      {/* Mano apuntando abajo */}
      <line x1="35" y1="65" x2="32" y2="80" stroke="#e2c4ff" strokeWidth="1.5"/>
      {/* Piernas */}
      <line x1="60" y1="105" x2="45" y2="130" stroke="#e2c4ff" strokeWidth="1.5"/>
      <line x1="60" y1="105" x2="75" y2="130" stroke="#e2c4ff" strokeWidth="1.5"/>
      {/* Mesa con herramientas */}
      <rect x="20" y="100" width="80" height="5" fill="none" stroke="#c084fc" strokeWidth="1"/>
      <line x1="20" y1="105" x2="20" y2="120" stroke="#c084fc" strokeWidth="1"/>
      <line x1="100" y1="105" x2="100" y2="120" stroke="#c084fc" strokeWidth="1"/>
      {/* Símbolos sobre la mesa */}
      <text x="28" y="98" fill="#fbbf24" fontSize="8">⚱</text>
      <text x="45" y="98" fill="#fbbf24" fontSize="8">✦</text>
      <text x="62" y="98" fill="#fbbf24" fontSize="8">⚔</text>
      <text x="79" y="98" fill="#fbbf24" fontSize="8">⊕</text>
      {/* Rosas */}
      <circle cx="20" cy="125" r="4" fill="none" stroke="#f472b6" strokeWidth="1"/>
      <circle cx="100" cy="125" r="4" fill="none" stroke="#f472b6" strokeWidth="1"/>
      <text x="60" y="175" textAnchor="middle" fill="#c084fc" fontSize="9" fontFamily="serif">I</text>
      <text x="60" y="188" textAnchor="middle" fill="#9ca3af" fontSize="7" fontFamily="serif">EL MAGO</text>
    </svg>
  ),

  'La Sacerdotisa': (
    <svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="120" height="200" fill="#1a0f2e" rx="8"/>
      <rect x="4" y="4" width="112" height="192" fill="none" stroke="#c084fc" strokeWidth="1" rx="6"/>
      <rect x="8" y="8" width="104" height="184" fill="none" stroke="#7c3aed" strokeWidth="0.5" rx="4" strokeDasharray="3 3"/>
      {/* Luna sobre la cabeza */}
      <path d="M50 22 Q60 15 70 22 Q60 30 50 22" fill="#c0c0c0" stroke="#c0c0c0" strokeWidth="1"/>
      <circle cx="60" cy="22" r="8" fill="none" stroke="#c0c0c0" strokeWidth="1.5"/>
      {/* Columnas */}
      <rect x="15" y="45" width="8" height="90" fill="none" stroke="#7c3aed" strokeWidth="1.5"/>
      <text x="19" y="42" textAnchor="middle" fill="#c084fc" fontSize="7">B</text>
      <rect x="97" y="45" width="8" height="90" fill="none" stroke="#e2c4ff" strokeWidth="1.5"/>
      <text x="101" y="42" textAnchor="middle" fill="#e2c4ff" fontSize="7">J</text>
      {/* Figura de la Sacerdotisa */}
      <circle cx="60" cy="55" r="9" fill="none" stroke="#e2c4ff" strokeWidth="1.5"/>
      {/* Corona triple */}
      <path d="M51 48 L51 42 L55 46 L60 40 L65 46 L69 42 L69 48" fill="none" stroke="#c0c0c0" strokeWidth="1"/>
      {/* Manto */}
      <path d="M51 64 Q35 90 30 135 L90 135 Q85 90 69 64" fill="none" stroke="#3b82f6" strokeWidth="1.5"/>
      {/* Cruz en el pecho */}
      <line x1="60" y1="68" x2="60" y2="80" stroke="#fbbf24" strokeWidth="1.5"/>
      <line x1="54" y1="74" x2="66" y2="74" stroke="#fbbf24" strokeWidth="1.5"/>
      {/* Pergamino */}
      <rect x="48" y="82" width="24" height="35" fill="none" stroke="#e2c4ff" strokeWidth="1"/>
      <text x="60" y="93" textAnchor="middle" fill="#c084fc" fontSize="6" fontFamily="serif">TORA</text>
      <line x1="51" y1="98" x2="69" y2="98" stroke="#7c3aed" strokeWidth="0.5"/>
      <line x1="51" y1="103" x2="69" y2="103" stroke="#7c3aed" strokeWidth="0.5"/>
      {/* Velo */}
      <path d="M23 45 Q60 65 97 45" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 2"/>
      <text x="60" y="175" textAnchor="middle" fill="#c084fc" fontSize="9" fontFamily="serif">II</text>
      <text x="60" y="188" textAnchor="middle" fill="#9ca3af" fontSize="6" fontFamily="serif">LA SACERDOTISA</text>
    </svg>
  ),

  'La Emperatriz': (
    <svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="120" height="200" fill="#1a0f2e" rx="8"/>
      <rect x="4" y="4" width="112" height="192" fill="none" stroke="#c084fc" strokeWidth="1" rx="6"/>
      <rect x="8" y="8" width="104" height="184" fill="none" stroke="#7c3aed" strokeWidth="0.5" rx="4" strokeDasharray="3 3"/>
      {/* Estrellas en la corona */}
      {[...Array(12)].map((_, i) => (
        <circle key={i} cx={40 + i * 4} cy={22} r="1.5" fill="#fbbf24"/>
      ))}
      {/* Corona */}
      <path d="M38 28 L38 20 L45 24 L52 18 L60 22 L68 18 L75 24 L82 20 L82 28" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
      {/* Figura */}
      <circle cx="60" cy="50" r="9" fill="none" stroke="#e2c4ff" strokeWidth="1.5"/>
      {/* Manto amplio */}
      <path d="M51 59 Q30 85 25 130 L95 130 Q90 85 69 59" fill="none" stroke="#22c55e" strokeWidth="1.5"/>
      {/* Símbolo Venus en el escudo */}
      <circle cx="60" cy="90" r="12" fill="none" stroke="#f472b6" strokeWidth="1.5"/>
      <line x1="60" y1="102" x2="60" y2="112" stroke="#f472b6" strokeWidth="1.5"/>
      <line x1="54" y1="107" x2="66" y2="107" stroke="#f472b6" strokeWidth="1.5"/>
      {/* Cetro */}
      <line x1="82" y1="130" x2="95" y2="60" stroke="#fbbf24" strokeWidth="2"/>
      <circle cx="95" cy="58" r="4" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
      {/* Naturaleza */}
      <path d="M15 130 Q30 115 45 125 Q60 110 75 120 Q90 108 105 125 L105 145 L15 145 Z" fill="none" stroke="#22c55e" strokeWidth="1"/>
      <circle cx="25" cy="125" r="5" fill="none" stroke="#22c55e" strokeWidth="1"/>
      <circle cx="50" cy="118" r="4" fill="none" stroke="#22c55e" strokeWidth="1"/>
      <circle cx="80" cy="122" r="5" fill="none" stroke="#22c55e" strokeWidth="1"/>
      <text x="60" y="175" textAnchor="middle" fill="#c084fc" fontSize="9" fontFamily="serif">III</text>
      <text x="60" y="188" textAnchor="middle" fill="#9ca3af" fontSize="6" fontFamily="serif">LA EMPERATRIZ</text>
    </svg>
  ),

  'El Emperador': (
    <svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="120" height="200" fill="#1a0f2e" rx="8"/>
      <rect x="4" y="4" width="112" height="192" fill="none" stroke="#c084fc" strokeWidth="1" rx="6"/>
      <rect x="8" y="8" width="104" height="184" fill="none" stroke="#7c3aed" strokeWidth="0.5" rx="4" strokeDasharray="3 3"/>
      {/* Trono */}
      <rect x="25" y="45" width="70" height="90" fill="none" stroke="#ef4444" strokeWidth="1.5"/>
      <path d="M25 45 L25 30 L35 38 L45 28 L55 38 L65 28 L75 38 L85 28 L95 38 L95 45" fill="none" stroke="#ef4444" strokeWidth="1.5"/>
      {/* Carneros en el trono */}
      <path d="M25 55 Q15 60 20 70 Q25 65 30 70" fill="none" stroke="#c0c0c0" strokeWidth="1"/>
      <path d="M95 55 Q105 60 100 70 Q95 65 90 70" fill="none" stroke="#c0c0c0" strokeWidth="1"/>
      {/* Figura sentada */}
      <circle cx="60" cy="60" r="9" fill="none" stroke="#e2c4ff" strokeWidth="1.5"/>
      {/* Corona */}
      <path d="M51 53 L51 45 L55 49 L60 43 L65 49 L69 45 L69 53" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
      {/* Cuerpo con armadura */}
      <path d="M51 69 L51 105 L69 105 L69 69" fill="none" stroke="#c0c0c0" strokeWidth="1.5"/>
      {/* Piernas cruzadas */}
      <line x1="51" y1="105" x2="40" y2="130" stroke="#e2c4ff" strokeWidth="1.5"/>
      <line x1="69" y1="105" x2="80" y2="130" stroke="#e2c4ff" strokeWidth="1.5"/>
      <line x1="40" y1="130" x2="80" y2="130" stroke="#e2c4ff" strokeWidth="1"/>
      {/* Cetro Ankh */}
      <line x1="85" y1="130" x2="85" y2="75" stroke="#fbbf24" strokeWidth="2"/>
      <circle cx="85" cy="72" r="5" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
      <line x1="79" y1="78" x2="91" y2="78" stroke="#fbbf24" strokeWidth="1.5"/>
      {/* Orbe */}
      <circle cx="35" cy="90" r="8" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
      <line x1="35" y1="82" x2="35" y2="98" stroke="#fbbf24" strokeWidth="1"/>
      <line x1="27" y1="90" x2="43" y2="90" stroke="#fbbf24" strokeWidth="1"/>
      <text x="60" y="175" textAnchor="middle" fill="#c084fc" fontSize="9" fontFamily="serif">IV</text>
      <text x="60" y="188" textAnchor="middle" fill="#9ca3af" fontSize="6" fontFamily="serif">EL EMPERADOR</text>
    </svg>
  ),

  'Los Amantes': (
    <svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="120" height="200" fill="#1a0f2e" rx="8"/>
      <rect x="4" y="4" width="112" height="192" fill="none" stroke="#c084fc" strokeWidth="1" rx="6"/>
      <rect x="8" y="8" width="104" height="184" fill="none" stroke="#7c3aed" strokeWidth="0.5" rx="4" strokeDasharray="3 3"/>
      {/* Sol radiante */}
      <circle cx="60" cy="28" r="14" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30) * Math.PI / 180
        return <line key={i} x1={60 + 14 * Math.cos(angle)} y1={28 + 14 * Math.sin(angle)} x2={60 + 19 * Math.cos(angle)} y2={28 + 19 * Math.sin(angle)} stroke="#fbbf24" strokeWidth="1"/>
      })}
      {/* Ángel */}
      <circle cx="60" cy="50" r="7" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
      <path d="M53 57 Q60 70 67 57" fill="none" stroke="#fbbf24" strokeWidth="1"/>
      <path d="M45 55 Q50 48 55 55" fill="none" stroke="#fbbf24" strokeWidth="1"/>
      <path d="M65 55 Q70 48 75 55" fill="none" stroke="#fbbf24" strokeWidth="1"/>
      {/* Figura masculina */}
      <circle cx="40" cy="100" r="7" fill="none" stroke="#e2c4ff" strokeWidth="1.5"/>
      <line x1="40" y1="107" x2="40" y2="135" stroke="#e2c4ff" strokeWidth="1.5"/>
      <line x1="40" y1="118" x2="28" y2="128" stroke="#e2c4ff" strokeWidth="1.5"/>
      <line x1="40" y1="118" x2="52" y2="125" stroke="#e2c4ff" strokeWidth="1.5"/>
      <line x1="40" y1="135" x2="32" y2="148" stroke="#e2c4ff" strokeWidth="1.5"/>
      <line x1="40" y1="135" x2="48" y2="148" stroke="#e2c4ff" strokeWidth="1.5"/>
      {/* Montaña detrás */}
      <path d="M28 148 L40 120 L52 148" fill="none" stroke="#6d28d9" strokeWidth="1"/>
      {/* Figura femenina */}
      <circle cx="80" cy="100" r="7" fill="none" stroke="#f9a8d4" strokeWidth="1.5"/>
      <path d="M73 109 Q65 125 68 148 L92 148 Q95 125 87 109" fill="none" stroke="#f9a8d4" strokeWidth="1.5"/>
      <line x1="73" y1="120" x2="62" y2="125" stroke="#f9a8d4" strokeWidth="1.5"/>
      <line x1="87" y1="120" x2="98" y2="125" stroke="#f9a8d4" strokeWidth="1.5"/>
      {/* Árbol del conocimiento */}
      <line x1="95" y1="148" x2="95" y2="110" stroke="#22c55e" strokeWidth="1.5"/>
      <circle cx="95" cy="105" r="8" fill="none" stroke="#22c55e" strokeWidth="1"/>
      {/* Serpiente */}
      <path d="M97 112 Q103 118 99 124 Q95 130 101 136 Q107 142 103 148" fill="none" stroke="#ef4444" strokeWidth="1.5"/>
      <text x="60" y="175" textAnchor="middle" fill="#c084fc" fontSize="9" fontFamily="serif">VI</text>
      <text x="60" y="188" textAnchor="middle" fill="#9ca3af" fontSize="6" fontFamily="serif">LOS AMANTES</text>
    </svg>
  ),

  'La Muerte': (
    <svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="120" height="200" fill="#1a0f2e" rx="8"/>
      <rect x="4" y="4" width="112" height="192" fill="none" stroke="#c084fc" strokeWidth="1" rx="6"/>
      <rect x="8" y="8" width="104" height="184" fill="none" stroke="#7c3aed" strokeWidth="0.5" rx="4" strokeDasharray="3 3"/>
      {/* Estandarte */}
      <line x1="60" y1="145" x2="60" y2="30" stroke="#e2c4ff" strokeWidth="2"/>
      <rect x="60" y="30" width="30" height="22" fill="none" stroke="#e2c4ff" strokeWidth="1.5"/>
      {/* Rosa blanca en estandarte */}
      <circle cx="75" cy="41" r="7" fill="none" stroke="#f9a8d4" strokeWidth="1.5"/>
      <circle cx="75" cy="41" r="3" fill="#f9a8d4"/>
      {/* Esqueleto en armadura */}
      <circle cx="45" cy="65" r="10" fill="none" stroke="#e2c4ff" strokeWidth="1.5"/>
      {/* Cuencas de ojos */}
      <circle cx="41" cy="63" r="2.5" fill="#1a0f2e" stroke="#e2c4ff" strokeWidth="0.5"/>
      <circle cx="49" cy="63" r="2.5" fill="#1a0f2e" stroke="#e2c4ff" strokeWidth="0.5"/>
      {/* Nariz */}
      <path d="M44 67 L45 70 L46 67" fill="none" stroke="#e2c4ff" strokeWidth="1"/>
      {/* Sonrisa ósea */}
      <path d="M40 72 L45 75 L50 72" fill="none" stroke="#e2c4ff" strokeWidth="1"/>
      {/* Armadura/cuerpo */}
      <path d="M35 75 L35 115 L55 115 L55 75" fill="none" stroke="#c0c0c0" strokeWidth="1.5"/>
      {/* Costillas */}
      <line x1="37" y1="82" x2="53" y2="82" stroke="#e2c4ff" strokeWidth="0.5"/>
      <line x1="37" y1="88" x2="53" y2="88" stroke="#e2c4ff" strokeWidth="0.5"/>
      <line x1="37" y1="94" x2="53" y2="94" stroke="#e2c4ff" strokeWidth="0.5"/>
      <line x1="37" y1="100" x2="53" y2="100" stroke="#e2c4ff" strokeWidth="0.5"/>
      {/* Guadaña */}
      <line x1="55" y1="115" x2="30" y2="55" stroke="#c0c0c0" strokeWidth="2"/>
      <path d="M30 55 Q15 65 25 80 Q35 70 30 55" fill="none" stroke="#c0c0c0" strokeWidth="1.5"/>
      {/* Figuras caídas */}
      <circle cx="20" cy="125" r="5" fill="none" stroke="#fbbf24" strokeWidth="1"/>
      <path d="M15 130 L25 130 L25 145 L15 145 Z" fill="none" stroke="#fbbf24" strokeWidth="1"/>
      {/* Sol entre montañas */}
      <path d="M15 148 L40 120 L60 148" fill="none" stroke="#6d28d9" strokeWidth="1"/>
      <path d="M60 148 L85 115 L105 148" fill="none" stroke="#6d28d9" strokeWidth="1"/>
      <circle cx="82" cy="145" r="8" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
      <text x="60" y="175" textAnchor="middle" fill="#c084fc" fontSize="9" fontFamily="serif">XIII</text>
      <text x="60" y="188" textAnchor="middle" fill="#9ca3af" fontSize="6" fontFamily="serif">LA MUERTE</text>
    </svg>
  ),

    'La Torre': (
    <svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="120" height="200" fill="#1a0f2e" rx="8"/>
      <rect x="4" y="4" width="112" height="192" fill="none" stroke="#c084fc" strokeWidth="1" rx="6"/>
      <rect x="8" y="8" width="104" height="184" fill="none" stroke="#7c3aed" strokeWidth="0.5" rx="4" strokeDasharray="3 3"/>
      {/* Torre */}
      <rect x="35" y="55" width="50" height="90" fill="none" stroke="#94a3b8" strokeWidth="2"/>
      {/* Almenas */}
      <rect x="35" y="45" width="10" height="12" fill="none" stroke="#94a3b8" strokeWidth="1.5"/>
      <rect x="50" y="45" width="10" height="12" fill="none" stroke="#94a3b8" strokeWidth="1.5"/>
      <rect x="65" y="45" width="10" height="12" fill="none" stroke="#94a3b8" strokeWidth="1.5"/>
      <rect x="75" y="45" width="10" height="12" fill="none" stroke="#94a3b8" strokeWidth="1.5"/>
      {/* Corona dorada en llamas */}
      <path d="M50 45 L55 30 L60 38 L65 25 L70 38 L75 30 L80 45" fill="none" stroke="#fbbf24" strokeWidth="2"/>
      {/* Ventanas */}
      <rect x="48" y="70" width="10" height="14" fill="none" stroke="#94a3b8" strokeWidth="1"/>
      <rect x="62" y="70" width="10" height="14" fill="none" stroke="#94a3b8" strokeWidth="1"/>
      <rect x="55" y="100" width="10" height="14" fill="none" stroke="#94a3b8" strokeWidth="1"/>
      {/* Puerta */}
      <path d="M50 145 L50 125 Q60 118 70 125 L70 145" fill="none" stroke="#94a3b8" strokeWidth="1.5"/>
      {/* Rayos */}
      <path d="M15 35 L40 55" stroke="#fbbf24" strokeWidth="2"/>
      <path d="M20 40 L35 35 L30 50" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
      <path d="M105 40 L80 55" stroke="#fbbf24" strokeWidth="2"/>
      {/* Figuras cayendo */}
      <circle cx="25" cy="70" r="5" fill="none" stroke="#e2c4ff" strokeWidth="1.5"/>
      <line x1="25" y1="75" x2="20" y2="95" stroke="#e2c4ff" strokeWidth="1.5"/>
      <line x1="25" y1="83" x2="15" y2="88" stroke="#e2c4ff" strokeWidth="1.5"/>
      <line x1="25" y1="83" x2="35" y2="88" stroke="#e2c4ff" strokeWidth="1.5"/>
      <circle cx="100" cy="75" r="5" fill="none" stroke="#f472b6" strokeWidth="1.5"/>
      <line x1="100" y1="80" x2="105" y2="100" stroke="#f472b6" strokeWidth="1.5"/>
      {/* Llamas */}
      <path d="M35 55 Q30 48 35 42 Q32 38 38 35" fill="none" stroke="#ef4444" strokeWidth="1.5"/>
      <path d="M85 55 Q90 48 85 42 Q88 38 82 35" fill="none" stroke="#ef4444" strokeWidth="1.5"/>
      {/* Chispas */}
      {[...Array(8)].map((_, i) => (
        <circle key={i} cx={20 + i * 11} cy={60 + (i % 3) * 15} r="1.5" fill="#fbbf24"/>
      ))}
      <text x="60" y="175" textAnchor="middle" fill="#c084fc" fontSize="9" fontFamily="serif">XVI</text>
      <text x="60" y="188" textAnchor="middle" fill="#9ca3af" fontSize="6" fontFamily="serif">LA TORRE</text>
    </svg>
  ),

  'La Estrella': (
    <svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="120" height="200" fill="#1a0f2e" rx="8"/>
      <rect x="4" y="4" width="112" height="192" fill="none" stroke="#c084fc" strokeWidth="1" rx="6"/>
      <rect x="8" y="8" width="104" height="184" fill="none" stroke="#7c3aed" strokeWidth="0.5" rx="4" strokeDasharray="3 3"/>
      {/* Estrella central grande */}
      <path d="M60 18 L63 28 L73 28 L65 34 L68 44 L60 38 L52 44 L55 34 L47 28 L57 28 Z" fill="#fbbf24" stroke="#fbbf24" strokeWidth="0.5"/>
      {/* Estrellas pequeñas */}
      {[[20,25],[100,25],[15,55],[105,55],[25,80],[100,75]].map(([x,y], i) => (
        <path key={i} d={`M${x} ${y-5} L${x+1.5} ${y-1.5} L${x+5} ${y-1.5} L${x+2.5} ${y+1} L${x+3.5} ${y+4.5} L${x} ${y+2.5} L${x-3.5} ${y+4.5} L${x-2.5} ${y+1} L${x-5} ${y-1.5} L${x-1.5} ${y-1.5} Z`} fill="#c0c0c0"/>
      ))}
      {/* Figura desnuda arrodillada */}
      <circle cx="60" cy="80" r="8" fill="none" stroke="#f9a8d4" strokeWidth="1.5"/>
      <line x1="60" y1="88" x2="60" y2="110" stroke="#f9a8d4" strokeWidth="1.5"/>
      {/* Brazos con jarras */}
      <line x1="60" y1="95" x2="35" y2="105" stroke="#f9a8d4" strokeWidth="1.5"/>
      <line x1="60" y1="95" x2="85" y2="95" stroke="#f9a8d4" strokeWidth="1.5"/>
      {/* Jarras */}
      <path d="M30 103 Q27 108 30 115 Q35 115 35 108 Q38 103 35 100 Q30 100 30 103" fill="none" stroke="#3b82f6" strokeWidth="1.5"/>
      <path d="M82 93 Q79 98 82 105 Q87 105 87 98 Q90 93 87 90 Q82 90 82 93" fill="none" stroke="#3b82f6" strokeWidth="1.5"/>
      {/* Agua vertiéndose */}
      <path d="M30 115 Q20 120 15 130" stroke="#3b82f6" strokeWidth="1.5"/>
      <path d="M87 105 Q90 115 88 130" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 1"/>
      {/* Rodillas */}
      <line x1="60" y1="110" x2="45" y2="130" stroke="#f9a8d4" strokeWidth="1.5"/>
      <line x1="60" y1="110" x2="70" y2="135" stroke="#f9a8d4" strokeWidth="1.5"/>
      {/* Lago */}
      <ellipse cx="45" cy="135" rx="30" ry="8" fill="none" stroke="#3b82f6" strokeWidth="1"/>
      {/* Árbol con pájaro */}
      <line x1="100" y1="148" x2="100" y2="110" stroke="#22c55e" strokeWidth="1.5"/>
      <path d="M100 115 Q108 108 115 115" fill="none" stroke="#22c55e" strokeWidth="1"/>
      <circle cx="110" cy="110" r="3" fill="none" stroke="#fbbf24" strokeWidth="1"/>
      <text x="60" y="175" textAnchor="middle" fill="#c084fc" fontSize="9" fontFamily="serif">XVII</text>
      <text x="60" y="188" textAnchor="middle" fill="#9ca3af" fontSize="6" fontFamily="serif">LA ESTRELLA</text>
    </svg>
  ),

  'El Sol': (
    <svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="120" height="200" fill="#1a0f2e" rx="8"/>
      <rect x="4" y="4" width="112" height="192" fill="none" stroke="#c084fc" strokeWidth="1" rx="6"/>
      <rect x="8" y="8" width="104" height="184" fill="none" stroke="#7c3aed" strokeWidth="0.5" rx="4" strokeDasharray="3 3"/>
      {/* Sol grande */}
      <circle cx="60" cy="45" r="28" fill="none" stroke="#fbbf24" strokeWidth="2"/>
      <circle cx="60" cy="45" r="20" fill="#fbbf24" opacity="0.3"/>
      {/* Rayos alternados */}
      {[...Array(16)].map((_, i) => {
        const angle = (i * 22.5) * Math.PI / 180
        const inner = i % 2 === 0 ? 28 : 32
        const outer = i % 2 === 0 ? 36 : 38
        return <line key={i}
          x1={60 + inner * Math.cos(angle)} y1={45 + inner * Math.sin(angle)}
          x2={60 + outer * Math.cos(angle)} y2={45 + outer * Math.sin(angle)}
          stroke="#fbbf24" strokeWidth={i % 2 === 0 ? 2 : 1}/>
      })}
      {/* Cara del sol */}
      <circle cx="55" cy="42" r="3" fill="#1a0f2e"/>
      <circle cx="65" cy="42" r="3" fill="#1a0f2e"/>
      <path d="M53 50 Q60 56 67 50" fill="none" stroke="#1a0f2e" strokeWidth="1.5"/>
      {/* Muro */}
      <rect x="15" y="120" width="90" height="25" fill="none" stroke="#c0c0c0" strokeWidth="1.5"/>
      {[...Array(6)].map((_, i) => (
        <line key={i} x1={15 + i * 15} y1={120} x2={15 + i * 15} y2={145} stroke="#c0c0c0" strokeWidth="0.5"/>
      ))}
      {[...Array(3)].map((_, i) => (
        <line key={i} x1={15} y1={120 + i * 8} x2={105} y2={120 + i * 8} stroke="#c0c0c0" strokeWidth="0.5"/>
      ))}
      {/* Niño en caballo */}
      <circle cx="55" cy="98" r="7" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
      {/* Cuerpo niño */}
      <line x1="55" y1="105" x2="55" y2="120" stroke="#fbbf24" strokeWidth="1.5"/>
      <line x1="55" y1="112" x2="45" y2="108" stroke="#fbbf24" strokeWidth="1.5"/>
      <line x1="55" y1="112" x2="65" y2="108" stroke="#fbbf24" strokeWidth="1.5"/>
      {/* Bandera */}
      <line x1="65" y1="108" x2="72" y2="90" stroke="#ef4444" strokeWidth="1.5"/>
      <path d="M72 90 L82 94 L72 98 Z" fill="#ef4444"/>
      {/* Caballo */}
      <path d="M35 120 Q40 108 55 115 Q70 108 80 120 Q85 125 80 130 L35 130 Q30 125 35 120" fill="none" stroke="#e2c4ff" strokeWidth="1.5"/>
      {/* Girasoles */}
      <circle cx="18" cy="118" r="5" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
      <circle cx="18" cy="118" r="2" fill="#fbbf24"/>
      <circle cx="102" cy="118" r="5" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
      <circle cx="102" cy="118" r="2" fill="#fbbf24"/>
      <text x="60" y="175" textAnchor="middle" fill="#c084fc" fontSize="9" fontFamily="serif">XIX</text>
      <text x="60" y="188" textAnchor="middle" fill="#9ca3af" fontSize="6" fontFamily="serif">EL SOL</text>
    </svg>
  ),

  'El Mundo': (
    <svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="120" height="200" fill="#1a0f2e" rx="8"/>
      <rect x="4" y="4" width="112" height="192" fill="none" stroke="#c084fc" strokeWidth="1" rx="6"/>
      <rect x="8" y="8" width="104" height="184" fill="none" stroke="#7c3aed" strokeWidth="0.5" rx="4" strokeDasharray="3 3"/>
      {/* Corona de laurel ovalada */}
      <ellipse cx="60" cy="85" rx="40" ry="65" fill="none" stroke="#22c55e" strokeWidth="2"/>
      {/* Hojas del laurel */}
      {[...Array(14)].map((_, i) => {
        const angle = (i * 25.7) * Math.PI / 180
        const x = 60 + 40 * Math.cos(angle - Math.PI/2)
        const y = 85 + 65 * Math.sin(angle - Math.PI/2)
        return <ellipse key={i} cx={x} cy={y} rx="4" ry="2" fill="none" stroke="#22c55e" strokeWidth="1" transform={`rotate(${i * 25.7 - 90}, ${x}, ${y})`}/>
      })}
      {/* Figura central danzando */}
      <circle cx="60" cy="72" r="8" fill="none" stroke="#f9a8d4" strokeWidth="1.5"/>
      <line x1="60" y1="80" x2="60" y2="108" stroke="#f9a8d4" strokeWidth="1.5"/>
      {/* Brazos extendidos con varitas */}
      <line x1="60" y1="90" x2="40" y2="80" stroke="#f9a8d4" strokeWidth="1.5"/>
      <line x1="60" y1="90" x2="80" y2="80" stroke="#f9a8d4" strokeWidth="1.5"/>
      <line x1="40" y1="80" x2="35" y2="72" stroke="#fbbf24" strokeWidth="2"/>
      <line x1="80" y1="80" x2="85" y2="72" stroke="#fbbf24" strokeWidth="2"/>
      {/* Piernas cruzadas */}
      <line x1="60" y1="108" x2="48" y2="125" stroke="#f9a8d4" strokeWidth="1.5"/>
      <line x1="60" y1="108" x2="72" y2="120" stroke="#f9a8d4" strokeWidth="1.5"/>
      {/* Manto */}
      <path d="M52 82 Q45 95 48 108" fill="none" stroke="#7c3aed" strokeWidth="2"/>
      {/* 4 criaturas en las esquinas */}
      {/* Ángel */}
      <circle cx="18" cy="28" r="6" fill="none" stroke="#e2c4ff" strokeWidth="1"/>
      <path d="M12 34 Q18 42 24 34" fill="none" stroke="#e2c4ff" strokeWidth="1"/>
      {/* Águila */}
      <path d="M96 22 Q102 28 108 22 Q102 18 96 22" fill="none" stroke="#e2c4ff" strokeWidth="1"/>
      <line x1="102" y1="28" x2="102" y2="38" stroke="#e2c4ff" strokeWidth="1"/>
      {/* León */}
      <circle cx="18" cy="148" r="7" fill="none" stroke="#fbbf24" strokeWidth="1"/>
      <path d="M11 148 Q14 155 18 148" fill="none" stroke="#fbbf24" strokeWidth="1"/>
      {/* Toro */}
      <circle cx="102" cy="148" r="6" fill="none" stroke="#c0c0c0" strokeWidth="1"/>
      <path d="M96 143 Q99 138 102 143 Q105 138 108 143" fill="none" stroke="#c0c0c0" strokeWidth="1"/>
      <text x="60" y="175" textAnchor="middle" fill="#c084fc" fontSize="9" fontFamily="serif">XXI</text>
      <text x="60" y="188" textAnchor="middle" fill="#9ca3af" fontSize="6" fontFamily="serif">EL MUNDO</text>
    </svg>
  ),
}

export function getCartaSVG(nombreCarta: string): JSX.Element {
  return ARCANOS_SVG[nombreCarta] || getCartaGenerica(nombreCarta)
}

function getCartaGenerica(nombre: string): JSX.Element {
  return (
    <svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="120" height="200" fill="#1a0f2e" rx="8"/>
      <rect x="4" y="4" width="112" height="192" fill="none" stroke="#c084fc" strokeWidth="1" rx="6"/>
      <rect x="8" y="8" width="104" height="184" fill="none" stroke="#7c3aed" strokeWidth="0.5" rx="4" strokeDasharray="3 3"/>
      <circle cx="60" cy="75" r="30" fill="none" stroke="#c084fc" strokeWidth="1.5"/>
      <circle cx="60" cy="75" r="20" fill="none" stroke="#7c3aed" strokeWidth="1"/>
      <circle cx="60" cy="75" r="10" fill="none" stroke="#c084fc" strokeWidth="1"/>
      <path d="M60 45 L60 105 M30 75 L90 75" stroke="#7c3aed" strokeWidth="1"/>
      <path d="M38.8 53.8 L81.2 96.2 M81.2 53.8 L38.8 96.2" stroke="#7c3aed" strokeWidth="0.5"/>
      <circle cx="60" cy="75" r="4" fill="#c084fc"/>
      <text x="60" y="135" textAnchor="middle" fill="#c084fc" fontSize="8" fontFamily="serif">{nombre}</text>
    </svg>
  )
}