import { useMemo } from 'react'
import * as THREE from 'three'
import { makePlaster, makeStone, PALETTE } from './materials'

/**
 * Architectural archway: a thick plaster wall with a real round-arched
 * opening, softened (bevelled) edges, a raised arch moulding, a stone
 * threshold and skirting.
 *
 * Coordinates: wall front face at z = 0, extruding back to z = -ARCH.depth.
 * The opening is centred on x = 0 and sits on the floor (y = 0).
 */
export const ARCH = {
  halfWidth: 0.8,      // opening is 1.6 m wide; arch radius = halfWidth
  spring: 2.0,         // height where the semicircle starts → 2.8 m apex
  depth: 0.45,         // wall thickness — a deep reveal reads as real masonry
  wallHalfWidth: 7,
  wallHeight: 8,
  edge: 0.015,         // bevel radius that softens every wall edge
  trim: 0.09,          // arch moulding width
}

export const CURVE_SEGMENTS = 64

/* ── Shapes (shared with the door) ──────────────────────────────────── */

/** Wall outline with an arch-shaped notch (no holes → clean triangulation). */
function wallShape({ halfWidth: hw, spring, wallHalfWidth: W, wallHeight: H }) {
  const s = new THREE.Shape()
  s.moveTo(-W, 0)
  s.lineTo(-hw, 0)
  s.lineTo(-hw, spring)
  s.absarc(0, spring, hw, Math.PI, 0, true) // over the top, left → right
  s.lineTo(hw, 0)
  s.lineTo(W, 0)
  s.lineTo(W, H)
  s.lineTo(-W, H)
  s.closePath()
  return s
}

/** Solid arch silhouette (door leaf). */
export function archShape(hw, spring, bottom = 0) {
  const s = new THREE.Shape()
  s.moveTo(-hw, bottom)
  s.lineTo(hw, bottom)
  s.lineTo(hw, spring)
  s.absarc(0, spring, hw, 0, Math.PI, false)
  s.closePath()
  return s
}

/** Arch-shaped ring for the moulding around the opening. */
function archRingShape(inner, outer, spring) {
  const s = new THREE.Shape()
  s.moveTo(-outer, 0)
  s.lineTo(-outer, spring)
  s.absarc(0, spring, outer, Math.PI, 0, true)
  s.lineTo(outer, 0)
  s.lineTo(inner, 0)
  s.lineTo(inner, spring)
  s.absarc(0, spring, inner, 0, Math.PI, false)
  s.closePath()
  return s
}

/* ── Component ──────────────────────────────────────────────────────── */

export default function Archway() {
  const { wallGeo, trimGeo, wallMat, trimMat, skirtMat, stoneMat } = useMemo(() => {
    // Bevel rounds the arris of the opening so light rolls over the edge
    // instead of breaking on a razor-sharp corner.
    const wallGeo = new THREE.ExtrudeGeometry(wallShape(ARCH), {
      depth: ARCH.depth - ARCH.edge * 2,
      bevelEnabled: true,
      bevelThickness: ARCH.edge,
      bevelSize: ARCH.edge,
      bevelSegments: 3,
      curveSegments: CURVE_SEGMENTS,
    })
    wallGeo.translate(0, 0, -ARCH.depth + ARCH.edge) // front face lands on z = 0

    const trimGeo = new THREE.ExtrudeGeometry(
      archRingShape(ARCH.halfWidth - ARCH.edge, ARCH.halfWidth + ARCH.trim, ARCH.spring),
      { depth: 0.03, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.008, bevelSegments: 3, curveSegments: CURVE_SEGMENTS },
    )
    return {
      wallGeo,
      trimGeo,
      wallMat: makePlaster(PALETTE.cream),
      trimMat: makePlaster(PALETTE.creamShade, 1),
      skirtMat: new THREE.MeshStandardMaterial({ color: PALETTE.creamShade, roughness: 0.8 }),
      stoneMat: makeStone(),
    }
  }, [])

  const outer = ARCH.halfWidth + ARCH.trim
  const skirtLen = ARCH.wallHalfWidth - outer

  return (
    <group name="archway">
      <mesh geometry={wallGeo} material={wallMat} castShadow receiveShadow />
      <mesh geometry={trimGeo} material={trimMat} position-z={0.005} castShadow receiveShadow />

      {[-1, 1].map((side) => (
        <mesh key={side} material={skirtMat} position={[side * (outer + skirtLen / 2), 0.05, 0.012]} castShadow receiveShadow>
          <boxGeometry args={[skirtLen, 0.1, 0.024]} />
        </mesh>
      ))}

      <mesh material={stoneMat} position={[0, 0.012, -ARCH.depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[ARCH.halfWidth * 2 + 0.06, 0.024, ARCH.depth + 0.12]} />
      </mesh>
    </group>
  )
}
