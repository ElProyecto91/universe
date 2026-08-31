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

  const loginConGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/universo`,
      },
    })
  }

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center px-6 relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-5">

        <div className="text-center mb-2">
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

        {/* Google */}
        <button
          onClick={loginConGoogle}
          className="w-full bg-white text-gray-800 font-semibold py-4 rounded-full flex items-center justify-center gap-3 hover:bg-gray-100 transition"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuar con Google
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-xs">o con email</span>
          <div className="flex-1 h-px bg-white/10" />
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