import { useState } from 'react'
import { TECNICAS_MANIFESTACION, getTecnicaDelDia } from '../lib/motores/manifestacion'
import Compartir from '../components/Compartir'
import { llamarGemini } from '../lib/gemini'

export default function Manifestacion() {
  const [intencion, setIntencion] = useState('')
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'escribir' | 'resultado'>('escribir')
  const [errorMsg, setErrorMsg] = useState('')
  const nombre = localStorage.getItem('nombre') || 'viajero'
  const signo = localStorage.getItem('signo') || 'Leo'
  const tecnicaDelDia = getTecnicaDelDia()
  const userId = null

  const bgStyle = { backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }

  const generar = async () => {
    if (!intencion.trim()) return
    setFase('resultado')
    setCargando(true)
    setErrorMsg('')

    const result = await llamarGemini({
      herramienta: 'manifestacion',
      prompt: `Guía de manifestación consciente y psicología positiva.

Nombre: ${nombre} · Signo: ${signo}
Intención: "${intencion}"
Técnica del día: ${tecnicaDelDia.nombre}

2 párrafos: reencuadre poético de la intención como si ya fuera realidad, 3 pasos concretos aplicando la técnica ${tecnicaDelDia.nombre}. Sin promesas mágicas.`,
      userId, usarLite: true, cacheable: false, maxTokens: 200,
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
          <button onClick={() => { if (fase === 'resultado') setFase('escribir'); else window.location.href = '/universo' }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Manifestación</p>
            <p className="text-purple-300 text-xs">Intención consciente</p>
          </div>
        </div>
        {fase === 'escribir' && (
          <div className="flex flex-col gap-5">
            <div className="bg-purple-600/20 border border-purple-400/30 rounded-3xl p-5 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Técnica del día</p>
              <p className="text-white font-bold">{tecnicaDelDia.nombre}</p>
              <p className="text-white/60 text-xs mt-1">{tecnicaDelDia.descripcion}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu intención</p>
              <textarea value={intencion} onChange={e => setIntencion(e.target.value)} placeholder="¿Qué quieres manifestar en tu vida?" rows={4} className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30" />
            </div>
            <div className="flex flex-col gap-2">
              {TECNICAS_MANIFESTACION.map(t => (
                <div key={t.nombre} className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur">
                  <p className="text-white/70 text-xs font-semibold">{t.nombre}</p>
                  <p className="text-white/40 text-xs">{t.descripcion}</p>
                </div>
              ))}
            </div>
            <button onClick={generar} disabled={!intencion.trim()} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full disabled:opacity-40">Activar mi intención</button>
          </div>
        )}
        {fase === 'resultado' && (
          <div className="flex flex-col gap-5">
            <div className="bg-purple-600/20 border border-purple-400/30 rounded-3xl p-5 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Tu intención</p>
              <p className="text-white italic">"{intencion}"</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu guía de manifestación</p>
              {cargando ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : errorMsg ? <p className="text-red-400 text-sm">{errorMsg}</p>
              : <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{interpretacion}</p>}
            </div>
            {!cargando && interpretacion && <Compartir titulo="Mi intención manifestada" texto={`"${intencion}"\n\n${interpretacion}`} hashtags={['Manifestacion', 'Universe', 'LeyDeAtraccion']} />}
            <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">Explorar con mi Guía IA</button>
          </div>
        )}
      </div>
    </div>
  )
}
