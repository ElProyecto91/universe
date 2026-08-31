import { useState } from 'react'
import { sacarRunas, RUNAS } from '../lib/motores/runas'
import Compartir from '../components/Compartir'

const TIRADAS = [
  { id: 'una', nombre: '1 Runa', descripcion: 'Mensaje del día', cantidad: 1 },
  { id: 'tres', nombre: '3 Runas', descripcion: 'Pasado · Presente · Futuro', cantidad: 3 },
  { id: 'cinco', nombre: '5 Runas', descripcion: 'Lectura profunda', cantidad: 5 },
]

export default function Runas() {
  const [fase, setFase] = useState<'elegir' | 'resultado'>('elegir')
  const [runas, setRunas] = useState<any[]>([])
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const nombre = localStorage.getItem('nombre') || 'viajero'

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const lanzar = async (t: typeof TIRADAS[0]) => {
    const runasSeleccionadas = sacarRunas(t.cantidad)
    setRunas(runasSeleccionadas)
    setFase('resultado')
    setCargando(true)

    const descripcionRunas = runasSeleccionadas.map(r =>
      `${r.simbolo} ${r.nombre} ${r.estaInvertida ? '(invertida)' : ''}: ${r.keywords}`
    ).join('\n')

    const prompt = `Eres un experto en runas germánicas con conocimiento profundo tanto de su historia como de su uso moderno en adivinación.

Nombre: ${nombre}
Tirada: ${t.descripcion}
Runas obtenidas:
${descripcionRunas}

Escribe una interpretación rúnica de 3-4 párrafos. Primero describe la energía general de la tirada. Luego interpreta cada runa en su posición. Conecta los mensajes entre sí. Termina con una pregunta de reflexión. Habla directamente a ${nombre}.`

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
      const texto = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (texto) {
        setInterpretacion(texto)
      } else {
        setInterpretacion('Error: ' + JSON.stringify(data).substring(0, 300))
      }
    } catch (err) {
      setInterpretacion('Error de conexión: ' + String(err))
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => window.location.href = '/tradiciones'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Runas · ᚠᚢᚦᚨᚱ</p>
            <p className="text-purple-300 text-xs">Tradición germánica · Reconstrucción moderna</p>
          </div>
        </div>

        {fase === 'elegir' && (
          <div className="flex flex-col gap-5">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
              <p className="text-white/60 text-sm leading-relaxed">
                Las runas son un sistema de escritura germánico histórico. Su uso moderno en adivinación es principalmente una reconstrucción contemporánea inspirada en fuentes históricas y poéticas nórdicas.
              </p>
            </div>

            <div className="flex justify-center gap-4 flex-wrap py-4">
              {RUNAS.slice(0, 8).map(r => (
                <span key={r.nombre} className="text-3xl text-purple-300 opacity-60" style={{ fontFamily: 'serif' }}>{r.simbolo}</span>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {TIRADAS.map(t => (
                <button
                  key={t.id}
                  onClick={() => lanzar(t)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-left hover:bg-purple-600/20 hover:border-purple-500/40 transition backdrop-blur"
                >
                  <p className="text-white font-semibold">{t.nombre}</p>
                  <p className="text-purple-300/70 text-xs mt-1">{t.descripcion}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {fase === 'resultado' && (
          <div className="flex flex-col gap-5">

            <div className="flex gap-3 flex-wrap justify-center py-4">
              {runas.map((r, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div
                    className="w-16 h-20 bg-white/5 border border-purple-500/30 rounded-xl flex items-center justify-center backdrop-blur"
                    style={{ transform: r.estaInvertida ? 'rotate(180deg)' : 'none' }}
                  >
                    <span className="text-3xl text-purple-300" style={{ fontFamily: 'serif' }}>{r.simbolo}</span>
                  </div>
                  <p className="text-white text-xs font-medium">{r.nombre}</p>
                  {r.estaInvertida && <p className="text-purple-400 text-xs">Invertida</p>}
                  <p className="text-white/40 text-xs text-center max-w-20">{r.keywords.split(' · ')[0]}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Interpretación</p>
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

            {!cargando && interpretacion && !interpretacion.startsWith('Error') && (
              <Compartir
                titulo={`Mi tirada de Runas: ${runas.map(r => r.simbolo).join(' ')}`}
                texto={interpretacion}
                hashtags={['Runas', 'Universe', 'Norse', 'Runes']}
              />
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                Explorar con mi Guía IA
              </button>
              <button onClick={() => { setFase('elegir'); setRunas([]); setInterpretacion('') }} className="w-full text-purple-300/60 text-sm py-2">
                Nueva tirada
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}