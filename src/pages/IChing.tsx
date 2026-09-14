// src/pages/IChing.tsx

import { useState } from 'react'
import { limpiarMarkdown } from '../components/TextoIA'
import { HEXAGRAMAS, lanzarMonedas, lineasAHexagrama, dibujarHexagrama } from '../lib/motores/iching'
import Compartir from '../components/Compartir'
import Paywall from '../components/Paywall'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import { llamarGemini, useUserPlan, useAnalytics, registrarEvento } from '../lib/paginaHelper'
import { guardarLectura } from '../hooks/useHistorial'

function getHexagramaUnicode(numero: number): string {
  return String.fromCodePoint(0x4DBF + numero)
}

export default function IChing() {
  const [fase, setFase] = useState<'pregunta' | 'resultado'>('pregunta')
  const [pregunta, setPregunta] = useState('')
  const [resultado, setResultado] = useState<any>(null)
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
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
            <div className="text-center">
              <div style={{ fontSize: 80, lineHeight: 1, marginBottom: 16, fontFamily: 'serif', color: 'rgba(167,139,250,0.7)' }}>
                ☯
              </div>
              <p className="text-white/60 text-sm leading-relaxed">El I Ching no predice el futuro. Refleja la energía del momento presente y te ayuda a comprender la situación con mayor profundidad.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="text-purple-300 text-xs tracking-widest uppercase mb-3">Tu pregunta</p>
              <textarea value={pregunta} onChange={e => setPregunta(e.target.value)}
                placeholder="Formula tu pregunta con sinceridad..." rows={3}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30" />
            </div>
            <button onClick={consultar} disabled={!pregunta.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40">
              Lanzar las monedas
            </button>
          </div>
        )}

        {fase === 'resultado' && resultado && (
          <div className="flex flex-col gap-5">

            {/* Hero: hexagrama Unicode grande */}
            <div className="bg-white/5 border border-purple-500/30 rounded-3xl p-6 backdrop-blur flex flex-col items-center gap-3">
              <div style={{
                fontSize: 96,
                lineHeight: 1,
                fontFamily: 'serif',
                color: 'rgba(167,139,250,0.9)',
              }}>
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

            {/* Transformación */}
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