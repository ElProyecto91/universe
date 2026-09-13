import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserPlan, incrementarConsulta } from '../hooks/useUserPlan'
import { useAnalytics } from '../hooks/useAnalytics'
import { guardarLectura } from '../hooks/useHistorial'
import { llamarGemini } from '../lib/gemini'
import Compartir from '../components/Compartir'
import CtaUpsell from '../components/CtaUpsell'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import PageLayout from '../components/PageLayout'
import TextoIA from '../components/TextoIA'
import { supabase } from '../lib/supabase'

const HERRAMIENTA = 'numerologia-universal'

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

function reducirNumerologia(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((acc, d) => acc + parseInt(d), 0)
  }
  return n
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

function calcularAnoPersonal(fechaNacimiento: string, añoActual: number): number {
  const [, mm, dd] = fechaNacimiento.split('-')
  const suma = String(parseInt(dd)).split('').reduce((a, d) => a + parseInt(d), 0)
             + String(parseInt(mm)).split('').reduce((a, d) => a + parseInt(d), 0)
             + String(añoActual).split('').reduce((a, d) => a + parseInt(d), 0)
  return reducirNumerologia(suma)
}

export default function NumerologiaUniversal() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [interpretacion, setInterpretacion] = useState('')
  const [cargando,       setCargando]       = useState(false)
  const [generado,       setGenerado]       = useState(false)
  const [fromCache,      setFromCache]      = useState(false)
  const [errorMsg,       setErrorMsg]       = useState('')
  const [yaValorado,     setYaValorado]     = useState(false)
  const lecturaGuardadaRef                  = useRef(false)

  const nombre          = localStorage.getItem('nombre') || 'viajero'
  const signo           = (localStorage.getItem('signo') || 'Leo').toLowerCase()
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const hoy             = new Date()
  const fechaHoy        = hoy.toISOString().split('T')[0]
  const añoActual       = hoy.getFullYear()

  const numeroDia   = calcularNumeroDia(hoy)
  const anoPersonal = calcularAnoPersonal(fechaNacimiento, añoActual)

  useEffect(() => {
    if (!userPlan.cargando) analytics.registrarApertura()
  }, [userPlan.cargando])

  const generarLectura = async () => {
    setCargando(true); setGenerado(true); setErrorMsg('')
    const t0 = Date.now()

    try {
      const { data: cached } = await supabase.from('horoscopo_cache')
        .select('contenido')
        .eq('fecha', fechaHoy)
        .eq('tipo', HERRAMIENTA)
        .maybeSingle()

      if (cached?.contenido) {
        setInterpretacion(cached.contenido)
        setFromCache(true)
        analytics.registrarLectura({ desdCache: true, tiempoMs: Date.now() - t0, modeloIa: 'cache' })
        setCargando(false)
        return
      }

      const prompt = [
        'Eres una experta en numerología universal y personal.',
        'Responde SOLO con texto en español, en prosa continua. Sin asteriscos, sin guiones, sin cursivas, sin negritas, sin numeración, sin markdown.',
        'No empieces nunca con el nombre del usuario ni con saludos.',
        'Cada párrafo tiene máximo 3 frases cortas. Es obligatorio completar los 3 párrafos.',
        '',
        `Hoy es ${fechaHoy}. El Número Universal del Día es ${numeroDia}.`,
        `El Año Personal del usuario este año (${añoActual}) es ${anoPersonal}.`,
        '',
        'Escribe exactamente 3 párrafos separados por línea en blanco.',
        `Párrafo 1: la energía y significado del Número Universal del Día ${numeroDia} hoy.`,
        `Párrafo 2: cómo interactúa el Número Universal ${numeroDia} con el Año Personal ${anoPersonal}.`,
        'Párrafo 3: una afirmación en primera persona para aprovechar esta energía numerológica hoy.',
        '',
        'Tono cálido y evocador. Termina en punto.',
      ].join('\n')

      const result = await llamarGemini({
        herramienta: HERRAMIENTA, prompt,
        userId: userPlan.userId, usarLite: true,
        cacheable: false, maxTokens: 400,
      })

      if (!result.error && result.texto) {
        setInterpretacion(result.texto)
        setFromCache(false)
        if (userPlan.userId) await incrementarConsulta(userPlan.userId)
        analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: result.modelo })
        supabase.from('horoscopo_cache').insert({
          fecha: fechaHoy, tipo: HERRAMIENTA,
          contenido: result.texto, tokens_used: result.tokensUsados,
        }).then(() => {})
        if (!lecturaGuardadaRef.current) {
          lecturaGuardadaRef.current = true
          await guardarLectura({
            herramienta: HERRAMIENTA,
            titulo: `Numerología del Día · ${fechaHoy}`,
            contenido: result.texto,
            metadatos: { fecha: fechaHoy, nombre, numeroDia, anoPersonal },
          })
        }
      } else {
        setErrorMsg(result.error || 'El universo guarda silencio. Inténtalo de nuevo.')
      }
    } catch (err) {
      console.error('[NumerologiaUniversal]', err)
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
            <p className="text-white font-semibold text-sm">Numerología del Día</p>
            <p className="text-purple-300 text-xs">Energía universal de hoy</p>
          </div>
        </div>

        <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5 text-center">
          <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">Números de hoy</p>
          <div className="flex justify-center gap-8">
            <div>
              <p className={`text-3xl font-bold ${COLOR_NUMERO[numeroDia] ?? 'text-white'}`}>{numeroDia}</p>
              <p className="text-white/40 text-xs mt-1">Día Universal</p>
            </div>
            <div className="border-l border-white/10" />
            <div>
              <p className={`text-3xl font-bold ${COLOR_NUMERO[anoPersonal] ?? 'text-white'}`}>{anoPersonal}</p>
              <p className="text-white/40 text-xs mt-1">Año Personal</p>
            </div>
          </div>
          <p className="text-white/40 text-xs mt-3">
            {signo.charAt(0).toUpperCase() + signo.slice(1)} · {hoy.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        {!generado ? (
          <div className="flex flex-col gap-3">
            <DisclaimerIA compact />
            <button onClick={generarLectura} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">Generar mi lectura</button>
          </div>
        ) : (
          <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-purple-400 text-xs tracking-widest uppercase">Tu lectura</p>
              {fromCache && <span className="text-green-400 text-xs">⚡ Instantáneo</span>}
            </div>
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
            <Compartir titulo="Numerología del Día" texto={interpretacion} hashtags={['Universe', 'NumerologiaUniversal']} />
            <CtaUpsell consultasRestantes={userPlan.consultasRestantes} />
            <button onClick={() => navigate('/guia')} className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full">Explorar con mi Guía IA</button>
          </>
        )}
      </div>
    </PageLayout>
  )
}