// src/pages/Legal.tsx
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
  { id: 'expertos', label: 'Expertos' },
]

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-purple-300 text-xs tracking-widest uppercase">{titulo}</p>
      <div className="text-white/80 text-sm leading-relaxed">{children}</div>
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
      <div className="absolute inset-0 bg-black/92" />

      <div className="relative z-10 flex items-center px-4 py-4 border-b border-white/10">
        <button onClick={() => window.history.back()} className="text-purple-300 text-sm">← Volver</button>
        <div className="flex-1 text-center">
          <p className="text-white font-semibold text-sm">Información Legal</p>
          <p className="text-purple-300 text-xs">{NOMBRE_APP} · {FECHA_ACTUALIZACION}</p>
        </div>
      </div>

      <div className="relative z-10 flex gap-1 px-4 pt-4 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`whitespace-nowrap py-2 px-3 rounded-xl text-xs font-semibold transition flex-shrink-0 ${tab === t.id ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-6">

        {/* ── AVISO LEGAL ─────────────────────────────────── */}
        {tab === 'aviso' && (
          <>
            <Seccion titulo="1. Identificación">
              <p>La aplicación web <strong className="text-white">{NOMBRE_APP}</strong> está disponible en <strong className="text-white">{URL_APP}</strong>. El titular es una persona física en proceso de constitución de actividad económica. Contacto: <strong className="text-white">{EMAIL_CONTACTO}</strong>.</p>
            </Seccion>
            <Seccion titulo="2. Objeto y naturaleza del servicio">
              <p>{NOMBRE_APP} es una aplicación de entretenimiento, reflexión personal y exploración simbólica. Ofrece herramientas basadas en tradiciones culturales como el tarot, la astrología y las runas, combinadas con inteligencia artificial generativa, así como un directorio de consultores espirituales independientes.</p>
              <p className="mt-2"><strong className="text-white">El servicio tiene carácter exclusivamente orientativo y de entretenimiento.</strong> Ningún contenido generado por la App ni por los consultores debe interpretarse como consejo médico, psicológico, financiero o legal.</p>
            </Seccion>
            <Seccion titulo="3. Propiedad intelectual">
              <p>El código, diseño, textos propios y estructura de la App son propiedad del titular. Los sistemas simbólicos utilizados pertenecen al dominio cultural común. La IA es proporcionada por Google (Gemini). Los consultores son profesionales independientes responsables de su propio contenido.</p>
            </Seccion>
            <Seccion titulo="4. Exclusión de responsabilidad">
              <p>{NOMBRE_APP} actúa como intermediario tecnológico entre usuarios y consultores independientes. No es responsable de las lecturas, predicciones o consejos ofrecidos por los consultores, ni de las decisiones tomadas por los usuarios basándose en dichos contenidos.</p>
            </Seccion>
            <Seccion titulo="5. Ley aplicable">
              <p>Legislación española y europea vigente: RGPD, LOPDGDD, LSSI, AI Act y DSA.</p>
            </Seccion>
          </>
        )}

        {/* ── PRIVACIDAD ──────────────────────────────────── */}
        {tab === 'privacidad' && (
          <>
            <div className="bg-purple-600/10 border border-purple-500/20 rounded-2xl p-4">
              <p className="text-purple-300 text-xs leading-relaxed">Tu privacidad es importante. Esta política explica qué datos recogemos, para qué y cómo puedes ejercer tus derechos.</p>
            </div>
            <Seccion titulo="1. Responsable del tratamiento">
              <p>Titular de {NOMBRE_APP} · <strong className="text-white">{EMAIL_CONTACTO}</strong></p>
            </Seccion>
            <Seccion titulo="2. Datos que recogemos">
              <p><strong className="text-white">Al registrarte:</strong> email y contraseña (gestionados por Supabase Auth).</p>
              <p className="mt-2"><strong className="text-white">Durante el uso:</strong> fecha de nacimiento, nombre y preferencias espirituales (guardados localmente). Herramientas usadas, dispositivo, hora y país aproximado (analíticas).</p>
              <p className="mt-2"><strong className="text-white">En sesiones con expertos:</strong> el historial de lecturas IA del usuario se comparte con el consultor elegido para contexto. Las conversaciones de chat se almacenan de forma cifrada durante 90 días y se eliminan automáticamente.</p>
              <p className="mt-2"><strong className="text-white">Conversaciones con IA:</strong> los textos se envían a Google Gemini. No los almacenamos más allá de la sesión.</p>
            </Seccion>
            <Seccion titulo="3. Base legal">
              <p>Consentimiento del usuario (Art. 6.1.a RGPD) e interés legítimo para analíticas agregadas (Art. 6.1.f RGPD).</p>
            </Seccion>
            <Seccion titulo="4. Terceros">
              <p><strong className="text-white">Supabase:</strong> base de datos y autenticación. Europa (RGPD compliant).</p>
              <p className="mt-1"><strong className="text-white">Google Gemini:</strong> procesamiento de IA. Sujeto a política de Google.</p>
              <p className="mt-1"><strong className="text-white">Stripe:</strong> pagos (cuando esté activo). PCI DSS compliant.</p>
              <p className="mt-1"><strong className="text-white">Vercel:</strong> alojamiento. No vendemos datos a terceros.</p>
            </Seccion>
            <Seccion titulo="5. Tus derechos (RGPD)">
              <p>Acceso, rectificación, supresión, portabilidad, oposición y limitación. Escribe a <strong className="text-white">{EMAIL_CONTACTO}</strong>. Plazo de respuesta: 30 días. Puedes reclamar ante la AEPD (aepd.es).</p>
            </Seccion>
            <Seccion titulo="6. Eliminación de cuenta">
              <p>Desde tu perfil en la App. Se eliminarán email, historial de plan y preferencias de nuestros servidores. Los datos locales permanecen en tu dispositivo hasta que limpies el navegador.</p>
            </Seccion>
            <Seccion titulo="7. Menores">
              <p>{NOMBRE_APP} no está dirigida a menores de 18 años. Las sesiones con expertos requieren ser mayor de edad.</p>
            </Seccion>
          </>
        )}

        {/* ── COOKIES ─────────────────────────────────────── */}
        {tab === 'cookies' && (
          <>
            <div className="bg-purple-600/10 border border-purple-500/20 rounded-2xl p-4">
              <p className="text-purple-300 text-xs leading-relaxed">{NOMBRE_APP} usa un número mínimo de tecnologías de almacenamiento. No usamos cookies de seguimiento ni publicidad.</p>
            </div>
            <Seccion titulo="Qué almacenamos">
              <div className="flex flex-col gap-3">
                {[
                  { nombre: 'Sesión (Supabase)', tipo: 'Técnica · Necesaria', desc: 'Token de autenticación para mantenerte conectado.', color: 'text-green-300' },
                  { nombre: 'Preferencias de usuario', tipo: 'Funcional · Necesaria', desc: 'Nombre, fecha de nacimiento, signo. Guardadas en tu dispositivo (localStorage).', color: 'text-green-300' },
                  { nombre: 'Consentimiento cookies', tipo: 'Técnica · Necesaria', desc: 'Registro de tu decisión sobre cookies. Obligatorio por ley.', color: 'text-green-300' },
                  { nombre: 'Analíticas de uso', tipo: 'Analítica · No identificativa', desc: 'Qué herramientas usas, a qué hora, desde qué dispositivo. Datos agregados y anónimos.', color: 'text-amber-300' },
                ].map((c, i) => (
                  <div key={i} className="bg-black/50 border border-white/15 rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-white text-sm font-medium">{c.nombre}</p>
                      <span className={`text-xs ${c.color} flex-shrink-0`}>{c.tipo}</span>
                    </div>
                    <p className="text-white/50 text-xs">{c.desc}</p>
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
            <Seccion titulo="Cómo eliminarlas">
              <p>Desde los ajustes de tu navegador → "Borrar datos de navegación" → "Cookies y datos de sitios". También puedes eliminar tu cuenta desde la App.</p>
            </Seccion>
          </>
        )}

        {/* ── TÉRMINOS ─────────────────────────────────────── */}
        {tab === 'terminos' && (
          <>
            <div className="bg-amber-500/10 border border-amber-400/20 rounded-2xl p-4">
              <p className="text-amber-300 text-xs leading-relaxed">⚠️ Al usar {NOMBRE_APP} aceptas estos términos.</p>
            </div>
            <Seccion titulo="1. Naturaleza del servicio">
              <p>{NOMBRE_APP} es una <strong className="text-white">herramienta de entretenimiento y reflexión personal</strong>. Las lecturas de tarot, horóscopos, runas y demás contenidos generados por la App o por los consultores son <strong className="text-white">simbólicos y orientativos</strong>. No constituyen predicciones del futuro ni consejos profesionales de ningún tipo.</p>
            </Seccion>
            <Seccion titulo="2. Condiciones de uso">
              <ul className="list-disc list-inside space-y-1">
                <li>Ser mayor de 18 años</li>
                <li>No usar la App para fines ilegales</li>
                <li>No intentar manipular o hackear el sistema de IA</li>
                <li>No revender contenido sin autorización</li>
                <li>Usar el servicio de forma responsable</li>
              </ul>
            </Seccion>
            <Seccion titulo="3. Planes y pagos">
              <p><strong className="text-white">Plan gratuito:</strong> acceso a herramientas básicas con límite diario de consultas.</p>
              <p className="mt-2"><strong className="text-white">Plan Premium:</strong> acceso completo. Sistema de pagos en preparación vía Stripe. Precios indicativos: €6,99/mes o €49,99/año.</p>
              <p className="mt-2"><strong className="text-white">Sesiones con expertos:</strong> pago por minuto según tarifa del consultor. Los primeros minutos pueden ser gratuitos según la oferta vigente.</p>
            </Seccion>
            <Seccion titulo="4. Inteligencia Artificial (AI Act UE)">
              <ul className="list-disc list-inside space-y-1">
                <li>El contenido es generado por inteligencia artificial</li>
                <li>La IA no tiene conciencia ni capacidad predictiva real</li>
                <li>Las respuestas pueden contener errores</li>
                <li>No tomes decisiones importantes basándote solo en respuestas de IA</li>
              </ul>
            </Seccion>
            <Seccion titulo="5. Limitación de responsabilidad">
              <p>{NOMBRE_APP} no será responsable de decisiones tomadas basándose en contenidos de la App, interrupciones del servicio, errores de la IA, ni del contenido generado por los consultores independientes.</p>
            </Seccion>
            <Seccion titulo="6. Modificaciones">
              <p>Nos reservamos el derecho a modificar estos términos con previo aviso de 15 días por email.</p>
            </Seccion>
            <Seccion titulo="7. Ley aplicable">
              <p>Legislación española. Juzgados y tribunales españoles, sin perjuicio de los derechos del consumidor europeo.</p>
            </Seccion>
          </>
        )}

        {/* ── TÉRMINOS EXPERTOS ────────────────────────────── */}
        {tab === 'expertos' && (
          <>
            <div className="bg-purple-600/10 border border-purple-500/20 rounded-2xl p-4">
              <p className="text-purple-300 text-xs leading-relaxed">Estos términos aplican a los consultores espirituales que ofrecen sus servicios a través de {NOMBRE_APP}. Al registrarse como experto, aceptas todas estas condiciones.</p>
            </div>

            <Seccion titulo="1. Naturaleza de la relación">
              <p>Los consultores que operan en {NOMBRE_APP} son <strong className="text-white">profesionales independientes</strong> (autónomos o equivalente). No existe relación laboral, de agencia ni de sociedad entre el consultor y {NOMBRE_APP}. {NOMBRE_APP} actúa exclusivamente como <strong className="text-white">intermediario tecnológico</strong> que facilita el contacto entre consultores y usuarios.</p>
            </Seccion>

            <Seccion titulo="2. Requisitos para ser experto">
              <ul className="list-disc list-inside space-y-1">
                <li>Ser mayor de 18 años</li>
                <li>Estar dado de alta como autónomo o equivalente en tu país</li>
                <li>Superar el proceso de verificación de {NOMBRE_APP}</li>
                <li>No tener antecedentes de fraude o estafa documentados</li>
                <li>Comprometerse a cumplir estos términos en su totalidad</li>
              </ul>
            </Seccion>

            <Seccion titulo="3. Comisión de la plataforma">
              <p>{NOMBRE_APP} retiene el <strong className="text-white">30% de cada sesión</strong> como comisión por el uso de la plataforma, procesamiento de pagos, soporte técnico y captación de usuarios.</p>
              <p className="mt-2">El consultor recibe el <strong className="text-white">70% restante</strong>, descontados los impuestos aplicables según su situación fiscal.</p>
              <p className="mt-2"><strong className="text-white">Período promocional de lanzamiento:</strong> los primeros consultores en unirse disfrutarán de <strong className="text-white">0% de comisión durante el primer mes</strong> completo desde la activación de su perfil. Solo se descuenta la tasa de procesamiento de pagos de Stripe (~2%). Esta oferta es limitada a los primeros consultores verificados y puede retirarse sin previo aviso.</p>
            </Seccion>

            <Seccion titulo="4. Fijación de precios">
              <p>Cada consultor fija libremente su precio por minuto, sin mínimos ni máximos impuestos por {NOMBRE_APP}. Los cambios de precio aplican a las nuevas sesiones, nunca a las ya iniciadas.</p>
            </Seccion>

            <Seccion titulo="5. Obligaciones del consultor">
              <p>El consultor se compromete expresamente a:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong className="text-white">No garantizar resultados</strong> ni predecir el futuro de forma absoluta o categórica</li>
                <li><strong className="text-white">No dar consejos médicos, psicológicos, legales ni financieros</strong> bajo ninguna circunstancia</li>
                <li><strong className="text-white">Verificar que el usuario es mayor de 18 años</strong> antes de iniciar cualquier sesión de pago</li>
                <li>Mantener un trato respetuoso, empático y profesional en todo momento</li>
                <li>No contactar a los usuarios fuera de la plataforma para ofrecerles servicios</li>
                <li>No solicitar datos bancarios, contraseñas ni información personal sensible</li>
                <li>Declarar correctamente sus ingresos ante la autoridad fiscal correspondiente</li>
                <li>Mantener disponibilidad coherente con la indicada en su perfil</li>
              </ul>
            </Seccion>

            <Seccion titulo="6. Prohibiciones expresas">
              <p>Está terminantemente prohibido:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Afirmar poseer poderes sobrenaturales reales o capacidad de predecir el futuro con certeza</li>
                <li>Crear dependencia emocional en el usuario de forma deliberada</li>
                <li>Ofrecer rituales, limpiezas o servicios adicionales fuera de la plataforma</li>
                <li>Discriminar a usuarios por razón de origen, género, religión u orientación sexual</li>
                <li>Grabar las sesiones sin consentimiento expreso del usuario</li>
                <li>Compartir información del usuario con terceros</li>
                <li>Operar bajo identidades falsas o múltiples perfiles</li>
              </ul>
            </Seccion>

            <Seccion titulo="7. Responsabilidad del consultor">
              <p>El consultor es el <strong className="text-white">único responsable</strong> del contenido de sus sesiones. {NOMBRE_APP} no supervisa las sesiones en tiempo real y no es responsable de lo expresado por el consultor durante las mismas.</p>
              <p className="mt-2">Ante cualquier reclamación de un usuario derivada de una sesión, la responsabilidad recae exclusivamente en el consultor implicado.</p>
            </Seccion>

            <Seccion titulo="8. Suspensión y cancelación">
              <p>{NOMBRE_APP} se reserva el derecho de <strong className="text-white">suspender o eliminar cualquier perfil de consultor</strong> de forma inmediata y sin previo aviso en caso de:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Incumplimiento de cualquier punto de estos términos</li>
                <li>Reclamaciones fundadas de usuarios</li>
                <li>Conducta fraudulenta o deshonesta</li>
                <li>Valoración media inferior a 3.0 estrellas de forma sostenida</li>
              </ul>
              <p className="mt-2">Los pagos pendientes en el momento de la suspensión serán retenidos durante 30 días para cubrir posibles reclamaciones.</p>
            </Seccion>

            <Seccion titulo="9. Exclusividad">
              <p>{NOMBRE_APP} <strong className="text-white">no impone exclusividad</strong>. Los consultores pueden operar libremente en otras plataformas simultáneamente. Sin embargo, no pueden captar usuarios de {NOMBRE_APP} para llevarlos a otros servicios fuera de la plataforma.</p>
            </Seccion>

            <Seccion titulo="10. Fiscalidad">
              <p>Cada consultor es responsable de declarar sus ingresos y aplicar el IVA correspondiente según su situación fiscal. {NOMBRE_APP} emitirá un resumen mensual de pagos a efectos de justificación.</p>
            </Seccion>

            <Seccion titulo="11. Modificaciones">
              <p>Estos términos pueden modificarse con previo aviso de 30 días. El consultor puede cancelar su participación sin penalización si no acepta los nuevos términos.</p>
            </Seccion>

            <Seccion titulo="12. Contacto">
              <p>Para cuestiones relacionadas con el programa de expertos: <strong className="text-white">{EMAIL_CONTACTO}</strong></p>
            </Seccion>
          </>
        )}

        <div className="border-t border-white/10 pt-4 text-center">
          <p className="text-white/25 text-xs">Última actualización: {FECHA_ACTUALIZACION}</p>
          <p className="text-white/25 text-xs mt-1">{NOMBRE_APP} · {URL_APP}</p>
        </div>

      </div>
    </div>
  )
}
