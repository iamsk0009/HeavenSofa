import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { ContactShadows, useGLTF } from '@react-three/drei'
import { makeLinen, makeWood, PALETTE } from './materials'
import { makeFibre, makeFoam, makeSpringSteel, makeTimber, makeWebbing } from '../materials/furnitureMaterials'
import { EXPLODE, SOFA_LABELS } from '../../data/sofaStructure'
import Sofa from './Sofa'

export const EXPLODED_SOFA_URL = '/models-optimized/sofa_exploded.glb'

function createSofaProxies() {
  const root = new THREE.Group()
  root.name = 'exploded-sofa-proxy-root'

  const parts = {}
  for (const name of Object.keys(EXPLODE.parts)) {
    const g = new THREE.Group()
    g.name = name
    const sign = name.endsWith('_R') ? 1 : -1
    if (name.startsWith('BackCushion_')) {
      g.position.set(sign * 0.395, 0.68, -0.185)
    } else if (name.startsWith('SeatCushion_')) {
      g.position.set(sign * 0.395, 0.435, 0.08)
    }
    g.userData.home = g.position.clone()
    parts[name] = g
    root.add(g)
  }

  parts.Frame = new THREE.Group()
  parts.Frame.name = 'Frame'
  parts.Frame.userData.home = new THREE.Vector3(0, 0, 0)
  root.add(parts.Frame)

  const covers = {}
  for (const name of Object.keys(EXPLODE.covers)) {
    const g = new THREE.Group()
    g.name = name
    g.position.set(0, 0, 0)
    g.userData.home = new THREE.Vector3(0, 0, 0)
    covers[name] = g
    const parentPart = name.replace('_Cover', '')
    if (parts[parentPart]) {
      parts[parentPart].add(g)
    } else {
      root.add(g)
    }
  }

  const anchors = {}
  for (const l of SOFA_LABELS) {
    const a = new THREE.Object3D()
    a.position.set(...l.at)
    anchors[l.id] = a
    const host = parts[l.node] ?? root
    host.add(a)
  }

  return { root, parts, covers, anchors }
}

function ExplodedSofaContent({ proxies }) {
  const { scene } = useGLTF(EXPLODED_SOFA_URL)

  useEffect(() => {
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

    for (const name of Object.keys(EXPLODE.parts)) {
      const node = clone.getObjectByName(name)
      const proxy = proxies.parts[name]
      if (node && proxy) {
        node.position.set(0, 0, 0)
        proxy.add(node)
      }
    }

    const frame = clone.getObjectByName('Frame')
    if (frame && proxies.parts.Frame) {
      frame.position.set(0, 0, 0)
      proxies.parts.Frame.add(frame)
    }

    for (const name of Object.keys(EXPLODE.covers)) {
      const cover = clone.getObjectByName(name)
      const coverProxy = proxies.covers[name]
      if (cover && coverProxy) {
        cover.position.set(0, 0, 0)
        coverProxy.add(cover)
      }
    }
  }, [scene, proxies])

  return null
}

function SofaFallback() {
  return (
    <group position-y={0.02}>
      <Sofa />
    </group>
  )
}

/**
 * The construction-accurate sofa (tools/blender/build_sofa_exploded.py):
 * same outer design as the living-room sofa, but with a real beech frame,
 * sinuous springs, webbing, foam padding, a linen shell and cushions whose
 * covers wrap foam/fibre cores — each a separately animatable node.
 *
 * `nodesRef.current` is filled synchronously with proxies so GSAP binds
 * immediately without waiting for the 1.6MB GLB. The real meshes stream
 * progressively in the background and mount seamlessly once resolved.
 */
export default function ExplodedSofa({ nodesRef, ...props }) {
  const proxies = useMemo(() => createSofaProxies(), [])
  const shadowRef = useRef()

  useLayoutEffect(() => {
    if (nodesRef) {
      nodesRef.current = {
        ...proxies,
        contactShadow: shadowRef.current,
      }
    }
  }, [proxies, nodesRef])

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
      <primitive object={proxies.root} />
      <Suspense fallback={<SofaFallback />}>
        <ExplodedSofaContent proxies={proxies} />
      </Suspense>
    </group>
  )
}
