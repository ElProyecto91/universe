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

const HERRAMIENTA = 'zi-wei'

// ── Tabla de lunas nuevas (días julianos) 1920-2050 ─────────
// Cada entrada es el día juliano de la luna nueva de enero de ese año
// Fuente: algoritmo de Jean Meeus "Astronomical Algorithms"
function lunaNewJD(anio: number, mes: number): number {
  // Aproximación de Meeus para luna nueva
  const k = (anio + (mes - 1) / 12 - 2000) * 12.3685
  const T = Math.floor(k) / 1236.85
  const T2 = T * T
  const T3 = T2 * T
  const JDE = 2451550.09766 + 29.530588861 * Math.floor(k)
    + 0.00015437 * T2 - 0.000000150 * T3
  return JDE
}

function gregorioAJuliano(anio: number, mes: number, dia: number): number {
  const a = Math.floor((14 - mes) / 12)
  const y = anio + 4800 - a
  const m = mes + 12 * a - 3
  return dia + Math.floor((153 * m + 2) / 5) + 365 * y +
    Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045
}

function calcularLunar(fecha: string): { anioLunar: number; mesLunar: number; diaLunar: number } {
  const [anioStr, mesStr, diaStr] = fecha.split('-')
  const anio = parseInt(anioStr)
  const mes  = parseInt(mesStr)
  const dia  = parseInt(diaStr)
  const jd   = gregorioAJuliano(anio, mes, dia)

  // Buscar la luna nueva más cercana anterior
  let mesBase = mes
  let anioBase = anio
  let jdLuna = lunaNewJD(anioBase, mesBase)

  // Retroceder hasta encontrar la luna nueva anterior a la fecha
  let intentos = 0
  while (jdLuna > jd + 2451545 - 2451545 && intentos < 15) {
    mesBase--
    if (mesBase < 1) { mesBase = 12; anioBase-- }
    jdLuna = lunaNewJD(anioBase, mesBase)
    intentos++
  }

  // Día lunar = días desde la luna nueva
  const diaLunar = Math.floor(jd - (jdLuna - 2451545 + 2451545)) + 1

  // Mes lunar aproximado
  const mesLunar = ((mes - 1 + 12) % 12) + 1

  // Año lunar (zodíaco chino)
  const anioLunar = anio - (mes < 2 ? 1 : 0)

  return {
    anioLunar,
    mesLunar: Math.max(1, Math.min(12, mesLunar)),
    diaLunar: Math.max(1, Math.min(30, diaLunar > 0 ? diaLunar : 1)),
  }
}

// ── Zodiaco chino ───────────────────────────────────────────
const ANIMALES_CHINOS = ['Rata','Buey','Tigre','Conejo','Dragón','Serpiente','Caballo','Cabra','Mono','Gallo','Perro','Cerdo']
const ELEMENTOS_CHINOS = ['Madera','Madera','Fuego','Fuego','Tierra','Tierra','Metal','Metal','Agua','Agua']
const YIN_YANG = ['Yang','Yin','Yang','Yin','Yang','Yin','Yang','Yin','Yang','Yin']

function calcularZodiaco(anio: number) {
  const idx = (anio - 4) % 12
  const elemIdx = (anio - 4) % 10
  return {
    animal:   ANIMALES_CHINOS[((idx % 12) + 12) % 12],
    elemento: ELEMENTOS_CHINOS[((elemIdx % 10) + 10) % 10],
    yinYang:  YIN_YANG[((elemIdx % 10) + 10) % 10],
  }
}

// ── 12 Palacios ─────────────────────────────────────────────
const PALACIOS = [
  { id: 0,  nombre: 'Vida',        chino: '命宮', desc: 'Personalidad · Destino general · Esencia' },
  { id: 1,  nombre: 'Hermanos',    chino: '兄弟', desc: 'Relaciones fraternales · Compañeros' },
  { id: 2,  nombre: 'Matrimonio',  chino: '夫妻', desc: 'Pareja · Amor · Unión' },
  { id: 3,  nombre: 'Hijos',       chino: '子女', desc: 'Descendencia · Creatividad · Legado' },
  { id: 4,  nombre: 'Riqueza',     chino: '財帛', desc: 'Dinero · Abundancia · Recursos' },
  { id: 5,  nombre: 'Salud',       chino: '疾厄', desc: 'Cuerpo · Vitalidad · Obstáculos' },
  { id: 6,  nombre: 'Viaje',       chino: '遷移', desc: 'Movimiento · Cambios · Exterior' },
  { id: 7,  nombre: 'Amigos',      chino: '交友', desc: 'Vínculos sociales · Red · Apoyo' },
  { id: 8,  nombre: 'Carrera',     chino: '官祿', desc: 'Trabajo · Éxito · Reconocimiento' },
  { id: 9,  nombre: 'Propiedad',   chino: '田宅', desc: 'Hogar · Estabilidad · Bienes' },
  { id: 10, nombre: 'Espíritu',    chino: '福德', desc: 'Bienestar · Espiritualidad · Fortuna' },
  { id: 11, nombre: 'Padres',      chino: '父母', desc: 'Familia · Origen · Protección' },
]

// ── 14 Estrellas Principales ────────────────────────────────
const ESTRELLAS = [
  { nombre: 'Zi Wei',   chino: '紫微', tipo: 'Norte', desc: 'La Estrella Emperadora — liderazgo, autoridad, nobleza', emoji: '👑' },
  { nombre: 'Tian Ji',  chino: '天機', tipo: 'Norte', desc: 'El Estratega — inteligencia, cambio, adaptabilidad', emoji: '🧠' },
  { nombre: 'Tai Yang', chino: '太陽', tipo: 'Sur',   desc: 'El Sol — generosidad, reconocimiento, acción', emoji: '☀️' },
  { nombre: 'Wu Qu',    chino: '武曲', tipo: 'Norte', desc: 'El Guerrero — determinación, finanzas, liderazgo', emoji: '⚔️' },
  { nombre: 'Tian Tong',chino: '天同', tipo: 'Sur',   desc: 'La Armonía — paz, disfrute, fortuna tardía', emoji: '🕊️' },
  { nombre: 'Lian Zhen',chino: '廉貞', tipo: 'Norte', desc: 'La Virtud — principios, pasión, conflicto', emoji: '🔥' },
  { nombre: 'Tian Fu',  chino: '天府', tipo: 'Sur',   desc: 'El Tesoro — riqueza, estabilidad, conservación', emoji: '💎' },
  { nombre: 'Tai Yin',  chino: '太陰', tipo: 'Sur',   desc: 'La Luna — intuición, riqueza oculta, sensibilidad', emoji: '🌙' },
  { nombre: 'Tan Lang', chino: '貪狼', tipo: 'Norte', desc: 'El Deseo — ambición, talento múltiple, magnetismo', emoji: '🐺' },
  { nombre: 'Ju Men',   chino: '巨門', tipo: 'Sur',   desc: 'La Puerta — comunicación, controversia, oratoria', emoji: '🚪' },
  { nombre: 'Tian Xiang',chino:'天相', tipo: 'Norte', desc: 'El Ministro — diplomacia, apoyo, mediación', emoji: '🤝' },
  { nombre: 'Tian Liang',chino:'天梁', tipo: 'Sur',   desc: 'El Anciano — sabiduría, protección, medicina', emoji: '🌿' },
  { nombre: 'Qi Sha',   chino: '七殺', tipo: 'Norte', desc: 'El General — fuerza, riesgo, independencia', emoji: '🗡️' },
  { nombre: 'Po Jun',   chino: '破軍', tipo: 'Norte', desc: 'El Destructor — renovación, cambio radical, pionero', emoji: '💥' },
]

// ── Posición de Zi Wei según día lunar ──────────────────────
// Tabla clásica: posición de Zi Wei en los 12 palacios según día lunar
const ZI_WEI_POR_DIA: Record<number, number> = {
  1:0, 2:3, 3:2, 4:5, 5:4, 6:7, 7:6, 8:9, 9:8, 10:11,
  11:10, 12:1, 13:0, 14:3, 15:2, 16:5, 17:4, 18:7,
  19:6, 20:9, 21:8, 22:11, 23:10, 24:1, 25:0, 26:3,
  27:2, 28:5, 29:4, 30:7,
}

// ── Palacio de la Vida según mes lunar + hora ───────────────
const PALACIO_VIDA_BASE: Record<number, number> = {
  1:2, 2:1, 3:12, 4:11, 5:10, 6:9, 7:8, 8:7, 9:6, 10:5, 11:4, 12:3
}

function horaARama(hora: number): number {
  // Doce ramas según hora: cada 2 horas
  return Math.floor(((hora + 1) % 24) / 2)
}

function calcularPalacioVida(mesLunar: number, hora: number): number {
  const base = PALACIO_VIDA_BASE[mesLunar] ?? 1
  const rama = horaARama(hora)
  return ((base + rama - 1) % 12)
}

// ── Distribución de las 14 estrellas ────────────────────────
function distribuirEstrellas(ziWeiPalacio: number): Record<number, string[]> {
  const mapa: Record<number, string[]> = {}
  for (let i = 0; i < 12; i++) mapa[i] = []

  // Zi Wei y su grupo Norte
  const grupoNorte = [0, 1, 3, 5, 8, 10, 12, 13] // índices en ESTRELLAS
  const offsetsNorte = [0, 1, -1, 2, 3, -2, 4, -3]
  grupoNorte.forEach((idx, i) => {
    const palacio = ((ziWeiPalacio + offsetsNorte[i]) % 12 + 12) % 12
    mapa[palacio].push(ESTRELLAS[idx].nombre)
  })

  // Tian Fu y su grupo Sur (opuesto a Zi Wei)
  const tianFuPalacio = ((ziWeiPalacio + 6) % 12 + 12) % 12 // opuesto
  // Esto está simplificado — la posición real de Tian Fu depende también del mes
  const grupoSur = [2, 4, 6, 7, 9, 11]
  const offsetsSur = [0, 1, -1, 2, -2, 3]
  grupoSur.forEach((idx, i) => {
    const palacio = ((tianFuPalacio + offsetsSur[i]) % 12 + 12) % 12
    mapa[palacio].push(ESTRELLAS[idx].nombre)
  })

  return mapa
}

// ── 4 Transformaciones según año de nacimiento ──────────────
const TRANSFORMACIONES: Record<number, { lu: string; quan: string; ke: string; ji: string }> = {
  0: { lu: 'Lian Zhen', quan: 'Po Jun',    ke: 'Wu Qu',    ji: 'Tian Ji' },  // Geng
  1: { lu: 'Sun',       quan: 'Tai Yang',  ke: 'Wu Qu',    ji: 'Wen Chang' }, // Xin
  2: { lu: 'Tian Liang',quan: 'Zi Wei',    ke: 'Zuo Fu',   ji: 'Wu Qu' },    // Ren
  3: { lu: 'Po Jun',    quan: 'Tan Lang',  ke: 'Tai Yin',  ji: 'Ju Men' },   // Gui
  4: { lu: 'Lian Zhen', quan: 'Po Jun',    ke: 'Wu Qu',    ji: 'Yang Ren' }, // Jia
  5: { lu: 'Tian Ji',   quan: 'Tian Liang',ke: 'Zi Wei',   ji: 'Tan Lang' },  // Yi
  6: { lu: 'Tian Tong', quan: 'Tian Ji',   ke: 'Wen Chang',ji: 'Lian Zhen' }, // Bing
  7: { lu: 'Tai Yin',   quan: 'Tian Tong', ke: 'Tian Ji',  ji: 'Ju Men' },   // Ding
  8: { lu: 'Tan Lang',  quan: 'Tai Yin',   ke: 'You Bi',   ji: 'Tian Ji' },  // Wu
  9: { lu: 'Wu Qu',     quan: 'Tan Lang',  ke: 'Tai Yin',  ji: 'Wen Qu' },   // Ji
}

function calcularTransformaciones(anio: number) {
  const idx = (anio - 4) % 10
  return TRANSFORMACIONES[((idx % 10) + 10) % 10]
}

// ── Colores por tipo de estrella ────────────────────────────
const COLOR_ESTRELLA: Record<string, string> = {
  '紫微': 'text-purple-300', '天機': 'text-blue-300', '太陽': 'text-yellow-400',
  '武曲': 'text-gray-300', '天同': 'text-green-300', '廉貞': 'text-red-400',
  '天府': 'text-amber-300', '太陰': 'text-blue-200', '貪狼': 'text-orange-400',
  '巨門': 'text-teal-300', '天相': 'text-pink-300', '天梁': 'text-green-400',
  '七殺': 'text-red-500', '破軍': 'text-violet-400',
}

export default function ZiWei() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [interpretacion, setInterpretacion] = useState('')
  const [cargando,       setCargando]       = useState(false)
  const [generado,       setGenerado]       = useState(false)
  const [errorMsg,       setErrorMsg]       = useState('')
  const [yaValorado,     setYaValorado]     = useState(false)
  const lecturaGuardadaRef                  = useRef(false)

  const nombre          = localStorage.getItem('nombre') || 'viajero'
  const signo           = localStorage.getItem('signo')  || 'Leo'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const horaNacimiento  = localStorage.getItem('horaNacimiento') || '12:00'
  const fechaHoy        = new Date().toISOString().split('T')[0]

  const horaNum = horaNacimiento === 'no sé' ? 12 : parseInt(horaNacimiento.split(':')[0])
  const lunar   = calcularLunar(fechaNacimiento)
  const zodiaco = calcularZodiaco(lunar.anioLunar)
  const trans   = calcularTransformaciones(lunar.anioLunar)

  const ziWeiPalacio   = ZI_WEI_POR_DIA[lunar.diaLunar] ?? 0
  const vidaPalacio    = calcularPalacioVida(lunar.mesLunar, horaNum)
  const estrellasMapa  = distribuirEstrellas(ziWeiPalacio)
  const estrellasVida  = estrellasMapa[vidaPalacio] ?? []

  const estrellaPrincipal = estrellasVida.length > 0
    ? ESTRELLAS.find(e => e.nombre === estrellasVida[0])
    : ESTRELLAS[0]

  useEffect(() => {
    if (!userPlan.cargando) analytics.registrarApertura()
  }, [userPlan.cargando])

  if (!userPlan.cargando && !userPlan.esPremium) {
    analytics.registrarPaywall(); navigate('/premium'); return null
  }

  const generar = async () => {
    setGenerado(true); setCargando(true); setErrorMsg('')
    const t0 = Date.now()

    const estrellasVidaNombres = estrellasVida.join(', ') || 'Sin estrella principal'
    const palacioPrincipal = PALACIOS[vidaPalacio]

    try {
      const prompt = [
        'Eres un maestro en Zi Wei Dou Shu (紫微斗數), la astrología imperial china.',
        'Responde SOLO con texto en español, en prosa continua. Sin asteriscos, sin guiones, sin cursivas, sin negritas, sin numeración, sin markdown.',
        'No empieces nunca con saludos ni con el nombre del usuario.',
        'Cada párrafo tiene máximo 3 frases cortas. Es obligatorio completar los 3 párrafos.',
        '',
        `El usuario se llama ${nombre}, su signo occidental es ${signo}.`,
        `Fecha de nacimiento: ${fechaNacimiento}. Hora: ${horaNacimiento === 'no sé' ? 'desconocida (usando mediodía)' : horaNacimiento}.`,
        `Año lunar: ${lunar.anioLunar} — Animal: ${zodiaco.animal} de ${zodiaco.elemento} ${zodiaco.yinYang}.`,
        `Día lunar: ${lunar.diaLunar}. Mes lunar: ${lunar.mesLunar}.`,
        `Posición de Zi Wei (Estrella Emperadora): Palacio ${ziWeiPalacio + 1} — ${PALACIOS[ziWeiPalacio].nombre}.`,
        `Palacio de la Vida: ${palacioPrincipal.nombre} (${palacioPrincipal.chino}) — ${palacioPrincipal.desc}.`,
        `Estrellas en el Palacio de la Vida: ${estrellasVidaNombres}.`,
        `Estrella principal: ${estrellaPrincipal?.nombre ?? 'Zi Wei'} — ${estrellaPrincipal?.desc ?? ''}.`,
        `4 Transformaciones del año ${lunar.anioLunar}: Hua Lu (prosperidad): ${trans.lu} · Hua Quan (poder): ${trans.quan} · Hua Ke (reputación): ${trans.ke} · Hua Ji (obstáculo): ${trans.ji}.`,
        '',
        'Escribe exactamente 3 párrafos separados por línea en blanco.',
        `Párrafo 1: el significado del Palacio de la Vida y la estrella principal — quién es ${nombre} en su esencia más profunda.`,
        'Párrafo 2: cómo las 4 transformaciones moldean su destino y qué energías predominan en su carta.',
        'Párrafo 3: un mensaje o consejo concreto basado en la posición de Zi Wei y el animal del zodiaco.',
        '',
        'Tono sabio, profundo y conectado con la filosofía taoísta. Termina en punto.',
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
            titulo: `Zi Wei · ${zodiaco.animal} de ${zodiaco.elemento} · ${fechaHoy}`,
            contenido: `Animal: ${zodiaco.animal} de ${zodiaco.elemento}\nPalacio de la Vida: ${palacioPrincipal.nombre}\nEstrella principal: ${estrellaPrincipal?.nombre}\n\n${result.texto}`,
            metadatos: { fecha: fechaHoy, nombre, animal: zodiaco.animal, palacioVida: palacioPrincipal.nombre },
          })
        }
      } else {
        setErrorMsg(result.error || 'Las estrellas guardan silencio. Inténtalo de nuevo.')
      }
    } catch (err) {
      console.error('[ZiWei]', err)
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

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <button onClick={() => navigate('/tradiciones')} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Zi Wei Dou Shu</p>
            <p className="text-purple-300 text-xs">Astrología imperial china</p>
          </div>
          <span className="text-purple-400 text-xs border border-purple-400/30 rounded-full px-2 py-0.5">✨ Premium</span>
        </div>

        {/* Animal y elemento */}
        <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5">
          <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">Tu carta natal</p>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-purple-900/30 border border-purple-500/30 rounded-2xl p-4 text-center flex-1">
              <p className="text-purple-300 text-xs mb-1">Animal</p>
              <p className="text-white text-lg font-bold">{zodiaco.animal}</p>
              <p className="text-white/40 text-xs">{zodiaco.elemento} · {zodiaco.yinYang}</p>
            </div>
            <div className="bg-purple-900/30 border border-purple-500/30 rounded-2xl p-4 text-center flex-1">
              <p className="text-purple-300 text-xs mb-1">Zi Wei 紫微</p>
              <p className="text-white text-lg font-bold">{PALACIOS[ziWeiPalacio].nombre}</p>
              <p className="text-white/40 text-xs">{PALACIOS[ziWeiPalacio].chino}</p>
            </div>
          </div>

          {/* Palacio de la Vida */}
          <div className="bg-[#1a0030] border border-purple-400/30 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-300 text-xs tracking-widest uppercase">Palacio de la Vida</p>
              <p className="text-white/40 text-xs">{PALACIOS[vidaPalacio].chino}</p>
            </div>
            <p className="text-white text-lg font-bold">{PALACIOS[vidaPalacio].nombre}</p>
            <p className="text-white/50 text-xs mt-1">{PALACIOS[vidaPalacio].desc}</p>
            {estrellasVida.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {estrellasVida.map(nombre => {
                  const e = ESTRELLAS.find(s => s.nombre === nombre)
                  return e ? (
                    <div key={nombre} className="bg-purple-900/40 border border-purple-500/20 rounded-xl px-3 py-1 flex items-center gap-1">
                      <span>{e.emoji}</span>
                      <span className="text-white text-xs font-semibold">{e.nombre}</span>
                      <span className="text-white/40 text-xs">{e.chino}</span>
                    </div>
                  ) : null
                })}
              </div>
            )}
          </div>
        </div>

        {/* 4 Transformaciones */}
        <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5">
          <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">4 Transformaciones · {lunar.anioLunar}</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-900/20 border border-green-500/20 rounded-2xl p-3">
              <p className="text-green-400 text-xs tracking-widest uppercase mb-1">Hua Lu · 祿</p>
              <p className="text-white text-sm font-semibold">{trans.lu}</p>
              <p className="text-white/40 text-xs">Prosperidad</p>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-2xl p-3">
              <p className="text-yellow-400 text-xs tracking-widest uppercase mb-1">Hua Quan · 權</p>
              <p className="text-white text-sm font-semibold">{trans.quan}</p>
              <p className="text-white/40 text-xs">Poder</p>
            </div>
            <div className="bg-blue-900/20 border border-blue-500/20 rounded-2xl p-3">
              <p className="text-blue-400 text-xs tracking-widest uppercase mb-1">Hua Ke · 科</p>
              <p className="text-white text-sm font-semibold">{trans.ke}</p>
              <p className="text-white/40 text-xs">Reputación</p>
            </div>
            <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-3">
              <p className="text-red-400 text-xs tracking-widest uppercase mb-1">Hua Ji · 忌</p>
              <p className="text-white text-sm font-semibold">{trans.ji}</p>
              <p className="text-white/40 text-xs">Obstáculo</p>
            </div>
          </div>
        </div>

        {/* Los 12 palacios */}
        <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5">
          <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">Los 12 Palacios</p>
          <div className="grid grid-cols-3 gap-2">
            {PALACIOS.map((palacio, idx) => {
              const estrellas = estrellasMapa[idx] ?? []
              const esVida = idx === vidaPalacio
              const esZiWei = idx === ziWeiPalacio
              return (
                <div
                  key={idx}
                  className={`rounded-xl p-2 border text-center ${
                    esVida ? 'bg-purple-900/40 border-purple-400/50' :
                    esZiWei ? 'bg-yellow-900/20 border-yellow-500/30' :
                    'bg-white/5 border-white/10'
                  }`}
                >
                  <p className="text-white/40 text-xs">{palacio.chino}</p>
                  <p className={`text-xs font-semibold ${esVida ? 'text-purple-300' : esZiWei ? 'text-yellow-300' : 'text-white'}`}>
                    {palacio.nombre}
                    {esVida ? ' 🏠' : esZiWei ? ' 👑' : ''}
                  </p>
                  {estrellas.slice(0, 2).map(s => {
                    const e = ESTRELLAS.find(x => x.nombre === s)
                    return e ? (
                      <p key={s} className="text-xs mt-0.5" style={{ fontSize: '10px' }}>{e.emoji} {e.chino}</p>
                    ) : null
                  })}
                </div>
              )
            })}
          </div>
        </div>

        {!generado ? (
          <div className="flex flex-col gap-3">
            <DisclaimerIA compact />
            <button
              onClick={generar}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
            >Leer mi carta estelar</button>
          </div>
        ) : (
          <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
            <p className="text-purple-400 text-xs tracking-widest uppercase mb-4">Lectura de la carta</p>
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
        )}

        {!cargando && interpretacion && (
          <>
            <DisclaimerIA />
            <Valoracion onValorar={handleValorar} />
            <Compartir
              titulo={`Zi Wei: ${zodiaco.animal} de ${zodiaco.elemento} — ${PALACIOS[vidaPalacio].nombre}`}
              texto={interpretacion}
              hashtags={['Universe', 'ZiWei', 'AstrologiaChina']}
            />
            <button onClick={() => navigate('/guia')} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">Explorar con mi Guía IA</button>
          </>
        )}
      </div>
    </PageLayout>
  )
}