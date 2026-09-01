import { useState } from 'react'
import { PLANETAS_INFO, CASAS_ASTROLOGICAS, calcularSignoLunaAprox, calcularVenusAprox, calcularMarteAprox, calcularMercurioAprox } from '../lib/motores/cartaNatal'
import { getSignoSolar } from '../lib/motores/horoscopo'
import Compartir from '../components/Compartir'

export default function CartaNatal() {
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [generado, setGenerado] = useState(false)
  const [vistaActiva, setVistaActiva] = useState<'planetas' | 'casas' | 'lectura'>('planetas')

  const nombre = localStorage.getItem('nombre') || 'viajero'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const signoSolar = getSignoSolar(fechaNacimiento)
  const signoLuna = calcularSignoLunaAprox(fechaNacimiento)
  const signoBGMercurio = calcularMercurioAprox(signoSolar)
  const signoVenus = calcularVenusAprox(signoSolar)
  const signoMarte = calcularMarteAprox(fechaNacimiento)

  const planetas = [
    { planeta: 'Sol', signo: signoSolar },
    { planeta: 'Luna', signo: signoLuna },
    { planeta: 'Mercurio', signo: signoBGMercurio },
    { planeta: 'Venus', signo: signoVenus },
    { planeta: 'Marte', signo: signoMarte },
  ]

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const generarLectura = async () => {
    setCargando(true)
    setGenerado(true)
    setVistaActiva('lectura')

    const descripcionPlanetas = planetas.map(p =>
      `${p.planeta} en ${p.signo}: ${PLANETAS_INFO[p.planeta]?.enSigno(p.signo)}`
    ).join('\n')

    const prompt = `Eres una astróloga experta en astrología natal occidental con años de práctica.

NOTA IMPORTANTE: Los cálculos de planetas para esta app son aproximados — los planetas lentos (Júpiter, Saturno, Neptuno, Plutón) son posiciones generacionales. Presenta esto honestamente.

Nombre: ${nombre}
Fecha de nacimiento: ${fechaNacimiento}

Posiciones planetarias (calculadas):
${descripcionPlanetas}

Escribe una interpretación de carta natal de 4-5 párrafos para ${nombre}.
Primero presenta el trío fundamental: Sol (identidad), Luna (emociones) y Ascendente (apariencia).
Luego explora Mercurio (mente), Venus (amor) y Marte (acción) como el perfil de funcionamiento diario.
Después describe los aspectos entre planetas que más definen la personalidad.
Termina con el propósito de vida que emerge de la combinación de todos estos elementos.
Menciona que para un análisis preciso se necesita hora exacta de nacimiento.
Sé específico, poético y profundo.`

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
      setInterpretacion('Las estrellas guardan silencio. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => window.location.href = '/universo'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Carta Natal</p>
            <p className="text-purple-300 text-xs">{nombre} · {fechaNacimiento}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/10 rounded-2xl p-1">
          {[
            { id: 'planetas', label: 'Planetas' },
            { id: 'casas', label: 'Casas' },
            { id: 'lectura', label: 'Lectura IA' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setVistaActiva(tab.id as any)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${vistaActiva === tab.id ? 'bg-purple-600 text-white' : 'text-white/50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {vistaActiva === 'planetas' && (
          <div className="flex flex-col gap-4">

            <div className="bg-amber-500/15 border border-amber-500/30 rounded-2xl p-3 backdrop-blur">
              <p className="text-amber-400 text-xs">⚠️ Los planetas lentos (Júpiter+) son posiciones generacionales aproximadas. Para máxima precisión, usa astro.com con tu hora de nacimiento.</p>
            </div>

            {planetas.map(({ planeta, signo }) => (
              <div key={planeta} className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{PLANETAS_INFO[planeta]?.simbolo}</span>
                  <div>
                    <p className="text-white font-bold">{planeta} en {signo}</p>
                    <p className="text-white/40 text-xs">{PLANETAS_INFO[planeta]?.rige}</p>
                  </div>
                </div>
                <p className="text-white/70 text-xs leading-relaxed">
                  {PLANETAS_INFO[planeta]?.enSigno(signo)}
                </p>
              </div>
            ))}

            <button
              onClick={generarLectura}
              disabled={cargando}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >
              Generar mi lectura natal completa
            </button>
          </div>
        )}

        {vistaActiva === 'casas' && (
          <div className="flex flex-col gap-3">
            <div className="bg-white/8 border border-white/20 rounded-2xl p-3 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-white/50 text-xs">Las 12 casas astrológicas dividen el cielo en áreas de vida. Para saber qué planetas tienes en cada casa necesitas la hora exacta de nacimiento.</p>
            </div>

            {CASAS_ASTROLOGICAS.map(casa => (
              <div key={casa.numero} className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">{casa.nombre}</p>
                    <p className="text-purple-300 text-xs mt-0.5">{casa.area}</p>
                  </div>
                  <p className="text-white/30 text-xs">{casa.rige}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {vistaActiva === 'lectura' && (
          <div className="flex flex-col gap-5">

            {!generado ? (
              <div className="flex flex-col gap-4 items-center text-center">
                <p className="text-7xl">🌌</p>
                <p className="text-white/60 text-sm leading-relaxed">
                  Genera tu lectura natal personalizada con IA. Combina tus posiciones planetarias en una interpretación profunda y coherente.
                </p>
                <button
                  onClick={generarLectura}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full"
                >
                  Generar mi carta natal
                </button>
              </div>
            ) : (
              <div className="bg-white/8 border border-white/20 rounded-3xl p-6 backdrop-blur"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu carta natal</p>
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
            )}

            {!cargando && interpretacion && (
              <Compartir
                titulo={`Mi Carta Natal · ${signoSolar}`}
                texto={interpretacion}
                hashtags={['CartaNatal', 'Universe', signoSolar, 'Astrologia']}
              />
            )}

            {generado && !cargando && (
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full">
                Explorar con mi Guía IA
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  )
}