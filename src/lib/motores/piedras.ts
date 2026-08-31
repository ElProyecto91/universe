export const PIEDRAS = [
  { nombre: 'Amatista', color: '#9b59b6', hex: '#9b59b6', keywords: 'Intuición · Espiritualidad · Calma', significado: 'La amatista abre la percepción espiritual y calma la mente agitada. Su presencia indica que es momento de confiar en la intuición más que en la lógica.' },
  { nombre: 'Cuarzo Rosa', color: '#f4a7b9', hex: '#f4a7b9', keywords: 'Amor · Compasión · Sanación', significado: 'El cuarzo rosa es la piedra del amor incondicional. Su aparición habla de relaciones, de apertura del corazón y de la necesidad de tratarse con más compasión.' },
  { nombre: 'Obsidiana', color: '#2c2c2c', hex: '#2c2c2c', keywords: 'Protección · Verdad · Sombra', significado: 'La obsidiana es un espejo negro que revela lo que preferimos no ver. Su presencia pide honestidad radical y protección contra energías que nos drenan.' },
  { nombre: 'Citrino', color: '#f1c40f', hex: '#f1c40f', keywords: 'Abundancia · Claridad · Acción', significado: 'El citrino es la piedra del sol y la manifestación. Su presencia indica energía disponible para crear, actuar y atraer lo que deseas.' },
  { nombre: 'Lapislázuli', color: '#1a5276', hex: '#1a5276', keywords: 'Sabiduría · Verdad · Comunicación', significado: 'El lapislázuli fue sagrado en Egipto y Mesopotamia. Su presencia pide hablar con verdad, buscar conocimiento más profundo y conectar con la sabiduría interior.' },
  { nombre: 'Cornalina', color: '#e74c3c', hex: '#e74c3c', keywords: 'Valentía · Vitalidad · Creatividad', significado: 'La cornalina enciende el fuego de la acción y la creatividad. Su presencia indica que es momento de moverse, de tomar iniciativa y de confiar en tu propia fuerza.' },
  { nombre: 'Cuarzo Transparente', color: '#ecf0f1', hex: '#bdc3c7', keywords: 'Claridad · Amplificación · Pureza', significado: 'El cuarzo transparente amplifica todo lo que toca. Su presencia pide claridad de intención — lo que piensas y sientes con fuerza se expande.' },
  { nombre: 'Malaquita', color: '#27ae60', hex: '#27ae60', keywords: 'Transformación · Crecimiento · Cambio', significado: 'La malaquita es la piedra de la transformación profunda. Su presencia indica que un cambio significativo está en marcha, aunque pueda ser incómodo.' },
  { nombre: 'Turmalina Negra', color: '#1c1c1c', hex: '#34495e', keywords: 'Protección · Enraizamiento · Límites', significado: 'La turmalina negra es el escudo más poderoso. Su presencia pide establecer límites claros y enraizarse en lo que realmente importa.' },
  { nombre: 'Piedra Luna', color: '#d6eaf8', hex: '#aed6f1', keywords: 'Ciclos · Intuición · Feminidad', significado: 'La piedra luna conecta con los ciclos lunares y la intuición profunda. Su presencia habla de transiciones, de fluir con los cambios y de honrar los ritmos naturales.' },
  { nombre: 'Ojo de Tigre', color: '#d4a017', hex: '#d4a017', keywords: 'Enfoque · Determinación · Equilibrio', significado: 'El ojo de tigre combina la energía solar del sol con la firmeza de la tierra. Su presencia pide enfoque, determinación y no dejarse llevar por el miedo.' },
  { nombre: 'Aguamarina', color: '#7fb3d3', hex: '#7fb3d3', keywords: 'Calma · Comunicación · Claridad emocional', significado: 'La aguamarina es agua pura y serena. Su presencia invita a la calma en medio de la tormenta emocional y a comunicar con claridad lo que sientes.' },
]

export function seleccionarPiedras(cantidad: number) {
  const mezcladas = [...PIEDRAS].sort(() => Math.random() - 0.5)
  return mezcladas.slice(0, cantidad).map(p => ({
    ...p,
    posicion: { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 },
    tamaño: Math.random() * 20 + 15,
  }))
}