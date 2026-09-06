import { useState } from 'react'
import { limpiarMarkdown } from '../components/TextoIA'
import { getMensajeDiario, getSignoSolar } from '../lib/motores/astroDaily'
import Compartir from '../components/Compartir'
import CtaUpsell from '../components/CtaUpsell'
import Valoracion from '../components/Valoracion'
import DisclaimerIA from '../components/DisclaimerIA'
import { supabase, useUserPlan, useAnalytics, registrarEvento } from '../lib/paginaHelper'

export default function AstroDaily() {
  const [interpretacion, setInterpretacion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [generado, setGenerado] = useState(false)
  const [fromCache, setFromCache] = useState(false)

  const { esPremium, userId } = useUserPlan()
  useAnalytics('astro-daily')

  const nombre = localStorage.getItem('nombre') || 'viajero'
  const fechaNacimiento = localStorage.getItem('fechaNacimiento') || '1991-08-15'
  const signo = getSignoSolar(fechaNacimiento)
  const mensajes = getMensajeDiario(signo)
  const hoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
  const fechaHoy = new Date().toISOString().split('T')[0]

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const generarLectura = async () => {
    const t0 = Date.now()
    setCargando(true)