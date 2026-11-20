import { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { makeLinen, makeWood, PALETTE } from './materials'
import { makeBlackMetal, makeBoucle, makeLeather, makeWoolFelt } from '../materials/furnitureMaterials'
import { CHAIRS } from '../../data/chairCollection'

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

/**
 * One chair of the collection: the GLB with site materials applied, plus a
 * soft grounding shadow. Unlike ContactShadows (baked once on the first
 * frame), the blob is a plain textured plane, so it can scale and fade with
 * the chair's entrance. Refs: `ref` → chair group (animated), `shadowRef` →
 * blob mesh (animated opacity).
 */
export default function ChairModel({ ref, shadowRef, url, mats, ...props }) {
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

  const shadowMat = useMemo(
    () => new THREE.MeshBasicMaterial({ map: blob(), transparent: true, depthWrite: false, opacity: 1 }),
    [],
  )

  return (
    <group {...props}>
      <mesh ref={shadowRef} material={shadowMat} rotation-x={-Math.PI / 2} position-y={0.004} scale={[1.25, 1.05, 1]}>
        <planeGeometry args={[1, 1]} />
      </mesh>
      <group ref={ref}>
        <primitive object={model} />
      </group>
    </group>
  )
}

CHAIRS.forEach((c) => useGLTF.preload(c.url))
