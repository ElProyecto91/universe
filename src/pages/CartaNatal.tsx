import { useState } from 'react'
import { PLANETAS_INFO, CASAS_ASTROLOGICAS, calcularSignoLunaAprox, calcularVenusAprox, calcularMarteAprox, calcularMercurioAprox } from '../lib/motores/cartaNatal'
import { getSignoSolar } from '../lib/motores/horoscopo'
import Compartir from '../components/Compartir'
import Paywall from '../components/Paywall'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import { supabase, llamarGemini, useUserPlan, useAnalytics, registrarEvento } from '../lib/paginaHelper'
import { guardarLectura } from '../hooks/useHistorial'

export default function CartaNatal() {
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [generado, setGenerado] = useState(false)
  const [fromCache, setFromCache] = useState(false)
  const [vistaActiva, setVistaActiva] = useState<'planetas' | 'casas' | 'lectura'>('planetas')

  const { esPremium, userId } = useUserPlan()
  useAnalytics('carta-natal')

  const nombre = localStorage.getItem('nombre') || 'viajero'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const signoSolar = getSignoSolar(fechaNacimiento)
  const signoLuna = calcularSignoLunaAprox(fechaNacimiento)
  const signoBGMercurio = calcularMercurioAprox(signoSolar)
  const signoVenus = calcularVenusAprox(signoSolar)
  const signoMarte = calcularMarteAprox(fechaNacimiento)
  const cacheKey = `carta-natal-${fechaNacimiento}`

  const planetas = [
    { planeta: 'Sol', signo: signoSolar },
    { planeta: 'Luna', signo: signoLuna },
    { planeta: 'Mercurio', signo: signoBGMercurio },
    { planeta: 'Venus', signo: signoVenus },
    { planeta: 'Marte', signo: signoMarte },
  ]

  const bgStyle = { backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }

  const generarLectura = async () => {
    const t0 = Date.now()
    setCargando(true)
    setGenerado(true)
    setVistaActiva('lectura')

    try {
      const { data: cached } = await supabase.from('ai_cache').select('respuesta').eq('cache_key', cacheKey).maybeSingle()
      if (cached?.respuesta) {
        setInterpretacion(`${nombre}, ${cached.respuesta}`)
        setFromCache(true)
        setCargando(false)
        registrarEvento({ herramienta: 'carta-natal', accion: 'lectura_ia', desde_cache: true, tiempo_respuesta_ms: Date.now() - t0, user_id: userId })
        return
      }
    } catch (err) { console.warn('[CartaNatal] Error caché:', err) }

    const descripcionPlanetas = planetas.map(p => `${p.planeta} en ${p.signo}: ${PLANETAS_INFO[p.planeta]?.enSigno(p.signo)}`).join('\n')

    const result = await llamarGemini({
      herramienta: 'carta-natal',
      prompt: `Astróloga experta en astrología natal occidental.

Nombre: ${nombre} · Nacimiento: ${fechaNacimiento}
Posiciones:
${descripcionPlanetas}

4-5 párrafos: trío Sol/Luna/Ascendente, Mercurio/Venus/Marte como perfil diario, aspectos clave de personalidad, propósito de vida emergente. Menciona que para máxima precisión se necesita hora de nacimiento. Específico, poético, profundo.`,
      userId, usarLite: false, cacheable: false, maxTokens: 600,
    })

    if (!result.error && result.texto) {
      setInterpretacion(`${nombre}, ${result.texto}`)
      registrarEvento({ herramienta: 'carta-natal', accion: 'lectura_ia', desde_cache: false, tiempo_respuesta_ms: Date.now() - t0, user_id: userId })
      guardarLectura({
        herramienta: 'carta-natal',
        titulo: `Carta Natal · ${signoSolar} · ${fechaNacimiento}`,
        contenido: result.texto,
        metadatos: { signo: signoSolar, fecha_nacimiento: fechaNacimiento },
      })
      supabase.from('ai_cache').insert({ cache_key: cacheKey, herramienta: 'carta-natal', prompt_hash: cacheKey, respuesta: result.texto, tokens_used: result.tokensUsados, expires_at: null }).then(() => {})
    } else {
      setInterpretacion('Las estrellas guardan silencio. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      {/* Paywall para usuarios free */}
      {!esPremium && <Paywall motivo="herramienta" herramienta="Carta Natal completa" />}

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">
        <div className="flex items-center">
          <button onClick={() => window.location.href = '/universo'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Carta Natal</p>
            <p className="text-purple-300 text-xs">{nombre} · {fechaNacimiento}</p>
          </div>
        </div>

        <div className="flex gap-1 bg-white/10 rounded-2xl p-1">
          {[{ id: 'planetas', label: 'Planetas' }, { id: 'casas', label: 'Casas' }, { id: 'lectura', label: 'Lectura IA' }].map(tab => (
            <button key={tab.id} onClick={() => setVistaActiva(tab.id as any)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${vistaActiva === tab.id ? 'bg-purple-600 text-white' : 'text-white/50'}`}>{tab.label}</button>
          ))}
        </div>

        {vistaActiva === 'planetas' && (
          <div className="flex flex-col gap-4">
            <div className="bg-amber-500/15 border border-amber-500/30 rounded-2xl p-3 backdrop-blur">
              <p className="text-amber-400 text-xs">⚠️ Los planetas lentos (Júpiter+) son posiciones generacionales aproximadas. Para máxima precisión, usa astro.com con tu hora de nacimiento.</p>
            </div>
            {planetas.map(({ planeta, signo }) => (
              <div key={planeta} className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{PLANETAS_INFO[planeta]?.simbolo}</span>
                  <div>
                    <p className="text-white font-bold">{planeta} en {signo}</p>
                    <p className="text-white/40 text-xs">{PLANETAS_INFO[planeta]?.rige}</p>
                  </div>
                </div>
                <p className="text-white/70 text-xs leading-relaxed">{PLANETAS_INFO[planeta]?.enSigno(signo)}</p>
              </div>
            ))}
            <button onClick={generarLectura} disabled={cargando} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40">
              Generar mi lectura natal completa
            </button>
          </div>
        )}

        {vistaActiva === 'casas' && (
          <div className="flex flex-col gap-3">
            <div className="bg-white/8 border border-white/20 rounded-2xl p-3 backdrop-blur" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-white/50 text-xs">Las 12 casas astrológicas dividen el cielo en áreas de vida. Para saber qué planetas tienes en cada casa necesitas la hora exacta de nacimiento.</p>
            </div>
            {CASAS_ASTROLOGICAS.map(casa => (
              <div key={casa.numero} className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">{casa.nombre}</p>
                    <p className="text-purple-300 text-xs mt-0.5">{casa.area}</p>
                  </div>
                  <p className="text-white/30 text-xs">{casa.rige}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {vistaActiva === 'lectura' && (
          <div className="flex flex-col gap-5">
            {!generado ? (
              <div className="flex flex-col gap-4 items-center text-center">
                <p className="text-7xl">🌌</p>
                <p className="text-white/60 text-sm leading-relaxed">Genera tu lectura natal personalizada con IA. Combina tus posiciones planetarias en una interpretación profunda y coherente.</p>
                <button onClick={generarLectura} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">Generar mi carta natal</button>
              </div>
            ) : (
              <div className="bg-white/8 border border-white/20 rounded-3xl p-6 backdrop-blur" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-purple-300 text-xs tracking-widest uppercase">Tu carta natal</p>
                  {fromCache && <span className="text-green-400 text-xs">⚡ Instantáneo</span>}
                </div>
                {cargando ? (
                  <div className="flex gap-2 py-4">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                ) : (
                  <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{interpretacion}</p>
                )}
              </div>
            )}

            {!cargando && interpretacion && (
              <>
                <DisclaimerIA />
                <Valoracion herramienta="carta-natal" userId={userId} />
                <Compartir titulo={`Mi Carta Natal · ${signoSolar}`} texto={interpretacion} hashtags={['CartaNatal', 'Universe', signoSolar, 'Astrologia']} />
              </>
            )}
            {generado && !cargando && (
              <button onClick={() => window.location.href = '/guia'} className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full">Explorar con mi Guía IA</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
