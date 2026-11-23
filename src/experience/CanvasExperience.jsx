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
import { extendExplodedSofaLoader, resetSofaExplodedTimings } from './models/ExplodedSofa'
import { rig } from '../animations/rig'
import { useExperienceStore } from '../store/useExperienceStore'
import { failHomepage, getHomepageReadiness, CRITICAL_HOMEPAGE_MODELS, DEFERRED_HOMEPAGE_MODELS, HOMEPAGE_MODELS, markHomepageReady, registerHomepageRetryHandler, reportHomepageAssetProgress, subscribeHomepageReadiness, useHomepageReadiness } from './homepageReadiness'

registerHomepageRetryHandler(() => {
  HOMEPAGE_MODELS.forEach((url) => useGLTF.clear(url))
  useExperienceStore.getState().resetStreaming()
  resetSofaExplodedTimings()
})

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
  const progress = useExperienceStore((s) => s.progress)
  const activeScene = useExperienceStore((s) => s.activeScene)
  const sofaExplodedTriggered = useExperienceStore((s) => s.sofaExplodedTriggered)
  const sofaExplodedReady = useExperienceStore((s) => s.sofaExplodedReady)
  const chairsTriggered = useExperienceStore((s) => s.chairsTriggered)
  const triggerSofaExploded = useExperienceStore((s) => s.triggerSofaExploded)
  const triggerChairs = useExperienceStore((s) => s.triggerChairs)

  // Priority 1: Scene 05 exploded sofa begins streaming early during Scene 02
  useEffect(() => {
    if (sofaExplodedTriggered) return
    const shouldStreamSofa =
      progress >= 0.14 ||
      activeScene === 'livingRoom' ||
      activeScene === 'forest' ||
      activeScene === 'production' ||
      activeScene === 'sofaStructure' ||
      activeScene === 'chairs'

    if (shouldStreamSofa) {
      triggerSofaExploded()
      useGLTF.preload(DEFERRED_HOMEPAGE_MODELS[0], true, true, extendExplodedSofaLoader)
    }
  }, [progress, activeScene, sofaExplodedTriggered, triggerSofaExploded])

  // Priority 2: Scene 06 chair collection streaming is gated until sofa_exploded is ready,
  // or user enters Scene 05 (progress >= 0.63), preventing bandwidth competition during Scenes 03-04
  useEffect(() => {
    if (chairsTriggered) return
    const shouldStreamChairs =
      (sofaExplodedReady && progress >= 0.5) ||
      progress >= 0.63 ||
      (activeScene === 'sofaStructure' && sofaExplodedReady) ||
      activeScene === 'chairs'

    if (shouldStreamChairs) {
      triggerChairs()
      DEFERRED_HOMEPAGE_MODELS.slice(1).forEach((url) => useGLTF.preload(url))
    }
  }, [progress, activeScene, sofaExplodedReady, chairsTriggered, triggerChairs])

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
      <DeferredModelStreamer />
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
