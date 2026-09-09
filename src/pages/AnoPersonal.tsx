// src/pages/AnoPersonal.tsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserPlan, incrementarConsulta } from '../hooks/useUserPlan'
import { useAnalytics } from '../hooks/useAnalytics'
import { guardarLectura } from '../hooks/useHistorial'
import { llamarGemini } from '../lib/gemini'
import { supabase } from '../lib/supabase'
import Compartir from '../components/Compartir'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import CtaUpsell from '../components/CtaUpsell'
import PageLayout from '../components/PageLayout'
import TextoIA from '../components/TextoIA'

const HERRAMIENTA = 'ano-personal'

// Calcula el Año Personal en el frontend
function calcularAnoPersonal(fechaNacimiento: string): { numero: number; descripcion: string } {
  const fecha = new Date(fechaNacimiento)
  const dia   = fecha.getDate()
  const mes   = fecha.getMonth() + 1
  const anio  = new Date().getFullYear()

  const sumar = (n: number): number => {
    while (n > 9 && n !== 11 && n !== 22) {
      n = String(n).split('').reduce((a, b) => a + parseInt(b), 0)
    }
    return n
  }

  const numero = sumar(
    sumar(dia) + sumar(mes) + sumar(anio)
  )

  const descripciones: Record<number, string> = {
    1:  'un año de nuevos comienzos, independencia y siembra de semillas',
    2:  'un año de cooperación, paciencia y relaciones personales',
    3:  'un año de creatividad, expresión y expansión social',
    4:  'un año de trabajo, disciplina y construcción de bases sólidas',
    5:  'un año de cambios, libertad y nuevas experiencias',
    6:  'un año de responsabilidad, hogar y relaciones familiares',
    7:  'un año de introspección, espiritualidad y sabiduría interior',
    8:  'un año de poder, abundancia y logros materiales',
    9:  'un año de cierre de ciclos, compasión y transformación',
    11: 'un año maestro de iluminación espiritual e intuición elevada',
    22: 'un año maestro de construcción de grandes proyectos y legado',
  }

  return { numero, descripcion: descripciones[numero] || 'un año de profunda transformación' }
}

export default function AnoPersonal() {
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

  const nombre          = localStorage.getItem('nombre')          || 'viajero'
  const signo           = localStorage.getItem('signo')           || 'Leo'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const fechaHoy        = new Date().toISOString().split('T')[0]
  const hoy             = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
  const anoPersonal     = calcularAnoPersonal(fechaNacimiento)

  useEffect(() => {
    if (!userPlan.cargando) analytics.registrarApertura()
  }, [userPlan.cargando])

  const generarLectura = async () => {
    if (userPlan.cargando) return
    if (!userPlan.puedeConsultar) { analytics.registrarPaywall(); navigate('/premium'); return }
    if (!userPlan.esPremium && userPlan.consultasRestantes <= 0) {
      analytics.registrarLimite()
      setErrorMsg(`Has alcanzado tu límite diario de ${userPlan.limiteConsultasDia} consultas gratuitas.`)
      return
    }

    setCargando(true)
    setGenerado(true)
    setErrorMsg('')
    const t0 = Date.now()

    try {
      const { data: cached } = await supabase.from('horoscopo_cache').select('contenido')
        .eq('signo', `ap${anoPersonal.numero}`).eq('fecha', String(new Date().getFullYear())).eq('tipo', HERRAMIENTA).maybeSingle()

      if (cached?.contenido) {
        setInterpretacion(cached.contenido)
        setFromCache(true)
        analytics.registrarLectura({ desdCache: true, tiempoMs: Date.now() - t0, modeloIa: 'cache' })
        await _guardarSiPrimera(cached.contenido)
        setCargando(false)
        return
      }

      // Año Personal calculado en frontend — la IA solo interpreta
      const prompt = [
        'Eres una experta en numerología. Escribe en español, en prosa, sin listas, sin asteriscos, sin markdown.',
        '',
        `El usuario se llama ${nombre} y su Año Personal numerológico ya está calculado: es el número ${anoPersonal.numero}, que representa ${anoPersonal.descripcion}.`,
        '',
        `Escribe exactamente 4 párrafos dirigiéndote a ${nombre} directamente. Sin introducción genérica, empieza directo.`,
        `Párrafo 1: qué arquetipo y energía trae el Año Personal ${anoPersonal.numero} y cómo se manifiesta en la vida de ${nombre}.`,
        `Párrafo 2: qué oportunidades específicas se abren en este ciclo numerológico.`,
        `Párrafo 3: qué desafíos o lecciones puede encontrar y cómo navegarlos.`,
        `Párrafo 4: un consejo práctico y concreto para aprovechar al máximo este Año ${anoPersonal.numero}.`,
        '',
        'Cada párrafo máximo 3 frases. Separa con línea en blanco. Termina siempre en punto. Nunca dejes una frase incompleta.',
      ].join('\n')

      const result = await llamarGemini({
        herramienta: HERRAMIENTA,
        prompt,
        userId: userPlan.userId,
        usarLite: true,
        cacheable: false,
        maxTokens: 1000,
        temperatura: 0.7,
      })

      if (!result.error && result.texto) {
        setInterpretacion(result.texto)
        setFromCache(false)
        supabase.from('horoscopo_cache').insert({
          signo: `ap${anoPersonal.numero}`, fecha: String(new Date().getFullYear()), tipo: HERRAMIENTA,
          contenido: result.texto, tokens_used: result.tokensUsados,
        }).then(() => {})
        if (userPlan.userId) await incrementarConsulta(userPlan.userId)
        analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: result.modelo })
        await _guardarSiPrimera(result.texto)
      } else {
        setErrorMsg('El universo guarda silencio. Inténtalo de nuevo.')
      }
    } catch (err) {
      console.error('[AnoPersonal]', err)
      setErrorMsg('Error inesperado. Inténtalo de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  const _guardarSiPrimera = async (texto: string) => {
    if (lecturaGuardadaRef.current) return
    lecturaGuardadaRef.current = true
    await guardarLectura({
      herramienta: HERRAMIENTA,
      titulo: `Año Personal ${anoPersonal.numero} · ${signo} · ${fechaHoy}`,
      contenido: texto,
      metadatos: { signo, fecha: fechaHoy, nombre, fechaNacimiento, anoPersonal: anoPersonal.numero },
    })
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
            <p className="text-white font-semibold text-sm">Año Personal</p>
            <p className="text-purple-300 text-xs">Tu ciclo numerológico</p>
          </div>
          {!userPlan.cargando && !userPlan.esPremium && (
            <p className="text-white/40 text-xs">{userPlan.consultasRestantes}/{userPlan.limiteConsultasDia}</p>
          )}
        </div>

        {/* Card con el número calculado */}
        <div className="bg-[#0d0015] border border-purple-500/50 rounded-3xl p-6 text-center">
          <p className="text-purple-400 text-xs tracking-widest uppercase mb-2">Tu Año Personal</p>
          <p className="text-white text-6xl font-bold mb-2">{anoPersonal.numero}</p>
          <p className="text-white/70 text-sm leading-relaxed">{anoPersonal.descripcion}</p>
          <p className="text-white/40 text-xs mt-2">{signo} · {hoy}</p>
        </div>

        {!generado ? (
          <div className="flex flex-col gap-3">
            <DisclaimerIA compact />
            <button onClick={generarLectura} disabled={userPlan.cargando}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40">
              Generar mi lectura completa
            </button>
          </div>
        ) : (
          <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-purple-400 text-xs tracking-widest uppercase">Tu lectura</p>
              {fromCache && <span className="text-green-400 text-xs">⚡ Instantáneo</span>}
            </div>
            {cargando ? (
              <div className="flex gap-2 py-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              <TextoIA texto={interpretacion} />
            )}
          </div>
        )}

        {errorMsg && (
          <div className="bg-[#0d0015] border border-red-400/50 rounded-2xl p-4">
            <p className="text-red-300 text-sm text-center">{errorMsg}</p>
            {!userPlan.esPremium && (
              <button onClick={() => navigate('/premium')}
                className="mt-3 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold py-2 rounded-full">
                Hazte Premium
              </button>
            )}
          </div>
        )}

        {!cargando && interpretacion && (
          <>
            <DisclaimerIA />
            <Valoracion onValorar={handleValorar} />
            <Compartir
              titulo={`Mi Año Personal es el ${anoPersonal.numero}`}
              texto={interpretacion}
              hashtags={['Universe', 'AnoPersonal', 'Numerologia']}
            />
            <CtaUpsell consultasRestantes={userPlan.consultasRestantes} />
            <button onClick={() => navigate('/guia')}
              className="w-full bg-[#0d0015] border border-white/15 text-white font-semibold py-4 rounded-full hover:border-purple-500/50 transition">
              Explorar con mi Guía IA
            </button>
          </>
        )}

      </div>
    </PageLayout>
  )
}
