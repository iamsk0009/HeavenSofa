import { useEffect } from 'react'
import CanvasExperience from '../experience/CanvasExperience'
import ProgressRail from '../components/ProgressRail'
import IntroSection from './IntroSection'
import LivingRoomSection from './LivingRoomSection'
import ForestSection from './ForestSection'
import ProductionSection from './ProductionSection'
import SofaStructureSection from './SofaStructureSection'
import ChairCollectionSection from './ChairCollectionSection'
import { TOTAL_UNITS, VH_PER_UNIT } from '../data/scenes'
import { useExperienceStore } from '../store/useExperienceStore'

/**
 * The scroll-driven storytelling block.
 *
 * #story is tall (one viewport + VH_PER_UNIT per timeline unit). Inside it a
 * sticky, viewport-sized stage holds the persistent Canvas and every HTML/SVG
 * overlay, so the visuals stay pinned while scroll progress scrubs the master
 * timeline. CSS sticky is used instead of a pin-spacer: no layout reflow.
 */
export default function StoryExperience() {
  useDebugProgress()

  return (
    <section id="story" className="relative" style={{ height: `${100 + TOTAL_UNITS * VH_PER_UNIT}vh` }}>
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-paper">
        <div className="absolute inset-0">
          <CanvasExperience />
        </div>
        <IntroSection />
        <LivingRoomSection />
        <SofaStructureSection />
        <ChairCollectionSection />
        {/* illustrated chapters: opaque layers above the Canvas */}
        <ForestSection />
        <ProductionSection />
        <ProgressRail />
      </div>
    </section>
  )
}

/**
 * Visual-testing aid: `/?progress=0.6` lands at 60% of the story on load.
 * Works in production builds too; it only reads the URL.
 */
function useDebugProgress() {
  const lenis = useExperienceStore((s) => s.lenis)
  useEffect(() => {
    const p = parseFloat(new URLSearchParams(window.location.search).get('progress'))
    const story = document.getElementById('story')
    if (!lenis || Number.isNaN(p) || !story) return
    const y = story.offsetTop + Math.min(Math.max(p, 0), 1) * (story.offsetHeight - window.innerHeight)
    requestAnimationFrame(() => lenis.scrollTo(y, { immediate: true, force: true }))
  }, [lenis])
}
