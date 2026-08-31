export const ARCANOS_MAYORES = [
  { nombre: 'El Loco', numero: '0', keywords: 'Inicio · Libertad · Potencial infinito', mensaje: 'Hoy el universo te invita a dar un salto de fe. La incertidumbre es el territorio de lo posible.' },
  { nombre: 'El Mago', numero: 'I', keywords: 'Voluntad · Poder · Manifestación', mensaje: 'Tienes todas las herramientas. La pregunta no es si puedes, sino si te atreves a intentarlo.' },
  { nombre: 'La Sacerdotisa', numero: 'II', keywords: 'Intuición · Misterio · Sabiduría interior', mensaje: 'Tu intuición sabe más de lo que tu mente acepta. Escucha el silencio.' },
  { nombre: 'La Emperatriz', numero: 'III', keywords: 'Abundancia · Creatividad · Fertilidad', mensaje: 'Es tiempo de crear, nutrir y florecer. La abundancia está disponible para ti.' },
  { nombre: 'El Emperador', numero: 'IV', keywords: 'Autoridad · Estructura · Protección', mensaje: 'Establece una estructura sólida. El orden interior crea claridad exterior.' },
  { nombre: 'El Sumo Sacerdote', numero: 'V', keywords: 'Tradición · Guía · Sabiduría', mensaje: 'Busca la guía de alguien con experiencia. La tradición tiene sabiduría que merece ser escuchada.' },
  { nombre: 'Los Amantes', numero: 'VI', keywords: 'Unión · Elección · Valores', mensaje: 'Una decisión importante ante ti. Elige desde tus valores más profundos, no desde el miedo.' },
  { nombre: 'El Carro', numero: 'VII', keywords: 'Determinación · Victoria · Voluntad', mensaje: 'La voluntad y la determinación son tus aliadas hoy. Mantén el rumbo.' },
  { nombre: 'La Fuerza', numero: 'VIII', keywords: 'Coraje · Paciencia · Compasión', mensaje: 'La verdadera fuerza no es violencia sino presencia compasiva. Domina desde el amor.' },
  { nombre: 'El Ermitaño', numero: 'IX', keywords: 'Soledad · Reflexión · Sabiduría', mensaje: 'Un momento de retiro y reflexión te dará más claridad que mil conversaciones.' },
  { nombre: 'La Rueda de la Fortuna', numero: 'X', keywords: 'Ciclos · Cambio · Destino', mensaje: 'La rueda gira. Lo que sube baja, lo que baja sube. Confía en el ciclo.' },
  { nombre: 'La Justicia', numero: 'XI', keywords: 'Equilibrio · Verdad · Causa y efecto', mensaje: 'Cada acción tiene su consecuencia. Actúa con integridad y la balanza se equilibrará.' },
  { nombre: 'El Colgado', numero: 'XII', keywords: 'Pausa · Sacrificio · Nueva perspectiva', mensaje: 'Cambia tu perspectiva. Lo que parece una limitación puede ser una liberación.' },
  { nombre: 'La Muerte', numero: 'XIII', keywords: 'Transformación · Fin de ciclo · Renacimiento', mensaje: 'Algo llega a su fin para que algo nuevo pueda nacer. No temas la transformación.' },
  { nombre: 'La Templanza', numero: 'XIV', keywords: 'Equilibrio · Paciencia · Propósito', mensaje: 'Encuentra el punto medio. Ni demasiado ni demasiado poco. El equilibrio es sabiduría.' },
  { nombre: 'El Diablo', numero: 'XV', keywords: 'Ataduras · Sombra · Materialismo', mensaje: '¿Qué te tiene encadenado? El primer paso hacia la libertad es reconocer la cadena.' },
  { nombre: 'La Torre', numero: 'XVI', keywords: 'Ruptura · Revelación · Cambio radical', mensaje: 'Lo que se derrumba no merecía durar. La destrucción necesaria precede a la creación verdadera.' },
  { nombre: 'La Estrella', numero: 'XVII', keywords: 'Esperanza · Inspiración · Renovación', mensaje: 'Después de la tormenta, la estrella guía. Mantén la esperanza como un faro.' },
  { nombre: 'La Luna', numero: 'XVIII', keywords: 'Ilusión · Inconsciente · Miedos', mensaje: 'No todo es lo que parece. Presta atención a tus sueños y a lo que se mueve en las sombras.' },
  { nombre: 'El Sol', numero: 'XIX', keywords: 'Alegría · Claridad · Éxito', mensaje: 'Un día de claridad, alegría y éxito. Comparte tu luz con quienes te rodean.' },
  { nombre: 'El Juicio', numero: 'XX', keywords: 'Despertar · Absolución · Llamada', mensaje: 'Algo te llama a despertar. Es tiempo de responder a tu vocación más profunda.' },
  { nombre: 'El Mundo', numero: 'XXI', keywords: 'Plenitud · Completitud · Integración', mensaje: 'Un ciclo se completa en plenitud. Celebra lo recorrido y prepárate para el siguiente viaje.' },
]

export function getCartaDiaria(): typeof ARCANOS_MAYORES[0] {
  const hoy = new Date()
  const semilla = hoy.getFullYear() * 10000 + (hoy.getMonth() + 1) * 100 + hoy.getDate()
  const idx = semilla % ARCANOS_MAYORES.length
  return ARCANOS_MAYORES[idx]
}

export function getCartaDiariaSVG(numero: string): JSX.Element {
  return (
    <svg viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-48">
      <rect x="2" y="2" width="116" height="176" rx="12" stroke="#8b5cf6" strokeWidth="2" fill="rgba(139,92,246,0.1)"/>
      <rect x="8" y="8" width="104" height="164" rx="8" stroke="#8b5cf6" strokeWidth="0.5" fill="none" strokeDasharray="4 4"/>
      <circle cx="60" cy="75" r="28" stroke="#c084fc" strokeWidth="1.5" fill="none"/>
      <path d="M60 20 L60 130 M20 75 L100 75" stroke="#7c3aed" strokeWidth="0.5" strokeLinecap="round"/>
      <path d="M38 53 L82 97 M82 53 L38 97" stroke="#7c3aed" strokeWidth="0.5" strokeLinecap="round"/>
      <circle cx="60" cy="75" r="6" fill="#8b5cf6"/>
      <text x="60" y="130" textAnchor="middle" fill="#c084fc" fontSize="10" fontFamily="serif">{numero}</text>
      <path d="M30 145 L90 145" stroke="#8b5cf6" strokeWidth="0.5"/>
      <circle cx="30" cy="155" r="3" fill="#8b5cf6" opacity="0.4"/>
      <circle cx="60" cy="158" r="3" fill="#8b5cf6" opacity="0.6"/>
      <circle cx="90" cy="155" r="3" fill="#8b5cf6" opacity="0.4"/>
    </svg>
  )
}