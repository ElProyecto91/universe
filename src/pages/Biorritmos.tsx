import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserPlan } from '../hooks/useUserPlan'
import { useAnalytics } from '../hooks/useAnalytics'
import { calcularBiorritmos, getLecturaBiorritmos } from '../lib/motores/biorhythm'
import Compartir from '../components/Compartir'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import CtaUpsell from '../components/CtaUpsell'
import PageLayout from '../components/PageLayout'

const HERRAMIENTA = 'biorritmos'

const ETIQUETAS: Record<string, string> = {
  alta:     'Alta energía ↑',
  ascenso:  'En ascenso ↗',
  descenso: 'En descenso ↘',
  baja:     'Momento de pausa ↓',
}

const COLORES: Record<string, string> = {
  alta:     'text-green-400',
  ascenso:  'text-blue-400',
  descenso: 'text-amber-400',
  baja:     'text-red-400',
}

export default function Biorritmos() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [mostrar,    setMostrar]    = useState(false)
  const [yaValorado, setYaValorado] = useState(false)

  const signo           = localStorage.getItem('signo')           || 'Leo'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const hoy             = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  const { fases, valores } = calcularBiorritmos(fechaNacimiento)
  const lectura            = getLecturaBiorritmos(fechaNacimiento)

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
    `Biorritmos · ${signo} · ${hoy}`,
    '',
    `🏃 Físico (${valores.fisico > 0 ? '+' : ''}${valores.fisico}%): ${lectura.fisico}`,
    '',
    `❤️ Emocional (${valores.emocional > 0 ? '+' : ''}${valores.emocional}%): ${lectura.emocional}`,
    '',
    `🧠 Intelectual (${valores.intelectual > 0 ? '+' : ''}${valores.intelectual}%): ${lectura.intelectual}`,
    '',
    `✨ Consejo: ${lectura.consejo}`,
  ].join('\n')

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">

        <div className="flex items-center">
          <button onClick={() => navigate('/tradiciones')} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Biorritmos</p>
            <p className="text-purple-300 text-xs capitalize">{hoy}</p>
          </div>
        </div>

        {/* Indicadores visuales */}
        <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5 flex flex-col gap-4">
          {[
            { label: '🏃 Físico',      fase: fases.fisico,      valor: valores.fisico },
            { label: '❤️ Emocional',   fase: fases.emocional,   valor: valores.emocional },
            { label: '🧠 Intelectual', fase: fases.intelectual, valor: valores.intelectual },
          ].map(({ label, fase, valor }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-white/70 text-xs">{label}</p>
                <p className={`text-xs font-semibold ${COLORES[fase]}`}>{ETIQUETAS[fase]}</p>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    valor >= 0 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-white/20'
                  }`}
                  style={{
                    width: `${Math.abs(valor)}%`,
                    marginLeft: valor < 0 ? `${100 - Math.abs(valor)}%` : '0',
                  }}
                />
              </div>
              <p className="text-white/40 text-xs mt-1 text-right">{valor > 0 ? '+' : ''}{valor}%</p>
            </div>
          ))}
        </div>

        {!mostrar ? (
          <div className="flex flex-col gap-3">
            <DisclaimerIA compact />
            <button
              onClick={handleGenerar}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
            >
              Ver mi lectura de hoy
            </button>
          </div>
        ) : (
          <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5 flex flex-col gap-4">
            <div>
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-2">🏃 Ciclo Físico</p>
              <p className="text-white/80 text-sm leading-relaxed">{lectura.fisico}</p>
            </div>
            <div className="border-t border-white/10 pt-4">
              <p className="text-red-300 text-xs tracking-widest uppercase mb-2">❤️ Ciclo Emocional</p>
              <p className="text-white/80 text-sm leading-relaxed">{lectura.emocional}</p>
            </div>
            <div className="border-t border-white/10 pt-4">
              <p className="text-blue-300 text-xs tracking-widest uppercase mb-2">🧠 Ciclo Intelectual</p>
              <p className="text-white/80 text-sm leading-relaxed">{lectura.intelectual}</p>
            </div>
            <div className="border-t border-white/10 pt-4">
              <p className="text-amber-300 text-xs tracking-widest uppercase mb-2">✨ Consejo del día</p>
              <p className="text-white/80 text-sm leading-relaxed">{lectura.consejo}</p>
            </div>
          </div>
        )}

        {mostrar && (
          <>
            <DisclaimerIA />
            <Valoracion onValorar={handleValorar} />
            <Compartir titulo="Biorritmos" texto={textoCompartir} hashtags={['Universe', 'Biorritmos']} />
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