import { useState } from 'react'
import { generarOmikuji, NIVELES_SUERTE } from '../lib/motores/omikuji'

export default function Omikuji() {
  const [revelado, setRevelado] = useState(false)
  const omikuji = generarOmikuji(localStorage.getItem('nombre') || undefined)
  const nivel = NIVELES_SUERTE[omikuji.nivel]

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const hoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center px-6 py-10 gap-6">

        {/* Header */}
        <div className="w-full flex items-center">
          <button onClick={() => window.location.href = '/tradiciones'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Omikuji · おみくじ</p>
            <p className="text-purple-300 text-xs">Fortuna del día · Tradición japonesa</p>
          </div>
        </div>

        <p className="text-white/40 text-xs tracking-wide capitalize">{hoy}</p>

        {!revelado ? (
          <div className="flex flex-col items-center gap-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur text-center">
              <p className="text-white/60 text-sm leading-relaxed">
                En los santuarios y templos japoneses, el Omikuji es una fortuna que se extrae al azar. Cada día trae un mensaje diferente del universo.
              </p>
            </div>

            <div
              className="w-20 h-48 bg-gradient-to-b from-amber-100/20 to-amber-50/10 border border-amber-300/30 rounded-lg flex items-center justify-center cursor-pointer hover:border-amber-300/60 transition backdrop-blur"
              onClick={() => setRevelado(true)}
            >
              <div className="flex flex-col items-center gap-2">
                <p className="text-amber-300 text-xl" style={{ writingMode: 'vertical-rl', fontFamily: 'serif', letterSpacing: '0.3em' }}>おみくじ</p>
              </div>
            </div>

            <button
              onClick={() => setRevelado(true)}
              className="bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold py-4 px-10 rounded-full hover:opacity-90 transition"
            >
              Extraer mi fortuna
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5 w-full">

            {/* Nivel de fortuna */}
            <div className="text-center">
              <p className="text-white/40 text-xs tracking-widest uppercase mb-2">{omikuji.nivel}</p>
              <h2 className="text-3xl font-bold mb-1" style={{ color: nivel.color, textShadow: `0 0 20px ${nivel.color}60` }}>
                {nivel.español}
              </h2>
              <p className="text-white/60 text-sm">{nivel.descripcion}</p>
            </div>

            {/* Fortuna detallada */}
            <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur flex flex-col gap-4">
              {[
                { label: 'Amor', icono: '縁', valor: omikuji.amor },
                { label: 'Trabajo', icono: '仕', valor: omikuji.trabajo },
                { label: 'Salud', icono: '健', valor: omikuji.salud },
                { label: 'Consejo', icono: '道', valor: omikuji.consejo },
              ].map(item => (
                <div key={item.label} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-purple-300 text-sm" style={{ fontFamily: 'serif' }}>{item.icono}</span>
                    <p className="text-purple-300 text-xs tracking-widest uppercase">{item.label}</p>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">{item.valor}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur w-full text-center">
              <p className="text-white/30 text-xs">Tu Omikuji cambia cada día. Vuelve mañana para un nuevo mensaje.</p>
            </div>

            <button onClick={() => window.location.href = '/guia'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
              Explorar con mi Guía IA
            </button>
          </div>
        )}
      </div>
    </div>
  )
}