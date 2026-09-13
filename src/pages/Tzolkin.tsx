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

const HERRAMIENTA = 'tzolkin'

const SELLOS = [
  { id: 0,  nombre: 'Dragón',    maya: 'Imix',     img: '/tzolkin/imix.jpg',     elemento: 'Agua',   color: 'text-red-400',    desc: 'Nacimiento · Nutrición · Ser' },
  { id: 1,  nombre: 'Viento',    maya: 'Ik',       img: '/tzolkin/ik.jpg',       elemento: 'Aire',   color: 'text-white',      desc: 'Espíritu · Comunicación · Aliento' },
  { id: 2,  nombre: 'Noche',     maya: 'Akbal',    img: '/tzolkin/akbal.jpg',    elemento: 'Tierra', color: 'text-indigo-400', desc: 'Sueño · Intuición · Abundancia' },
  { id: 3,  nombre: 'Semilla',   maya: 'Kan',      img: '/tzolkin/kan.jpg',      elemento: 'Tierra', color: 'text-yellow-400', desc: 'Florecimiento · Objetivo · Semilla' },
  { id: 4,  nombre: 'Serpiente', maya: 'Chicchan', img: '/tzolkin/chicchan.jpg', elemento: 'Fuego',  color: 'text-red-500',    desc: 'Fuerza vital · Instinto · Pasión' },
  { id: 5,  nombre: 'Muerte',    maya: 'Cimi',     img: '/tzolkin/cimi.jpg',     elemento: 'Tierra', color: 'text-gray-400',   desc: 'Transformación · Entrega · Ciclo' },
  { id: 6,  nombre: 'Venado',    maya: 'Manik',    img: '/tzolkin/manik.jpg',    elemento: 'Aire',   color: 'text-green-400',  desc: 'Gracia · Cooperación · Herramienta' },
  { id: 7,  nombre: 'Estrella',  maya: 'Lamat',    img: '/tzolkin/lamat.jpg',    elemento: 'Agua',   color: 'text-yellow-300', desc: 'Armonía · Belleza · Elegancia' },
  { id: 8,  nombre: 'Luna',      maya: 'Muluc',    img: '/tzolkin/muluc.jpg',    elemento: 'Agua',   color: 'text-blue-400',   desc: 'Flujo · Emoción · Purificación' },
  { id: 9,  nombre: 'Perro',     maya: 'Oc',       img: '/tzolkin/oc.jpg',       elemento: 'Aire',   color: 'text-orange-300', desc: 'Lealtad · Amor · Compasión' },
  { id: 10, nombre: 'Mono',      maya: 'Chuen',    img: '/tzolkin/chuen.jpg',    elemento: 'Aire',   color: 'text-purple-400', desc: 'Juego · Magia · Arte' },
  { id: 11, nombre: 'Humano',    maya: 'Eb',       img: '/tzolkin/eb.jpg',       elemento: 'Tierra', color: 'text-amber-400',  desc: 'Libre albedrío · Sabiduría · Camino' },
  { id: 12, nombre: 'Caña',      maya: 'Ben',      img: '/tzolkin/ben.jpg',      elemento: 'Tierra', color: 'text-green-500',  desc: 'Tiempo · Guía · Justicia' },
  { id: 13, nombre: 'Jaguar',    maya: 'Ix',       img: '/tzolkin/ix.jpg',       elemento: 'Tierra', color: 'text-yellow-500', desc: 'Magia · Integridad · Corazón' },
  { id: 14, nombre: 'Águila',    maya: 'Men',      img: '/tzolkin/men.jpg',      elemento: 'Aire',   color: 'text-blue-300',   desc: 'Visión · Mente · Creación' },
  { id: 15, nombre: 'Guerrero',  maya: 'Cib',      img: '/tzolkin/cib.jpg',      elemento: 'Fuego',  color: 'text-gray-300',   desc: 'Inteligencia · Fuerza · Perdón' },
  { id: 16, nombre: 'Tierra',    maya: 'Caban',    img: '/tzolkin/caban.jpg',    elemento: 'Tierra', color: 'text-teal-400',   desc: 'Evolución · Sintonía · Navegación' },
  { id: 17, nombre: 'Espejo',    maya: 'Etznab',   img: '/tzolkin/etznab.jpg',   elemento: 'Aire',   color: 'text-cyan-300',   desc: 'Reflejo · Sin fin · Verdad' },
  { id: 18, nombre: 'Tormenta',  maya: 'Cauac',    img: '/tzolkin/cauac.jpg',    elemento: 'Agua',   color: 'text-violet-400', desc: 'Energía · Autogeneración · Catalizar' },
  { id: 19, nombre: 'Sol',       maya: 'Ahau',     img: '/tzolkin/ahau.jpg',     elemento: 'Fuego',  color: 'text-yellow-400', desc: 'Iluminación · Flor · Ascensión' },
]

const TONOS = [
  { num: 1,  nombre: 'Magnético',     keyword: 'Unificar · Atraer · Propósito' },
  { num: 2,  nombre: 'Lunar',         keyword: 'Polarizar · Estabilizar · Desafío' },
  { num: 3,  nombre: 'Eléctrico',     keyword: 'Activar · Vincular · Servicio' },
  { num: 4,  nombre: 'Autoexistente', keyword: 'Definir · Medir · Forma' },
  { num: 5,  nombre: 'Overtono',      keyword: 'Empoderar · Comandar · Radiancia' },
  { num: 6,  nombre: 'Rítmico',       keyword: 'Organizar · Equilibrar · Igualdad' },
  { num: 7,  nombre: 'Resonante',     keyword: 'Canalizar · Inspirar · Sintonía' },
  { num: 8,  nombre: 'Galáctico',     keyword: 'Armonizar · Modelar · Integridad' },
  { num: 9,  nombre: 'Solar',         keyword: 'Pulsar · Realizar · Intención' },
  { num: 10, nombre: 'Planetario',    keyword: 'Perfeccionar · Producir · Manifestar' },
  { num: 11, nombre: 'Espectral',     keyword: 'Disolver · Liberar · Liberación' },
  { num: 12, nombre: 'Cristal',       keyword: 'Dedicar · Universalizar · Cooperación' },
  { num: 13, nombre: 'Cósmico',       keyword: 'Trascender · Elaborar · Presencia' },
]

function fechaAJuliano(anio: number, mes: number, dia: number): number {
  const a = Math.floor((14 - mes) / 12)
  const y = anio + 4800 - a
  const m = mes + 12 * a - 3
  return dia + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045
}

function calcularKin(fecha: string) {
  const [anioStr, mesStr, diaStr] = fecha.split('-')
  const jd = fechaAJuliano(parseInt(anioStr), parseInt(mesStr), parseInt(diaStr))
  const tzolkinPos = (jd - 584283) % 260
  const pos = ((tzolkinPos % 260) + 260) % 260
  const selloIdx = pos % 20
  const tonoIdx  = pos % 13
  const sello = SELLOS[selloIdx]
  const tono  = TONOS[tonoIdx]
  const kin   = pos + 1
  const analogaIdx  = (selloIdx + 6)  % 20
  const antipodaIdx = (selloIdx + 10) % 20
  const ocultaIdx   = 19 - selloIdx
  const guiaIdx     = (selloIdx + (tonoIdx % 5) * 4) % 20
  return {
    kin, sello, tono,
    oraculo: {
      analoga:  SELLOS[analogaIdx],
      antipoda: SELLOS[antipodaIdx],
      oculta:   SELLOS[ocultaIdx],
      guia:     SELLOS[guiaIdx],
    }
  }
}

function ImagenSello({ sello, size = 'md' }: { sello: typeof SELLOS[0], size?: 'sm' | 'md' | 'lg' }) {
  const [error, setError] = useState(false)
  const sizes = { sm: 'w-12 h-12', md: 'w-20 h-20', lg: 'w-28 h-28' }
  if (!error) {
    return (
      <img
        src={sello.img}
        alt={sello.nombre}
        className={`${sizes[size]} object-cover rounded-xl`}
        onError={() => setError(true)}
      />
    )
  }
  return (
    <div className={`${sizes[size]} bg-[#1a0030] rounded-xl flex items-center justify-center`}>
      <p className={`text-xs font-bold ${sello.color}`}>{sello.maya}</p>
    </div>
  )
}

export default function Tzolkin() {
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
  const fechaHoy        = new Date().toISOString().split('T')[0]

  const kinNatal = calcularKin(fechaNacimiento)
  const kinHoy   = calcularKin(fechaHoy)

  useEffect(() => {
    if (!userPlan.cargando) analytics.registrarApertura()
  }, [userPlan.cargando])

  if (!userPlan.cargando && !userPlan.esPremium) {
    analytics.registrarPaywall(); navigate('/premium'); return null
  }

  const generar = async () => {
    setGenerado(true); setCargando(true); setErrorMsg('')
    const t0 = Date.now()

    try {
      const prompt = [
        'Eres un experto en el calendario sagrado maya Tzolkin y su significado espiritual.',
        'Responde SOLO con texto en español, en prosa continua. Sin asteriscos, sin guiones, sin cursivas, sin negritas, sin numeración, sin markdown.',
        'No empieces nunca con saludos ni con el nombre del usuario.',
        'Cada párrafo tiene máximo 3 frases cortas. Es obligatorio completar los 3 párrafos.',
        '',
        `El usuario se llama ${nombre}, su signo occidental es ${signo}.`,
        `Kin natal: ${kinNatal.kin} — Sello ${kinNatal.sello.nombre} (${kinNatal.sello.maya}), Tono ${kinNatal.tono.num} ${kinNatal.tono.nombre}.`,
        `Significado sello natal: ${kinNatal.sello.desc}.`,
        `Energías del oráculo natal: Análoga ${kinNatal.oraculo.analoga.nombre}, Guía ${kinNatal.oraculo.guia.nombre}, Antípoda ${kinNatal.oraculo.antipoda.nombre}, Oculta ${kinNatal.oraculo.oculta.nombre}.`,
        `Kin del día de hoy: ${kinHoy.kin} — Sello ${kinHoy.sello.nombre}, Tono ${kinHoy.tono.num} ${kinHoy.tono.nombre}.`,
        '',
        'Escribe exactamente 3 párrafos separados por línea en blanco.',
        `Párrafo 1: el significado del Kin natal ${kinNatal.kin} — ${kinNatal.sello.nombre} con Tono ${kinNatal.tono.nombre} — y lo que revela sobre la esencia de ${nombre}.`,
        `Párrafo 2: cómo la energía del día de hoy (${kinHoy.sello.nombre} con Tono ${kinHoy.tono.nombre}) interactúa con el Kin natal de ${nombre}.`,
        'Párrafo 3: un mensaje o invitación concreta para este día basada en ambas energías.',
        '',
        'Tono evocador, sabio y conectado con la cosmovisión maya. Termina en punto.',
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
            titulo: `Tzolkin · Kin ${kinNatal.kin} · ${fechaHoy}`,
            contenido: `Kin natal: ${kinNatal.kin} — ${kinNatal.sello.nombre} Tono ${kinNatal.tono.nombre}\nKin hoy: ${kinHoy.kin} — ${kinHoy.sello.nombre} Tono ${kinHoy.tono.nombre}\n\n${result.texto}`,
            metadatos: { fecha: fechaHoy, nombre, kinNatal: kinNatal.kin, kinHoy: kinHoy.kin },
          })
        }
      } else {
        setErrorMsg(result.error || 'El calendario guarda silencio. Inténtalo de nuevo.')
      }
    } catch (err) {
      console.error('[Tzolkin]', err)
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
            <p className="text-white font-semibold text-sm">Tzolkín Maya</p>
            <p className="text-purple-300 text-xs">Calendario sagrado maya</p>
          </div>
          <span className="text-purple-400 text-xs border border-purple-400/30 rounded-full px-2 py-0.5">✨ Premium</span>
        </div>

        {/* Kin Natal */}
        <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5">
          <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">Tu Kin natal</p>
          <div className="flex items-center gap-4">
            <ImagenSello sello={kinNatal.sello} size="lg" />
            <div className="flex-1">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Kin {kinNatal.kin}</p>
              <p className={`text-xl font-bold ${kinNatal.sello.color}`}>{kinNatal.sello.nombre}</p>
              <p className="text-white/50 text-xs">{kinNatal.sello.maya}</p>
              <p className="text-white font-semibold mt-1">Tono {kinNatal.tono.num} — {kinNatal.tono.nombre}</p>
              <p className="text-white/50 text-xs mt-1">{kinNatal.tono.keyword}</p>
              <p className={`text-xs mt-2 ${kinNatal.sello.color}`}>{kinNatal.sello.desc}</p>
            </div>
          </div>

          {/* Oráculo de 4 energías */}
          <div className="border-t border-white/10 mt-4 pt-4">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Oráculo de energías</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Análoga',  sello: kinNatal.oraculo.analoga },
                { label: 'Guía',     sello: kinNatal.oraculo.guia },
                { label: 'Antípoda', sello: kinNatal.oraculo.antipoda },
                { label: 'Oculta',   sello: kinNatal.oraculo.oculta },
              ].map(({ label, sello }) => (
                <div key={label} className="text-center flex flex-col items-center gap-1">
                  <ImagenSello sello={sello} size="sm" />
                  <p className={`text-xs font-semibold ${sello.color}`}>{sello.nombre}</p>
                  <p className="text-white/30 text-xs">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kin del día */}
        <div className="bg-[#0d0015] border border-purple-500/30 rounded-3xl p-5">
          <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">
            Kin de hoy · {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <div className="flex items-center gap-4">
            <ImagenSello sello={kinHoy.sello} size="md" />
            <div className="flex-1">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Kin {kinHoy.kin}</p>
              <p className={`text-lg font-bold ${kinHoy.sello.color}`}>{kinHoy.sello.nombre}</p>
              <p className="text-white/50 text-xs">{kinHoy.sello.maya}</p>
              <p className="text-white font-semibold mt-1">Tono {kinHoy.tono.num} — {kinHoy.tono.nombre}</p>
              <p className="text-white/50 text-xs mt-1">{kinHoy.tono.keyword}</p>
            </div>
          </div>
        </div>

        {!generado ? (
          <div className="flex flex-col gap-3">
            <DisclaimerIA compact />
            <button
              onClick={generar}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition"
            >Recibir mensaje del día</button>
          </div>
        ) : (
          <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
            <p className="text-purple-400 text-xs tracking-widest uppercase mb-4">Mensaje del calendario</p>
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
              titulo={`Tzolkin: Kin ${kinNatal.kin} — ${kinNatal.sello.nombre} ${kinNatal.tono.nombre}`}
              texto={interpretacion}
              hashtags={['Universe', 'Tzolkin', 'Maya']}
            />
            <button onClick={() => navigate('/guia')} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">Explorar con mi Guía IA</button>
          </>
        )}
      </div>
    </PageLayout>
  )
}