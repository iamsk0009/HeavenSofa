import { ILLU } from '../shared/palette'
import { useResponsiveViewBox } from '../shared/useResponsiveViewBox'
import Tree from './Tree'
import Character from './Character'
import WalkingPath from './WalkingPath'
import {
  FloorLampSilhouette,
  Home,
  LogCart,
  LogPile,
  RoundTable,
  SofaSilhouette,
  TubChairSilhouette,
} from './FurnitureObjects'

/**
 * SCENE 03 artwork — "From forest to home".
 *
 * Authored on a 1600 × 900 artboard in depth layers, each a separate <g>
 * so the timeline can parallax them at different speeds:
 *   far   sun, distant hills, small tree line
 *   mid   rolling hills, mid-size trees, log pile
 *   near  ground, path, walkers, cart, home and furniture
 *   front large framing trees and ground tufts
 * Layers extend past the artboard edges so panning never exposes a gap.
 */
const FRAMES = {
  landscape: '0 0 1600 900',
  tablet: '220 -380 1180 1280',
  portrait: '545 -560 890 1460',
}

// [type, x, groundY, height, colour]
const FAR_TREES = [
  ['conifer', 70, 612, 92, ILLU.forestMid], ['poplar', 130, 612, 104, ILLU.sage], ['conifer', 185, 612, 80, ILLU.forestMid],
  ['round', 250, 614, 74, ILLU.olive], ['conifer', 310, 612, 110, ILLU.forestMid], ['poplar', 372, 612, 92, ILLU.sage],
  ['conifer', 430, 614, 86, ILLU.forestMid], ['round', 492, 615, 66, ILLU.sageLight], ['conifer', 548, 614, 98, ILLU.forestMid],
  ['poplar', 610, 616, 80, ILLU.sage], ['conifer', 668, 617, 74, ILLU.forestMid], ['round', 735, 619, 58, ILLU.olive],
  ['conifer', 800, 621, 64, ILLU.forestMid], ['poplar', 880, 624, 60, ILLU.sage], ['round', 960, 626, 48, ILLU.sageLight],
]
const MID_TREES = [
  ['cloud', 40, 690, 210, ILLU.olive], ['conifer', 150, 700, 250, ILLU.forest], ['birch', 235, 690, 190, ILLU.sageLight],
  ['conifer', 320, 705, 220, ILLU.forestMid], ['round', 420, 698, 170, ILLU.ochre], ['poplar', 505, 702, 200, ILLU.sage],
  ['conifer', 585, 712, 180, ILLU.forest], ['cloud', 900, 670, 130, ILLU.olive],
]
const FRONT_TREES = [
  ['conifer', -10, 960, 560, ILLU.forest], ['cloud', 175, 980, 430, ILLU.forestMid], ['round', 1740, 990, 470, ILLU.olive],
]

const hills = {
  far: 'M-200 640 C 100 560, 360 520, 640 560 S 1150 520, 1400 548 S 1700 560, 1800 560 L1800 700 L-200 700 Z',
  mid: 'M-200 690 C 120 620, 420 640, 700 650 S 1180 600, 1450 628 S 1720 640, 1800 640 L1800 760 L-200 760 Z',
}

export default function ForestLandscape() {
  const viewBox = useResponsiveViewBox(FRAMES)

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMax slice"
      role="img"
      aria-label="Illustration: timber carried from a forest along a path to a home furnished with HEAVEN & CO. pieces"
    >
      <rect x="-400" y="-1200" width="2400" height="2400" fill={ILLU.paper} />

      {/* ── far ─────────────────────────────────────────────── */}
      <g data-forest="far">
        <g data-forest="sun">
          <circle cx="1180" cy="300" r="185" fill="none" stroke={ILLU.terracotta} strokeWidth="1.2" opacity="0.35" />
          <circle cx="1180" cy="300" r="150" fill="none" stroke={ILLU.terracotta} strokeWidth="1.2" opacity="0.5" />
          <circle cx="1180" cy="300" r="108" fill={ILLU.terracotta} />
          <path d="M1072 300 A108 108 0 0 1 1288 300 Z" fill={ILLU.terracottaSoft} opacity="0.35" />
        </g>
        <g data-forest="birds" fill="none" stroke={ILLU.ink} strokeWidth="1.6" strokeLinecap="round">
          <path d="M930 230 q8 -7 14 0 q6 -7 14 0" />
          <path d="M975 262 q6 -5 11 0 q5 -5 11 0" />
          <path d="M900 280 q5 -4 9 0 q4 -4 9 0" />
        </g>
        <path d={hills.far} fill={ILLU.hillFar} />
        {FAR_TREES.map(([type, x, y, h, color], i) => (
          <Tree key={i} type={type} x={x} y={y} h={h} color={color} layer="far" shade={0.16} />
        ))}
      </g>

      {/* ── mid ─────────────────────────────────────────────── */}
      <g data-forest="mid">
        <path d={hills.mid} fill={ILLU.hillMid} />
        {MID_TREES.map(([type, x, y, h, color], i) => (
          <Tree key={i} type={type} x={x} y={y} h={h} color={color} layer="mid" />
        ))}
      </g>

      {/* ── near ────────────────────────────────────────────── */}
      <g data-forest="near">
        <path d="M-200 700 C 300 660, 900 680, 1800 640 L1800 1300 L-200 1300 Z" fill={ILLU.ground} />
        <WalkingPath />
        <LogPile x={700} y={746} />

        <Home x={1270} y={648} />
        <SofaSilhouette x={1065} y={662} />
        <FloorLampSilhouette x={1385} y={650} />
        <TubChairSilhouette x={1440} y={690} />
        <RoundTable x={1515} y={700} />

        {/* walkers — positioned on the path by MotionPath */}
        <g data-forest="carriers">
          <Character x={-55} coat={ILLU.terracotta} data-walker="">
            <rect x="20" y="-92" width="150" height="13" rx="6.5" fill={ILLU.trunk} />
            <circle cx="170" cy="-85.5" r="6.5" fill={ILLU.rawWood} stroke={ILLU.oakDeep} strokeWidth="1.5" />
          </Character>
          <Character x={60} coat={ILLU.forest} hair={ILLU.trunk} />
        </g>
        <g data-forest="cart">
          <LogCart />
          <Character x={-92} coat={ILLU.ochre} armPose="forward" />
        </g>
      </g>

      {/* ── front ───────────────────────────────────────────── */}
      <g data-forest="front">
        {FRONT_TREES.map(([type, x, y, h, color], i) => (
          <Tree key={i} type={type} x={x} y={y} h={h} color={color} layer="front" shade={0.26} />
        ))}
        <g stroke={ILLU.olive} strokeWidth="2" strokeLinecap="round" opacity="0.8">
          {[[380, 870], [560, 900], [860, 830], [1000, 880], [1180, 820], [1340, 860], [720, 860]].map(([x, y]) => (
            <path key={x} d={`M${x} ${y} l-4 -12 M${x} ${y} l0 -15 M${x} ${y} l5 -11`} />
          ))}
        </g>
      </g>
    </svg>
  )
}
