// src/pages/OghamOracle.tsx
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

const HERRAMIENTA = 'ogham-oracle'


const OGHAM_IMAGENES: Record<string, string> = {
  'Beith':  '/ogham/Celtic_knot_carved_on_birch_20260911214738.jpeg',
  'Luis':   '/ogham/Rowan_wood_with_carved_knot_20260911214736.jpeg',
  'Fearn':  '/ogham/Alder_wood_with_glowing_symbol_20260911214734.jpeg',
  'Sail':   '/ogham/Willow_wood_with_glowing_knot_20260911214732.jpeg',
  'Nion':   '/ogham/Ash_tree_bark_carving_20260911214731.jpeg',
  'Huath':  '/ogham/Hawthorn_wood_with_celtic_knot_20260911214729.jpeg',
  'Dair':   '/ogham/Oak_bark_with_celtic_knot_20260911214727.jpeg',
  'Tinne':  '/ogham/Holly_with_berries_and_celtic_20260911214725.jpeg',
  'Coll':   '/ogham/Hazelnut_wood_with_celtic_knot_20260911214723.jpeg',
  'Quert':  '/ogham/Apple_wood_with_glowing_rose_20260911214721.jpeg',
}

const OGHAM = [
  { letra: 'ᚁ', nombre: 'Beith', arbol: 'Abedul', keywords: 'Nuevos comienzos · Purificación' },
  { letra: 'ᚂ', nombre: 'Luis', arbol: 'Serbal', keywords: 'Protección · Clarividencia' },
  { letra: 'ᚃ', nombre: 'Fearn', arbol: 'Aliso', keywords: 'Guía · Oráculo' },
  { letra: 'ᚄ', nombre: 'Sail', arbol: 'Sauce', keywords: 'Luna · Intuición' },
  { letra: 'ᚅ', nombre: 'Nion', arbol: 'Fresno', keywords: 'Conexión · Destino' },
  { letra: 'ᚆ', nombre: 'Huath', arbol: 'Espino', keywords: 'Purificación · Espera' },
  { letra: 'ᚇ', nombre: 'Dair', arbol: 'Roble', keywords: 'Fuerza · Sabiduría' },
  { letra: 'ᚈ', nombre: 'Tinne', arbol: 'Acebo', keywords: 'Equilibrio · Desafío' },
  { letra: 'ᚉ', nombre: 'Coll', arbol: 'Avellano', keywords: 'Creatividad · Conocimiento' },
  { letra: 'ᚊ', nombre: 'Quert', arbol: 'Manzano', keywords: 'Amor · Elección' },
]

export default function OghamOracle() {
  const navigate  = useNavigate()
  const userPlan  = useUserPlan()
  const analytics = useAnalytics(HERRAMIENTA, userPlan.esPremium)

  const [oghamSeleccionado, setOghamSeleccionado] = useState<typeof OGHAM[0] | null>(null)
  const [pregunta,          setPregunta]          = useState('')
  const [interpretacion,    setInterpretacion]    = useState('')
  const [cargando,          setCargando]          = useState(false)
  const [fase,              setFase]              = useState<'elegir' | 'preguntar' | 'resultado'>('elegir')
  const [errorMsg,          setErrorMsg]          = useState('')
  const [yaValorado,        setYaValorado]        = useState(false)
  const lecturaGuardadaRef                        = useRef(false)

  const nombre   = localStorage.getItem('nombre') || 'viajero'
  const signo    = localStorage.getItem('signo')  || 'Leo'
  const fechaHoy = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (!userPlan.cargando) analytics.registrarApertura()
  }, [userPlan.cargando])

  if (!userPlan.cargando && !userPlan.esPremium) {
    analytics.registrarPaywall(); navigate('/premium'); return null
  }

  const tirarOgham = () => {
    const aleatorio = OGHAM[Math.floor(Math.random() * OGHAM.length)]
    setOghamSeleccionado(aleatorio)
    setFase('preguntar')
  }

  const consultar = async () => {
    if (!oghamSeleccionado) return
    setFase('resultado'); setCargando(true); setErrorMsg('')
    const t0 = Date.now()

    try {
      const prompt = [
        'Eres un experto en el alfabeto Ogham y la tradición druídica celta.',
        'Escribe en español, en prosa fluida y continua. Sin asteriscos, sin guiones, sin markdown.',
        '',
        `El usuario se llama ${nombre}, signo ${signo}.`,
        `Ha recibido el Ogham ${oghamSeleccionado.nombre} (${oghamSeleccionado.arbol}), que representa: ${oghamSeleccionado.keywords}.`,
        pregunta.trim() ? `Su pregunta o situación: "${pregunta}".` : '',
        '',
        'Escribe una lectura de 2 párrafos.',
        `Párrafo 1: el mensaje del árbol ${oghamSeleccionado.arbol} y su sabiduría druídica para esta persona.`,
        'Párrafo 2: cómo aplicar esta energía celta a su vida hoy y una pregunta reflexiva de cierre.',
        '',
        'Tono místico y celta. Separa con línea en blanco. Termina en punto.',
      ].filter(Boolean).join('\n')

      const result = await llamarGemini({ herramienta: HERRAMIENTA, prompt, userId: userPlan.userId, usarLite: true, cacheable: false, maxTokens: 500 })

      if (!result.error && result.texto) {
        setInterpretacion(result.texto)
        if (userPlan.userId) await incrementarConsulta(userPlan.userId)
        analytics.registrarLectura({ desdCache: false, tiempoMs: Date.now() - t0, modeloIa: result.modelo })
        if (!lecturaGuardadaRef.current) {
          lecturaGuardadaRef.current = true
          await guardarLectura({ herramienta: HERRAMIENTA, titulo: `Ogham ${oghamSeleccionado.nombre} · ${fechaHoy}`, contenido: `Ogham: ${oghamSeleccionado.nombre}\n\n${result.texto}`, metadatos: { ogham: oghamSeleccionado.nombre, fecha: fechaHoy, nombre } })
        }
      } else { setErrorMsg('Los druidas guardan silencio. Inténtalo de nuevo.') }
    } catch (err) { console.error('[OghamOracle]', err); setErrorMsg('Error inesperado.') }
    finally { setCargando(false) }
  }

  const handleValorar = (valor: 1 | -1) => { if (yaValorado) return; setYaValorado(true); analytics.registrarValoracion(valor) }

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <button onClick={() => { if (fase === 'resultado') { setFase('preguntar'); setInterpretacion('') } else if (fase === 'preguntar') { setFase('elegir') } else navigate('/tradiciones') }} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Ogham Oracle</p>
            <p className="text-purple-300 text-xs">Alfabeto druídico celta</p>
          </div>
          <span className="text-purple-400 text-xs border border-purple-400/30 rounded-full px-2 py-0.5">✨ Premium</span>
        </div>

        {fase === 'elegir' && (
          <div className="flex flex-col gap-4">
            <p className="text-white/60 text-sm text-center leading-relaxed">Cierra los ojos. Formula tu intención. Cuando estés listo, deja que el bosque druídico elija tu símbolo.</p>
            <DisclaimerIA compact />
            <button onClick={tirarOgham} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">
              Tirar el Ogham
            </button>
            <div className="grid grid-cols-5 gap-2">
              {OGHAM.map(o => (
                <div key={o.nombre} className="bg-[#0d0015] border border-white/15 rounded-xl overflow-hidden">
                  <img src={OGHAM_IMAGENES[o.nombre]} alt={o.nombre} className="w-full aspect-square object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  <p className="text-white/60 text-xs text-center py-1">{o.nombre}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {fase === 'preguntar' && oghamSeleccionado && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-purple-500/50 rounded-3xl p-6 text-center">
              <img src={OGHAM_IMAGENES[oghamSeleccionado.nombre]} alt={oghamSeleccionado.nombre} className="w-32 h-32 object-cover rounded-2xl mx-auto mb-3" />
              <p className="text-white text-xl font-bold">{oghamSeleccionado.nombre}</p>
              <p className="text-purple-400 text-sm mt-1">{oghamSeleccionado.arbol}</p>
              <p className="text-white/50 text-xs mt-2">{oghamSeleccionado.keywords}</p>
            </div>
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-5">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">Tu pregunta (opcional)</p>
              <textarea value={pregunta} onChange={e => setPregunta(e.target.value)} placeholder="¿Qué quieres explorar?" rows={3} className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/30" />
            </div>
            <button onClick={consultar} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">Recibir el mensaje</button>
          </div>
        )}

        {fase === 'resultado' && oghamSeleccionado && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#0d0015] border border-purple-500/30 rounded-2xl p-4 flex items-center gap-3">
              <img src={OGHAM_IMAGENES[oghamSeleccionado.nombre]} alt={oghamSeleccionado.nombre} className="w-12 h-12 object-cover rounded-xl" />
              <div>
                <p className="text-white font-semibold text-sm">{oghamSeleccionado.nombre} · {oghamSeleccionado.arbol}</p>
                <p className="text-white/40 text-xs">{oghamSeleccionado.keywords}</p>
              </div>
            </div>
            <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6">
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-4">El bosque te habla</p>
              {cargando ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : errorMsg ? <p className="text-red-300 text-sm">{errorMsg}</p> : <TextoIA texto={interpretacion} />}
            </div>
            {!cargando && interpretacion && (
              <>
                <DisclaimerIA />
                <Valoracion onValorar={handleValorar} />
                <Compartir titulo={`Ogham ${oghamSeleccionado.nombre}`} texto={interpretacion} hashtags={['Universe', 'OghamOracle']} />
                <button onClick={() => navigate('/guia')} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-full hover:opacity-90 transition">Explorar con mi Guía IA</button>
                <button onClick={() => { setFase('elegir'); setInterpretacion(''); setPregunta(''); setOghamSeleccionado(null); lecturaGuardadaRef.current = false }} className="w-full text-purple-300/60 text-sm py-2">Nueva tirada</button>
              </>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
