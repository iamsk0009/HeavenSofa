import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useExperienceStore } from '../store/useExperienceStore'

/**
 * Pins HTML labels to moving 3D anchors. Each frame, while `sceneId` is the
 * active scene, every anchor's world position is projected to screen space
 * and written straight to its DOM element's transform (no React state, no
 * re-renders). Label visibility is owned by the master timeline.
 *
 * anchors: () => ({ [labelId]: Object3D }); DOM: [data-anchor-for="<id>"]
 */
export default function LabelProjector({ sceneId, anchors }) {
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  const els = useRef(null)
  const v = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    if (useExperienceStore.getState().activeScene !== sceneId) return
    const map = anchors()
    if (!map) return
    if (!els.current) {
      els.current = Object.fromEntries(
        Object.keys(map).map((id) => [id, document.querySelector(`[data-anchor-for="${id}"]`)]),
      )
    }
    camera.updateMatrixWorld()
    for (const [id, anchor] of Object.entries(map)) {
      const el = els.current[id]
      if (!el || !anchor) continue
      anchor.updateWorldMatrix(true, false)
      v.setFromMatrixPosition(anchor.matrixWorld).project(camera)
      const x = ((v.x + 1) / 2) * size.width
      const y = ((1 - v.y) / 2) * size.height
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
    }
  })

  return null
}
