import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { applyConfiguratorConfiguration, cloneConfiguratorMaterials, disposeConfiguratorMaterials } from '../experience/models/configuratorMaterialManager'

function LoadedFurniture({ product, selections }) {
  const { scene } = useGLTF(product.model)
  const furniture = useMemo(() => {
    const object = cloneConfiguratorMaterials(scene)
    object.updateMatrixWorld(true)
    const bounds = new THREE.Box3().setFromObject(object)
    const center = bounds.getCenter(new THREE.Vector3())
    const size = bounds.getSize(new THREE.Vector3())
    const scale = 2.35 / Math.max(size.x, size.y, size.z, 0.001)
    object.scale.setScalar(scale)
    object.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale)
    return object
  }, [scene])

  useEffect(() => () => {
    disposeConfiguratorMaterials(furniture)
  }, [furniture])

  useEffect(() => {
    applyConfiguratorConfiguration(furniture, product, selections)
  }, [furniture, product, selections])

  return <primitive object={furniture} dispose={null} />
}

function CameraRig({ command }) {
  const controls = useRef(null)
  const destination = useRef(null)
  useEffect(() => {
    if (!command || !controls.current) return
    const control = controls.current
    destination.current = null
    const target = control.target
    const distance = control.object.position.distanceTo(target) || 4.5
    const positions = {
      front: [0, 0.22, distance],
      side: [distance, 0.18, 0],
      rear: [0, 0.22, -distance],
      reset: [distance * 0.72, distance * 0.42, distance * 0.9],
    }
    if (positions[command.type]) {
      const [x, y, z] = positions[command.type]
      destination.current = new THREE.Vector3(target.x + x, target.y + y, target.z + z)
    }
    if (command.type === 'zoom-in') control.dollyIn(1.2)
    if (command.type === 'zoom-out') control.dollyOut(1.2)
    control.update()
  }, [command])
  useFrame((_, delta) => {
    if (!destination.current || !controls.current) return
    const camera = controls.current.object
    camera.position.lerp(destination.current, 1 - Math.exp(-6 * delta))
    controls.current.update()
    if (camera.position.distanceTo(destination.current) < 0.015) destination.current = null
  })
  return <OrbitControls ref={controls} makeDefault target={[0, 0.9, 0]} enableDamping dampingFactor={0.08} minDistance={1.7} maxDistance={8} maxPolarAngle={Math.PI * 0.49} />
}

export default function ConfiguratorViewer({ product, selections, command }) {
  if (!product?.model) {
    return <div className="configurator-no-model">
      <img src={product.image} alt={`${product.name} product reference`} />
      <div><p className="eyebrow text-terracotta">No verified product model</p><p className="mt-2 max-w-sm text-sm leading-relaxed text-ink/65">{product.modelNote ?? 'The catalogue image is shown for reference; no substitute model or customization preview is used.'}</p></div>
    </div>
  }

  return <div className="configurator-canvas" aria-label={`${product.name} interactive 3D model`}>
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [3.1, 2.25, 4.2], fov: 37, near: 0.05, far: 80 }} gl={{ antialias: true, powerPreference: 'high-performance' }} onCreated={({ gl }) => { gl.toneMapping = THREE.NeutralToneMapping; gl.toneMappingExposure = 1.08 }}>
      <color attach="background" args={['#DED8CC']} />
      <hemisphereLight skyColor="#fffdf8" groundColor="#9a8d79" intensity={1.45} />
      <ambientLight intensity={0.35} />
      <directionalLight castShadow position={[4, 6, 4]} intensity={3.2} shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-near={0.1} shadow-camera-far={18} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} />
      <directionalLight position={[-4, 3, -2]} intensity={1.15} color="#f0dfc5" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.012, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} /><shadowMaterial transparent opacity={0.18} />
      </mesh>
      <Suspense fallback={null}><LoadedFurniture product={product} selections={selections} /></Suspense>
      <CameraRig command={command} />
    </Canvas>
  </div>
}

for (const modelPath of ['/models/sofa.glb', '/models/accent_chair.glb']) useGLTF.preload(modelPath)
