// src/pages/Disclaimer.tsx
import PageLayout from '../components/PageLayout'

export default function Disclaimer() {
  return (
    <PageLayout>
      <div className="flex flex-col gap-6">

        <div className="flex items-center">
          <button onClick={() => window.history.back()} className="text-purple-300 text-sm">← Volver</button>
          <div className="flex-1 text-center">
            <p className="text-white font-semibold text-sm">Aviso Legal</p>
          </div>
        </div>

        <div className="bg-[#0d0015] border border-white/15 rounded-3xl p-6 flex flex-col gap-6">

          {[
            { titulo: 'Naturaleza del servicio', texto: 'UNIVERSE es una plataforma de entretenimiento, reflexión personal y exploración simbólica. Todo el contenido generado — incluyendo lecturas de tarot, interpretaciones astrológicas, análisis de runas, oráculos, sueños, presagios, numerología y cualquier otro sistema de sabiduría disponible en la plataforma — tiene carácter exclusivamente orientativo, simbólico y de entretenimiento.' },
            { titulo: 'Exención de responsabilidad', texto: 'UNIVERSE, sus creadores, desarrolladores, colaboradores y expertos no se hacen responsables, en ningún caso y bajo ninguna circunstancia, de las decisiones, acciones u omisiones que el usuario pueda tomar basándose total o parcialmente en el contenido generado por la plataforma.\n\nNinguna lectura, interpretación, mensaje o consejo generado por UNIVERSE — ya sea mediante inteligencia artificial o por expertos humanos — constituye asesoramiento profesional de ningún tipo, incluyendo pero no limitado a: asesoramiento médico, psicológico, jurídico, financiero, laboral o de salud mental.' },
            { titulo: 'Interpretaciones simbólicas', texto: 'Los sistemas de adivinación, astrología, numerología, runas, tarot y demás tradiciones presentes en UNIVERSE son presentados como herramientas de reflexión simbólica e introspección personal. No pretenden predecir el futuro, diagnosticar condiciones, garantizar resultados ni sustituir el juicio personal del usuario.\n\nLas tradiciones culturales presentadas son mostradas con fines educativos y de reflexión. UNIVERSE no afirma la veracidad, exactitud histórica ni eficacia práctica de ningún sistema de adivinación o creencia espiritual.' },
            { titulo: 'Inteligencia artificial', texto: 'El contenido generado por inteligencia artificial en UNIVERSE es producido de forma automática por modelos de lenguaje. Puede contener inexactitudes, imprecisiones o información incompleta. El usuario acepta que dicho contenido no ha sido revisado ni validado por expertos humanos en cada caso individual.' },
            { titulo: 'Expertos humanos', texto: 'Las consultas con expertos humanos disponibles en UNIVERSE son sesiones de orientación espiritual y reflexión personal. Los expertos no son médicos, psicólogos, terapeutas, abogados ni asesores financieros certificados. Sus interpretaciones tienen carácter exclusivamente espiritual y simbólico.' },
            { titulo: 'Responsabilidad del usuario', texto: 'El usuario es el único responsable de las decisiones que tome en su vida. UNIVERSE proporciona herramientas de reflexión, no de toma de decisiones. En caso de necesitar orientación profesional — médica, psicológica, jurídica o financiera — el usuario debe acudir a profesionales certificados en el área correspondiente.' },
            { titulo: 'Limitación de responsabilidad civil', texto: 'En la máxima medida permitida por la legislación aplicable, UNIVERSE y sus creadores quedan expresamente exentos de toda responsabilidad civil, mercantil, penal o de cualquier otra naturaleza derivada del uso de la plataforma, incluyendo daños directos, indirectos, incidentales, especiales o consecuentes.' },
            { titulo: 'Aceptación', texto: 'El uso de UNIVERSE implica la aceptación íntegra de este aviso legal. Si el usuario no está de acuerdo con alguno de estos términos, debe abstenerse de utilizar la plataforma.' },
          ].map(({ titulo, texto }) => (
            <div key={titulo}>
              <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">{titulo}</p>
              <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{texto}</p>
            </div>
          ))}

          <div className="border-t border-white/10 pt-4">
            <p className="text-white/40 text-xs text-center leading-relaxed">
              UNIVERSE es una herramienta de reflexión y entretenimiento. Úsala con sabiduría y responsabilidad personal.
            </p>
          </div>

        </div>
      </div>
    </PageLayout>
  )
}
