import { useMemo } from 'react'
import * as THREE from 'three'
import { makeWood } from './materials'
import { makeBlackMetal, makeCeramic, makeLampShade, makeWool } from '../materials/furnitureMaterials'

/** Minimal styling objects for the living room. All origins at their base. */

const lathe = (pts, segments = 64) =>
  new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), segments)

/** Low-pile wool rug with softly rounded corners. */
export function Rug({ size = [3.4, 2.5], radius = 0.12, color, ...props }) {
  const { geo, mat } = useMemo(() => {
    const [w, d] = size
    const s = new THREE.Shape()
    s.moveTo(-w / 2 + radius, -d / 2)
    s.lineTo(w / 2 - radius, -d / 2)
    s.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + radius)
    s.lineTo(w / 2, d / 2 - radius)
    s.quadraticCurveTo(w / 2, d / 2, w / 2 - radius, d / 2)
    s.lineTo(-w / 2 + radius, d / 2)
    s.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - radius)
    s.lineTo(-w / 2, -d / 2 + radius)
    s.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + radius, -d / 2)
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.002, bevelSize: 0.004, bevelSegments: 2 })
    geo.rotateX(-Math.PI / 2)
    return { geo, mat: makeWool(color, [3, 3]) } // shape UVs are metres → 33 cm tiles
  }, [size, radius, color])
  return <mesh name="rug" geometry={geo} material={mat} receiveShadow {...props} />
}

/** Hand-thrown ceramic bud vase with three dried stems. */
export function StemVase(props) {
  const { geo, ceramic, stem } = useMemo(() => {
    const geo = lathe([[0, 0], [0.045, 0], [0.07, 0.035], [0.078, 0.085], [0.06, 0.15], [0.032, 0.19], [0.03, 0.215], [0.036, 0.225], [0.03, 0.225], [0.024, 0.2]])
    const ceramic = makeCeramic()
    ceramic.side = THREE.DoubleSide // open mouth
    return { geo, ceramic, stem: new THREE.MeshStandardMaterial({ color: '#8E6B48', roughness: 0.9 }) }
  }, [])
  const stems = [
    { r: [0.06, 0, 0.12], h: 0.5 },
    { r: [-0.08, 0, -0.1], h: 0.62 },
    { r: [0.12, 0, -0.26], h: 0.44 },
  ]
  return (
    <group name="stem-vase" {...props}>
      <mesh geometry={geo} material={ceramic} castShadow receiveShadow />
      {stems.map((s, i) => (
        <group key={i} position-y={0.2} rotation={s.r}>
          <mesh material={stem} position-y={s.h / 2} castShadow>
            <cylinderGeometry args={[0.0025, 0.004, s.h, 5]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/** Two stacked art books. */
export function BookStack(props) {
  const mats = useMemo(
    () => [
      new THREE.MeshStandardMaterial({ color: '#385343', roughness: 0.7 }),
      new THREE.MeshStandardMaterial({ color: '#E9E1D2', roughness: 0.8 }),
    ],
    [],
  )
  return (
    <group name="book-stack" {...props}>
      <mesh material={mats[0]} position-y={0.017} castShadow receiveShadow>
        <boxGeometry args={[0.27, 0.034, 0.2]} />
      </mesh>
      <mesh material={mats[1]} position={[0.01, 0.047, -0.005]} rotation-y={0.12} castShadow receiveShadow>
        <boxGeometry args={[0.22, 0.026, 0.165]} />
      </mesh>
    </group>
  )
}

/**
 * Slim floor lamp: black steel base and stem, linen drum shade that glows
 * from within. `shadeRef` / `lightRef` let the timeline switch it on.
 */
export function FloorLamp({ shadeRef, lightRef, ...props }) {
  const { baseGeo, shadeGeo, metal, shade, oak } = useMemo(
    () => ({
      baseGeo: lathe([[0, 0], [0.15, 0], [0.155, 0.008], [0.14, 0.022], [0, 0.026]]),
      shadeGeo: lathe([[0.23, 0], [0.165, 0.3]], 64),
      metal: makeBlackMetal(),
      shade: makeLampShade(),
      oak: makeWood(),
    }),
    [],
  )
  return (
    <group name="floor-lamp" {...props}>
      <mesh geometry={baseGeo} material={metal} castShadow receiveShadow />
      <mesh material={metal} position-y={0.72} castShadow>
        <cylinderGeometry args={[0.009, 0.011, 1.4, 12]} />
      </mesh>
      <mesh material={oak} position-y={1.3}>
        <cylinderGeometry args={[0.016, 0.016, 0.05, 12]} />
      </mesh>
      <mesh ref={shadeRef} geometry={shadeGeo} material={shade} position-y={1.3} castShadow />
      <pointLight ref={lightRef} position-y={1.42} intensity={0} distance={6} decay={2} color="#FFD7A6" />
    </group>
  )
}
