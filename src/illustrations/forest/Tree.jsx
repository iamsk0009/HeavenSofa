import { useId } from 'react'
import { ILLU } from '../shared/palette'

/**
 * Editorial flat tree. Origin = base of the trunk; `h` = total height.
 * Each species is built from a couple of clean organic shapes plus a shade
 * plane (the canopy's right side, clipped to the canopy) for a consistent
 * light direction across the whole artwork.
 *
 * The outer <g> carries the scroll animation (grow from the base), so it is
 * tagged with data-tree={layer} and positioned via `transform`.
 */
function canopy(type, h) {
  switch (type) {
    case 'conifer': {
      const w = h * 0.42
      return (
        <path
          d={`M0 ${-h} C${w * 0.12} ${-h * 0.75} ${w * 0.48} ${-h * 0.34} ${w * 0.5} ${-h * 0.17}
              Q${w * 0.5} ${-h * 0.08} 0 ${-h * 0.08} Q${-w * 0.5} ${-h * 0.08} ${-w * 0.5} ${-h * 0.17}
              C${-w * 0.48} ${-h * 0.34} ${-w * 0.12} ${-h * 0.75} 0 ${-h} Z`}
        />
      )
    }
    case 'round':
      return <circle cx="0" cy={-h * 0.66} r={h * 0.33} />
    case 'poplar':
      return <ellipse cx="0" cy={-h * 0.6} rx={h * 0.16} ry={h * 0.4} />
    case 'cloud':
      return (
        <>
          <circle cx={-h * 0.19} cy={-h * 0.55} r={h * 0.2} />
          <circle cx={h * 0.17} cy={-h * 0.58} r={h * 0.21} />
          <circle cx="0" cy={-h * 0.76} r={h * 0.24} />
        </>
      )
    case 'birch':
      return (
        <>
          <ellipse cx={-h * 0.06} cy={-h * 0.7} rx={h * 0.15} ry={h * 0.2} />
          <ellipse cx={h * 0.08} cy={-h * 0.56} rx={h * 0.13} ry={h * 0.16} />
        </>
      )
    default:
      return null
  }
}

const TRUNK_TOP = { conifer: 0.1, round: 0.45, poplar: 0.22, cloud: 0.5, birch: 0.5 }

export default function Tree({ type = 'round', x, y, h, color = ILLU.forest, layer, shade = 0.22 }) {
  const id = useId().replace(/:/g, '')
  const trunkTop = -h * TRUNK_TOP[type]
  const trunkW = Math.max(2.5, h * (type === 'birch' ? 0.035 : 0.028))
  const birch = type === 'birch'

  return (
    <g transform={`translate(${x} ${y})`}>
      <g data-tree={layer}>
        <defs>
          <clipPath id={`canopy-${id}`}>{canopy(type, h)}</clipPath>
        </defs>

        {/* trunk */}
        <rect x={-trunkW / 2} y={trunkTop} width={trunkW} height={-trunkTop} rx={trunkW / 2} fill={birch ? '#EEE8DC' : ILLU.trunk} />
        {birch &&
          [0.12, 0.22, 0.34].map((t) => (
            <rect key={t} x={-trunkW / 2} y={-h * t} width={trunkW * 0.6} height={1.6} fill={ILLU.ink} opacity="0.7" />
          ))}
        {type === 'cloud' && (
          <path d={`M0 ${-h * 0.42} L${-h * 0.12} ${-h * 0.56} M0 ${-h * 0.46} L${h * 0.1} ${-h * 0.6}`} stroke={ILLU.trunk} strokeWidth={trunkW * 0.6} strokeLinecap="round" />
        )}

        {/* canopy + shade plane */}
        <g fill={color}>{canopy(type, h)}</g>
        <rect x="0" y={-h * 1.1} width={h} height={h} fill={ILLU.ink} opacity={shade} clipPath={`url(#canopy-${id})`} />
      </g>
    </g>
  )
}
