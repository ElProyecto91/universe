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

const HERRAMIENTA = 'numerologia'

const COLOR_NUMERO: Record<number, string> = {
  1: 'text-red-400',
  2: 'text-blue-300',
  3: 'text-yellow-400',
  4: 'text-green-400',
  5: 'text-orange-400',
  6: 'text-pink-400',
  7: 'text-violet-400',
  8: 'text-amber-400',
  9: 'text-teal-400',
  11: 'text-indigo-300',
  22: 'text-purple-300',
  33: 'text-rose-300',
}

const SIGNIFICADO_NUMERO: Record<number, string> = {
  1:  'Liderazgo · Independencia · Pionero',
  2:  'Cooperación · Intuición · Diplomacia',
  3:  'Creatividad · Expresión · Alegría',
  4:  'Estabilidad · Trabajo · Estructura',
  5:  'Libertad · Cambio · Aventura',
  6:  'Amor · Armonía · Responsabilidad',
  7:  'Sabiduría · Misterio · Espiritualidad',
  8:  'Abundancia · Poder · Materialización',
  9:  'Compasión · Sabiduría · Finalización',
  11: 'Número Maestro · Iluminación · Intuición elevada',
  22: 'Número Maestro · Constructor · Visión universal',
  33: 'Número Maestro · Maestro Espiritual · Servicio',
}

function reducirNumerologia(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((acc, d) => acc + parseInt(d), 0)
  }
  return n
}

function calcularNumeroVida(fechaNacimiento: string): number {
  const digitos = fechaNacimiento.replace(/-/g, '').split('').reduce((acc, d) => acc + parseInt(d), 0)
  return reducirNumerologia(digitos)
}

function calcularNumeroDia(fecha: Date): number {
  const dd   = fecha.getDate()
  const mm   = fecha.getMonth() + 1
  const aaaa = fecha.getFullYear()
  const suma = String(dd).split('').reduce((a, d) => a + parseInt(d), 0)
             + String(mm).split('').reduce((a, d) => a + parseInt(d), 0)
             + String(aaaa).split('').reduce((a, d) => a + parseInt(d), 0)
  return reducirNumerologia(suma)
}

export default function Numerologia() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [pregunta,       setPregunta]       = useState('')
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando,       setCargando]       = useState(false)
  const [fase,           setFase]           = useState<'preguntar' | 'resultado'>('preguntar')
  const [errorMsg,       setErrorMsg]       = useState('')
  const [yaValorado,     setYaValorado]     = useState(false)
  const lecturaGuardadaRef                  = useRef(false)

  const nombre          = localStorage.getItem('nombre') || 'viajero'
  const signo           = localStorage.getItem('signo')  || 'Leo'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const fechaHoy        = new Date().toISOString().split('T')[0]
  const hoy             = new Date()

  const numeroVida = calcularNumeroVida(fechaNacimiento)
  const numeroDia  = calcularNumeroDia(hoy)

  useEffect(() => {
    if (!userPlan.cargando) analytics.registrarApertura()
  }, [userPlan.cargando])

  if (!userPlan.cargando && !userPlan.esPremium) {
    analytics.registrarPaywall(); navigate('/premium'); return null
  }

  const consultar = async () => {
    if (!pregunta.trim()) return
    setFase('resultado'); setCargando(true); setErrorMsg('')
    const t0 = Date.now()

    try {
      const prompt = [
        'Eres una experta en numerología pitagórica.',
        'Responde SOLO con texto en español, en prosa continua. Sin asteriscos, sin guiones, sin cursivas, sin negritas, sin numeración, sin markdown.',
        'No empieces nunca con saludos ni con el nombre del usuario.',
        'Cada párrafo tiene máximo 3 frases cortas. Es obligatorio completar los 3 párrafos.',
        '',
        `El usuario se llama ${nombre}, su signo es ${signo}.`,
        `Fecha de nacimiento: ${fechaNacimiento}.`,
        `Número de Vida: ${numeroVida} — ${SIGNIFICADO_NUMERO[numeroVida] ?? ''}.`,
        `Número Universal del Día hoy: ${numeroDia}.`,
        `Aspecto que quiere explorar: "${pregunta}"`,
        '',
        'Escribe exactamente 3 párrafos separados por línea en blanco.',
        `Párrafo 1: la energía esencial del Número de Vida ${numeroVida} y lo que revela sobre la identidad de ${nombre}.`,
        `Párrafo 2: cómo se relaciona el Número de Vida ${numeroVida} con el aspecto que quiere explorar.`,
        'Párrafo 3: un consejo o acción concreta basada en la energía numerológica para este momento.',
        '',
        'Tono sabio, cálido y evocador. Termina en punto.',
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
            titulo: `Numerología · Número ${numeroVida} · ${fechaHoy}`,
            contenido: `Número de Vida: ${numeroVida}\nConsulta: "${pregunta}"\n\n${result.texto}`,
            metadatos: { pregunta, fecha: fechaHoy, nombre, signo, numeroVida },
          })
        }
      } else {
        setErrorMsg(result.error || 'Los números guardan silencio. Inténtalo de nuevo.')
      }
    } catch (err) {
      console.error('[Numerologia]', err)
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

  const resetear = () => {
    setFase('preguntar')
    setInterpretacion('')
    setErrorMsg('')
    lecturaGuardadaRef.current = false
  }

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <button
            onClick={() => fase === 'resultado' ? resetear() : navigate('/tradiciones')}
            className="text-purple-300 text-sm"
          >← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Numerología</p>
            <p className="text-purple-300 text-xs">Tu número de vida</p>
          </div>
          <span className="text-purple-400 text-xs border border-purple-400/30 rounded-full px-2 py-0.5">✨ Premium</span>
        </div>

        {/* Card números — siempre visible */}
        <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5 text-center">
          <div className="flex justify-center gap-8">
            <div>
              <p className={`text-5xl font-bold ${COLOR_NUMERO[numeroVida] ?? 'text-white'}`}>{numeroVida}</p>
              <p className="text-white/40 text-xs mt-1">Número de Vida</p>
            </div>
            <div className="border-l border-white/10" />
            <div>
              <p className={`text-5xl font-bold ${COLOR_NUMERO[numeroDia] ?? 'text-white'}`}>{numeroDia}</p>
              <p className="text-white/40 text-xs mt-1">Día Universal</p>
            </div>
          </div>
          <p className={`text-xs mt-3 ${COLOR_NUMERO[numeroVida] ?? 'text-white/50'}`}>
            {SIGNIFICADO_NUMERO[numeroVida] ?? ''}
          </p>
        </div>

        {fase === 'preguntar' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">¿Qué quieres explorar?</p>
              <textarea
                value={pregunta}
                onChange={e => setPregunta(e.target.value)}
                placeholder="Amor, trabajo, propósito, un momento vital..."
                rows={4}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30"
              />
            </div>
            <DisclaimerIA compact />
            <button
              onClick={consultar}
              disabled={!pregunta.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >Consultar</button>
          </div>
        )}

        {fase === 'resultado' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-white/15 rounded-2xl px-4 py-3">
              <p className="text-white/50 text-xs italic">"{pregunta}"</p>
            </div>
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-4">Lectura numerológica</p>
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
            {!cargando && interpretacion && (
              <>
                <DisclaimerIA />
                <Valoracion onValorar={handleValorar} />
                <Compartir
                  titulo={`Numerología: Número de Vida ${numeroVida}`}
                  texto={interpretacion}
                  hashtags={['Universe', 'Numerologia']}
                />
                <button onClick={() => navigate('/guia')} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">Explorar con mi Guía IA</button>
                <button onClick={resetear} className="w-full text-purple-300/60 text-sm py-2">Nueva consulta</button>
              </>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}