// src/pages/HoroscopoCeltico.tsx
import { useState } from 'react'
import Compartir from '../components/Compartir'
import CtaUpsell from '../components/CtaUpsell'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import { llamarGemini, supabase, useUserPlan, useAnalytics, registrarEvento } from '../lib/paginaHelper'

const ARBOLES_CELTAS = [
  { nombre: 'Abedul',   icono: '🪨', color: '#a3e635', fechas: 'Dec 24 – Jan 20', keywords: ['Nuevo comienzo', 'Pureza', 'Resiliencia'],   elemento: 'Tierra',  planeta: 'Venus',   descripcion: 'El Abedul es el árbol del amanecer, el primero en florecer tras el invierno. Representa el valor de empezar de nuevo y la belleza en la sencillez.' },
  { nombre: 'Serbal',   icono: '🔴', color: '#f87171', fechas: 'Jan 21 – Feb 17', keywords: ['Visión', 'Protección', 'Intuición'],           elemento: 'Fuego',   planeta: 'Urano',   descripcion: 'El Serbal protege contra las fuerzas oscuras y abre la mente a lo invisible. Sus bayas rojas simbolizan la sangre de la vida y el poder de la percepción.' },
  { nombre: 'Fresno',   icono: '🌊', color: '#60a5fa', fechas: 'Feb 18 – Mar 17', keywords: ['Conexión', 'Imaginación', 'Adaptabilidad'],    elemento: 'Agua',    planeta: 'Neptuno', descripcion: 'El Fresno une los mundos: sus raíces llegan al inframundo y sus ramas tocan el cielo. Árbol del Eje del Mundo en la tradición nórdica.' },
  { nombre: 'Aliso',    icono: '⚔️', color: '#fb923c', fechas: 'Mar 18 – Apr 14', keywords: ['Confianza', 'Determinación', 'Valentía'],      elemento: 'Fuego',   planeta: 'Marte',   descripcion: 'El Aliso crece entre mundos, donde el agua toca la tierra. Árbol de los guerreros celtas, simboliza la confianza en uno mismo y la valentía ante lo desconocido.' },
  { nombre: 'Sauce',    icono: '🌙', color: '#818cf8', fechas: 'Apr 15 – May 12', keywords: ['Luna', 'Intuición', 'Emoción'],                 elemento: 'Agua',    planeta: 'Luna',    descripcion: 'El Sauce vive junto al agua y baila con la luna. Árbol de la intuición profunda, los sueños y el mundo emocional. Su flexibilidad es su mayor fortaleza.' },
  { nombre: 'Espino',   icono: '🌸', color: '#f9a8d4', fechas: 'May 13 – Jun 9',  keywords: ['Esperanza', 'Contraste', 'Dualidad'],          elemento: 'Aire',    planeta: 'Vulcano', descripcion: 'El Espino florece en blanco puro sobre ramas de espinas. Representa la dualidad de la existencia: que de lo más difícil nace lo más bello.' },
  { nombre: 'Roble',    icono: '🏛️', color: '#a78bfa', fechas: 'Jun 10 – Jul 7',  keywords: ['Fuerza', 'Nobleza', 'Protección'],             elemento: 'Tierra',  planeta: 'Júpiter', descripcion: 'El Roble es el árbol sagrado de los druidas, rey del bosque. Símbolo de fortaleza, sabiduría acumulada y protección para quienes lo necesitan.' },
  { nombre: 'Acebo',    icono: '☀️', color: '#34d399', fechas: 'Jul 8 – Aug 4',   keywords: ['Equilibrio', 'Unidad', 'Liderazgo'],           elemento: 'Fuego',   planeta: 'Tierra',  descripcion: 'El Acebo reina en la mitad oscura del año. Sus hojas perennes representan la permanencia, y su liderazgo nace de la calma y el equilibrio interior.' },
  { nombre: 'Avellano', icono: '💧', color: '#fbbf24', fechas: 'Aug 5 – Sep 1',   keywords: ['Sabiduría', 'Inspiración', 'Poesía'],          elemento: 'Aire',    planeta: 'Mercurio',descripcion: 'Las avellanas del Salmón de la Sabiduría caían al río sagrado en la tradición celta. Este árbol es fuente de conocimiento poético e inspiración creativa.' },
  { nombre: 'Vid',      icono: '🍂', color: '#c084fc', fechas: 'Sep 2 – Sep 29',  keywords: ['Profecía', 'Celebración', 'Alquimia'],         elemento: 'Tierra',  planeta: 'Luna',    descripcion: 'La Vid transforma lo ordinario en extraordinario. Árbol de la abundancia otoñal, simboliza el poder de la transformación y la alegría de la cosecha.' },
  { nombre: 'Hiedra',   icono: '🌀', color: '#86efac', fechas: 'Sep 30 – Oct 27', keywords: ['Tenacidad', 'Determinación', 'Laberinto'],     elemento: 'Tierra',  planeta: 'Saturno', descripcion: 'La Hiedra nunca se rinde. Trepa hacia la luz sin importar el obstáculo. Simboliza el camino interior, el laberinto del alma y la determinación inquebrantable.' },
  { nombre: 'Caña',     icono: '🎵', color: '#67e8f9', fechas: 'Oct 28 – Nov 24', keywords: ['Armonía', 'Propósito', 'Voz interior'],        elemento: 'Agua',    planeta: 'Plutón',  descripcion: 'La Caña crea música cuando el viento la atraviesa. Árbol de los mensajeros y los viajes al inframundo, representa el propósito que da voz al alma.' },
  { nombre: 'Saúco',    icono: '🌑', color: '#a78bfa', fechas: 'Nov 25 – Dec 23', keywords: ['Transformación', 'Magia', 'Renacimiento'],     elemento: 'Agua',    planeta: 'Saturno', descripcion: 'El Saúco es el árbol de los umbrales. Vive entre mundos: el de los vivos y el de los ancestros. Árbol de la magia profunda y la transformación radical del ser.' },
]

function getArbol(fechaNacimiento: string) {
  const f = new Date(fechaNacimiento)
  const d = (f.getMonth() + 1) * 100 + f.getDate()
  if (d >= 1224 || d <= 120) return ARBOLES_CELTAS[0]
  if (d <= 217) return ARBOLES_CELTAS[1]
  if (d <= 317) return ARBOLES_CELTAS[2]
  if (d <= 414) return ARBOLES_CELTAS[3]
  if (d <= 512) return ARBOLES_CELTAS[4]
  if (d <= 609) return ARBOLES_CELTAS[5]
  if (d <= 707) return ARBOLES_CELTAS[6]
  if (d <= 804) return ARBOLES_CELTAS[7]
  if (d <= 901) return ARBOLES_CELTAS[8]
  if (d <= 929) return ARBOLES_CELTAS[9]
  if (d <= 1027) return ARBOLES_CELTAS[10]
  if (d <= 1124) return ARBOLES_CELTAS[11]
  return ARBOLES_CELTAS[12]
}

// SVG minimalista de árbol genérico con el color del signo
function ArbolSVG({ color }: { color: string }) {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="24" r="18" fill={color} opacity="0.25" />
      <circle cx="32" cy="22" r="14" fill={color} opacity="0.45" />
      <circle cx="32" cy="20" r="10" fill={color} opacity="0.85" />
      <rect x="29" y="36" width="6" height="14" rx="3" fill={color} opacity="0.6" />
    </svg>
  )
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

  const arbol = getArbol(fechaNacimiento)

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover' as const,
    backgroundPosition: 'center' as const,
  }

  const generarLectura = async () => {
    const t0 = Date.now()
    setCargando(true)
    setGenerado(true)

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

    const result = await llamarGemini({
      herramienta: 'horoscopo-celtico',
      prompt: `Eres un druida experto en el horóscopo celta de los 13 árboles sagrados.

Árbol: ${arbol.nombre} (${arbol.fechas})
Elemento: ${arbol.elemento} · Planeta: ${arbol.planeta}
Esencia: ${arbol.descripcion}
Fecha: ${hoy}

Escribe una lectura celta de 3 párrafos para alguien nacido bajo el ${arbol.nombre}.
Párrafo 1: energía del árbol ${arbol.nombre} hoy, qué nos invita a hacer.
Párrafo 2: mensaje para el amor y las relaciones desde la sabiduría de este árbol.
Párrafo 3: mensaje para el trabajo y los proyectos con la energía del ${arbol.elemento}. Termina con una pregunta de reflexión.
Tono: poético, profundo, nunca predictivo. Habla del árbol como ser vivo y sabio. Máximo 200 palabras.`,
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
        signo: arbol.nombre.toLowerCase(), fecha: fechaHoy,
        tipo: 'horoscopo-celtico', contenido: result.texto, tokens_used: result.tokensUsados,
      }).then(() => {})
    } else {
      setInterpretacion('El bosque guarda silencio hoy. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/88" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-5 py-10 gap-5">

        {/* Header */}
        <div className="flex items-center">
          <button onClick={() => window.location.href = '/tradiciones'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Horóscopo Celta</p>
            <p className="text-purple-300 text-xs">Los 13 árboles sagrados</p>
          </div>
        </div>

        {/* Árbol hero */}
        <div className="rounded-3xl p-6 flex flex-col items-center gap-4 border"
          style={{ backgroundColor: `${arbol.color}18`, borderColor: `${arbol.color}50` }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${arbol.color}20`, boxShadow: `0 0 32px ${arbol.color}50` }}>
            <ArbolSVG color={arbol.color} />
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-3xl tracking-wide">{arbol.nombre}</p>
            <p className="text-sm font-medium mt-1" style={{ color: arbol.color }}>{arbol.fechas}</p>
            <p className="text-white/60 text-xs mt-1 capitalize">{hoy}</p>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {arbol.keywords.map(k => (
              <span key={k} className="text-xs font-semibold px-3 py-1 rounded-full border"
                style={{ color: arbol.color, borderColor: `${arbol.color}60`, backgroundColor: `${arbol.color}15` }}>
                {k}
              </span>
            ))}
          </div>
        </div>

        {/* Descripción */}
        <div className="bg-black/60 border border-white/20 rounded-2xl p-4">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">🌳 Tu árbol sagrado</p>
          <p className="text-white text-sm leading-relaxed">{arbol.descripcion}</p>
        </div>

        {/* Elemento y Planeta */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/60 border border-white/20 rounded-2xl p-4 text-center">
            <p className="text-white/50 text-xs mb-1">Elemento</p>
            <p className="text-white font-bold text-base">{arbol.elemento}</p>
          </div>
          <div className="bg-black/60 border border-white/20 rounded-2xl p-4 text-center">
            <p className="text-white/50 text-xs mb-1">Planeta regente</p>
            <p className="text-white font-bold text-base">{arbol.planeta}</p>
          </div>
        </div>

        {/* Botón o lectura */}
        {!generado ? (
          <button
            onClick={generarLectura}
            className="w-full text-white font-bold py-4 rounded-full text-base hover:opacity-90 transition"
            style={{ background: `linear-gradient(to right, ${arbol.color}cc, #c084fc)` }}
          >
            Recibir el mensaje del {arbol.nombre}
          </button>
        ) : (
          <div className="bg-black/70 border border-white/25 rounded-3xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-purple-300 text-xs tracking-widest uppercase font-semibold">Mensaje del bosque</p>
              {fromCache && <span className="text-green-400 text-xs font-medium">⚡ Instantáneo</span>}
            </div>
            {cargando ? (
              <div className="flex gap-2 py-4 justify-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{interpretacion}</p>
            )}
          </div>
        )}

        {!cargando && interpretacion && interpretacion !== 'El bosque guarda silencio hoy. Inténtalo de nuevo.' && (
          <>
            <DisclaimerIA />
            <Valoracion herramienta="horoscopo-celtico" userId={userId} />
            <Compartir
              titulo={`Mi árbol celta: ${arbol.nombre}`}
              texto={interpretacion}
              hashtags={['HoroscopoCeltico', 'Universe', arbol.nombre, 'Druida']}
            />
            {!esPremium && <CtaUpsell herramienta="horóscopo celta" />}
            <button onClick={() => window.location.href = '/guia'}
              className="w-full bg-black/50 border border-white/25 text-white font-semibold py-4 rounded-full">
              Explorar con mi Guía IA
            </button>
          </>
        )}

        {/* Nota histórica */}
        <div className="bg-black/50 border border-white/10 rounded-2xl p-4">
          <p className="text-white/40 text-xs leading-relaxed">
            ℹ️ El horóscopo celta de los árboles es una reconstrucción moderna inspirada en el calendario ogham. No existe evidencia histórica de que los celtas usaran un sistema de horóscopo similar al zodíaco griego.
          </p>
        </div>

      </div>
    </div>
  )
}
