import { ILLU } from '../shared/palette'
import { CUTS, PLANK } from './sofaParts'

/**
 * STEP 1 — Cutting. Pencil cut marks across the plank, the hand saw that
 * travels from mark to mark, the finished kerfs and the sawdust they leave.
 * (The plank itself is the five raw parts in FurnitureAssembly, lying flush.)
 */
export default function WoodCutting() {
  const y0 = PLANK.y - 6
  const y1 = PLANK.y + PLANK.thickness + 6
  return (
    <g>
      {/* Fine layout guides establish measured cuts before the saw arrives. */}
      <g data-production="cut-guide" fill="none" stroke={ILLU.terracotta} strokeWidth="1" opacity="0.7">
        <path d={`M${PLANK.x0} ${y0 - 10} H${PLANK.x0 + PLANK.length}`} strokeDasharray="5 5" />
        {CUTS.map((x) => <path key={`tick-${x}`} d={`M${x} ${y0 - 14} v8 M${x} ${y1 + 6} v8`} />)}
      </g>
      {CUTS.map((x, i) => (
        <g key={x}>
          <line data-production="cutmark" x1={x} y1={y0} x2={x} y2={y1} stroke={ILLU.ink} strokeWidth="1.2" strokeDasharray="3 3" />
          <line data-production="kerf" data-cut={i} x1={x} y1={PLANK.y} x2={x} y2={PLANK.y + PLANK.thickness} stroke={ILLU.paper} strokeWidth="3" />
          {[[-7, 6], [4, 9], [9, 4], [-2, 12]].map(([dx, dy], j) => (
            <circle key={j} data-production="dust" data-cut={i} cx={x + dx} cy={PLANK.y + PLANK.thickness + dy} r={1.8} fill={ILLU.rawWoodEdge} />
          ))}
        </g>
      ))}

      {/* hand saw: outer group is positioned on each mark; inner group strokes */}
      <g data-production="saw">
        <g transform="rotate(-32)">
          <g data-production="saw-stroke">
            <path d="M0 0 L0 -26 L118 -30 L118 4 Z" fill={ILLU.cream} stroke={ILLU.ink} strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M2 2 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4" fill="none" stroke={ILLU.ink} strokeWidth="1" />
            <path d="M114 -36 h30 a10 10 0 0 1 10 10 v26 a10 10 0 0 1 -10 10 h-30 Z" fill={ILLU.oakDeep} />
            <rect x="126" y="-24" width="16" height="16" rx="6" fill={ILLU.paper} />
          </g>
        </g>
      </g>
    </g>
  )
}
