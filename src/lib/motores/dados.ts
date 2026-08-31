export const INTERPRETACIONES_DADO: Record<number, { titulo: string; mensaje: string }> = {
  1: { titulo: 'El Origen', mensaje: 'Todo comienza en un punto. Este es el momento del inicio puro, de la semilla antes de germinar. La unidad precede a todo.' },
  2: { titulo: 'La Dualidad', mensaje: 'Dos fuerzas en equilibrio o en tensión. Una decisión se aproxima. El universo te pide que elijas conscientemente.' },
  3: { titulo: 'La Creación', mensaje: 'El tres es el número de la manifestación. Lo que imaginas tiene la energía para volverse real. Actúa desde la creatividad.' },
  4: { titulo: 'La Fundación', mensaje: 'Solidez, estructura, tierra bajo los pies. Es momento de construir sobre bases sólidas y no apresurar el proceso.' },
  5: { titulo: 'El Cambio', mensaje: 'El cinco es movimiento, libertad y transformación. Algo en tu vida está listo para cambiar. No te resistas al flujo.' },
  6: { titulo: 'La Plenitud', mensaje: 'El seis representa la armonía y la completitud. Un ciclo se cierra con satisfacción. Celebra lo que has logrado.' },
}

export const INTERPRETACIONES_3DADOS: Record<string, string> = {
  mente: 'Tu mente está procesando más de lo que reconoces conscientemente. Hay pensamientos que piden ser escuchados.',
  cuerpo: 'Tu energía física refleja tu estado interior. Presta atención a las señales de tu cuerpo — habla en silencio.',
  espiritu: 'Tu dimensión espiritual está activa y receptiva. Es un buen momento para la introspección y la conexión interior.',
}

export function lanzarDado(): number {
  return Math.floor(Math.random() * 6) + 1
}

export function lanzar3Dados(): number[] {
  return [lanzarDado(), lanzarDado(), lanzarDado()]
}