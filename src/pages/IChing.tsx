// src/pages/IChing.tsx

import { useState } from 'react'
import { limpiarMarkdown } from '../components/TextoIA'
import { HEXAGRAMAS, lanzarMonedas, lineasAHexagrama } from '../lib/motores/iching'
import Compartir from '../components/Compartir'
import Paywall from '../components/Paywall'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import { llamarGemini, useUserPlan, useAnalytics, registrarEvento } from '../lib/paginaHelper'
import { guardarLectura } from '../hooks/useHistorial'

function getHexagramaUnicode(numero: number): string {
  return String.fromCodePoint(0x4DBF + numero)
}

function MonedaChina({ girando }: { girando: boolean }) {
  return (
    <div style={{
      width: 180, height: 180,
      animation: girando ? 'girarMoneda 0.6s ease-in-out infinite' : 'none',
      margin: '0 auto',
    }}>
      <style>{`
        @keyframes girarMoneda {
          0%   { transform: rotateY(0deg) scale(1); }
          50%  { transform: rotateY(90deg) scale(0.92); }
          100% { transform: rotateY(0deg) scale(1); }
        }
      `}</style>
      <svg width="180" height="180" viewBox="0 0 180 180">
        {/* Sombra exterior */}
        <circle cx="92" cy="93" r="82" fill="rgba(0,0,0,0.3)" />

        {/* Cuerpo de la moneda — bronce dorado */}
        <circle cx="90" cy="90" r="82" fill="#8B6914" />
        <circle cx="90" cy="90" r="80" fill="#C8970A" />
        <circle cx="90" cy="90" r="78" fill="#D4A017" />

        {/* Borde exterior relieve */}
        <circle cx="90" cy="90" r="78" fill="none" stroke="#8B6914" strokeWidth="4" />
        <circle cx="90" cy="90" r="74" fill="none" stroke="#E8B420" strokeWidth="1.5" />

        {/* Área interior de la moneda */}
        <circle cx="90" cy="90" r="68" fill="#B8870A" />
        <circle cx="90" cy="90" r="66" fill="#C8970A" />

        {/* Agujero cuadrado central */}
        <rect x="73" y="73" width="34" height="34" fill="#1a0a00" rx="2" />
        <rect x="75" y="75" width="30" height="30" fill="#0d0500" rx="1" />
        {/* Borde dorado del agujero */}
        <rect x="73" y="73" width="34" height="34" fill="none" stroke="#8B6914" strokeWidth="2" rx="2" />

        {/* Dragón superior — simplificado */}
        <path d="M 50 38 Q 60 28 75 32 Q 85 25 90 30 Q 95 25 105 32 Q 120 28 130 38 Q 118 42 110 38 Q 100 34 90 36 Q 80 34 70 38 Q 62 42 50 38 Z"
          fill="#8B6200" opacity="0.7" />
        <path d="M 55 40 Q 70 30 90 34 Q 110 30 125 40"
          fill="none" stroke="#7A5500" strokeWidth="1.5" opacity="0.6" />

        {/* Dragón inferior — simplificado */}
        <path d="M 50 142 Q 60 152 75 148 Q 85 155 90 150 Q 95 155 105 148 Q 120 152 130 142 Q 118 138 110 142 Q 100 146 90 144 Q 80 146 70 142 Q 62 138 50 142 Z"
          fill="#8B6200" opacity="0.7" />
        <path d="M 55 140 Q 70 150 90 146 Q 110 150 125 140"
          fill="none" stroke="#7A5500" strokeWidth="1.5" opacity="0.6" />

        {/* Dragón izquierdo */}
        <path d="M 38 50 Q 28 60 32 75 Q 25 85 30 90 Q 25 95 32 105 Q 28 120 38 130 Q 42 118 38 110 Q 34 100 36 90 Q 34 80 38 70 Q 42 62 38 50 Z"
          fill="#8B6200" opacity="0.7" />

        {/* Dragón derecho */}
        <path d="M 142 50 Q 152 60 148 75 Q 155 85 150 90 Q 155 95 148 105 Q 152 120 142 130 Q 138 118 142 110 Q 146 100 144 90 Q 146 80 142 70 Q 138 62 142 50 Z"
          fill="#8B6200" opacity="0.7" />

        {/* Detalles decorativos — escamas */}
        {[45, 90, 135, 180, 225, 270, 315, 360].map((ang, i) => {
          const rad = (ang * Math.PI) / 180
          const x = 90 + 56 * Math.cos(rad)
          const y = 90 + 56 * Math.sin(rad)
          return (
            <circle key={i} cx={x} cy={y} r="3"
              fill="#8B6200" opacity="0.5" />
          )
        })}

        {/* Caracteres chinos en las 4 esquinas del agujero */}
        <text x="90" y="68" textAnchor="middle" fontSize="10"
          fill="#7A5500" fontFamily="serif" opacity="0.8">易</text>
        <text x="90" y="122" textAnchor="middle" fontSize="10"
          fill="#7A5500" fontFamily="serif" opacity="0.8">經</text>
        <text x="68" y="94" textAnchor="middle" fontSize="10"
          fill="#7A5500" fontFamily="serif" opacity="0.8">古</text>
        <text x="112" y="94" textAnchor="middle" fontSize="10"
          fill="#7A5500" fontFamily="serif" opacity="0.8">今</text>

        {/* Brillo superior */}
        <ellipse cx="72" cy="62" rx="18" ry="10"
          fill="rgba(255,220,80,0.15)" transform="rotate(-35,72,62)" />
      </svg>
    </div>
  )
}

export default function IChing() {
  const [fase, setFase] = useState<'pregunta' | 'resultado'>('pregunta')
  const [pregunta, setPregunta] = useState('')
  const [resultado, setResultado] = useState<any>(null)
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [girando, setGirando] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const nombre = localStorage.getItem('nombre') || 'viajero'

  const { esPremium, userId } = useUserPlan()
  useAnalytics('iching')

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const consultar = async () => {
    if (!pregunta.trim()) return
    setGirando(true)
    await new Promise(r => setTimeout(r, 1200))
    setGirando(false)

    const t0 = Date.now()
    const lineas = lanzarMonedas()
    const { hexagrama, cambiante, hexagramaResultante } = lineasAHexagrama(lineas)
    const hexData = HEXAGRAMAS[hexagrama - 1]
    const hexResultData = HEXAGRAMAS[hexagramaResultante - 1]
    const hayCambio = cambiante.some(c => c) && hexagrama !== hexagramaResultante

    setResultado({ hexData, hexResultData, hayCambio })
    setFase('resultado')
    setCargando(true)
    setErrorMsg('')
    registrarEvento({ herramienta: 'iching', accion: 'consulta_iniciada', user_id: userId })

    const result = await llamarGemini({
      herramienta: 'iching',
      prompt: `Escribe en español, en prosa, sin listas, sin asteriscos, sin markdown.
Sabio intérprete del I Ching con profundo conocimiento de la filosofía taoísta.

Nombre: ${nombre}
Pregunta: "${pregunta}"
Hexagrama ${hexData.numero}: ${hexData.nombre} (${hexData.chino})
${hayCambio ? `Líneas cambiantes → Hexagrama ${hexResultData.numero}: ${hexResultData.nombre} (${hexResultData.chino})` : ''}
Tema: ${hexData.tema}

3-4 párrafos: energía del hexagrama, conexión con la pregunta${hayCambio ? ', transformación que señala el hexagrama resultante' : ''}, pregunta de reflexión profunda. El I Ching refleja la situación, no determina el futuro.`,
      userId, usarLite: false, cacheable: false, maxTokens: 2000,
    })

    if (result.error) {
      setErrorMsg(result.error)
    } else {
      setInterpretacion(limpiarMarkdown(result.texto || hexData.tema))
      registrarEvento({ herramienta: 'iching', accion: 'lectura_ia', tiempo_respuesta_ms: Date.now() - t0, user_id: userId })
      guardarLectura({
        herramienta: 'iching',
        titulo: `Hexagrama ${hexData.numero}: ${hexData.nombre} · "${pregunta.slice(0, 40)}${pregunta.length > 40 ? '…' : ''}"`,
        contenido: result.texto || hexData.tema,
        metadatos: { hexagrama: hexData.numero, nombre: hexData.nombre, pregunta },
      })
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/75" />

      {!esPremium && fase === 'pregunta' && (
        <Paywall motivo="herramienta" herramienta="I Ching · El Libro de los Cambios" />
      )}

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col px-6 py-10 gap-6">
        <div className="flex items-center">
          <button onClick={() => window.location.href = '/tradiciones'} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">I Ching · 易經</p>
            <p className="text-purple-300 text-xs">El Libro de los Cambios</p>
          </div>
        </div>

        {fase === 'pregunta' && (
          <div className="flex flex-col gap-6">
            <MonedaChina girando={girando} />
            <p className="text-white/50 text-sm text-center leading-relaxed">
              El I Ching no predice el futuro. Refleja la energía del momento presente y te ayuda a comprender la situación con mayor profundidad.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu pregunta</p>
              <textarea value={pregunta} onChange={e => setPregunta(e.target.value)}
                placeholder="Formula tu pregunta con sinceridad..." rows={3}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30" />
            </div>
            <button onClick={consultar} disabled={!pregunta.trim() || girando}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40">
              {girando ? 'Lanzando las monedas...' : 'Lanzar las monedas'}
            </button>
          </div>
        )}

        {fase === 'resultado' && resultado && (
          <div className="flex flex-col gap-5">

            <div className="bg-white/5 border border-purple-500/30 rounded-3xl p-6 backdrop-blur flex flex-col items-center gap-3">
              <div style={{ fontSize: 96, lineHeight: 1, fontFamily: 'serif', color: 'rgba(167,139,250,0.9)' }}>
                {getHexagramaUnicode(resultado.hexData.numero)}
              </div>
              <div className="text-center">
                <p className="text-white/40 text-xs mb-1">Hexagrama {resultado.hexData.numero}</p>
                <p className="text-white font-bold text-xl">{resultado.hexData.nombre}</p>
                <p className="text-3xl mt-1" style={{ fontFamily: 'serif', color: 'rgba(167,139,250,0.6)' }}>
                  {resultado.hexData.chino}
                </p>
                <p className="text-purple-300/70 text-xs mt-2">{resultado.hexData.keywords}</p>
              </div>
            </div>

            {resultado.hayCambio && (
              <div className="bg-white/5 border border-purple-500/20 rounded-3xl p-4 backdrop-blur flex items-center gap-4">
                <div style={{ fontSize: 48, fontFamily: 'serif', color: 'rgba(167,139,250,0.5)', lineHeight: 1 }}>
                  {getHexagramaUnicode(resultado.hexResultData.numero)}
                </div>
                <div>
                  <p className="text-purple-300 text-xs tracking-widest uppercase mb-1">Transformación hacia</p>
                  <p className="text-white font-semibold">{resultado.hexResultData.nombre} · {resultado.hexResultData.chino}</p>
                  <p className="text-white/50 text-xs">{resultado.hexResultData.keywords}</p>
                </div>
              </div>
            )}

            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur">
              <p className="text-white/40 text-xs">Tu pregunta: <span className="text-white/70 italic">"{pregunta}"</span></p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Interpretación</p>
              {cargando ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : errorMsg ? (
                <p className="text-red-400 text-sm">{errorMsg}</p>
              ) : (
                <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{interpretacion}</p>
              )}
            </div>

            {!cargando && interpretacion && (
              <>
                <DisclaimerIA />
                <Valoracion herramienta="iching" userId={userId} />
                <Compartir
                  titulo={`Mi consulta al I Ching: ${resultado.hexData.nombre}`}
                  texto={interpretacion}
                  hashtags={['IChing', 'Universe', 'Sabiduria', 'China']} />
              </>
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.href = '/guia'}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full">
                Explorar con mi Guía IA
              </button>
              <button onClick={() => { setFase('pregunta'); setPregunta(''); setInterpretacion(''); setErrorMsg('') }}
                className="w-full text-purple-300/60 text-sm py-2">
                Nueva consulta
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}