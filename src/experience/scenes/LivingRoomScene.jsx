import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useRegisterScene } from '../../animations/sceneRegistry'
import { LIVING } from '../../animations/livingRoomAnimation'
import { ROOM } from '../models/RoomShell'
import AccentChair from '../models/AccentChair'
import CoffeeTable from '../models/CoffeeTable'
import BrandTypography from '../models/BrandTypography'
import { BookStack, FloorLamp, Rug, StemVase } from '../models/LivingDecor'

const WALL_Z = -ROOM.depth

/**
 * SCENE 02 — The HEAVEN & CO. living room.
 *
 * Builds on the doorway scene's room and sofa (the sofa stays owned by
 * IntroScene and simply becomes the centrepiece). Adds the bouclé armchair,
 * terracotta coffee table, styling, floor lamp, wall panel joints and the
 * HEAVEN & CO. wordmark. Motion lives in animations/livingRoomAnimation.js.
 */
export default function LivingRoomScene() {
  const chair = useRef()
  const table = useRef()
  const typography = useRef()
  const lampShade = useRef()
  const lampLight = useRef()

  const refs = useMemo(() => ({ chair, table, typography, lampShade, lampLight }), [])
  useRegisterScene('livingRoom', refs)

  const jointMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#B4BCA2', roughness: 0.95 }), [])
  const { chair: c, table: t, typography: ty } = LIVING

  return (
    <group name="scene-livingRoom">
      <Rug position={[0.3, 0, -5.3]} size={[3.5, 2.5]} />

      {/* Shadow-gap panel joints frame the arrangement on the sage wall */}
      {[-2.75, 3.15].map((x) => (
        <mesh key={x} material={jointMat} position={[x, ROOM.height / 2, WALL_Z + 0.003]} receiveShadow>
          <boxGeometry args={[0.022, ROOM.height, 0.004]} />
        </mesh>
      ))}

      <BrandTypography
        ref={typography}
        position={[0.2, ty.capCentreY - ty.rise, WALL_Z + 0.006]}
        capHeight={ty.capHeight}
        opacity={ty.opacity[0]}
      />

      {/* start parked out of every doorway sightline — see LIVING */}
      <AccentChair ref={chair} position={c.from.position} rotation-y={c.from.rotationY} />

      <CoffeeTable ref={table} position={t.from.position} rotation-y={t.from.rotationY}>
        <StemVase position={[-0.16, 0, 0.06]} />
        <BookStack position={[0.15, 0, -0.08]} rotation-y={-0.35} />
      </CoffeeTable>

      <FloorLamp shadeRef={lampShade} lightRef={lampLight} position={[-1.5, 0, -6.35]} />
    </group>
  )
}
