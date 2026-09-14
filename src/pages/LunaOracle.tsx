// src/pages/LunaOracle.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFaseLunar } from '../lib/motores/luna'
import { useUserPlan } from '../hooks/useUserPlan'
import { useAnalytics } from '../hooks/useAnalytics'
import Compartir from '../components/Compartir'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import CtaUpsell from '../components/CtaUpsell'
import PageLayout from '../components/PageLayout'

const HERRAMIENTA = 'luna-oracle'

export default function LunaOracle() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [mostrar,    setMostrar]    = useState(false)
  const [yaValorado, setYaValorado] = useState(false)

  const signo  = localStorage.getItem('signo') || 'Leo'
  const hoy    = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
  const fase   = getFaseLunar(signo)

  useEffect(() => {
    if (!userPlan.cargando) analytics.registrarApertura()
  }, [userPlan.cargando])

  const handleGenerar = () => {
    analytics.registrarLectura({ desdCache: false, tiempoMs: 0, modeloIa: 'static' })
    setMostrar(true)
  }

  const handleValorar = (valor: 1 | -1) => {
    if (yaValorado) return
    setYaValorado(true)
    analytics.registrarValoracion(valor)
  }

  const textoCompartir = [
    `${fase.simbolo} ${fase.nombre} · ${signo}`,
    '',
    fase.mensaje,
    '',
    `✨ Práctica: ${fase.practica}`,
  ].join('\n')

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">

        <div className="flex items-center">
          <button onClick={() => navigate('/tradiciones')} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Luna Oracle</p>
            <p className="text-purple-300 text-xs capitalize">{hoy}</p>
          </div>
        </div>

        {/* Card fase lunar */}
        <div className="bg-[#0d0015] border border-purple-500/50 rounded-3xl p-6 text-center">
          <p className="text-5xl mb-3">{fase.simbolo}</p>
          <p className="text-white font-bold text-lg">{fase.nombre}</p>
          <p className="text-purple-300 text-xs mt-1">{signo}</p>
          <p className="text-white/40 text-xs mt-2">{fase.energia}</p>
          {fase.diasHastaLunaLlena > 0 && (
            <p className="text-white/30 text-xs mt-1">{fase.diasHastaLunaLlena} días hasta luna llena</p>
          )}
          {/* Barra de iluminación */}
          <div className="mt-4 w-full bg-white/10 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-yellow-300"
              style={{ width: `${fase.porcentajeIluminacion}%` }}
            />
          </div>
          <p className="text-white/30 text-xs mt-1">{fase.porcentajeIluminacion}% iluminación</p>
        </div>

        {!mostrar ? (
          <div className="flex flex-col gap-3">
            <DisclaimerIA compact />
            <button
              onClick={handleGenerar}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
            >
              Mi guía lunar
            </button>
          </div>
        ) : (
          <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5 flex flex-col gap-4">
            <div>
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-2">🌙 Tu guía lunar</p>
              <p className="text-white/80 text-sm leading-relaxed">{fase.mensaje}</p>
            </div>
            <div className="border-t border-white/10 pt-4">
              <p className="text-amber-300 text-xs tracking-widest uppercase mb-2">✨ Práctica del día</p>
              <p className="text-white/80 text-sm leading-relaxed">{fase.practica}</p>
            </div>
          </div>
        )}

        {mostrar && (
          <>
            <DisclaimerIA />
            <Valoracion onValorar={handleValorar} />
            <Compartir
              titulo={`${fase.simbolo} ${fase.nombre} · ${signo}`}
              texto={textoCompartir}
              hashtags={['LunaOracle', 'Universe', signo]}
            />
            <CtaUpsell consultasRestantes={userPlan.consultasRestantes} />
            <button
              onClick={() => navigate('/guia')}
              className="w-full bg-[#0d0015] border border-white/15 text-white font-semibold py-4 rounded-full hover:border-purple-500/50 transition"
            >
              Explorar con mi Guía IA
            </button>
          </>
        )}

      </div>
    </PageLayout>
  )
} 