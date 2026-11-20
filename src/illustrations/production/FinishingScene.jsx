import { ILLU } from '../shared/palette'
import sofaArtwork from './linnea_sofa_front_layered.svg?raw'

export default function FinishingScene({ compact = false }) {
  const star = 'M0 -9 L2 -2 L9 0 L2 2 L0 9 L-2 2 L-9 0 L-2 -2 Z'

  return (
    <g>
      <g dangerouslySetInnerHTML={{ __html: sofaArtwork }} />

      {[[1092, 318, 1], [742, 296, 0.7], [1082, 455, 0.6]].map(([x, y, scale], index) => (
        <g key={index} transform={`translate(${x} ${y}) scale(${scale})`}>
          <path data-production="sparkle" d={star} fill={ILLU.ochre} />
        </g>
      ))}

      <g transform={compact ? 'translate(870 236)' : 'translate(1118 298)'}>
        <g data-production="label" textAnchor={compact ? 'middle' : 'start'}>
          {!compact && <line x1="-14" y1="6" x2="-88" y2="52" stroke={ILLU.ink} strokeWidth="1" />}
          <text fontFamily="Fraunces, serif" fontSize="26" fill={ILLU.ink}>Linnea</text>
          <text y="28" fontFamily="Fraunces, serif" fontSize="15" fontStyle="italic" fill={ILLU.inkSoft}>Two-seater sofa</text>
          <text y="50" fontFamily="Inter, sans-serif" fontSize="12" letterSpacing="2.5" fill={ILLU.inkSoft}>STONEWASHED LINEN · OAK</text>
        </g>
      </g>
    </g>
  )
}
