// src/pages/Afirmaciones.tsx
// ============================================================
// UNIVERSE — Afirmaciones
// Usa PageLayout — fondo y overlay gestionados globalmente
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
import PageLayout from '../components/PageLayout'

const HERRAMIENTA = 'afirmaciones'

const TEMAS = [
  { id: 'amor',       label: 'Amor',       icono: '❤️' },
  { id: 'abundancia', label: 'Abundancia', icono: '💰' },
  { id: 'salud',      label: 'Salud',      icono: '🌿' },
  { id: 'proposito',  label: 'Propósito',  icono: '✨' },
  { id: 'paz',        label: 'Paz',        icono: '☮️' },
] as const

type TemaId = typeof TEMAS[number]['id']
type Vista  = 'diaria' | 'tematica' | 'practica'

function DisclaimerIA() {
  return (
    <p className="text-white/40 text-xs text-center leading-relaxed px-2">
      Contenido generado por IA con fines de reflexión y entretenimiento.
      No sustituye asesoramiento profesional.
    </p>
  )
}

export default function Afirmaciones() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [vista,              setVista]              = useState<Vista>('diaria')
  const [temaActivo,         setTemaActivo]         = useState<TemaId>('amor')
  const [afirmacionPersonal, setAfirmacionPersonal] = useState('')
  const [repeticiones,       setRepeticiones]       = useState(0)
  const [interpretacion,     setInterpretacion]     = useState('')
  const [cargando,           setCargando]           = useState(false)
  const [fromCache,          setFromCache]          = useState(false)
  const [yaValorado,         setYaValorado]         = useState(false)
  const [errorMsg,           setErrorMsg]           = useState('')
  const lecturaGuardadaRef                          = useRef(false)

  const nombre          = localStorage.getItem('nombre')          || 'viajero'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const signo           = getSignoSolar(fechaNacimiento)
  const afirmacionDiaria = getAfirmacionDelDia(signo)
  const afirmacionTema   = getAfirmacionTematica(temaActivo)
  const hoy     = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
  const fechaHoy = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (!userPlan.cargando) analytics.registrarApertura()
  }, [userPlan.cargando])

  const generarAfirmacion = async () => {
    if (userPlan.cargando) return
    if (!userPlan.puedeConsultar) { analytics.registrarPaywall(); navigate('/premium'); return }
    if (!userPlan.esPremium && userPlan.consultasRestantes <= 0) {
      analytics.registrarLimite()
      setErrorMsg(`Has alcanzado tu límite diario de ${userPlan.limiteConsultasDia} consultas gratuitas.`)
      return
    }

    setCargando(true)
    setErrorMsg('')
    const t0 = Date.now()

    try {
      const { data: cached } = await supabase
        .from('horoscopo_cache').select('contenido')
        .eq('signo', signo.toLowerCase()).eq('fecha', fechaHoy).eq('tipo', 'afirmaciones')
        .maybeSingle()

      if (cached?.contenido) {
        setInterpretacion(cached.contenido)
        setFromCache(true)
        analytics.registrarLectura({ desdCache: true, tiempoMs: Date.now() - t0 })
        await _guardarSiPrimera(cached.contenido)
        setCargando(false)
        return
      }

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
        supabase.from('horoscopo_cache').insert({
          signo: signo.toLowerCase(), fecha: fechaHoy, tipo: 'afirmaciones',
          contenido: result.texto, tokens_used: result.tokensUsados,
        }).then(() => {})
        if (userPlan.userId) await incrementarConsulta(userPlan.userId)
        analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: 'lite' })
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

  const handleValorar = (valor: 1 | -1) => {
    if (yaValorado) return
    setYaValorado(true)
    analytics.registrarValoracion(valor)
  }

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center">
          <button onClick={() => navigate('/universo')} className="text-purple-300 text-sm">
            ← Volver
          </button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Afirmaciones</p>
            <p className="text-purple-300 text-xs capitalize">{hoy}</p>
          </div>
          {!userPlan.cargando && !userPlan.esPremium && (
            <p className="text-white/40 text-xs">
              {userPlan.consultasRestantes}/{userPlan.limiteConsultasDia}
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/8 border border-white/10 rounded-2xl p-1">
          {(['diaria', 'tematica', 'practica'] as Vista[]).map((id) => (
            <button
              key={id}
              onClick={() => setVista(id)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
                vista === id ? 'bg-purple-600 text-white' : 'text-white/50 hover:text-white/70'
              }`}
            >
              {id === 'diaria' ? 'Diaria' : id === 'tematica' ? 'Temática' : 'Práctica'}
            </button>
          ))}
        </div>

        {/* ── DIARIA ─────────────────────────────────────── */}
        {vista === 'diaria' && (
          <div className="flex flex-col gap-4">

            <div className="bg-[#0d0015] border border-purple-500/50 rounded-3xl p-7 text-center">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-4">
                Tu afirmación de hoy · {signo}
              </p>
              <p className="text-white text-lg leading-relaxed font-semibold">
                "{afirmacionDiaria}"
              </p>
            </div>

            <div className="bg-[#0d0015] border border-white/15 rounded-2xl p-4">
              <p className="text-white/70 text-sm leading-relaxed text-center">
                Di esta afirmación en voz alta 3 veces. Coloca la mano en tu corazón.
                Cierra los ojos. Siente que ya es verdad.
              </p>
            </div>

            <button
              onClick={() => setVista('practica')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
            >
              Practicar esta afirmación
            </button>

            {errorMsg && (
              <div className="bg-[#0d0015] border border-red-400/50 rounded-2xl p-4">
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

            {!interpretacion ? (
              <button
                onClick={generarAfirmacion}
                disabled={cargando || userPlan.cargando}
                className="w-full bg-[#0d0015] border border-white/20 text-white font-semibold py-4 rounded-full hover:border-purple-500/50 transition disabled:opacity-40"
              >
                {cargando
                  ? 'Generando...'
                  : userPlan.esPremium
                    ? '✨ Generar afirmaciones con IA'
                    : `✨ Generar con IA (${userPlan.consultasRestantes} restantes)`}
              </button>
            ) : (
              <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-purple-400 text-xs tracking-widest uppercase">
                    Afirmaciones personalizadas
                  </p>
                  {fromCache && <span className="text-green-400 text-xs">⚡ Instantáneo</span>}
                </div>
                {interpretacion.split('\n').filter(l => l.trim()).map((linea, i) => (
                  <div key={i} className="bg-[#150020] border border-purple-500/30 rounded-2xl p-4">
                    <p className="text-white text-sm leading-relaxed italic">"{linea.trim()}"</p>
                  </div>
                ))}
                <Valoracion onValorar={handleValorar} />
                <DisclaimerIA />
              </div>
            )}

            {interpretacion && (
              <Compartir
                titulo={`Mi afirmación de hoy: ${signo}`}
                texto={`"${afirmacionDiaria}"\n\n${interpretacion}`}
                hashtags={['Afirmaciones', 'Universe', signo, 'Manifestacion']}
              />
            )}
          </div>
        )}

        {/* ── TEMÁTICA ───────────────────────────────────── */}
        {vista === 'tematica' && (
          <div className="flex flex-col gap-4">

            <div className="grid grid-cols-3 gap-2">
              {TEMAS.map(tema => (
                <button
                  key={tema.id}
                  onClick={() => setTemaActivo(tema.id)}
                  className={`rounded-2xl p-3 flex flex-col items-center gap-2 transition border ${
                    temaActivo === tema.id
                      ? 'bg-[#1a0030] border-purple-500/70'
                      : 'bg-[#0d0015] border-white/15 hover:border-white/30'
                  }`}
                >
                  <span className="text-2xl">{tema.icono}</span>
                  <span className="text-xs text-white font-medium">{tema.label}</span>
                </button>
              ))}
            </div>

            <div className="bg-[#0d0015] border border-purple-500/50 rounded-3xl p-7 text-center">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-4">
                {TEMAS.find(t => t.id === temaActivo)?.icono}{' '}
                {TEMAS.find(t => t.id === temaActivo)?.label}
              </p>
              <p className="text-white text-lg leading-relaxed font-semibold">
                "{afirmacionTema}"
              </p>
            </div>

            <p className="text-white/50 text-xs tracking-widest uppercase">
              Todas las afirmaciones
            </p>

            {AFIRMACIONES_TEMATICAS[temaActivo].map((af, i) => (
              <div key={i} className="bg-[#0d0015] border border-white/15 rounded-2xl p-4">
                <p className="text-white text-sm leading-relaxed italic">"{af}"</p>
              </div>
            ))}
          </div>
        )}

        {/* ── PRÁCTICA ───────────────────────────────────── */}
        {vista === 'practica' && (
          <div className="flex flex-col gap-6 items-center">

            <div className="text-center">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">
                Modo práctica
              </p>
              <p className="text-white/70 text-sm">
                Lee la afirmación en voz alta. Toca el botón cada vez que la repitas.
              </p>
            </div>

            <div className="bg-[#0d0015] border border-purple-500/50 rounded-3xl p-7 text-center w-full">
              <p className="text-white text-lg leading-relaxed font-semibold">
                "{afirmacionPersonal || afirmacionDiaria}"
              </p>
            </div>

            <div className="text-center">
              <p className="text-8xl font-bold text-purple-300">{repeticiones}</p>
              <p className="text-white/50 text-sm mt-1">repeticiones</p>
              {repeticiones >= 3 && (
                <p className="text-green-400 text-sm mt-2">✓ Práctica completada</p>
              )}
              {repeticiones >= 7 && (
                <p className="text-purple-300 text-sm mt-1">✦ Nivel profundo</p>
              )}
            </div>

            <button
              onClick={() => setRepeticiones(r => r + 1)}
              className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-2xl rounded-full hover:opacity-90 transition active:scale-95"
            >
              ✓
            </button>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => setRepeticiones(0)}
                className="flex-1 bg-[#0d0015] border border-white/15 text-white text-sm py-3 rounded-full hover:border-white/30 transition"
              >
                Reiniciar
              </button>
              <button
                onClick={() => { setVista('diaria'); setRepeticiones(0) }}
                className="flex-1 bg-[#0d0015] border border-white/15 text-white text-sm py-3 rounded-full hover:border-white/30 transition"
              >
                Volver
              </button>
            </div>

            <div className="w-full bg-[#0d0015] border border-white/15 rounded-3xl p-5">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">
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
    </PageLayout>
  )
}
