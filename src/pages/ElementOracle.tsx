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

const HERRAMIENTA = 'element-oracle'

const ELEMENTOS: Record<number, { nombre: string; imagen: string; descripcion: string }> = {
  0: { nombre: 'Fuego',  imagen: '/elementos/fuego.jpeg',  descripcion: 'Pasión · Transformación · Energía' },
  1: { nombre: 'Madera', imagen: '/elementos/madera.jpeg', descripcion: 'Crecimiento · Flexibilidad · Vida' },
  2: { nombre: 'Fuego',  imagen: '/elementos/fuego.jpeg',  descripcion: 'Pasión · Transformación · Energía' },
  3: { nombre: 'Tierra', imagen: '/elementos/tierra.jpeg', descripcion: 'Estabilidad · Nutrición · Raíces' },
  4: { nombre: 'Metal',  imagen: '/elementos/metal.jpeg',  descripcion: 'Claridad · Precisión · Fortaleza' },
  5: { nombre: 'Agua',   imagen: '/elementos/agua.jpeg',   descripcion: 'Fluidez · Intuición · Profundidad' },
  6: { nombre: 'Madera', imagen: '/elementos/madera.jpeg', descripcion: 'Crecimiento · Flexibilidad · Vida' },
}

const ELEMENTO_SIGNO: Record<string, string> = {
  aries: 'Fuego', tauro: 'Tierra', geminis: 'Metal', cancer: 'Agua',
  leo: 'Fuego', virgo: 'Tierra', libra: 'Metal', escorpio: 'Agua',
  sagitario: 'Madera', capricornio: 'Tierra', acuario: 'Metal', piscis: 'Agua',
}

export default function ElementOracle() {
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

  const nombre    = localStorage.getItem('nombre') || 'viajero'
  const signo     = (localStorage.getItem('signo') || 'Leo').toLowerCase()
  const fechaHoy  = new Date().toISOString().split('T')[0]
  const diaSemana = new Date().getDay()

  const elementoDia   = ELEMENTOS[diaSemana]
  const elementoSigno = ELEMENTO_SIGNO[signo] ?? 'Fuego'

  useEffect(() => {
    if (!userPlan.cargando) analytics.registrarApertura()
  }, [userPlan.cargando])

  const generarLectura = async () => {
    setCargando(true); setGenerado(true); setErrorMsg('')
    const t0 = Date.now()

    try {
      const { data: cached } = await supabase.from('horoscopo_cache')
        .select('contenido')
        .eq('signo', signo)
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
        'Eres un experto en los cinco elementos de la tradición china — Fuego, Agua, Tierra, Madera y Metal.',
        'Responde SOLO con texto en español, en prosa continua. Sin asteriscos, sin guiones, sin cursivas, sin negritas, sin numeración, sin markdown.',
        'No empieces nunca el texto con el nombre del usuario ni con saludos.',
        'Cada párrafo tiene máximo 3 frases cortas. Es obligatorio completar los 3 párrafos.',
        '',
        `El usuario se llama ${nombre}, su signo es ${signo} (elemento natal: ${elementoSigno}).`,
        `Hoy el elemento dominante del día es: ${elementoDia.nombre}.`,
        '',
        'Escribe exactamente 3 párrafos separados por línea en blanco.',
        `Párrafo 1: la energía y cualidades del elemento ${elementoDia.nombre} según la tradición china hoy.`,
        `Párrafo 2: cómo interactúa el elemento ${elementoDia.nombre} de hoy con el elemento natal ${elementoSigno} de ${nombre}.`,
        'Párrafo 3: una práctica concreta y sencilla para trabajar con esta energía elemental durante el día.',
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
          signo, fecha: fechaHoy, tipo: HERRAMIENTA,
          contenido: result.texto, tokens_used: result.tokensUsados,
        }).then(() => {})
        if (!lecturaGuardadaRef.current) {
          lecturaGuardadaRef.current = true
          await guardarLectura({
            herramienta: HERRAMIENTA,
            titulo: `Oracle Elemental · ${fechaHoy}`,
            contenido: result.texto,
            metadatos: { fecha: fechaHoy, nombre, signo, elemento: elementoDia.nombre },
          })
        }
      } else {
        setErrorMsg(result.error || 'El universo guarda silencio. Inténtalo de nuevo.')
      }
    } catch (err) {
      console.error('[ElementOracle]', err)
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
            <p className="text-white font-semibold text-sm">Oracle Elemental</p>
            <p className="text-purple-300 text-xs">Los cinco elementos</p>
          </div>
        </div>

        {/* Imagen del elemento */}
        <div className="relative rounded-3xl overflow-hidden h-48">
          <img
            src={elementoDia.imagen}
            alt={elementoDia.nombre}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-white text-3xl font-bold">{elementoDia.nombre}</p>
            <p className="text-white/70 text-xs mt-1">{elementoDia.descripcion}</p>
          </div>
        </div>

        <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-4 text-center">
          <p className="text-white/50 text-xs">
            {signo.charAt(0).toUpperCase() + signo.slice(1)} · elemento natal: <span className="text-purple-300">{elementoSigno}</span>
          </p>
          <p className="text-white/40 text-xs mt-1">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
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
            <Compartir titulo="Oracle Elemental" texto={interpretacion} hashtags={['Universe', 'ElementOracle']} />
            <CtaUpsell consultasRestantes={userPlan.consultasRestantes} />
            <button onClick={() => navigate('/guia')} className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full">Explorar con mi Guía IA</button>
          </>
        )}
      </div>
    </PageLayout>
  )
}