import { useState } from 'react'
import { calcularNumeroVida, NUMEROS_VIDA } from '../lib/motores/numerologiaVida'
import Compartir from '../components/Compartir'

export default function Numerologia() {
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [generado, setGenerado] = useState(false)
  const [vistaActiva, setVistaActiva] = useState<'perfil' | 'relaciones' | 'carrera'>('perfil')

  const nombre = localStorage.getItem('nombre') || 'viajero'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const numeroVida = calcularNumeroVida(fechaNacimiento)
  const data = NUMEROS_VIDA[numeroVida] || NUMEROS_VIDA[1]

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const generarLectura = async () => {
    setCargando(true)
    setGenerado(true)

    const prompt = `Eres una experta en numerología pitagórica con décadas de experiencia.

Nombre: ${nombre}
Número de Vida: ${numeroVida} — ${data.titulo}
Propósito: ${data.proposito}
Fortalezas: ${data.fortalezas.join(', ')}
Desafíos: ${data.desafios.join(', ')}

Escribe una lectura numerológica profunda y personal de 4 párrafos para ${nombre}.
Primero describe la energía esencial del ${numeroVida} y cómo se manifiesta en alguien como ${nombre}.
Luego explora sus fortalezas naturales — cómo puede potenciarlas.
Después trabaja sus desafíos — no como defectos sino como áreas de crecimiento.
Termina con el propósito de vida específico de ${nombre} como número ${numeroVida} — qué ha venido a hacer en este mundo.
Sé profundo, poético y específico. No seas genérico.`

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
          }),
        }
      )
      const data2 = await res.json()
      setInterpretacion(data2.candidates?.[0]?.content?.parts?.[0]?.text || '')
    } catch {
      setInterpretacion('Los números guardan silencio. Inténtalo de nuevo.')
    }
    setCargando(false)
  }

  const esNumerMaestro = [11, 22, 33].includes(numeroVida)

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => window.location.href = '/tradiciones'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Numerología</p>
            <p className="text-purple-300 text-xs">Tradición pitagórica</p>
          </div>
        </div>

        {/* Número de vida */}
        <div className={`rounded-3xl p-8 backdrop-blur flex flex-col items-center gap-3 ${esNumerMaestro ? 'bg-gradient-to-br from-purple-600/30 to-pink-600/20 border border-purple-400/50' : 'bg-white/8 border border-white/20'}`}
          style={!esNumerMaestro ? { backgroundColor: 'rgba(255,255,255,0.08)' } : {}}>
          {esNumerMaestro && <p className="text-purple-300 text-xs tracking-widest uppercase">✦ Número Maestro ✦</p>}
          <p className="text-9xl font-light" style={{ textShadow: '0 0 40px rgba(192,132,252,0.6)', color: '#c084fc' }}>
            {numeroVida}
          </p>
          <p className="text-2xl font-bold text-center">{data.titulo}</p>
          <p className="text-white/60 text-sm text-center">{data.fortalezas.join(' · ')}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/10 rounded-2xl p-1">
          {[
            { id: 'perfil', label: 'Perfil' },
            { id: 'relaciones', label: 'Relaciones' },
            { id: 'carrera', label: 'Carrera' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setVistaActiva(tab.id as any)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${vistaActiva === tab.id ? 'bg-purple-600 text-white' : 'text-white/50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {vistaActiva === 'perfil' && (
          <div className="flex flex-col gap-4">
            <div className="bg-white/8 border border-white/20 rounded-3xl p-5 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-white/80 text-sm leading-relaxed">{data.descripcion}</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <p className="text-green-400 text-xs tracking-widest uppercase mb-2">Fortalezas</p>
                <div className="flex flex-wrap gap-2">
                  {data.fortalezas.map(f => (
                    <span key={f} className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">{f}</span>
                  ))}
                </div>
              </div>
              <div className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <p className="text-amber-400 text-xs tracking-widest uppercase mb-2">Desafíos a trabajar</p>
                <div className="flex flex-wrap gap-2">
                  {data.desafios.map(d => (
                    <span key={d} className="bg-amber-500/20 text-amber-300 text-xs px-2 py-1 rounded-full">{d}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-purple-600/20 border border-purple-400/30 rounded-2xl p-4 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Tu propósito de vida</p>
              <p className="text-white text-sm leading-relaxed">{data.proposito}</p>
            </div>

            <div className="bg-white/8 border border-white/20 rounded-2xl p-4 backdrop-blur"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-white/40 text-xs tracking-widest uppercase mb-2">Comparten tu número</p>
              <p className="text-white/70 text-sm">{data.famosos.join(' · ')}</p>
            </div>
          </div>
        )}

        {vistaActiva === 'relaciones' && (
          <div className="bg-white/8 border border-white/20 rounded-3xl p-5 backdrop-blur"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
            <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">❤️ Amor y Relaciones</p>
            <p className="text-white/80 text-sm leading-relaxed">{data.relaciones}</p>
          </div>
        )}

        {vistaActiva === 'carrera' && (
          <div className="bg-white/8 border border-white/20 rounded-3xl p-5 backdrop-blur"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
            <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">💼 Trabajo y Vocación</p>
            <p className="text-white/80 text-sm leading-relaxed">{data.carrera}</p>
          </div>
        )}

        {/* Afirmación */}
        <div className="bg-purple-600/15 border border-purple-400/20 rounded-2xl p-4 backdrop-blur">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Tu afirmación</p>
          <p className="text-white font-medium text-sm italic">"{data.afirmacion}"</p>
        </div>

        {!generado ? (
          <button
            onClick={generarLectura}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
          >
            Generar mi lectura completa con IA
          </button>
        ) : (
          <div className="bg-white/8 border border-white/20 rounded-3xl p-6 backdrop-blur"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
            <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu lectura numerológica</p>
            {cargando ? (
              <div className="flex gap-2 py-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{interpretacion}</p>
            )}
          </div>
        )}

        {!cargando && interpretacion && (
          <Compartir
            titulo={`Mi Número de Vida: ${numeroVida} — ${data.titulo}`}
            texto={interpretacion}
            hashtags={['Numerologia', 'Universe', `Numero${numeroVida}`, 'NumerologiaVida']}
          />
        )}

        <button onClick={() => window.location.href = '/guia'} className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full">
          Explorar con mi Guía IA
        </button>

      </div>
    </div>
  )
}