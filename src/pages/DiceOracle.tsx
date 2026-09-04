import { useState } from 'react'
import { lanzar3Dados, INTERPRETACIONES_DADO } from '../lib/motores/dados'
import Compartir from '../components/Compartir'
import Paywall from '../components/Paywall'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import { llamarGemini, useUserPlan, useAnalytics, registrarEvento } from '../lib/paginaHelper'

export default function DiceOracle() {
  const [dados, setDados] = useState<number[]>([])
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'preguntar' | 'resultado'>('preguntar')
  const [pregunta, setPregunta] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const { esPremium, userId } = useUserPlan()
  useAnalytics('dice-oracle')

  const nombre = localStorage.getItem('nombre') || 'viajero'
  const bgStyle = { backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }
  const CARAS_DADO = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅']

  const lanzar = async () => {
    if (!pregunta.trim()) return
    const t0 = Date.now()
    const resultado = lanzar3Dados()
    setDados(resultado)
    setFase('resultado')
    setCargando(true)
    setErrorMsg('')
    registrarEvento({ herramienta: 'dice-oracle', accion: 'tirada_iniciada', user_id: userId })

    const suma = resultado.reduce((a, b) => a + b, 0)
    const result = await llamarGemini({
      herramienta: 'dice-oracle',
      prompt: `Intérprete de oráculos de dados (cleromancia).

Nombre: ${nombre}
Pregunta: "${pregunta}"
Dados: ${resultado.join(', ')} (suma: ${suma})
Dado 1 = mente/pensamiento · Dado 2 = corazón/emoción · Dado 3 = acción/cuerpo

2-3 párrafos: conecta los números con la pregunta, perspectiva y consejo concreto. Sin predicciones absolutas.`,
      userId, usarLite: true, cacheable: false, maxTokens: 200,
    })

    if (result.error) setErrorMsg(result.error)
    else {
      setInterpretacion(result.texto)
      registrarEvento({ herramienta: 'dice-oracle', accion: 'lectura_ia', tiempo_respuesta_ms: Date.now() - t0, user_id: userId })
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      {/* Paywall para usuarios free */}
      {!esPremium && fase === 'preguntar' && (
        <Paywall motivo="herramienta" herramienta="Oracle de Dados · Cleromancia" />
      )}

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">
        <div className="flex items-center">
          <button onClick={() => window.location.href = '/tradiciones'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Oracle de Dados</p>
            <p className="text-purple-300 text-xs">Cleromancia · Tradición antigua</p>
          </div>
        </div>

        {fase === 'preguntar' && (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <p className="text-6xl mb-4">⚄</p>
              <p className="text-white/60 text-sm leading-relaxed">La cleromancia — adivinación mediante objetos lanzados al azar — es una de las prácticas más antiguas de la humanidad.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu pregunta</p>
              <textarea value={pregunta} onChange={e => setPregunta(e.target.value)}
                placeholder="Formula tu pregunta con claridad..." rows={3}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30" />
            </div>
            <button onClick={lanzar} disabled={!pregunta.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40">
              Lanzar los dados
            </button>
          </div>
        )}

        {fase === 'resultado' && (
          <div className="flex flex-col gap-5">
            <div className="flex justify-center gap-6 py-4">
              {dados.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <span className="text-6xl">{CARAS_DADO[d]}</span>
                  <span className="text-white/40 text-xs">{['Mente', 'Corazón', 'Acción'][i]}</span>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur">
              <p className="text-white/40 text-xs">Pregunta: <span className="text-white/70 italic">"{pregunta}"</span></p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Interpretación</p>
              {cargando ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : errorMsg ? (
                <p className="text-red-400 text-sm">{errorMsg}</p>
              ) : (
                <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{interpretacion}</p>
              )}
            </div>

            {!cargando && interpretacion && (
              <>
                <DisclaimerIA />
                <Valoracion herramienta="dice-oracle" userId={userId} />
                <Compartir titulo={`Oracle de Dados: ${dados.join('-')}`} texto={interpretacion} hashtags={['DiceOracle', 'Universe', 'Cleromancia']} />
              </>
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">Explorar con mi Guía IA</button>
              <button onClick={() => { setFase('preguntar'); setDados([]); setInterpretacion(''); setErrorMsg('') }} className="w-full text-purple-300/60 text-sm py-2">Nueva tirada</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
