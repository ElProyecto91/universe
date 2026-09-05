// src/components/CookieBanner.tsx
// ============================================================
// UNIVERSE — Banner de cookies (obligatorio LSSI + RGPD)
// Aparece en el primer acceso, registra consentimiento
// ============================================================

import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [mostrarDetalle, setMostrarDetalle] = useState(false)

  useEffect(() => {
    const consentimiento = localStorage.getItem('cookies_consentimiento')
    if (!consentimiento) setVisible(true)
  }, [])

  const aceptar = () => {
    localStorage.setItem('cookies_consentimiento', JSON.stringify({
      fecha: new Date().toISOString(),
      tecnicas: true,
      analiticas: true,
      version: '1.0',
    }))
    setVisible(false)
  }

  const soloNecesarias = () => {
    localStorage.setItem('cookies_consentimiento', JSON.stringify({
      fecha: new Date().toISOString(),
      tecnicas: true,
      analiticas: false,
      version: '1.0',
    }))
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
      <div
        className="w-full max-w-sm pointer-events-auto"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.98), rgba(10,0,20,0.97))',
          borderTop: '1px solid rgba(167,139,250,0.2)',
        }}
      >
        <div className="px-5 py-5 flex flex-col gap-4">

          {/* Texto principal */}
          <div>
            <p className="text-white font-semibold text-sm mb-1">🍪 Cookies y privacidad</p>
            <p className="text-white/60 text-xs leading-relaxed">
              Usamos cookies técnicas necesarias para que la app funcione y cookies analíticas para mejorar el servicio. No usamos publicidad ni rastreamos tu identidad.{' '}
              <button
                onClick={() => setMostrarDetalle(!mostrarDetalle)}
                className="text-purple-400 underline"
              >
                {mostrarDetalle ? 'Ocultar detalle' : 'Ver detalle'}
              </button>
            </p>
          </div>

          {/* Detalle expandible */}
          {mostrarDetalle && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-white text-xs font-semibold">Cookies técnicas</p>
                  <p className="text-white/50 text-xs">Sesión de usuario, preferencias. Necesarias para usar la app. No se pueden desactivar.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-white text-xs font-semibold">Cookies analíticas</p>
                  <p className="text-white/50 text-xs">Qué herramientas usas, a qué hora, desde qué dispositivo. Datos anónimos para mejorar UNIVERSE. Puedes rechazarlas.</p>
                </div>
              </div>
              <button
                onClick={() => window.open('/legal', '_blank')}
                className="text-purple-400 text-xs underline text-left"
              >
                Leer política de cookies completa →
              </button>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={soloNecesarias}
              className="flex-1 bg-white/10 border border-white/20 text-white/70 text-sm font-semibold py-3 rounded-full hover:bg-white/20 transition"
            >
              Solo necesarias
            </button>
            <button
              onClick={aceptar}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold py-3 rounded-full hover:opacity-90 transition"
            >
              Aceptar todas
            </button>
          </div>

          <p className="text-white/20 text-xs text-center">
            Puedes cambiar tus preferencias en cualquier momento desde tu perfil.
          </p>

        </div>
      </div>
    </div>
  )
}
