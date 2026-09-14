// src/pages/PlantOracle.tsx
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

const HERRAMIENTA = 'plant-oracle'

type Planta = {
  id: string
  nombre: string
  nombreCientifico: string
  simbolismo: string
  tradiciones: string
  energia: string
  palabrasClave: string[]
}

const PLANTAS: Planta[] = [
  {
    id: 'lavanda', nombre: 'Lavanda', nombreCientifico: 'Lavandula angustifolia',
    simbolismo: 'Pureza · Paz · Protección',
    tradiciones: 'Mediterránea, celta, victoriana',
    energia: 'Calma, limpieza energética, sueño reparador, amor puro',
    palabrasClave: ['paz', 'calma', 'ansiedad', 'sueño', 'descanso', 'pureza', 'amor', 'limpieza', 'estrés'],
  },
  {
    id: 'salvia', nombre: 'Salvia', nombreCientifico: 'Salvia officinalis',
    simbolismo: 'Sabiduría · Purificación · Longevidad',
    tradiciones: 'Romana, indígena americana, medieval europea',
    energia: 'Claridad mental, limpieza de energías densas, sabiduría ancestral',
    palabrasClave: ['sabiduría', 'purificación', 'decisión', 'claridad', 'limpieza', 'ancestros', 'mente'],
  },
  {
    id: 'rosa', nombre: 'Rosa', nombreCientifico: 'Rosa centifolia',
    simbolismo: 'Amor · Belleza · Misterio divino',
    tradiciones: 'Griega, romana, sufí, cristiana',
    energia: 'Amor profundo, apertura del corazón, belleza interior, misterio',
    palabrasClave: ['amor', 'relación', 'pareja', 'corazón', 'belleza', 'romance', 'sentimientos', 'emoción'],
  },
  {
    id: 'manzanilla', nombre: 'Manzanilla', nombreCientifico: 'Matricaria chamomilla',
    simbolismo: 'Calma · Sueños proféticos · Renovación',
    tradiciones: 'Egipcia, céltica, germánica',
    energia: 'Serenidad, visiones oníricas, paciencia, ciclos naturales',
    palabrasClave: ['sueños', 'visiones', 'paciencia', 'renovación', 'ciclos', 'serenidad', 'nervios', 'calma'],
  },
  {
    id: 'menta', nombre: 'Menta', nombreCientifico: 'Mentha x piperita',
    simbolismo: 'Claridad · Transformación · Energía vital',
    tradiciones: 'Griega, romana, árabe',
    energia: 'Claridad mental, prosperidad, viajes, nuevos comienzos',
    palabrasClave: ['claridad', 'energía', 'prosperidad', 'dinero', 'viaje', 'comienzo', 'nuevo', 'mental'],
  },
  {
    id: 'romero', nombre: 'Romero', nombreCientifico: 'Rosmarinus officinalis',
    simbolismo: 'Memoria · Protección · Fidelidad eterna',
    tradiciones: 'Griega, romana, mediterránea, shakesperiana',
    energia: 'Memoria, lealtad, protección del hogar, recuerdo de los ancestros',
    palabrasClave: ['memoria', 'recuerdo', 'protección', 'hogar', 'fidelidad', 'lealtad', 'pasado', 'ancestros'],
  },
  {
    id: 'valeriana', nombre: 'Valeriana', nombreCientifico: 'Valeriana officinalis',
    simbolismo: 'Descanso profundo · Visiones · Equilibrio',
    tradiciones: 'Medieval europea, griega, nórdica',
    energia: 'Sueño profundo, visiones, calma del sistema nervioso, equilibrio',
    palabrasClave: ['descanso', 'sueño', 'insomnio', 'equilibrio', 'nervios', 'visiones', 'profundidad'],
  },
  {
    id: 'belladona', nombre: 'Belladona', nombreCientifico: 'Atropa belladonna',
    simbolismo: 'Transformación · Sombra · Misterio oscuro',
    tradiciones: 'Brujería europea, alquimia medieval, chamánica',
    energia: 'Transformación profunda, confrontación con la sombra, misterio, umbral',
    palabrasClave: ['transformación', 'sombra', 'misterio', 'cambio profundo', 'oscuridad', 'umbral', 'muerte simbólica'],
  },
  {
    id: 'verbena', nombre: 'Verbena', nombreCientifico: 'Verbena officinalis',
    simbolismo: 'Protección · Amor · Magia sagrada',
    tradiciones: 'Druídica, romana, victoriana',
    energia: 'Protección mágica, amor, creatividad, conexión espiritual',
    palabrasClave: ['protección', 'amor', 'magia', 'creatividad', 'espiritualidad', 'conexión', 'ritual'],
  },
  {
    id: 'ajenjo', nombre: 'Ajenjo', nombreCientifico: 'Artemisia absinthium',
    simbolismo: 'Intuición · Clarividencia · Viaje espiritual',
    tradiciones: 'Griega (Artemisa), druídica, alquímica',
    energia: 'Clarividencia, viajes astrales, intuición afilada, luna y misterio',
    palabrasClave: ['intuición', 'clarividencia', 'visión', 'luna', 'misterio', 'viaje astral', 'percepción'],
  },
  {
    id: 'tomillo', nombre: 'Tomillo', nombreCientifico: 'Thymus vulgaris',
    simbolismo: 'Valentía · Purificación · Fuerza guerrera',
    tradiciones: 'Griega, romana, celta, medieval caballeresca',
    energia: 'Coraje, purificación, fuerza ante la adversidad, acción',
    palabrasClave: ['valentía', 'coraje', 'fuerza', 'acción', 'adversidad', 'purificación', 'guerra', 'obstáculo'],
  },
  {
    id: 'milenrama', nombre: 'Milenrama', nombreCientifico: 'Achillea millefolium',
    simbolismo: 'Sanación · Protección guerrera · Límites',
    tradiciones: 'Griega (Aquiles), nórdica, china (I Ching)',
    energia: 'Sanación de heridas, protección, establecer límites, cicatrización',
    palabrasClave: ['sanación', 'herida', 'límites', 'protección', 'cicatrización', 'recuperación', 'dolor'],
  },
  {
    id: 'hinojo', nombre: 'Hinojo', nombreCientifico: 'Foeniculum vulgare',
    simbolismo: 'Visión · Coraje · Claridad de propósito',
    tradiciones: 'Griega (Prometeo), romana, medieval',
    energia: 'Visión interior, coraje para actuar, claridad de propósito, fuerza solar',
    palabrasClave: ['propósito', 'visión', 'coraje', 'claridad', 'sol', 'fuerza', 'dirección', 'futuro'],
  },
  {
    id: 'oregano', nombre: 'Orégano', nombreCientifico: 'Origanum vulgare',
    simbolismo: 'Alegría · Prosperidad · Amor duradero',
    tradiciones: 'Griega (monte Olimpo), romana, mediterránea',
    energia: 'Alegría, abundancia, amor que perdura, felicidad del hogar',
    palabrasClave: ['alegría', 'prosperidad', 'abundancia', 'felicidad', 'hogar', 'amor', 'familia', 'celebración'],
  },
  {
    id: 'laurel', nombre: 'Laurel', nombreCientifico: 'Laurus nobilis',
    simbolismo: 'Victoria · Sabiduría · Profecía',
    tradiciones: 'Griega (Apolo, Delfos), romana imperial, medieval',
    energia: 'Éxito, reconocimiento, profecía, gloria merecida',
    palabrasClave: ['éxito', 'victoria', 'reconocimiento', 'logro', 'profecía', 'gloria', 'méritos', 'trabajo'],
  },
  {
    id: 'hiperico', nombre: 'Hipérico', nombreCientifico: 'Hypericum perforatum',
    simbolismo: 'Luz · Protección solar · Alegría del alma',
    tradiciones: 'Medieval cristiana, celta (solsticio), griega',
    energia: 'Luz en la oscuridad, protección contra sombras, alegría interior',
    palabrasClave: ['depresión', 'luz', 'oscuridad', 'alegría', 'solsticio', 'sol', 'protección', 'tristeza', 'ánimo'],
  },
  {
    id: 'muerdago', nombre: 'Muérdago', nombreCientifico: 'Viscum album',
    simbolismo: 'Fertilidad · Vida eterna · Puente entre mundos',
    tradiciones: 'Druídica (la más sagrada), nórdica (Baldur), celta',
    energia: 'Inmortalidad, conexión entre cielo y tierra, fertilidad, magia druídica',
    palabrasClave: ['inmortalidad', 'conexión', 'puente', 'fertilidad', 'druida', 'sagrado', 'mundos', 'magia'],
  },
  {
    id: 'mandragora', nombre: 'Mandrágora', nombreCientifico: 'Mandragora officinarum',
    simbolismo: 'Poder mágico · Atracción · Misterio profundo',
    tradiciones: 'Alquímica medieval, árabe, bíblica, brujería europea',
    energia: 'Poder de manifestación, atracción, misterios profundos, magia poderosa',
    palabrasClave: ['poder', 'manifestación', 'atracción', 'magia', 'misterio', 'alquimia', 'deseo', 'secreto'],
  },
  {
    id: 'helenboro', nombre: 'Heléboro', nombreCientifico: 'Helleborus niger',
    simbolismo: 'Transformación · Cierre de ciclos · Renacimiento',
    tradiciones: 'Griega (locura y cura), medieval, alquímica',
    energia: 'Fin de ciclos, purificación profunda, renacimiento en la oscuridad',
    palabrasClave: ['cierre', 'final', 'transformación', 'renacimiento', 'ciclo', 'oscuridad', 'invierno', 'purga'],
  },
  {
    id: 'aconito', nombre: 'Acónito', nombreCientifico: 'Aconitum napellus',
    simbolismo: 'Protección extrema · Transición · Poder liminal',
    tradiciones: 'Griega (Hécate, Cerbero), nórdica, brujería europea',
    energia: 'Protección poderosa, transiciones difíciles, poder en los umbrales',
    palabrasClave: ['protección extrema', 'transición', 'umbral', 'poder', 'límite', 'paso', 'frontera', 'guardián'],
  },
]

function seleccionarPlanta(consulta: string, signo: string): Planta {
  const texto = consulta.toLowerCase()

  // Busca coincidencias por palabras clave
  let mejorPlanta: Planta | null = null
  let maxCoincidencias = 0

  for (const planta of PLANTAS) {
    const coincidencias = planta.palabrasClave.filter(kw => texto.includes(kw)).length
    if (coincidencias > maxCoincidencias) {
      maxCoincidencias = coincidencias
      mejorPlanta = planta
    }
  }

  // Si hay coincidencias claras, usa esa planta
  if (mejorPlanta && maxCoincidencias > 0) return mejorPlanta

  // Si no, selecciona basándose en la semilla del día + signo
  const hoy = new Date()
  const semilla = hoy.getFullYear() * 10000 + (hoy.getMonth() + 1) * 100 + hoy.getDate()
  const indiceSigno = ['Aries','Tauro','Géminis','Cáncer','Leo','Virgo','Libra','Escorpio','Sagitario','Capricornio','Acuario','Piscis'].indexOf(signo)
  const indice = (semilla + Math.max(0, indiceSigno)) % PLANTAS.length
  return PLANTAS[indice]
}

export default function PlantOracle() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [pregunta,       setPregunta]       = useState('')
  const [planta,         setPlanta]         = useState<Planta | null>(null)
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando,       setCargando]       = useState(false)
  const [revelando,      setRevelando]      = useState(false)
  const [fase,           setFase]           = useState<'preguntar' | 'resultado'>('preguntar')
  const [errorMsg,       setErrorMsg]       = useState('')
  const [yaValorado,     setYaValorado]     = useState(false)
  const [imgError,       setImgError]       = useState(false)
  const lecturaGuardadaRef                  = useRef(false)

  const nombre   = localStorage.getItem('nombre') || 'viajero'
  const signo    = localStorage.getItem('signo')  || 'Leo'
  const fechaHoy = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (!userPlan.cargando) analytics.registrarApertura()
  }, [userPlan.cargando])

  if (!userPlan.cargando && !userPlan.esPremium) {
    analytics.registrarPaywall(); navigate('/premium'); return null
  }

  const consultar = async () => {
    if (!pregunta.trim()) return
    setRevelando(true)
    setImgError(false)

    // Selección de planta en frontend — sin coste
    const plantaElegida = seleccionarPlanta(pregunta, signo)
    setPlanta(plantaElegida)

    await new Promise(r => setTimeout(r, 1000))
    setRevelando(false)
    setFase('resultado')
    setCargando(true)
    setErrorMsg('')
    const t0 = Date.now()

    try {
      const prompt = [
        'Eres un experto en simbolismo botánico y plantas sagradas en tradiciones espirituales del mundo.',
        `El usuario se llama ${nombre}, signo ${signo}. Su consulta: "${pregunta}".`,
        `La planta que el oráculo ha revelado es ${plantaElegida.nombre} (${plantaElegida.nombreCientifico}).`,
        `Simbolismo: ${plantaElegida.simbolismo}. Tradiciones: ${plantaElegida.tradiciones}. Energía: ${plantaElegida.energia}.`,
        '',
        'Escribe en español, en prosa poética y sabia, sin listas ni asteriscos. Sin saludar ni usar el nombre al inicio.',
        'Escribe exactamente 3 párrafos separados por línea en blanco. Cada párrafo máximo 3 frases.',
        `Párrafo 1: por qué ${plantaElegida.nombre} ha respondido a esta consulta — qué ve en la situación y qué mensaje trae desde sus tradiciones.`,
        `Párrafo 2: cómo la energía de ${plantaElegida.nombre} ilumina el momento actual y qué aspecto de la vida está activando.`,
        'Párrafo 3: cómo trabajar con esta energía botánica de forma práctica hoy, y una pregunta reflexiva de cierre.',
        'Tono poético, profundo y práctico. Termina en punto.',
      ].join('\n')

      const result = await llamarGemini({
        herramienta: HERRAMIENTA, prompt,
        userId: userPlan.userId, usarLite: true, cacheable: false, maxTokens: 500,
      })

      if (result.error || !result.texto) {
        setErrorMsg('El jardín guarda silencio. Inténtalo de nuevo.')
        return
      }

      setInterpretacion(result.texto)
      if (userPlan.userId) await incrementarConsulta(userPlan.userId)
      analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: 'lite' })
      if (!lecturaGuardadaRef.current) {
        lecturaGuardadaRef.current = true
        await guardarLectura({
          herramienta: HERRAMIENTA,
          titulo: `Plant Oracle · ${plantaElegida.nombre} · ${fechaHoy}`,
          contenido: `Consulta: "${pregunta}"\nPlanta: ${plantaElegida.nombre}\n\n${result.texto}`,
          metadatos: { pregunta, planta: plantaElegida.id, fecha: fechaHoy, nombre, signo },
        })
      }
    } catch (err) {
      console.error('[PlantOracle]', err)
      setErrorMsg('Error inesperado. Inténtalo de nuevo.')
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
    setFase('preguntar'); setPlanta(null); setInterpretacion('')
    setErrorMsg(''); setPregunta(''); setImgError(false)
    lecturaGuardadaRef.current = false
  }

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">

        <div className="flex items-center">
          <button onClick={() => fase !== 'preguntar' ? resetear() : navigate('/tradiciones')} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Plant Oracle</p>
            <p className="text-purple-300 text-xs">Simbolismo botánico sagrado</p>
          </div>
          <span className="text-purple-400 text-xs border border-purple-400/30 rounded-full px-2 py-0.5">✨ Premium</span>
        </div>

        {/* FASE: PREGUNTAR */}
        {fase === 'preguntar' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-green-900/40 rounded-3xl p-6 text-center">
              <p className="text-4xl mb-3">🌿</p>
              <p className="text-green-400 text-xs tracking-widest uppercase mb-2">Oráculo Botánico</p>
              <p className="text-white/60 text-xs leading-relaxed">Cada planta lleva siglos de sabiduría espiritual. El oráculo elige la planta que resuena con tu consulta — desde las ilustraciones botánicas de Köhler (1887).</p>
            </div>
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-green-400 text-xs tracking-widest uppercase mb-3">Tu consulta al jardín</p>
              <textarea
                value={pregunta}
                onChange={e => setPregunta(e.target.value)}
                placeholder="¿Qué situación o pregunta quieres explorar?"
                rows={4}
                className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30"
              />
            </div>
            <DisclaimerIA compact />
            <button
              onClick={consultar}
              disabled={!pregunta.trim() || revelando}
              className="w-full bg-gradient-to-r from-green-800 to-emerald-700 text-white font-semibold py-4 rounded-full hover:opacity-90 transition disabled:opacity-40"
            >
              {revelando ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-pulse">🌿</span> El jardín elige tu planta...
                </span>
              ) : 'Consultar el Plant Oracle'}
            </button>
          </div>
        )}

        {/* FASE: RESULTADO */}
        {fase === 'resultado' && planta && (
          <div className="flex flex-col gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <p className="text-white/50 text-xs italic">"{pregunta}"</p>
            </div>

            {/* Ilustración botánica vintage */}
            <div className="bg-[#f5f0e8] rounded-3xl overflow-hidden border border-green-900/30">
              {!imgError ? (
                <img
                  src={`/plantas/${planta.id}.jpg`}
                  alt={`${planta.nombre} — ilustración botánica Köhler 1887`}
                  className="w-full object-contain max-h-80"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex items-center justify-center h-48 text-6xl">🌿</div>
              )}
            </div>

            {/* Info de la planta */}
            <div className="bg-[#0d0015] border border-green-900/30 rounded-3xl p-5">
              <p className="text-green-400 text-xs tracking-widest uppercase mb-1">Planta revelada</p>
              <p className="text-white text-xl font-bold mb-1">{planta.nombre}</p>
              <p className="text-green-700 text-xs mb-2 italic">{planta.nombreCientifico}</p>
              <p className="text-green-400 text-xs mb-3">{planta.simbolismo}</p>
              <div className="border-t border-white/10 pt-3">
                <p className="text-white/40 text-xs">Tradiciones: {planta.tradiciones}</p>
              </div>
            </div>

            {/* Interpretación IA */}
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-green-400 text-xs tracking-widest uppercase mb-4">El mensaje del jardín</p>
              {cargando ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : errorMsg ? (
                <p className="text-red-300 text-sm">{errorMsg}</p>
              ) : (
                <TextoIA texto={interpretacion} />
              )}
            </div>

            {/* Nota Köhler */}
            <p className="text-white/20 text-xs text-center">
              Ilustración: Köhler's Medizinal-Pflanzen, 1887 · Dominio público
            </p>

            
                {!cargando && interpretacion && (
              <>
                <DisclaimerIA />
                <Valoracion onValorar={handleValorar} />
                <Compartir
                  titulo={`Plant Oracle · ${planta.nombre}`}
                  texto={`${planta.nombre} — ${planta.simbolismo}\n\n${interpretacion}`}
                  hashtags={['Universe', 'PlantOracle', planta.nombre]}
                />
                <button onClick={() => navigate('/guia')} className="w-full bg-gradient-to-r from-green-800 to-emerald-700 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">Explorar con mi Guía IA</button>
                <button onClick={resetear} className="w-full text-green-700/60 text-sm py-2">Nueva consulta</button>
              </>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}