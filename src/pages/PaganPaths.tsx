// src/pages/PaganPaths.tsx

import { useState } from 'react'
import { limpiarMarkdown } from '../components/TextoIA'
import Compartir from '../components/Compartir'
import Paywall from '../components/Paywall'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import { llamarGemini, useUserPlan, useAnalytics, registrarEvento } from '../lib/paginaHelper'

const CAMINOS = [
  {
    id: 'norse',
    nombre: 'Tradición Nórdica',
    subtitulo: '✦ Norse / Heathen',
    descripcion: 'Mitología y simbolismo nórdico: Odin, Thor, las Nornas, los Nueve Mundos.',
    etiqueta: '🏛️ HISTÓRICO',
    imagen: '/pagan/norse.jpg',
    imagenCredito: 'Johannes Gehrts, 1901',
    prompt: (pregunta: string, nombre: string) => [
      'Escribe en español, en prosa, sin listas, sin asteriscos, sin markdown.',
      'Eres un guía experto en mitología y simbolismo nórdico/germánico. Responde desde el conocimiento de las sagas, la Edda Poética y la Edda en Prosa, los nueve mundos, los dioses (Aesir y Vanir) y los conceptos de Wyrd y Orlog.',
      '',
      `Nombre: ${nombre}`,
      `Pregunta o situación: "${pregunta}"`,
      '',
      'Explora esta pregunta desde la perspectiva de la tradición nórdica. Qué divinidad o arquetipo nórdico resuena con esta situación. Qué enseñanza de las sagas podría ser relevante. Habla de Wyrd (el destino tejido) y de cómo las acciones presentes influyen en él. Sé poético y profundo. 3 párrafos máximo.',
    ].join('\n'),
  },
  {
    id: 'hellenic',
    nombre: 'Tradición Helénica',
    subtitulo: '✦ Greco-romana',
    descripcion: 'Dioses olímpicos, mitos griegos y romanos, arquetipos y oráculos.',
    etiqueta: '🏛️ HISTÓRICO',
    imagen: '/pagan/hellenic.jpg',
    imagenCredito: 'Escultura griega clásica',
    prompt: (pregunta: string, nombre: string) => [
      'Escribe en español, en prosa, sin listas, sin asteriscos, sin markdown.',
      'Eres un guía experto en mitología y filosofía griega y romana. Conoces profundamente los dioses olímpicos, los mitos, el oráculo de Delfos, los estoicos y los epicúreos.',
      '',
      `Nombre: ${nombre}`,
      `Pregunta o situación: "${pregunta}"`,
      '',
      'Explora esta pregunta desde la perspectiva helénica. Qué dios o diosa griega resuena con esta situación y por qué. Qué mito clásico habla de algo similar. Qué diría el oráculo de Delfos. Usa el famoso "Conócete a ti mismo" como hilo conductor si es relevante. 3 párrafos. Sé erudito pero accesible.',
    ].join('\n'),
  },
  {
    id: 'egyptian',
    nombre: 'Tradición Egipcia',
    subtitulo: '✦ Kemet',
    descripcion: 'Dioses del antiguo Egipto, Ma\'at, el Libro de los Muertos, los arquetipos.',
    etiqueta: '🏛️ HISTÓRICO',
    imagen: '/pagan/egyptian.jpg',
    imagenCredito: 'Grabado egipcio, 1888',
    prompt: (pregunta: string, nombre: string) => [
      'Escribe en español, en prosa, sin listas, sin asteriscos, sin markdown.',
      'Eres un guía experto en religión y mitología del antiguo Egipto. Conoces profundamente los dioses (Ra, Isis, Osiris, Anubis, Thoth, Sekhmet, Hathor...), el concepto de Ma\'at (verdad/equilibrio), el Libro de los Muertos y la cosmología egipcia.',
      '',
      `Nombre: ${nombre}`,
      `Pregunta o situación: "${pregunta}"`,
      '',
      'Explora esta pregunta desde la perspectiva egipcia antigua. Qué divinidad egipcia y su arquetipo resuenan con esta situación. Cómo se relaciona con Ma\'at (el equilibrio cósmico). Qué sabiduría del Libro de los Muertos o de los textos sagrados podría ser relevante. 3 párrafos.',
    ].join('\n'),
  },
  {
    id: 'celtic',
    nombre: 'Tradición Celta',
    subtitulo: '✦ Inspiración celta',
    descripcion: 'Folklore celta, ciclos estacionales, el Otro Mundo, los Tuatha Dé Danann.',
    etiqueta: '✨ MODERNO',
    imagen: '/pagan/celtic.jpg',
    imagenCredito: 'Libro de Kells, s. IX',
    prompt: (pregunta: string, nombre: string) => [
      'Escribe en español, en prosa, sin listas, sin asteriscos, sin markdown.',
      'Eres un guía experto en folklore celta, mitología irlandesa y galesa, y las tradiciones de los pueblos celtas históricos.',
      '',
      `Nombre: ${nombre}`,
      `Pregunta o situación: "${pregunta}"`,
      '',
      'Explora esta pregunta desde la perspectiva celta. Qué figura del folklore celta resuena aquí. Cómo se relaciona con el ciclo estacional. Habla del concepto del Otro Mundo y los umbrales. Nota: gran parte del neopaganismo celta moderno es una reconstrucción inspirada. 3 párrafos.',
    ].join('\n'),
  },
  {
    id: 'slavic',
    nombre: 'Tradición Eslava',
    subtitulo: '✦ Folklore eslavo',
    descripcion: 'Deidades eslavas, Baba Yaga, espíritus de la naturaleza, folklore de Europa del Este.',
    etiqueta: '🌿 VIVO',
    imagen: '/pagan/slavic.jpg',
    imagenCredito: 'Ivan Bilibin, 1900',
    prompt: (pregunta: string, nombre: string) => [
      'Escribe en español, en prosa, sin listas, sin asteriscos, sin markdown.',
      'Eres un guía experto en mitología y folklore eslavo: Perun, Veles, Mokosh, Baba Yaga, los domovoi, las rusalki y otros seres del folklore eslavo oriental y occidental.',
      '',
      `Nombre: ${nombre}`,
      `Pregunta o situación: "${pregunta}"`,
      '',
      'Explora esta pregunta desde la perspectiva del folklore eslavo. Qué deidad o espíritu eslavo resuena con esta situación. Qué enseñanza del folklore de Europa del Este podría ser relevante. Habla de la relación entre el mundo humano y los espíritus de la naturaleza. 3 párrafos.',
    ].join('\n'),
  },
  {
    id: 'wicca',
    nombre: 'Wicca · Brujería Moderna',
    subtitulo: '✦ Paganismo moderno',
    descripcion: 'El ciclo de las estaciones, la Triple Diosa, el Dios Cornudo, los sabbats.',
    etiqueta: '✨ MODERNO',
    imagen: '/pagan/wicca.jpg',
    imagenCredito: 'Francisco de Goya, 1798',
    prompt: (pregunta: string, nombre: string) => [
      'Escribe en español, en prosa, sin listas, sin asteriscos, sin markdown.',
      'Eres una guía experta en Wicca y brujería moderna contemporánea. Conoces la Rueda del Año, la Triple Diosa, el Dios Cornudo, los sabbats y los esbats, la magia con hierbas, cristales y elementos.',
      '',
      `Nombre: ${nombre}`,
      `Pregunta o situación: "${pregunta}"`,
      '',
      'Explora esta pregunta desde la perspectiva Wicca/brujería moderna. En qué fase del ciclo estamos y cómo afecta esto. Qué aspecto de la Diosa o el Dios resuena con esta situación. Qué práctica podría ser útil. Nota: Wicca es una religión moderna fundada en el siglo XX. 3 párrafos.',
    ].join('\n'),
  },
]

export default function PaganPaths() {
  const [caminoSeleccionado, setCaminoSeleccionado] = useState<typeof CAMINOS[0] | null>(null)
  const [pregunta, setPregunta] = useState('')
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'elegir' | 'preguntar' | 'resultado'>('elegir')
  const [errorMsg, setErrorMsg] = useState('')

  const { esPremium, userId } = useUserPlan()
  useAnalytics('pagan-paths')

  const nombre = localStorage.getItem('nombre') || 'viajero'

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const consultar = async () => {
    if (!pregunta.trim() || !caminoSeleccionado) return
    const t0 = Date.now()
    setFase('resultado')
    setCargando(true)
    setErrorMsg('')
    registrarEvento({ herramienta: `pagan-${caminoSeleccionado.id}`, accion: 'consulta_iniciada', user_id: userId })

    const result = await llamarGemini({
      herramienta: `pagan-${caminoSeleccionado.id}`,
      prompt: caminoSeleccionado.prompt(pregunta, nombre),
      userId,
      usarLite: false,
      cacheable: false,
      maxTokens: 2800,
    })

    if (result.error) {
      setErrorMsg(result.error)
    } else {
      setInterpretacion(limpiarMarkdown(result.texto))
      registrarEvento({ herramienta: `pagan-${caminoSeleccionado.id}`, accion: 'lectura_ia', tiempo_respuesta_ms: Date.now() - t0, user_id: userId })
    }
    setCargando(false)
  }

  const etiquetaColor = (e: string) => {
    if (e.includes('HISTÓRICO')) return 'bg-amber-500/20 text-amber-300'
    if (e.includes('MODERNO')) return 'bg-purple-500/20 text-purple-300'
    if (e.includes('VIVO')) return 'bg-green-500/20 text-green-300'
    return 'bg-white/10 text-white/40'
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.80)' }} />

      {!esPremium && <Paywall motivo="herramienta" herramienta="Caminos Paganos · Sabiduría de las tradiciones" />}

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => {
            if (fase === 'resultado') setFase('preguntar')
            else if (fase === 'preguntar') setFase('elegir')
            else window.location.href = '/tradiciones'
          }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Caminos Paganos</p>
            <p className="text-purple-300 text-xs">Tradiciones espirituales del mundo</p>
          </div>
        </div>

        {/* FASE 1 — Elegir tradición */}
        {fase === 'elegir' && (
          <div className="flex flex-col gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <div className="flex gap-3 text-xs">
                <span className="bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full">🏛️ Histórico</span>
                <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">✨ Moderno</span>
                <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full">🌿 Vivo</span>
              </div>
            </div>
            {CAMINOS.map(c => (
              <button key={c.id}
                onClick={() => { setCaminoSeleccionado(c); setFase('preguntar') }}
                className="w-full rounded-3xl overflow-hidden text-left hover:opacity-90 transition border border-white/10">
                {/* Imagen de fondo de la card */}
                <div className="relative h-24">
                  <img src={c.imagen} alt={c.nombre}
                    className="w-full h-full object-cover"
                    style={{ filter: 'brightness(0.4)' }} />
                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold">{c.nombre}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${etiquetaColor(c.etiqueta)}`}>{c.etiqueta}</span>
                    </div>
                    <p className="text-white/70 text-xs">{c.descripcion}</p>
                  </div>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 text-lg">›</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* FASE 2 — Preguntar */}
        {fase === 'preguntar' && caminoSeleccionado && (
          <div className="flex flex-col gap-6">
            {/* Hero con imagen histórica */}
            <div className="rounded-3xl overflow-hidden border border-white/15">
              <div className="relative h-48">
                <img src={caminoSeleccionado.imagen} alt={caminoSeleccionado.nombre}
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(0.55) sepia(0.2)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${etiquetaColor(caminoSeleccionado.etiqueta)}`}>
                    {caminoSeleccionado.etiqueta}
                  </span>
                  <p className="text-white font-bold text-xl mt-1">{caminoSeleccionado.nombre}</p>
                  <p className="text-white/50 text-xs">{caminoSeleccionado.subtitulo}</p>
                </div>
                <p className="absolute top-3 right-3 text-white/30 text-xs">{caminoSeleccionado.imagenCredito}</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu pregunta</p>
              <textarea value={pregunta} onChange={e => setPregunta(e.target.value)}
                placeholder="¿Qué quieres explorar desde esta tradición?" rows={4}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30" />
            </div>
            <button onClick={consultar} disabled={!pregunta.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40">
              Consultar esta tradición
            </button>
          </div>
        )}

        {/* FASE 3 — Resultado */}
        {fase === 'resultado' && (
          <div className="flex flex-col gap-5">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur">
              <p className="text-white/40 text-xs">{caminoSeleccionado?.nombre} · <span className="italic">"{pregunta}"</span></p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Desde esta tradición</p>
              {cargando ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : errorMsg ? (
                <p className="text-red-400 text-sm">{errorMsg}</p>
              ) : (
                <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{interpretacion}</p>
              )}
            </div>
            {!cargando && interpretacion && (
              <>
                <DisclaimerIA />
                <Valoracion herramienta={`pagan-${caminoSeleccionado?.id}`} userId={userId} />
                <Compartir
                  titulo={`${caminoSeleccionado?.nombre}: mi consulta espiritual`}
                  texto={interpretacion}
                  hashtags={['Universe', caminoSeleccionado?.id || 'Pagan', 'Espiritualidad']} />
              </>
            )}
            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                Explorar con mi Guía IA
              </button>
              <button onClick={() => { setFase('elegir'); setPregunta(''); setInterpretacion(''); setErrorMsg('') }}
                className="w-full text-purple-300/60 text-sm py-2">
                Explorar otra tradición
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}