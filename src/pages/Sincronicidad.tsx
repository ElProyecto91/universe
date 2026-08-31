import { useState } from 'react'
import { interpretarSincronicidad, NUMEROS_ANGEL } from '../lib/motores/sincronicidad'
import Compartir from '../components/Compartir'

export default function Sincronicidad() {
  const [input, setInput] = useState('')
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'describir' | 'resultado'>('describir')
  const [descripcionCompleta, setDescripcionCompleta] = useState('')
  const nombre = localStorage.getItem('nombre') || 'viajero'

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const interpretar = async () => {
    if (!input.trim()) return
    const resultado = interpretarSincronicidad(input)
    setFase('resultado')
    setCargando(true)

    let contextoBase = ''
    if (resultado.interpretacion) {
      contextoBase = `Número conocido: ${input}\nMensaje base: ${resultado.interpretacion.mensaje}\nProfundización: ${resultado.interpretacion.profundizacion}\nAcción: ${resultado.interpretacion.accion}`
    }

    const prompt = `Eres un experto en sincronicidad y el significado de los números en diferentes tradiciones espirituales.

Nombre: ${nombre}
Sincronicidad observada: "${input}"
${contextoBase}

Escribe una interpretación de 3 párrafos para ${nombre}. 
Primero explora qué podría significar esta sincronicidad desde la perspectiva de diferentes tradiciones (numerología, psicología jungiana, espiritualidad moderna).
Luego conecta con la vida de ${nombre} — ¿qué podría estar comunicando el universo en este momento?
Termina con una acción o reflexión concreta.
No afirmes que la sincronicidad definitivamente significa algo — explora posibilidades con apertura.`

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
      const texto = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      setInterpretacion(texto)
      setDescripcionCompleta(input)
    } catch {
      setInterpretacion('El universo guarda silencio. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  const numerosComunes = ['111', '222', '333', '444', '555', '777', '888', '999', '1111', '1212']

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => {
            if (fase === 'resultado') setFase('describir')
            else window.location.href = '/tradiciones'
          }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Sincronicidad</p>
            <p className="text-purple-300 text-xs">Números ángel · Señales · Patrones</p>
          </div>
        </div>

        {fase === 'describir' && (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <p className="text-5xl mb-3">🔢</p>
              <p className="text-white/60 text-sm leading-relaxed">
                Jung llamó sincronicidad a las coincidencias significativas — eventos que parecen conectados aunque no tengan causa común. ¿Qué número o patrón se repite en tu vida?
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">La sincronicidad</p>
              <input
                type="text"
                placeholder="11:11, 333, 444, 1212..."
                value={input}
                onChange={e => setInput(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-purple-400 text-sm text-center text-xl"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Números frecuentes</p>
              <div className="flex flex-wrap gap-2">
                {numerosComunes.map(n => (
                  <button
                    key={n}
                    onClick={() => setInput(n)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition ${input === n ? 'bg-purple-600 border-purple-400 text-white' : 'bg-white/5 border-white/10 text-white/60 hover:border-purple-500/40'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={interpretar}
              disabled={!input.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >
              Interpretar esta sincronicidad
            </button>
          </div>
        )}

        {fase === 'resultado' && (
          <div className="flex flex-col gap-5">

            <div className="bg-white/5 border border-purple-500/20 rounded-3xl p-5 backdrop-blur text-center">
              <p className="text-5xl font-bold text-purple-300 mb-2">{descripcionCompleta}</p>
              {interpretarSincronicidad(descripcionCompleta).interpretacion && (
                <>
                  <p className="text-white/60 text-sm">{interpretarSincronicidad(descripcionCompleta).interpretacion!.mensaje}</p>
                  <p className="text-purple-300 text-xs mt-2 italic">{interpretarSincronicidad(descripcionCompleta).interpretacion!.accion}</p>
                </>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Interpretación profunda</p>
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
                titulo={`Sincronicidad ${descripcionCompleta} — mi interpretación`}
                texto={interpretacion}
                hashtags={['Sincronicidad', 'Universe', 'NumerosAngel', `N${descripcionCompleta}`]}
              />
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                Explorar con mi Guía IA
              </button>
              <button onClick={() => { setFase('describir'); setInput(''); setInterpretacion('') }} className="w-full text-purple-300/60 text-sm py-2">
                Otra sincronicidad
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}