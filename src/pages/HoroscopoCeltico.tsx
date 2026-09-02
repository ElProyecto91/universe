import { useState } from 'react'
import Compartir from '../components/Compartir'
import { supabase } from '../lib/supabase'

const ARBOLES_CELTICOS = [
  { nombre: 'Abedul', fechas: 'Dec 24 – Ene 20', simbolo: '🌲', keywords: 'Pionero · Tolerante · Ambicioso · Decidido', descripcion: 'El árbol del comienzo. Las personas Abedul son pioneras naturales — tolerantes, decididas y capaces de adaptarse a cualquier condición. Como el primer árbol en crecer tras el invierno, marcan el inicio de nuevos ciclos.' },
  { nombre: 'Serbal', fechas: 'Ene 21 – Feb 17', simbolo: '🌳', keywords: 'Filósofo · Artístico · Intuitivo · Sensible', descripcion: 'El árbol de la visión. Las personas Serbal tienen una profundidad filosófica extraordinaria y una intuición artística refinada. Ven lo que otros no pueden ver.' },
  { nombre: 'Fresno', fechas: 'Feb 18 – Mar 17', simbolo: '🌿', keywords: 'Ambicioso · Exigente · Perceptivo · Impulsivo', descripcion: 'El árbol del mundo. Las personas Fresno son ambiciosas y perceptivas, con una energía que conecta los mundos visibles e invisibles.' },
  { nombre: 'Aliso', fechas: 'Mar 18 – Abr 14', simbolo: '🍃', keywords: 'Maestro · Confiado · Apasionado · Impaciente', descripcion: 'El árbol del guerrero. Las personas Aliso son maestros naturales — apasionados, confiados y capaces de liderar con determinación.' },
  { nombre: 'Sauce', fechas: 'Abr 15 – May 12', simbolo: '🌊', keywords: 'Empático · Cíclico · Intuitivo · Memorioso', descripcion: 'El árbol de la luna. Las personas Sauce tienen una conexión profunda con los ciclos y las emociones, con una memoria emocional extraordinaria.' },
  { nombre: 'Espino', fechas: 'May 13 – Jun 9', simbolo: '🌸', keywords: 'Adaptable · Curioso · Comunicativo · Versátil', descripcion: 'El árbol de la ilusión. Las personas Espino son las más versátiles del calendario — adaptables, curiosas y capaces de ver múltiples perspectivas.' },
  { nombre: 'Roble', fechas: 'Jun 10 – Jul 7', simbolo: '🌳', keywords: 'Estable · Protector · Generoso · Resistente', descripcion: 'El rey del bosque. Las personas Roble son los pilares de su comunidad — estables, protectoras y extraordinariamente resistentes.' },
  { nombre: 'Acebo', fechas: 'Jul 8 – Ago 4', simbolo: '✨', keywords: 'Competitivo · Ambicioso · Leal · Hábil', descripcion: 'El árbol del guerrero. Las personas Acebo son competitivas y hábiles, con una capacidad extraordinaria para superar obstáculos.' },
  { nombre: 'Avellano', fechas: 'Ago 5 – Sep 1', simbolo: '🍂', keywords: 'Sabio · Honesto · Organizado · Eficiente', descripcion: 'El árbol de la sabiduría. Las personas Avellano son las más analíticas y organizadas — con un don natural para estructurar el conocimiento.' },
  { nombre: 'Vid', fechas: 'Sep 2 – Sep 29', simbolo: '🍇', keywords: 'Refinado · Empático · Indeciso · Equilibrado', descripcion: 'El árbol de la transformación. Las personas Vid son refinadas y empáticas, con una naturaleza equilibrada que puede ver belleza en todo.' },
  { nombre: 'Hiedra', fechas: 'Sep 30 – Oct 27', simbolo: '🍃', keywords: 'Compasivo · Supersticioso · Resiliente · Leal', descripcion: 'El árbol de la resiliencia. Las personas Hiedra tienen una compasión extraordinaria y una lealtad inquebrantable hacia quienes aman.' },
  { nombre: 'Caña', fechas: 'Oct 28 – Nov 24', simbolo: '🎋', keywords: 'Independiente · Escéptico · Perceptivo · Honesto', descripcion: 'El árbol del cazador. Las personas Caña son extraordinariamente perceptivas y honestas, con una independencia que nunca se domestica.' },
  { nombre: 'Saúco', fechas: 'Nov 25 – Dic 23', simbolo: '🌑', keywords: 'Impulsivo · Jovial · Honesto · Renovador', descripcion: 'El árbol del fin y el comienzo. Las personas Saúco llevan dentro la energía de la renovación — terminan ciclos con la misma facilidad con que los inician.' },
]

function getArbolCeltico(fecha: string): typeof ARBOLES_CELTICOS[0] | null {
  if (!fecha) return null
  const f = new Date(fecha)
  const mes = f.getMonth() + 1
  const dia = f.getDate()
  const diaDentroDelAno = mes * 100 + dia
  if (diaDentroDelAno >= 1224 || diaDentroDelAno <= 120) return ARBOLES_CELTICOS[0]
  if (diaDentroDelAno >= 121 && diaDentroDelAno <= 217) return ARBOLES_CELTICOS[1]
  if (diaDentroDelAno >= 218 && diaDentroDelAno <= 317) return ARBOLES_CELTICOS[2]
  if (diaDentroDelAno >= 318 && diaDentroDelAno <= 414) return ARBOLES_CELTICOS[3]
  if (diaDentroDelAno >= 415 && diaDentroDelAno <= 512) return ARBOLES_CELTICOS[4]
  if (diaDentroDelAno >= 513 && diaDentroDelAno <= 609) return ARBOLES_CELTICOS[5]
  if (diaDentroDelAno >= 610 && diaDentroDelAno <= 707) return ARBOLES_CELTICOS[6]
  if (diaDentroDelAno >= 708 && diaDentroDelAno <= 804) return ARBOLES_CELTICOS[7]
  if (diaDentroDelAno >= 805 && diaDentroDelAno <= 901) return ARBOLES_CELTICOS[8]
  if (diaDentroDelAno >= 902 && diaDentroDelAno <= 929) return ARBOLES_CELTICOS[9]
  if (diaDentroDelAno >= 930 && diaDentroDelAno <= 1027) return ARBOLES_CELTICOS[10]
  if (diaDentroDelAno >= 1028 && diaDentroDelAno <= 1124) return ARBOLES_CELTICOS[11]
  return ARBOLES_CELTICOS[12]
}

export default function HoroscopoCeltico() {
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [generado, setGenerado] = useState(false)
  const [fromCache, setFromCache] = useState(false)

  const nombre = localStorage.getItem('nombre') || 'viajero'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const arbol = getArbolCeltico(fechaNacimiento)

  // Clave permanente por árbol — no cambia nunca, no tiene fecha
  const cacheKey = `celtico-${arbol?.nombre.toLowerCase().replace(/ /g, '-')}`

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const generarLectura = async () => {
    if (!arbol) return
    setCargando(true)
    setGenerado(true)

    // ── 1. Buscar en caché (ai_cache, sin expiración) ─────
    try {
      const { data: cached } = await supabase
        .from('ai_cache')
        .select('respuesta')
        .eq('cache_key', cacheKey)
        .maybeSingle()

      if (cached?.respuesta) {
        setInterpretacion(`${nombre}, ${cached.respuesta}`)
        setFromCache(true)
        setCargando(false)
        return
      }
    } catch (err) {
      console.warn('[HoroscopoCeltico] Error leyendo caché:', err)
    }

    // ── 2. Fallback: Gemini ────────────────────────────────
    const prompt = `Eres un experto en el horóscopo celta de los árboles — un sistema moderno inspirado en las tradiciones celtas y el Ogham.

Árbol: ${arbol.nombre}
Fechas: ${arbol.fechas}
Keywords: ${arbol.keywords}
Descripción: ${arbol.descripcion}

Escribe una lectura de 3 párrafos para las personas del árbol ${arbol.nombre}.
Primero describe la energía y personalidad asociada al ${arbol.nombre} según esta tradición moderna.
Luego explica fortalezas que pueden aprovechar y desafíos que pueden trabajar.
Termina con un consejo específico basado en la sabiduría de este árbol.
Tono: reflexivo, simbólico, nunca predictivo ni alarmante.
Máximo 220 palabras. Solo el texto, sin título ni encabezado.`

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
          }),
        }
      )
      const data = await res.json()
      const texto = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      const tokens = data.usageMetadata?.totalTokenCount ?? 0

      setInterpretacion(`${nombre}, ${texto}`)
      setFromCache(false)

      // Guardar en caché permanente (sin expiración — el árbol no cambia)
      supabase.from('ai_cache').insert({
        cache_key: cacheKey,
        herramienta: 'horoscopo-celtico',
        prompt_hash: cacheKey,
        respuesta: texto,
        tokens_used: tokens,
        expires_at: null,
      }).then(() => {})

    } catch {
      setInterpretacion('El árbol guarda silencio. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  if (!arbol) return null

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => window.location.href = '/tradiciones'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Horóscopo Celta</p>
            <p className="text-purple-300 text-xs">Los 13 árboles · Inspiración celta moderna</p>
          </div>
        </div>

        <div className="bg-white/5 border border-green-500/20 rounded-3xl p-6 backdrop-blur flex flex-col items-center gap-3">
          <span className="text-6xl">{arbol.simbolo}</span>
          <p className="text-2xl font-bold">{arbol.nombre}</p>
          <p className="text-green-400 text-xs">{arbol.fechas}</p>
          <p className="text-purple-300 text-sm text-center">{arbol.keywords}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
          <p className="text-white/80 text-sm leading-relaxed">{arbol.descripcion}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur">
          <p className="text-white/30 text-xs text-center">El horóscopo celta de los árboles es una interpretación moderna inspirada en la cultura celta histórica y el Ogham.</p>
        </div>

        {!generado ? (
          <button
            onClick={generarLectura}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
          >
            Generar mi lectura del árbol
          </button>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-3">
              <p className="text-purple-300 text-xs tracking-widest uppercase">Tu lectura</p>
              {fromCache && <span className="text-green-400 text-xs">⚡ Instantáneo</span>}
            </div>
            {cargando ? (
              <div className="flex gap-2 py-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{interpretacion}</p>
            )}
          </div>
        )}

        {!cargando && interpretacion && (
          <Compartir
            titulo={`Mi árbol celta: ${arbol.nombre} ${arbol.simbolo}`}
            texto={interpretacion}
            hashtags={['HoroscopoCelta', 'Universe', arbol.nombre, 'Celtic']}
          />
        )}

        {generado && !cargando && (
          <button onClick={() => window.location.href = '/guia'} className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full">
            Explorar con mi Guía IA
          </button>
        )}

      </div>
    </div>
  )
}
