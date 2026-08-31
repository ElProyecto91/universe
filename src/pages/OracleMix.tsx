import { useState } from 'react'
import { getCartaDiaria } from '../lib/motores/tarotDiario'
import { sacarRunas } from '../lib/motores/runas'
import { lanzarMonedas, lineasAHexagrama, HEXAGRAMAS } from '../lib/motores/iching'
import { getFaseLunar } from '../lib/motores/luna'
import { calcularNumerologia } from '../lib/motores/numerologia'
import Compartir from '../components/Compartir'

const SISTEMAS = [
  { id: 'tarot', nombre: 'Tarot', simbolo: '🃏' },
  { id: 'runas', nombre: 'Runas', simbolo: 'ᚠ' },
  { id: 'iching', nombre: 'I Ching', simbolo: '☯' },
  { id: 'luna', nombre: 'Luna', simbolo: '🌙' },
  { id: 'numerologia', nombre: 'Numerología', simbolo: '∞' },
]

export default function OracleMix() {
  const [seleccionados, setSeleccionados] = useState<string[]>(['tarot', 'iching'])
  const [pregunta, setPregunta] = useState('')
  const [resultado, setResultado] = useState<any>(null)
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'configurar' | 'resultado'>('configurar')
  const nombre = localStorage.getItem('nombre') || 'viajero'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const toggleSistema = (id: string) => {
    setSeleccionados(prev =>
      prev.includes(id)
        ? prev.filter(s => s !== id)
        : prev.length < 4 ? [...prev, id] : prev
    )
  }

  const generarOracleMix = async () => {
    if (!pregunta.trim() || seleccionados.length < 2) return
    setCargando(true)
    setFase('resultado')

    const lecturas: Record<string, string> = {}

    if (seleccionados.includes('tarot')) {
      const carta = getCartaDiaria()
      lecturas.tarot = `${carta.nombre} (${carta.keywords})`
    }

    if (seleccionados.includes('runas')) {
      const runas = sacarRunas(1)
      lecturas.runas = `${runas[0].simbolo} ${runas[0].nombre} — ${runas[0].keywords}`
    }

    if (seleccionados.includes('iching')) {
      const lineas = lanzarMonedas()
      const { hexagrama } = lineasAHexagrama(lineas)
      const hex = HEXAGRAMAS[hexagrama - 1]
      lecturas.iching = `Hexagrama ${hex.numero}: ${hex.nombre} — ${hex.keywords}`
    }

    if (seleccionados.includes('luna')) {
      const fase = getFaseLunar()
      lecturas.luna = `${fase.nombre} — ${fase.energia}`
    }

    if (seleccionados.includes('numerologia')) {
      const { numeroVida } = calcularNumerologia(nombre, fechaNacimiento)
      lecturas.numerologia = `Número de Vida ${numeroVida}`
    }

    setResultado(lecturas)

    const lec = Object.entries(lecturas).map(([sistema, lectura]) => `${sistema.toUpperCase()}: ${lectura}`).join('\n')

    const prompt = `Eres un intérprete experto en múltiples sistemas de sabiduría y adivinación. Tu tarea es sintetizar perspectivas de diferentes tradiciones sobre una misma pregunta.

Nombre: ${nombre}
Pregunta: "${pregunta}"

Lecturas obtenidas de cada sistema:
${lec}

Escribe un Oracle Report de 4-5 párrafos:
1. Primero interpreta brevemente lo que cada sistema dice sobre la pregunta (1 párrafo por sistema).
2. Luego identifica QUÉ REPITEN o confirman todos los sistemas (patrones comunes).
3. Luego menciona DÓNDE DIFIEREN o se complementan.
4. Termina con una síntesis y una pregunta de reflexión profunda.

Habla directamente a ${nombre}. Sé poético pero concreto. No presentes los sistemas como verdades absolutas sino como perspectivas que iluminan desde ángulos diferentes.`

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
      setInterpretacion('El Oracle Mix guarda silencio. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => {
            if (fase === 'resultado') setFase('configurar')
            else window.location.href = '/tradiciones'
          }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Oracle Mix</p>
            <p className="text-purple-300 text-xs">Múltiples tradiciones · Una pregunta</p>
          </div>
        </div>

        {fase === 'configurar' && (
          <div className="flex flex-col gap-5">

            <div className="bg-white/5 border border-purple-500/20 rounded-3xl p-5 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">¿Qué es Oracle Mix?</p>
              <p className="text-white/60 text-sm leading-relaxed">
                Combina hasta 4 sistemas de sabiduría para explorar tu pregunta desde múltiples perspectivas. La IA sintetiza las perspectivas, identifica lo que coinciden y lo que difieren.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu pregunta</p>
              <textarea
                value={pregunta}
                onChange={e => setPregunta(e.target.value)}
                placeholder="Formula la pregunta que quieres explorar desde múltiples tradiciones..."
                rows={3}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-4">
                Elige sistemas (2-4) — {seleccionados.length} seleccionados
              </p>
              <div className="grid grid-cols-3 gap-3">
                {SISTEMAS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => toggleSistema(s.id)}
                    className={`rounded-2xl p-3 flex flex-col items-center gap-1 transition border ${seleccionados.includes(s.id) ? 'bg-purple-600/40 border-purple-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                  >
                    <span className="text-2xl">{s.simbolo}</span>
                    <span className="text-xs text-white">{s.nombre}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generarOracleMix}
              disabled={!pregunta.trim() || seleccionados.length < 2}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >
              Generar Oracle Report
            </button>
          </div>
        )}

        {fase === 'resultado' && (
          <div className="flex flex-col gap-5">

            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur">
              <p className="text-white/40 text-xs">Pregunta: <span className="text-white/70 italic">"{pregunta}"</span></p>
            </div>

            {resultado && (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
                <p className="text-purple-300 text-xs tracking-widest uppercase mb-4">Sistemas consultados</p>
                <div className="flex flex-col gap-2">
                  {Object.entries(resultado).map(([sistema, lectura]) => (
                    <div key={sistema} className="flex items-start gap-3">
                      <span className="text-purple-300 text-xs uppercase w-20 flex-shrink-0 pt-0.5">{sistema}</span>
                      <span className="text-white/70 text-xs">{String(lectura)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Oracle Report</p>
              {cargando ? (
                <div className="flex gap-2 py-4">
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
                titulo="Mi Oracle Mix — múltiples tradiciones"
                texto={interpretacion}
                hashtags={['OracleMix', 'Universe', 'Sabiduria', 'Oracles']}
              />
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                Explorar con mi Guía IA
              </button>
              <button onClick={() => { setFase('configurar'); setInterpretacion(''); setResultado(null) }} className="w-full text-purple-300/60 text-sm py-2">
                Nueva consulta
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}