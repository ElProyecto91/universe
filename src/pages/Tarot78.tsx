import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserPlan, incrementarConsulta } from '../hooks/useUserPlan'
import { useAnalytics } from '../hooks/useAnalytics'
import { guardarLectura } from '../hooks/useHistorial'
import { llamarGemini } from '../lib/gemini'
import { getCartaSVG } from '../components/svg/TarotSVG'
import Compartir from '../components/Compartir'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import PageLayout from '../components/PageLayout'
import TextoIA from '../components/TextoIA'

const HERRAMIENTA = 'tarot78'

export default function Tarot78() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [pregunta,       setPregunta]       = useState('')
  const [interpretacion, setInterpretacion] = useState('')
  const [cartaNombre,    setCartaNombre]    = useState('')
  const [cartaKeywords,  setCartaKeywords]  = useState('')
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
      const prompt = [
        'IMPORTANTE: Responde ÚNICAMENTE con un objeto JSON válido, sin markdown, sin texto adicional, sin explicaciones fuera del JSON.',
        'Eres un tarotista experto en las 78 cartas del Tarot Rider-Waite.',
        '',
        `El usuario se llama ${nombre}, su signo es ${signo}.`,
        `Consulta: "${pregunta}"`,
        '',
        'Devuelve EXACTAMENTE este formato JSON:',
        '{',
        '  "carta": "nombre exacto de la carta en español",',
        '  "keywords": "3 palabras clave separadas por ·",',
        '  "lectura": "3 párrafos separados por \\n\\n. Cada párrafo máximo 3 frases. En español, en prosa, sin markdown, sin asteriscos, sin listas. Párrafo 1: energía de la carta. Párrafo 2: mensaje para la consulta. Párrafo 3: consejo concreto."',
        '}',
        '',
        'El nombre de la carta debe ser uno de estos exactos: El Loco, El Mago, La Sacerdotisa, La Emperatriz, El Emperador, El Sumo Sacerdote, Los Amantes, El Carro, La Fuerza, El Ermitaño, La Rueda de la Fortuna, La Justicia, El Colgado, La Muerte, La Templanza, El Diablo, La Torre, La Estrella, La Luna, El Sol, El Juicio, El Mundo, As de Bastos, Dos de Bastos, Tres de Bastos, Cuatro de Bastos, Cinco de Bastos, Seis de Bastos, Siete de Bastos, Ocho de Bastos, Nueve de Bastos, Diez de Bastos, Sota de Bastos, Caballero de Bastos, Reina de Bastos, Rey de Bastos, As de Copas, Dos de Copas, Tres de Copas, Cuatro de Copas, Cinco de Copas, Seis de Copas, Siete de Copas, Ocho de Copas, Nueve de Copas, Diez de Copas, Sota de Copas, Caballero de Copas, Reina de Copas, Rey de Copas, As de Espadas, Dos de Espadas, Tres de Espadas, Cuatro de Espadas, Cinco de Espadas, Seis de Espadas, Siete de Espadas, Ocho de Espadas, Nueve de Espadas, Diez de Espadas, Sota de Espadas, Caballero de Espadas, Reina de Espadas, Rey de Espadas, As de Oros, Dos de Oros, Tres de Oros, Cuatro de Oros, Cinco de Oros, Seis de Oros, Siete de Oros, Ocho de Oros, Nueve de Oros, Diez de Oros, Sota de Oros, Caballero de Oros, Reina de Oros, Rey de Oros.',
      ].join('\n')

      const result = await llamarGemini({
        herramienta: HERRAMIENTA, prompt,
        userId: userPlan.userId, usarLite: false,
        cacheable: false, maxTokens: 500,
      })

      if (!result.error && result.texto) {
        try {
          const clean = result.texto.replace(/```json|```/g, '').trim()
          const json = JSON.parse(clean)
          setCartaNombre(json.carta || '')
          setCartaKeywords(json.keywords || '')
          setInterpretacion(json.lectura || '')
        } catch {
          // fallback si el JSON falla
          setInterpretacion(result.texto)
          setCartaNombre('')
        }
        if (userPlan.userId) await incrementarConsulta(userPlan.userId)
        analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: result.modelo })
        if (!lecturaGuardadaRef.current) {
          lecturaGuardadaRef.current = true
          await guardarLectura({
            herramienta: HERRAMIENTA,
            titulo: `Tarot 78 · ${fechaHoy}`,
            contenido: `Consulta: "${pregunta}"\n\nCarta: ${cartaNombre}\n\n${interpretacion}`,
            metadatos: { pregunta, fecha: fechaHoy, nombre, signo, carta: cartaNombre },
          })
        }
      } else {
        setErrorMsg(result.error || 'El universo guarda silencio. Inténtalo de nuevo.')
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
    setCartaKeywords('')
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

            {/* Carta */}
            {cartaNombre && (
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-36 h-56 rounded-xl overflow-hidden"
                  style={{ boxShadow: '0 0 40px rgba(192,132,252,0.5)' }}
                >
                  {getCartaSVG(cartaNombre)}
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-xl">{cartaNombre}</p>
                  {cartaKeywords && <p className="text-white/40 text-xs mt-1">{cartaKeywords}</p>}
                </div>
              </div>
            )}

            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-4">Interpretación</p>
              {cargando ? (
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