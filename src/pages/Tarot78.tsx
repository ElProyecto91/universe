import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserPlan, incrementarConsulta } from '../hooks/useUserPlan'
import { useAnalytics } from '../hooks/useAnalytics'
import { guardarLectura } from '../hooks/useHistorial'
import { llamarGemini } from '../lib/gemini'
import Compartir from '../components/Compartir'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import PageLayout from '../components/PageLayout'
import TextoIA from '../components/TextoIA'

const HERRAMIENTA = 'tarot78'

const IMAGEN_CARTA: Record<string, string> = {
  'El Loco':                '/tarot/Fool.jpg',
  'El Mago':                '/tarot/Magician.jpg',
  'La Sacerdotisa':         '/tarot/Priestess.jpg',
  'La Emperatriz':          '/tarot/Empress.jpg',
  'El Emperador':           '/tarot/Emperor.jpg',
  'El Sumo Sacerdote':      '/tarot/Hierophant.jpg',
  'Los Amantes':            '/tarot/Lovers.jpg',
  'El Carro':               '/tarot/Chariot.jpg',
  'La Fuerza':              '/tarot/Strength.jpg',
  'El Ermitaño':            '/tarot/Hermit.jpg',
  'La Rueda de la Fortuna': '/tarot/Wheel.jpg',
  'La Justicia':            '/tarot/Justice.jpg',
  'El Colgado':             '/tarot/Hanged.jpg',
  'La Muerte':              '/tarot/Death.jpg',
  'La Templanza':           '/tarot/Temperance.jpg',
  'El Diablo':              '/tarot/Devil.jpg',
  'La Torre':               '/tarot/Tower.jpg',
  'La Estrella':            '/tarot/Star.jpg',
  'La Luna':                '/tarot/Moon.jpg',
  'El Sol':                 '/tarot/Sun.jpg',
  'El Juicio':              '/tarot/Judgement.jpg',
  'El Mundo':               '/tarot/World.jpg',
  'As de Bastos':           '/tarot/Wands01.jpg',
  'Dos de Bastos':          '/tarot/Wands02.jpg',
  'Tres de Bastos':         '/tarot/Wands03.jpg',
  'Cuatro de Bastos':       '/tarot/Wands04.jpg',
  'Cinco de Bastos':        '/tarot/Wands05.jpg',
  'Seis de Bastos':         '/tarot/Wands06.jpg',
  'Siete de Bastos':        '/tarot/Wands07.jpg',
  'Ocho de Bastos':         '/tarot/Wands08.jpg',
  'Nueve de Bastos':        '/tarot/Wands09.jpg',
  'Diez de Bastos':         '/tarot/Wands10.jpg',
  'Sota de Bastos':         '/tarot/Wands11.jpg',
  'Caballero de Bastos':    '/tarot/Wands12.jpg',
  'Reina de Bastos':        '/tarot/Wands13.jpg',
  'Rey de Bastos':          '/tarot/Wands14.jpg',
  'As de Copas':            '/tarot/Cups01.jpg',
  'Dos de Copas':           '/tarot/Cups02.jpg',
  'Tres de Copas':          '/tarot/Cups03.jpg',
  'Cuatro de Copas':        '/tarot/Cups04.jpg',
  'Cinco de Copas':         '/tarot/Cups05.jpg',
  'Seis de Copas':          '/tarot/Cups06.jpg',
  'Siete de Copas':         '/tarot/Cups07.jpg',
  'Ocho de Copas':          '/tarot/Cups08.jpg',
  'Nueve de Copas':         '/tarot/Cups09.jpg',
  'Diez de Copas':          '/tarot/Cups10.jpg',
  'Sota de Copas':          '/tarot/Cups11.jpg',
  'Caballero de Copas':     '/tarot/Cups12.jpg',
  'Reina de Copas':         '/tarot/Cups13.jpg',
  'Rey de Copas':           '/tarot/Cups14.jpg',
  'As de Espadas':          '/tarot/Swords01.jpg',
  'Dos de Espadas':         '/tarot/Swords02.jpg',
  'Tres de Espadas':        '/tarot/Swords03.jpg',
  'Cuatro de Espadas':      '/tarot/Swords04.jpg',
  'Cinco de Espadas':       '/tarot/Swords05.jpg',
  'Seis de Espadas':        '/tarot/Swords06.jpg',
  'Siete de Espadas':       '/tarot/Swords07.jpg',
  'Ocho de Espadas':        '/tarot/Swords08.jpg',
  'Nueve de Espadas':       '/tarot/Swords09.jpg',
  'Diez de Espadas':        '/tarot/Swords10.jpg',
  'Sota de Espadas':        '/tarot/Swords11.jpg',
  'Caballero de Espadas':   '/tarot/Swords12.jpg',
  'Reina de Espadas':       '/tarot/Swords13.jpg',
  'Rey de Espadas':         '/tarot/Swords14.jpg',
  'As de Oros':             '/tarot/Pents01.jpg',
  'Dos de Oros':            '/tarot/Pents02.jpg',
  'Tres de Oros':           '/tarot/Pents03.jpg',
  'Cuatro de Oros':         '/tarot/Pents04.jpg',
  'Cinco de Oros':          '/tarot/Pents05.jpg',
  'Seis de Oros':           '/tarot/Pents06.jpg',
  'Siete de Oros':          '/tarot/Pents07.jpg',
  'Ocho de Oros':           '/tarot/Pents08.jpg',
  'Nueve de Oros':          '/tarot/Pents09.jpg',
  'Diez de Oros':           '/tarot/Pents10.jpg',
  'Sota de Oros':           '/tarot/Pents11.jpg',
  'Caballero de Oros':      '/tarot/Pents12.jpg',
  'Reina de Oros':          '/tarot/Pents13.jpg',
  'Rey de Oros':            '/tarot/Pents14.jpg',
}

const CARTAS_VALIDAS = Object.keys(IMAGEN_CARTA)

function CartaImagen({ nombre }: { nombre: string }) {
  const src = IMAGEN_CARTA[nombre]
  const [error, setError] = useState(false)

  if (src && !error) {
    return (
      <img
        src={src}
        alt={nombre}
        className="w-full h-full object-cover rounded-xl"
        onError={() => setError(true)}
      />
    )
  }

  return (
    <svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="120" height="200" fill="#1a0f2e" rx="8"/>
      <rect x="4" y="4" width="112" height="192" fill="none" stroke="#c084fc" strokeWidth="1" rx="6"/>
      {[...Array(5)].map((_, i) => (
        <ellipse key={i} cx="60" cy="90" rx={15 + i * 12} ry={20 + i * 15} fill="none" stroke="#7c3aed" strokeWidth="0.5" opacity={0.7 - i * 0.1}/>
      ))}
      <circle cx="60" cy="90" r="3" fill="#c084fc"/>
      <text x="60" y="155" textAnchor="middle" fill="#c084fc" fontSize="7" fontFamily="serif">{nombre}</text>
    </svg>
  )
}

export default function Tarot78() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [pregunta,       setPregunta]       = useState('')
  const [interpretacion, setInterpretacion] = useState('')
  const [cartaNombre,    setCartaNombre]    = useState('')
  const [cargando,       setCargando]       = useState(false)
  const [fase,           setFase]           = useState<'preguntar' | 'resultado'>('preguntar')
  const [errorMsg,       setErrorMsg]       = useState('')
  const [yaValorado,     setYaValorado]     = useState(false)
  const lecturaGuardadaRef                  = useRef(false)

  const nombre   = localStorage.getItem('nombre') || 'viajero'
  const signo    = localStorage.getItem('signo')  || 'Leo'
  const fechaHoy = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (!userPlan.cargando) analytics.registrarApertura()
  }, [userPlan.cargando])

  if (!userPlan.cargando && !userPlan.esPremium) {
    analytics.registrarPaywall(); navigate('/premium'); return null
  }

  const consultar = async () => {
    if (!pregunta.trim()) return
    setFase('resultado'); setCargando(true); setErrorMsg('')
    const t0 = Date.now()

    try {
      // ── Llamada 1: elegir la carta (Flash) ─────────────
      const promptCarta = [
        'Responde ÚNICAMENTE con el nombre de una carta de tarot. NADA MÁS.',
        'Sin JSON, sin explicaciones, sin puntos, sin comillas, sin markdown.',
        'EJEMPLO de respuesta correcta: La Fuerza',
        'EJEMPLO de respuesta incorrecta: {"carta": "La Fuerza"}',
        '',
        `Consulta: "${pregunta}". Signo: ${signo}.`,
        '',
        'Elige la carta más relevante de esta lista y escribe SOLO su nombre:',
        CARTAS_VALIDAS.join(', '),
      ].join('\n')

      const resultCarta = await llamarGemini({
        herramienta: HERRAMIENTA, prompt: promptCarta,
        userId: userPlan.userId, usarLite: false,
        cacheable: false, maxTokens: 10,
      })

      const nombreRaw = resultCarta.texto
        ?.trim()
        .replace(/["\{\}\[\]]/g, '')
        .replace(/\n/g, '')
        .trim() ?? ''

      const cartaValida = CARTAS_VALIDAS.find(
        c => c.toLowerCase() === nombreRaw.toLowerCase()
      ) ?? nombreRaw
      setCartaNombre(cartaValida)

      await new Promise(r => setTimeout(r, 500))

      // ── Llamada 2: interpretación (Lite) ────────────────
      const promptLectura = [
        'Eres un tarotista experto en las 78 cartas del Tarot Rider-Waite.',
        'Responde SOLO con texto en español, en prosa continua. Sin asteriscos, sin guiones, sin cursivas, sin negritas, sin numeración, sin markdown.',
        'No empieces nunca con saludos ni con el nombre del usuario.',
        'Cada párrafo tiene máximo 3 frases cortas. Es obligatorio completar los 3 párrafos.',
        '',
        `El usuario se llama ${nombre}, su signo es ${signo}.`,
        `Consulta: "${pregunta}"`,
        `La carta elegida es: ${cartaValida}`,
        '',
        'Escribe exactamente 3 párrafos separados por línea en blanco.',
        'Párrafo 1: la energía de esta carta y su simbolismo principal.',
        'Párrafo 2: el mensaje de esta carta en relación directa con la consulta.',
        'Párrafo 3: un consejo o acción concreta que la carta sugiere para este momento.',
        '',
        'Tono sabio, poético y directo. Termina en punto.',
      ].join('\n')

      const resultLectura = await llamarGemini({
        herramienta: HERRAMIENTA, prompt: promptLectura,
        userId: userPlan.userId, usarLite: true,
        cacheable: false, maxTokens: 400,
      })

      if (!resultLectura.error && resultLectura.texto) {
        setInterpretacion(resultLectura.texto)
        if (userPlan.userId) await incrementarConsulta(userPlan.userId)
        analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: resultLectura.modelo })
        if (!lecturaGuardadaRef.current) {
          lecturaGuardadaRef.current = true
          await guardarLectura({
            herramienta: HERRAMIENTA,
            titulo: `Tarot 78: ${cartaValida} · ${fechaHoy}`,
            contenido: `Consulta: "${pregunta}"\nCarta: ${cartaValida}\n\n${resultLectura.texto}`,
            metadatos: { pregunta, fecha: fechaHoy, nombre, signo, carta: cartaValida },
          })
        }
      } else {
        setErrorMsg(resultLectura.error || 'El universo guarda silencio. Inténtalo de nuevo.')
      }
    } catch (err) {
      console.error('[Tarot78]', err)
      setErrorMsg('Error inesperado.')
    } finally {
      setCargando(false)
    }
  }

  const handleValorar = (valor: 1 | -1) => {
    if (yaValorado) return
    setYaValorado(true)
    analytics.registrarValoracion(valor)
  }

  const resetear = () => {
    setFase('preguntar')
    setInterpretacion('')
    setCartaNombre('')
    setErrorMsg('')
    lecturaGuardadaRef.current = false
  }

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <button
            onClick={() => fase === 'resultado' ? resetear() : navigate('/tradiciones')}
            className="text-purple-300 text-sm"
          >← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Tarot 78 Cartas</p>
            <p className="text-purple-300 text-xs">Arcanos mayores y menores</p>
          </div>
          <span className="text-purple-400 text-xs border border-purple-400/30 rounded-full px-2 py-0.5">✨ Premium</span>
        </div>

        {fase === 'preguntar' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">Tu pregunta o situación</p>
              <textarea
                value={pregunta}
                onChange={e => setPregunta(e.target.value)}
                placeholder="¿Qué quieres explorar?"
                rows={4}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30"
              />
            </div>
            <DisclaimerIA compact />
            <button
              onClick={consultar}
              disabled={!pregunta.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >Consultar</button>
          </div>
        )}

        {fase === 'resultado' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-white/15 rounded-2xl px-4 py-3">
              <p className="text-white/50 text-xs italic">"{pregunta}"</p>
            </div>

            {cartaNombre ? (
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-36 h-56 rounded-xl overflow-hidden"
                  style={{ boxShadow: '0 0 40px rgba(192,132,252,0.5)' }}
                >
                  <CartaImagen nombre={cartaNombre} />
                </div>
                <p className="text-white font-bold text-xl text-center">{cartaNombre}</p>
                {/* DEBUG — quitar cuando funcione */}
                <p className="text-yellow-400 text-xs text-center">[{cartaNombre}]</p>
              </div>
            ) : (
              <div className="flex justify-center py-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-4">Interpretación</p>
              {cargando && !interpretacion ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : errorMsg
                ? <p className="text-red-300 text-sm">{errorMsg}</p>
                : <TextoIA texto={interpretacion} />
              }
            </div>

            {!cargando && interpretacion && (
              <>
                <DisclaimerIA />
                <Valoracion onValorar={handleValorar} />
                <Compartir
                  titulo={`Tarot 78: ${cartaNombre}`}
                  texto={`${cartaNombre}\n\n${interpretacion}`}
                  hashtags={['Universe', 'Tarot78']}
                />
                <button onClick={() => navigate('/guia')} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">Explorar con mi Guía IA</button>
                <button onClick={resetear} className="w-full text-purple-300/60 text-sm py-2">Nueva consulta</button>
              </>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}