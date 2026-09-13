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

const HERRAMIENTA = 'omikuji'

// Niveles de fortuna del Omikuji
const FORTUNAS = [
  { nivel: 'Dai-kichi', emoji: '🌟', desc: 'Gran Fortuna' },
  { nivel: 'Kichi',     emoji: '✨', desc: 'Fortuna' },
  { nivel: 'Chū-kichi', emoji: '🍀', desc: 'Fortuna Media' },
  { nivel: 'Shō-kichi', emoji: '🌸', desc: 'Pequeña Fortuna' },
  { nivel: 'Han-kichi', emoji: '🌿', desc: 'Fortuna Moderada' },
  { nivel: 'Kyō',       emoji: '🌑', desc: 'Mala Fortuna' },
]

function sortearFortuna() {
  // Pesos: más probable buena fortuna (tradición omikuji)
  const pesos = [15, 30, 25, 15, 10, 5]
  const total = pesos.reduce((a, b) => a + b, 0)
  let rand = Math.random() * total
  for (let i = 0; i < pesos.length; i++) {
    rand -= pesos[i]
    if (rand <= 0) return FORTUNAS[i]
  }
  return FORTUNAS[1]
}

export default function Omikuji() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [pregunta,       setPregunta]       = useState('')
  const [interpretacion, setInterpretacion] = useState('')
  const [fortuna,        setFortuna]        = useState<typeof FORTUNAS[0] | null>(null)
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

    // Sortear fortuna en frontend
    const fortunaSorteada = sortearFortuna()
    setFortuna(fortunaSorteada)

    try {
      const prompt = [
        'Eres un sabio maestro del Omikuji japonés — el oráculo sagrado de los templos sintoístas.',
        'Responde SOLO con texto en español, en prosa continua. Sin asteriscos, sin guiones, sin cursivas, sin negritas, sin numeración, sin markdown.',
        'No empieces nunca con saludos ni con el nombre del usuario.',
        'Cada párrafo tiene máximo 3 frases cortas. Es obligatorio completar los 3 párrafos.',
        '',
        `El usuario se llama ${nombre}, su signo es ${signo}.`,
        `Su pregunta: "${pregunta}"`,
        `El nivel de fortuna sorteado es: ${fortunaSorteada.nivel} (${fortunaSorteada.desc})`,
        '',
        'Escribe exactamente 3 párrafos separados por línea en blanco.',
        `Párrafo 1: la fortuna general de ${fortunaSorteada.nivel} y su significado espiritual en la tradición japonesa.`,
        'Párrafo 2: el consejo específico del oráculo para la pregunta del usuario.',
        'Párrafo 3: una advertencia o precaución breve que el oráculo ofrece para este momento.',
        '',
        'Tono ceremonial, sereno y sabio. Termina en punto.',
      ].join('\n')

      const result = await llamarGemini({
        herramienta: HERRAMIENTA, prompt,
        userId: userPlan.userId, usarLite: true,
        cacheable: false, maxTokens: 400,
      })

      if (!result.error && result.texto) {
        setInterpretacion(result.texto)
        if (userPlan.userId) await incrementarConsulta(userPlan.userId)
        analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: result.modelo })
        if (!lecturaGuardadaRef.current) {
          lecturaGuardadaRef.current = true
          await guardarLectura({
            herramienta: HERRAMIENTA,
            titulo: `Omikuji · ${fortunaSorteada.nivel} · ${fechaHoy}`,
            contenido: `Pregunta: "${pregunta}"\nFortuna: ${fortunaSorteada.nivel}\n\n${result.texto}`,
            metadatos: { pregunta, fecha: fechaHoy, nombre, signo, fortuna: fortunaSorteada.nivel },
          })
        }
      } else {
        setErrorMsg(result.error || 'El oráculo guarda silencio. Inténtalo de nuevo.')
      }
    } catch (err) {
      console.error('[Omikuji]', err)
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
    setFortuna(null)
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
            <p className="text-white font-semibold text-sm">Omikuji</p>
            <p className="text-purple-300 text-xs">Oráculo japonés del templo</p>
          </div>
          <span className="text-purple-400 text-xs border border-purple-400/30 rounded-full px-2 py-0.5">✨ Premium</span>
        </div>

        {fase === 'preguntar' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6 text-center">
              <p className="text-4xl mb-3">🎋</p>
              <p className="text-white/60 text-sm leading-relaxed">Escribe tu pregunta y el espíritu del templo sorteará tu fortuna.</p>
            </div>
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">Tu pregunta</p>
              <textarea
                value={pregunta}
                onChange={e => setPregunta(e.target.value)}
                placeholder="¿Qué quieres consultar al oráculo?"
                rows={4}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30"
              />
            </div>
            <DisclaimerIA compact />
            <button
              onClick={consultar}
              disabled={!pregunta.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >Consultar el oráculo</button>
          </div>
        )}

        {fase === 'resultado' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-white/15 rounded-2xl px-4 py-3">
              <p className="text-white/50 text-xs italic">"{pregunta}"</p>
            </div>

            {/* Fortuna sorteada */}
            {fortuna && (
              <div className="bg-[#0d0015] border border-purple-500/50 rounded-3xl p-6 text-center">
                <p className="text-5xl mb-3">{fortuna.emoji}</p>
                <p className="text-purple-300 text-xs tracking-widest uppercase mb-1">Tu fortuna</p>
                <p className="text-white text-2xl font-bold">{fortuna.nivel}</p>
                <p className="text-white/50 text-sm mt-1">{fortuna.desc}</p>
              </div>
            )}

            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-4">Mensaje del oráculo</p>
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
                  titulo={`Omikuji: ${fortuna?.nivel}`}
                  texto={`${fortuna?.nivel} — ${fortuna?.desc}\n\n${interpretacion}`}
                  hashtags={['Universe', 'Omikuji', 'Japon']}
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