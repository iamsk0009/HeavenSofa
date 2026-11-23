import { useEffect, useLayoutEffect, useState } from 'react'
import Wordmark, { BRAND } from './Wordmark'
import { homepageIsReady, markHomepageEntered, retryHomepage, useHomepageReadiness } from '../experience/homepageReadiness'

/**
 * Branded loading screen shown while the 3D models and textures download.
 * Progress comes from three.js's loading manager (drei useProgress), so the
 * bar reflects real asset loading. Fades out once everything has loaded,
 * then unmounts. Respects reduced-motion (no fade).
 */
export default function BrandLoader() {
  const readiness = useHomepageReadiness()
  const isReady = homepageIsReady(readiness)
  const [criticalReady, setCriticalReady] = useState(false)

  useEffect(() => {
    if (isReady && !criticalReady) {
      setCriticalReady(true)
    }
  }, [isReady, criticalReady])

  const done = criticalReady || isReady
  const [gone, setGone] = useState(false)

  useLayoutEffect(() => {
    // Remove the static sibling only after React has committed this loader.
    document.getElementById('heaven-boot-shell')?.remove()
  }, [])

  useEffect(() => {
    if (!done) return
    const t = setTimeout(() => {
      setGone(true)
      markHomepageEntered()
    }, 1100)
    return () => clearTimeout(t)
  }, [done])

  if (gone) return null

  const displayProgress = done ? 100 : Math.min(readiness.progress, 99)

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={readiness.error ? `${BRAND.name} could not finish loading` : done ? `${BRAND.name} loaded` : `Loading ${BRAND.name}`}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-paper text-ink transition-opacity duration-1000 ease-out motion-reduce:transition-none ${done ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
    >
      <Wordmark className="text-2xl sm:text-4xl" />
      <p className="mt-4 font-serif text-lg font-light italic text-ink/70">{BRAND.tagline}</p>
      <div className="mt-10 h-px w-40 overflow-hidden bg-ink/15">
        <div className="h-full origin-left bg-terracotta transition-transform duration-300" style={{ transform: `scaleX(${displayProgress / 100})` }} />
      </div>
      <p className="eyebrow mt-4 text-[0.6rem] text-ink/45">{BRAND.descriptor}</p>
      {readiness.error && (
        <div className="mt-8 max-w-sm px-6 text-center" role="alert">
          <p className="text-sm text-ink/70">Some essential scene assets could not be loaded. Check your connection and try again.</p>
          <button type="button" className="mt-4 border border-ink/30 px-4 py-2 text-sm" onClick={retryHomepage}>Try again</button>
          {import.meta.env.DEV && <p className="mt-2 text-xs text-ink/45">{readiness.error}</p>}
        </div>
      )}
    </div>
  )
}
