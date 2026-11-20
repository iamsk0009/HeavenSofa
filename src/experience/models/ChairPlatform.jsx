import { useMemo } from 'react'
import * as THREE from 'three'
import { PLATFORM } from '../../data/chairCollection'

/**
 * Large horizontal oval exhibition plinth: a lathed disc with a softly
 * rounded edge, squashed into an ellipse. Light warm-grey microcement-like
 * finish so the chairs read clearly against it.
 */
export default function ChairPlatform({ ref, ...props }) {
  const { geometry, material } = useMemo(() => {
    const h = PLATFORM.height
    const r = 1
    const e = 0.035 // edge radius (in unit-disc space; scaled later)
    const pts = [new THREE.Vector2(0, 0), new THREE.Vector2(r - e, 0)]
    for (let i = 1; i < 12; i++) {
      const a = -Math.PI / 2 + (Math.PI * i) / 12
      pts.push(new THREE.Vector2(r - e + Math.cos(a) * e, h / 2 + Math.sin(a) * (h / 2)))
    }
    pts.push(new THREE.Vector2(r - e, h), new THREE.Vector2(0, h))
    const geometry = new THREE.LatheGeometry(pts, 160)
    geometry.scale(PLATFORM.rx, 1, PLATFORM.rz)
    geometry.computeVertexNormals()
    const material = new THREE.MeshStandardMaterial({ color: '#D9D5CE', roughness: 0.62 })
    return { geometry, material }
  }, [])

  return <mesh ref={ref} name="chair-platform" geometry={geometry} material={material} receiveShadow castShadow {...props} />
}
