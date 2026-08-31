import { useState } from 'react'
import { calcularNumerologiaCompleta, NUMERO_ALMA } from '../lib/motores/numerologiaNombre'
import Compartir from '../components/Compartir'

export default function NumerologiaNombre() {
  const [nombreInput, setNombreInput] = useState(localStorage.getItem('nombre') || '')
  const [resultado, setResultado] = useState<any>(null)
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'datos' | 'resultado'>('datos')

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const calcular = async () => {
    if (!nombreInput.trim()) return
    const res = calcularNumerologiaCompleta(nombreInput)
    setResultado(res)
    setFase('resultado')
    setCargando(true)

    const almaData = NUMERO_ALMA[res.numeroAlma]

    const prompt = `Eres una experta en numerología del nombre — la interpretación de los números que emergen de las letras del nombre de una persona.

Nombre analizado: ${nombreInput}
Número de Expresión (todas las letras): ${res.numeroExpresion} — lo que manifiestas al mundo
Número del Alma (solo vocales): ${res.numeroAlma} — lo que anhelas en lo más profundo
Número de Personalidad (solo consonantes): ${res.numeroPersonalidad} — cómo te perciben los demás

El Alma: ${almaData?.titulo} — ${almaData?.descripcion}

Escribe una lectura numerológica del nombre de 3-4 párrafos. 
Primero el Número de Expresión — cómo se manifiesta esta persona al mundo.
Luego el Número del Alma — el deseo más profundo, lo que el corazón anhela.
Después el Número de Personalidad — cómo la perciben los demás.
Termina conectando los tres números en una narrativa coherente. ¿Hay tensión o armonía entre lo que expresa, lo que desea y cómo la ven?`

    try {
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
          }),
        }
      )
      const data = await r.json()
      setInterpretacion(data.candidates?.[0]?.content?.parts?.[0]?.text || '')
    } catch {
      setInterpretacion('Los números guardan silencio. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => {
            if (fase === 'resultado') setFase('datos')
            else window.location.href = '/tradiciones'
          }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Numerología del Nombre</p>
            <p className="text-purple-300 text-xs">Expresión · Alma · Personalidad</p>
          </div>
        </div>

        {fase === 'datos' && (
          <div className="flex flex-col gap-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
              <p className="text-white/60 text-sm leading-relaxed text-center">
                Tu nombre no es aleatorio. Cada letra tiene un valor numérico que revela tres aspectos: cómo te expresas, qué anhelas y cómo te perciben.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu nombre completo</p>
              <input
                type="text"
                placeholder="Escribe tu nombre completo"
                value={nombreInput}
                onChange={e => setNombreInput(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-white/30 outline-none focus:border-purple-400 text-sm"
              />
              <p className="text-white/30 text-xs mt-2 text-center">Usa tu nombre de nacimiento para mayor precisión</p>
            </div>

            <button
              onClick={calcular}
              disabled={!nombreInput.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >
              Analizar mi nombre
            </button>
          </div>
        )}

        {fase === 'resultado' && resultado && (
          <div className="flex flex-col gap-5">

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Expresión', numero: resultado.numeroExpresion, desc: 'Cómo manifiestas', color: '#c084fc' },
                { label: 'Alma', numero: resultado.numeroAlma, desc: 'Lo que anhelas', color: '#f9a8d4' },
                { label: 'Personalidad', numero: resultado.numeroPersonalidad, desc: 'Cómo te ven', color: '#7dd3fc' },
              ].map(item => (
                <div key={item.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-1 backdrop-blur">
                  <p className="text-4xl font-light" style={{ color: item.color, textShadow: `0 0 15px ${item.color}50` }}>{item.numero}</p>
                  <p className="text-white text-xs font-semibold">{item.label}</p>
                  <p className="text-white/30 text-xs text-center">{item.desc}</p>
                </div>
              ))}
            </div>

            {resultado.numeroAlma && NUMERO_ALMA[resultado.numeroAlma] && (
              <div className="bg-white/5 border border-pink-500/20 rounded-3xl p-5 backdrop-blur">
                <p className="text-pink-300 text-xs tracking-widest uppercase mb-2">Tu Alma · {NUMERO_ALMA[resultado.numeroAlma].titulo}</p>
                <p className="text-white/80 text-sm leading-relaxed">{NUMERO_ALMA[resultado.numeroAlma].descripcion}</p>
              </div>
            )}

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Lectura completa</p>
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
                titulo={`Numerología de ${nombreInput}: ${resultado.numeroExpresion}-${resultado.numeroAlma}-${resultado.numeroPersonalidad}`}
                texto={interpretacion}
                hashtags={['NumerologiaNombre', 'Universe', 'Numerologia']}
              />
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                Explorar con mi Guía IA
              </button>
              <button onClick={() => { setFase('datos'); setInterpretacion(''); setResultado(null) }} className="w-full text-purple-300/60 text-sm py-2">
                Analizar otro nombre
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}