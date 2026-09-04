import { useState, useEffect } from 'react'
import Compartir from '../components/Compartir'
import CtaUpsell from '../components/CtaUpsell'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import { llamarGemini } from '../lib/gemini'
import { useUserPlan } from '../hooks/useUserPlan'
import { useAnalytics } from '../hooks/useAnalytics'
import { supabase } from '../lib/supabase'

export default function Meditacion() {
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [generado, setGenerado] = useState(false)
  const [fromCache, setFromCache] = useState(false)
  const [tiempoInicio, setTiempoInicio] = useState(0)

  const nombre = localStorage.getItem('nombre') || 'viajero'
  const signo = localStorage.getItem('signo') || 'Leo'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const fechaHoy = new Date().toISOString().split('T')[0]
  const { esPremium, userId, consultasRestantes } = useUserPlan()
  const { registrarApertura, registrarLectura, registrarValoracion } = useAnalytics('meditacion', esPremium)

  useEffect(() => { registrarApertura() }, [])

  const generarLectura = async () => {
    setCargando(true)
    setGenerado(true)
    setTiempoInicio(Date.now())

    try {
      const { data: cached } = await supabase.from('horoscopo_cache')
        .select('contenido')
        .eq('signo', signo.toLowerCase())
        .eq('fecha', fechaHoy)
        .eq('tipo', 'meditacion')
        .maybeSingle()
      if (cached?.contenido) {
        setInterpretacion(`${nombre}, ${cached.contenido}`)
        setFromCache(true)
        setCargando(false)
        registrarLectura({ desdCache: true, tiempoMs: Date.now() - tiempoInicio, modeloIa: 'cache' })
        return
      }
    } catch (err) { console.warn('[Meditacion]', err) }

    const result = await llamarGemini({
      herramienta: 'meditacion',
      prompt: `Guía de meditación. Nombre: ${nombre}, Signo: ${signo}. Guía de meditación de hoy adaptada a la energía del signo. 4 pasos breves y concretos.`,
      userId, usarLite: true, cacheable: false, maxTokens: 200,
    })

    const tiempoMs = Date.now() - tiempoInicio

    if (!result.error && result.texto) {
      setInterpretacion(`${nombre}, ${result.texto}`)
      setFromCache(false)
      registrarLectura({ desdCache: false, tiempoMs, modeloIa: result.modelo })
      supabase.from('horoscopo_cache').insert({
        signo: signo.toLowerCase(), fecha: fechaHoy, tipo: 'meditacion',
        contenido: result.texto, tokens_used: result.tokensUsados
      }).then(() => {})
    } else {
      setInterpretacion('El universo guarda silencio. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  const bgStyle = { backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)', backgroundSize: 'cover' as const, backgroundPosition: 'center' as const }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />
      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">
        <div className="flex items-center">
          <button onClick={() => window.location.href = '/tradiciones'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Meditación</p>
            <p className="text-purple-300 text-xs">Práctica diaria</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur text-center">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-1">Meditación</p>
          <p className="text-white/60 text-sm">{signo} · {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        {!generado ? (
          <div className="flex flex-col gap-3">
            <DisclaimerIA compact />
            <button onClick={generarLectura} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">Generar mi lectura</button>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-3">
              <p className="text-purple-300 text-xs tracking-widest uppercase">Tu lectura</p>
              {fromCache && <span className="text-green-400 text-xs">⚡ Instantáneo</span>}
            </div>
            {cargando ? (
              <div className="flex gap-2 py-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{interpretacion}</p>}
          </div>
        )}
        {!cargando && interpretacion && (
          <>
            <DisclaimerIA />
            <Valoracion onValorar={registrarValoracion} />
            <Compartir titulo="Meditación" texto={interpretacion} hashtags={['Universe', 'Meditacion']} />
            <CtaUpsell consultasRestantes={consultasRestantes} />
            <button onClick={() => window.location.href = '/guia'} className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full">Explorar con mi Guía IA</button>
          </>
        )}
      </div>
    </div>
  )
}
