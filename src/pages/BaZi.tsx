import { calcularBazi, CINCO_ELEMENTOS_DESC } from '../lib/motores/bazi'
import { useState } from 'react'
import Compartir from '../components/Compartir'

export default function BaZi() {
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [generado, setGenerado] = useState(false)

  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const nombre = localStorage.getItem('nombre') || 'viajero'
  const bazi = calcularBazi(fechaNacimiento)

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const generarLectura = async () => {
    setCargando(true)
    setGenerado(true)

    const pilaresTexto = bazi.pilares.map(p =>
      `${p.nombre}: ${p.tallo.nombre} (${p.tallo.elemento}) · ${p.rama.animal} (${p.rama.elemento})`
    ).join('\n')

    const prompt = `Eres un experto en BaZi (Cuatro Pilares del Destino), el antiguo sistema astrológico chino.

Nombre: ${nombre}
Fecha de nacimiento: ${fechaNacimiento}

Sus Cuatro Pilares:
${pilaresTexto}

Day Master: ${bazi.dayMaster.nombre} (${bazi.dayMaster.elemento})
Elemento dominante: ${bazi.elementoDominante}

Escribe una lectura BaZi de 3-4 párrafos. Primero explica el Day Master y lo que revela sobre la personalidad esencial de ${nombre}. Luego habla del balance de los cinco elementos en su carta. Menciona las áreas de vida representadas por cada pilar. Termina con el período actual y qué energías están presentes. Habla directamente a ${nombre}.`

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
      const data = await res.json()
      setInterpretacion(data.candidates?.[0]?.content?.parts?.[0]?.text || '')
    } catch {
      setInterpretacion(CINCO_ELEMENTOS_DESC[bazi.elementoDominante] || '')
    }
    setCargando(false)
  }

  const coloresElemento: Record<string, string> = {
    'Madera': '#22c55e', 'Fuego': '#ef4444', 'Tierra': '#f59e0b', 'Metal': '#94a3b8', 'Agua': '#3b82f6',
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">

        <div className="flex items-center">
          <button onClick={() => window.location.href = '/tradiciones'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">BaZi · 八字</p>
            <p className="text-purple-300 text-xs">Cuatro Pilares del Destino</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
          <p className="text-white/60 text-sm leading-relaxed">
            BaZi utiliza tu fecha de nacimiento para construir cuatro pilares. Juntos revelan tu energía esencial y los ciclos de tu vida.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-5">Tus Cuatro Pilares</p>
          <div className="grid grid-cols-3 gap-3">
            {bazi.pilares.map(pilar => (
              <div key={pilar.nombre} className="flex flex-col items-center gap-2">
                <div className="w-full bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center gap-2">
                  <div className="text-center">
                    <p className="text-2xl" style={{ fontFamily: 'serif', color: coloresElemento[pilar.tallo.elemento.split(' ')[0]] || '#c084fc' }}>
                      {pilar.tallo.caracter}
                    </p>
                    <p className="text-white/40 text-xs">{pilar.tallo.elemento}</p>
                  </div>
                  <div className="w-full border-t border-white/10" />
                  <div className="text-center">
                    <p className="text-2xl" style={{ fontFamily: 'serif', color: coloresElemento[pilar.rama.elemento] || '#c084fc' }}>
                      {pilar.rama.caracter}
                    </p>
                    <p className="text-white/40 text-xs">{pilar.rama.animal}</p>
                  </div>
                </div>
                <p className="text-white/50 text-xs text-center">{pilar.nombre}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur">
          <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Day Master · Tu esencia</p>
          <div className="flex items-center gap-3">
            <p className="text-4xl" style={{ fontFamily: 'serif', color: coloresElemento[bazi.elementoDominante] || '#c084fc' }}>
              {bazi.dayMaster.caracter}
            </p>
            <div>
              <p className="text-white font-semibold">{bazi.dayMaster.nombre} · {bazi.dayMaster.elemento}</p>
              <p className="text-white/50 text-xs mt-1">{CINCO_ELEMENTOS_DESC[bazi.elementoDominante]?.substring(0, 80)}...</p>
            </div>
          </div>
        </div>

        {!generado ? (
          <button
            onClick={generarLectura}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
          >
            Generar mi lectura BaZi
          </button>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
            <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu lectura</p>
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
            titulo={`Mi BaZi: Day Master ${bazi.dayMaster.nombre} · ${bazi.dayMaster.elemento}`}
            texto={interpretacion}
            hashtags={['BaZi', 'Universe', 'CuatroPilares', 'AstrologiaChina']}
          />
        )}

        {generado && !cargando && (
          <button onClick={() => window.location.href = '/guia'} className="w-full bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-full">
            Explorar con mi Guía IA
          </button>
        )}

      </div>
    </div>
  )
}