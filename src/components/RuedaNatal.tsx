// src/components/RuedaNatal.tsx

interface Planeta {
  planeta: string
  signo: string
}

interface Props {
  planetas: Planeta[]
  nombre?: string
}

const GLIFOS: Record<string, string> = {
  'Sol': '☉', 'Luna': '☽', 'Mercurio': '☿', 'Venus': '♀', 'Marte': '♂',
}

const GLIFOS_SIGNOS: Record<string, string> = {
  'Aries': '♈', 'Tauro': '♉', 'Géminis': '♊', 'Cáncer': '♋',
  'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Escorpio': '♏',
  'Sagitario': '♐', 'Capricornio': '♑', 'Acuario': '♒', 'Piscis': '♓',
}

const ORDEN_SIGNOS = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
  'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis',
]

const COLORES_ELEMENTO: Record<string, string> = {
  'Aries': '#ef4444', 'Leo': '#f97316', 'Sagitario': '#eab308',
  'Tauro': '#22c55e', 'Virgo': '#16a34a', 'Capricornio': '#15803d',
  'Géminis': '#facc15', 'Libra': '#fb923c', 'Acuario': '#60a5fa',
  'Cáncer': '#818cf8', 'Escorpio': '#a78bfa', 'Piscis': '#c084fc',
}

function signoAGrados(signo: string): number {
  const idx = ORDEN_SIGNOS.indexOf(signo)
  return idx >= 0 ? idx * 30 + 15 : 0
}

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

export default function RuedaNatal({ planetas, nombre }: Props) {
  const cx = 160
  const cy = 160
  const rOuter = 148
  const rSignos = 130
  const rSignosTxt = 118
  const rDivisores = 110
  const rPlanetas = 88
  const rInner = 68

  const planetasConGrados = planetas.map((p, i) => {
    const base = signoAGrados(p.signo)
    const offset = (i % 3) * 8 - 8
    return { ...p, grados: base + offset }
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <svg width="320" height="320" viewBox="0 0 320 320" style={{ display: 'block' }}>

        {/* Fondo exterior */}
        <circle cx={cx} cy={cy} r={rOuter}
          fill="rgba(139,92,246,0.08)"
          stroke="rgba(139,92,246,0.35)"
          strokeWidth="0.8" />

        {/* Sectores por signo */}
        {ORDEN_SIGNOS.map((signo, i) => {
          const startDeg = i * 30 - 90
          const endDeg = startDeg + 30
          const startRad = (startDeg * Math.PI) / 180
          const endRad = (endDeg * Math.PI) / 180
          const x1o = cx + rOuter * Math.cos(startRad)
          const y1o = cy + rOuter * Math.sin(startRad)
          const x2o = cx + rOuter * Math.cos(endRad)
          const y2o = cy + rOuter * Math.sin(endRad)
          const x1i = cx + rSignos * Math.cos(startRad)
          const y1i = cy + rSignos * Math.sin(startRad)
          const x2i = cx + rSignos * Math.cos(endRad)
          const y2i = cy + rSignos * Math.sin(endRad)
          const color = COLORES_ELEMENTO[signo] || '#888'
          return (
            <path key={signo}
              d={`M ${x1o} ${y1o} A ${rOuter} ${rOuter} 0 0 1 ${x2o} ${y2o} L ${x2i} ${y2i} A ${rSignos} ${rSignos} 0 0 0 ${x1i} ${y1i} Z`}
              fill={color} fillOpacity="0.12"
              stroke={color} strokeOpacity="0.4" strokeWidth="0.5" />
          )
        })}

        {/* Glifos de signos */}
        {ORDEN_SIGNOS.map((signo, i) => {
          const pos = polarToXY(cx, cy, rSignosTxt, i * 30 + 15)
          return (
            <text key={signo}
              x={pos.x} y={pos.y}
              textAnchor="middle" dominantBaseline="central"
              fontSize="11" fill={COLORES_ELEMENTO[signo] || '#888'} fillOpacity="0.9">
              {GLIFOS_SIGNOS[signo] || signo[0]}
            </text>
          )
        })}

        {/* Líneas divisorias de casas */}
        {Array.from({ length: 12 }, (_, i) => {
          const inner = polarToXY(cx, cy, rInner, i * 30)
          const outer = polarToXY(cx, cy, rDivisores, i * 30)
          return (
            <line key={i}
              x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
              stroke="rgba(139,92,246,0.25)" strokeWidth="0.5" />
          )
        })}

        {/* Círculo interior */}
        <circle cx={cx} cy={cy} r={rInner}
          fill="rgba(13,0,21,0.7)"
          stroke="rgba(139,92,246,0.4)" strokeWidth="0.8" />

        {/* Guías anillo planetas */}
        <circle cx={cx} cy={cy} r={rPlanetas + 14}
          fill="none" stroke="rgba(139,92,246,0.1)"
          strokeWidth="0.4" strokeDasharray="2 4" />
        <circle cx={cx} cy={cy} r={rPlanetas - 14}
          fill="none" stroke="rgba(139,92,246,0.1)"
          strokeWidth="0.4" strokeDasharray="2 4" />

        {/* Planetas */}
        {planetasConGrados.map(({ planeta, signo, grados }) => {
          const pos = polarToXY(cx, cy, rPlanetas, grados)
          const lineInner = polarToXY(cx, cy, rInner + 4, grados)
          const color = COLORES_ELEMENTO[signo] || '#a78bfa'
          return (
            <g key={planeta}>
              <line
                x1={lineInner.x} y1={lineInner.y}
                x2={pos.x} y2={pos.y}
                stroke={color} strokeOpacity="0.3"
                strokeWidth="0.5" strokeDasharray="2 3" />
              <circle cx={pos.x} cy={pos.y} r="13"
                fill="rgba(13,0,21,0.9)"
                stroke={color} strokeWidth="1" strokeOpacity="0.8" />
              <text x={pos.x} y={pos.y - 3}
                textAnchor="middle" dominantBaseline="central"
                fontSize="11" fill={color}>
                {GLIFOS[planeta] || planeta[0]}
              </text>
              <text x={pos.x} y={pos.y + 6}
                textAnchor="middle" dominantBaseline="central"
                fontSize="6" fill="rgba(255,255,255,0.5)">
                {planeta.slice(0, 3).toUpperCase()}
              </text>
            </g>
          )
        })}

        {/* Centro */}
        <text x={cx} y={cy - 4}
          textAnchor="middle" dominantBaseline="central"
          fontSize="22" fill="rgba(167,139,250,0.6)">✦</text>
        {nombre && (
          <text x={cx} y={cy + 16}
            textAnchor="middle" dominantBaseline="central"
            fontSize="7" fill="rgba(255,255,255,0.3)" letterSpacing="1">
            {nombre.toUpperCase().slice(0, 12)}
          </text>
        )}
      </svg>

      {/* Leyenda */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '4px 12px', width: '100%', maxWidth: 280, padding: '0 4px',
      }}>
        {planetasConGrados.map(({ planeta, signo }) => (
          <div key={planeta} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, color: COLORES_ELEMENTO[signo] || '#a78bfa' }}>
              {GLIFOS[planeta] || '·'}
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
              {planeta}
            </span>
            <span style={{ fontSize: 11, color: COLORES_ELEMENTO[signo] || '#a78bfa', marginLeft: 'auto' }}>
              {GLIFOS_SIGNOS[signo] || signo[0]} {signo}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}