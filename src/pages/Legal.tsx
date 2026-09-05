// src/pages/Legal.tsx
// ============================================================
// UNIVERSE — Textos legales completos
// Aviso Legal · Privacidad · Cookies · Términos
// ============================================================

import { useState } from 'react'

const URL_APP = 'universe-three-alpha.vercel.app'
const NOMBRE_APP = 'UNIVERSE'
const EMAIL_CONTACTO = 'esxdinero@gmail.com'
const FECHA_ACTUALIZACION = 'Septiembre 2026'

const TABS = [
  { id: 'aviso', label: 'Aviso Legal' },
  { id: 'privacidad', label: 'Privacidad' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'terminos', label: 'Términos' },
]

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-purple-300 text-xs tracking-widest uppercase">{titulo}</p>
      <div className="text-white/70 text-sm leading-relaxed">{children}</div>
    </div>
  )
}

export default function Legal() {
  const [tab, setTab] = useState('aviso')

  const bgStyle = {
    backgroundImage: 'url(/stocksnap-constellations-2609647.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative" style={bgStyle}>
      <div className="absolute inset-0 bg-black/85" />

      {/* Header */}
      <div className="relative z-10 flex items-center px-4 py-4 border-b border-white/10">
        <button onClick={() => window.history.back()} className="text-purple-300 text-sm">← Volver</button>
        <div className="flex-1 text-center">
          <p className="text-white font-semibold text-sm">Información Legal</p>
          <p className="text-purple-300 text-xs">{NOMBRE_APP} · {FECHA_ACTUALIZACION}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative z-10 grid grid-cols-4 gap-1 px-4 pt-4">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`py-2 rounded-xl text-xs font-semibold transition ${tab === t.id ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-6">

        {/* ── AVISO LEGAL ─────────────────────────────────── */}
        {tab === 'aviso' && (
          <>
            <Seccion titulo="1. Identificación">
              <p>
                La aplicación web <strong className="text-white">{NOMBRE_APP}</strong> (en adelante, "la App") está disponible en <strong className="text-white">{URL_APP}</strong>. El titular es una persona física en proceso de constitución de actividad económica. Para cualquier consulta, contacta en: <strong className="text-white">{EMAIL_CONTACTO}</strong>.
              </p>
            </Seccion>

            <Seccion titulo="2. Objeto y naturaleza del servicio">
              <p>
                {NOMBRE_APP} es una aplicación de entretenimiento, reflexión personal y exploración simbólica. Ofrece herramientas basadas en tradiciones culturales como el tarot, la astrología, las runas y otros sistemas de simbolismo, combinadas con inteligencia artificial generativa.
              </p>
              <p className="mt-2">
                <strong className="text-white">El servicio tiene carácter exclusivamente orientativo y de entretenimiento.</strong> Ningún contenido generado por la App debe interpretarse como consejo médico, psicológico, financiero, legal o de cualquier otra naturaleza profesional.
              </p>
            </Seccion>

            <Seccion titulo="3. Propiedad intelectual">
              <p>
                El código, diseño, textos propios y estructura de la App son propiedad del titular. Los sistemas simbólicos utilizados (tarot, astrología, runas, etc.) pertenecen al dominio cultural común. Las imágenes de cartas de tarot provienen de Wikimedia Commons bajo licencias de dominio público.
              </p>
              <p className="mt-2">
                La inteligencia artificial utilizada es proporcionada por Google (Gemini). El titular no reivindica autoría sobre las respuestas generadas por IA.
              </p>
            </Seccion>

            <Seccion titulo="4. Exclusión de responsabilidad">
              <p>
                El titular no se responsabiliza de las decisiones que los usuarios tomen basándose en los contenidos de la App. El uso de {NOMBRE_APP} es responsabilidad exclusiva del usuario.
              </p>
              <p className="mt-2">
                La App puede contener errores, interrupciones o inexactitudes. No se garantiza la disponibilidad continua del servicio.
              </p>
            </Seccion>

            <Seccion titulo="5. Ley aplicable">
              <p>
                Estos textos legales se rigen por la legislación española y europea vigente, incluyendo el Reglamento General de Protección de Datos (RGPD), la Ley Orgánica de Protección de Datos (LOPDGDD) y la Ley de Servicios de la Sociedad de la Información (LSSI).
              </p>
            </Seccion>

            <Seccion titulo="6. Contacto">
              <p>Para cualquier cuestión legal: <strong className="text-white">{EMAIL_CONTACTO}</strong></p>
            </Seccion>
          </>
        )}

        {/* ── PRIVACIDAD ──────────────────────────────────── */}
        {tab === 'privacidad' && (
          <>
            <div className="bg-purple-600/10 border border-purple-500/20 rounded-2xl p-4">
              <p className="text-purple-300 text-xs leading-relaxed">
                Tu privacidad es importante para nosotros. Esta política explica qué datos recogemos, para qué y cómo puedes ejercer tus derechos.
              </p>
            </div>

            <Seccion titulo="1. Responsable del tratamiento">
              <p>Titular de {NOMBRE_APP} · Contacto: <strong className="text-white">{EMAIL_CONTACTO}</strong></p>
            </Seccion>

            <Seccion titulo="2. Datos que recogemos">
              <p><strong className="text-white">Al registrarte:</strong> dirección de email y contraseña (gestionadas por Supabase Auth). No almacenamos contraseñas en texto plano.</p>
              <p className="mt-2"><strong className="text-white">Durante el uso:</strong> fecha de nacimiento y nombre (guardados localmente en tu dispositivo, no en nuestros servidores salvo que inicies sesión). Signo zodiacal, intención espiritual y animal guía (preferencias de personalización).</p>
              <p className="mt-2"><strong className="text-white">Analíticas:</strong> herramienta utilizada, dispositivo, hora de uso, país aproximado. Nunca recogemos tu IP exacta ni datos de localización precisa.</p>
              <p className="mt-2"><strong className="text-white">Conversaciones con IA:</strong> los textos que introduces en la Guía IA y otras herramientas se envían a la API de Google Gemini para generar respuestas. No almacenamos estas conversaciones en nuestros servidores más allá de la sesión activa.</p>
            </Seccion>

            <Seccion titulo="3. Base legal del tratamiento">
              <p>
                El tratamiento se basa en el <strong className="text-white">consentimiento del usuario</strong> al registrarse y usar la App (Art. 6.1.a RGPD), y en el <strong className="text-white">interés legítimo</strong> para las analíticas de uso agregadas (Art. 6.1.f RGPD).
              </p>
            </Seccion>

            <Seccion titulo="4. Finalidad del tratamiento">
              <ul className="list-disc list-inside space-y-1">
                <li>Prestación del servicio y personalización</li>
                <li>Gestión de cuentas de usuario</li>
                <li>Mejora de la App mediante analíticas agregadas</li>
                <li>Comunicaciones relacionadas con el servicio (solo con consentimiento)</li>
              </ul>
            </Seccion>

            <Seccion titulo="5. Terceros que reciben datos">
              <p><strong className="text-white">Supabase:</strong> base de datos y autenticación. Servidores en Europa (RGPD compliant).</p>
              <p className="mt-1"><strong className="text-white">Google (Gemini API):</strong> procesamiento de textos para generar respuestas de IA. Sujeto a la política de privacidad de Google.</p>
              <p className="mt-1"><strong className="text-white">Vercel:</strong> alojamiento de la aplicación. Servidores en Europa disponibles.</p>
              <p className="mt-2">No vendemos ni cedemos tus datos a terceros para fines publicitarios.</p>
            </Seccion>

            <Seccion titulo="6. Conservación de datos">
              <p>
                Los datos de cuenta se conservan mientras mantengas tu cuenta activa. Puedes solicitar la eliminación en cualquier momento. Los datos de analíticas agregadas se conservan por un máximo de 24 meses.
              </p>
            </Seccion>

            <Seccion titulo="7. Tus derechos (RGPD)">
              <p>Tienes derecho a:</p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li><strong className="text-white">Acceso:</strong> saber qué datos tenemos sobre ti</li>
                <li><strong className="text-white">Rectificación:</strong> corregir datos incorrectos</li>
                <li><strong className="text-white">Supresión:</strong> eliminar tu cuenta y datos ("derecho al olvido")</li>
                <li><strong className="text-white">Portabilidad:</strong> recibir tus datos en formato legible</li>
                <li><strong className="text-white">Oposición:</strong> oponerte a ciertos tratamientos</li>
                <li><strong className="text-white">Limitación:</strong> restringir el tratamiento en ciertos casos</li>
              </ul>
              <p className="mt-2">
                Para ejercer cualquier derecho, escribe a <strong className="text-white">{EMAIL_CONTACTO}</strong>. Responderemos en un plazo máximo de 30 días. También puedes reclamar ante la <strong className="text-white">Agencia Española de Protección de Datos (AEPD)</strong> en aepd.es.
              </p>
            </Seccion>

            <Seccion titulo="8. Eliminación de cuenta">
              <p>
                Puedes eliminar tu cuenta desde tu perfil en la App. Esto eliminará permanentemente tu email, historial de plan y preferencias de nuestros servidores. Los datos locales (localStorage) permanecen en tu dispositivo hasta que limpies el navegador.
              </p>
            </Seccion>

            <Seccion titulo="9. Menores de edad">
              <p>
                {NOMBRE_APP} no está dirigida a menores de 16 años. Si eres menor de 16 años, no uses la App sin el consentimiento de tu tutor legal.
              </p>
            </Seccion>
          </>
        )}

        {/* ── COOKIES ─────────────────────────────────────── */}
        {tab === 'cookies' && (
          <>
            <div className="bg-purple-600/10 border border-purple-500/20 rounded-2xl p-4">
              <p className="text-purple-300 text-xs leading-relaxed">
                {NOMBRE_APP} usa un número mínimo de tecnologías de almacenamiento. No usamos cookies de seguimiento ni publicidad.
              </p>
            </div>

            <Seccion titulo="¿Qué es una cookie?">
              <p>
                Una cookie es un pequeño archivo que se almacena en tu navegador. Las aplicaciones web modernas también usan <strong className="text-white">localStorage</strong> y <strong className="text-white">sessionStorage</strong>, que funcionan de forma similar.
              </p>
            </Seccion>

            <Seccion titulo="Qué almacenamos y por qué">
              <div className="flex flex-col gap-3">
                {[
                  {
                    nombre: 'Datos de sesión (Supabase)',
                    tipo: 'Técnica · Necesaria',
                    descripcion: 'Token de autenticación para mantenerte conectado. Sin esto, tendrías que iniciar sesión cada vez.',
                    color: 'text-green-300',
                  },
                  {
                    nombre: 'Preferencias de usuario',
                    tipo: 'Funcional · Necesaria',
                    descripcion: 'Nombre, fecha de nacimiento, signo, intención. Se guardan en tu dispositivo (localStorage) para personalizar la experiencia.',
                    color: 'text-green-300',
                  },
                  {
                    nombre: 'Analíticas de uso',
                    tipo: 'Analítica · No identificativa',
                    descripcion: 'Qué herramientas usas, a qué hora, desde qué tipo de dispositivo. Datos agregados, nunca vinculados a tu identidad real.',
                    color: 'text-amber-300',
                  },
                ].map((c, i) => (
                  <div key={i} className="bg-white/8 border border-white/20 rounded-2xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-white text-sm font-medium">{c.nombre}</p>
                      <span className={`text-xs ${c.color} flex-shrink-0`}>{c.tipo}</span>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed">{c.descripcion}</p>
                  </div>
                ))}
              </div>
            </Seccion>

            <Seccion titulo="Lo que NO usamos">
              <ul className="list-disc list-inside space-y-1">
                <li>Cookies publicitarias o de seguimiento</li>
                <li>Google Analytics ni herramientas de terceros de analítica</li>
                <li>Pixels de Facebook, TikTok u otras redes sociales</li>
                <li>Fingerprinting de dispositivo</li>
              </ul>
            </Seccion>

            <Seccion titulo="Cómo eliminar los datos locales">
              <p>
                Puedes limpiar los datos almacenados en tu navegador desde los ajustes del navegador → "Borrar datos de navegación" → "Cookies y datos de sitios". También puedes eliminar tu cuenta desde la App.
              </p>
            </Seccion>

            <Seccion titulo="Cookies de terceros">
              <p>
                Supabase y Vercel pueden establecer cookies técnicas propias para el funcionamiento del servicio. Consulta sus respectivas políticas de privacidad para más información.
              </p>
            </Seccion>
          </>
        )}

        {/* ── TÉRMINOS ─────────────────────────────────────── */}
        {tab === 'terminos' && (
          <>
            <div className="bg-amber-500/10 border border-amber-400/20 rounded-2xl p-4">
              <p className="text-amber-300 text-xs leading-relaxed">
                ⚠️ Al usar {NOMBRE_APP} aceptas estos términos. Léelos antes de registrarte.
              </p>
            </div>

            <Seccion titulo="1. Naturaleza del servicio">
              <p>
                {NOMBRE_APP} es una <strong className="text-white">herramienta de entretenimiento y reflexión personal</strong>. Las lecturas de tarot, horóscopos, runas y demás contenidos generados por la App o su IA son <strong className="text-white">simbólicos y orientativos</strong>. No constituyen en ningún caso predicciones del futuro, consejos profesionales ni diagnósticos de ningún tipo.
              </p>
            </Seccion>

            <Seccion titulo="2. Condiciones de uso">
              <p>Al usar la App te comprometes a:</p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>Ser mayor de 16 años (o contar con consentimiento parental)</li>
                <li>No usar la App para fines ilegales</li>
                <li>No intentar manipular, hackear o abusar del sistema de IA</li>
                <li>No revender ni redistribuir el contenido de la App sin autorización</li>
                <li>Usar el servicio de forma responsable y sin crear dependencia</li>
              </ul>
            </Seccion>

            <Seccion titulo="3. Plan gratuito y Premium">
              <p>
                {NOMBRE_APP} ofrece un <strong className="text-white">plan gratuito</strong> con acceso a herramientas básicas y un <strong className="text-white">plan Premium</strong> de pago con acceso completo.
              </p>
              <p className="mt-2">
                <strong className="text-white">Pagos:</strong> el sistema de pagos está actualmente en desarrollo. Próximamente estará disponible a través de Stripe. Los precios indicativos son €6,99/mes o €49,99/año, sujetos a cambios.
              </p>
              <p className="mt-2">
                <strong className="text-white">Cancelación:</strong> cuando el sistema de pagos esté activo, podrás cancelar en cualquier momento desde tu perfil. Al cancelar, mantendrás el acceso Premium hasta el fin del período pagado.
              </p>
            </Seccion>

            <Seccion titulo="4. Inteligencia Artificial">
              <p>
                {NOMBRE_APP} utiliza IA generativa (Google Gemini) para crear contenido personalizado. De acuerdo con el <strong className="text-white">Reglamento de IA de la UE (AI Act)</strong>:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>El contenido es generado por inteligencia artificial</li>
                <li>La IA no tiene conciencia, intuición ni capacidad predictiva real</li>
                <li>Las respuestas son generadas estadísticamente y pueden contener errores</li>
                <li>No tomes decisiones importantes basándote únicamente en respuestas de IA</li>
              </ul>
            </Seccion>

            <Seccion titulo="5. Limitación de responsabilidad">
              <p>
                El titular de {NOMBRE_APP} no será responsable de:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>Decisiones tomadas basándose en contenidos de la App</li>
                <li>Interrupciones, errores o pérdida de datos del servicio</li>
                <li>Contenido generado por IA que pueda resultar inexacto</li>
                <li>Daños derivados del uso o imposibilidad de uso de la App</li>
              </ul>
            </Seccion>

            <Seccion titulo="6. Modificaciones">
              <p>
                Nos reservamos el derecho a modificar estos términos, las funcionalidades de la App o los precios con previo aviso. Los cambios sustanciales se comunicarán por email a los usuarios registrados con al menos 15 días de antelación.
              </p>
            </Seccion>

            <Seccion titulo="7. Terminación">
              <p>
                Puedes dejar de usar la App y eliminar tu cuenta en cualquier momento. Nos reservamos el derecho a suspender cuentas que incumplan estos términos.
              </p>
            </Seccion>

            <Seccion titulo="8. Ley aplicable y jurisdicción">
              <p>
                Estos términos se rigen por la legislación española. Para cualquier disputa, las partes se someten a los juzgados y tribunales españoles, sin perjuicio de los derechos del consumidor según la normativa europea.
              </p>
            </Seccion>

            <Seccion titulo="9. Contacto">
              <p>
                Para cualquier cuestión relacionada con estos términos: <strong className="text-white">{EMAIL_CONTACTO}</strong>
              </p>
            </Seccion>
          </>
        )}

        {/* Footer */}
        <div className="border-t border-white/10 pt-4 text-center">
          <p className="text-white/25 text-xs">Última actualización: {FECHA_ACTUALIZACION}</p>
          <p className="text-white/25 text-xs mt-1">{NOMBRE_APP} · {URL_APP}</p>
        </div>

      </div>
    </div>
  )
}
