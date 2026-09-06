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
            className={`whitespace-nowrap py-2 px-3 rounded-xl text-xs font-semibold transition flex-shrink-0 ${tab === t.id ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/70'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-6">

        {tab === 'aviso' && (
          <>
            <Seccion titulo="1. Identificación">
              <p>La aplicación web <strong className="text-white">{NOMBRE_APP}</strong> está disponible en <strong className="text-white">{URL_APP}</strong>. El titular es una persona física en proceso de constitución de actividad económica. Contacto: <strong className="text-white">{EMAIL_CONTACTO}</strong>.</p>
            </Seccion>
            <Seccion titulo="2. Objeto y naturaleza del servicio">
              <p>{NOMBRE_APP} es una plataforma de entretenimiento, reflexión personal y exploración simbólica. Ofrece herramientas de IA basadas en tradiciones culturales como el tarot, la astrología y las runas, así como un directorio de consultores espirituales independientes que prestan sus servicios en nombre y por cuenta de {NOMBRE_APP}.</p>
              <p className="mt-2"><strong className="text-white">El servicio tiene carácter exclusivamente orientativo y de entretenimiento.</strong> Ningún contenido generado por la App ni por los consultores constituye consejo médico, psicológico, financiero o legal.</p>
            </Seccion>
            <Seccion titulo="3. Propiedad intelectual">
              <p>El código, diseño y textos propios son propiedad del titular. Los sistemas simbólicos pertenecen al dominio cultural común. La IA es proporcionada por Google (Gemini). Los consultores son responsables de su propio contenido y ceden a {NOMBRE_APP} un derecho de uso no exclusivo sobre los materiales publicados en la plataforma.</p>
            </Seccion>
            <Seccion titulo="4. Exclusión de responsabilidad">
              <p>{NOMBRE_APP} actúa como intermediario tecnológico. Las consultas con expertos se realizan en nombre y por cuenta de {NOMBRE_APP}, siendo esta la única parte contractual frente al usuario. No obstante, la responsabilidad por el contenido de las sesiones recae exclusivamente en el consultor conforme a los términos del experto.</p>
            </Seccion>
            <Seccion titulo="5. Ley aplicable">
              <p>Legislación española y europea: RGPD, LOPDGDD, LSSI, AI Act y DSA. Jurisdicción: tribunales españoles.</p>
            </Seccion>
          </>
        )}

        {tab === 'privacidad' && (
          <>
            <div className="bg-purple-600/10 border border-purple-500/20 rounded-2xl p-4">
              <p className="text-purple-300 text-xs leading-relaxed">Tu privacidad es importante. Esta política explica qué datos recogemos, para qué y cómo puedes ejercer tus derechos.</p>
            </div>
            <Seccion titulo="1. Responsable">
              <p>Titular de {NOMBRE_APP} · <strong className="text-white">{EMAIL_CONTACTO}</strong></p>
            </Seccion>
            <Seccion titulo="2. Datos que recogemos">
              <p><strong className="text-white">Registro:</strong> email y contraseña (Supabase Auth).</p>
              <p className="mt-2"><strong className="text-white">Uso:</strong> fecha de nacimiento, nombre, preferencias espirituales (localStorage). Herramientas usadas, dispositivo, hora y país aproximado (analíticas).</p>
              <p className="mt-2"><strong className="text-white">Sesiones con expertos:</strong> el historial de lecturas IA se comparte con el consultor para contexto. Las conversaciones se almacenan cifradas 90 días y se eliminan automáticamente.</p>
              <p className="mt-2"><strong className="text-white">IA:</strong> los textos se envían a Google Gemini. No los almacenamos más allá de la sesión activa.</p>
            </Seccion>
            <Seccion titulo="3. Base legal">
              <p>Consentimiento (Art. 6.1.a RGPD) e interés legítimo para analíticas agregadas (Art. 6.1.f RGPD).</p>
            </Seccion>
            <Seccion titulo="4. Terceros">
              <p><strong className="text-white">Supabase:</strong> BD y autenticación (Europa, RGPD compliant).</p>
              <p className="mt-1"><strong className="text-white">Google Gemini:</strong> procesamiento IA.</p>
              <p className="mt-1"><strong className="text-white">Stripe:</strong> pagos (PCI DSS compliant, cuando esté activo).</p>
              <p className="mt-1"><strong className="text-white">Vercel:</strong> alojamiento. No vendemos datos.</p>
            </Seccion>
            <Seccion titulo="5. Tus derechos (RGPD)">
              <p>Acceso, rectificación, supresión, portabilidad, oposición y limitación. Escribe a <strong className="text-white">{EMAIL_CONTACTO}</strong>. Plazo: 30 días. Reclamación ante AEPD (aepd.es).</p>
            </Seccion>
            <Seccion titulo="6. Eliminación de cuenta">
              <p>Desde tu perfil en la App. Se eliminan email, historial y preferencias de nuestros servidores.</p>
            </Seccion>
            <Seccion titulo="7. Menores">
              <p>{NOMBRE_APP} no está dirigida a menores de 18 años. Las sesiones con expertos requieren mayoría de edad.</p>
            </Seccion>
          </>
        )}

        {tab === 'cookies' && (
          <>
            <div className="bg-purple-600/10 border border-purple-500/20 rounded-2xl p-4">
              <p className="text-purple-300 text-xs leading-relaxed">{NOMBRE_APP} usa un número mínimo de tecnologías de almacenamiento. Sin cookies publicitarias ni de seguimiento.</p>
            </div>
            <Seccion titulo="Qué almacenamos">
              <div className="flex flex-col gap-3">
                {[
                  { nombre: 'Sesión (Supabase)', tipo: 'Técnica · Necesaria', desc: 'Token de autenticación para mantenerte conectado.', color: 'text-green-300' },
                  { nombre: 'Preferencias de usuario', tipo: 'Funcional · Necesaria', desc: 'Nombre, fecha de nacimiento, signo. En localStorage del dispositivo.', color: 'text-green-300' },
                  { nombre: 'Consentimiento cookies', tipo: 'Técnica · Necesaria', desc: 'Registro de tu decisión. Obligatorio por ley.', color: 'text-green-300' },
                  { nombre: 'Analíticas de uso', tipo: 'Analítica · No identificativa', desc: 'Qué herramientas usas, hora, dispositivo. Datos anónimos y agregados.', color: 'text-amber-300' },
                ].map((c, i) => (
                  <div key={i} className="bg-black/60 border border-white/15 rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-white text-sm font-medium">{c.nombre}</p>
                      <span className={`text-xs ${c.color} flex-shrink-0`}>{c.tipo}</span>
                    </div>
                    <p className="text-white/70 text-xs">{c.desc}</p>
                  </div>
                ))}
              </div>
            </Seccion>
            <Seccion titulo="Lo que NO usamos">
              <ul className="list-disc list-inside space-y-1">
                <li>Cookies publicitarias o de seguimiento</li>
                <li>Google Analytics ni herramientas de analítica de terceros</li>
                <li>Pixels de Facebook, TikTok u otras redes sociales</li>
                <li>Fingerprinting de dispositivo</li>
              </ul>
            </Seccion>
            <Seccion titulo="Cómo eliminarlas">
              <p>Desde los ajustes de tu navegador → "Borrar datos de navegación" → "Cookies y datos de sitios". También puedes eliminar tu cuenta desde la App.</p>
            </Seccion>
          </>
        )}

        {tab === 'terminos' && (
          <>
            <div className="bg-amber-500/10 border border-amber-400/20 rounded-2xl p-4">
              <p className="text-amber-300 text-xs leading-relaxed">⚠️ Al usar {NOMBRE_APP} aceptas estos términos.</p>
            </div>
            <Seccion titulo="1. Naturaleza del servicio">
              <p>{NOMBRE_APP} es una <strong className="text-white">plataforma de entretenimiento y reflexión personal</strong>. Las lecturas generadas por IA o por consultores son <strong className="text-white">simbólicas y orientativas</strong>. No constituyen predicciones del futuro ni consejos profesionales de ningún tipo.</p>
            </Seccion>
            <Seccion titulo="2. Condiciones de uso">
              <ul className="list-disc list-inside space-y-1">
                <li>Ser mayor de 18 años</li>
                <li>No usar la App para fines ilegales</li>
                <li>No intentar manipular o hackear el sistema</li>
                <li>No revender contenido sin autorización</li>
                <li>Usar el servicio de forma responsable</li>
              </ul>
            </Seccion>
            <Seccion titulo="3. Planes y pagos">
              <p><strong className="text-white">Plan gratuito:</strong> acceso a herramientas básicas con límite diario.</p>
              <p className="mt-2"><strong className="text-white">Plan Premium:</strong> acceso completo. Sistema de pagos en preparación vía Stripe. Precios orientativos: €6,99/mes o €49,99/año.</p>
              <p className="mt-2"><strong className="text-white">Sesiones con expertos:</strong> pago por minuto según tarifa del consultor. Los primeros minutos pueden ser gratuitos. El contrato de la sesión se formaliza entre el usuario y {NOMBRE_APP}.</p>
            </Seccion>
            <Seccion titulo="4. Inteligencia Artificial (AI Act UE)">
              <ul className="list-disc list-inside space-y-1">
                <li>El contenido es generado por inteligencia artificial</li>
                <li>La IA no tiene conciencia ni capacidad predictiva real</li>
                <li>Las respuestas pueden contener errores</li>
                <li>No tomes decisiones importantes basándote solo en IA</li>
              </ul>
            </Seccion>
            <Seccion titulo="5. Limitación de responsabilidad">
              <p>{NOMBRE_APP} no será responsable de decisiones tomadas basándose en contenidos de la App, interrupciones del servicio, ni errores de la IA. Respecto a los consultores, la responsabilidad por el contenido de las sesiones se regula en los términos para expertos.</p>
            </Seccion>
            <Seccion titulo="6. Modificaciones">
              <p>Cambios con previo aviso de 15 días por email para modificaciones sustanciales.</p>
            </Seccion>
            <Seccion titulo="7. Ley aplicable">
              <p>Legislación española. Juzgados españoles, sin perjuicio de los derechos del consumidor europeo.</p>
            </Seccion>
          </>
        )}

        {tab === 'expertos' && (
          <>
            <div className="bg-purple-600/10 border border-purple-500/20 rounded-2xl p-4">
              <p className="text-purple-300 text-xs leading-relaxed">Estos términos aplican a los consultores espirituales que operan en {NOMBRE_APP}. Al registrarse como experto, aceptas íntegramente estas condiciones. Versión: {FECHA_ACTUALIZACION}.</p>
            </div>

            <Seccion titulo="1. Naturaleza de la relación">
              <p>Los consultores registrados en {NOMBRE_APP} son <strong className="text-white">colaboradores independientes</strong> que prestan sus servicios <strong className="text-white">en nombre y por cuenta de {NOMBRE_APP}</strong> frente a los usuarios. En el plano externo, {NOMBRE_APP} es el único proveedor del servicio y parte contractual frente al usuario. En el plano interno, el consultor actúa como colaborador independiente sin relación laboral con {NOMBRE_APP}.</p>
              <p className="mt-2">El consultor es libre de decidir si, cuándo y en qué condiciones presta sus servicios. {NOMBRE_APP} no tiene derecho de dirección sobre el contenido, el momento ni el lugar de la prestación.</p>
            </Seccion>

            <Seccion titulo="2. Requisitos para ser experto">
              <ul className="list-disc list-inside space-y-1">
                <li>Ser mayor de 18 años y tener plena capacidad legal</li>
                <li>Estar dado de alta fiscalmente en su país de residencia</li>
                <li>Superar el proceso de verificación de {NOMBRE_APP}</li>
                <li>Aportar número de identificación fiscal válido</li>
                <li>No tener antecedentes de fraude o estafa documentados</li>
                <li>Comprometerse a cumplir estos términos en su totalidad</li>
                <li>Cada consultor solo puede tener un perfil activo</li>
              </ul>
            </Seccion>

            <Seccion titulo="3. Precios y comisiones">
              <p>El consultor fija libremente su precio por minuto dentro de la franja <strong className="text-white">€0,99/min – €9,99/min</strong>. Los precios fuera de esta franja no están permitidos.</p>
              <p className="mt-2">{NOMBRE_APP} retiene el <strong className="text-white">30% de cada sesión</strong> como comisión por intermediación, procesamiento de pagos y soporte. El consultor recibe el <strong className="text-white">70% restante</strong>, descontada la tasa de procesamiento de Stripe (~2%).</p>
              <p className="mt-2"><strong className="text-white">Período promocional de lanzamiento:</strong> los primeros consultores verificados disfrutan de <strong className="text-white">0% de comisión durante el primer mes</strong> completo desde la activación de su perfil. Solo se descuenta la tasa de Stripe. Esta oferta es limitada y revocable sin previo aviso.</p>
              <p className="mt-2"><strong className="text-white">Minutos gratuitos:</strong> por cada sesión inaugural con un usuario nuevo que incluya minutos gratuitos, el consultor recibe <strong className="text-white">€0,20 por cada minuto gratuito</strong> completado. No existe obligación de aceptar sesiones gratuitas.</p>
              <p className="mt-2"><strong className="text-white">Pago:</strong> {NOMBRE_APP} abona la remuneración acumulada del período anterior antes del día <strong className="text-white">15 de cada mes</strong> mediante transferencia bancaria o Stripe. El consultor debe mantener sus datos bancarios actualizados.</p>
            </Seccion>

            <Seccion titulo="4. Obligaciones del consultor">
              <p>El consultor se compromete expresamente a:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong className="text-white">No garantizar resultados</strong> ni predecir el futuro de forma categórica o absoluta</li>
                <li><strong className="text-white">No ejercer actividades reservadas por ley a profesiones reguladas</strong>: medicina, psicología, derecho, asesoría fiscal, trabajo social u otras. En particular, queda prohibido cualquier acto que pueda encuadrarse en la Ley de Ordenación de las Profesiones Sanitarias o normativa equivalente en el país del consultor</li>
                <li><strong className="text-white">No diagnosticar enfermedades, prescribir tratamientos ni prometer curación</strong> o mejoría de dolencias físicas o mentales</li>
                <li><strong className="text-white">Verificar que el usuario es mayor de 18 años</strong> antes de iniciar cualquier sesión</li>
                <li>Mantener disponibilidad coherente con la indicada en su perfil</li>
                <li>Responder las consultas de email en un máximo de 3 días desde la recepción</li>
                <li>Mantener un trato respetuoso, empático y profesional en todo momento</li>
                <li>Informar a {NOMBRE_APP} de cualquier cambio en sus datos fiscales o bancarios</li>
                <li>Declarar correctamente sus ingresos ante la autoridad fiscal de su país</li>
                <li>Aportar su número de identificación fiscal válido a {NOMBRE_APP}</li>
              </ul>
            </Seccion>

            <Seccion titulo="5. Prohibiciones expresas y penalización">
              <p>Está expresamente prohibido, y cada infracción generará una <strong className="text-white">penalización contractual</strong> cuya cuantía fijará {NOMBRE_APP} según el daño causado, sin perjuicio de reclamaciones adicionales:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong className="text-white">Captar usuarios fuera de la plataforma</strong> para ofrecerles servicios de forma directa, evitando las comisiones de {NOMBRE_APP}</li>
                <li><strong className="text-white">Facilitar datos de contacto propios o de terceros</strong> (email, teléfono, redes sociales, etc.) a los usuarios a través de la plataforma</li>
                <li><strong className="text-white">Promover otros portales de consultas</strong> o servicios de la competencia</li>
                <li>Crear dependencia emocional en el usuario de forma deliberada</li>
                <li>Solicitar datos bancarios, contraseñas o información personal sensible al usuario</li>
                <li>Operar bajo identidades falsas o múltiples perfiles</li>
                <li>Grabar las sesiones sin consentimiento expreso del usuario</li>
                <li>Publicar contenidos pornográficos, racistas, difamatorios o ilegales</li>
                <li>Emitir valoraciones falsas sobre el propio perfil</li>
                <li>Dar acceso a terceros al propio perfil de consultor (el derecho es personal e intransferible)</li>
              </ul>
            </Seccion>

            <Seccion titulo="6. Responsabilidad e indemnización">
              <p>El consultor es el <strong className="text-white">único responsable</strong> del contenido de sus sesiones y de las consecuencias que puedan derivarse de ellas.</p>
              <p className="mt-2">El consultor <strong className="text-white">indemnizará y mantendrá indemne a {NOMBRE_APP}</strong> frente a cualquier reclamación de terceros (incluidos usuarios) que traiga causa de un incumplimiento del consultor, incluidos los costes legales razonables. Esta obligación de indemnización se extiende a todas las reclamaciones que los usuarios pudieran ejercitar contra {NOMBRE_APP} con base en la actuación del consultor.</p>
            </Seccion>

            <Seccion titulo="7. Derechos sobre los contenidos">
              <p>El consultor cede a {NOMBRE_APP} un <strong className="text-white">derecho de uso no exclusivo, mundial, gratuito y transferible</strong> sobre todos los contenidos que publique en la plataforma (textos, imágenes, vídeos, nombre artístico) para su uso en la plataforma y en materiales de marketing de {NOMBRE_APP} (online y offline). {NOMBRE_APP} podrá adaptar estos contenidos para fines gráficos o de presentación.</p>
            </Seccion>

            <Seccion titulo="8. Suspensión y cancelación">
              <p>{NOMBRE_APP} puede <strong className="text-white">suspender o eliminar el perfil</strong> de forma inmediata y sin previo aviso en caso de:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Incumplimiento de cualquier punto de estos términos</li>
                <li>Reclamaciones fundadas de usuarios</li>
                <li>Conducta fraudulenta, engañosa o deshonesta</li>
                <li>Valoración media inferior a 3,0 estrellas de forma sostenida (más de 20 valoraciones)</li>
                <li>Inactividad superior a 60 días sin justificación</li>
              </ul>
              <p className="mt-2">Los pagos pendientes en el momento de la suspensión quedan retenidos <strong className="text-white">30 días naturales</strong> para cubrir posibles reclamaciones. Transcurrido ese plazo sin reclamaciones, se abonan en la siguiente liquidación.</p>
              <p className="mt-2">El consultor puede cancelar su participación en cualquier momento mediante comunicación escrita a <strong className="text-white">{EMAIL_CONTACTO}</strong>. Las remuneraciones devengadas y no cobradas se abonan en la siguiente liquidación mensual.</p>
            </Seccion>

            <Seccion titulo="9. No exclusividad">
              <p>{NOMBRE_APP} <strong className="text-white">no impone exclusividad</strong>. El consultor puede operar libremente en otras plataformas. Sin embargo, está prohibido captar usuarios de {NOMBRE_APP} para llevarlos a otros servicios.</p>
            </Seccion>

            <Seccion titulo="10. Obligaciones fiscales">
              <p>El consultor es <strong className="text-white">exclusivamente responsable</strong> de declarar sus ingresos y abonar los impuestos y cotizaciones sociales aplicables en su país. {NOMBRE_APP} emite un resumen mensual de pagos exportable desde el panel del experto, que puede usarse como justificante ante la autoridad fiscal.</p>
              <p className="mt-2">El consultor debe comunicar a {NOMBRE_APP} su número de identificación fiscal (NIF, VAT, EIN, TIN o equivalente) antes de la primera liquidación. Sin este dato, el pago quedará retenido hasta su aportación.</p>
            </Seccion>

            <Seccion titulo="11. Disponibilidad técnica">
              <p>{NOMBRE_APP} no garantiza la disponibilidad ininterrumpida de la plataforma. Puede producirse inactividad por mantenimiento o causas técnicas sin que ello genere derecho de reclamación para el consultor, salvo que se deba a dolo o negligencia grave de {NOMBRE_APP}.</p>
            </Seccion>

            <Seccion titulo="12. Modificaciones">
              <p>Estos términos pueden modificarse con <strong className="text-white">previo aviso de 30 días</strong> por email. El consultor puede cancelar su participación sin penalización si no acepta los nuevos términos. La continuación en la plataforma tras la entrada en vigor de los cambios implica aceptación.</p>
            </Seccion>

            <Seccion titulo="13. Ley aplicable y jurisdicción">
              <p>Estos términos se rigen por la <strong className="text-white">legislación española</strong>. Para cualquier disputa, las partes se someten a los juzgados y tribunales de España, sin perjuicio de la normativa de protección del consumidor del país del consultor si fuera más favorable.</p>
            </Seccion>

            <Seccion titulo="14. Contacto">
              <p>Para cuestiones relacionadas con el programa de expertos: <strong className="text-white">{EMAIL_CONTACTO}</strong></p>
            </Seccion>
          </>
        )}

        <div className="border-t border-white/10 pt-4 text-center">
          <p className="text-white/40 text-xs">Última actualización: {FECHA_ACTUALIZACION}</p>
          <p className="text-white/40 text-xs mt-1">{NOMBRE_APP} · {URL_APP}</p>
        </div>

      </div>
    </div>
  )
}
