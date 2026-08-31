export function SimboloZodiaco({ signo }: { signo: string }) {
  const paths: Record<string, JSX.Element> = {
    Aries: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
        <path d="M50 70 C50 70 50 40 50 30 M50 30 C50 20 35 10 25 20 C15 30 20 45 35 40 M50 30 C50 20 65 10 75 20 C85 30 80 45 65 40" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
    Tauro: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
        <circle cx="50" cy="60" r="25" stroke="currentColor" strokeWidth="4"/>
        <path d="M25 45 C25 35 35 25 50 25 C65 25 75 35 75 45" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path d="M25 45 C20 40 15 32 20 28" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path d="M75 45 C80 40 85 32 80 28" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
    Géminis: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
        <path d="M30 20 L70 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path d="M30 80 L70 80" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path d="M35 20 C30 35 30 65 35 80" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path d="M65 20 C70 35 70 65 65 80" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
    Cáncer: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
        <path d="M20 45 C20 30 35 25 50 35 C65 45 65 55 50 65 C35 75 20 70 20 55" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none"/>
        <path d="M80 55 C80 70 65 75 50 65 C35 55 35 45 50 35 C65 25 80 30 80 45" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none"/>
        <circle cx="18" cy="50" r="4" fill="currentColor"/>
        <circle cx="82" cy="50" r="4" fill="currentColor"/>
      </svg>
    ),
    Leo: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
        <path d="M25 35 C25 20 40 15 50 25 C55 30 55 38 50 43 L50 55" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="50" cy="68" r="13" stroke="currentColor" strokeWidth="4"/>
        <circle cx="28" cy="32" r="8" stroke="currentColor" strokeWidth="4"/>
      </svg>
    ),
    Virgo: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
        <path d="M25 25 L25 65" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path d="M50 25 L50 65" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path d="M25 25 C25 15 50 15 50 25" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path d="M50 45 C50 35 75 35 75 45 C75 55 65 60 55 65 C52 67 50 70 50 75 L50 80" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
    Libra: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
        <path d="M20 70 L80 70" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path d="M50 70 L50 40" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path d="M20 55 L80 55" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path d="M30 55 C30 45 40 38 50 38 C60 38 70 45 70 55" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
    Escorpio: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
        <path d="M20 25 L20 65" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path d="M45 25 L45 65" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path d="M20 25 C20 15 45 15 45 25" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path d="M45 45 C45 35 70 35 70 50 L70 65 L80 55 M70 65 L60 55" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    Sagitario: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
        <path d="M25 75 L75 25" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path d="M50 25 L75 25 L75 50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 55 L45 80" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
    Capricornio: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
        <path d="M20 25 L20 65 C20 75 30 80 40 75" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path d="M20 25 C20 15 35 15 40 25 C45 35 35 45 25 40" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path d="M45 50 C45 38 75 35 75 50 C75 62 60 68 50 75 C47 77 45 80 48 83" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
    Acuario: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
        <path d="M20 40 C30 30 40 50 50 40 C60 30 70 50 80 40" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path d="M20 60 C30 50 40 70 50 60 C60 50 70 70 80 60" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
    Piscis: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
        <path d="M50 20 L50 80" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path d="M20 50 L80 50" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path d="M50 20 C35 25 20 35 20 50 C20 65 35 75 50 80" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path d="M50 20 C65 25 80 35 80 50 C80 65 65 75 50 80" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
  }

  return (
    <div className="text-white">
      {paths[signo] || paths['Leo']}
    </div>
  )
}

export function SimboloElemento({ elemento }: { elemento: string }) {
  const simbolos: Record<string, JSX.Element> = {
    Fuego: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
        <path d="M20 5 L35 32 L5 32 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
      </svg>
    ),
    Agua: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
        <path d="M20 35 L35 8 L5 8 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
      </svg>
    ),
    Tierra: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
        <path d="M20 35 L35 8 L5 8 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
        <path d="M10 28 L30 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
    Aire: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
        <path d="M20 5 L35 32 L5 32 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
        <path d="M10 18 L30 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  }

  return (
    <div className="text-purple-300">
      {simbolos[elemento] || simbolos['Fuego']}
    </div>
  )
}