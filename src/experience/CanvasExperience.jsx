import { Component, memo, Suspense, useEffect, useRef, useSyncExternalStore } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useProgress } from '@react-three/drei'
import * as THREE from 'three'
import Lighting from './Lighting'
import StudioEnvironment from './StudioEnvironment'
import CameraController from './CameraController'
import SceneManager from './SceneManager'
import RenderGate from './RenderGate'
import { PALETTE } from './models/materials'
import { rig } from '../animations/rig'
import { failHomepage, getHomepageReadiness, CRITICAL_HOMEPAGE_MODELS, DEFERRED_HOMEPAGE_MODELS, HOMEPAGE_MODELS, markHomepageReady, registerHomepageRetryHandler, reportHomepageAssetProgress, subscribeHomepageReadiness, useHomepageReadiness } from './homepageReadiness'

registerHomepageRetryHandler(() => HOMEPAGE_MODELS.forEach((url) => useGLTF.clear(url)))

function AssetProgressReporter() {
  const { active, progress } = useProgress()
  useEffect(() => reportHomepageAssetProgress(progress, active), [active, progress])
  return null
}

function RequiredHomepageModels() {
  // Genuinely required for opening scenes: Scene 01 (Sofa) and Scene 02 (Sofa + AccentChair)
  const sofa = useGLTF(CRITICAL_HOMEPAGE_MODELS[0]).scene
  const chair = useGLTF(CRITICAL_HOMEPAGE_MODELS[1]).scene
  if (!sofa || !chair) throw new Error('A required critical homepage GLB did not contain a parsed scene.')
  useEffect(() => markHomepageReady('modelsReady'), [])
  return null
}

function DeferredModelStreamer() {
  const { modelsReady } = useHomepageReadiness()
  useEffect(() => {
    if (!modelsReady) return

    // Priority 1: Scene 05 exploded sofa (starts streaming in background once opening models resolve)
    useGLTF.preload(DEFERRED_HOMEPAGE_MODELS[0])

    // Priority 2: Scene 06 chair collection (staggered to maintain connection pool headroom)
    const timer = setTimeout(() => {
      DEFERRED_HOMEPAGE_MODELS.slice(1).forEach((url) => useGLTF.preload(url))
    }, 1200)

    return () => clearTimeout(timer)
  }, [modelsReady])
  return null
}

function FirstCanvasFrame() {
  const scheduled = useRef(false)
  useFrame(() => {
    if (scheduled.current) return
    const ready = getHomepageReadiness()
    if (!ready.modelsReady || !ready.scenesReady || !ready.wordmarkReady) return
    scheduled.current = true
    // useFrame runs before R3F renders. This callback runs on the next RAF,
    // after that first render has completed.
    requestAnimationFrame(() => markHomepageReady('canvasReady'))
  }, -100)
  return null
}

class CanvasFailureBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error) { failHomepage(error) }
  render() { return this.state.failed ? null : this.props.children }
}

/**
 * The one persistent WebGL canvas for the whole storytelling experience.
 * Memoised so store updates in parents never reconfigure the renderer.
 */
function CanvasExperience() {
  const { position: p } = rig.camera
  const readiness = useSyncExternalStore(subscribeHomepageReadiness, getHomepageReadiness, getHomepageReadiness)
  return (
    <CanvasFailureBoundary key={`canvas-${readiness.attempt}`}>
      <Canvas
        shadows="percentage"
        dpr={[1, 1.75]}
        camera={{ fov: 40, near: 0.1, far: 60, position: [p.x, p.y, p.z] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          // Neutral tone mapping keeps creams and terracotta true to the palette.
          gl.toneMapping = THREE.NeutralToneMapping
          gl.toneMappingExposure = 1.0
        }}
      >
        <color attach="background" args={[PALETTE.paper]} />
        <fog attach="fog" args={[PALETTE.paper, 16, 34]} />
        <AssetProgressReporter />
        <DeferredModelStreamer />
        <RenderGate />

        {/* Everything resolves together; the scroll timeline starts after
            this subtree is ready and the loader has completed its exit. */}
        <CanvasFailureBoundary key={`scene-${readiness.attempt}`}>
          <Suspense fallback={null}>
            <Lighting />
            <StudioEnvironment />
            <CameraController />
            <RequiredHomepageModels />
            <SceneManager />
            <FirstCanvasFrame />
          </Suspense>
        </CanvasFailureBoundary>
      </Canvas>
    </CanvasFailureBoundary>
  )
}

export default memo(CanvasExperience)
