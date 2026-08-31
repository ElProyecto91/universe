export const TEXTOS_DOMINIO_PUBLICO = [
  { fuente: 'Tao Te Ching — Laozi', texto: 'El que conoce a los demás es sabio. El que se conoce a sí mismo está iluminado. El que vence a los demás tiene fuerza. El que se vence a sí mismo es poderoso.' },
  { fuente: 'Tao Te Ching — Laozi', texto: 'Un viaje de mil millas comienza con un solo paso.' },
  { fuente: 'Tao Te Ching — Laozi', texto: 'Actúa sin expectativas. Trabaja sin depender del resultado. Termina tus tareas y olvídalas — así tu obra durará para siempre.' },
  { fuente: 'Tao Te Ching — Laozi', texto: 'El agua beneficia a todas las cosas sin competir con ninguna. Fluye hacia los lugares que los hombres desprecian. Por eso es próxima al Tao.' },
  { fuente: 'Tao Te Ching — Laozi', texto: 'Para obtener conocimiento, añade algo cada día. Para obtener sabiduría, quita algo cada día.' },
  { fuente: 'Meditaciones — Marco Aurelio', texto: 'Tienes poder sobre tu mente, no sobre los eventos externos. Date cuenta de esto y encontrarás la fortaleza.' },
  { fuente: 'Meditaciones — Marco Aurelio', texto: 'La felicidad de tu vida depende de la calidad de tus pensamientos.' },
  { fuente: 'Meditaciones — Marco Aurelio', texto: 'Muy poco se necesita para una vida feliz; todo está dentro de ti, en tu forma de pensar.' },
  { fuente: 'Meditaciones — Marco Aurelio', texto: 'Cuando te despiertes por la mañana, piensa en el privilegio que tienes de estar vivo, de pensar, de disfrutar, de amar.' },
  { fuente: 'Meditaciones — Marco Aurelio', texto: 'Nunca estimes que algo es beneficioso para ti si te obliga a romper una promesa o a perder tu respeto propio.' },
  { fuente: 'Poemas — Rumi', texto: 'Fuera de las ideas sobre hacer el bien o hacer el mal, hay un campo. Te encontraré allí.' },
  { fuente: 'Poemas — Rumi', texto: 'La herida es el lugar por donde la luz entra en ti.' },
  { fuente: 'Poemas — Rumi', texto: 'Lo que buscas también te está buscando a ti.' },
  { fuente: 'Poemas — Rumi', texto: 'Vive donde temes vivir. Destruye tu reputación. Sé infame.' },
  { fuente: 'Poemas — Rumi', texto: 'El silencio es el lenguaje de Dios; todo lo demás es una mala traducción.' },
  { fuente: 'Así habló Zaratustra — Nietzsche', texto: 'Uno debe tener caos dentro de sí para dar a luz a una estrella danzante.' },
  { fuente: 'Así habló Zaratustra — Nietzsche', texto: 'El hombre debe superar sus sufrimientos y no dejarse aplastar por ellos.' },
  { fuente: 'Odisea — Homero', texto: 'Nada hay más desgraciado que el hombre, entre todos los seres que respiran y se arrastran por la tierra.' },
  { fuente: 'Odisea — Homero', texto: 'El corazón en el pecho de los hombres es veloz: cuando los dioses quieren, pasan de la alegría a la desdicha en un instante.' },
  { fuente: 'I Ching — Libro de los Cambios', texto: 'El movimiento es natural al cielo. El descanso es natural a la tierra. El sabio sabe cuándo moverse y cuándo descansar.' },
  { fuente: 'I Ching — Libro de los Cambios', texto: 'En los momentos de dificultad, la perseverancia trae beneficio.' },
  { fuente: 'Upanishads', texto: 'Tat tvam asi — Eso eres tú. Lo que buscas fuera, ya existe dentro.' },
  { fuente: 'Upanishads', texto: 'La verdad es una. Los sabios la llaman con muchos nombres.' },
  { fuente: 'Dhammapada — Buda', texto: 'La mente lo es todo. Te conviertes en lo que piensas.' },
  { fuente: 'Dhammapada — Buda', texto: 'Si tu compasión no te incluye a ti mismo, está incompleta.' },
  { fuente: 'Dhammapada — Buda', texto: 'La paz viene de adentro. No la busques afuera.' },
  { fuente: 'Libro de los Muertos Egipcio', texto: 'El corazón del hombre justo es más ligero que una pluma.' },
  { fuente: 'Poemas — Walt Whitman', texto: 'Me celebro y me canto a mí mismo. Y lo que yo digo de mí mismo, lo digo de ti también, porque cada átomo que me pertenece también te pertenece.' },
  { fuente: 'Poemas — Emily Dickinson', texto: 'La esperanza es esa cosa con plumas que se posa en el alma y canta la melodía sin palabras — y nunca deja de cantar.' },
  { fuente: 'El Profeta — Khalil Gibran', texto: 'Tu dolor es la ruptura de la cáscara que encierra tu entendimiento.' },
  { fuente: 'El Profeta — Khalil Gibran', texto: 'No digáis: "He encontrado la verdad", sino más bien: "He encontrado una verdad".' },
  { fuente: 'El Profeta — Khalil Gibran', texto: 'Cuando amas, no digas "Dios está en mi corazón", sino más bien: "Estoy en el corazón de Dios".' },
]

export function getTextoDiario(): typeof TEXTOS_DOMINIO_PUBLICO[0] {
  const hoy = new Date()
  const semilla = hoy.getFullYear() * 10000 + (hoy.getMonth() + 1) * 100 + hoy.getDate()
  const idx = semilla % TEXTOS_DOMINIO_PUBLICO.length
  return TEXTOS_DOMINIO_PUBLICO[idx]
}

export function getTextoAleatorio(): typeof TEXTOS_DOMINIO_PUBLICO[0] {
  return TEXTOS_DOMINIO_PUBLICO[Math.floor(Math.random() * TEXTOS_DOMINIO_PUBLICO.length)]
}