import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useRegisterScene } from '../../animations/sceneRegistry'
import { INTRO } from '../../animations/introAnimation'
import Archway from '../models/Archway'
import TerracottaDoor from '../models/TerracottaDoor'
import RoomShell, { ROOM } from '../models/RoomShell'
import Sofa from '../models/Sofa'

/**
 * SCENE 01 — Architectural doorway.
 *
 * Composition only: builds the objects and hands the moving ones (refs) to
 * the master timeline. All motion lives in animations/introAnimation.js; the
 * initial values here come from the same INTRO constants, so the first frame
 * is identical to timeline progress 0.
 */
export default function IntroScene() {
  const doorHinge = useRef()
  const interiorSpot = useRef()
  const interiorFill = useRef()
  const windowLight = useRef()
  const sofa = useRef()

  const refs = useMemo(() => ({ doorHinge, interiorSpot, interiorFill, windowLight, sofa }), [])
  useRegisterScene('intro', refs)

  const spotTarget = useMemo(() => new THREE.Object3D(), [])
  const [sx, , sz] = INTRO.sofa.position

  return (
    <group name="scene-intro">
      <RoomShell />
      <Archway />
      <TerracottaDoor ref={doorHinge} initialAngle={INTRO.door.from} />
      <Sofa ref={sofa} position={[sx, 0, sz + INTRO.sofa.travel]} />

      {/* ── interior lighting ───────────────────────────────────────── */}
      {/* Off-screen window on the right wall: broad, soft daylight that
          models the cushions. RectAreaLights don't cast shadows; the spot
          and the ContactShadows handle grounding. */}
      <rectAreaLight
        ref={windowLight}
        position={[ROOM.halfWidth - 0.05, 1.75, -4.4]}
        rotation-y={Math.PI / 2}
        width={2.6}
        height={1.9}
        color="#FFF6EA"
        intensity={INTRO.lights.window[0]}
      />

      <primitive object={spotTarget} position={[sx, 0.4, sz]} />
      <spotLight
        ref={interiorSpot}
        target={spotTarget}
        position={[0.6, 3.25, -3.2]}
        angle={0.75}
        penumbra={1}
        intensity={INTRO.lights.spot[0]}
        decay={2}
        color="#FFEBD8"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <pointLight ref={interiorFill} position={[0, 2.6, -2.2]} intensity={INTRO.lights.fill[0]} decay={2} color="#FFF1E2" />
    </group>
  )
}
