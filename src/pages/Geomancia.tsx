import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserPlan, incrementarConsulta } from '../hooks/useUserPlan'
import { useAnalytics } from '../hooks/useAnalytics'
import { guardarLectura } from '../hooks/useHistorial'
import { llamarGemini } from '../lib/gemini'
import { lanzarFigura, renderizarPatron, FiguraGeomantica } from '../lib/motores/geomancia'
import Compartir from '../components/Compartir'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import PageLayout from '../components/PageLayout'
import TextoIA from '../components/TextoIA'

const HERRAMIENTA = 'geomancia'

export default function Geomancia() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [pregunta,       setPregunta]       = useState('')
  const [figura,         setFigura]         = useState<FiguraGeomantica | null>(null)
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando,       setCargando]       = useState(false)
  const [lanzando,       setLanzando]       = useState(false)
  const [fase,           setFase]           = useState<'preguntar' | 'lanzar' | 'resultado'>('preguntar')
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

  const handleLanzar = async () => {
    setLanzando(true)
    await new Promise(r => setTimeout(r, 1500))
    const figuraResultado = lanzarFigura()
    setFigura(figuraResultado)
    setLanzando(false)
    setFase('resultado')
    consultar(figuraResultado)
  }

  const consultar = async (figuraActual: FiguraGeomantica) => {
    setCargando(true); setErrorMsg('')
    const t0 = Date.now()

    try {
      const prompt = [
        'Eres un maestro de geomancia árabe (ʿilm al-raml), la ciencia de la arena.',
        `El consultante se llama ${nombre}, signo ${signo}. Su pregunta: "${pregunta}".`,
        `La figura que ha caído es ${figuraActual.nombreLatin} (${figuraActual.nombreArabe}).`,
        `Planeta: ${figuraActual.planeta}. Elemento: ${figuraActual.elemento}. Energía: ${figuraActual.energia}.`,
        '',
        'Escribe en español, en prosa sabia y directa, sin listas ni asteriscos. Sin saludar.',
        'Escribe exactamente 3 párrafos separados por línea en blanco. Cada párrafo máximo 3 frases.',
        `Párrafo 1: qué dice ${figuraActual.nombreLatin} sobre la situación actual — su energía y lo que revela.`,
        'Párrafo 2: qué fuerzas o influencias señala esta figura en relación con la pregunta.',
        'Párrafo 3: el consejo práctico del geomante — qué hacer con esta información.',
        'Tono ancestral, preciso y sabio. Termina en punto.',
      ].join('\n')

      const result = await llamarGemini({
        herramienta: HERRAMIENTA,
        prompt,
        userId: userPlan.userId,
        usarLite: true,
        cacheable: false,
        maxTokens: 500,
      })

      if (result.error || !result.texto) {
        setErrorMsg('La arena guarda silencio. Inténtalo de nuevo.')
        return
      }

      setInterpretacion(result.texto)
      if (userPlan.userId) await incrementarConsulta(userPlan.userId)
      analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: 'lite' })
      if (!lecturaGuardadaRef.current) {
        lecturaGuardadaRef.current = true
        await guardarLectura({
          herramienta: HERRAMIENTA,
          titulo: `Geomancia · ${figuraActual.nombreLatin} · ${fechaHoy}`,
          contenido: `Consulta: "${pregunta}"\nFigura: ${figuraActual.nombreLatin}\n\n${result.texto}`,
          metadatos: { pregunta, figura: figuraActual.nombre, fecha: fechaHoy, nombre, signo },
        })
      }
    } catch (err) {
      console.error('[Geomancia]', err)
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
    setFase('preguntar'); setPregunta(''); setFigura(null)
    setInterpretacion(''); setErrorMsg(''); lecturaGuardadaRef.current = false
  }

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">

        <div className="flex items-center">
          <button onClick={() => fase !== 'preguntar' ? resetear() : navigate('/tradiciones')} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Geomancia · علم الرمل</p>
            <p className="text-purple-300 text-xs">Ciencia de la arena · Tradición árabe</p>
          </div>
          <span className="text-purple-400 text-xs border border-purple-400/30 rounded-full px-2 py-0.5">✨ Premium</span>
        </div>

        {/* FASE: PREGUNTAR */}
        {fase === 'preguntar' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-amber-800/40 rounded-3xl p-6 text-center">
              <p className="text-4xl mb-3">🏜️</p>
              <p className="text-amber-600 text-xs tracking-widest uppercase mb-2">ʿIlm al-Raml</p>
              <p className="text-white/60 text-xs leading-relaxed">La geomancia árabe nació en el norte de África en el siglo IX. 16 figuras formadas por puntos en la arena revelan la energía de cualquier pregunta.</p>
            </div>
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-amber-600 text-xs tracking-widest uppercase mb-3">Tu consulta</p>
              <textarea
                value={pregunta}
                onChange={e => setPregunta(e.target.value)}
                placeholder="Formula tu pregunta con precisión..."
                rows={4}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30"
              />
            </div>
            <DisclaimerIA compact />
            <button
              onClick={() => setFase('lanzar')}
              disabled={!pregunta.trim()}
              className="w-full bg-gradient-to-r from-amber-800 to-yellow-700 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >
              Preparar el lanzamiento
            </button>
          </div>
        )}

        {/* FASE: LANZAR */}
        {fase === 'lanzar' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-amber-800/40 rounded-3xl p-8 text-center">
              <p className="text-5xl mb-4">✋</p>
              <p className="text-amber-600 text-xs tracking-widest uppercase mb-3">El geomante marca la arena</p>
              <p className="text-white/60 text-xs leading-relaxed mb-4">En la tradición árabe, el geomante traza hileras de puntos al azar sobre la arena. Los puntos — pares o impares — revelan una de las 16 figuras sagradas.</p>
              <div className="bg-white/5 rounded-2xl px-4 py-3">
                <p className="text-white/50 text-xs italic">"{pregunta}"</p>
              </div>
            </div>
            <button
              onClick={handleLanzar}
              disabled={lanzando}
              className="w-full bg-gradient-to-r from-amber-800 to-yellow-700 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >
              {lanzando ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-pulse">✦</span> Trazando los puntos en la arena...
                </span>
              ) : 'Trazar los puntos'}
            </button>
          </div>
        )}

        {/* FASE: RESULTADO */}
        {fase === 'resultado' && figura && (
          <div className="flex flex-col gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <p className="text-white/50 text-xs italic">"{pregunta}"</p>
            </div>

            {/* Card figura */}
            <div className="bg-[#0d0015] border border-amber-800/40 rounded-3xl p-6">
              <p className="text-amber-600 text-xs tracking-widest uppercase mb-4 text-center">Figura revelada</p>

              {/* Patrón de puntos */}
              <div className="flex flex-col items-center gap-2 mb-5">
                {renderizarPatron(figura.patron).map((fila, i) => (
                  <div key={i} className="text-amber-400 text-xl tracking-widest font-mono">{fila}</div>
                ))}
              </div>

              <div className="text-center">
                <p className="text-white text-2xl font-bold mb-1">{figura.nombreLatin}</p>
                <p className="text-amber-500/70 text-sm mb-1">{figura.nombreArabe}</p>
                <p className="text-white/40 text-xs mb-3">{figura.planeta} · {figura.elemento}</p>
                <p className="text-amber-400 text-xs tracking-widest">{figura.energia}</p>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 mt-4">
                <p className="text-white/70 text-sm leading-relaxed">{figura.mensaje}</p>
              </div>
            </div>

            {/* Interpretación IA */}
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-amber-600 text-xs tracking-widest uppercase mb-4">La lectura del geomante</p>
              {cargando ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : errorMsg ? (
                <p className="text-red-300 text-sm">{errorMsg}</p>
              ) : (
                <TextoIA texto={interpretacion} />
              )}
            </div>

            {!cargando && interpretacion && (
              <>
                <DisclaimerIA />
                <Valoracion onValorar={handleValorar} />
                <Compartir
                  titulo={`Geomancia · ${figura.nombreLatin}`}
                  texto={`${figura.nombreLatin} (${figura.nombreArabe})\n${figura.energia}\n\n${interpretacion}`}
                  hashtags={['Universe', 'Geomancia', 'IlmAlRaml']}
                />
                <button onClick={() => navigate('/guia')} className="w-full bg-gradient-to-r from-amber-800 to-yellow-700 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">Explorar con mi Guía IA</button>
                <button onClick={resetear} className="w-full text-amber-600/60 text-sm py-2">Nueva consulta</button>
              </>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}