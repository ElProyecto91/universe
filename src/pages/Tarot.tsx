import { useState } from 'react'
import { getCartaSVG } from '../components/svg/TarotSVG'
import Compartir from '../components/Compartir'
import Paywall from '../components/Paywall'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import { llamarGemini, useUserPlan, useAnalytics, registrarEvento } from '../lib/paginaHelper'
import { guardarLectura } from '../hooks/useHistorial'

const ARCANOS_MAYORES = [
  { nombre: 'El Mago', numero: 'I', keywords: 'Voluntad · Poder · Acción' },
  { nombre: 'La Sacerdotisa', numero: 'II', keywords: 'Intuición · Misterio · Sabiduría interior' },
  { nombre: 'La Emperatriz', numero: 'III', keywords: 'Abundancia · Creatividad · Naturaleza' },
  { nombre: 'El Emperador', numero: 'IV', keywords: 'Autoridad · Estructura · Protección' },
  { nombre: 'El Sumo Sacerdote', numero: 'V', keywords: 'Tradición · Guía espiritual · Fe' },
  { nombre: 'Los Amantes', numero: 'VI', keywords: 'Unión · Elección · Armonía' },
  { nombre: 'El Carro', numero: 'VII', keywords: 'Control · Victoria · Determinación' },
  { nombre: 'La Fuerza', numero: 'VIII', keywords: 'Coraje · Paciencia · Compasión' },
  { nombre: 'El Ermitaño', numero: 'IX', keywords: 'Soledad · Reflexión · Búsqueda interior' },
  { nombre: 'La Rueda de la Fortuna', numero: 'X', keywords: 'Ciclos · Destino · Cambio' },
  { nombre: 'La Justicia', numero: 'XI', keywords: 'Equilibrio · Verdad · Causa y efecto' },
  { nombre: 'El Colgado', numero: 'XII', keywords: 'Pausa · Sacrificio · Nueva perspectiva' },
  { nombre: 'La Muerte', numero: 'XIII', keywords: 'Transformación · Fin de ciclo · Renacimiento' },
  { nombre: 'La Templanza', numero: 'XIV', keywords: 'Moderación · Paciencia · Propósito' },
  { nombre: 'El Diablo', numero: 'XV', keywords: 'Ataduras · Sombra · Materialismo' },
  { nombre: 'La Torre', numero: 'XVI', keywords: 'Ruptura · Revelación · Caos necesario' },
  { nombre: 'La Estrella', numero: 'XVII', keywords: 'Esperanza · Inspiración · Renovación' },
  { nombre: 'La Luna', numero: 'XVIII', keywords: 'Ilusión · Inconsciente · Miedos' },
  { nombre: 'El Sol', numero: 'XIX', keywords: 'Alegría · Claridad · Éxito' },
  { nombre: 'El Juicio', numero: 'XX', keywords: 'Despertar · Absolución · Llamada interior' },
  { nombre: 'El Mundo', numero: 'XXI', keywords: 'Plenitud · Integración · Completitud' },
  { nombre: 'El Loco', numero: '0', keywords: 'Inicio · Libertad · Potencial infinito' },
]

const TIRADAS = [
  { id: 'una', nombre: '1 carta', descripcion: 'Mensaje del día', cantidad: 1, premium: false },
  { id: 'tres', nombre: '3 cartas', descripcion: 'Pasado · Presente · Futuro', cantidad: 3, premium: true },
  { id: 'relacion', nombre: 'Relación', descripcion: 'Tú · Él/Ella · Conexión', cantidad: 3, premium: true },
  { id: 'profunda', nombre: 'Lectura profunda', descripcion: '5 cartas · Visión completa', cantidad: 5, premium: true },
]

function cartaAleatoria() {
  const carta = ARCANOS_MAYORES[Math.floor(Math.random() * ARCANOS_MAYORES.length)]
  const invertida = Math.random() > 0.7
  return { ...carta, invertida }
}

export default function Tarot() {
  const [tiradaSeleccionada, setTiradaSeleccionada] = useState<string | null>(null)
  const [cartas, setCartas] = useState<any[]>([])
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'elegir' | 'revelar' | 'interpretar'>('elegir')
  const [errorMsg, setErrorMsg] = useState('')
  const [mostrarPaywall, setMostrarPaywall] = useState(false)

  const { esPremium, userId } = useUserPlan()
  useAnalytics('tarot')

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const nombre = localStorage.getItem('nombre') || 'Luna'
  const signo = localStorage.getItem('signo') || 'Leo'

  const iniciarTirada = (tirada: typeof TIRADAS[0]) => {
    // Bloquear tiradas premium para usuarios free
    if (tirada.premium && !esPremium) {
      setMostrarPaywall(true)
      registrarEvento({ herramienta: 'tarot', accion: 'paywall_mostrado', user_id: userId })
      return
    }
    setTiradaSeleccionada(tirada.id)
    const nuevasCartas = Array.from({ length: tirada.cantidad }, cartaAleatoria)
    setCartas(nuevasCartas)
    setFase('revelar')
    setErrorMsg('')
    registrarEvento({ herramienta: 'tarot', accion: 'tirada_iniciada', user_id: userId })
  }

  const interpretarCartas = async () => {
    const t0 = Date.now()
    setCargando(true)
    setFase('interpretar')
    setErrorMsg('')

    const nombresCartas = cartas.map(c => `${c.nombre}${c.invertida ? ' (invertida)' : ''}`).join(', ')
    const tirada = TIRADAS.find(t => t.id === tiradaSeleccionada)

    const result = await llamarGemini({
      herramienta: 'tarot',
      prompt: `Eres una tarotista sabia y poética. Interpreta estas cartas para ${nombre}, signo ${signo}.
Tirada: ${tirada?.descripcion}
Cartas: ${nombresCartas}

Da una interpretación profunda, poética y personal. Conecta las cartas entre sí. No seas genérica. Habla directamente a ${nombre}. Máximo 200 palabras. Termina con una pregunta de reflexión.`,
      userId,
      cacheable: false,
      maxTokens: 400,
    })

    if (result.error) {
      setErrorMsg(result.error)
    } else {
      setInterpretacion(result.texto)
      registrarEvento({ herramienta: 'tarot', accion: 'lectura_ia', tiempo_respuesta_ms: Date.now() - t0, user_id: userId })
      guardarLectura({
        herramienta: 'tarot',
        titulo: `Tirada: ${tirada?.descripcion} · ${cartas.map(c => c.nombre).join(', ')}`,
        contenido: result.texto,
        metadatos: { tirada: tiradaSeleccionada, cartas: cartas.map(c => ({ nombre: c.nombre, invertida: c.invertida })) },
      })
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      {mostrarPaywall && (
        <Paywall
          motivo="herramienta"
          herramienta="Tiradas de Tarot completas"
          onCerrar={() => setMostrarPaywall(false)}
        />
      )}

      <div className="relative z-10 flex items-center px-4 py-4 border-b border-white/10">
        <button onClick={() => window.location.href = '/universo'} className="text-purple-300 text-sm">← Volver</button>
        <div className="flex-1 text-center">
          <p className="text-white font-semibold text-sm">Tarot · UNIVERSE</p>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 py-8 gap-8">

        {fase === 'elegir' && (
          <>
            <div className="text-center">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Elige tu lectura</p>
              <p className="text-white/60 text-sm">Respira. Centra tu mente. Elige.</p>
            </div>
            <div className="w-full max-w-sm flex flex-col gap-3">
              {TIRADAS.map(t => (
                <button
                  key={t.id}
                  onClick={() => iniciarTirada(t)}
                  className="w-full bg-white/8 border border-white/20 rounded-2xl p-4 text-left hover:bg-purple-600/20 hover:border-purple-500/40 transition backdrop-blur"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">{t.nombre}</p>
                      <p className="text-purple-300/70 text-xs mt-1">{t.descripcion}</p>
                    </div>
                    {t.premium && !esPremium && (
                      <span className="text-xs bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">✨ Premium</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {fase === 'revelar' && (
          <>
            <div className="text-center">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Tus cartas</p>
              <p className="text-white/60 text-sm">Las cartas han hablado</p>
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              {cartas.map((carta, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{
                      width: cartas.length === 1 ? '140px' : cartas.length <= 3 ? '90px' : '70px',
                      height: cartas.length === 1 ? '220px' : cartas.length <= 3 ? '140px' : '110px',
                      transform: carta.invertida ? 'rotate(180deg)' : 'none',
                      boxShadow: '0 0 20px rgba(139,92,246,0.3)',
                    }}
                  >
                    {getCartaSVG(carta.nombre)}
                  </div>
                  <p className="text-white text-xs font-medium text-center" style={{ maxWidth: cartas.length > 3 ? '70px' : '100px' }}>{carta.nombre}</p>
                  {carta.invertida && <p className="text-purple-400 text-xs">Invertida</p>}
                  <p className="text-white/40 text-xs text-center" style={{ maxWidth: '80px' }}>{carta.keywords.split(' · ')[0]}</p>
                </div>
              ))}
            </div>
            <button
              onClick={interpretarCartas}
              className="w-full max-w-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
            >
              Interpretar mis cartas
            </button>
          </>
        )}

        {fase === 'interpretar' && (
          <>
            <div className="flex gap-3 flex-wrap justify-center">
              {cartas.map((carta, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="rounded-xl overflow-hidden" style={{ width: '70px', height: '110px', transform: carta.invertida ? 'rotate(180deg)' : 'none' }}>
                    {getCartaSVG(carta.nombre)}
                  </div>
                  <p className="text-white/60 text-xs text-center" style={{ maxWidth: '70px' }}>{carta.nombre}</p>
                </div>
              ))}
            </div>

            <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-4">Interpretación</p>
              {cargando ? (
                <div className="flex gap-2 justify-center py-4">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : errorMsg ? (
                <p className="text-red-400 text-sm text-center">{errorMsg}</p>
              ) : (
                <p className="text-white/90 text-sm leading-relaxed">{interpretacion}</p>
              )}
            </div>

            {!cargando && interpretacion && (
              <div className="w-full max-w-sm flex flex-col gap-4">
                <DisclaimerIA />
                <Valoracion herramienta="tarot" userId={userId} />
                <Compartir
                  titulo={`Mi tirada de Tarot: ${cartas.map(c => c.nombre).join(', ')}`}
                  texto={interpretacion}
                  hashtags={['Tarot', 'Universe', 'Lectura', 'Astrologia']}
                />
              </div>
            )}

            {!cargando && (
              <div className="w-full max-w-sm flex flex-col gap-3">
                <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">
                  Explorar con mi Guía IA
                </button>
                <button onClick={() => window.location.href = '/experto'} className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full hover:bg-white/20 transition backdrop-blur">
                  Hablar con un Experto
                </button>
                <button onClick={() => { setFase('elegir'); setCartas([]); setInterpretacion(''); setErrorMsg('') }} className="w-full text-purple-300/60 text-sm py-2">
                  Nueva tirada
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
