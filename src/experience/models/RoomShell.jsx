import { useMemo } from 'react'
import * as THREE from 'three'
import { ARCH } from './Archway'
import { makeMicrocement, makePlaster, PALETTE } from './materials'

/**
 * The room behind the arch: one continuous microcement floor (outside and
 * in), a sage plaster back wall, cream side walls with skirting, and a
 * ceiling that keeps the room in soft shade so the doorway light reads.
 * Phase 3 (living room) builds on this same space.
 */
export const ROOM = {
  depth: 7,       // back wall at z = -ROOM.depth
  halfWidth: 5,
  height: 3.4,
}

const FLOOR = { width: 40, depth: 30 }

export default function RoomShell() {
  const innerDepth = ROOM.depth - ARCH.depth
  const midZ = -(ARCH.depth + innerDepth / 2)

  const mats = useMemo(
    () => ({
      floor: makeMicrocement(PALETTE.floor, [FLOOR.width / 3, FLOOR.depth / 3]),
      back: makePlaster(PALETTE.sage, [ROOM.halfWidth, ROOM.height / 2]),
      side: makePlaster(PALETTE.cream, [innerDepth / 2, ROOM.height / 2]),
      // faint emissive lift: in reality the ceiling is lit by bounce light,
      // which real-time rendering without GI under-represents
      ceiling: new THREE.MeshStandardMaterial({ color: PALETTE.paper, roughness: 1, emissive: '#6E665A', emissiveIntensity: 0.55 }),
      skirting: new THREE.MeshStandardMaterial({ color: PALETTE.creamShade, roughness: 0.75 }),
    }),
    [innerDepth],
  )

  return (
    <group name="room-shell">
      <mesh material={mats.floor} rotation-x={-Math.PI / 2} position={[0, 0, -2]} receiveShadow>
        <planeGeometry args={[FLOOR.width, FLOOR.depth]} />
      </mesh>

      <mesh material={mats.back} position={[0, ROOM.height / 2, -ROOM.depth]} receiveShadow>
        <planeGeometry args={[ROOM.halfWidth * 2, ROOM.height]} />
      </mesh>
      <mesh material={mats.skirting} position={[0, 0.05, -ROOM.depth + 0.012]} receiveShadow>
        <boxGeometry args={[ROOM.halfWidth * 2, 0.1, 0.024]} />
      </mesh>

      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh
            material={mats.side}
            position={[side * ROOM.halfWidth, ROOM.height / 2, midZ]}
            rotation-y={-side * (Math.PI / 2)}
            receiveShadow
            castShadow
          >
            <planeGeometry args={[innerDepth, ROOM.height]} />
          </mesh>
          <mesh material={mats.skirting} position={[side * (ROOM.halfWidth - 0.012), 0.05, midZ]} receiveShadow>
            <boxGeometry args={[0.024, 0.1, innerDepth]} />
          </mesh>
        </group>
      ))}

      <mesh material={mats.ceiling} position={[0, ROOM.height, midZ]} rotation-x={Math.PI / 2} castShadow receiveShadow>
        <planeGeometry args={[ROOM.halfWidth * 2, innerDepth]} />
      </mesh>
    </group>
  )
}
