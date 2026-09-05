// src/components/PWAInstallPrompt.tsx
// ============================================================
// UNIVERSE — Prompt de instalación PWA
// Aparece una vez, invita a instalar la app en el móvil
// ============================================================

import { useState, useEffect } from 'react'

export default function PWAInstallPrompt() {
  const [prompt, setPrompt] = useState<any>(null)
  const [visible, setVisible] = useState(false)
  const [instalado, setInstalado] = useState(false)

  useEffect(() => {
    // No mostrar si ya se instaló o si el usuario lo rechazó
    const rechazado = localStorage.getItem('pwa_prompt_rechazado')
    if (rechazado) return

    // Detectar si ya está instalado como PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalado(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e)
      // Mostrar el banner tras 30 segundos en la app
      setTimeout(() => setVisible(true), 30000)
    }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setInstalado(true))

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const instalar = async () => {
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') {
      setVisible(false)
      setInstalado(true)
    } else {
      rechazar()
    }
  }

  const rechazar = () => {
    localStorage.setItem('pwa_prompt_rechazado', 'true')
    setVisible(false)
  }

  if (!visible || instalado) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <div
        className="w-full max-w-sm pointer-events-auto mx-4 mb-4 rounded-3xl overflow-hidden"
        style={{ background: 'rgba(10,0,25,0.97)', border: '1px solid rgba(167,139,250,0.3)' }}
      >
        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl flex-shrink-0">
              ✨
            </div>
            <div>
              <p className="text-white font-bold text-sm">Instala UNIVERSE</p>
              <p className="text-white/60 text-xs mt-0.5 leading-relaxed">
                Accede más rápido, funciona offline y recibe notificaciones.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={rechazar}
              className="flex-1 bg-white/10 border border-white/20 text-white/60 text-sm font-semibold py-3 rounded-full"
            >
              Ahora no
            </button>
            <button
              onClick={instalar}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold py-3 rounded-full"
            >
              Instalar app
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
