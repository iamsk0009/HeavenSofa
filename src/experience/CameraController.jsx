import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { rig } from '../animations/rig'

const PARALLAX = { x: 0.14, y: 0.08 }

/**
 * Copies the GSAP-driven camera rig onto the R3F camera every frame, adds a
 * gentle damped pointer parallax, and widens the lens on portrait screens so
 * compositions still read on phones.
 */
export default function CameraController() {
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  const pointer = useRef({ x: 0, y: 0 })
  const offset = useRef({ x: 0, y: 0 })
  const lookAt = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  /**
   * Responsive framing. Camera paths are authored for landscape; on narrower
   * screens we (a) widen the lens, (b) shrink sideways offsets so subjects
   * stay centred, and (c) dolly back along the view axis.
   */
  const framing = useMemo(() => {
    const aspect = size.width / size.height
    // wideFov: extra degrees a scene may open up to via rig.camera.wide
    // pull: share of rig.camera.pullback applied at this breakpoint
    if (aspect < 0.75) return { fov: 58, wideFov: 16, lateral: 0.25, dolly: 0.8, pull: 1 }
    if (aspect < 1.2) return { fov: 48, wideFov: 8, lateral: 0.6, dolly: 0.35, pull: 0.8 }
    return { fov: 40, wideFov: 0, lateral: 1, dolly: 0, pull: 0 }
  }, [size])

  const eye = useMemo(() => new THREE.Vector3(), [])
  const back = useMemo(() => new THREE.Vector3(), [])

  useFrame((_, dt) => {
    const k = 1 - Math.exp(-dt * 2.5) // frame-rate independent damping
    const amt = rig.camera.parallax
    offset.current.x += (pointer.current.x * PARALLAX.x * amt - offset.current.x) * k
    offset.current.y += (-pointer.current.y * PARALLAX.y * amt - offset.current.y) * k

    const { position: p, target: t } = rig.camera
    const { lateral, dolly } = framing

    const fov = framing.fov + framing.wideFov * rig.camera.wide
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }
    // portrait framing scales sideways offsets toward an origin: world x 0
    // for the room scenes, the look-at target for the studio scenes
    const ox = t.x * rig.camera.lateralFollow
    eye.set(ox + (p.x - ox) * lateral, p.y, p.z)
    lookAt.set(ox + (t.x - ox) * lateral, t.y, t.z)
    const pullBack = dolly + framing.pull * rig.camera.pullback
    if (pullBack) eye.add(back.subVectors(eye, lookAt).normalize().multiplyScalar(pullBack))

    camera.position.set(eye.x + offset.current.x, eye.y + offset.current.y, eye.z)
    camera.lookAt(lookAt)
  })

  return null
}
