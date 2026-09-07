// src/pages/ExpertoUnirse.tsx
// ============================================================
// UNIVERSE — Formulario de solicitud para nuevos expertos
// ============================================================

import { useState } from 'react'
import { supabase } from '../lib/supabase'

const ESPECIALIDADES_OPCIONES = [
  'Tarot', 'Astrología', 'Runas', 'Numerología', 'I Ching',
  'Carta natal', 'Oráculos', 'Relaciones', 'Desarrollo personal',
  'Chamanismo', 'Energía', 'Meditación', 'Sueños', 'Magia',
]

const METODOS_OPCIONES = [
  'Tarot Rider-Waite', 'Tarot Marsella', 'Tirada de 3 cartas',
  'Cruz Celta', 'Carta natal', 'Tránsitos planetarios',
  'Runas Futhark', 'Numerología pitagórica', 'I Ching',
  'Péndulo', 'Lectura de aura', 'Canalización',
]

export default function ExpertoUnirse() {
  const [paso, setPaso] = useState<1 | 2 | 3>(1)
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const [form, setForm] = useState({
    nombre: '',
    nombre_artistico: '',
    email: '',
    bio: '',
    especialidades: [] as string[],
    metodos: [] as string[],
    precio_minuto: '3.50',
    idiomas: 'Español',
    experiencia_anos: '',
    motivacion: '',
  })

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  const toggleEspecialidad = (esp: string) => {
    setForm(f => ({
      ...f,
      especialidades: f.especialidades.includes(esp)
        ? f.especialidades.filter(e => e !== esp)
        : [...f.especialidades, esp]
    }))
  }

  const toggleMetodo = (met: string) => {
    setForm(f => ({
      ...f,
      metodos: f.metodos.includes(met)
        ? f.metodos.filter(m => m !== met)
        : [...f.metodos, met]
    }))
  }

  const enviar = async () => {
    setEnviando(true)
    try {
      await supabase.from('analytics_eventos').insert({
        herramienta: 'expertos',
        accion: 'solicitud_experto',
        metadatos: { ...form },
      })
      setEnviado(true)
    } catch {
      setEnviado(true)
    }
    setEnviando(false)
  }

  const paso1Valido = form.nombre.trim() && form.nombre_artistico.trim() && form.email.trim() && form.bio.trim().length > 50
  const paso2Valido = form.especialidades.length > 0 && form.metodos.length > 0
  const paso3Valido = form.precio_minuto && form.experiencia_anos && form.motivacion.trim().length > 30

  if (enviado) {
    return (
      <div className="min-h-screen text-white flex flex-col items-center justify-center relative px-6" style={bgStyle}>
        <div className="absolute inset-0 bg-[#0d0015]" />
        <div className="relative z-10 text-center flex flex-col items-center gap-5 max-w-sm">
          <p className="text-7xl">✨</p>
          <div>
            <p className="text-white font-bold text-2xl mb-2">¡Solicitud recibida!</p>
            <p className="text-white/90 text-sm leading-relaxed">
              Hemos recibido tu solicitud para unirte como experto en UNIVERSE. Revisaremos tu perfil y nos pondremos en contacto en los próximos 3-5 días laborables.
            </p>
          </div>
          <div className="bg-[#0d0015] border border-white/15 rounded-2xl p-4 w-full text-left">
            <p className="text-purple-300 text-xs tracking-widest uppercase mb-2">Próximos pasos</p>
            <div className="flex flex-col gap-2">
              {['Revisión de tu perfil y experiencia', 'Entrevista de verificación (15 min)', 'Configuración de tu perfil público', 'Activación y primera sesión'].map((paso, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-purple-400 text-xs font-bold">{i + 1}.</span>
                  <p className="text-white text-sm">{paso}</p>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => window.location.href = '/expertos'} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-full">
            Explorar el directorio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-[#0d0015]" />

      {/* Header */}
      <div className="relative z-10 flex items-center px-4 py-4 border-b border-white/10">
        <button onClick={() => paso === 1 ? window.location.href = '/expertos' : setPaso(p => (p - 1) as any)} className="text-purple-300 text-sm">← Volver</button>
        <div className="flex-1 text-center">
          <p className="text-white font-semibold text-sm">Únete como Experto</p>
          <p className="text-purple-300 text-xs">Paso {paso} de 3</p>
        </div>
        <div className="w-16" />
      </div>

      {/* Barra de progreso */}
      <div className="relative z-10 px-4 pt-4">
        <div className="h-1 bg-[#150020] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all" style={{ width: `${(paso / 3) * 100}%` }} />
        </div>
      </div>

      <div className="relative z-10 flex-1 px-4 py-5 flex flex-col gap-5">

        {/* Paso 1 — Datos personales */}
        {paso === 1 && (
          <>
            <div className="text-center">
              <p className="text-white font-bold text-lg">Cuéntanos sobre ti</p>
              <p className="text-white text-sm mt-1">Esta información aparecerá en tu perfil público</p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { label: 'Tu nombre real', key: 'nombre', placeholder: 'Solo para verificación interna' },
                { label: 'Nombre artístico', key: 'nombre_artistico', placeholder: 'El que verán los usuarios' },
                { label: 'Email de contacto', key: 'email', placeholder: 'Para notificaciones y pagos' },
              ].map(field => (
                <div key={field.key}>
                  <p className="text-white/90 text-xs mb-1">{field.label}</p>
                  <input
                    type={field.key === 'email' ? 'email' : 'text'}
                    value={(form as any)[field.key]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full bg-[#0d0015] border border-white/20 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-purple-400 placeholder-white/30"
                  />
                </div>
              ))}

              <div>
                <p className="text-white/90 text-xs mb-1">Tu bio pública <span className="text-white/60">(mín. 50 caracteres)</span></p>
                <textarea
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="Cuéntanos tu historia, tu experiencia y cómo ayudas a las personas..."
                  rows={5}
                  className="w-full bg-[#0d0015] border border-white/20 rounded-2xl px-4 py-3 text-white text-sm resize-none outline-none focus:border-purple-400 placeholder-white/30 leading-relaxed"
                />
                <p className="text-white/25 text-xs mt-1">{form.bio.length} caracteres</p>
              </div>
            </div>
          </>
        )}

        {/* Paso 2 — Especialidades */}
        {paso === 2 && (
          <>
            <div className="text-center">
              <p className="text-white font-bold text-lg">Tus especialidades</p>
              <p className="text-white text-sm mt-1">Selecciona todo lo que ofreces</p>
            </div>

            <div>
              <p className="text-white/90 text-xs mb-2">Áreas de especialización</p>
              <div className="flex flex-wrap gap-2">
                {ESPECIALIDADES_OPCIONES.map(esp => (
                  <button
                    key={esp}
                    onClick={() => toggleEspecialidad(esp)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition ${
                      form.especialidades.includes(esp)
                        ? 'bg-purple-600 border-purple-400 text-white'
                        : 'bg-[#0d0015] border-white/20 text-white/90'
                    }`}
                  >
                    {esp}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-white/90 text-xs mb-2">Métodos de lectura</p>
              <div className="flex flex-wrap gap-2">
                {METODOS_OPCIONES.map(met => (
                  <button
                    key={met}
                    onClick={() => toggleMetodo(met)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition ${
                      form.metodos.includes(met)
                        ? 'bg-pink-600 border-pink-400 text-white'
                        : 'bg-[#0d0015] border-white/20 text-white/90'
                    }`}
                  >
                    {met}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Paso 3 — Precio y motivación */}
        {paso === 3 && (
          <>
            <div className="text-center">
              <p className="text-white font-bold text-lg">Últimos detalles</p>
              <p className="text-white text-sm mt-1">Precio y motivación para unirte</p>
            </div>

            <div>
              <p className="text-white/90 text-xs mb-1">Precio por minuto (€)</p>
              <div className="grid grid-cols-3 gap-2">
                {['2.50', '3.50', '4.50', '5.50', '7.00', '10.00'].map(precio => (
                  <button
                    key={precio}
                    onClick={() => setForm(f => ({ ...f, precio_minuto: precio }))}
                    className={`py-3 rounded-2xl border text-sm font-semibold transition ${
                      form.precio_minuto === precio
                        ? 'bg-purple-600 border-purple-400 text-white'
                        : 'bg-[#0d0015] border-white/20 text-white/90'
                    }`}
                  >
                    €{precio}
                  </button>
                ))}
              </div>
              <div className="bg-[#0d0015] border border-white/10 rounded-xl p-3 mt-2">
                <p className="text-white text-xs">
                  <strong className="text-green-400">🎁 Primer mes: 0% comisión.</strong> Solo se descuenta la tasa de Stripe (~2%). Desde el segundo mes recibirás el <strong className="text-white/90">70%</strong> (€{(parseFloat(form.precio_minuto) * 0.7).toFixed(2)}/min). Los primeros expertos verificados aparecen primero en el directorio durante 6 meses.
                </p>
              </div>
            </div>

            <div>
              <p className="text-white/90 text-xs mb-1">Años de experiencia</p>
              <input
                type="number"
                min="1"
                max="50"
                value={form.experiencia_anos}
                onChange={e => setForm(f => ({ ...f, experiencia_anos: e.target.value }))}
                placeholder="Ej: 5"
                className="w-full bg-[#0d0015] border border-white/20 rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-purple-400 placeholder-white/30"
              />
            </div>

            <div>
              <p className="text-white/90 text-xs mb-1">¿Por qué quieres unirte a UNIVERSE? <span className="text-white/60">(mín. 30 caracteres)</span></p>
              <textarea
                value={form.motivacion}
                onChange={e => setForm(f => ({ ...f, motivacion: e.target.value }))}
                placeholder="Cuéntanos qué te motiva a compartir tu don con la comunidad de UNIVERSE..."
                rows={4}
                className="w-full bg-[#0d0015] border border-white/20 rounded-2xl px-4 py-3 text-white text-sm resize-none outline-none focus:border-purple-400 placeholder-white/30 leading-relaxed"
              />
            </div>

            <div className="bg-[#0d0015] border border-white/10 rounded-2xl p-4">
              <p className="text-white text-xs leading-relaxed">
                Al solicitar unirte aceptas nuestros <button className="text-purple-400 underline" onClick={() => window.location.href = '/legal'}>términos para expertos</button>. Verificaremos tu identidad y experiencia antes de activar tu perfil.
              </p>
            </div>
          </>
        )}

      </div>

      {/* Botón siguiente / enviar */}
      <div className="relative z-10 px-4 py-4 border-t border-white/10 bg-[#0d0015] backdrop-blur">
        {paso < 3 ? (
          <button
            onClick={() => setPaso(p => (p + 1) as any)}
            disabled={paso === 1 ? !paso1Valido : !paso2Valido}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-full disabled:opacity-40"
          >
            Continuar →
          </button>
        ) : (
          <button
            onClick={enviar}
            disabled={!paso3Valido || enviando}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-full disabled:opacity-40"
          >
            {enviando ? 'Enviando...' : 'Enviar solicitud ✨'}
          </button>
        )}
      </div>
    </div>
  )
}
