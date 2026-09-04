// src/components/Paywall.tsx
interface PaywallProps {
  motivo?: 'herramienta' | 'limite' | 'general'
  herramienta?: string
  onCerrar?: () => void
}

export default function Paywall({ motivo = 'general', herramienta, onCerrar }: PaywallProps) {
  const bgStyle = { backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }
  const mensajes = {
    herramienta: { titulo: '✨ Herramienta Premium', subtitulo: herramienta ? `${herramienta} está disponible en el plan Premium` : 'Esta herramienta está disponible en el plan Premium' },
    limite: { titulo: '🌙 Has agotado tus consultas de hoy', subtitulo: 'El plan gratuito incluye 5 consultas diarias. Hazte Premium para consultas ilimitadas.' },
    general: { titulo: '✨ Desbloquea UNIVERSE completo', subtitulo: 'Accede a las 55+ herramientas, memoria persistente, informes y mucho más.' },
  }
  const { titulo, subtitulo } = mensajes[motivo]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
      <div className="w-full max-w-sm rounded-t-3xl overflow-hidden" style={bgStyle}>
        <div className="bg-black/80 p-6 flex flex-col gap-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-white font-bold text-xl leading-snug">{titulo}</p>
              <p className="text-white/60 text-sm mt-1 leading-relaxed">{subtitulo}</p>
            </div>
            {onCerrar && <button onClick={onCerrar} className="text-white/30 text-2xl ml-4 leading-none">✕</button>}
          </div>
          <div className="flex flex-col gap-2">
            {['55+ herramientas espirituales desbloqueadas','Consultas ilimitadas con IA','Memoria persistente entre sesiones','Carta natal completa + tránsitos','Diario espiritual con IA','Informes semanales y mensuales personalizados'].map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-purple-400 text-sm">✓</span>
                <p className="text-white/80 text-sm">{b}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => window.location.href = '/premium?plan=monthly'} className="bg-white/10 border border-white/20 rounded-2xl p-4 text-center hover:bg-white/20 transition">
              <p className="text-white font-bold text-xl">€6,99</p>
              <p className="text-white/50 text-xs">por mes</p>
            </button>
            <button onClick={() => window.location.href = '/premium?plan=yearly'} className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 text-center relative">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">Ahorra 40%</div>
              <p className="text-white font-bold text-xl">€4,17</p>
              <p className="text-white/80 text-xs">al mes · €49,99/año</p>
            </button>
          </div>
          <button onClick={() => window.location.href = '/premium'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-full text-lg" style={{ boxShadow: '0 0 20px rgba(139,92,246,0.4)' }}>
            Hacerme Premium
          </button>
          <p className="text-white/25 text-xs text-center">Cancela cuando quieras. Sin permanencia. Pago seguro con Stripe.</p>
        </div>
      </div>
    </div>
  )
}
