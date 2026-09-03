import { useState } from 'react'
import { getTextoAleatorio, TEXTOS_DOMINIO_PUBLICO } from '../lib/motores/bibliomancia'
import Compartir from '../components/Compartir'
import { llamarGemini } from '../lib/gemini'

export default function Bibliomancia() {
  const [texto, setTexto] = useState<typeof TEXTOS_DOMINIO_PUBLICO[0] | null>(null)
  const [pregunta, setPregunta] = useState('')
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'preguntar' | 'resultado'>('preguntar')
  const [errorMsg, setErrorMsg] = useState('')
  const nombre = localStorage.getItem('nombre') || 'viajero'
  const userId = null

  const bgStyle = { backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }

  const abrir = async () => {
    if (!pregunta.trim()) return
    const pasaje = getTextoAleatorio()
    setTexto(pasaje)
    setFase('resultado')
    setCargando(true)
    setErrorMsg('')

    const result = await llamarGemini({
      herramienta: 'bibliomancia',
      prompt: `Intérprete de bibliomancia. Encuentra orientación en textos abiertos al azar.

Nombre: ${nombre}
Pregunta: "${pregunta}"
Pasaje: "${pasaje.texto}"
Fuente: ${pasaje.fuente}

2-3 párrafos: conexión simbólica entre el pasaje y la pregunta de ${nombre}, perspectiva más profunda, pregunta de reflexión final. Sin predicciones absolutas.`,
      userId,
      usarLite: false,
      cacheable: false,
      maxTokens: 350,
    })

    if (result.error) setErrorMsg(result.error)
    else setInterpretacion(result.texto)
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />
      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">
        <div className="flex items-center">
          <button onClick={() => window.location.href = '/tradiciones'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Bibliomancia</p>
            <p className="text-purple-300 text-xs">Textos en dominio público · Sabiduría universal</p>
          </div>
        </div>
        {fase === 'preguntar' && (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <p className="text-6xl mb-4">📖</p>
              <p className="text-white/60 text-sm leading-relaxed">La bibliomancia es el arte de encontrar orientación abriendo un texto al azar. Nuestra biblioteca incluye textos filosóficos y poéticos en dominio público de culturas de todo el mundo.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu pregunta</p>
              <textarea value={pregunta} onChange={e => setPregunta(e.target.value)} placeholder="¿Qué necesitas saber hoy?" rows={3} className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30" />
            </div>
            <button onClick={abrir} disabled={!pregunta.trim()} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40">Abrir el libro</button>
          </div>
        )}
        {fase === 'resultado' && texto && (
          <div className="flex flex-col gap-5">
            <div className="bg-white/5 border border-purple-500/20 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">El pasaje</p>
              <p className="text-white/90 text-base leading-relaxed italic mb-3">"{texto.texto}"</p>
              <p className="text-white/40 text-xs">— {texto.fuente}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur">
              <p className="text-white/40 text-xs">Pregunta: <span className="text-white/70 italic">"{pregunta}"</span></p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Reflexión</p>
              {cargando ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : errorMsg ? <p className="text-red-400 text-sm">{errorMsg}</p>
              : <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{interpretacion}</p>}
            </div>
            {!cargando && interpretacion && <Compartir titulo={`Bibliomancia: ${texto.fuente}`} texto={`"${texto.texto}"\n\n${interpretacion}`} hashtags={['Bibliomancia', 'Universe', 'Sabiduria']} />}
            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">Explorar con mi Guía IA</button>
              <button onClick={() => { setFase('preguntar'); setTexto(null); setInterpretacion(''); setErrorMsg('') }} className="w-full text-purple-300/60 text-sm py-2">Nueva consulta</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
