import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserPlan, incrementarConsulta } from '../hooks/useUserPlan'
import { useAnalytics } from '../hooks/useAnalytics'
import { guardarLectura } from '../hooks/useHistorial'
import { llamarGemini } from '../lib/gemini'
import { lanzarOdu, OduIfa } from '../lib/motores/ifa'
import Compartir from '../components/Compartir'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import PageLayout from '../components/PageLayout'
import TextoIA from '../components/TextoIA'

const HERRAMIENTA = 'ifa-oracle'

export default function IfaOracle() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [pregunta,       setPregunta]       = useState('')
  const [odu,            setOdu]            = useState<OduIfa | null>(null)
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
    await new Promise(r => setTimeout(r, 1200))
    const oduResultado = lanzarOdu()
    setOdu(oduResultado)
    setLanzando(false)
    setFase('resultado')
    consultar(oduResultado)
  }

  const consultar = async (oduActual: OduIfa) => {
    setCargando(true); setErrorMsg('')
    const t0 = Date.now()

    try {
      const prompt = [
        'Eres un Babaláwo — sacerdote del oráculo de Ifá de la tradición yoruba.',
        `El consultante se llama ${nombre}, signo ${signo}. Su pregunta: "${pregunta}".`,
        `El Odù que ha caído es ${oduActual.yoruba} (${oduActual.nombre}), número ${oduActual.numero} de los 16 principales.`,
        `Energía de este Odù: ${oduActual.energia}. Orisha asociado: ${oduActual.orisha}.`,
        '',
        'Escribe en español, en prosa sabia y directa, sin listas ni asteriscos. Sin saludar.',
        'Escribe exactamente 3 párrafos separados por línea en blanco. Cada párrafo máximo 3 frases.',
        'Párrafo 1: qué dice este Odù sobre la situación actual del consultante.',
        'Párrafo 2: qué fuerzas o energías están influyendo y qué advierte o bendice Ifá.',
        'Párrafo 3: el consejo del Babaláwo — acción concreta y sabiduría yoruba para este momento.',
        'Termina en punto. Tono ancestral, profundo y compasivo.',
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
        setErrorMsg('Ifá guarda silencio. Inténtalo de nuevo.')
        return
      }

      setInterpretacion(result.texto)
      if (userPlan.userId) await incrementarConsulta(userPlan.userId)
      analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: 'lite' })
      if (!lecturaGuardadaRef.current) {
        lecturaGuardadaRef.current = true
        await guardarLectura({
          herramienta: HERRAMIENTA,
          titulo: `Ifá · ${oduActual.nombre} · ${fechaHoy}`,
          contenido: `Consulta: "${pregunta}"\nOdù: ${oduActual.yoruba}\n\n${result.texto}`,
          metadatos: { pregunta, odu: oduActual.nombre, fecha: fechaHoy, nombre, signo },
        })
      }
    } catch (err) {
      console.error('[IfaOracle]', err)
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
    setFase('preguntar'); setPregunta(''); setOdu(null)
    setInterpretacion(''); setErrorMsg(''); lecturaGuardadaRef.current = false
  }

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">

        <div className="flex items-center">
          <button onClick={() => fase !== 'preguntar' ? resetear() : navigate('/tradiciones')} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Oráculo de Ifá</p>
            <p className="text-purple-300 text-xs">Tradición yoruba · África occidental</p>
          </div>
          <span className="text-purple-400 text-xs border border-purple-400/30 rounded-full px-2 py-0.5">✨ Premium</span>
        </div>

        {/* FASE: PREGUNTAR */}
        {fase === 'preguntar' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-amber-500/30 rounded-3xl p-6 text-center">
              <p className="text-4xl mb-3">🌴</p>
              <p className="text-amber-400 text-xs tracking-widest uppercase mb-2">Oráculo de Ifá</p>
              <p className="text-white/60 text-xs leading-relaxed">El sistema adivinatorio más antiguo de África occidental. Patrimonio Inmaterial de la Humanidad UNESCO. Los 16 Odù son las voces de la sabiduría ancestral yoruba.</p>
            </div>
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-amber-400 text-xs tracking-widest uppercase mb-3">Tu consulta a Ifá</p>
              <textarea
                value={pregunta}
                onChange={e => setPregunta(e.target.value)}
                placeholder="Formula tu pregunta con honestidad y apertura..."
                rows={4}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30"
              />
            </div>
            <DisclaimerIA compact />
            <button
              onClick={() => setFase('lanzar')}
              disabled={!pregunta.trim()}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >
              Preparar el lanzamiento
            </button>
          </div>
        )}

        {/* FASE: LANZAR */}
        {fase === 'lanzar' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-amber-500/30 rounded-3xl p-8 text-center">
              <p className="text-5xl mb-4">🌰</p>
              <p className="text-amber-400 text-xs tracking-widest uppercase mb-3">Las nueces de palma esperan</p>
              <p className="text-white/60 text-xs leading-relaxed mb-2">En la tradición yoruba, el Babaláwo lanza nueces de palma sagradas para revelar el Odù. Sostén tu pregunta en la mente con claridad y respeto.</p>
              <div className="bg-[#0d0015] border border-amber-500/20 rounded-2xl px-4 py-3 mt-4">
                <p className="text-white/50 text-xs italic">"{pregunta}"</p>
              </div>
            </div>
            <button
              onClick={handleLanzar}
              disabled={lanzando}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >
              {lanzando ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">🌰</span> Lanzando las nueces...
                </span>
              ) : 'Lanzar las nueces de palma'}
            </button>
          </div>
        )}

        {/* FASE: RESULTADO */}
        {fase === 'resultado' && odu && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-white/15 rounded-2xl px-4 py-3">
              <p className="text-white/50 text-xs italic">"{pregunta}"</p>
            </div>

            {/* Card Odù */}
            <div
              className="rounded-3xl p-6 text-center border"
              style={{ borderColor: `${odu.color}40`, background: `linear-gradient(135deg, #0d0015 0%, ${odu.color}15 100%)` }}
            >
              <p className="text-xs tracking-widest uppercase mb-1" style={{ color: odu.color }}>Odù {odu.numero} de 16</p>
              <p className="text-white text-2xl font-bold mb-1">{odu.yoruba}</p>
              <p className="text-white/50 text-sm mb-3">{odu.nombre} · {odu.orisha}</p>
              <p className="text-xs mb-4" style={{ color: odu.color }}>{odu.energia}</p>
              <div className="bg-white/5 rounded-2xl p-4 text-left">
                <p className="text-white/70 text-sm leading-relaxed">{odu.mensaje}</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-3 mt-3 text-left">
                <p className="text-xs tracking-widest uppercase mb-1" style={{ color: odu.color }}>Consejo del Odù</p>
                <p className="text-white/60 text-xs leading-relaxed">{odu.consejo}</p>
              </div>
            </div>

            {/* Interpretación IA */}
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-amber-400 text-xs tracking-widest uppercase mb-4">La voz del Babaláwo</p>
              {cargando ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
                  titulo={`Ifá · ${odu.yoruba}`}
                  texto={`${odu.yoruba} — ${odu.energia}\n\n${interpretacion}`}
                  hashtags={['Universe', 'Ifa', 'Yoruba']}
                />
                <button onClick={() => navigate('/guia')} className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">Explorar con mi Guía IA</button>
                <button onClick={resetear} className="w-full text-amber-300/60 text-sm py-2">Nueva consulta</button>
              </>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}