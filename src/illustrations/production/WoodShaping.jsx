import { ILLU } from '../shared/palette'
import { SOFA_PARTS } from './sofaParts'

const armPanel = SOFA_PARTS.find((p) => p.id === 'armPanel')

/**
 * STEP 2 — Frame assembly. A block plane refines the oak rail at the bench
 * while the full-size sofa frame joins together, leaving a few curled shavings.
 */
export default function WoodShaping() {
  const y = 493 // rests on the visible front rail as it is refined for assembly
  return (
    <g>
      <g data-production="plane" transform={`translate(0 ${y})`}>
        <path d="M-34 0 L-28 -18 L26 -18 L34 0 Z" fill={ILLU.terracotta} />
        <rect x="-10" y="-30" width="22" height="12" rx="6" fill={ILLU.oakDeep} />
        <path d="M-28 -18 L26 -18" stroke={ILLU.ink} strokeWidth="1" opacity="0.4" />
      </g>
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${armPanel.explodedPos.x + 70 + i * 9} ${y - 6 - i * 4})`}>
          <path
            data-production="shaving"
            d="M0 0 c6 -8 14 -2 9 4 c-4 5 -10 0 -6 -4"
            fill="none"
            stroke={ILLU.rawWoodEdge}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </g>
      ))}
    </g>
  )
}
