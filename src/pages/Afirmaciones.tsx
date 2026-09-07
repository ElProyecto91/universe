// src/pages/Afirmaciones.tsx
// ============================================================
// UNIVERSE — Afirmaciones
// Migrada al nuevo sistema: useUserPlan, useAnalytics,
// Valoracion, guardarLectura, DisclaimerIA
// ============================================================

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserPlan, incrementarConsulta } from '../hooks/useUserPlan'
import { useAnalytics } from '../hooks/useAnalytics'
import { guardarLectura } from '../hooks/useHistorial'
import { llamarGemini } from '../lib/gemini'
import { supabase } from '../lib/supabase'
import { getSignoSolar } from '../lib/motores/horoscopo'
import { AFIRMACIONES_TEMATICAS, getAfirmacionDelDia, getAfirmacionTematica } from '../lib/motores/afirmaciones'
import Compartir from '../components/Compartir'
import Valoracion from '../components/Valoracion'

// ── Constantes ───────────────────────────────────────────────

const HERRAMIENTA = 'afirmaciones'

const TEMAS = [
  { id: 'amor',      label: 'Amor',      icono: '❤️' },
  { id: 'abundancia',label: 'Abundancia',icono: '💰' },
  { id: 'salud',     label: 'Salud',     icono: '🌿' },
  { id: 'proposito', label: 'Propósito', icono: '✨' },
  { id: 'paz',       label: 'Paz',       icono: '☮️' },
] as const

type TemaId = typeof TEMAS[number]['id']
type Vista  = 'diaria' | 'tematica' | 'practica'

const bgStyle = {
  backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}

// ── Componente DisclaimerIA inline ───────────────────────────
// (si tienes un componente global, impórtalo en su lugar)
function DisclaimerIA() {
  return (
    <p className="text-white/30 text-xs text-center leading-relaxed px-2">
      Contenido generado por IA con fines de reflexión y entretenimiento.
      No sustituye asesoramiento profesional.
    </p>
  )
}

// ── Componente principal ─────────────────────────────────────
export default function Afirmaciones() {
  const navigate = useNavigate()
  const userPlan = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [vista,                setVista]                = useState<Vista>('diaria')
  const [temaActivo,           setTemaActivo]           = useState<TemaId>('amor')
  const [afirmacionPersonal,   setAfirmacionPersonal]   = useState('')
  const [repeticiones,         setRepeticiones]         = useState(0)
  const [interpretacion,       setInterpretacion]       = useState('')
  const [cargando,             setCargando]             = useState(false)
  const [fromCache,            setFromCache]            = useState(false)
  const [yaValorado,           setYaValorado]           = useState(false)
  const [errorMsg,             setErrorMsg]             = useState('')
  const lecturaGuardadaRef                              = useRef(false)

  // Datos del usuario
  const nombre         = localStorage.getItem('nombre')          || 'viajero'
  const fechaNacimiento= localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const signo          = getSignoSolar(fechaNacimiento)
  const afirmacionDiaria = getAfirmacionDelDia(signo)
  const afirmacionTema   = getAfirmacionTematica(temaActivo)
  const hoy = new Date().toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
  const fechaHoy = new Date().toISOString().split('T')[0]

  // ── Registrar apertura ────────────────────────────────────
  useEffect(() => {
    if (!userPlan.cargando) {
      analytics.registrarApertura()
    }
  }, [userPlan.cargando])

  // ── Generar afirmaciones con IA ───────────────────────────
  const generarAfirmacion = async () => {
    if (userPlan.cargando) return

    // Paywall
    if (!userPlan.puedeConsultar) {
      analytics.registrarPaywall()
      navigate('/premium')
      return
    }

    // Límite diario
    if (!userPlan.esPremium && userPlan.consultasRestantes <= 0) {
      analytics.registrarLimite()
      setErrorMsg(`Has alcanzado tu límite diario de ${userPlan.limiteConsultasDia} consultas gratuitas.`)
      return
    }

    setCargando(true)
    setErrorMsg('')
    const t0 = Date.now()

    try {
      // 1. Caché
      const { data: cached } = await supabase
        .from('horoscopo_cache')
        .select('contenido')
        .eq('signo', signo.toLowerCase())
        .eq('fecha', fechaHoy)
        .eq('tipo', 'afirmaciones')
        .maybeSingle()

      if (cached?.contenido) {
        setInterpretacion(cached.contenido)
        setFromCache(true)
        analytics.registrarLectura({ desdCache: true, tiempoMs: Date.now() - t0 })
        await _guardarSiPrimera(cached.contenido)
        setCargando(false)
        return
      }

      // 2. Gemini Lite
      const result = await llamarGemini({
        herramienta: HERRAMIENTA,
        prompt: `Experto en psicología positiva. Crea 3 afirmaciones poderosas para ${signo} hoy.
Afirmación base: "${afirmacionDiaria}"
Cada una en primera persona presente, una por línea, sin numeración ni guiones. Máximo 3 líneas.`,
        userId: userPlan.userId,
        usarLite: true,
        cacheable: false,
        maxTokens: 150,
      })

      if (!result.error && result.texto) {
        setInterpretacion(result.texto)
        setFromCache(false)

        // Guardar caché
        supabase.from('horoscopo_cache').insert({
          signo: signo.toLowerCase(),
          fecha: fechaHoy,
          tipo: 'afirmaciones',
          contenido: result.texto,
          tokens_used: result.tokensUsados,
        }).then(() => {})

        // Incrementar contador de consultas
        if (userPlan.userId) await incrementarConsulta(userPlan.userId)

        analytics.registrarLectura({
          desdCache: false,
          tiempoMs: Date.now() - t0,
          modeloIa: 'lite',
        })

        await _guardarSiPrimera(result.texto)
      } else {
        setErrorMsg('El universo guarda silencio. Inténtalo de nuevo.')
      }
    } catch (err) {
      console.error('[Afirmaciones]', err)
      setErrorMsg('Error inesperado. Inténtalo de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  // Guardar en historial solo la primera vez
  const _guardarSiPrimera = async (texto: string) => {
    if (lecturaGuardadaRef.current) return
    lecturaGuardadaRef.current = true
    await guardarLectura({
      herramienta: HERRAMIENTA,
      titulo: `Afirmaciones · ${signo} · ${fechaHoy}`,
      contenido: `Afirmación base:\n"${afirmacionDiaria}"\n\nAfirmaciones personalizadas:\n${texto}`,
      metadatos: { signo, fecha: fechaHoy, nombre },
    })
  }

  // ── Valoración ────────────────────────────────────────────
  const handleValorar = (valor: 1 | -1) => {
    if (yaValorado) return
    setYaValorado(true)
    analytics.registrarValoracion(valor)
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      {/* Overlay — regla fija: bg-black/92 */}
      <div className="absolute inset-0 bg-black/92" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        {/* Header */}
        <div className="flex items-center">
          <button
            onClick={() => navigate('/universo')}
            className="text-purple-300 text-sm"
          >
            ← Volver
          </button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Afirmaciones</p>
            <p className="text-purple-300 text-xs capitalize">{hoy}</p>
          </div>
          {/* Indicador de consultas restantes para free */}
          {!userPlan.cargando && !userPlan.esPremium && (
            <p className="text-white/40 text-xs">
              {userPlan.consultasRestantes}/{userPlan.limiteConsultasDia}
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/10 rounded-2xl p-1">
          {(
            [
              { id: 'diaria',   label: 'Diaria'   },
              { id: 'tematica', label: 'Temática' },
              { id: 'practica', label: 'Práctica' },
            ] as { id: Vista; label: string }[]
          ).map(tab => (
            <button
              key={tab.id}
              onClick={() => setVista(tab.id)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
                vista === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-white/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Vista DIARIA ───────────────────────────────── */}
        {vista === 'diaria' && (
          <div className="flex flex-col gap-5">

            {/* Afirmación del día */}
            <div className="bg-purple-600/25 border border-purple-400/40 rounded-3xl p-8 backdrop-blur text-center">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-4">
                Tu afirmación de hoy · {signo}
              </p>
              <p className="text-white text-xl leading-relaxed font-medium">
                "{afirmacionDiaria}"
              </p>
            </div>

            {/* Instrucción */}
            <div className="bg-[#0d0015] border border-white/15 rounded-2xl p-4">
              <p className="text-white/60 text-xs leading-relaxed text-center">
                Di esta afirmación en voz alta 3 veces. Coloca la mano en tu corazón.
                Cierra los ojos. Siente que ya es verdad.
              </p>
            </div>

            {/* Botón practicar */}
            <button
              onClick={() => setVista('practica')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
            >
              Practicar esta afirmación
            </button>

            {/* Error */}
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-400/30 rounded-2xl p-4">
                <p className="text-red-300 text-sm text-center">{errorMsg}</p>
                {!userPlan.esPremium && (
                  <button
                    onClick={() => navigate('/premium')}
                    className="mt-3 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold py-2 rounded-full"
                  >
                    Hazte Premium
                  </button>
                )}
              </div>
            )}

            {/* Botón IA / resultado */}
            {!interpretacion ? (
              <button
                onClick={generarAfirmacion}
                disabled={cargando || userPlan.cargando}
                className="w-full bg-[#0d0015] border border-white/15 text-white font-semibold py-4 rounded-full hover:bg-white/10 transition disabled:opacity-40"
              >
                {cargando
                  ? 'Generando...'
                  : userPlan.esPremium
                    ? '✨ Generar afirmaciones con IA'
                    : `✨ Generar con IA (${userPlan.consultasRestantes} restantes)`}
              </button>
            ) : (
              <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <p className="text-purple-300 text-xs tracking-widest uppercase">
                    Tus afirmaciones personalizadas
                  </p>
                  {fromCache && (
                    <span className="text-green-400 text-xs">⚡ Instantáneo</span>
                  )}
                </div>

                {interpretacion
                  .split('\n')
                  .filter(l => l.trim())
                  .map((linea, i) => (
                    <div
                      key={i}
                      className="bg-purple-600/15 border border-purple-400/20 rounded-2xl p-4"
                    >
                      <p className="text-white text-sm leading-relaxed italic">
                        "{linea.trim()}"
                      </p>
                    </div>
                  ))}

                {/* Valoración */}
                <Valoracion onValorar={handleValorar} />

                {/* Disclaimer IA */}
                <DisclaimerIA />
              </div>
            )}

            {/* Compartir */}
            {interpretacion && (
              <Compartir
                titulo={`Mi afirmación de hoy: ${signo}`}
                texto={`"${afirmacionDiaria}"\n\n${interpretacion}`}
                hashtags={['Afirmaciones', 'Universe', signo, 'Manifestacion']}
              />
            )}
          </div>
        )}

        {/* ── Vista TEMÁTICA ─────────────────────────────── */}
        {vista === 'tematica' && (
          <div className="flex flex-col gap-5">

            {/* Selector de temas */}
            <div className="grid grid-cols-3 gap-2">
              {TEMAS.map(tema => (
                <button
                  key={tema.id}
                  onClick={() => setTemaActivo(tema.id)}
                  className={`rounded-2xl p-3 flex flex-col items-center gap-1 transition border ${
                    temaActivo === tema.id
                      ? 'bg-purple-600/40 border-purple-400'
                      : 'bg-[#0d0015] border-white/15'
                  }`}
                >
                  <span className="text-xl">{tema.icono}</span>
                  <span className="text-xs text-white">{tema.label}</span>
                </button>
              ))}
            </div>

            {/* Afirmación del tema */}
            <div className="bg-purple-600/25 border border-purple-400/40 rounded-3xl p-8 backdrop-blur text-center">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-4">
                {TEMAS.find(t => t.id === temaActivo)?.icono}{' '}
                {TEMAS.find(t => t.id === temaActivo)?.label}
              </p>
              <p className="text-white text-xl leading-relaxed font-medium">
                "{afirmacionTema}"
              </p>
            </div>

            <p className="text-white/60 text-xs tracking-widest uppercase">
              Todas las afirmaciones
            </p>

            {AFIRMACIONES_TEMATICAS[temaActivo].map((af, i) => (
              <div
                key={i}
                className="bg-[#0d0015] border border-white/15 rounded-2xl p-4"
              >
                <p className="text-white/80 text-sm italic">"{af}"</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Vista PRÁCTICA ─────────────────────────────── */}
        {vista === 'practica' && (
          <div className="flex flex-col gap-6 items-center">

            <div className="text-center">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-4">
                Modo práctica
              </p>
              <p className="text-white/60 text-sm">
                Lee la afirmación en voz alta. Toca el botón cada vez que la repitas.
              </p>
            </div>

            {/* Afirmación activa */}
            <div className="bg-purple-600/25 border border-purple-400/40 rounded-3xl p-8 backdrop-blur text-center w-full">
              <p className="text-white text-lg leading-relaxed font-medium">
                "{afirmacionPersonal || afirmacionDiaria}"
              </p>
            </div>

            {/* Contador */}
            <div className="text-center">
              <p className="text-8xl font-bold text-purple-300">{repeticiones}</p>
              <p className="text-white/40 text-sm">repeticiones</p>
              {repeticiones >= 3 && (
                <p className="text-green-400 text-sm mt-2">✓ Práctica completada</p>
              )}
              {repeticiones >= 7 && (
                <p className="text-purple-300 text-sm">✦ Nivel profundo</p>
              )}
            </div>

            {/* Botón repetir */}
            <button
              onClick={() => setRepeticiones(r => r + 1)}
              className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-full hover:opacity-90 transition active:scale-95"
              style={{ boxShadow: '0 0 30px rgba(139,92,246,0.4)' }}
            >
              ✓
            </button>

            {/* Controles */}
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setRepeticiones(0)}
                className="flex-1 bg-[#0d0015] border border-white/15 text-white/60 text-sm py-3 rounded-full"
              >
                Reiniciar
              </button>
              <button
                onClick={() => { setVista('diaria'); setRepeticiones(0) }}
                className="flex-1 bg-[#0d0015] border border-white/15 text-white/60 text-sm py-3 rounded-full"
              >
                Volver
              </button>
            </div>

            {/* Afirmación personalizada */}
            <div className="w-full bg-[#0d0015] border border-white/15 rounded-3xl p-5">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">
                Escribe la tuya
              </p>
              <textarea
                value={afirmacionPersonal}
                onChange={e => setAfirmacionPersonal(e.target.value)}
                placeholder="Escribe una afirmación personal..."
                rows={2}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
