import { ILLU } from '../shared/palette'

/**
 * The path from the forest edge (front-left) to the home doorway (back-right).
 * The same `d` is used by GSAP MotionPath, so walkers follow it exactly.
 */
export const PATH_ID = 'forest-walking-path'
export const PATH_D = 'M330 960 C470 840 600 800 780 770 C960 740 1080 700 1180 672 C1230 658 1255 650 1270 646'

export default function WalkingPath() {
  return (
    <g data-forest="path">
      {/* trodden band */}
      <path d={PATH_D} fill="none" stroke={ILLU.path} strokeWidth="44" strokeLinecap="round" />
      {/* edge wear */}
      <path d={PATH_D} fill="none" stroke={ILLU.groundDeep} strokeWidth="1.5" strokeDasharray="2 14" transform="translate(0 20)" opacity="0.8" />
      {/* motion-path guide (invisible) */}
      <path id={PATH_ID} d={PATH_D} fill="none" stroke="none" />
    </g>
  )
}
