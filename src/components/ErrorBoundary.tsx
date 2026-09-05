// src/components/ErrorBoundary.tsx
// ============================================================
// UNIVERSE — Error Boundary global
// Captura errores de React y muestra pantalla bonita
// ============================================================

import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[UNIVERSE] Error capturado:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen text-white flex flex-col items-center justify-center px-6 text-center relative"
          style={{
            backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/80" />
          <div className="relative z-10 flex flex-col items-center gap-5 max-w-sm">
            <p className="text-6xl">🌌</p>
            <div>
              <p className="text-white font-bold text-xl mb-2">Algo salió mal</p>
              <p className="text-white/60 text-sm leading-relaxed">
                Las estrellas se han desalineado momentáneamente. No es tu culpa — vuelve al inicio e inténtalo de nuevo.
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/universo'}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-full"
            >
              Volver al inicio
            </button>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="text-white/40 text-sm"
            >
              Intentar de nuevo
            </button>
            {import.meta.env.DEV && this.state.error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-left w-full">
                <p className="text-red-400 text-xs font-mono break-all">{this.state.error.message}</p>
              </div>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
