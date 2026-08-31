import { useState } from 'react'
import { sacarOgham, OGHAM } from '../lib/motores/ogham'
import Compartir from '../components/Compartir'

export default function OghamOracle() {
  const [fase, setFase] = useState<'elegir' | 'resultado'>('elegir')
  const [letras, setLetras] = useState<any[]>([])
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const nombre = localStorage.getItem('nombre') || 'viajero'

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const lanzar = async (cantidad: number) => {
    const seleccionadas = sacarOgham(cantidad)
    setLetras(seleccionadas)
    setFase('resultado')
    setCargando(true)

    const descripcion = seleccionadas.map(l =>
      `${l.simbolo} ${l.nombre} (${l.arbol}): ${l.keywords}`
    ).join('\n')

    const prompt = `Eres un experto en el Ogham, el antiguo alfabeto irlandés y su interpretación divinatoria moderna.

Nombre: ${nombre}
Letras Ogham obtenidas:
${descripcion}

Escribe una interpretación de 2-3 párrafos. El Ogham moderno asocia cada letra a un árbol y a sus cualidades simbólicas. Conecta los árboles y su simbolismo con una lectura coherente para ${nombre}. Habla de la naturaleza, de los ciclos y de la sabiduría que cada árbol representa. Nota: El uso del Ogham como sistema adivinatorio es principalmente una interpretación moderna inspirada en fuentes históricas celtas.`

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
      setInterpretacion('El bosque guarda silencio. Inténtalo de nuevo.')
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
            <p className="text-white font-semibold text-sm">Ogham · ᚑᚌᚆᚐᚋ</p>
            <p className="text-purple-300 text-xs">Alfabeto irlandés · Interpretación moderna</p>
          </div>
        </div>

        {fase === 'elegir' && (
          <div className="flex flex-col gap-5">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
              <p className="text-white/60 text-sm leading-relaxed">
                El Ogham fue un sistema de escritura utilizado en Irlanda y las islas británicas. Su uso moderno en adivinación asocia cada letra a un árbol y a sus cualidades simbólicas.
              </p>
            </div>

            <div className="flex justify-center gap-3 flex-wrap py-4">
              {OGHAM.slice(0, 6).map(l => (
                <span key={l.nombre} className="text-2xl text-purple-300 opacity-60" style={{ fontFamily: 'serif' }}>{l.simbolo}</span>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {[
                { cantidad: 1, nombre: '1 letra', desc: 'Mensaje del momento' },
                { cantidad: 3, nombre: '3 letras', desc: 'Pasado · Presente · Futuro' },
                { cantidad: 5, nombre: '5 letras', desc: 'Lectura profunda' },
              ].map(t => (
                <button
                  key={t.cantidad}
                  onClick={() => lanzar(t.cantidad)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-left hover:bg-purple-600/20 transition backdrop-blur"
                >
                  <p className="text-white font-semibold">{t.nombre}</p>
                  <p className="text-purple-300/70 text-xs mt-1">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {fase === 'resultado' && (
          <div className="flex flex-col gap-5">

            <div className="flex gap-3 flex-wrap justify-center py-4">
              {letras.map((l, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-14 h-20 bg-white/5 border border-purple-500/30 rounded-xl flex items-center justify-center backdrop-blur">
                    <span className="text-2xl text-purple-300" style={{ fontFamily: 'serif' }}>{l.simbolo}</span>
                  </div>
                  <p className="text-white text-xs font-medium">{l.nombre}</p>
                  <p className="text-white/40 text-xs text-center">{l.arbol}</p>
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

            {!cargando && interpretacion && (
              <Compartir
                titulo={`Mi lectura Ogham: ${letras.map(l => l.simbolo).join(' ')}`}
                texto={interpretacion}
                hashtags={['Ogham', 'Universe', 'Celtic', 'Arboles']}
              />
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                Explorar con mi Guía IA
              </button>
              <button onClick={() => { setFase('elegir'); setLetras([]); setInterpretacion('') }} className="w-full text-purple-300/60 text-sm py-2">
                Nueva lectura
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}