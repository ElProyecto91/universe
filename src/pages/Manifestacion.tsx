import { useState } from 'react'
import { METODOS_MANIFESTACION, getPromptDelDia } from '../lib/motores/manifestacion'
import { getFaseLunar } from '../lib/motores/luna'
import { calcularAnoPersonal } from '../lib/motores/anoPersonal'
import Compartir from '../components/Compartir'

export default function Manifestacion() {
  const [entrada, setEntrada] = useState('')
  const [reflexion, setReflexion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'diario' | 'metodos' | 'resultado'>('diario')
  const [metodoClave, setMetodoClave] = useState<string | null>(null)
  const [tipoPrompt, setTipoPrompt] = useState<'gratitud' | 'intencion' | 'reflexion'>('gratitud')

  const nombre = localStorage.getItem('nombre') || 'viajero'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const faseLunar = getFaseLunar()
  const anoPersonal = calcularAnoPersonal(fechaNacimiento)
  const prompt = getPromptDelDia(tipoPrompt)
  const hoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const explorar = async () => {
    if (!entrada.trim()) return
    setCargando(true)
    setFase('resultado')

    const promtText = `Eres un guía de manifestación y crecimiento personal que combina psicología positiva, espiritualidad y sabiduría práctica.

Nombre: ${nombre}
Fase lunar actual: ${faseLunar.nombre} ${faseLunar.simbolo}
Año Personal: ${anoPersonal}
Tipo de reflexión: ${tipoPrompt}
Pregunta: "${prompt}"
Respuesta de ${nombre}: "${entrada}"

Escribe una reflexión de manifestación de 3 párrafos para ${nombre}.
Primero refleja lo que has escuchado — muestra comprensión profunda.
Luego conecta con la energía de la fase lunar y el año personal — cómo apoyan o desafían esta intención.
Termina con una acción concreta y específica que ${nombre} puede hacer HOY para avanzar hacia su manifestación.
Sé cálido, práctico y esperanzador. No uses términos de "ley de atracción" — habla de intención, acción y alineación.`

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: promtText }] }],
          }),
        }
      )
      const data = await res.json()
      setReflexion(data.candidates?.[0]?.content?.parts?.[0]?.text || '')
    } catch {
      setReflexion('El universo guarda silencio. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => {
            if (fase === 'resultado') setFase('diario')
            else window.location.href = '/universo'
          }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Manifestación</p>
            <p className="text-purple-300 text-xs capitalize">{hoy}</p>
          </div>
          <button
            onClick={() => setFase(fase === 'metodos' ? 'diario' : 'metodos')}
            className="text-purple-300 text-xs border border-purple-500/30 rounded-full px-3 py-1"
          >
            Métodos
          </button>
        </div>

        {/* Contexto cósmico */}
        <div className="flex gap-3">
          <div className="flex-1 bg-white/8 border border-white/20 rounded-2xl p-3 backdrop-blur text-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
            <p className="text-2xl">{faseLunar.simbolo}</p>
            <p className="text-white/60 text-xs">{faseLunar.nombre}</p>
          </div>
          <div className="flex-1 bg-white/8 border border-white/20 rounded-2xl p-3 backdrop-blur text-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
            <p className="text-2xl font-bold text-purple-300">{anoPersonal}</p>
            <p className="text-white/60 text-xs">Año Personal</p>
          </div>
        </div>

        {fase === 'metodos' && (
          <div className="flex flex-col gap-4">
            <p className="text-purple-300 text-xs tracking-widest uppercase">Métodos de manifestación</p>
            {METODOS_MANIFESTACION.map(m => (
              <div key={m.id} className="bg-white/8 border border-white/20 rounded-3xl p-5 backdrop-blur"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <p className="text-white font-bold mb-1">{m.nombre}</p>
                <p className="text-white/60 text-xs mb-3">{m.descripcion}</p>
                <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Cómo hacerlo</p>
                {m.instrucciones.map((inst, i) => (
                  <p key={i} className="text-white/70 text-xs mb-1">{i + 1}. {inst}</p>
                ))}
                <p className="text-white/30 text-xs mt-3 italic">Origen: {m.origen}</p>
              </div>
            ))}
          </div>
        )}

        {fase === 'diario' && (
          <>
            {/* Tipo de reflexión */}
            <div className="flex gap-2">
              {(['gratitud', 'intencion', 'reflexion'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTipoPrompt(t)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition border ${tipoPrompt === t ? 'bg-purple-600 border-purple-400 text-white' : 'border-white/20 text-white/50'}`}
                  style={{ backgroundColor: tipoPrompt === t ? undefined : 'rgba(255,255,255,0.08)' }}
                >
                  {t === 'gratitud' ? '🙏 Gratitud' : t === 'intencion' ? '✨ Intención' : '🔍 Reflexión'}
                </button>
              ))}
            </div>

            {/* Prompt del día */}
            <div className="bg-purple-600/20 border border-purple-400/30 rounded-3xl p-5 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Pregunta del día</p>
              <p className="text-white text-base leading-relaxed font-medium">{prompt}</p>
            </div>

            {/* Área de escritura */}
            <div className="bg-white/8 border border-white/20 rounded-3xl p-5 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-white/60 text-xs tracking-widest uppercase mb-3">Tu respuesta</p>
              <textarea
                value={entrada}
                onChange={e => setEntrada(e.target.value)}
                placeholder="Escribe libremente, sin filtros ni correcciones..."
                rows={6}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30 leading-relaxed"
              />
            </div>

            <button
              onClick={explorar}
              disabled={!entrada.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >
              Obtener reflexión con IA
            </button>
          </>
        )}

        {fase === 'resultado' && (
          <div className="flex flex-col gap-5">

            <div className="bg-purple-600/20 border border-purple-400/30 rounded-2xl p-4 backdrop-blur">
              <p className="text-purple-300 text-xs">Pregunta: <span className="text-white/70 italic">"{prompt}"</span></p>
            </div>

            <div className="bg-white/8 border border-white/20 rounded-3xl p-6 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu reflexión</p>
              {cargando ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : (
                <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{reflexion}</p>
              )}
            </div>

            {!cargando && reflexion && (
              <Compartir
                titulo="Mi reflexión de manifestación"
                texto={reflexion}
                hashtags={['Manifestacion', 'Universe', 'Intencion', 'Crecimiento']}
              />
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                Explorar con mi Guía IA
              </button>
              <button onClick={() => { setFase('diario'); setEntrada(''); setReflexion('') }} className="w-full text-purple-300/60 text-sm py-2">
                Nueva reflexión
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}