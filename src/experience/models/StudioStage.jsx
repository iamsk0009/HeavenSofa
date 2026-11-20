import { useMemo } from 'react'
import * as THREE from 'three'
import { makeMicrocement } from './materials'

/**
 * Photographic studio for Scenes 05–06: a seamless cream cyclorama (floor
 * sweeping up into the back wall), a shadow-casting key light and a long
 * overhead softbox. Built well away from the doorway room (x ≈ 30–70) so the
 * camera can move here while the workshop illustration covers the Canvas.
 */
export const STUDIO = {
  sofaX: 40,     // exploded sofa
  chairsX: 48.6, // chair platform — close enough that sofa and platform share the pan
  centerX: 50,
  width: 44,
  wallZ: -5,
}

/** Floor → cove → wall profile, as (y, z) points from front to top. */
// wallTop is generous: pulled-back portrait cameras look up past 12 m
function cycloramaGeometry(width, { floorFront = 16, wallZ = -5, cove = 3, wallTop = 40, segments = 80 } = {}) {
  const floorLen = floorFront - (wallZ + cove)
  const coveLen = (Math.PI / 2) * cove
  const wallLen = wallTop - cove
  const total = floorLen + coveLen + wallLen
  const at = (s) => {
    if (s <= floorLen) return [0, floorFront - s]
    s -= floorLen
    if (s <= coveLen) {
      const a = s / cove // 0 → π/2
      return [cove - Math.cos(a) * cove, wallZ + cove - Math.sin(a) * cove]
    }
    return [cove + (s - coveLen), wallZ]
  }

  const pos = []
  const uv = []
  for (let i = 0; i <= segments; i++) {
    const s = (i / segments) * total
    const [y, z] = at(s)
    for (const x of [-width / 2, width / 2]) {
      pos.push(x, y, z)
      uv.push(x / 3, s / 3) // ~3 m texture tiles
    }
  }
  const index = []
  for (let i = 0; i < segments; i++) {
    const a = i * 2
    index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  g.setIndex(index)
  g.computeVertexNormals()
  return g
}

export default function StudioStage() {
  const { geometry, material, target } = useMemo(() => {
    const material = makeMicrocement('#E6E3DD', [1, 1]) // neutral: warm lights add the warmth
    material.side = THREE.DoubleSide
    return { geometry: cycloramaGeometry(STUDIO.width, { wallZ: STUDIO.wallZ }), material, target: new THREE.Object3D() }
  }, [])

  return (
    <group name="studio-stage" position-x={STUDIO.centerX}>
      <mesh geometry={geometry} material={material} receiveShadow />

      <primitive object={target} position={[-3, 0, 0]} />
      <directionalLight
        castShadow
        target={target}
        position={[-7, 9, 7]}
        intensity={1.5}
        color="#FFF8F1"
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      >
        <orthographicCamera attach="shadow-camera" args={[-15, 15, 9, -9, 1, 34]} />
      </directionalLight>

      {/* long overhead softbox: soft top light that models upholstery */}
      <rectAreaLight position={[-3, 4.4, 2.2]} rotation-x={-Math.PI / 2} width={20} height={4} intensity={1.5} color="#FFFFFF" />
    </group>
  )
}
