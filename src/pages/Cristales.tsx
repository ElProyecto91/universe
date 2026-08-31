import { useState } from 'react'
import { CRISTALES, getCristalDelDia, getCristalRecomendado } from '../lib/motores/cristales'
import { getSignoSolar } from '../lib/motores/horoscopo'
import Compartir from '../components/Compartir'

export default function Cristales() {
  const [cristalKey, setCristalKey] = useState<string | null>(null)
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'elegir' | 'resultado'>('elegir')

  const nombre = localStorage.getItem('nombre') || 'viajero'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const intencion = localStorage.getItem('intencion') || 'Espiritualidad'
  const signo = getSignoSolar(fechaNacimiento)
  const cristalDelDia = getCristalDelDia()
  const cristalRecomendado = getCristalRecomendado(signo, intencion)

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const explorar = async (key: string) => {
    setCristalKey(key)
    setFase('resultado')
    setCargando(true)
    const cristal = CRISTALES[key]

    const prompt = `Eres un experto en cristaloterapia y el simbolismo de las piedras en diferentes tradiciones culturales.

Nombre: ${nombre} (${signo})
Cristal: ${key}
Keywords: ${cristal.keywords}
Chakra: ${cristal.chakra}
Planeta: ${cristal.planeta}
Elemento: ${cristal.elemento}

Escribe una lectura de cristaloterapia de 3 párrafos para ${nombre}.
Primero describe la energía y propiedades de este cristal desde diferentes tradiciones históricas.
Luego conecta con la situación actual de ${nombre} como ${signo} — qué podría estar comunicando este cristal ahora.
Termina con instrucciones específicas de uso y la afirmación del cristal.
Nota: La cristaloterapia es una práctica espiritual, no médica. Presenta como tal.`

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
      setInterpretacion('El cristal guarda silencio. Inténtalo de nuevo.')
    }
    setCargando(false)
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
            <p className="text-white font-semibold text-sm">Cristaloterapia</p>
            <p className="text-purple-300 text-xs">Guía de cristales · Tradiciones del mundo</p>
          </div>
        </div>

        {fase === 'elegir' && (
          <div className="flex flex-col gap-5">

            {/* Cristal recomendado */}
            <div className="bg-white/8 border border-purple-400/30 rounded-3xl p-5 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">✨ Recomendado para ti</p>
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CRISTALES[cristalRecomendado]?.hex, boxShadow: `0 0 20px ${CRISTALES[cristalRecomendado]?.hex}60` }}
                />
                <div className="flex-1">
                  <p className="text-white font-bold">{cristalRecomendado}</p>
                  <p className="text-white/60 text-xs">{CRISTALES[cristalRecomendado]?.keywords}</p>
                  <p className="text-purple-300 text-xs mt-1">Para tu intención: {intencion}</p>
                </div>
                <button
                  onClick={() => explorar(cristalRecomendado)}
                  className="text-purple-300 text-xs border border-purple-500/30 rounded-full px-3 py-1"
                >
                  Explorar
                </button>
              </div>
            </div>

            {/* Cristal del día */}
            <div className="bg-white/8 border border-white/20 rounded-3xl p-4 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-white/60 text-xs tracking-widest uppercase mb-3">Cristal del día</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CRISTALES[cristalDelDia]?.hex }}
                />
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{cristalDelDia}</p>
                  <p className="text-white/50 text-xs">{CRISTALES[cristalDelDia]?.keywords}</p>
                </div>
                <button onClick={() => explorar(cristalDelDia)} className="text-purple-300 text-xs border border-purple-500/30 rounded-full px-3 py-1">Ver</button>
              </div>
            </div>

            {/* Grid de cristales */}
            <p className="text-white/60 text-xs tracking-widest uppercase">Todos los cristales</p>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(CRISTALES).map(([key, cristal]) => (
                <button
                  key={key}
                  onClick={() => explorar(key)}
                  className="bg-white/8 border border-white/20 rounded-2xl p-4 text-left hover:bg-white/15 transition backdrop-blur flex items-center gap-3"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cristal.hex, boxShadow: `0 0 10px ${cristal.hex}40` }}
                  />
                  <div>
                    <p className="text-white text-sm font-semibold">{key}</p>
                    <p className="text-white/40 text-xs">{cristal.keywords.split(' · ')[0]}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {fase === 'resultado' && cristalKey && CRISTALES[cristalKey] && (
          <div className="flex flex-col gap-5">

            <div
              className="rounded-3xl p-6 backdrop-blur flex flex-col items-center gap-4"
              style={{ backgroundColor: CRISTALES[cristalKey].hex + '20', border: `1px solid ${CRISTALES[cristalKey].hex}40` }}
            >
              <div
                className="w-24 h-24 rounded-full"
                style={{ backgroundColor: CRISTALES[cristalKey].hex, boxShadow: `0 0 40px ${CRISTALES[cristalKey].hex}60` }}
              />
              <p className="text-2xl font-bold">{cristalKey}</p>
              <p className="text-sm text-center" style={{ color: CRISTALES[cristalKey].hex }}>{CRISTALES[cristalKey].keywords}</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Chakra', valor: CRISTALES[cristalKey].chakra.split(' ')[0] },
                { label: 'Elemento', valor: CRISTALES[cristalKey].elemento.split(' · ')[0] },
                { label: 'Planeta', valor: CRISTALES[cristalKey].planeta.split(' · ')[0] },
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
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Propiedades</p>
              {CRISTALES[cristalKey].propiedades.map((p, i) => (
                <p key={i} className="text-white/70 text-xs mb-1">• {p}</p>
              ))}
            </div>

            <div className="bg-white/8 border border-white/20 rounded-3xl p-5 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Cómo usarlo</p>
              {CRISTALES[cristalKey].usos.map((u, i) => (
                <p key={i} className="text-white/70 text-xs mb-1">• {u}</p>
              ))}
            </div>

            <div className="bg-purple-600/20 border border-purple-400/30 rounded-2xl p-4 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Afirmación</p>
              <p className="text-white font-medium text-sm italic">"{CRISTALES[cristalKey].afirmacion}"</p>
            </div>

            <div className="bg-white/8 border border-white/20 rounded-3xl p-6 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu lectura</p>
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
                titulo={`Mi cristal: ${cristalKey}`}
                texto={interpretacion}
                hashtags={['Cristaloterapia', 'Universe', cristalKey, 'Cristales']}
              />
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                Explorar con mi Guía IA
              </button>
              <button onClick={() => { setFase('elegir'); setCristalKey(null); setInterpretacion('') }} className="w-full text-purple-300/60 text-sm py-2">
                Explorar otro cristal
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}