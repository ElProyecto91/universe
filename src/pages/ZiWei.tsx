import { useState } from 'react'
import Compartir from '../components/Compartir'

const PALACIOS = [
  { nombre: 'Palacio de la Vida', area: 'Propósito · Carácter · Destino general', icono: '⭐' },
  { nombre: 'Palacio del Hermano', area: 'Relaciones con iguales · Apoyo social', icono: '👥' },
  { nombre: 'Palacio del Esposo/Esposa', area: 'Relación romántica · Pareja de vida', icono: '❤️' },
  { nombre: 'Palacio de los Hijos', area: 'Hijos · Creatividad · Legado', icono: '🌱' },
  { nombre: 'Palacio de la Riqueza', area: 'Finanzas · Abundancia · Recursos', icono: '💰' },
  { nombre: 'Palacio de la Salud', area: 'Cuerpo · Bienestar · Energía vital', icono: '🌿' },
  { nombre: 'Palacio del Viaje', area: 'Movimiento · Cambios · Exterior', icono: '🌍' },
  { nombre: 'Palacio de los Esclavos', area: 'Subordinados · Apoyo · Servicio', icono: '🤝' },
  { nombre: 'Palacio de la Carrera', area: 'Trabajo · Reputación · Misión', icono: '💼' },
  { nombre: 'Palacio de la Propiedad', area: 'Hogar · Bienes · Estabilidad material', icono: '🏠' },
  { nombre: 'Palacio de los Padres', area: 'Ancestros · Mentores · Herencia', icono: '🌳' },
  { nombre: 'Palacio del Espíritu', area: 'Vida interior · Karma · Espiritualidad', icono: '✨' },
]

export default function ZiWei() {
  const [palacioClave, setPalacioClave] = useState<number | null>(null)
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'elegir' | 'resultado'>('elegir')
  const [pregunta, setPregunta] = useState('')
  const nombre = localStorage.getItem('nombre') || 'viajero'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const consultar = async (idx: number) => {
    setPalacioClave(idx)
    setFase('resultado')
    setCargando(true)
    const palacio = PALACIOS[idx]

    const prompt = `Eres un experto en Zi Wei Dou Shu (紫微斗數) — la Astrología de la Estrella Púrpura, uno de los sistemas astrológicos chinos más sofisticados.

Nombre: ${nombre}
Fecha de nacimiento: ${fechaNacimiento}
Palacio consultado: ${palacio.nombre}
Área de vida: ${palacio.area}
${pregunta ? `Pregunta específica: "${pregunta}"` : ''}

Escribe una lectura de Zi Wei Dou Shu del ${palacio.nombre} de 3 párrafos para ${nombre}.
Primero explica qué gobierna este palacio y cómo se manifiesta en la vida.
Luego explora las energías que probablemente están presentes en este palacio para ${nombre} — sin inventar datos astrológicos específicos que requieren el cálculo real de la carta.
Termina con orientación práctica para trabajar conscientemente con este palacio en la vida de ${nombre}.
Sé respetuoso con la profundidad del sistema Zi Wei — es uno de los más complejos de la astrología china.`

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
          <button onClick={() => {
            if (fase === 'resultado') setFase('elegir')
            else window.location.href = '/tradiciones'
          }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Zi Wei Dou Shu · 紫微斗數</p>
            <p className="text-purple-300 text-xs">Astrología de la Estrella Púrpura · China</p>
          </div>
        </div>

        {fase === 'elegir' && (
          <div className="flex flex-col gap-5">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
              <p className="text-white/60 text-sm leading-relaxed">
                Zi Wei Dou Shu divide la vida en 12 palacios, cada uno gobernando un área específica. Elige el palacio que quieres explorar hoy.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Pregunta (opcional)</p>
              <textarea
                value={pregunta}
                onChange={e => setPregunta(e.target.value)}
                placeholder="¿Qué aspecto de este palacio quieres explorar?"
                rows={2}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30"
              />
            </div>

            <div className="flex flex-col gap-2">
              {PALACIOS.map((palacio, idx) => (
                <button
                  key={idx}
                  onClick={() => consultar(idx)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-left hover:bg-white/10 transition backdrop-blur flex items-center gap-3"
                >
                  <span className="text-2xl">{palacio.icono}</span>
                  <div>
                    <p className="text-white font-semibold text-sm">{palacio.nombre}</p>
                    <p className="text-white/40 text-xs">{palacio.area}</p>
                  </div>
                  <span className="ml-auto text-purple-300/50">›</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {fase === 'resultado' && palacioClave !== null && (
          <div className="flex flex-col gap-5">

            <div className="bg-white/5 border border-purple-500/20 rounded-3xl p-5 backdrop-blur text-center">
              <span className="text-5xl block mb-2">{PALACIOS[palacioClave].icono}</span>
              <p className="text-xl font-bold">{PALACIOS[palacioClave].nombre}</p>
              <p className="text-purple-300 text-sm mt-1">{PALACIOS[palacioClave].area}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
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
                titulo={`Zi Wei Dou Shu: ${PALACIOS[palacioClave].nombre}`}
                texto={interpretacion}
                hashtags={['ZiWei', 'Universe', 'AstrologiaChina', 'EstrellasPurpura']}
              />
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                Explorar con mi Guía IA
              </button>
              <button onClick={() => { setFase('elegir'); setPalacioClave(null); setInterpretacion('') }} className="w-full text-purple-300/60 text-sm py-2">
                Explorar otro palacio
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}