export const LETRAS_VOCALES = ['a', 'e', 'i', 'o', 'u']

export const VALORES_LETRAS: Record<string, number> = {
  a:1, b:2, c:3, d:4, e:5, f:6, g:7, h:8, i:9,
  j:1, k:2, l:3, m:4, n:5, o:6, p:7, q:8, r:9,
  s:1, t:2, u:3, v:4, w:5, x:6, y:7, z:8
}

function reducir(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n
  if (n < 10) return n
  return reducir(n.toString().split('').reduce((a, b) => a + parseInt(b), 0))
}

export function calcularNumerologiaCompleta(nombreCompleto: string) {
  const letras = nombreCompleto.toLowerCase().replace(/[^a-z]/g, '').split('')
  const vocales = letras.filter(l => LETRAS_VOCALES.includes(l))
  const consonantes = letras.filter(l => !LETRAS_VOCALES.includes(l))

  const sumaTotal = letras.reduce((a, l) => a + (VALORES_LETRAS[l] || 0), 0)
  const sumaVocales = vocales.reduce((a, l) => a + (VALORES_LETRAS[l] || 0), 0)
  const sumaConsonantes = consonantes.reduce((a, l) => a + (VALORES_LETRAS[l] || 0), 0)

  return {
    numeroExpresion: reducir(sumaTotal),
    numeroAlma: reducir(sumaVocales),
    numeroPersonalidad: reducir(sumaConsonantes),
  }
}

export const NUMERO_ALMA: Record<number, { titulo: string; descripcion: string }> = {
  1: { titulo: 'Alma de Líder', descripcion: 'En el fondo, anhelas independencia, logro y ser el primero. Tu motivación más profunda es ser reconocido como alguien único y capaz.' },
  2: { titulo: 'Alma de Armonía', descripcion: 'En el fondo, anhelas paz, amor y conexión. Tu motivación más profunda es pertenecer y ser amado por quien realmente eres.' },
  3: { titulo: 'Alma Creativa', descripcion: 'En el fondo, anhelas expresarte y ser escuchado. Tu motivación más profunda es crear belleza y alegría en el mundo.' },
  4: { titulo: 'Alma Constructora', descripcion: 'En el fondo, anhelas seguridad y orden. Tu motivación más profunda es construir algo sólido y duradero.' },
  5: { titulo: 'Alma Libre', descripcion: 'En el fondo, anhelas libertad y experiencia. Tu motivación más profunda es vivir plenamente sin restricciones.' },
  6: { titulo: 'Alma Sanadora', descripcion: 'En el fondo, anhelas amor y servicio. Tu motivación más profunda es cuidar y ser necesitado por quienes amas.' },
  7: { titulo: 'Alma Buscadora', descripcion: 'En el fondo, anhelas conocimiento y verdad. Tu motivación más profunda es comprender el misterio de la existencia.' },
  8: { titulo: 'Alma de Poder', descripcion: 'En el fondo, anhelas éxito y reconocimiento. Tu motivación más profunda es manifestar tu potencial en el mundo material.' },
  9: { titulo: 'Alma Universal', descripcion: 'En el fondo, anhelas servir y trascender. Tu motivación más profunda es contribuir a algo más grande que tú mismo.' },
  11: { titulo: 'Alma Iluminada', descripcion: 'En el fondo, anhelas inspirar y elevar. Tu motivación más profunda es ser canal de algo superior.' },
  22: { titulo: 'Alma Maestra', descripcion: 'En el fondo, anhelas manifestar grandes visiones. Tu motivación más profunda es transformar el mundo.' },
}