import { memo, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import Lighting from './Lighting'
import StudioEnvironment from './StudioEnvironment'
import CameraController from './CameraController'
import SceneManager from './SceneManager'
import RenderGate from './RenderGate'
import { PALETTE } from './models/materials'
import { rig } from '../animations/rig'

/**
 * The one persistent WebGL canvas for the whole storytelling experience.
 * Memoised so store updates in parents never reconfigure the renderer.
 */
function CanvasExperience() {
  const { position: p } = rig.camera
  return (
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
      <RenderGate />

      {/* Everything (incl. future GLB models) resolves together, so the
          master timeline is built only once all scenes have registered. */}
      <Suspense fallback={null}>
        <Lighting />
        <StudioEnvironment />
        <CameraController />
        <SceneManager />
      </Suspense>
    </Canvas>
  )
}

export default memo(CanvasExperience)
