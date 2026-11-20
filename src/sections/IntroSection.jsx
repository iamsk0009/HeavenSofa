import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import SplitWords from '../components/SplitWords'

/**
 * HTML layer for Scene 01. Scroll-driven tweens target the data-intro
 * attributes from animations/sceneAnimations.js; the only non-scroll motion is
 * the one-time load-in reveal below.
 */
export default function IntroSection() {
  const root = useRef()

  useGSAP(
    () => {
      gsap.from('[data-load-word]', { yPercent: 110, duration: 1.4, stagger: 0.07, ease: 'expo.out', delay: 0.35 })
      gsap.from('[data-load-fade]', { autoAlpha: 0, y: 16, duration: 1.2, stagger: 0.1, ease: 'power2.out', delay: 0.9 })
    },
    { scope: root },
  )

  return (
    <div ref={root} className="pointer-events-none absolute inset-0 z-10">
      {/* Opening headline */}
      <div className="absolute inset-x-0 bottom-0 px-4 pb-24 sm:px-8 md:px-12 md:pb-16">
        <p data-intro="meta" className="eyebrow mb-5 text-ink/60">
          <span data-load-fade className="inline-block">Scandinavian furniture · Est. 2026</span>
        </p>
        <SplitWords
          as="h1"
          data-intro="headline"
          className="editorial-heading max-w-[11ch] text-[clamp(3.2rem,7.5vw,7rem)] text-ink"
          parts={[{ text: 'Step into a calmer' }, { text: 'home.', accent: true }]}
        />
      </div>

      <div data-intro="cue" className="absolute bottom-8 right-4 flex items-center gap-3 sm:right-8 md:right-12">
        <span data-load-fade className="eyebrow inline-flex items-center gap-3 text-ink/60">
          Scroll to enter
          <span className="relative block h-8 w-px overflow-hidden bg-ink/15">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[cue_1.8s_ease-in-out_infinite] bg-terracotta" />
          </span>
        </span>
      </div>

      {/* Caption revealed once we are through the arch */}
      <div className="absolute left-4 right-4 top-24 max-w-sm sm:left-8 md:left-12 md:right-auto md:top-1/2 md:-translate-y-1/2">
        <SplitWords
          as="h2"
          data-intro="caption-title"
          className="editorial-heading text-[clamp(2rem,4vw,3.4rem)] text-ink"
          parts={[{ text: 'Every room begins at the' }, { text: 'threshold.', accent: true }]}
        />
        <p data-intro="caption-body" className="invisible mt-5 max-w-xs text-sm leading-relaxed text-ink/70">
          Pieces made to be lived with — solid timber frames, natural linens and quiet forms that let the light do the
          rest.
        </p>
      </div>
    </div>
  )
}
