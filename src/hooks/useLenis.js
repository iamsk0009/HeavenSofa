import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../animations/gsapSetup'
import { useExperienceStore } from '../store/useExperienceStore'

/**
 * Smooth scrolling driven by GSAP's ticker, so Lenis, ScrollTrigger and the
 * master timeline all advance on the same frame.
 */
export function useLenis() {
  const setLenis = useExperienceStore((s) => s.setLenis)

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    setLenis(lenis)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      setLenis(null)
    }
  }, [setLenis])
}
