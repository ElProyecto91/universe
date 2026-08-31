export type FaseLunar = {
  nombre: string
  simbolo: string
  angulo: number
  energia: string
  mensaje: string
  ritual: string
  tarot: string
  runa: string
}

export function getFaseLunar(): FaseLunar {
  const fecha = new Date()
  const lunaReferencia = new Date(2000, 0, 6, 18, 14)
  const cicloDias = 29.53058867
  const diff = (fecha.getTime() - lunaReferencia.getTime()) / (1000 * 60 * 60 * 24)
  const cicloActual = ((diff % cicloDias) + cicloDias) % cicloDias
  const angulo = (cicloActual / cicloDias) * 360

  const fases: FaseLunar[] = [
    {
      nombre: 'Luna Nueva',
      simbolo: '🌑',
      angulo: 0,
      energia: 'Inicio · Intención · Semilla',
      mensaje: 'Es el momento perfecto para plantar nuevas intenciones. La oscuridad no es ausencia de luz — es el espacio donde todo comienza.',
      ritual: 'Escribe tres intenciones para este ciclo lunar. Medita en silencio. Comienza algo que llevas tiempo posponiendo.',
      tarot: 'El Loco · El Mago',
      runa: 'ᛜ Ingwaz — potencial puro',
    },
    {
      nombre: 'Luna Creciente',
      simbolo: '🌒',
      angulo: 45,
      energia: 'Acción · Construcción · Movimiento',
      mensaje: 'Lo que sembraste en la luna nueva comienza a moverse. Es tiempo de actuar, de dar los primeros pasos concretos hacia tus intenciones.',
      ritual: 'Da un paso concreto hacia tu intención. Elimina un obstáculo. Haz una llamada pendiente.',
      tarot: 'El Carro · La Emperatriz',
      runa: 'ᚱ Raidho — movimiento con propósito',
    },
    {
      nombre: 'Cuarto Creciente',
      simbolo: '🌓',
      angulo: 90,
      energia: 'Decisión · Compromiso · Claridad',
      mensaje: 'Estás en el punto de decisión. Lo que no funciona se hace visible. Es tiempo de comprometerte o de soltar con gracia.',
      ritual: 'Toma una decisión que has estado evitando. Revisa tus intenciones y ajusta el rumbo si es necesario.',
      tarot: 'La Justicia · El Carro',
      runa: 'ᛏ Tiwaz — decisión honesta',
    },
    {
      nombre: 'Luna Gibosa Creciente',
      simbolo: '🌔',
      angulo: 135,
      energia: 'Refinamiento · Paciencia · Ajuste',
      mensaje: 'Casi llegamos. Este es el momento de refinar, de ajustar los detalles y de confiar en el proceso sin forzar el resultado.',
      ritual: 'Revisa lo que has construido. Ajusta lo que no funciona. Confía en el proceso.',
      tarot: 'La Templanza · El Ermitaño',
      runa: 'ᛃ Jera — el ciclo completa su ritmo',
    },
    {
      nombre: 'Luna Llena',
      simbolo: '🌕',
      angulo: 180,
      energia: 'Plenitud · Culminación · Revelación',
      mensaje: 'La luna llena ilumina todo lo que estaba oculto. Es el momento de mayor energía y visibilidad. Lo que sembraste se muestra en su plenitud.',
      ritual: 'Celebra lo que has logrado. Libera lo que ya no sirve. Escribe lo que quieres soltar. Medita bajo la luna.',
      tarot: 'El Sol · El Mundo',
      runa: 'ᛋ Sowilo — luz plena',
    },
    {
      nombre: 'Luna Gibosa Menguante',
      simbolo: '🌖',
      angulo: 225,
      energia: 'Gratitud · Compartir · Integración',
      mensaje: 'La energía comienza a retirarse. Es tiempo de agradecer, de compartir lo aprendido y de integrar la sabiduría de este ciclo.',
      ritual: 'Expresa gratitud. Comparte algo que has aprendido. Dona o regala algo que ya no necesitas.',
      tarot: 'La Estrella · La Sacerdotisa',
      runa: 'ᚷ Gebo — dar y recibir',
    },
    {
      nombre: 'Cuarto Menguante',
      simbolo: '🌗',
      angulo: 270,
      energia: 'Liberación · Perdón · Soltar',
      mensaje: 'Es el momento de soltar lo que ya no sirve. El perdón — de otros y de uno mismo — es la puerta hacia el próximo ciclo.',
      ritual: 'Escribe lo que quieres soltar y quémalo o rómpelo. Practica el perdón. Simplifica tu espacio.',
      tarot: 'El Colgado · La Muerte',
      runa: 'ᛚ Laguz — fluir sin resistencia',
    },
    {
      nombre: 'Luna Menguante',
      simbolo: '🌘',
      angulo: 315,
      energia: 'Descanso · Reflexión · Preparación',
      mensaje: 'El ciclo se acerca a su fin. Es tiempo de descansar, reflexionar sobre lo vivido y preparar el espacio interior para el nuevo comienzo.',
      ritual: 'Descansa. Medita. Escribe en tu diario. Prepara tus intenciones para la próxima luna nueva.',
      tarot: 'El Ermitaño · La Luna',
      runa: 'ᛁ Isa — quietud necesaria',
    },
  ]

  const idx = Math.floor((angulo / 360) * 8)
  return { ...fases[Math.min(idx, 7)], angulo }
}

export function getDiasHastaLunaLlena(): number {
  const fecha = new Date()
  const lunaReferencia = new Date(2000, 0, 6, 18, 14)
  const cicloDias = 29.53058867
  const diff = (fecha.getTime() - lunaReferencia.getTime()) / (1000 * 60 * 60 * 24)
  const cicloActual = ((diff % cicloDias) + cicloDias) % cicloDias
  const diasHastaLlena = cicloDias / 2 - cicloActual
  return diasHastaLlena > 0 ? Math.ceil(diasHastaLlena) : Math.ceil(diasHastaLlena + cicloDias)
}