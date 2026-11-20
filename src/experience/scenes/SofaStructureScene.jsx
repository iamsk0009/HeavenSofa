import { useCallback, useMemo, useRef } from 'react'
import { useRegisterScene } from '../../animations/sceneRegistry'
import StudioStage, { STUDIO } from '../models/StudioStage'
import ExplodedSofa from '../models/ExplodedSofa'
import LabelProjector from '../LabelProjector'

/**
 * SCENE 05 — Under the surface.
 *
 * Mounts the shared photographic studio (also used by Scene 06) and the
 * construction-accurate sofa. Hands the sofa's nodes to the master timeline;
 * all motion lives in animations/sofaStructureAnimation.js.
 */
export default function SofaStructureScene() {
  const sofa = useRef(null)
  const refs = useMemo(() => ({ sofa }), [])
  useRegisterScene('sofaStructure', refs)

  const anchors = useCallback(() => sofa.current?.anchors, [])

  return (
    <group name="scene-sofaStructure">
      <StudioStage />
      <ExplodedSofa nodesRef={sofa} position={[STUDIO.sofaX, 0, 0]} />
      <LabelProjector sceneId="sofaStructure" anchors={anchors} />
    </group>
  )
}
