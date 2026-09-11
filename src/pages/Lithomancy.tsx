// src/pages/Lithomancy.tsx
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
import { CRISTALES_IMAGENES } from '../lib/cristales_imagenes'

const PIEDRAS_IMG: Record<string, string> = {
  'Cuarzo':      CRISTALES_IMAGENES['Cuarzo Transparente'],
  'Amatista':    CRISTALES_IMAGENES['Amatista'],
  'Obsidiana':   CRISTALES_IMAGENES['Obsidiana'],
  'Citrino':     CRISTALES_IMAGENES['Citrino'],
  'Lapislázuli': CRISTALES_IMAGENES['Lapislázuli'],
}

const HERRAMIENTA = 'lithomancy'

const PIEDRAS = [
  { nombre: 'Cuarzo', color: '#e8e8e8', posicion: 'Norte', significado: 'Claridad y verdad' },
  { nombre: 'Amatista', color: '#9b59b6', posicion: 'Sur', significado: 'Intuición y espiritualidad' },
  { nombre: 'Obsidiana', color: '#2c2c2c', posicion: 'Este', significado: 'Protección y sombra' },
  { nombre: 'Citrino', color: '#f39c12', posicion: 'Oeste', significado: 'Abundancia y voluntad' },
  { nombre: 'Lapislázuli', color: '#1a5276', posicion: 'Centro', significado: 'Sabiduría y destino' },
]

export default function Lithomancy() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [tirada,         setTirada]         = useState<typeof PIEDRAS | null>(null)
  const [pregunta,       setPregunta]       = useState('')
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando,       setCargando]       = useState(false)
  const [fase,           setFase]           = useState<'preguntar' | 'tirada' | 'resultado'>('preguntar')
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

  const tirarPiedras = () => {
    const mezcladas = [...PIEDRAS].sort(() => Math.random() - 0.5)
    setTirada(mezcladas)
    setFase('tirada')
  }

  const consultar = async () => {
    if (!tirada) return
    setFase('resultado'); setCargando(true); setErrorMsg('')
    const t0 = Date.now()

    try {
      const descripcionTirada = tirada.map(p => `${p.nombre} en posición ${p.posicion} (${p.significado})`).join(', ')

      const prompt = [
        'Eres un experto en litomancia (adivinación con piedras). Escribe en español, en prosa fluida. Sin asteriscos, sin guiones, sin markdown.',
        '',
        `El usuario se llama ${nombre}, signo ${signo}. Su pregunta: "${pregunta || 'lectura general'}".`,
        `La tirada de piedras: ${descripcionTirada}.`,
        '',
        'Escribe una lectura de 2 párrafos.',
        'Párrafo 1: cómo la posición y energía de las piedras responde a la pregunta de forma integrada.',
        'Párrafo 2: un consejo práctico basado en la lectura y una pregunta reflexiva de cierre.',
        '',
        'Tono místico y directo. Separa con línea en blanco. Termina en punto.',
      ].join('\n')

      const result = await llamarGemini({ herramienta: HERRAMIENTA, prompt, userId: userPlan.userId, usarLite: true, cacheable: false, maxTokens: 500 })

      if (!result.error && result.texto) {
        setInterpretacion(result.texto)
        if (userPlan.userId) await incrementarConsulta(userPlan.userId)
        analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: result.modelo })
        if (!lecturaGuardadaRef.current) {
          lecturaGuardadaRef.current = true
          await guardarLectura({ herramienta: HERRAMIENTA, titulo: `Litomancia · ${fechaHoy}`, contenido: `Pregunta: "${pregunta}"\nTirada: ${descripcionTirada}\n\n${result.texto}`, metadatos: { pregunta, fecha: fechaHoy, nombre } })
        }
      } else { setErrorMsg('Las piedras guardan silencio. Inténtalo de nuevo.') }
    } catch (err) { console.error('[Lithomancy]', err); setErrorMsg('Error inesperado.') }
    finally { setCargando(false) }
  }

  const handleValorar = (valor: 1 | -1) => { if (yaValorado) return; setYaValorado(true); analytics.registrarValoracion(valor) }

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <button onClick={() => { if (fase === 'resultado') { setFase('tirada'); setInterpretacion('') } else if (fase === 'tirada') { setFase('preguntar') } else navigate('/tradiciones') }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Litomancia</p>
            <p className="text-purple-300 text-xs">Adivinación con piedras</p>
          </div>
          <span className="text-purple-400 text-xs border border-purple-400/30 rounded-full px-2 py-0.5">✨ Premium</span>
        </div>

        {fase === 'preguntar' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">Tu pregunta (opcional)</p>
              <textarea value={pregunta} onChange={e => setPregunta(e.target.value)} placeholder="Formula tu intención antes de tirar las piedras..." rows={4} className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30" />
            </div>
            <DisclaimerIA compact />
            <button onClick={tirarPiedras} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">Tirar las piedras</button>
          </div>
        )}

        {fase === 'tirada' && tirada && (
          <div className="flex flex-col gap-4">
            <p className="text-white/60 text-sm text-center">Las piedras han caído. Observa su disposición.</p>
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5 flex flex-col gap-3">
              {tirada.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={PIEDRAS_IMG[p.nombre]} alt={p.nombre} className="w-10 h-10 rounded-full object-cover flex-shrink-0" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                  <div className="flex-1">
                    <p className="text-white text-sm font-semibold">{p.nombre}</p>
                    <p className="text-white/40 text-xs">{p.posicion} · {p.significado}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={consultar} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">Interpretar la tirada</button>
          </div>
        )}

        {fase === 'resultado' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-4">Lectura de las piedras</p>
              {cargando ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : errorMsg ? <p className="text-red-300 text-sm">{errorMsg}</p> : <TextoIA texto={interpretacion} />}
            </div>
            {!cargando && interpretacion && (
              <>
                <DisclaimerIA />
                <Valoracion onValorar={handleValorar} />
                <Compartir titulo="Litomancia" texto={interpretacion} hashtags={['Universe', 'Lithomancy']} />
                <button onClick={() => navigate('/guia')} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">Explorar con mi Guía IA</button>
                <button onClick={() => { setFase('preguntar'); setInterpretacion(''); setTirada(null); setPregunta(''); lecturaGuardadaRef.current = false }} className="w-full text-purple-300/60 text-sm py-2">Nueva tirada</button>
              </>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
