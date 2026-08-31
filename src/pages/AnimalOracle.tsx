import { useState } from 'react'
import { ANIMALES, getAnimalAleatorio } from '../lib/motores/animales'
import Compartir from '../components/Compartir'

export default function AnimalOracle() {
  const [animalKey, setAnimalKey] = useState<string | null>(null)
  const [textoUsuario, setTextoUsuario] = useState('')
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'elegir' | 'resultado'>('elegir')
  const nombre = localStorage.getItem('nombre') || 'viajero'

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const consultar = async (key: string) => {
    setAnimalKey(key)
    setFase('resultado')
    setCargando(true)
    const animal = ANIMALES[key]

    const tradicionesTexto = animal.tradiciones.map(t =>
      `${t.nombre}: ${t.significado}`
    ).join('\n')

    const prompt = `Eres un experto en simbolismo animal en diferentes culturas y tradiciones espirituales del mundo.

Nombre: ${nombre}
${textoUsuario ? `Situación/pregunta: "${textoUsuario}"` : 'Sin pregunta específica.'}
Animal: ${animal.simbolo} ${key.charAt(0).toUpperCase() + key.slice(1)}
Keywords: ${animal.keywords}

Simbolismo en diferentes tradiciones:
${tradicionesTexto}

Escribe una interpretación personal de 3 párrafos para ${nombre}. Primero explora brevemente el simbolismo del animal en diferentes culturas. Luego conecta ese simbolismo con la situación de ${nombre}. Termina con el mensaje que este animal trae específicamente para ellos ahora. Sé poético y profundo. No afirmes que el animal "predice" nada.`

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
      setInterpretacion('El animal guarda silencio. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  const elegirAleatorio = () => {
    const key = getAnimalAleatorio()
    consultar(key)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => {
            if (fase === 'resultado') setFase('elegir')
            else window.location.href = '/tradiciones'
          }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Simbolismo Animal</p>
            <p className="text-purple-300 text-xs">Tradiciones del mundo · Arquetipos</p>
          </div>
        </div>

        {fase === 'elegir' && (
          <div className="flex flex-col gap-5">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
              <p className="text-white/60 text-sm leading-relaxed">
                Los animales han sido símbolos sagrados en culturas de todo el mundo. Elige el animal que sientes cercano o deja que el universo elija por ti.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu situación (opcional)</p>
              <textarea
                value={textoUsuario}
                onChange={e => setTextoUsuario(e.target.value)}
                placeholder="¿Qué está pasando en tu vida? ¿Qué animal sientes que te visita?"
                rows={3}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {Object.entries(ANIMALES).map(([key, animal]) => (
                <button
                  key={key}
                  onClick={() => consultar(key)}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-purple-600/20 hover:border-purple-500/40 transition backdrop-blur"
                >
                  <span className="text-3xl">{animal.simbolo}</span>
                  <p className="text-white text-xs capitalize">{key}</p>
                </button>
              ))}
            </div>

            <button
              onClick={elegirAleatorio}
              className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full hover:bg-white/20 transition"
            >
              El universo elige por mí
            </button>
          </div>
        )}

        {fase === 'resultado' && animalKey && (
          <div className="flex flex-col gap-5">

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur flex flex-col items-center gap-3">
              <span className="text-6xl">{ANIMALES[animalKey].simbolo}</span>
              <p className="text-2xl font-bold capitalize">{animalKey}</p>
              <p className="text-purple-300 text-sm text-center">{ANIMALES[animalKey].keywords}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">En diferentes tradiciones</p>
              {ANIMALES[animalKey].tradiciones.map((t, i) => (
                <div key={i} className="mb-3 last:mb-0">
                  <p className="text-white/60 text-xs font-semibold mb-1">{t.nombre}</p>
                  <p className="text-white/70 text-xs leading-relaxed">{t.significado}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu interpretación</p>
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
                titulo={`Mi animal guía: ${animalKey} ${ANIMALES[animalKey].simbolo}`}
                texto={interpretacion}
                hashtags={['AnimalOracle', 'Universe', 'Simbolismo', animalKey]}
              />
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                Explorar con mi Guía IA
              </button>
              <button onClick={() => { setFase('elegir'); setAnimalKey(null); setInterpretacion('') }} className="w-full text-purple-300/60 text-sm py-2">
                Explorar otro animal
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}