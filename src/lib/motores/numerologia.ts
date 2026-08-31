export const SIGNIFICADOS_NUMEROLOGICOS: Record<number, { titulo: string; descripcion: string; sombra: string; fortalezas: string }> = {
  1: { titulo: 'El Líder', descripcion: 'Tienes una energía pionera y autónoma. Naciste para abrir caminos y liderar con tu propio ejemplo. La originalidad y la independencia son tus sellos.', sombra: 'Tendencia al egocentrismo y la terquedad cuando no se reconoce tu liderazgo.', fortalezas: 'Iniciativa · Valentía · Originalidad · Determinación' },
  2: { titulo: 'El Diplomático', descripcion: 'Tu energía es sensible, cooperativa y profundamente intuitiva. Percibes lo que otros no ven y tienes el don de armonizar situaciones y relaciones.', sombra: 'Tendencia a la dependencia emocional y la indecisión cuando buscas aprobación externa.', fortalezas: 'Intuición · Cooperación · Paciencia · Empatía' },
  3: { titulo: 'El Creador', descripcion: 'La creatividad, la expresión y la alegría son tu esencia. Tienes el don de comunicar ideas de manera brillante y de inspirar a quienes te rodean.', sombra: 'Dispersión de energía y superficialidad cuando no canalizas tu creatividad.', fortalezas: 'Creatividad · Expresión · Optimismo · Carisma' },
  4: { titulo: 'El Constructor', descripcion: 'Eres el arquitecto de la realidad. Tu energía es disciplinada, metódica y profundamente comprometida con construir algo duradero y sólido.', sombra: 'Rigidez, resistencia al cambio y exceso de trabajo cuando pierdes el equilibrio.', fortalezas: 'Disciplina · Constancia · Lealtad · Practicidad' },
  5: { titulo: 'El Aventurero', descripcion: 'La libertad, el cambio y la experiencia directa son tu motor. Tienes una mente ágil y adaptable que necesita variedad para florecer.', sombra: 'Impulsividad, irresponsabilidad y miedo al compromiso cuando la libertad se convierte en huida.', fortalezas: 'Adaptabilidad · Libertad · Versatilidad · Curiosidad' },
  6: { titulo: 'El Sanador', descripcion: 'Tu energía está orientada al amor, el cuidado y la responsabilidad. Tienes un profundo sentido del deber hacia las personas que amas y hacia tu comunidad.', sombra: 'Perfeccionismo, control y mártir cuando el cuidado se convierte en sacrificio no solicitado.', fortalezas: 'Amor · Responsabilidad · Sanación · Belleza' },
  7: { titulo: 'El Buscador', descripcion: 'Tu alma busca la verdad más profunda. Eres analítico, introspectivo y espiritualmente orientado. El conocimiento y la sabiduría son tu camino.', sombra: 'Aislamiento, desconfianza y cinismo cuando la búsqueda interior se cierra al mundo.', fortalezas: 'Sabiduría · Análisis · Espiritualidad · Intuición' },
  8: { titulo: 'El Ejecutivo', descripcion: 'Tienes el poder de manifestar en el mundo material. Tu energía es ambiciosa, ejecutiva y magnética. Comprendes instintivamente cómo funciona el poder.', sombra: 'Materialismo, control y abuso de poder cuando el éxito se convierte en el único fin.', fortalezas: 'Poder · Abundancia · Liderazgo · Visión' },
  9: { titulo: 'El Sabio Universal', descripcion: 'Eres el alma más evolucionada del ciclo numérico. Tu energía es compasiva, sabia y orientada al servicio de la humanidad. Tienes una perspectiva global e inclusiva.', sombra: 'Dificultad para soltar el pasado y tendencia al martirio cuando el servicio pierde su fuente de amor.', fortalezas: 'Compasión · Sabiduría · Servicio · Universalidad' },
  11: { titulo: 'El Iluminado', descripcion: 'Número maestro. Eres un canal espiritual con una sensibilidad excepcional. Tu misión es inspirar, iluminar y elevar la conciencia de quienes te rodean.', sombra: 'Ansiedad extrema, desequilibrio y dificultad para vivir en el mundo ordinario cuando la energía maestra no está integrada.', fortalezas: 'Inspiración · Visión espiritual · Sensibilidad · Liderazgo intuitivo' },
  22: { titulo: 'El Maestro Constructor', descripcion: 'Número maestro. Tienes el poder de materializar sueños a gran escala. Tu visión puede transformar no solo tu vida sino el mundo que te rodea.', sombra: 'Parálisis por la magnitud de la misión y tendencia al perfeccionismo destructivo.', fortalezas: 'Visión · Materialización · Liderazgo · Impacto global' },
  33: { titulo: 'El Maestro Sanador', descripcion: 'Número maestro. Eres un canal del amor incondicional. Tu presencia sana y eleva. Tu misión es servir desde el amor más puro y desinteresado.', sombra: 'Sacrificio extremo de sí mismo y dificultad para recibir el amor que tanto da.', fortalezas: 'Amor incondicional · Sanación · Compasión · Servicio' },
}

export function calcularNumerologia(nombre: string, fechaNacimiento: string): { numeroVida: number; numeroNombre: number; numeroDestino: number } {
  const reducir = (n: number): number => {
    if (n === 11 || n === 22 || n === 33) return n
    if (n < 10) return n
    const suma = n.toString().split('').reduce((a, b) => a + parseInt(b), 0)
    return reducir(suma)
  }

  // Número de vida
  const partes = fechaNacimiento.split('-')
  if (partes.length < 3) return { numeroVida: 1, numeroNombre: 1, numeroDestino: 1 }
  const [año, mes, dia] = partes.map(Number)
  const sumaFecha = año.toString().split('').reduce((a, b) => a + parseInt(b), 0) + mes + dia
  const numeroVida = reducir(sumaFecha)

  // Número del nombre
  const valores: Record<string, number> = { a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8 }
  const sumaNombre = nombre.toLowerCase().split('').reduce((a, c) => a + (valores[c] || 0), 0)
  const numeroNombre = reducir(sumaNombre)

  const numeroDestino = reducir(numeroVida + numeroNombre)

  return { numeroVida, numeroNombre, numeroDestino }
}