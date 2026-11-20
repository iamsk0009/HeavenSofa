import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useExperienceStore } from '../store/useExperienceStore'

/**
 * Pauses the WebGL render loop while an illustrated chapter fully covers the
 * Canvas, and resumes it the moment the Canvas can be seen again. Driven by
 * the master timeline via the store, so it never fights the scroll.
 */
export default function RenderGate() {
  const setFrameloop = useThree((s) => s.setFrameloop)
  const active = useExperienceStore((s) => s.canvasActive)

  useEffect(() => {
    setFrameloop(active ? 'always' : 'never')
  }, [active, setFrameloop])

  return null
}
