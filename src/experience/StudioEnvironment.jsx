import { Environment, Lightformer } from '@react-three/drei'

/**
 * Image-based lighting for PBR reflections (brass, lacquer, fabric sheen).
 * Built from in-scene Lightformers instead of a downloaded HDRI: no network
 * request, tiny memory footprint, and a soft softbox look that suits the
 * studio aesthetic. Rendered once (frames={1}).
 */
export default function StudioEnvironment() {
  return (
    <Environment resolution={128} frames={1} environmentIntensity={0.45}>
      <Lightformer form="rect" intensity={2} color="#FFF6EA" position={[0, 4, 6]} scale={[10, 4, 1]} />
      <Lightformer form="rect" intensity={1} color="#FFFFFF" position={[-6, 2, 0]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
      <Lightformer form="rect" intensity={0.8} color="#F2E6D6" position={[6, 2, 0]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} />
      <Lightformer form="ring" intensity={1.5} color="#FFD9B8" position={[3, 4, -3]} scale={2} />
    </Environment>
  )
}
