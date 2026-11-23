import { useMemo } from 'react'
import { ContactShadows, useGLTF } from '@react-three/drei'
import { makeLinen, makeWood, PALETTE } from './materials'

export const SOFA_URL = '/models-optimized/sofa.glb'

/**
 * Beige two-seater built in Blender (tools/blender/build_sofa.py).
 *
 * The GLB keeps one node per component — Legs / Frame (Base, Arm_L, Arm_R,
 * Back) / SeatCushions / BackCushions / Pillows — so Phase 5 can explode the
 * same asset. Its placeholder materials (Fabric / Accent / Wood) are swapped
 * for the site's PBR materials by name, so colours stay configurable.
 *
 * Origin: floor level, centred, front facing +z. 1.92 W × 0.88 D × 0.86 H m.
 */
export default function Sofa({
  ref,
  fabric = PALETTE.linen, // natural linen
  accent = '#9C5238',
  wood = PALETTE.oak,
  contactShadow = true,
  ...props
}) {
  const { scene } = useGLTF(SOFA_URL)

  const model = useMemo(() => {
    const mats = { Fabric: makeLinen(fabric), Accent: makeLinen(accent), Wood: makeWood(wood) }
    const clone = scene.clone(true)
    clone.traverse((o) => {
      if (!o.isMesh) return
      o.castShadow = true
      o.receiveShadow = true
      o.material = mats[o.material.name] ?? mats.Fabric
    })
    return clone
  }, [scene, fabric, accent, wood])

  return (
    <group ref={ref} name="sofa" {...props}>
      {/* Soft occlusion where the sofa meets the floor. A child of the sofa so
          it travels with it; rendered once since the sofa never changes shape. */}
      {contactShadow && (
        // y = 2 cm keeps the living-room rug (1.6 cm) out of the occluder volume
        <ContactShadows position-y={0.02} scale={[2.6, 1.6]} far={0.5} blur={2.4} opacity={0.6} resolution={512} frames={1} color="#3A3127" />
      )}
      <primitive object={model} />
    </group>
  )
}

useGLTF.preload(SOFA_URL)
