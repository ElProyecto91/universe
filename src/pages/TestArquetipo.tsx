import { useState } from 'react'
import { ARQUETIPOS, PREGUNTAS_TEST, calcularArquetipo } from '../lib/motores/arquetipos'
import Compartir from '../components/Compartir'

export default function TestArquetipo() {
  const [paso, setPaso] = useState(0)
  const [respuestas, setRespuestas] = useState<number[]>([])
  const [resultado, setResultado] = useState<typeof ARQUETIPOS[0] | null>(null)
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'test' | 'resultado'>('test')

  const nombre = localStorage.getItem('nombre') || 'viajero'

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const responder = async (idx: number) => {
    const nuevasRespuestas = [...respuestas, idx]
    setRespuestas(nuevasRespuestas)

    if (paso < PREGUNTAS_TEST.length - 1) {
      setPaso(p => p + 1)
    } else {
      const arquetipo = calcularArquetipo(nuevasRespuestas)
      setResultado(arquetipo)
      setFase('resultado')
      setCargando(true)

      const prompt = `Eres un experto en psicología arquetípica jungiana y espiritualidad comparada.

Nombre: ${nombre}
Arquetipo dominante: ${arquetipo.nombre} — ${arquetipo.subtitulo}
Keywords: ${arquetipo.keywords}
Descripción: ${arquetipo.descripcion}
Fortalezas: ${arquetipo.fortalezas.join(', ')}
Sombra: ${arquetipo.sombra}
Camino: ${arquetipo.camino}
Tarot asociado: ${arquetipo.tarot}
Planeta: ${arquetipo.planeta}
Elemento: ${arquetipo.elemento}

Escribe una lectura arquetípica profunda y personal de 4 párrafos para ${nombre}.
Primero describe el arquetipo y cómo se manifiesta en una vida como la de ${nombre}.
Luego explora las fortalezas — cómo puede aprovecharlas mejor.
Después trabaja la sombra — qué necesita integrar para ser más completo.
Termina con el camino específico de ${nombre} como ${arquetipo.nombre}.
Sé profundo, poético y honesto. Basa el análisis en la psicología jungiana y el simbolismo espiritual.`

      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
            }),
          }
        )
        const data = await res.json()
        setInterpretacion(data.candidates?.[0]?.content?.parts?.[0]?.text || '')
      } catch {
        setInterpretacion('Los arquetipos guardan silencio. Inténtalo de nuevo.')
      }
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => window.location.href = '/tradiciones'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Test de Arquetipo</p>
            <p className="text-purple-300 text-xs">Psicología jungiana · 5 preguntas</p>
          </div>
        </div>

        {fase === 'test' && (
          <div className="flex flex-col gap-6">

            {/* Progreso */}
            <div className="flex gap-1">
              {PREGUNTAS_TEST.map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < paso ? 'bg-purple-400' : i === paso ? 'bg-purple-600' : 'bg-white/20'}`} />
              ))}
            </div>

            <div className="bg-white/8 border border-purple-500/20 rounded-3xl p-6 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-4">Pregunta {paso + 1} de {PREGUNTAS_TEST.length}</p>
              <p className="text-white text-lg leading-relaxed font-medium">
                {PREGUNTAS_TEST[paso].pregunta}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {PREGUNTAS_TEST[paso].opciones.map((opcion, idx) => (
                <button
                  key={idx}
                  onClick={() => responder(idx)}
                  className="w-full bg-white/8 border border-white/20 rounded-2xl p-4 text-left hover:bg-purple-600/20 hover:border-purple-500/40 transition backdrop-blur"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                >
                  <p className="text-white text-sm leading-relaxed">{opcion.texto}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {fase === 'resultado' && resultado && (
          <div className="flex flex-col gap-5">

            <div className="bg-white/8 border border-purple-400/30 rounded-3xl p-6 backdrop-blur flex flex-col items-center gap-3"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-6xl">{resultado.simbolo}</p>
              <p className="text-2xl font-bold">{resultado.nombre}</p>
              <p className="text-purple-300 text-sm">{resultado.subtitulo}</p>
              <p className="text-white/60 text-sm text-center">{resultado.keywords}</p>
            </div>

            <div className="bg-white/8 border border-white/20 rounded-3xl p-5 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-white/80 text-sm leading-relaxed">{resultado.descripcion}</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Tarot', valor: resultado.tarot.split('(')[0].trim() },
                { label: 'Planeta', valor: resultado.planeta.split(' · ')[0] },
                { label: 'Elemento', valor: resultado.elemento.split(' · ')[0] },
              ].map(item => (
                <div key={item.label} className="bg-white/8 border border-white/20 rounded-2xl p-3 text-center"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                  <p className="text-white/40 text-xs uppercase">{item.label}</p>
                  <p className="text-white text-xs font-semibold mt-1">{item.valor}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/8 border border-white/20 rounded-3xl p-5 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-green-400 text-xs tracking-widest uppercase mb-2">Fortalezas</p>
              {resultado.fortalezas.map((f, i) => (
                <p key={i} className="text-white/70 text-xs mb-1">• {f}</p>
              ))}
            </div>

            <div className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-amber-400 text-xs tracking-widest uppercase mb-2">Sombra</p>
              <p className="text-white/70 text-xs">{resultado.sombra}</p>
            </div>

            <div className="bg-purple-600/20 border border-purple-400/30 rounded-2xl p-4 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Tu camino</p>
              <p className="text-white text-sm leading-relaxed">{resultado.camino}</p>
            </div>

            <div className="bg-white/8 border border-white/20 rounded-3xl p-6 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu lectura arquetípica</p>
              {cargando ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : (
                <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{interpretacion}</p>
              )}
            </div>

            {!cargando && interpretacion && (
              <Compartir
                titulo={`Mi arquetipo: ${resultado.nombre} ${resultado.simbolo}`}
                texto={`Soy ${resultado.nombre} — ${resultado.subtitulo}.\n\n${interpretacion}`}
                hashtags={['Arquetipo', 'Universe', resultado.nombre.replace(' ', ''), 'Jung']}
              />
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                Explorar con mi Guía IA
              </button>
              <button onClick={() => { setFase('test'); setPaso(0); setRespuestas([]); setResultado(null); setInterpretacion('') }} className="w-full text-purple-300/60 text-sm py-2">
                Repetir el test
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}