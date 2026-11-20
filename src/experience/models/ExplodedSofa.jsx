import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { ContactShadows, useGLTF } from '@react-three/drei'
import { makeLinen, makeWood, PALETTE } from './materials'
import { makeFibre, makeFoam, makeSpringSteel, makeTimber, makeWebbing } from '../materials/furnitureMaterials'
import { EXPLODE, SOFA_LABELS } from '../../data/sofaStructure'

export const EXPLODED_SOFA_URL = '/models/sofa_exploded.glb'

/**
 * The construction-accurate sofa (tools/blender/build_sofa_exploded.py):
 * same outer design as the living-room sofa, but with a real beech frame,
 * sinuous springs, webbing, foam padding, a linen shell and cushions whose
 * covers wrap foam/fibre cores — each a separately animatable node.
 *
 * `nodesRef.current` is filled synchronously with
 *   { root, parts: {name: Object3D}, covers: {...}, anchors: {labelId: Object3D}, contactShadow }
 * Every part's assembled position is stored in userData.home for the timeline.
 */
export default function ExplodedSofa({ nodesRef, ...props }) {
  const { scene } = useGLTF(EXPLODED_SOFA_URL)

  const model = useMemo(() => {
    const mats = {
      Fabric: makeLinen(PALETTE.linen),
      Wood: makeWood(PALETTE.oak),
      FrameWood: makeTimber(),
      Steel: makeSpringSteel(),
      Webbing: makeWebbing(),
      Foam: makeFoam(),
      Fibre: makeFibre(),
    }
    const clone = scene.clone(true)
    clone.traverse((o) => {
      if (!o.isMesh) return
      o.castShadow = o.receiveShadow = true
      o.material = mats[o.material.name] ?? mats.Fabric
    })

    const pick = (names) => Object.fromEntries(names.map((n) => [n, clone.getObjectByName(n)]))
    const parts = pick(Object.keys(EXPLODE.parts))
    const covers = pick(Object.keys(EXPLODE.covers))
    for (const o of [...Object.values(parts), ...Object.values(covers)]) {
      if (!o) throw new Error('[ExplodedSofa] GLB is missing an expected node — rebuild sofa_exploded.glb')
      o.userData.home = o.position.clone()
    }
    parts.Frame = clone.getObjectByName('Frame')

    // label anchors ride on the part they describe
    const anchors = {}
    for (const l of SOFA_LABELS) {
      const a = new THREE.Object3D()
      a.position.set(...l.at)
      const host = parts[l.node] ?? clone.getObjectByName(l.node)
      // anchors are authored in sofa space; convert into the host's space
      if (host && host !== clone) a.position.sub(host.position)
      host?.add(a)
      anchors[l.id] = a
    }
    return { clone, parts, covers, anchors }
  }, [scene])

  const rootRef = useRef()
  const shadowRef = useRef()
  // Runs before SceneManager's layout effect builds the timeline (child
  // effects fire first), so the timeline always sees populated nodes.
  useLayoutEffect(() => {
    if (nodesRef) nodesRef.current = { ...model, root: rootRef.current, contactShadow: shadowRef.current }
  }, [model, nodesRef])

  return (
    <group name="exploded-sofa" {...props}>
      <ContactShadows
        ref={shadowRef}
        position-y={0.003}
        scale={[2.8, 1.8]}
        far={0.5}
        blur={2.4}
        opacity={0.6}
        resolution={512}
        frames={1}
        color="#3A3127"
      />
      <group ref={rootRef} name="exploded-sofa-lift">
        <primitive object={model.clone} />
      </group>
    </group>
  )
}

useGLTF.preload(EXPLODED_SOFA_URL)
