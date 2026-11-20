import { ILLU } from '../shared/palette'
import { useResponsiveViewBox } from '../shared/useResponsiveViewBox'
import Character from '../forest/Character'
import Workbench, { Backdrop, Floor, ToolRack } from './Workbench'
import WoodCutting from './WoodCutting'
import WoodShaping from './WoodShaping'
import FurnitureAssembly from './FurnitureAssembly'
import WoodenFrame from './WoodenFrame'
import FinishingScene from './FinishingScene'

/**
 * SCENE 04 artwork — the workshop. Same 1600 × 900 artboard, palette, line
 * weights and figure style as the forest, so the two read as one story.
 * Paint order matters: the joiner stands BEHIND the bench (which hides the
 * legs); parts, saw, plane and finishing details sit in front of it.
 */
const FRAMES = {
  landscape: '0 0 1600 900',
  tablet: '200 -380 1180 1280',
  portrait: '430 -560 820 1460',
}

export default function ProductionScene() {
  const viewBox = useResponsiveViewBox(FRAMES)
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMax slice"
      role="img"
      aria-label="Illustration: a joiner cuts a plank, shapes the pieces, assembles a sofa frame and finishes it with linen upholstery"
    >
      <rect x="-400" y="-1200" width="2400" height="2400" fill={ILLU.paper} />
      <Backdrop />
      <ToolRack />
      <Floor />

      <g data-production="joiner">
        <Character x={560} y={820} scale={3.9} limb={4} coat={ILLU.forest} apron={ILLU.terracotta} hair={ILLU.trunk} armPose="forward" />
      </g>

      <Workbench />
      <FurnitureAssembly />
      <g id="production-sofa-view">
        <WoodenFrame />
      </g>
      <WoodCutting />
      <WoodShaping />
      <g id="production-finished-sofa-view">
        <FinishingScene compact={viewBox === FRAMES.portrait} />
      </g>
    </svg>
  )
}
