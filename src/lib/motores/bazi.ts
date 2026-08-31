export const TALLOS_CELESTIALES = [
  { nombre: 'Jiǎ', elemento: 'Madera Yang', caracter: '甲' },
  { nombre: 'Yǐ', elemento: 'Madera Yin', caracter: '乙' },
  { nombre: 'Bǐng', elemento: 'Fuego Yang', caracter: '丙' },
  { nombre: 'Dīng', elemento: 'Fuego Yin', caracter: '丁' },
  { nombre: 'Wù', elemento: 'Tierra Yang', caracter: '戊' },
  { nombre: 'Jǐ', elemento: 'Tierra Yin', caracter: '己' },
  { nombre: 'Gēng', elemento: 'Metal Yang', caracter: '庚' },
  { nombre: 'Xīn', elemento: 'Metal Yin', caracter: '辛' },
  { nombre: 'Rén', elemento: 'Agua Yang', caracter: '壬' },
  { nombre: 'Guǐ', elemento: 'Agua Yin', caracter: '癸' },
]

export const RAMAS_TERRESTRES = [
  { nombre: 'Zǐ', animal: 'Rata', elemento: 'Agua', caracter: '子' },
  { nombre: 'Chǒu', animal: 'Buey', elemento: 'Tierra', caracter: '丑' },
  { nombre: 'Yín', animal: 'Tigre', elemento: 'Madera', caracter: '寅' },
  { nombre: 'Mǎo', animal: 'Conejo', elemento: 'Madera', caracter: '卯' },
  { nombre: 'Chén', animal: 'Dragón', elemento: 'Tierra', caracter: '辰' },
  { nombre: 'Sì', animal: 'Serpiente', elemento: 'Fuego', caracter: '巳' },
  { nombre: 'Wǔ', animal: 'Caballo', elemento: 'Fuego', caracter: '午' },
  { nombre: 'Wèi', animal: 'Cabra', elemento: 'Tierra', caracter: '未' },
  { nombre: 'Shēn', animal: 'Mono', elemento: 'Metal', caracter: '申' },
  { nombre: 'Yǒu', animal: 'Gallo', elemento: 'Metal', caracter: '酉' },
  { nombre: 'Xū', animal: 'Perro', elemento: 'Tierra', caracter: '戌' },
  { nombre: 'Hài', animal: 'Cerdo', elemento: 'Agua', caracter: '亥' },
]

export const CINCO_ELEMENTOS_DESC: Record<string, string> = {
  'Madera': 'Crecimiento, expansión, creatividad y visión. La energía Madera busca siempre nuevos horizontes.',
  'Fuego': 'Pasión, transformación, liderazgo e intuición. La energía Fuego ilumina y calienta todo lo que toca.',
  'Tierra': 'Estabilidad, nutrición, confianza y practicidad. La energía Tierra es el centro que sostiene todo.',
  'Metal': 'Precisión, justicia, disciplina y refinamiento. La energía Metal corta lo innecesario para revelar la esencia.',
  'Agua': 'Sabiduría, fluidez, profundidad e introspección. La energía Agua fluye alrededor de los obstáculos.',
}

function getTalloCelestial(año: number): number {
  return (año - 4) % 10
}

function getRamaTerrestrePorAño(año: number): number {
  return (año - 4) % 12
}

function getTalloCelestialMes(mes: number, talloAño: number): number {
  const base = (talloAño % 5) * 2
  return (base + mes - 1) % 10
}

function getRamaTerrestreMes(mes: number): number {
  const mapa = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1]
  return mapa[mes - 1]
}

function getTalloDia(fecha: Date): number {
  const base = new Date(1900, 0, 1)
  const diff = Math.floor((fecha.getTime() - base.getTime()) / (1000 * 60 * 60 * 24))
  return ((diff % 10) + 10) % 10
}

function getRamaDia(fecha: Date): number {
  const base = new Date(1900, 0, 1)
  const diff = Math.floor((fecha.getTime() - base.getTime()) / (1000 * 60 * 60 * 24))
  return ((diff % 12) + 12) % 12
}

export function calcularBazi(fechaNacimiento: string) {
  const fecha = new Date(fechaNacimiento)
  const año = fecha.getFullYear()
  const mes = fecha.getMonth() + 1

  const talloAñoIdx = getTalloCelestial(año)
  const ramaAñoIdx = getRamaTerrestrePorAño(año)
  const talloMesIdx = getTalloCelestialMes(mes, talloAñoIdx)
  const ramaMesIdx = getRamaTerrestreMes(mes)
  const talloDiaIdx = getTalloDia(fecha)
  const ramaDiaIdx = getRamaDia(fecha)

  const pilares = [
    {
      nombre: 'Año',
      tallo: TALLOS_CELESTIALES[talloAñoIdx],
      rama: RAMAS_TERRESTRES[ramaAñoIdx],
      significado: 'Ancestros · Infancia · Energía social'
    },
    {
      nombre: 'Mes',
      tallo: TALLOS_CELESTIALES[talloMesIdx],
      rama: RAMAS_TERRESTRES[ramaMesIdx],
      significado: 'Padres · Carrera · Años 17-32'
    },
    {
      nombre: 'Día',
      tallo: TALLOS_CELESTIALES[talloDiaIdx],
      rama: RAMAS_TERRESTRES[ramaDiaIdx],
      significado: 'Tu esencia · Relaciones · Años 33-48'
    },
  ]

  const dayMaster = TALLOS_CELESTIALES[talloDiaIdx]
  const elementoDominante = dayMaster.elemento.split(' ')[0]

  return { pilares, dayMaster, elementoDominante }
}