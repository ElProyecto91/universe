export const MO_RESULTADOS: Record<string, {
  titulo: string
  descripcion: string
  consejo: string
  signo: 'favorable' | 'neutro' | 'desfavorable'
}> = {
  '1-1': { titulo: 'La Joya del Loto', signo: 'favorable', descripcion: 'Una energía de plenitud y claridad rodea tu pregunta. Lo que buscas está disponible.', consejo: 'Actúa con confianza. El momento es propicio.' },
  '1-2': { titulo: 'El Viento de las Montañas', signo: 'neutro', descripcion: 'Fuerzas en movimiento. Las cosas no están fijas — pueden ir en cualquier dirección.', consejo: 'Mantén flexibilidad. No te comprometas a nada todavía.' },
  '1-3': { titulo: 'El Tigre de las Nieves', signo: 'favorable', descripcion: 'Fuerza y claridad. Tienes los recursos necesarios para avanzar.', consejo: 'Confía en tu fuerza. Este es el momento de actuar con decisión.' },
  '1-4': { titulo: 'La Lluvia Oportuna', signo: 'favorable', descripcion: 'Lo que necesitas llegará en el momento adecuado, no antes ni después.', consejo: 'Ten paciencia. El timing es todo.' },
  '1-5': { titulo: 'El Nudo Sin Fin', signo: 'neutro', descripcion: 'Una situación compleja que requiere cuidado. Los hilos están entrelazados de formas que no ves.', consejo: 'No fuerces la resolución. Observa más antes de actuar.' },
  '1-6': { titulo: 'El Dragón de Turquesa', signo: 'favorable', descripcion: 'Protección y sabiduría divina acompañan esta pregunta.', consejo: 'Confía en la guía que recibes. El camino está protegido.' },
  '2-1': { titulo: 'La Oscuridad Antes del Alba', signo: 'desfavorable', descripcion: 'El momento no es propicio. Algo necesita madurar antes de que puedas avanzar.', consejo: 'Espera. La acción prematura puede cerrar puertas.' },
  '2-2': { titulo: 'El Espejo del Lago', signo: 'neutro', descripcion: 'Lo que ves en la situación refleja algo interior. La respuesta está en ti.', consejo: 'Mira hacia adentro antes de buscar soluciones externas.' },
  '2-3': { titulo: 'La Semilla en la Tierra', signo: 'favorable', descripcion: 'Algo está creciendo en silencio. Los resultados tardarán pero serán sólidos.', consejo: 'Cultiva con paciencia. No extraigas la semilla para ver si crece.' },
  '2-4': { titulo: 'El Viento del Norte', signo: 'desfavorable', descripcion: 'Vientos contrarios soplan. No es el momento de emprender nuevas acciones.', consejo: 'Protégete y conserva energía. Deja pasar la tormenta.' },
  '2-5': { titulo: 'El Puente de Madera', signo: 'neutro', descripcion: 'Un paso necesario pero con precaución. El camino existe pero requiere atención.', consejo: 'Avanza paso a paso, verificando cada apoyo antes de cargar tu peso.' },
  '2-6': { titulo: 'La Flor de Loto en el Barro', signo: 'favorable', descripcion: 'De las circunstancias difíciles emergerá algo hermoso.', consejo: 'No juzgues la situación por su apariencia actual. El loto nace del barro.' },
  '3-1': { titulo: 'El León de las Nieves', signo: 'favorable', descripcion: 'Dignidad, claridad y poder. Tienes más recursos de los que crees.', consejo: 'Actúa desde tu mayor dignidad. El resultado será favorable.' },
  '3-2': { titulo: 'La Campana del Templo', signo: 'neutro', descripcion: 'Un llamado a la atención. Algo pide ser reconocido antes de que puedas avanzar.', consejo: 'Para. Escucha. Hay algo que necesita tu atención plena.' },
  '3-3': { titulo: 'El Arcoíris Doble', signo: 'favorable', descripcion: 'Signos excepcionalmente favorables. Una oportunidad rara se presenta.', consejo: 'Este es un momento especial. Actúa con gratitud y determinación.' },
  '3-4': { titulo: 'El Río que Fluye', signo: 'favorable', descripcion: 'Las cosas fluyen naturalmente en la dirección correcta.', consejo: 'No interfieras. Fluye con la corriente.' },
  '3-5': { titulo: 'La Roca en el Río', signo: 'desfavorable', descripcion: 'Un obstáculo real bloquea el camino. No es el momento de forzar.', consejo: 'Busca un camino alternativo. La fuerza bruta no es la respuesta.' },
  '3-6': { titulo: 'El Fénix de Turquesa', signo: 'favorable', descripcion: 'Transformación y renacimiento. Lo que parecía perdido puede recuperarse.', consejo: 'La renovación es posible. Actúa desde la esperanza, no desde el miedo.' },
  '4-1': { titulo: 'La Tormenta que Limpia', signo: 'neutro', descripcion: 'Una disrupción necesaria. Lo que se rompe ahora abre espacio para algo mejor.', consejo: 'Acepta la disrupción. Está limpiando lo que ya no servía.' },
  '4-2': { titulo: 'El Camino de la Montaña', signo: 'neutro', descripcion: 'El camino existe pero es empinado. El esfuerzo requerido es mayor de lo esperado.', consejo: 'Prepárate para el esfuerzo. La cima vale la pena.' },
  '4-3': { titulo: 'La Estrella Polar', signo: 'favorable', descripcion: 'Una guía clara ilumina tu camino. No estás perdido.', consejo: 'Confía en tu orientación interior. El norte está claro.' },
  '4-4': { titulo: 'El Vacío Fértil', signo: 'neutro', descripcion: 'Un momento de aparente quietud que en realidad contiene gran potencial.', consejo: 'No confundas quietud con estancamiento. Algo se está gestando.' },
  '4-5': { titulo: 'El Tigre y el Dragón', signo: 'favorable', descripcion: 'Dos fuerzas poderosas en armonía. El momento tiene una energía excepcional.', consejo: 'Aprovecha esta energía para algo que requiera tanto fuerza como sabiduría.' },
  '4-6': { titulo: 'La Nube que Pasa', signo: 'neutro', descripcion: 'Una dificultad temporal. Como las nubes, esta situación pasará.', consejo: 'No le des más permanencia de la que tiene. Esto también pasará.' },
  '5-1': { titulo: 'El Sol de Medianoche', signo: 'favorable', descripcion: 'Luz en la oscuridad. Incluso en el momento más difícil, hay claridad disponible.', consejo: 'Busca la luz incluso en la oscuridad. Está ahí.' },
  '5-2': { titulo: 'El Lago Sin Fondo', signo: 'neutro', descripcion: 'Una situación más profunda de lo que parece. No te quedes en la superficie.', consejo: 'Profundiza tu comprensión antes de actuar.' },
  '5-3': { titulo: 'El Garuda Dorado', signo: 'favorable', descripcion: 'El pájaro mítico que vuela más alto que todos los demás. Una perspectiva elevada está disponible.', consejo: 'Eleva tu perspectiva. La solución está en ver desde más arriba.' },
  '5-4': { titulo: 'La Luna Nueva', signo: 'neutro', descripcion: 'Un comienzo en la oscuridad. Lo que inicias ahora crecerá lentamente pero con fuerza.', consejo: 'Planta la semilla aunque no veas la luz todavía.' },
  '5-5': { titulo: 'El Centro del Mandala', signo: 'favorable', descripcion: 'Estás en el centro de todo. Todo lo que necesitas irradia desde este punto.', consejo: 'Confía en que estás exactamente donde debes estar.' },
  '5-6': { titulo: 'El Trueno en el Valle', signo: 'neutro', descripcion: 'Un impacto que despierta. Lo que sacude también puede iluminar.', consejo: 'Permite que el impacto te despierte en lugar de paralizarte.' },
  '6-1': { titulo: 'La Mariposa de Jade', signo: 'favorable', descripcion: 'Transformación suave y hermosa. El cambio que viene es para bien.', consejo: 'Abraza la transformación con ligereza y alegría.' },
  '6-2': { titulo: 'El Hielo del Invierno', signo: 'desfavorable', descripcion: 'Una congelación temporal. Las cosas no se mueven ahora.', consejo: 'No fuerces el movimiento. El deshielo llegará en su momento.' },
  '6-3': { titulo: 'El Fuego Sagrado', signo: 'favorable', descripcion: 'Una energía de purificación y transformación. Lo que se quema da paso a lo nuevo.', consejo: 'Permite la transformación aunque sea incómoda.' },
  '6-4': { titulo: 'El Puente de Arcoíris', signo: 'favorable', descripcion: 'Una conexión entre mundos se abre. Lo que parecía separado puede unirse.', consejo: 'Busca el puente entre lo que parece opuesto.' },
  '6-5': { titulo: 'La Tortuga de Oro', signo: 'favorable', descripcion: 'Larga vida, sabiduría acumulada y protección. La paciencia trae sus frutos.', consejo: 'La lentitud deliberada es sabiduría. No te apresures.' },
  '6-6': { titulo: 'El Loto de Mil Pétalos', signo: 'favorable', descripcion: 'El signo más completo y auspicioso. Una apertura extraordinaria de posibilidades.', consejo: 'Este es un momento de gracia. Actúa con gratitud y confianza.' },
}

export function lanzarMo(): { dado1: number; dado2: number } {
  return {
    dado1: Math.floor(Math.random() * 6) + 1,
    dado2: Math.floor(Math.random() * 6) + 1,
  }
}

export function getMoResultado(dado1: number, dado2: number) {
  const clave = `${dado1}-${dado2}`
  return MO_RESULTADOS[clave] || MO_RESULTADOS['3-3']
}