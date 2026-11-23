import { Suspense, useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { makeLinen, makeWood, PALETTE } from './materials'
import { makeBlackMetal, makeBoucle, makeLeather, makeWoolFelt } from '../materials/furnitureMaterials'
import { useExperienceStore } from '../../store/useExperienceStore'
import { CRITICAL_HOMEPAGE_MODELS } from '../homepageReadiness'

/** Site PBR material factories, keyed as in data/chairCollection.js `mats`. */
const FACTORIES = {
  oak: () => makeWood(PALETTE.oak),
  walnut: () => makeWood('#5C3A25'),
  linen: () => makeLinen('#DCCFB8'),
  boucle: () => makeBoucle(),
  leather: () => makeLeather(),
  wool: () => makeWoolFelt(),
  steel: () => makeBlackMetal(),
}

let blobTexture = null
function blob() {
  if (blobTexture) return blobTexture
  const s = 128
  const c = document.createElement('canvas')
  c.width = c.height = s
  const g = c.getContext('2d').createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  g.addColorStop(0, 'rgba(40,33,26,0.55)')
  g.addColorStop(0.55, 'rgba(40,33,26,0.22)')
  g.addColorStop(1, 'rgba(40,33,26,0)')
  const ctx = c.getContext('2d')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, s, s)
  blobTexture = new THREE.CanvasTexture(c)
  return blobTexture
}

function ChairMesh({ url, mats }) {
  const { scene } = useGLTF(url)

  const model = useMemo(() => {
    const made = Object.fromEntries(Object.entries(mats).map(([name, key]) => [name, FACTORIES[key]()]))
    const fallback = Object.values(made)[0]
    const clone = scene.clone(true)
    clone.traverse((o) => {
      if (!o.isMesh) return
      o.castShadow = o.receiveShadow = true
      o.material = made[o.material.name] ?? fallback
    })
    return clone
  }, [scene, mats])

  return <primitive object={model} />
}

/**
 * One chair of the collection: the GLB with site materials applied, plus a
 * soft grounding shadow. Unlike ContactShadows (baked once on the first
 * frame), the blob is a plain textured plane, so it can scale and fade with
 * the chair's entrance. Refs: `ref` → chair group (animated), `shadowRef` →
 * blob mesh (animated opacity).
 *
 * Wrapped in per-chair Suspense so outer groups and shadow planes are available
 * to GSAP immediately, while 3D chair meshes load progressively.
 */
export default function ChairModel({ ref, shadowRef, url, mats, ...props }) {
  const shadowMat = useMemo(
    () => new THREE.MeshBasicMaterial({ map: blob(), transparent: true, depthWrite: false, opacity: 1 }),
    [],
  )
  const chairsTriggered = useExperienceStore((s) => s.chairsTriggered)
  const isCritical = CRITICAL_HOMEPAGE_MODELS.includes(url)
  const shouldMountMesh = isCritical || chairsTriggered

  return (
    <group {...props}>
      <mesh ref={shadowRef} material={shadowMat} rotation-x={-Math.PI / 2} position-y={0.004} scale={[1.25, 1.05, 1]}>
        <planeGeometry args={[1, 1]} />
      </mesh>
      <group ref={ref}>
        <Suspense fallback={null}>
          {shouldMountMesh ? <ChairMesh url={url} mats={mats} /> : null}
        </Suspense>
      </group>
    </group>
  )
}
