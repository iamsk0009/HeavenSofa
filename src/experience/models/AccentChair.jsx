import { useMemo } from 'react'
import { ContactShadows, useGLTF } from '@react-three/drei'
import { makeWood, PALETTE } from './materials'
import { FURNITURE_COLORS, makeBoucle } from '../materials/furnitureMaterials'

export const ACCENT_CHAIR_URL = '/models/accent_chair.glb'

/**
 * Sculptural bouclé tub chair built in Blender (tools/blender/build_chair.py).
 * Separate meshes: Backrest (curved shell), Seat (domed cushion), SeatBase,
 * Plinth. GLB placeholder materials (Fabric / Wood) are swapped by name.
 *
 * Origin: floor level, centred, front facing +z. Ø 0.84 m × 0.77 m H.
 */
export default function AccentChair({ ref, fabric = FURNITURE_COLORS.boucleOrange, wood = PALETTE.oak, ...props }) {
  const { scene } = useGLTF(ACCENT_CHAIR_URL)

  const model = useMemo(() => {
    const mats = { Fabric: makeBoucle(fabric), Wood: makeWood(wood) }
    const clone = scene.clone(true)
    clone.traverse((o) => {
      if (!o.isMesh) return
      o.castShadow = o.receiveShadow = true
      o.material = mats[o.material.name] ?? mats.Fabric
    })
    return clone
  }, [scene, fabric, wood])

  return (
    <group ref={ref} name="accent-chair" {...props}>
      {/* y = 2 cm keeps the rug (1.6 cm) out of the occluder volume */}
      <ContactShadows position-y={0.02} scale={1.7} far={0.45} blur={2.2} opacity={0.6} resolution={256} frames={1} color="#3A3127" />
      <primitive object={model} />
    </group>
  )
}

useGLTF.preload(ACCENT_CHAIR_URL)
