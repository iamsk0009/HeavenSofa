import { SoftShadows } from '@react-three/drei'
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js'

// Required once before any RectAreaLight (used for window light) renders.
RectAreaLightUniformsLib.init()

/**
 * Global studio lighting shared by every scene. Scene-specific practicals
 * (e.g. the lights inside the doorway room) live in the scene itself so its
 * timeline builder can animate them.
 */
export default function Lighting() {
  return (
    <>
      {/* PCSS: shadows sharpen near contact and soften with distance, like
          real area-lit shadows. Patches the PCF shadow shader chunk. */}
      <SoftShadows size={18} samples={12} focus={0.5} />

      <hemisphereLight args={['#FFF8EE', '#CDBFA8', 0.8]} />

      {/* Low, warm "window" key from front-left. It shines through the arch
          and lays a soft patch of light on the room floor. */}
      <directionalLight
        castShadow
        position={[-3.5, 6.5, 8]}
        intensity={2.2}
        color="#FFF1DE"
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0003}
        shadow-normalBias={0.03}
      >
        <orthographicCamera attach="shadow-camera" args={[-9, 9, 9, -9, 0.5, 30]} />
      </directionalLight>
    </>
  )
}
