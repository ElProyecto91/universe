import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserPlan, incrementarConsulta } from '../hooks/useUserPlan'
import { useAnalytics } from '../hooks/useAnalytics'
import { guardarLectura } from '../hooks/useHistorial'
import { llamarGemini } from '../lib/gemini'
import Compartir from '../components/Compartir'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import PageLayout from '../components/PageLayout'
import TextoIA from '../components/TextoIA'

const HERRAMIENTA = 'numerologia-nombre'

const COLOR_NUMERO: Record<number, string> = {
  1: 'text-red-400', 2: 'text-blue-300', 3: 'text-yellow-400',
  4: 'text-green-400', 5: 'text-orange-400', 6: 'text-pink-400',
  7: 'text-violet-400', 8: 'text-amber-400', 9: 'text-teal-400',
  11: 'text-indigo-300', 22: 'text-purple-300', 33: 'text-rose-300',
}

const SIGNIFICADO_NUMERO: Record<number, string> = {
  1: 'Liderazgo · Independencia', 2: 'Cooperación · Intuición',
  3: 'Creatividad · Expresión', 4: 'Estabilidad · Estructura',
  5: 'Libertad · Cambio', 6: 'Amor · Armonía',
  7: 'Sabiduría · Misterio', 8: 'Abundancia · Poder',
  9: 'Compasión · Finalización', 11: 'Número Maestro · Iluminación',
  22: 'Número Maestro · Constructor', 33: 'Número Maestro · Servicio',
}

const TABLA_PITAGORICA: Record<string, number> = {
  a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,
  j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,
  s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8,
}

const VOCALES = new Set(['a','e','i','o','u'])

function reducir(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((acc, d) => acc + parseInt(d), 0)
  }
  return n
}

function calcularNumerosNombre(nombre: string) {
  const letras = nombre.toLowerCase().replace(/[^a-záéíóúüñ]/g, '').split('')
  const norm = letras.map(l => l.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
  const sumaTodas    = norm.reduce((acc, l) => acc + (TABLA_PITAGORICA[l] ?? 0), 0)
  const sumaVocales  = norm.filter(l => VOCALES.has(l)).reduce((acc, l) => acc + (TABLA_PITAGORICA[l] ?? 0), 0)
  const sumaConsonan = norm.filter(l => !VOCALES.has(l)).reduce((acc, l) => acc + (TABLA_PITAGORICA[l] ?? 0), 0)
  return {
    expresion:    reducir(sumaTodas),
    alma:         reducir(sumaVocales),
    personalidad: reducir(sumaConsonan),
  }
}

export default function NumerologiaNombre() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const nombrePerfil = localStorage.getItem('nombre') || 'viajero'
  const signo        = localStorage.getItem('signo')  || 'Leo'
  const fechaHoy     = new Date().toISOString().split('T')[0]

  const [nombreInput,    setNombreInput]    = useState(nombrePerfil)
  const [numeros,        setNumeros]        = useState(calcularNumerosNombre(nombrePerfil))
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando,       setCargando]       = useState(false)
  const [fase,           setFase]           = useState<'datos' | 'resultado'>('datos')
  const [errorMsg,       setErrorMsg]       = useState('')
  const [yaValorado,     setYaValorado]     = useState(false)
  const lecturaGuardadaRef                  = useRef(false)

  useEffect(() => {
    if (!userPlan.cargando) analytics.registrarApertura()
  }, [userPlan.cargando])

  if (!userPlan.cargando && !userPlan.esPremium) {
    analytics.registrarPaywall(); navigate('/premium'); return null
  }

  const handleNombreChange = (v: string) => {
    setNombreInput(v)
    if (v.trim().length > 1) setNumeros(calcularNumerosNombre(v))
  }

  const consultar = async () => {
    if (!nombreInput.trim()) return
    setFase('resultado'); setCargando(true); setErrorMsg('')
    const t0 = Date.now()
    const nums = calcularNumerosNombre(nombreInput)
    setNumeros(nums)

    try {
      const prompt = [
        'Eres una experta en numerología del nombre — sistema pitagórico y Cheiro.',
        'Responde SOLO con texto en español, en prosa continua. Sin asteriscos, sin guiones, sin cursivas, sin negritas, sin numeración, sin markdown.',
        'No empieces nunca con saludos ni con el nombre del usuario.',
        'Cada párrafo tiene máximo 3 frases cortas. Es obligatorio completar los 3 párrafos.',
        '',
        `El nombre analizado es: "${nombreInput}". Signo: ${signo}.`,
        `Número de Expresión (todas las letras): ${nums.expresion} — ${SIGNIFICADO_NUMERO[nums.expresion] ?? ''}.`,
        `Número del Alma (vocales): ${nums.alma} — ${SIGNIFICADO_NUMERO[nums.alma] ?? ''}.`,
        `Número de Personalidad (consonantes): ${nums.personalidad} — ${SIGNIFICADO_NUMERO[nums.personalidad] ?? ''}.`,
        '',
        'Escribe exactamente 3 párrafos separados por línea en blanco.',
        `Párrafo 1: el Número de Expresión ${nums.expresion} — el propósito y talento que este nombre proyecta al mundo.`,
        `Párrafo 2: el Número del Alma ${nums.alma} — el deseo profundo y la motivación interior que el nombre revela.`,
        `Párrafo 3: el Número de Personalidad ${nums.personalidad} — cómo perciben los demás a quien lleva este nombre y un consejo final.`,
        '',
        'Tono sabio, cálido y evocador. Termina en punto.',
      ].join('\n')

      const result = await llamarGemini({
        herramienta: HERRAMIENTA, prompt,
        userId: userPlan.userId, usarLite: true,
        cacheable: false, maxTokens: 400,
      })

      if (!result.error && result.texto) {
        setInterpretacion(result.texto)
        if (userPlan.userId) await incrementarConsulta(userPlan.userId)
        analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: result.modelo })
        if (!lecturaGuardadaRef.current) {
          lecturaGuardadaRef.current = true
          await guardarLectura({
            herramienta: HERRAMIENTA,
            titulo: `Numerología de "${nombreInput}" · ${fechaHoy}`,
            contenido: `Nombre: ${nombreInput}\nExpresión: ${nums.expresion} · Alma: ${nums.alma} · Personalidad: ${nums.personalidad}\n\n${result.texto}`,
            metadatos: { nombre: nombreInput, fecha: fechaHoy, signo, expresion: nums.expresion, alma: nums.alma, personalidad: nums.personalidad },
          })
        }
      } else {
        setErrorMsg(result.error || 'Los números guardan silencio. Inténtalo de nuevo.')
      }
    } catch (err) {
      console.error('[NumerologiaNombre]', err)
      setErrorMsg('Error inesperado.')
    } finally {
      setCargando(false)
    }
  }

  const handleValorar = (valor: 1 | -1) => {
    if (yaValorado) return
    setYaValorado(true)
    analytics.registrarValoracion(valor)
  }

  const resetear = () => {
    setFase('datos')
    setInterpretacion('')
    setErrorMsg('')
    lecturaGuardadaRef.current = false
  }

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <button
            onClick={() => fase === 'resultado' ? resetear() : navigate('/tradiciones')}
            className="text-purple-300 text-sm"
          >← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Numerología del Nombre</p>
            <p className="text-purple-300 text-xs">Vibración de tu nombre</p>
          </div>
          <span className="text-purple-400 text-xs border border-purple-400/30 rounded-full px-2 py-0.5">✨ Premium</span>
        </div>

        {fase === 'datos' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5 flex flex-col gap-3">
              <p className="text-purple-400 text-xs tracking-widest uppercase">Nombre a analizar</p>
              <input
                type="text"
                value={nombreInput}
                onChange={e => handleNombreChange(e.target.value)}
                placeholder="Escribe un nombre completo"
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-purple-400 text-sm"
              />
              <button
                onClick={() => handleNombreChange(nombrePerfil)}
                className="text-purple-300/60 text-xs self-start"
              >Usar mi nombre del perfil</button>
            </div>

            {nombreInput.trim().length > 1 && (
              <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5">
                <p className="text-purple-400 text-xs tracking-widest uppercase mb-4">Tus números</p>
                <div className="flex justify-between">
                  <div className="text-center flex-1">
                    <p className={`text-3xl font-bold ${COLOR_NUMERO[numeros.expresion] ?? 'text-white'}`}>{numeros.expresion}</p>
                    <p className="text-white/40 text-xs mt-1">Expresión</p>
                  </div>
                  <div className="border-l border-white/10" />
                  <div className="text-center flex-1">
                    <p className={`text-3xl font-bold ${COLOR_NUMERO[numeros.alma] ?? 'text-white'}`}>{numeros.alma}</p>
                    <p className="text-white/40 text-xs mt-1">Alma</p>
                  </div>
                  <div className="border-l border-white/10" />
                  <div className="text-center flex-1">
                    <p className={`text-3xl font-bold ${COLOR_NUMERO[numeros.personalidad] ?? 'text-white'}`}>{numeros.personalidad}</p>
                    <p className="text-white/40 text-xs mt-1">Personalidad</p>
                  </div>
                </div>
                <p className={`text-xs text-center mt-3 ${COLOR_NUMERO[numeros.expresion] ?? 'text-white/50'}`}>
                  {SIGNIFICADO_NUMERO[numeros.expresion] ?? ''}
                </p>
              </div>
            )}

            <DisclaimerIA compact />
            <button
              onClick={consultar}
              disabled={!nombreInput.trim() || nombreInput.trim().length < 2}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >Analizar vibración</button>
          </div>
        )}

        {fase === 'resultado' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-white/15 rounded-2xl px-4 py-3">
              <p className="text-white/50 text-xs italic">"{nombreInput}"</p>
            </div>

            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5">
              <div className="flex justify-between">
                <div className="text-center flex-1">
                  <p className={`text-3xl font-bold ${COLOR_NUMERO[numeros.expresion] ?? 'text-white'}`}>{numeros.expresion}</p>
                  <p className="text-white/40 text-xs mt-1">Expresión</p>
                </div>
                <div className="border-l border-white/10" />
                <div className="text-center flex-1">
                  <p className={`text-3xl font-bold ${COLOR_NUMERO[numeros.alma] ?? 'text-white'}`}>{numeros.alma}</p>
                  <p className="text-white/40 text-xs mt-1">Alma</p>
                </div>
                <div className="border-l border-white/10" />
                <div className="text-center flex-1">
                  <p className={`text-3xl font-bold ${COLOR_NUMERO[numeros.personalidad] ?? 'text-white'}`}>{numeros.personalidad}</p>
                  <p className="text-white/40 text-xs mt-1">Personalidad</p>
                </div>
              </div>
            </div>

            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-4">Lectura del nombre</p>
              {cargando ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : errorMsg
                ? <p className="text-red-300 text-sm">{errorMsg}</p>
                : <TextoIA texto={interpretacion} />
              }
            </div>

            {!cargando && interpretacion && (
              <>
                <DisclaimerIA />
                <Valoracion onValorar={handleValorar} />
                <Compartir
                  titulo={`Numerología de "${nombreInput}": ${numeros.expresion}·${numeros.alma}·${numeros.personalidad}`}
                  texto={interpretacion}
                  hashtags={['Universe', 'NumerologiaNombre']}
                />
                <button onClick={() => navigate('/guia')} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">Explorar con mi Guía IA</button>
                <button onClick={resetear} className="w-full text-purple-300/60 text-sm py-2">Analizar otro nombre</button>
              </>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}