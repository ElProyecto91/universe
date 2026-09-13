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

const HERRAMIENTA = 'bazi'

// ── Troncos Celestiales (天干) ──────────────────────────────
const TRONCOS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
const TRONCOS_NOMBRES = ['Jia','Yi','Bing','Ding','Wu','Ji','Geng','Xin','Ren','Gui']
const TRONCOS_ELEMENTOS = ['Madera','Madera','Fuego','Fuego','Tierra','Tierra','Metal','Metal','Agua','Agua']
const TRONCOS_YIN = [false,true,false,true,false,true,false,true,false,true]

// ── Ramas Terrestres (地支) ─────────────────────────────────
const RAMAS = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
const RAMAS_NOMBRES = ['Zi','Chou','Yin','Mao','Chen','Si','Wu','Wei','Shen','You','Xu','Hai']
const RAMAS_ANIMALES = ['Rata','Buey','Tigre','Conejo','Dragón','Serpiente','Caballo','Cabra','Mono','Gallo','Perro','Cerdo']
const RAMAS_ELEMENTOS = ['Agua','Tierra','Madera','Madera','Tierra','Fuego','Fuego','Tierra','Metal','Metal','Tierra','Agua']

// ── Colores por elemento ────────────────────────────────────
const ELEMENTO_COLOR: Record<string, { bg: string; text: string; border: string; emoji: string }> = {
  'Madera': { bg: 'bg-green-900/30',  text: 'text-green-300',  border: 'border-green-500/40',  emoji: '🪵' },
  'Fuego':  { bg: 'bg-red-900/30',    text: 'text-red-300',    border: 'border-red-500/40',    emoji: '🔥' },
  'Tierra': { bg: 'bg-yellow-900/30', text: 'text-yellow-300', border: 'border-yellow-500/40', emoji: '🌍' },
  'Metal':  { bg: 'bg-gray-700/30',   text: 'text-gray-300',   border: 'border-gray-400/40',   emoji: '⚙️' },
  'Agua':   { bg: 'bg-blue-900/30',   text: 'text-blue-300',   border: 'border-blue-500/40',   emoji: '💧' },
}

// ── Cálculo de pilares BaZi ─────────────────────────────────
function calcularPilarAnio(anio: number) {
  const troncoIdx = (anio - 4) % 10
  const ramaIdx   = (anio - 4) % 12
  return {
    tronco: TRONCOS[((troncoIdx % 10) + 10) % 10],
    troncoNombre: TRONCOS_NOMBRES[((troncoIdx % 10) + 10) % 10],
    elemento: TRONCOS_ELEMENTOS[((troncoIdx % 10) + 10) % 10],
    rama: RAMAS[((ramaIdx % 12) + 12) % 12],
    ramaNombre: RAMAS_NOMBRES[((ramaIdx % 12) + 12) % 12],
    animal: RAMAS_ANIMALES[((ramaIdx % 12) + 12) % 12],
    ramaElemento: RAMAS_ELEMENTOS[((ramaIdx % 12) + 12) % 12],
  }
}

function calcularPilarMes(anio: number, mes: number) {
  // Mes chino simplificado (mes solar)
  const troncoBase = ((anio - 4) % 5) * 2
  const troncoIdx  = (troncoBase + mes - 1) % 10
  const ramaIdx    = (mes + 1) % 12
  return {
    tronco: TRONCOS[((troncoIdx % 10) + 10) % 10],
    troncoNombre: TRONCOS_NOMBRES[((troncoIdx % 10) + 10) % 10],
    elemento: TRONCOS_ELEMENTOS[((troncoIdx % 10) + 10) % 10],
    rama: RAMAS[((ramaIdx % 12) + 12) % 12],
    ramaNombre: RAMAS_NOMBRES[((ramaIdx % 12) + 12) % 12],
    animal: RAMAS_ANIMALES[((ramaIdx % 12) + 12) % 12],
    ramaElemento: RAMAS_ELEMENTOS[((ramaIdx % 12) + 12) % 12],
  }
}

function calcularPilarDia(anio: number, mes: number, dia: number) {
  // Algoritmo simplificado basado en días julianos
  const a = Math.floor((14 - mes) / 12)
  const y = anio - a
  const m = mes + 12 * a - 2
  const jd = dia + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045
  const troncoIdx = (jd + 4) % 10
  const ramaIdx   = (jd + 8) % 12
  return {
    tronco: TRONCOS[((troncoIdx % 10) + 10) % 10],
    troncoNombre: TRONCOS_NOMBRES[((troncoIdx % 10) + 10) % 10],
    elemento: TRONCOS_ELEMENTOS[((troncoIdx % 10) + 10) % 10],
    yinYang: TRONCOS_YIN[((troncoIdx % 10) + 10) % 10] ? 'Yin' : 'Yang',
    rama: RAMAS[((ramaIdx % 12) + 12) % 12],
    ramaNombre: RAMAS_NOMBRES[((ramaIdx % 12) + 12) % 12],
    animal: RAMAS_ANIMALES[((ramaIdx % 12) + 12) % 12],
    ramaElemento: RAMAS_ELEMENTOS[((ramaIdx % 12) + 12) % 12],
  }
}

function calcularPilarHora(hora: number, diaTroncoIdx: number) {
  const ramaIdx   = Math.floor((hora + 1) / 2) % 12
  const troncoIdx = (diaTroncoIdx % 5) * 2 + Math.floor(ramaIdx / 6)
  return {
    tronco: TRONCOS[((troncoIdx % 10) + 10) % 10],
    troncoNombre: TRONCOS_NOMBRES[((troncoIdx % 10) + 10) % 10],
    elemento: TRONCOS_ELEMENTOS[((troncoIdx % 10) + 10) % 10],
    rama: RAMAS[((ramaIdx % 12) + 12) % 12],
    ramaNombre: RAMAS_NOMBRES[((ramaIdx % 12) + 12) % 12],
    animal: RAMAS_ANIMALES[((ramaIdx % 12) + 12) % 12],
    ramaElemento: RAMAS_ELEMENTOS[((ramaIdx % 12) + 12) % 12],
  }
}

function calcularBazi(fecha: string, hora: number) {
  const [anioStr, mesStr, diaStr] = fecha.split('-')
  const anio = parseInt(anioStr)
  const mes  = parseInt(mesStr)
  const dia  = parseInt(diaStr)

  const pilarAnio = calcularPilarAnio(anio)
  const pilarMes  = calcularPilarMes(anio, mes)
  const pilarDia  = calcularPilarDia(anio, mes, dia)

  const diaTroncoIdx = TRONCOS.indexOf(pilarDia.tronco)
  const pilarHora = calcularPilarHora(hora, diaTroncoIdx)

  // Balance de elementos
  const todos = [
    pilarAnio.elemento, pilarAnio.ramaElemento,
    pilarMes.elemento,  pilarMes.ramaElemento,
    pilarDia.elemento,  pilarDia.ramaElemento,
    pilarHora.elemento, pilarHora.ramaElemento,
  ]
  const balance: Record<string, number> = { Madera: 0, Fuego: 0, Tierra: 0, Metal: 0, Agua: 0 }
  todos.forEach(e => { if (balance[e] !== undefined) balance[e]++ })

  return { pilarAnio, pilarMes, pilarDia, pilarHora, balance, dayMaster: pilarDia }
}

// ── Componente Pilar ────────────────────────────────────────
function TarjetaPilar({ titulo, tronco, troncoNombre, elemento, rama, animal }: {
  titulo: string; tronco: string; troncoNombre: string; elemento: string; rama: string; animal: string
}) {
  const col = ELEMENTO_COLOR[elemento] ?? ELEMENTO_COLOR['Tierra']
  return (
    <div className={`flex flex-col items-center gap-1 ${col.bg} border ${col.border} rounded-2xl p-3 flex-1`}>
      <p className="text-white/40 text-xs">{titulo}</p>
      <p className={`text-2xl font-bold ${col.text}`}>{tronco}</p>
      <p className="text-white/50 text-xs">{troncoNombre}</p>
      <div className="w-full h-px bg-white/10 my-1" />
      <p className="text-white text-2xl">{rama}</p>
      <p className="text-white/50 text-xs">{animal}</p>
      <p className={`text-xs font-semibold ${col.text}`}>{elemento}</p>
    </div>
  )
}

export default function BaZi() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [fase,           setFase]           = useState<'datos' | 'resultado'>('datos')
  const [hora,           setHora]           = useState('12:00')
  const [interpretacion, setInterpretacion] = useState('')
  const [bazi,           setBazi]           = useState<ReturnType<typeof calcularBazi> | null>(null)
  const [cargando,       setCargando]       = useState(false)
  const [errorMsg,       setErrorMsg]       = useState('')
  const [yaValorado,     setYaValorado]     = useState(false)
  const lecturaGuardadaRef                  = useRef(false)

  const nombre          = localStorage.getItem('nombre') || 'viajero'
  const signo           = localStorage.getItem('signo')  || 'Leo'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const fechaHoy        = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (!userPlan.cargando) analytics.registrarApertura()
  }, [userPlan.cargando])

  if (!userPlan.cargando && !userPlan.esPremium) {
    analytics.registrarPaywall(); navigate('/premium'); return null
  }

  const calcular = async () => {
    const horaNum = parseInt(hora.split(':')[0])
    const resultado = calcularBazi(fechaNacimiento, horaNum)
    setBazi(resultado)
    setFase('resultado')
    setCargando(true)
    setErrorMsg('')
    const t0 = Date.now()

    const balanceTexto = Object.entries(resultado.balance)
      .map(([e, n]) => `${e}: ${n}`)
      .join(', ')

    try {
      const prompt = [
        'Eres un experto en BaZi (Cuatro Pilares del Destino) y los Cinco Elementos chinos.',
        'Responde SOLO con texto en español, en prosa continua. Sin asteriscos, sin guiones, sin cursivas, sin negritas, sin numeración, sin markdown.',
        'No empieces nunca con saludos ni con el nombre del usuario.',
        'Cada párrafo tiene máximo 3 frases cortas. Es obligatorio completar los 3 párrafos.',
        '',
        `El usuario se llama ${nombre}, su signo occidental es ${signo}.`,
        `Fecha de nacimiento: ${fechaNacimiento}. Hora: ${hora}.`,
        `Day Master: ${resultado.dayMaster.tronco} (${resultado.dayMaster.troncoNombre}) — elemento ${resultado.dayMaster.elemento}, ${resultado.dayMaster.yinYang}.`,
        `Balance de elementos en la carta: ${balanceTexto}.`,
        `Elemento más fuerte: ${Object.entries(resultado.balance).sort((a,b) => b[1]-a[1])[0][0]}.`,
        `Elemento más débil: ${Object.entries(resultado.balance).sort((a,b) => a[1]-b[1])[0][0]}.`,
        '',
        'Escribe exactamente 3 párrafos separados por línea en blanco.',
        'Párrafo 1: el significado del Day Master y su energía esencial — quién es esta persona en su núcleo.',
        'Párrafo 2: cómo el balance de elementos moldea su carácter, talentos y desafíos principales.',
        'Párrafo 3: qué elemento necesita cultivar para equilibrar su carta y un consejo práctico para este momento.',
        '',
        'Tono sabio, profundo y evocador. Termina en punto.',
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
            titulo: `BaZi · ${resultado.dayMaster.elemento} ${resultado.dayMaster.yinYang} · ${fechaHoy}`,
            contenido: `Day Master: ${resultado.dayMaster.troncoNombre} (${resultado.dayMaster.elemento} ${resultado.dayMaster.yinYang})\nBalance: ${balanceTexto}\n\n${result.texto}`,
            metadatos: { fecha: fechaNacimiento, hora, nombre, dayMaster: resultado.dayMaster.troncoNombre },
          })
        }
      } else {
        setErrorMsg(result.error || 'El universo guarda silencio. Inténtalo de nuevo.')
      }
    } catch (err) {
      console.error('[BaZi]', err)
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
    setBazi(null)
    setErrorMsg('')
    lecturaGuardadaRef.current = false
  }

  const dayMasterColor = bazi ? (ELEMENTO_COLOR[bazi.dayMaster.elemento] ?? ELEMENTO_COLOR['Tierra']) : null

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <button
            onClick={() => fase === 'resultado' ? resetear() : navigate('/tradiciones')}
            className="text-purple-300 text-sm"
          >← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">BaZi · 八字</p>
            <p className="text-purple-300 text-xs">Cuatro Pilares del Destino</p>
          </div>
          <span className="text-purple-400 text-xs border border-purple-400/30 rounded-full px-2 py-0.5">✨ Premium</span>
        </div>

        {fase === 'datos' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5">
              <p className="text-white/60 text-sm text-center leading-relaxed">
                Los Cuatro Pilares del Destino revelan tu energía esencial a través de tu fecha y hora de nacimiento.
              </p>
            </div>
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5 flex flex-col gap-4">
              <div>
                <p className="text-purple-400 text-xs tracking-widest uppercase mb-2">Fecha de nacimiento</p>
                <p className="text-white text-sm">{fechaNacimiento}</p>
                <p className="text-white/40 text-xs mt-1">Tomada de tu perfil</p>
              </div>
              <div className="border-t border-white/10 pt-4">
                <p className="text-purple-400 text-xs tracking-widest uppercase mb-2">Hora de nacimiento</p>
                <input
                  type="time"
                  value={hora}
                  onChange={e => setHora(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white outline-none focus:border-purple-400 text-sm"
                />
                <p className="text-white/40 text-xs mt-2">Si no la conoces exactamente, usa mediodía (12:00)</p>
              </div>
            </div>
            <DisclaimerIA compact />
            <button
              onClick={calcular}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
            >Calcular mis Cuatro Pilares</button>
          </div>
        )}

        {fase === 'resultado' && bazi && (
          <div className="flex flex-col gap-4">

            {/* Day Master */}
            {dayMasterColor && (
              <div className={`${dayMasterColor.bg} border ${dayMasterColor.border} rounded-3xl p-5 text-center`}>
                <p className="text-white/50 text-xs tracking-widest uppercase mb-2">Day Master · Amo del Día</p>
                <p className={`text-6xl font-bold ${dayMasterColor.text} mb-1`}>{bazi.dayMaster.tronco}</p>
                <p className="text-white text-lg font-semibold">{bazi.dayMaster.troncoNombre}</p>
                <p className={`text-sm ${dayMasterColor.text}`}>{dayMasterColor.emoji} {bazi.dayMaster.elemento} · {bazi.dayMaster.yinYang}</p>
              </div>
            )}

            {/* 4 Pilares */}
            <div className="flex gap-2">
              <TarjetaPilar titulo="Año" tronco={bazi.pilarAnio.tronco} troncoNombre={bazi.pilarAnio.troncoNombre} elemento={bazi.pilarAnio.elemento} rama={bazi.pilarAnio.rama} animal={bazi.pilarAnio.animal} />
              <TarjetaPilar titulo="Mes" tronco={bazi.pilarMes.tronco} troncoNombre={bazi.pilarMes.troncoNombre} elemento={bazi.pilarMes.elemento} rama={bazi.pilarMes.rama} animal={bazi.pilarMes.animal} />
              <TarjetaPilar titulo="Día" tronco={bazi.pilarDia.tronco} troncoNombre={bazi.pilarDia.troncoNombre} elemento={bazi.pilarDia.elemento} rama={bazi.pilarDia.rama} animal={bazi.pilarDia.animal} />
              <TarjetaPilar titulo="Hora" tronco={bazi.pilarHora.tronco} troncoNombre={bazi.pilarHora.troncoNombre} elemento={bazi.pilarHora.elemento} rama={bazi.pilarHora.rama} animal={bazi.pilarHora.animal} />
            </div>

            {/* Balance de elementos */}
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-4">Balance de elementos</p>
              <div className="flex flex-col gap-2">
                {Object.entries(bazi.balance).map(([elemento, count]) => {
                  const col = ELEMENTO_COLOR[elemento]
                  const pct = Math.round((count / 8) * 100)
                  return (
                    <div key={elemento} className="flex items-center gap-3">
                      <p className="text-xs w-14 text-white/60">{col.emoji} {elemento}</p>
                      <div className="flex-1 bg-white/10 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${col.bg.replace('/30', '')}`}
                          style={{ width: `${pct}%`, backgroundColor: undefined }}
                        />
                      </div>
                      <p className={`text-xs w-4 ${col.text}`}>{count}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Interpretación IA */}
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-4">Lectura profunda</p>
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
                  titulo={`BaZi: ${bazi.dayMaster.troncoNombre} — ${bazi.dayMaster.elemento} ${bazi.dayMaster.yinYang}`}
                  texto={interpretacion}
                  hashtags={['Universe', 'BaZi', 'CuatroPilares']}
                />
                <button onClick={() => navigate('/guia')} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">Explorar con mi Guía IA</button>
                <button onClick={resetear} className="w-full text-purple-300/60 text-sm py-2">Nueva consulta</button>
              </>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}