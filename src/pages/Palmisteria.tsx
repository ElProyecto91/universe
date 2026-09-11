// src/pages/Palmisteria.tsx
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

const HERRAMIENTA = 'palmisteria'

export default function Palmisteria() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [preview,        setPreview]        = useState<string | null>(null)
  const [pregunta,       setPregunta]       = useState('')
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando,       setCargando]       = useState(false)
  const [fase,           setFase]           = useState<'preguntar' | 'resultado'>('preguntar')
  const [errorMsg,       setErrorMsg]       = useState('')
  const [yaValorado,     setYaValorado]     = useState(false)
  const inputFileRef                        = useRef<HTMLInputElement>(null)
  const lecturaGuardadaRef                  = useRef(false)

  const nombre          = localStorage.getItem('nombre')          || 'viajero'
  const signo           = localStorage.getItem('signo')           || 'Leo'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const fechaHoy        = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (!userPlan.cargando) analytics.registrarApertura()
  }, [userPlan.cargando])

  if (!userPlan.cargando && !userPlan.esPremium) {
    analytics.registrarPaywall(); navigate('/premium'); return null
  }

  const handleImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
  }

  const consultar = async () => {
    if (!imagen && !pregunta.trim()) return
    setFase('resultado'); setCargando(true); setErrorMsg('')
    const t0 = Date.now()

    try {
      // Lectura basada en la consulta escrita — 3 llamadas encadenadas
      const base = `Eres un experto en palmistería. El usuario se llama ${nombre}, signo ${signo}, nacido el ${fechaNacimiento}. Área de vida: "${pregunta}". Responde SOLO con texto en español, en prosa continua y directa. Sin asteriscos, sin guiones, sin markdown. Escribe frases cortas de máximo 20 palabras cada una. Termina siempre en punto.`

      const r1 = await llamarGemini({ herramienta: HERRAMIENTA, prompt: `${base} Describe qué revela la línea principal relacionada con esta área y qué energía dominante muestra.`, userId: userPlan.userId, usarLite: true, cacheable: false, maxTokens: 250 })
      if (r1.error) { setErrorMsg('El universo guarda silencio. Inténtalo de nuevo.'); return }

      await new Promise(r => setTimeout(r, 500))
      const r2 = await llamarGemini({ herramienta: HERRAMIENTA, prompt: `${base} Continuando desde: "${r1.texto.trim()}" — describe qué matices o líneas secundarias complementan esta lectura.`, userId: userPlan.userId, usarLite: true, cacheable: false, maxTokens: 250 })
      if (r2.error) { setErrorMsg('El universo guarda silencio. Inténtalo de nuevo.'); return }

      await new Promise(r => setTimeout(r, 500))
      const r3 = await llamarGemini({ herramienta: HERRAMIENTA, prompt: `${base} Continuando desde: "${r1.texto.trim()} ${r2.texto.trim()}" — da un consejo práctico y una pregunta reflexiva de cierre.`, userId: userPlan.userId, usarLite: true, cacheable: false, maxTokens: 250 })
      if (r3.error) { setErrorMsg('El universo guarda silencio. Inténtalo de nuevo.'); return }

      const resultado = [r1.texto, r2.texto, r3.texto].map(t => t.trim()).filter(Boolean).join('\n\n')

            setInterpretacion(resultado)
      if (userPlan.userId) await incrementarConsulta(userPlan.userId)
      analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: 'flash' })

      if (!lecturaGuardadaRef.current) {
        lecturaGuardadaRef.current = true
        await guardarLectura({
          herramienta: HERRAMIENTA,
          titulo: `Palmistería · ${fechaHoy}`,
          contenido: `Consulta: "${pregunta || 'lectura de imagen'}"\n\n${resultado}`,
          metadatos: { pregunta: pregunta || 'imagen', fecha: fechaHoy, nombre, signo, modoImagen: !!imagen }
        })
      }
    } catch (err) {
      console.error('[Palmisteria]', err)
      setErrorMsg('Error inesperado. Inténtalo de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  const handleValorar = (valor: 1 | -1) => { if (yaValorado) return; setYaValorado(true); analytics.registrarValoracion(valor) }

  const resetear = () => {
    setFase('preguntar'); setInterpretacion(''); setErrorMsg('')
    setPreview(null); setPregunta('')
    lecturaGuardadaRef.current = false
    if (inputFileRef.current) inputFileRef.current.value = ''
  }

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">

        <div className="flex items-center">
          <button onClick={() => fase === 'resultado' ? resetear() : navigate('/tradiciones')} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Palmistería</p>
            <p className="text-purple-300 text-xs">Las líneas de tu mano</p>
          </div>
          <span className="text-purple-400 text-xs border border-purple-400/30 rounded-full px-2 py-0.5">✨ Premium</span>
        </div>

        {fase === 'preguntar' && (
          <div className="flex flex-col gap-4">

            {/* Subir imagen */}
            <div
              className="bg-[#0d0015] border-2 border-dashed border-purple-500/40 rounded-3xl p-6 flex flex-col items-center gap-3 cursor-pointer hover:border-purple-500/70 transition"
              onClick={() => inputFileRef.current?.click()}
            >
              {preview ? (
                <>
                  <img src={preview} alt="Tu mano" className="w-full max-h-48 object-cover rounded-2xl" />
                  <p className="text-green-400 text-xs">✓ Imagen lista para analizar</p>
                </>
              ) : (
                <>
                  <p className="text-4xl">🤚</p>
                  <p className="text-white font-semibold text-sm">Sube una foto de tu palma</p>
                  <p className="text-white/40 text-xs text-center">Abre bien la mano con la palma hacia arriba y toma la foto con buena luz</p>
                  <p className="text-purple-400 text-xs">Toca para subir o usar la cámara</p>
                </>
              )}
              <input
                ref={inputFileRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImagen}
                className="hidden"
              />
            </div>

            {/* Divisor */}
            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-white/10" />
              <p className="text-white/30 text-xs">o describe tu consulta</p>
              <div className="flex-1 border-t border-white/10" />
            </div>

            {/* Texto alternativo */}
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">Área de vida (opcional)</p>
              <textarea
                value={pregunta}
                onChange={e => setPregunta(e.target.value)}
                placeholder="Amor, trabajo, salud, propósito..."
                rows={3}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30"
              />
            </div>

            <DisclaimerIA compact />

            <button
              onClick={consultar}
              disabled={!pregunta.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >
              Consultar
            </button>
          </div>
        )}

        {fase === 'resultado' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-4">Lectura de tu mano</p>
              {cargando ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <p className="text-white/40 text-xs">Analizando las líneas de tu mano...</p>
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
                <Compartir titulo="Palmistería" texto={interpretacion} hashtags={['Universe', 'Palmisteria']} />
                <button onClick={() => navigate('/guia')} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">Explorar con mi Guía IA</button>
                <button onClick={resetear} className="w-full text-purple-300/60 text-sm py-2">Nueva lectura</button>
              </>
            )}
          </div>
        )}

      </div>
    </PageLayout>
  )
}
