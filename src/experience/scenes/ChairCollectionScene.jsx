import { createRef, useCallback, useMemo } from 'react'
import * as THREE from 'three'
import { useRegisterScene } from '../../animations/sceneRegistry'
import { CHAIRS, PLATFORM } from '../../data/chairCollection'
import { STUDIO } from '../models/StudioStage'
import ChairPlatform from '../models/ChairPlatform'
import ChairModel from '../models/ChairModel'
import LabelProjector from '../LabelProjector'

/**
 * SCENE 06 — The chair collection.
 *
 * The oval platform and five chairs stand in the shared studio (StudioStage
 * is mounted by Scene 05). Hands the platform, chairs, shadows and label
 * anchors to the master timeline; motion lives in
 * animations/chairCollectionAnimation.js.
 */
export default function ChairCollectionScene() {
  const refs = useMemo(
    () => ({
      platform: createRef(),
      chairs: CHAIRS.map(() => createRef()),
      shadows: CHAIRS.map(() => createRef()),
    }),
    [],
  )
  useRegisterScene('chairs', refs)

  // product labels sit on the platform just in front of each chair
  const anchorObjects = useMemo(
    () =>
      Object.fromEntries(
        CHAIRS.map((c) => {
          const a = new THREE.Object3D()
          a.position.set(c.x + Math.sin(c.ry) * 0.62, PLATFORM.height, c.z + Math.cos(c.ry) * 0.62)
          return [`chair-${c.id}`, a]
        }),
      ),
    [],
  )
  const anchors = useCallback(() => anchorObjects, [anchorObjects])

  return (
    <group name="scene-chairs" position-x={STUDIO.chairsX}>
      <ChairPlatform ref={refs.platform} />
      {CHAIRS.map((c, i) => (
        <ChairModel
          key={c.id}
          ref={refs.chairs[i]}
          shadowRef={refs.shadows[i]}
          url={c.url}
          mats={c.mats}
          position={[c.x, PLATFORM.height, c.z]}
          rotation-y={c.ry}
        />
      ))}
      {Object.values(anchorObjects).map((a) => (
        <primitive key={a.uuid} object={a} />
      ))}
      <LabelProjector sceneId="chairs" anchors={anchors} />
    </group>
  )
}
