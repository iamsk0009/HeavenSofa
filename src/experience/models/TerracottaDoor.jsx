import { useMemo } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { ARCH, archShape, CURVE_SEGMENTS } from './Archway'
import { makeBrass, makePaint, PALETTE } from './materials'

export const DOOR = {
  thickness: 0.065,
  gap: 0.026,     // clearance to the bevelled opening
  bottom: 0.03,   // clears the stone threshold
  stile: 0.085,   // flat frame left around the reeded field
  reedRadius: 0.0125,
  reedPitch: 0.03,
}

/**
 * Reeded panel: closely spaced half-round reeds whose rounded tops follow
 * the arch, merged into ONE geometry per face (a single draw call).
 */
function buildReeds(hw) {
  const { stile, reedRadius: r, reedPitch: pitch } = DOOR
  const fieldHalf = hw - stile
  const count = Math.floor((fieldHalf * 2) / pitch)
  const start = -((count - 1) * pitch) / 2
  const bottom = DOOR.bottom + stile
  const archR = hw - stile

  const parts = []
  for (let i = 0; i < count; i++) {
    const x = start + i * pitch
    const top = ARCH.spring + Math.sqrt(Math.max(archR * archR - x * x, 0)) - r
    const len = top - bottom - 2 * r
    if (len <= 0) continue
    const g = new THREE.CapsuleGeometry(r, len, 4, 10)
    g.scale(1, 1, 0.45) // shallow half-round profile
    g.translate(x, bottom + r + len / 2, 0)
    parts.push(g)
  }
  const merged = mergeGeometries(parts)
  parts.forEach((g) => g.dispose())
  return merged
}

/**
 * Arch-topped terracotta door fitted to the archway: a painted leaf with a
 * flat stile border, reeded field on both faces, three brass hinge knuckles
 * and a brass bar pull. The forwarded ref is the HINGE group — rotation.y > 0
 * swings it into the room; the angle is owned by the scroll timeline.
 */
export default function TerracottaDoor({ ref, initialAngle = 0 }) {
  const hw = ARCH.halfWidth - DOOR.gap
  const th = DOOR.thickness

  const { leafGeo, reedGeo, paint, reedPaint, brass } = useMemo(() => {
    const leafGeo = new THREE.ExtrudeGeometry(archShape(hw, ARCH.spring, DOOR.bottom), {
      depth: th - 0.012,
      bevelEnabled: true,
      bevelThickness: 0.006,
      bevelSize: 0.006,
      bevelSegments: 3,
      curveSegments: CURVE_SEGMENTS,
    })
    leafGeo.translate(0, 0, -(th - 0.012) / 2)
    return {
      leafGeo,
      reedGeo: buildReeds(hw),
      paint: makePaint(PALETTE.terracotta),
      reedPaint: makePaint(PALETTE.terracotta, 4),
      brass: makeBrass(),
    }
  }, [hw, th])

  const pullX = hw - 0.12

  return (
    <group ref={ref} name="door-hinge" position={[-hw, 0, -ARCH.depth / 2]} rotation-y={initialAngle}>
      {/* hinge knuckles sit on the pivot axis */}
      {[0.32, 1.25, 2.15].map((y) => (
        <mesh key={y} material={brass} position-y={y} castShadow>
          <cylinderGeometry args={[0.011, 0.011, 0.11, 16]} />
        </mesh>
      ))}

      <group name="door-leaf" position-x={hw}>
        <mesh geometry={leafGeo} material={paint} castShadow receiveShadow />
        <mesh geometry={reedGeo} material={reedPaint} position-z={th / 2} castShadow receiveShadow />
        <mesh geometry={reedGeo} material={reedPaint} position-z={-th / 2} rotation-y={Math.PI} castShadow receiveShadow />

        {/* bar pull on both faces */}
        {[1, -1].map((face) => (
          <group key={face} position={[pullX, 1.05, face * (th / 2 + 0.006)]}>
            <mesh material={brass} position-z={face * 0.045} castShadow>
              <cylinderGeometry args={[0.011, 0.011, 0.42, 20]} />
            </mesh>
            {[-0.17, 0.17].map((y) => (
              <mesh key={y} material={brass} position={[0, y, face * 0.0225]} rotation-x={Math.PI / 2}>
                <cylinderGeometry args={[0.007, 0.009, 0.045, 12]} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </group>
  )
}
