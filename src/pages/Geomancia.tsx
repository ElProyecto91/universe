import { useState } from 'react'
import { generarLectura3Figuras, FIGURAS_GEOMANTICAS } from '../lib/motores/geomancia'
import Compartir from '../components/Compartir'
import { llamarGemini } from '../lib/gemini'

export default function Geomancia() {
  const [lectura, setLectura] = useState<any>(null)
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'preguntar' | 'resultado'>('preguntar')
  const [pregunta, setPregunta] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const nombre = localStorage.getItem('nombre') || 'viajero'
  const userId = null

  const bgStyle = { backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }

  const consultar = async () => {
    if (!pregunta.trim()) return
    const resultado = generarLectura3Figuras()
    setLectura(resultado)
    setFase('resultado')
    setCargando(true)
    setErrorMsg('')

    const result = await llamarGemini({
      herramienta: 'geomancia',
      prompt: `Experto en geomancia (ʿilm al-raml), sistema árabe-africano-medieval de adivinación mediante figuras.

Nombre: ${nombre}
Pregunta: "${pregunta}"
ESCUDO (situación actual): ${resultado.escudo.nombre} — ${resultado.escudo.keywords}
CORAZÓN (desarrollo): ${resultado.corazon.nombre} — ${resultado.corazon.keywords}
TESTIGO (resultado/consejo): ${resultado.testigo.nombre} — ${resultado.testigo.keywords}

3 párrafos: escudo (situación actual), corazón (desarrollo), testigo (consejo). Conecta las tres figuras narrativamente. Respetuoso con la tradición histórica.`,
      userId, usarLite: false, cacheable: false, maxTokens: 400,
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
          <button onClick={() => { if (fase === 'resultado') setFase('preguntar'); else window.location.href = '/tradiciones' }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Geomancia · علم الرمل</p>
            <p className="text-purple-300 text-xs">Tradición árabe-africana-medieval</p>
          </div>
        </div>
        {fase === 'preguntar' && (
          <div className="flex flex-col gap-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
              <p className="text-white/60 text-sm leading-relaxed">La geomancia (ʿilm al-raml — ciencia de la arena) es uno de los sistemas de adivinación más extendidos históricamente. 16 figuras, formadas por puntos en la arena, interpretan la energía de cualquier pregunta.</p>
            </div>
            <div className="flex justify-center gap-6 py-4">
              {FIGURAS_GEOMANTICAS.slice(0, 4).map(f => (
                <div key={f.nombre} className="text-center">
                  <div className="text-purple-300 text-xs font-mono whitespace-pre leading-tight">{f.simbolo}</div>
                  <p className="text-white/30 text-xs mt-1">{f.nombre}</p>
                </div>
              ))}
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu pregunta</p>
              <textarea value={pregunta} onChange={e => setPregunta(e.target.value)} placeholder="Formula tu pregunta con claridad..." rows={3} className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30" />
            </div>
            <button onClick={consultar} disabled={!pregunta.trim()} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40">Generar las figuras</button>
          </div>
        )}
        {fase === 'resultado' && lectura && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-3 gap-2">
              {[{ label: 'Escudo', figura: lectura.escudo, desc: 'Situación' },{ label: 'Corazón', figura: lectura.corazon, desc: 'Desarrollo' },{ label: 'Testigo', figura: lectura.testigo, desc: 'Resultado' }].map(item => (
                <div key={item.label} className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur flex flex-col items-center gap-2">
                  <p className="text-purple-300 text-xs">{item.label}</p>
                  <p className="text-white text-xs font-semibold text-center">{item.figura.nombre}</p>
                  <p className="text-white/40 text-xs">{item.desc}</p>
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
              ) : errorMsg ? <p className="text-red-400 text-sm">{errorMsg}</p>
              : <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{interpretacion}</p>}
            </div>
            {!cargando && interpretacion && <Compartir titulo={`Geomancia: ${lectura.escudo.nombre} · ${lectura.corazon.nombre} · ${lectura.testigo.nombre}`} texto={interpretacion} hashtags={['Geomancia', 'Universe', 'IlmAlRaml', 'Adivinacion']} />}
            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">Explorar con mi Guía IA</button>
              <button onClick={() => { setFase('preguntar'); setLectura(null); setInterpretacion(''); setErrorMsg('') }} className="w-full text-purple-300/60 text-sm py-2">Nueva consulta</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
