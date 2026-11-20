import { ILLU } from '../shared/palette'
import { SOFA_PARTS, DOWELS } from './sofaParts'

function Shape({ shape, ...props }) {
  switch (shape.type) {
    case 'rect':
      return <rect x={shape.x} y={shape.y} width={shape.w} height={shape.h} rx={shape.rx} {...props} />
    case 'polygon':
      return <polygon points={shape.points} {...props} />
    default:
      return <path d={shape.d} {...props} />
  }
}

/**
 * Steps 2–3 — The sofa frame members.
 *
 * Five structural parts start as raw plank sections, explode into a spread
 * technical diagram, then join into the assembled sofa side frame.
 *
 * Each part <g data-part> is positioned entirely by the timeline (x / y /
 * rotation). Inside it, [data-raw] (sawn board) cross-fades into
 * [data-shaped] (finished profile), whose fill later turns to oiled oak.
 */
export default function FurnitureAssembly() {
  return (
    <g>
      {/* assembly guide lines: exploded position → assembled position */}
      {SOFA_PARTS.map((p) => (
        <line
          key={p.id}
          data-production="connector"
          x1={p.explodedPos.x}
          y1={p.explodedPos.y}
          x2={p.assembled.x}
          y2={p.assembled.y}
          stroke={ILLU.terracotta}
          strokeWidth="1.4"
          strokeDasharray="4 4"
          pathLength="100"
        />
      ))}

      {SOFA_PARTS.map((p) => (
        <g key={p.id} data-part={p.id}>
          {/* raw plank section */}
          <rect
            data-raw
            x={-p.raw.w / 2}
            y={-p.raw.h / 2}
            width={p.raw.w}
            height={p.raw.h}
            fill={ILLU.rawWood}
            stroke={ILLU.rawWoodEdge}
            strokeWidth="1.2"
          />
          {/* grain line along the board's long axis */}
          <line
            data-raw
            x1={-(Math.max(p.raw.w, p.raw.h) / 2 - 8)}
            y1="0"
            x2={Math.max(p.raw.w, p.raw.h) / 2 - 8}
            y2="0"
            stroke={ILLU.rawWoodEdge}
            strokeWidth="0.8"
            opacity="0.6"
            transform={p.raw.w < p.raw.h ? 'rotate(90)' : undefined}
          />
          {/* shaped sofa frame member */}
          <Shape data-shaped shape={p.shape} fill={ILLU.rawWood} stroke={ILLU.oakDeep} strokeWidth="1.4" strokeLinejoin="round" />
        </g>
      ))}

      {/* joint dowels (appear in Step 3 as parts assemble) */}
      {DOWELS.map(([x, y], i) => (
        <circle key={i} data-production="dowel" cx={x} cy={y} r="4.5" fill={ILLU.terracotta} />
      ))}
    </g>
  )
}
