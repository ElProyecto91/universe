// Año universal, mes universal y día universal
export function calcularAnoUniversal(): number {
  const año = new Date().getFullYear()
  const digitos = año.toString().split('').map(Number)
  const suma = digitos.reduce((a, b) => a + b, 0)
  const reducir = (n: number): number => n < 10 ? n : reducir(n.toString().split('').reduce((a, b) => a + parseInt(b), 0))
  return reducir(suma)
}

export function calcularMesUniversal(): number {
  const hoy = new Date()
  const añoUniversal = calcularAnoUniversal()
  const mes = hoy.getMonth() + 1
  const reducir = (n: number): number => n < 10 ? n : reducir(n.toString().split('').reduce((a, b) => a + parseInt(b), 0))
  return reducir(añoUniversal + mes)
}

export function calcularDiaUniversal(): number {
  const hoy = new Date()
  const mesUniversal = calcularMesUniversal()
  const dia = hoy.getDate()
  const reducir = (n: number): number => n < 10 ? n : reducir(n.toString().split('').reduce((a, b) => a + parseInt(b), 0))
  return reducir(mesUniversal + dia)
}

export const ENERGIA_DIA_UNIVERSAL: Record<number, { titulo: string; energia: string; favorable: string; evitar: string }> = {
  1: { titulo: 'Día de Nuevos Comienzos', energia: 'Iniciativa · Liderazgo · Independencia', favorable: 'Iniciar proyectos, tomar decisiones, actuar con valentía', evitar: 'Dependencia, indecisión, esperar que otros actúen' },
  2: { titulo: 'Día de Cooperación', energia: 'Armonía · Paciencia · Relaciones', favorable: 'Colaborar, mediar, nutrir relaciones importantes', evitar: 'Conflictos innecesarios, decisiones apresuradas' },
  3: { titulo: 'Día de Expresión', energia: 'Creatividad · Comunicación · Alegría', favorable: 'Crear, comunicar, celebrar, conectar socialmente', evitar: 'Dispersión, superficialidad, crítica excesiva' },
  4: { titulo: 'Día de Trabajo', energia: 'Disciplina · Estructura · Fundamentos', favorable: 'Trabajar con constancia, organizar, planificar', evitar: 'Rigidez, resistencia al cambio, exceso de trabajo' },
  5: { titulo: 'Día de Cambio', energia: 'Libertad · Aventura · Movimiento', favorable: 'Explorar, adaptarse, romper rutinas, viajar', evitar: 'Excesos, impulsividad, compromisos precipitados' },
  6: { titulo: 'Día de Amor', energia: 'Cuidado · Responsabilidad · Hogar', favorable: 'Nutrir relaciones, cuidar el hogar, servir con amor', evitar: 'Perfeccionismo, mártir, control excesivo' },
  7: { titulo: 'Día de Reflexión', energia: 'Introspección · Sabiduría · Espiritualidad', favorable: 'Meditar, estudiar, reflexionar, conectar con lo interior', evitar: 'Aislamiento excesivo, desconfianza, análisis paralizante' },
  8: { titulo: 'Día de Manifestación', energia: 'Poder · Abundancia · Logro', favorable: 'Negocios, finanzas, tomar decisiones importantes', evitar: 'Materialismo, control, workaholismo' },
  9: { titulo: 'Día de Completar', energia: 'Compasión · Servicio · Cierre', favorable: 'Completar proyectos, perdonar, servir, agradecer', evitar: 'Aferrarse a lo que ya terminó, egoísmo' },
}