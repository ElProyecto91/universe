import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [modo, setModo] = useState<'login' | 'registro'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const handleAuth = async () => {
    if (!email || !password) return
    setCargando(true)
    setMensaje('')

    if (modo === 'registro') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMensaje('Error: ' + error.message)
      } else {
        setMensaje('Revisa tu email para confirmar tu cuenta.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMensaje('Email o contraseña incorrectos.')
      } else {
        window.location.href = '/universo'
      }
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center px-6 relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-6">

        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold mb-2" style={{
            background: 'linear-gradient(to right, #c084fc, #f9a8d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            UNIVERSE
          </h1>
          <p className="text-white/50 text-sm">
            {modo === 'login' ? 'Accede a tu universo' : 'Crea tu universo'}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur flex flex-col gap-4">

          <div className="flex gap-2 bg-white/5 rounded-2xl p-1">
            <button
              onClick={() => setModo('login')}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${modo === 'login' ? 'bg-purple-600 text-white' : 'text-white/50'}`}
            >
              Entrar
            </button>
            <button
              onClick={() => setModo('registro')}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${modo === 'registro' ? 'bg-purple-600 text-white' : 'text-white/50'}`}
            >
              Registrarse
            </button>
          </div>

          <input
            type="email"
            placeholder="Tu email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-white/30 outline-none focus:border-purple-400 text-sm"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAuth() }}
            className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-white/30 outline-none focus:border-purple-400 text-sm"
          />

          {mensaje && (
            <p className="text-purple-300 text-xs text-center">{mensaje}</p>
          )}

          <button
            onClick={handleAuth}
            disabled={cargando || !email || !password}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
          >
            {cargando ? 'Cargando...' : modo === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>

        </div>

        <button
          onClick={() => window.location.href = '/onboarding'}
          className="text-white/30 text-xs text-center"
        >
          Continuar sin cuenta →
        </button>

      </div>
    </div>
  )
}