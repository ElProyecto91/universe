import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserPlan, incrementarConsulta } from '../hooks/useUserPlan'
import { useAnalytics } from '../hooks/useAnalytics'
import { guardarLectura } from '../hooks/useHistorial'
import { llamarGemini } from '../lib/gemini'
import Compartir from '../components/Compartir'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import PageLayout from '../components/PageLayout'
import TextoIA from '../components/TextoIA'

const HERRAMIENTA = 'transitos'

const SIGNOS = ['Aries','Tauro','Géminis','Cáncer','Leo','Virgo','Libra','Escorpio','Sagitario','Capricornio','Acuario','Piscis']
const SIGNOS_EMOJI = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓']

// ── Algoritmo de Meeus simplificado ────────────────────────
function diasDesdeJ2000(fecha: Date): number {
  return (fecha.getTime() / 86400000) - 10957.5 + 2451545.0 - 2451545.0
}

function normalizarGrados(g: number): number {
  return ((g % 360) + 360) % 360
}

function gradosASigno(grados: number): { signo: string; emoji: string; grado: number } {
  const g = normalizarGrados(grados)
  const idx = Math.floor(g / 30)
  return { signo: SIGNOS[idx], emoji: SIGNOS_EMOJI[idx], grado: Math.floor(g % 30) }
}

function calcularSol(d: number) {
  const L = normalizarGrados(280.460 + 0.9856474 * d)
  const g = normalizarGrados(357.528 + 0.9856003 * d) * Math.PI / 180
  const lambda = L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)
  return { grados: normalizarGrados(lambda), retrogrado: false }
}

function calcularLuna(d: number) {
  const L = normalizarGrados(218.316 + 13.176396 * d)
  const M = normalizarGrados(134.963 + 13.064993 * d) * Math.PI / 180
  const F = normalizarGrados(93.272 + 13.229350 * d) * Math.PI / 180
  const lambda = L + 6.289 * Math.sin(M) - 1.274 * Math.sin(2 * F - M)
  return { grados: normalizarGrados(lambda), retrogrado: false }
}

function calcularMercurio(d: number) {
  const L = normalizarGrados(252.251 + 4.092338 * d)
  const M = normalizarGrados(174.795 + 4.092338 * d) * Math.PI / 180
  const grados = normalizarGrados(L + 23.440 * Math.sin(M) + 2.996 * Math.sin(2 * M))
  const vel = 4.092338 + 23.440 * 4.092338 * Math.PI / 180 * Math.cos(M)
  return { grados, retrogrado: vel < 0.985 }
}

function calcularVenus(d: number) {
  const L = normalizarGrados(181.979 + 1.602137 * d)
  const M = normalizarGrados(50.416 + 1.602137 * d) * Math.PI / 180
  const grados = normalizarGrados(L + 0.777 * Math.sin(M))
  const vel = 1.602137 * (1 + 0.777 * Math.PI / 180 * Math.cos(M))
  return { grados, retrogrado: vel < 0 }
}

function calcularMarte(d: number) {
  const L = normalizarGrados(355.433 + 0.524039 * d)
  const M = normalizarGrados(19.373 + 0.524039 * d) * Math.PI / 180
  const grados = normalizarGrados(L + 10.691 * Math.sin(M) + 0.623 * Math.sin(2 * M))
  return { grados, retrogrado: false }
}

function calcularJupiter(d: number) {
  const L = normalizarGrados(34.351 + 0.083056 * d)
  const M = normalizarGrados(20.020 + 0.083056 * d) * Math.PI / 180
  const grados = normalizarGrados(L + 5.555 * Math.sin(M) + 0.168 * Math.sin(2 * M))
  return { grados, retrogrado: false }
}

function calcularSaturno(d: number) {
  const L = normalizarGrados(50.077 + 0.033459 * d)
  const M = normalizarGrados(317.020 + 0.033459 * d) * Math.PI / 180
  const grados = normalizarGrados(L + 6.393 * Math.sin(M) + 0.191 * Math.sin(2 * M))
  return { grados, retrogrado: false }
}

function calcularUrano(d: number) {
  const L = normalizarGrados(314.055 + 0.011729 * d)
  const M = normalizarGrados(142.955 + 0.011729 * d) * Math.PI / 180
  const grados = normalizarGrados(L + 5.329 * Math.sin(M))
  return { grados, retrogrado: false }
}

function calcularNeptuno(d: number) {
  const L = normalizarGrados(304.349 + 0.006019 * d)
  const M = normalizarGrados(267.767 + 0.006019 * d) * Math.PI / 180
  const grados = normalizarGrados(L + 1.769 * Math.sin(M))
  return { grados, retrogrado: false }
}

function calcularPluton(d: number) {
  const L = normalizarGrados(238.929 + 0.003964 * d)
  const grados = normalizarGrados(L + 17.142 * Math.sin((L - 87.5) * Math.PI / 180))
  return { grados, retrogrado: false }
}

interface PlanetaInfo {
  nombre: string
  emoji: string
  signo: string
  signoEmoji: string
  grado: number
  retrogrado: boolean
  keywords: string
}

function calcularTransitos(fecha: Date): PlanetaInfo[] {
  const d = diasDesdeJ2000(fecha)

  const planetas = [
    { nombre: 'Sol',      emoji: '☀️', calc: calcularSol(d),      keywords: 'Identidad · Propósito · Vitalidad' },
    { nombre: 'Luna',     emoji: '🌙', calc: calcularLuna(d),      keywords: 'Emociones · Intuición · Ciclos' },
    { nombre: 'Mercurio', emoji: '☿',  calc: calcularMercurio(d),  keywords: 'Comunicación · Mente · Viajes' },
    { nombre: 'Venus',    emoji: '♀',  calc: calcularVenus(d),     keywords: 'Amor · Belleza · Valores' },
    { nombre: 'Marte',    emoji: '♂',  calc: calcularMarte(d),     keywords: 'Acción · Deseo · Energía' },
    { nombre: 'Júpiter',  emoji: '♃',  calc: calcularJupiter(d),   keywords: 'Expansión · Abundancia · Sabiduría' },
    { nombre: 'Saturno',  emoji: '♄',  calc: calcularSaturno(d),   keywords: 'Estructura · Karma · Responsabilidad' },
    { nombre: 'Urano',    emoji: '♅',  calc: calcularUrano(d),     keywords: 'Revolución · Cambio · Originalidad' },
    { nombre: 'Neptuno',  emoji: '♆',  calc: calcularNeptuno(d),   keywords: 'Espiritualidad · Ilusión · Compasión' },
    { nombre: 'Plutón',   emoji: '♇',  calc: calcularPluton(d),    keywords: 'Transformación · Poder · Renacimiento' },
  ]

  return planetas.map(p => {
    const pos = gradosASigno(p.calc.grados)
    return {
      nombre: p.nombre,
      emoji: p.emoji,
      signo: pos.signo,
      signoEmoji: pos.emoji,
      grado: pos.grado,
      retrogrado: p.calc.retrogrado,
      keywords: p.keywords,
    }
  })
}

export default function Transitos() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [interpretacion, setInterpretacion] = useState('')
  const [cargando,       setCargando]       = useState(false)
  const [generado,       setGenerado]       = useState(false)
  const [errorMsg,       setErrorMsg]       = useState('')
  const [yaValorado,     setYaValorado]     = useState(false)
  const lecturaGuardadaRef                  = useRef(false)

  const nombre   = localStorage.getItem('nombre') || 'viajero'
  const signo    = localStorage.getItem('signo')  || 'Leo'
  const fechaHoy = new Date().toISOString().split('T')[0]
  const hoy      = new Date()

  const transitos = calcularTransitos(hoy)

  useEffect(() => {
    if (!userPlan.cargando) analytics.registrarApertura()
  }, [userPlan.cargando])

  if (!userPlan.cargando && !userPlan.esPremium) {
    analytics.registrarPaywall(); navigate('/premium'); return null
  }

  const generar = async () => {
    setGenerado(true); setCargando(true); setErrorMsg('')
    const t0 = Date.now()

    const resumenTransitos = transitos
      .map(p => `${p.nombre} en ${p.signo} ${p.grado}°${p.retrogrado ? ' (R)' : ''}`)
      .join(', ')

    const retrogrados = transitos.filter(p => p.retrogrado).map(p => p.nombre).join(', ') || 'ninguno'

    try {
      const prompt = [
        'Eres una astróloga experta en tránsitos planetarios y su influencia espiritual.',
        'Responde SOLO con texto en español, en prosa continua. Sin asteriscos, sin guiones, sin cursivas, sin negritas, sin numeración, sin markdown.',
        'No empieces nunca con saludos ni con el nombre del usuario.',
        'Cada párrafo tiene máximo 3 frases cortas. Es obligatorio completar los 3 párrafos.',
        '',
        `El usuario se llama ${nombre}, su signo solar es ${signo}.`,
        `Fecha de hoy: ${fechaHoy}.`,
        `Posiciones planetarias actuales: ${resumenTransitos}.`,
        `Planetas retrógrados: ${retrogrados}.`,
        '',
        'Escribe exactamente 3 párrafos separados por línea en blanco.',
        `Párrafo 1: los tránsitos más significativos de este momento y su energía colectiva general.`,
        `Párrafo 2: cómo estos tránsitos afectan específicamente a ${signo} — oportunidades y desafíos.`,
        'Párrafo 3: un consejo práctico y espiritual para navegar esta energía planetaria hoy.',
        '',
        'Tono astrológico, evocador y práctico. Termina en punto.',
      ].join('\n')

      const result = await llamarGemini({
        herramienta: HERRAMIENTA, prompt,
        userId: userPlan.userId, usarLite: true,
        cacheable: false, maxTokens: 400,
      })

      if (!result.error && result.texto) {
        setInterpretacion(result.texto)
        if (userPlan.userId) await incrementarConsulta(userPlan.userId)
        analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: result.modelo })
        if (!lecturaGuardadaRef.current) {
          lecturaGuardadaRef.current = true
          await guardarLectura({
            herramienta: HERRAMIENTA,
            titulo: `Tránsitos · ${signo} · ${fechaHoy}`,
            contenido: `Posiciones: ${resumenTransitos}\n\n${result.texto}`,
            metadatos: { fecha: fechaHoy, nombre, signo },
          })
        }
      } else {
        setErrorMsg(result.error || 'Los planetas guardan silencio. Inténtalo de nuevo.')
      }
    } catch (err) {
      console.error('[Transitos]', err)
      setErrorMsg('Error inesperado.')
    } finally {
      setCargando(false)
    }
  }

  const handleValorar = (valor: 1 | -1) => {
    if (yaValorado) return
    setYaValorado(true)
    analytics.registrarValoracion(valor)
  }

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <button onClick={() => navigate('/tradiciones')} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Tránsitos Astrales</p>
            <p className="text-purple-300 text-xs">Ciclos planetarios actuales</p>
          </div>
          <span className="text-purple-400 text-xs border border-purple-400/30 rounded-full px-2 py-0.5">✨ Premium</span>
        </div>

        {/* Fecha */}
        <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-4 text-center">
          <p className="text-purple-400 text-xs tracking-widest uppercase mb-1">Posiciones planetarias</p>
          <p className="text-white/50 text-xs">
            {hoy.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Planetas */}
        <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5">
          <div className="flex flex-col gap-3">
            {transitos.map(p => (
              <div key={p.nombre} className="flex items-center gap-3">
                <p className="text-xl w-8 text-center">{p.emoji}</p>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-white text-sm font-semibold">{p.nombre}</p>
                    {p.retrogrado && (
                      <span className="text-red-400 text-xs border border-red-400/30 rounded-full px-1.5 py-0.5">℞</span>
                    )}
                  </div>
                  <p className="text-white/40 text-xs">{p.keywords}</p>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm">{p.signoEmoji} {p.signo}</p>
                  <p className="text-white/40 text-xs">{p.grado}°</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {!generado ? (
          <div className="flex flex-col gap-3">
            <DisclaimerIA compact />
            <button
              onClick={generar}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
            >Leer los tránsitos</button>
          </div>
        ) : (
          <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
            <p className="text-purple-400 text-xs tracking-widest uppercase mb-4">Interpretación</p>
            {cargando ? (
              <div className="flex gap-2 py-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : errorMsg
              ? <p className="text-red-300 text-sm">{errorMsg}</p>
              : <TextoIA texto={interpretacion} />
            }
          </div>
        )}

        {!cargando && interpretacion && (
          <>
            <DisclaimerIA />
            <Valoracion onValorar={handleValorar} />
            <Compartir
              titulo={`Tránsitos Astrales · ${signo}`}
              texto={interpretacion}
              hashtags={['Universe', 'Transitos', 'Astrologia']}
            />
            <button onClick={() => navigate('/guia')} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">Explorar con mi Guía IA</button>
          </>
        )}
      </div>
    </PageLayout>
  )
}