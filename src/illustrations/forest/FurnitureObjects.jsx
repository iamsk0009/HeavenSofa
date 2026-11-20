import { ILLU } from '../shared/palette'

/**
 * Objects at the "home" end of the journey and the timber along the way.
 * Each piece has its origin at its base so it can rise/scale from the ground.
 */

/** Minimal house with the brand's arched terracotta door — an echo of Scene 01. */
export function Home({ x, y }) {
  return (
    // outer <g> positions, inner <g> is animated (GSAP y would replace the translate)
    <g transform={`translate(${x} ${y})`}>
    <g data-forest="home">
      <rect x="-92" y="-128" width="184" height="128" fill={ILLU.cream} />
      <rect x="-92" y="-128" width="184" height="128" fill={ILLU.ink} opacity="0.04" />
      <rect x="20" y="-128" width="72" height="128" fill={ILLU.ink} opacity="0.07" />
      <path d="M-24 0 V-58 A24 24 0 0 1 24 -58 V0 Z" fill={ILLU.terracotta} />
      <path d="M-24 0 V-58 A24 24 0 0 1 0 -82 V0 Z" fill={ILLU.ink} opacity="0.08" />
      <rect x="-100" y="-134" width="200" height="8" fill={ILLU.groundDeep} />
    </g>
    </g>
  )
}

const Base = ({ x, y, children }) => (
  <g transform={`translate(${x} ${y})`}>
    <g data-forest="furniture">{children}</g>
  </g>
)

export function SofaSilhouette({ x, y }) {
  return (
    <Base x={x} y={y}>
      <rect x="-58" y="-36" width="116" height="22" rx="6" fill={ILLU.linen} />
      <rect x="-50" y="-52" width="100" height="22" rx="7" fill={ILLU.linen} />
      <rect x="-64" y="-42" width="14" height="28" rx="6" fill={ILLU.linen} />
      <rect x="50" y="-42" width="14" height="28" rx="6" fill={ILLU.linen} />
      <rect x="-50" y="-52" width="100" height="22" rx="7" fill={ILLU.ink} opacity="0.06" />
      <path d="M-52 -14 L-55 0 M52 -14 L55 0" stroke={ILLU.oakDeep} strokeWidth="3" strokeLinecap="round" />
    </Base>
  )
}

export function TubChairSilhouette({ x, y }) {
  return (
    <Base x={x} y={y}>
      <path d="M-30 -6 Q-34 -46 0 -50 Q34 -46 30 -6 Z" fill={ILLU.terracotta} />
      <rect x="-24" y="-24" width="48" height="16" rx="8" fill={ILLU.terracottaSoft} />
      <rect x="-18" y="-6" width="36" height="6" rx="2" fill={ILLU.oakDeep} />
    </Base>
  )
}

export function RoundTable({ x, y }) {
  return (
    <Base x={x} y={y}>
      <ellipse cx="0" cy="-30" rx="26" ry="5" fill={ILLU.terracotta} />
      <path d="M-9 -27 Q-4 -14 -10 0 L10 0 Q4 -14 9 -27 Z" fill={ILLU.oakDeep} />
    </Base>
  )
}

export function FloorLampSilhouette({ x, y }) {
  return (
    <Base x={x} y={y}>
      <line x1="0" y1="0" x2="0" y2="-70" stroke={ILLU.ink} strokeWidth="2.5" />
      <path d="M-12 -70 L-8 -86 L8 -86 L12 -70 Z" fill={ILLU.paper} stroke={ILLU.inkSoft} strokeWidth="1" />
      <ellipse cx="0" cy="0" rx="9" ry="2.5" fill={ILLU.ink} />
    </Base>
  )
}

/** Log seen end-on: bark ring + growth rings. */
export function LogEnd({ cx, cy, r }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={ILLU.oakDeep} />
      <circle cx={cx} cy={cy} r={r * 0.82} fill={ILLU.rawWood} />
      <circle cx={cx} cy={cy} r={r * 0.55} fill="none" stroke={ILLU.rawWoodEdge} strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r * 0.28} fill="none" stroke={ILLU.rawWoodEdge} strokeWidth="1" />
    </g>
  )
}

/** Stacked felled logs at the forest edge. */
export function LogPile({ x, y }) {
  const r = 15
  const ends = [
    [0, 0], [2 * r, 0], [4 * r, 0],
    [r, -1.75 * r], [3 * r, -1.75 * r],
    [2 * r, -3.5 * r],
  ]
  return (
    <g transform={`translate(${x} ${y})`} data-forest="logpile">
      {ends.map(([lx, ly], i) => (
        <rect key={`b${i}`} x={lx - 80} y={ly - r - r} width="80" height={2 * r} rx={r} fill={ILLU.trunk} />
      ))}
      {ends.map(([lx, ly], i) => (
        <LogEnd key={i} cx={lx} cy={ly - r} r={r} />
      ))}
    </g>
  )
}

/** Two-wheeled hand cart loaded with logs; the wheel is tagged for rotation. */
export function LogCart() {
  return (
    <g>
      <rect x="-46" y="-40" width="92" height="12" rx="3" fill={ILLU.oakDeep} />
      <line x1="-46" y1="-34" x2="-70" y2="-52" stroke={ILLU.oakDeep} strokeWidth="4" strokeLinecap="round" />
      {[[-26, -52], [0, -52], [26, -52], [-13, -74], [13, -74]].map(([cx, cy], i) => (
        <LogEnd key={i} cx={cx} cy={cy} r={12} />
      ))}
      <g transform="translate(0 -16)">
        <g data-forest="wheel">
          <circle r="16" fill="none" stroke={ILLU.ink} strokeWidth="3.5" />
          <path d="M-16 0 H16 M0 -16 V16 M-11 -11 L11 11 M-11 11 L11 -11" stroke={ILLU.ink} strokeWidth="1.5" />
        </g>
      </g>
    </g>
  )
}
