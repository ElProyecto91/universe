import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserPlan, incrementarConsulta } from '../hooks/useUserPlan'
import { useAnalytics } from '../hooks/useAnalytics'
import { guardarLectura } from '../hooks/useHistorial'
import { llamarGemini } from '../lib/gemini'
import { AREAS_BAGUA, getAreaBagua, AreaBagua } from '../lib/motores/fengshui'
import Compartir from '../components/Compartir'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import CtaUpsell from '../components/CtaUpsell'
import PageLayout from '../components/PageLayout'
import TextoIA from '../components/TextoIA'

const HERRAMIENTA = 'feng-shui'

const GRID_ORDER = [
  'prosperidad', 'fama',     'amor',
  'familia',     'centro',   'creatividad',
  'sabiduria',   'carrera',  'viajes',
]

export default function FengShui() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [areaSeleccionada, setAreaSeleccionada] = useState<AreaBagua | null>(null)
  const [interpretacion,   setInterpretacion]   = useState('')
  const [cargando,         setCargando]         = useState(false)
  const [fase,             setFase]             = useState<'mapa' | 'area' | 'resultado'>('mapa')
  const [errorMsg,         setErrorMsg]         = useState('')
  const [yaValorado,       setYaValorado]       = useState(false)
  const lecturaGuardadaRef                      = useRef(false)

  const nombre   = localStorage.getItem('nombre') || 'viajero'
  const signo    = localStorage.getItem('signo')  || 'Leo'
  const fechaHoy = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (!userPlan.cargando) analytics.registrarApertura()
  }, [userPlan.cargando])

  const seleccionarArea = (id: string) => {
    setAreaSeleccionada(getAreaBagua(id))
    setInterpretacion('')
    setErrorMsg('')
    lecturaGuardadaRef.current = false
    setFase('area')
  }

  const consultar = async () => {
    if (!areaSeleccionada) return
    setCargando(true); setFase('resultado'); setErrorMsg('')
    const t0 = Date.now()

    try {
      const prompt = [
        'Eres un maestro de Feng Shui con profundo conocimiento del Bagua y los cinco elementos.',
        `El usuario se llama ${nombre}, signo ${signo}. Quiere activar el área de ${areaSeleccionada.nombre} (${areaSeleccionada.nombreChino}).`,
        `Elemento: ${areaSeleccionada.elemento}. Trigrama: ${areaSeleccionada.trigrama}. Posición en el espacio: ${areaSeleccionada.posicion}.`,
        '',
        'Escribe en español, en prosa fluida, sin listas ni asteriscos. Sin saludar.',
        'Escribe exactamente 3 párrafos separados por línea en blanco. Cada párrafo máximo 3 frases.',
        `Párrafo 1: qué significa energéticamente el área de ${areaSeleccionada.nombre} y cómo puede estar afectando la vida de ${nombre} ahora mismo.`,
        'Párrafo 2: qué tipo de energía o bloqueo es más común en esta área y cómo reconocerlo.',
        'Párrafo 3: las 2-3 acciones más poderosas y concretas para activar esta área hoy, con explicación de por qué funcionan.',
        'Tono sabio, práctico y sereno. Termina en punto.',
      ].join('\n')

      const result = await llamarGemini({
        herramienta: HERRAMIENTA,
        prompt,
        userId: userPlan.userId,
        usarLite: true,
        cacheable: false,
        maxTokens: 500,
      })

      if (result.error || !result.texto) {
        setErrorMsg('El Chi guarda silencio. Inténtalo de nuevo.')
        return
      }

      setInterpretacion(result.texto)
      if (userPlan.userId) await incrementarConsulta(userPlan.userId)
      analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: 'lite' })
      if (!lecturaGuardadaRef.current) {
        lecturaGuardadaRef.current = true
        await guardarLectura({
          herramienta: HERRAMIENTA,
          titulo: `Feng Shui · ${areaSeleccionada.nombre} · ${fechaHoy}`,
          contenido: result.texto,
          metadatos: { area: areaSeleccionada.id, fecha: fechaHoy, nombre, signo },
        })
      }
    } catch (err) {
      console.error('[FengShui]', err)
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
    setFase('mapa'); setAreaSeleccionada(null)
    setInterpretacion(''); setErrorMsg('')
    lecturaGuardadaRef.current = false
  }

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">

        <div className="flex items-center">
          <button
            onClick={() => fase !== 'mapa' ? (fase === 'resultado' ? setFase('area') : resetear()) : navigate('/tradiciones')}
            className="text-purple-300 text-sm"
          >← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Feng Shui · 風水</p>
            <p className="text-purple-300 text-xs">Mapa Bagua · Armonía del espacio</p>
          </div>
        </div>

        {/* FASE: MAPA BAGUA */}
        {fase === 'mapa' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-teal-500/30 rounded-3xl p-5 text-center">
              <p className="text-3xl mb-2">☯️</p>
              <p className="text-teal-400 text-xs tracking-widest uppercase mb-2">Mapa Bagua</p>
              <p className="text-white/60 text-xs leading-relaxed">El Bagua divide tu espacio en 9 áreas energéticas. Toca el área que quieres activar o armonizar en tu vida.</p>
            </div>

            {/* Grid Bagua 3x3 */}
            <div className="grid grid-cols-3 gap-2">
              {GRID_ORDER.map(id => {
                const area = getAreaBagua(id)
                return (
                  <button
                    key={id}
                    onClick={() => seleccionarArea(id)}
                    className="bg-[#0d0015] border border-white/10 rounded-2xl p-3 flex flex-col items-center gap-1 hover:border-teal-500/50 transition"
                    style={{ borderColor: `${area.colorHex}30` }}
                  >
                    <span className="text-xl">{area.emoji}</span>
                    <span className="text-white text-xs font-semibold text-center leading-tight">{area.nombre}</span>
                    <span className="text-white/30 text-xs">{area.elemento}</span>
                  </button>
                )
              })}
            </div>

            <p className="text-white/30 text-xs text-center">El área superior izquierda es Prosperidad. La puerta de entrada coincide con la fila inferior.</p>
          </div>
        )}

        {/* FASE: DETALLE ÁREA */}
        {fase === 'area' && areaSeleccionada && (
          <div className="flex flex-col gap-4">
            <div
              className="rounded-3xl p-6 text-center border"
              style={{ borderColor: `${areaSeleccionada.colorHex}40`, background: `linear-gradient(135deg, #0d0015 0%, ${areaSeleccionada.colorHex}10 100%)` }}
            >
              <p className="text-4xl mb-3">{areaSeleccionada.emoji}</p>
              <p className="text-xs tracking-widest uppercase mb-1" style={{ color: areaSeleccionada.colorHex }}>{areaSeleccionada.nombreChino}</p>
              <p className="text-white text-xl font-bold">{areaSeleccionada.nombre}</p>
              <p className="text-white/40 text-xs mt-1">{areaSeleccionada.elemento} · {areaSeleccionada.trigrama}</p>
              <p className="text-white/50 text-xs mt-1">{areaSeleccionada.posicion}</p>
            </div>

            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5">
              <p className="text-white/70 text-sm leading-relaxed mb-4">{areaSeleccionada.descripcion}</p>
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: areaSeleccionada.colorHex }}>Activadores del área</p>
              <div className="flex flex-col gap-2">
                {areaSeleccionada.activadores.map((act, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-xs mt-0.5" style={{ color: areaSeleccionada.colorHex }}>◆</span>
                    <p className="text-white/60 text-xs">{act}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs" style={{ color: areaSeleccionada.colorHex }}>Colores recomendados: {areaSeleccionada.colores.join(' · ')}</p>
            </div>

            <DisclaimerIA compact />
            <button
              onClick={consultar}
              className="w-full py-4 rounded-full text-white font-semibold hover:opacity-90 transition"
              style={{ background: `linear-gradient(to right, ${areaSeleccionada.colorHex}, ${areaSeleccionada.colorHex}aa)` }}
            >
              Activar el área de {areaSeleccionada.nombre}
            </button>
          </div>
        )}

        {/* FASE: RESULTADO */}
        {fase === 'resultado' && areaSeleccionada && (
          <div className="flex flex-col gap-4">
            <div
              className="rounded-3xl p-4 text-center border"
              style={{ borderColor: `${areaSeleccionada.colorHex}40` }}
            >
              <p className="text-2xl">{areaSeleccionada.emoji}</p>
              <p className="text-white font-semibold">{areaSeleccionada.nombre}</p>
              <p className="text-white/40 text-xs">{areaSeleccionada.elemento} · {areaSeleccionada.posicion}</p>
            </div>

            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-xs tracking-widest uppercase mb-4" style={{ color: areaSeleccionada.colorHex }}>Guía de activación</p>
              {cargando ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: areaSeleccionada.colorHex, animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: areaSeleccionada.colorHex, animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: areaSeleccionada.colorHex, animationDelay: '300ms' }} />
                </div>
              ) : errorMsg ? (
                <p className="text-red-300 text-sm">{errorMsg}</p>
              ) : (
                <TextoIA texto={interpretacion} />
              )}
            </div>

            {!cargando && interpretacion && (
              <>
                <DisclaimerIA />
                <Valoracion onValorar={handleValorar} />
                <Compartir
                  titulo={`Feng Shui · ${areaSeleccionada.nombre}`}
                  texto={interpretacion}
                  hashtags={['Universe', 'FengShui', 'Bagua']}
                />
                <CtaUpsell consultasRestantes={userPlan.consultasRestantes} />
                <button onClick={() => navigate('/guia')} className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">Explorar con mi Guía IA</button>
                <button onClick={resetear} className="w-full text-teal-300/60 text-sm py-2">Explorar otra área</button>
              </>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}