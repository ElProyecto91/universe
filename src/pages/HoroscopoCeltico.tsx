// src/pages/HoroscopoCeltico.tsx

import { useState } from 'react'
import { limpiarMarkdown } from '../components/TextoIA'
import Compartir from '../components/Compartir'
import CtaUpsell from '../components/CtaUpsell'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import { llamarGemini, supabase, useUserPlan, useAnalytics, registrarEvento } from '../lib/paginaHelper'

const ARBOLES_CELTAS = [
  { nombre: 'Abedul',   imagen: '/arboles/abedul.jpg',  color: '#a3e635', fechas: 'Dec 24 – Jan 20', keywords: ['Nuevo comienzo', 'Pureza', 'Resiliencia'],   elemento: 'Tierra',  planeta: 'Venus',    descripcion: 'El Abedul es el árbol del amanecer, el primero en florecer tras el invierno. Representa el valor de empezar de nuevo y la belleza en la sencillez.' },
  { nombre: 'Serbal',   imagen: '/arboles/serbal.jpg',  color: '#f87171', fechas: 'Jan 21 – Feb 17', keywords: ['Visión', 'Protección', 'Intuición'],           elemento: 'Fuego',   planeta: 'Urano',    descripcion: 'El Serbal protege contra las fuerzas oscuras y abre la mente a lo invisible. Sus bayas rojas simbolizan la sangre de la vida y el poder de la percepción.' },
  { nombre: 'Fresno',   imagen: '/arboles/fresno.jpg',  color: '#60a5fa', fechas: 'Feb 18 – Mar 17', keywords: ['Conexión', 'Imaginación', 'Adaptabilidad'],    elemento: 'Agua',    planeta: 'Neptuno',  descripcion: 'El Fresno une los mundos: sus raíces llegan al inframundo y sus ramas tocan el cielo. Árbol del Eje del Mundo en la tradición nórdica.' },
  { nombre: 'Aliso',    imagen: '/arboles/aliso.jpg',   color: '#fb923c', fechas: 'Mar 18 – Apr 14', keywords: ['Confianza', 'Determinación', 'Valentía'],      elemento: 'Fuego',   planeta: 'Marte',    descripcion: 'El Aliso crece entre mundos, donde el agua toca la tierra. Árbol de los guerreros celtas, simboliza la confianza en uno mismo y la valentía ante lo desconocido.' },
  { nombre: 'Sauce',    imagen: '/arboles/sauce.jpg',   color: '#818cf8', fechas: 'Apr 15 – May 12', keywords: ['Luna', 'Intuición', 'Emoción'],                 elemento: 'Agua',    planeta: 'Luna',     descripcion: 'El Sauce vive junto al agua y baila con la luna. Árbol de la intuición profunda, los sueños y el mundo emocional. Su flexibilidad es su mayor fortaleza.' },
  { nombre: 'Espino',   imagen: '/arboles/espino.jpg',  color: '#f9a8d4', fechas: 'May 13 – Jun 9',  keywords: ['Esperanza', 'Contraste', 'Dualidad'],          elemento: 'Aire',    planeta: 'Vulcano',  descripcion: 'El Espino florece en blanco puro sobre ramas de espinas. Representa la dualidad de la existencia: que de lo más difícil nace lo más bello.' },
  { nombre: 'Roble',    imagen: '/arboles/roble.jpg',   color: '#a78bfa', fechas: 'Jun 10 – Jul 7',  keywords: ['Fuerza', 'Nobleza', 'Protección'],             elemento: 'Tierra',  planeta: 'Júpiter',  descripcion: 'El Roble es el árbol sagrado de los druidas, rey del bosque. Símbolo de fortaleza, sabiduría acumulada y protección para quienes lo necesitan.' },
  { nombre: 'Acebo',    imagen: '/arboles/acebo.jpg',   color: '#34d399', fechas: 'Jul 8 – Aug 4',   keywords: ['Equilibrio', 'Unidad', 'Liderazgo'],           elemento: 'Fuego',   planeta: 'Tierra',   descripcion: 'El Acebo reina en la mitad oscura del año. Sus hojas perennes representan la permanencia, y su liderazgo nace de la calma y el equilibrio interior.' },
  { nombre: 'Avellano', imagen: '/arboles/avellano.jpg',color: '#fbbf24', fechas: 'Aug 5 – Sep 1',   keywords: ['Sabiduría', 'Inspiración', 'Poesía'],          elemento: 'Aire',    planeta: 'Mercurio', descripcion: 'Las avellanas del Salmón de la Sabiduría caían al río sagrado en la tradición celta. Este árbol es fuente de conocimiento poético e inspiración creativa.' },
  { nombre: 'Vid',      imagen: '/arboles/vid.jpg',     color: '#c084fc', fechas: 'Sep 2 – Sep 29',  keywords: ['Profecía', 'Celebración', 'Alquimia'],         elemento: 'Tierra',  planeta: 'Luna',     descripcion: 'La Vid transforma lo ordinario en extraordinario. Árbol de la abundancia otoñal, simboliza el poder de la transformación y la alegría de la cosecha.' },
  { nombre: 'Hiedra',   imagen: '/arboles/hiedra.jpg',  color: '#86efac', fechas: 'Sep 30 – Oct 27', keywords: ['Tenacidad', 'Determinación', 'Laberinto'],     elemento: 'Tierra',  planeta: 'Saturno',  descripcion: 'La Hiedra nunca se rinde. Trepa hacia la luz sin importar el obstáculo. Simboliza el camino interior, el laberinto del alma y la determinación inquebrantable.' },
  { nombre: 'Caña',     imagen: '/arboles/cana.jpg',    color: '#67e8f9', fechas: 'Oct 28 – Nov 24', keywords: ['Armonía', 'Propósito', 'Voz interior'],        elemento: 'Agua',    planeta: 'Plutón',   descripcion: 'La Caña crea música cuando el viento la atraviesa. Árbol de los mensajeros y los viajes al inframundo, representa el propósito que da voz al alma.' },
  { nombre: 'Saúco',    imagen: '/arboles/sauco.jpg',   color: '#a78bfa', fechas: 'Nov 25 – Dec 23', keywords: ['Transformación', 'Magia', 'Renacimiento'],     elemento: 'Agua',    planeta: 'Saturno',  descripcion: 'El Saúco es el árbol de los umbrales. Vive entre mundos: el de los vivos y el de los ancestros. Árbol de la magia profunda y la transformación radical del ser.' },
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
    backgroundSize: 'cover',
    backgroundPosition: 'center',
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
      prompt: [
        'Escribe en español, en prosa, sin listas, sin asteriscos, sin markdown.',
        'Eres un druida experto en el horóscopo celta de los 13 árboles sagrados.',
        '',
        `Árbol: ${arbol.nombre} (${arbol.fechas})`,
        `Elemento: ${arbol.elemento} · Planeta: ${arbol.planeta}`,
        `Esencia: ${arbol.descripcion}`,
        `Fecha: ${hoy}`,
        '',
        `Escribe una lectura celta de 3 párrafos para alguien nacido bajo el ${arbol.nombre}.`,
        `Párrafo 1: energía del árbol ${arbol.nombre} hoy, qué nos invita a hacer.`,
        'Párrafo 2: mensaje para el amor y las relaciones desde la sabiduría de este árbol.',
        `Párrafo 3: mensaje para el trabajo y los proyectos con la energía del ${arbol.elemento}. Termina con una pregunta de reflexión.`,
        'Tono: poético, profundo, nunca predictivo. Habla del árbol como ser vivo y sabio. Máximo 200 palabras.',
      ].join('\n'),
      userId,
      usarLite: false,
      cacheable: false,
      maxTokens: 1200,
    })

    if (!result.error && result.texto) {
      setInterpretacion(limpiarMarkdown(result.texto))
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
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.88)' }} />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-5 py-10 gap-5">

        <div className="flex items-center">
          <button onClick={() => window.location.href = '/tradiciones'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Horóscopo Celta</p>
            <p className="text-purple-300 text-xs">Los 13 árboles sagrados</p>
          </div>
        </div>

        {/* Árbol hero con imagen real */}
        <div className="rounded-3xl overflow-hidden border" style={{ borderColor: `${arbol.color}50` }}>
          <div className="relative h-52">
            <img
              src={arbol.imagen}
              alt={arbol.nombre}
              className="w-full h-full object-cover"
              style={{ filter: 'sepia(0.3) brightness(0.7)' }}
            />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)` }} />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-white font-bold text-3xl tracking-wide">{arbol.nombre}</p>
              <p className="text-sm font-medium mt-1" style={{ color: arbol.color }}>{arbol.fechas}</p>
              <p className="text-white/60 text-xs mt-1 capitalize">{hoy}</p>
            </div>
          </div>
          <div className="px-5 py-3 flex gap-2 flex-wrap" style={{ backgroundColor: `${arbol.color}15` }}>
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

        {!generado ? (
          <button onClick={generarLectura}
            className="w-full text-white font-bold py-4 rounded-full text-base hover:opacity-90 transition"
            style={{ background: `linear-gradient(to right, ${arbol.color}cc, #c084fc)` }}>
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
              hashtags={['HoroscopoCeltico', 'Universe', arbol.nombre, 'Druida']} />
            {!esPremium && <CtaUpsell herramienta="horóscopo celta" />}
            <button onClick={() => window.location.href = '/guia'}
              className="w-full bg-black/50 border border-white/25 text-white font-semibold py-4 rounded-full">
              Explorar con mi Guía IA
            </button>
          </>
        )}

        <div className="bg-black/50 border border-white/10 rounded-2xl p-4">
          <p className="text-white/40 text-xs leading-relaxed">
            ℹ️ El horóscopo celta de los árboles es una reconstrucción moderna inspirada en el calendario ogham. No existe evidencia histórica de que los celtas usaran un sistema de horóscopo similar al zodíaco griego.
          </p>
        </div>

      </div>
    </div>
  )
}