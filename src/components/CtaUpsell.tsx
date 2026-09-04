// src/components/CtaUpsell.tsx
interface CtaUpsellProps {
  consultasRestantes?: number
}

export default function CtaUpsell({ consultasRestantes = 0 }: CtaUpsellProps) {
  if (consultasRestantes > 2) return null

  return (
    <div className="bg-purple-600/15 border border-purple-400/30 rounded-2xl p-4 backdrop-blur">
      <div className="flex items-start gap-3">
        <span className="text-2xl">✨</span>
        <div className="flex-1">
          {consultasRestantes === 0 ? (
            <>
              <p className="text-white font-semibold text-sm">Has agotado tus consultas de hoy</p>
              <p className="text-white/60 text-xs mt-1">Hazte Premium para consultas ilimitadas y acceso a las 55+ herramientas.</p>
            </>
          ) : (
            <>
              <p className="text-white font-semibold text-sm">{consultasRestantes === 1 ? 'Te queda 1 consulta' : `Te quedan ${consultasRestantes} consultas`} hoy</p>
              <p className="text-white/60 text-xs mt-1">Premium incluye consultas ilimitadas, memoria y mucho más.</p>
            </>
          )}
          <button onClick={() => window.location.href = '/premium'} className="mt-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold px-4 py-2 rounded-full">
            Ver planes Premium →
          </button>
        </div>
      </div>
    </div>
  )
}
