// src/pages/RuedaVida.tsx
import { useState } from 'react'
import Compartir from '../components/Compartir'
import Paywall from '../components/Paywall'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import { llamarGemini, useUserPlan, useAnalytics, registrarEvento } from '../lib/paginaHelper'

// Limpia markdown básico que devuelve Gemini
function limpiarMarkdown(texto: string): string {
  return texto
    .replace(/\*\*(.+?)\*\*/g, '$1')   // **negrita** → texto
    .replace(/\*(.+?)\*/g, '$1')        // *cursiva* → texto
    .replace(/#{1,6}\s/g, '')           // ## títulos → sin #
    .replace(/^[-•]\s/gm, '• ')         // listas → bullet limpio
    .trim()
}

const AREAS_VIDA = [
  { id: 'salud', icono: '🌿', label: 'Salud y energía' },
  { id: 'amor', icono: '❤️', label: 'Amor y pareja' },
  { id: 'familia', icono: '👨‍👩‍👧', label: 'Familia' },
  { id: 'trabajo', icono: '💼', label: 'Trabajo y carrera' },
  { id: 'dinero', icono: '💰', label: 'Dinero y abundancia' },
  { id: 'proposito', icono: '✨', label: 'Propósito de vida' },
  { id: 'social', icono: '👥', label: 'Relaciones sociales' },
  { id: 'ocio', icono: '🎯', label: 'Ocio y disfrute' },
  { id: 'espiritualidad', icono: '🔮', label: 'Espiritualidad' },
]

export default function RuedaVida() {
  const [areaSeleccionada, setAreaSeleccionada] = useState<typeof AREAS_VIDA[0] | null>(null)
  const [situacion, setSituacion] = useState('')
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [fase, setFase] = useState<'elegir' | 'describir' | 'resultado'>('elegir')
  const [errorMsg, setErrorMsg] = useState('')

  const nombre = localStorage.getItem('nombre') || 'viajero'
  const signo = localStorage.getItem('signo') || 'Leo'
  const elemento = localStorage.getItem('elemento') || 'Fuego'

  const { esPremium, userId, cargando: cargandoPlan } = useUserPlan()
  useAnalytics('rueda-vida')

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover' as const,
    backgroundPosition: 'center' as const,
  }

  if (!cargandoPlan && !esPremium) {
    return <Paywall motivo="herramienta" herramienta="Rueda de la Vida" />
  }

  const consultar = async () => {
    if (!areaSeleccionada) return
    const t0 = Date.now()
    setFase('resultado')
    setCargando(true)
    setErrorMsg('')
    registrarEvento({ herramienta: 'rueda-vida', accion: 'consulta_iniciada', user_id: userId })

    const result = await llamarGemini({
      herramienta: 'rueda-vida',
      prompt: `Eres un coach espiritual y de desarrollo personal con enfoque en la Rueda de la Vida, una herramienta de autoconocimiento que evalúa el equilibrio entre las distintas áreas vitales.

Nombre del usuario: ${nombre}
Signo solar: ${signo} · Elemento: ${elemento}
Área de vida a explorar: ${areaSeleccionada.label}
${situacion.trim() ? `Situación actual que describe: "${situacion}"` : ''}

Escribe un análisis profundo y personalizado de 3-4 párrafos sobre esta área de su vida:
1. Cómo la energía de ${signo} (${elemento}) influye en su relación con ${areaSeleccionada.label}
2. Qué patrones o bloqueos suelen aparecer en esta área para su signo
3. Qué acciones concretas y rituales pueden ayudarle a mejorar el equilibrio en esta área
4. Termina con una pregunta de reflexión profunda

Tono: cálido, directo, empoderador. Habla en segunda persona (tú). Sin predicciones. Sin asteriscos ni formato markdown. Solo texto limpio en párrafos. Completa siempre los 4 párrafos, nunca dejes una frase a medias.`,
      userId,
      usarLite: false,
      cacheable: false,
      maxTokens: 800,
    })

    if (result.error) {
      setErrorMsg(result.error)
    } else {
      setInterpretacion(limpiarMarkdown(result.texto))
      registrarEvento({ herramienta: 'rueda-vida', accion: 'lectura_ia', tiempo_respuesta_ms: Date.now() - t0, user_id: userId })
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/90" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-5 py-10 gap-5">

        {/* Header */}
        <div className="flex items-center">
          <button onClick={() => {
            if (fase === 'resultado') setFase('describir')
            else if (fase === 'describir') setFase('elegir')
            else window.location.href = '/tradiciones'
          }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Rueda de la Vida</p>
            <p className="text-purple-300 text-xs">Balance vital</p>
          </div>
          <span className="text-amber-300 text-xs border border-amber-400/30 rounded-full px-2 py-0.5">✨ Premium</span>
        </div>

        {/* FASE 1 — Elegir área */}
        {fase === 'elegir' && (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <p className="text-white font-bold text-lg">¿Qué área de tu vida quieres explorar?</p>
              <p className="text-white/50 text-sm mt-1">Elige el área donde sientes más desequilibrio o donde quieres crecer.</p>
            </div>

            <div className="flex flex-col gap-2">
              {AREAS_VIDA.map(area => (
                <button
                  key={area.id}
                  onClick={() => { setAreaSeleccionada(area); setFase('describir') }}
                  className="w-full bg-black/50 border border-white/20 rounded-2xl p-4 text-left flex items-center gap-3 hover:bg-white/10 hover:border-purple-400/50 transition"
                >
                  <span className="text-2xl flex-shrink-0">{area.icono}</span>
                  <p className="text-white font-medium">{area.label}</p>
                  <span className="ml-auto text-white/30">›</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FASE 2 — Describir situación */}
        {fase === 'describir' && areaSeleccionada && (
          <div className="flex flex-col gap-5">
            <div className="bg-black/60 border border-purple-400/30 rounded-2xl p-4 flex items-center gap-3">
              <span className="text-3xl">{areaSeleccionada.icono}</span>
              <div>
                <p className="text-white font-bold">{areaSeleccionada.label}</p>
                <p className="text-white/50 text-xs">Área seleccionada</p>
              </div>
            </div>

            <div className="bg-black/60 border border-white/20 rounded-2xl p-4">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu situación actual (opcional)</p>
              <textarea
                value={situacion}
                onChange={e => setSituacion(e.target.value)}
                placeholder={`Describe brevemente cómo está tu ${areaSeleccionada.label.toLowerCase()} ahora mismo... (opcional)`}
                rows={4}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30 leading-relaxed"
              />
            </div>

            <DisclaimerIA />

            <button
              onClick={consultar}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-full hover:opacity-90 transition"
            >
              Explorar esta área
            </button>
          </div>
        )}

        {/* FASE 3 — Resultado */}
        {fase === 'resultado' && areaSeleccionada && (
          <div className="flex flex-col gap-5">
            <div className="bg-black/60 border border-purple-400/30 rounded-2xl p-3 flex items-center gap-3">
              <span className="text-2xl">{areaSeleccionada.icono}</span>
              <p className="text-white font-semibold text-sm">{areaSeleccionada.label}</p>
            </div>

            <div className="bg-black/70 border border-white/20 rounded-3xl p-5">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-4 font-semibold">Tu análisis</p>
              {cargando ? (
                <div className="flex gap-2 py-4 justify-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : errorMsg ? (
                <p className="text-red-400 text-sm">{errorMsg}</p>
              ) : (
                <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{interpretacion}</p>
              )}
            </div>

            {!cargando && interpretacion && (
              <>
                <DisclaimerIA />
                <Valoracion herramienta="rueda-vida" userId={userId} />
                <Compartir
                  titulo={`Rueda de la Vida: ${areaSeleccionada.label}`}
                  texto={interpretacion}
                  hashtags={['Universe', 'RuedaVida', 'DesarrolloPersonal']}
                />
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => window.location.href = '/guia'}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full"
                  >
                    Explorar con mi Guía IA
                  </button>
                  <button
                    onClick={() => { setFase('elegir'); setInterpretacion(''); setErrorMsg(''); setSituacion('') }}
                    className="w-full text-purple-300/70 text-sm py-2"
                  >
                    Explorar otra área
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
