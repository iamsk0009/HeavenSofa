import { useSyncExternalStore } from 'react'

/**
 * Illustrations are authored on a 1600 × 900 artboard. Rather than scaling the
 * whole artwork down on narrow screens, each breakpoint frames a different
 * window of it: portrait screens get a taller window (more sky above, which
 * holds the HTML headline) centred on the important part of the composition.
 * Used with preserveAspectRatio="xMidYMax slice", so the ground stays anchored
 * to the bottom edge.
 *
 * frames: { landscape, tablet, portrait } → "minX minY width height"
 */
const subscribe = (cb) => {
  window.addEventListener('resize', cb)
  return () => window.removeEventListener('resize', cb)
}
const getAspect = () => window.innerWidth / window.innerHeight

export function useResponsiveViewBox(frames) {
  const aspect = useSyncExternalStore(subscribe, getAspect, () => 16 / 9)
  if (aspect < 0.75) return frames.portrait
  if (aspect < 1.25) return frames.tablet
  return frames.landscape
}
