import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'
import Wordmark, { BRAND } from './Wordmark'

/**
 * Branded loading screen shown while the 3D models and textures download.
 * Progress comes from three.js's loading manager (drei useProgress), so the
 * bar reflects real asset loading. Fades out once everything has loaded,
 * then unmounts. Respects reduced-motion (no fade).
 */
export default function BrandLoader() {
  const { active, progress } = useProgress()
  const done = !active && progress === 100
  const [gone, setGone] = useState(false)

  useEffect(() => {
    if (!done) return
    const t = setTimeout(() => setGone(true), 1100)
    return () => clearTimeout(t)
  }, [done])

  if (gone) return null

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={done ? `${BRAND.name} loaded` : `Loading ${BRAND.name}`}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-paper text-ink transition-opacity duration-1000 ease-out motion-reduce:transition-none ${done ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
    >
      <Wordmark className="text-2xl sm:text-4xl" />
      <p className="mt-4 font-serif text-lg font-light italic text-ink/70">{BRAND.tagline}</p>
      <div className="mt-10 h-px w-40 overflow-hidden bg-ink/15">
        <div className="h-full origin-left bg-terracotta transition-transform duration-300" style={{ transform: `scaleX(${progress / 100})` }} />
      </div>
      <p className="eyebrow mt-4 text-[0.6rem] text-ink/45">{BRAND.descriptor}</p>
    </div>
  )
}
