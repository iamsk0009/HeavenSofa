import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { ContactShadows, useGLTF } from '@react-three/drei'
import { makeLinen, makeWood, PALETTE } from './materials'
import { makeFibre, makeFoam, makeSpringSteel, makeTimber, makeWebbing } from '../materials/furnitureMaterials'
import { EXPLODE, SOFA_LABELS } from '../../data/sofaStructure'
import { useExperienceStore } from '../../store/useExperienceStore'
import Sofa from './Sofa'

export const EXPLODED_SOFA_URL = '/models-optimized/sofa_exploded.glb'

export const sofaExplodedTimings = {
  requestStart: 0,
  downloadEnd: 0,
  decodeEnd: 0,
  ready: 0,
  downloadMs: 0,
  decodeMs: 0,
  prepMs: 0,
  totalMs: 0,
}

if (typeof window !== 'undefined') {
  window.__SOFA_EXPLODED_TIMINGS__ = sofaExplodedTimings
}

export function resetSofaExplodedTimings() {
  sofaExplodedTimings.requestStart = 0
  sofaExplodedTimings.downloadEnd = 0
  sofaExplodedTimings.decodeEnd = 0
  sofaExplodedTimings.ready = 0
  sofaExplodedTimings.downloadMs = 0
  sofaExplodedTimings.decodeMs = 0
  sofaExplodedTimings.prepMs = 0
  sofaExplodedTimings.totalMs = 0
}

export function extendExplodedSofaLoader(loader) {
  if (!loader) return
  if (!sofaExplodedTimings.requestStart) {
    sofaExplodedTimings.requestStart = performance.now()
  }
  const origParse = loader.parse.bind(loader)
  loader.parse = function (data, path, onLoad, onError) {
    if (!sofaExplodedTimings.downloadEnd) {
      sofaExplodedTimings.downloadEnd = performance.now()
      sofaExplodedTimings.downloadMs = Math.round(sofaExplodedTimings.downloadEnd - sofaExplodedTimings.requestStart)
    }
    const wrappedOnLoad = function (gltf) {
      if (!sofaExplodedTimings.decodeEnd) {
        sofaExplodedTimings.decodeEnd = performance.now()
        sofaExplodedTimings.decodeMs = Math.round(sofaExplodedTimings.decodeEnd - sofaExplodedTimings.downloadEnd)
      }
      if (onLoad) onLoad(gltf)
    }
    return origParse(data, path, wrappedOnLoad, onError)
  }
}

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
  const { scene } = useGLTF(EXPLODED_SOFA_URL, true, true, extendExplodedSofaLoader)
  const markSofaExplodedReady = useExperienceStore((s) => s.markSofaExplodedReady)

  useLayoutEffect(() => {
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

    // 1. Attach covers to cover proxies FIRST, before cushion nodes are detached from clone
    for (const name of Object.keys(EXPLODE.covers)) {
      const cover = clone.getObjectByName(name)
      const coverProxy = proxies.covers[name]
      if (cover && coverProxy) {
        cover.position.set(0, 0, 0)
        cover.userData.isModelAttachment = true
        coverProxy.children.filter((c) => c.userData.isModelAttachment).forEach((c) => coverProxy.remove(c))
        coverProxy.add(cover)
      }
    }

    // 2. Attach exploded parts (including cushion nodes with their remaining foam/fibre cores)
    for (const name of Object.keys(EXPLODE.parts)) {
      const node = clone.getObjectByName(name)
      const proxy = proxies.parts[name]
      if (node && proxy) {
        node.position.set(0, 0, 0)
        node.userData.isModelAttachment = true
        proxy.children.filter((c) => c.userData.isModelAttachment).forEach((c) => proxy.remove(c))
        proxy.add(node)
      }
    }

    // 3. Attach frame
    const frame = clone.getObjectByName('Frame')
    if (frame && proxies.parts.Frame) {
      frame.position.set(0, 0, 0)
      frame.userData.isModelAttachment = true
      proxies.parts.Frame.children.filter((c) => c.userData.isModelAttachment).forEach((c) => proxies.parts.Frame.remove(c))
      proxies.parts.Frame.add(frame)
    }

    if (!sofaExplodedTimings.ready) {
      sofaExplodedTimings.ready = performance.now()
      const decodePoint = sofaExplodedTimings.decodeEnd || sofaExplodedTimings.ready
      const startPoint = sofaExplodedTimings.requestStart || sofaExplodedTimings.ready
      sofaExplodedTimings.prepMs = Math.round(sofaExplodedTimings.ready - decodePoint)
      sofaExplodedTimings.totalMs = Math.round(sofaExplodedTimings.ready - startPoint)
    }

    markSofaExplodedReady()
  }, [scene, proxies, markSofaExplodedReady])

  return null
}

function SofaFallback() {
  return (
    <group position-y={0.02}>
      <Sofa contactShadow={false} />
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
  const sofaExplodedTriggered = useExperienceStore((s) => s.sofaExplodedTriggered)
  const sofaExplodedReady = useExperienceStore((s) => s.sofaExplodedReady)

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
      {!sofaExplodedReady && <SofaFallback />}
      {sofaExplodedTriggered && (
        <Suspense fallback={null}>
          <ExplodedSofaContent proxies={proxies} />
        </Suspense>
      )}
    </group>
  )
}
