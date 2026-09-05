// src/pages/HoroscopoCeltico.tsx
import { useState, useEffect } from 'react'
import Compartir from '../components/Compartir'
import CtaUpsell from '../components/CtaUpsell'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import { llamarGemini, supabase, useUserPlan, useAnalytics, registrarEvento } from '../lib/paginaHelper'

// ── Árboles celtas por fecha de nacimiento ───────────────────
const ARBOLES_CELTAS = [
  { nombre: 'Abedul', simbolo: '🌿', fechas: 'Dec 24 – Jan 20', keywords: 'Nuevo comienzo · Pureza · Resiliencia', descripcion: 'El Abedul es el árbol del amanecer, el primero en florecer tras el invierno. Representa el valor de empezar de nuevo y la belleza en la sencillez.', elemento: 'Tierra', planeta: 'Venus', color: '#a3e635' },
  { nombre: 'Serbal', simbolo: '🍒', fechas: 'Jan 21 – Feb 17', keywords: 'Visión · Protección · Intuición', descripcion: 'El Serbal protege contra las fuerzas oscuras y abre la mente a lo invisible. Sus bayas rojas simbolizan la sangre de la vida y el poder de la percepción.', elemento: 'Fuego', planeta: 'Urano', color: '#f87171' },
  { nombre: 'Fresno', simbolo: '🌳', fechas: 'Feb 18 – Mar 17', keywords: 'Conexión · Imaginación · Adaptabilidad', descripcion: 'El Fresno une los mundos: sus raíces llegan al inframundo y sus ramas tocan el cielo. Árbol del Eje del Mundo en la tradición nórdica.', elemento: 'Agua', planeta: 'Neptuno', color: '#60a5fa' },
  { nombre: 'Aliso', simbolo: '🌲', fechas: 'Mar 18 – Apr 14', keywords: 'Confianza · Determinación · Espíritu guerrero', descripcion: 'El Aliso crece entre mundos, donde el agua toca la tierra. Árbol de los guerreros celtas, simboliza la confianza en uno mismo y la valentía ante lo desconocido.', elemento: 'Fuego', planeta: 'Marte', color: '#fb923c' },
  { nombre: 'Sauce', simbolo: '🌊', fechas: 'Apr 15 – May 12', keywords: 'Luna · Intuición · Ciclos femeninos', descripcion: 'El Sauce vive junto al agua y baila con la luna. Árbol de la intuición profunda, los sueños y el mundo emocional. Su flexibilidad es su mayor fortaleza.', elemento: 'Agua', planeta: 'Luna', color: '#818cf8' },
  { nombre: 'Espino', simbolo: '🌸', fechas: 'May 13 – Jun 9', keywords: 'Esperanza · Contraste · Dualidad', descripcion: 'El Espino florece en blanco puro sobre ramas de espinas. Representa la dualidad de la existencia: que de lo más difícil nace lo más bello.', elemento: 'Aire', planeta: 'Vulcano', color: '#f9a8d4' },
  { nombre: 'Roble', simbolo: '🌰', fechas: 'Jun 10 – Jul 7', keywords: 'Fuerza · Nobleza · Protección sagrada', descripcion: 'El Roble es el árbol sagrado de los druidas, rey del bosque. Símbolo de fortaleza, sabiduría acumulada y protección para quienes lo necesitan.', elemento: 'Tierra', planeta: 'Júpiter', color: '#a78bfa' },
  { nombre: 'Acebo', simbolo: '🍃', fechas: 'Jul 8 – Aug 4', keywords: 'Equilibrio · Unidad · Liderazgo', descripcion: 'El Acebo reina en la mitad oscura del año. Sus hojas perennes representan la permanencia, y su liderazgo nace de la calma y el equilibrio interior.', elemento: 'Fuego', planeta: 'Tierra', color: '#34d399' },
  { nombre: 'Avellano', simbolo: '🌰', fechas: 'Aug 5 – Sep 1', keywords: 'Sabiduría · Inspiración · Poesía', descripcion: 'Las avellanas del Salmón de la Sabiduría caían al río sagrado en la tradición celta. Este árbol es fuente de conocimiento poético e inspiración creativa.', elemento: 'Aire', planeta: 'Mercurio', color: '#fbbf24' },
  { nombre: 'Vid', simbolo: '🍇', fechas: 'Sep 2 – Sep 29', keywords: 'Profecía · Celebración · Alquimia', descripcion: 'La Vid transforma lo ordinario en extraordinario. Árbol de la abundancia otoñal, simboliza el poder de la transformación y la alegría de la cosecha.', elemento: 'Tierra', planeta: 'Luna', color: '#c084fc' },
  { nombre: 'Hiedra', simbolo: '🍀', fechas: 'Sep 30 – Oct 27', keywords: 'Tenacidad · Determinación · Laberinto interior', descripcion: 'La Hiedra nunca se rinde. Trepa hacia la luz sin importar el obstáculo. Simboliza el camino interior, el laberinto del alma y la determinación inquebrantable.', elemento: 'Tierra', planeta: 'Saturno', color: '#86efac' },
  { nombre: 'Caña', simbolo: '🎋', fechas: 'Oct 28 – Nov 24', keywords: 'Armonía · Propósito · Voz interior', descripcion: 'La Caña crea música cuando el viento la atraviesa. Árbol de los mensajeros y los viajes al inframundo, representa el propósito que da voz al alma.', elemento: 'Agua', planeta: 'Plutón', color: '#67e8f9' },
  { nombre: 'Saúco', simbolo: '🌑', fechas: 'Nov 25 – Dec 23', keywords: 'Transformación · Magia · Muerte y renacimiento', descripcion: 'El Saúco es el árbol de los umbrales. Vive entre mundos: el de los vivos y el de los ancestros. Árbol de la magia profunda y la transformación radical del ser.', elemento: 'Agua', planeta: 'Saturno', color: '#a78bfa' },
]

function getArbolCelta(fechaNacimiento: string) {
  const fecha = new Date(fechaNacimiento)
  const mes = fecha.getMonth() + 1
  const dia = fecha.getDate()
  const diaEnAnio = mes * 100 + dia

  if (diaEnAnio >= 1224 || diaEnAnio <= 120) return ARBOLES_CELTAS[0]  // Abedul
  if (diaEnAnio >= 121 && diaEnAnio <= 217) return ARBOLES_CELTAS[1]   // Serbal
  if (diaEnAnio >= 218 && diaEnAnio <= 317) return ARBOLES_CELTAS[2]   // Fresno
  if (diaEnAnio >= 318 && diaEnAnio <= 414) return ARBOLES_CELTAS[3]   // Aliso
  if (diaEnAnio >= 415 && diaEnAnio <= 512) return ARBOLES_CELTAS[4]   // Sauce
  if (diaEnAnio >= 513 && diaEnAnio <= 609) return ARBOLES_CELTAS[5]   // Espino
  if (diaEnAnio >= 610 && diaEnAnio <= 707) return ARBOLES_CELTAS[6]   // Roble
  if (diaEnAnio >= 708 && diaEnAnio <= 804) return ARBOLES_CELTAS[7]   // Acebo
  if (diaEnAnio >= 805 && diaEnAnio <= 901) return ARBOLES_CELTAS[8]   // Avellano
  if (diaEnAnio >= 902 && diaEnAnio <= 929) return ARBOLES_CELTAS[9]   // Vid
  if (diaEnAnio >= 930 && diaEnAnio <= 1027) return ARBOLES_CELTAS[10] // Hiedra
  if (diaEnAnio >= 1028 && diaEnAnio <= 1124) return ARBOLES_CELTAS[11] // Caña
  return ARBOLES_CELTAS[12] // Saúco
}

export default function HoroscopoCeltico() {
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [generado, setGenerado] = useState(false)
  const [fromCache, setFromCache] = useState(false)

  const nombre = localStorage.getItem('nombre') || 'viajero'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const fechaHoy = new Date().toISOString().split('T')[0]
  const hoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  const { esPremium, userId } = useUserPlan()
  useAnalytics('horoscopo-celtico')

  const arbol = getArbolCelta(fechaNacimiento)

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover' as const,
    backgroundPosition: 'center' as const,
  }

  const generarLectura = async () => {
    const t0 = Date.now()
    setCargando(true)
    setGenerado(true)

    // ── Caché ──────────────────────────────────────────────
    try {
      const { data: cached } = await supabase
        .from('horoscopo_cache')
        .select('contenido')
        .eq('signo', arbol.nombre.toLowerCase())
        .eq('fecha', fechaHoy)
        .eq('tipo', 'horoscopo-celtico')
        .maybeSingle()

      if (cached?.contenido) {
        setInterpretacion(cached.contenido)
        setFromCache(true)
        setCargando(false)
        registrarEvento({ herramienta: 'horoscopo-celtico', accion: 'lectura_ia', desde_cache: true, tiempo_respuesta_ms: Date.now() - t0, user_id: userId })
        return
      }
    } catch (err) { console.warn('[HoroscopoCeltico]', err) }

    // ── Gemini ─────────────────────────────────────────────
    const result = await llamarGemini({
      herramienta: 'horoscopo-celtico',
      prompt: `Eres un experto druida en el horóscopo celta de los 13 árboles sagrados (reconstrucción moderna basada en el calendario ogham).

Árbol del usuario: ${arbol.nombre} (${arbol.fechas})
Elemento: ${arbol.elemento} · Planeta: ${arbol.planeta}
Esencia del árbol: ${arbol.descripcion}
Keywords: ${arbol.keywords}
Fecha de hoy: ${hoy}

Escribe una lectura celta profunda y poética de 3-4 párrafos para alguien nacido bajo el árbol ${arbol.nombre}. 
- Primero describe la energía del árbol ${arbol.nombre} y qué aporta hoy específicamente.
- Luego habla de amor/relaciones desde la perspectiva de este árbol.
- Después de trabajo/proyectos con la energía de ${arbol.elemento}.
- Cierra con un mensaje del árbol sagrado y una pregunta de reflexión.

Tono: poético, simbólico, celta. Habla del árbol como un ser vivo y sabio. Nunca predictivo. Máximo 220 palabras. Solo el texto, sin título.`,
      userId,
      usarLite: false,
      cacheable: false,
      maxTokens: 400,
    })

    if (!result.error && result.texto) {
      setInterpretacion(result.texto)
      setFromCache(false)
      registrarEvento({ herramienta: 'horoscopo-celtico', accion: 'lectura_ia', desde_cache: false, tiempo_respuesta_ms: Date.now() - t0, user_id: userId })
      supabase.from('horoscopo_cache').insert({
        signo: arbol.nombre.toLowerCase(),
        fecha: fechaHoy,
        tipo: 'horoscopo-celtico',
        contenido: result.texto,
        tokens_used: result.tokensUsados,
      }).then(() => {})
    } else {
      setInterpretacion('El bosque guarda silencio hoy. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/78" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-5 py-10 gap-5">

        {/* Header */}
        <div className="flex items-center">
          <button onClick={() => window.location.href = '/tradiciones'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Horóscopo Celta</p>
            <p className="text-purple-300 text-xs">Los 13 árboles sagrados</p>
          </div>
        </div>

        {/* Árbol principal */}
        <div
          className="rounded-3xl p-6 backdrop-blur flex flex-col items-center gap-3 border"
          style={{ backgroundColor: `${arbol.color}15`, borderColor: `${arbol.color}40` }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-5xl"
            style={{ backgroundColor: `${arbol.color}20`, boxShadow: `0 0 30px ${arbol.color}40` }}
          >
            {arbol.simbolo}
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-2xl">{arbol.nombre}</p>
            <p className="text-xs mt-1" style={{ color: arbol.color }}>{arbol.fechas}</p>
            <p className="text-white/50 text-xs mt-1 capitalize">{hoy}</p>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {arbol.keywords.split(' · ').map(k => (
              <span key={k} className="text-xs px-3 py-1 rounded-full border"
                style={{ color: arbol.color, borderColor: `${arbol.color}40`, backgroundColor: `${arbol.color}10` }}>
                {k}
              </span>
            ))}
          </div>
        </div>

        {/* Descripción del árbol */}
        <div className="bg-white/6 border border-white/15 rounded-2xl p-4 backdrop-blur">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">🌳 Tu árbol sagrado</p>
          <p className="text-white/80 text-sm leading-relaxed">{arbol.descripcion}</p>
        </div>

        {/* Atributos */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/6 border border-white/15 rounded-2xl p-3 backdrop-blur text-center">
            <p className="text-white/40 text-xs mb-1">Elemento</p>
            <p className="text-white font-semibold text-sm">{arbol.elemento}</p>
          </div>
          <div className="bg-white/6 border border-white/15 rounded-2xl p-3 backdrop-blur text-center">
            <p className="text-white/40 text-xs mb-1">Planeta</p>
            <p className="text-white font-semibold text-sm">{arbol.planeta}</p>
          </div>
        </div>

        {/* Botón generar o resultado */}
        {!generado ? (
          <button
            onClick={generarLectura}
            className="w-full text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
            style={{ background: `linear-gradient(to right, ${arbol.color}99, #c084fc)` }}
          >
            🌿 Recibir el mensaje del {arbol.nombre}
          </button>
        ) : (
          <div className="bg-white/6 border border-white/15 rounded-3xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <p className="text-purple-300 text-xs tracking-widest uppercase">Mensaje del bosque</p>
              {fromCache && <span className="text-green-400 text-xs">⚡ Instantáneo</span>}
            </div>
            {cargando ? (
              <div className="flex gap-2 py-4 justify-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{interpretacion}</p>
            )}
          </div>
        )}

        {/* Post-lectura */}
        {!cargando && interpretacion && (
          <>
            <DisclaimerIA />
            <Valoracion herramienta="horoscopo-celtico" userId={userId} />
            <Compartir
              titulo={`Mi árbol celta: ${arbol.nombre} ${arbol.simbolo}`}
              texto={interpretacion}
              hashtags={['HoroscopoCeltico', 'Universe', arbol.nombre, 'Druida']}
            />
            {!esPremium && <CtaUpsell herramienta="horóscopo celta" />}
            <button
              onClick={() => window.location.href = '/guia'}
              className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full"
            >
              Explorar con mi Guía IA
            </button>
          </>
        )}

        {/* Nota histórica */}
        <div className="bg-white/4 border border-white/10 rounded-2xl p-4">
          <p className="text-white/30 text-xs leading-relaxed">
            ℹ️ El horóscopo celta de los árboles es una reconstrucción moderna inspirada en el calendario ogham y las tradiciones druidicas. No existe evidencia histórica de que los celtas antiguos usaran un sistema de horóscopo similar al zodíaco.
          </p>
        </div>

      </div>
    </div>
  )
}
