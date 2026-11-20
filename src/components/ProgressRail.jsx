import { SCENE_RANGES, TOTAL_UNITS } from '../data/scenes'
import { useExperienceStore } from '../store/useExperienceStore'

/**
 * Chapter index on the right edge. Shows overall progress and lets the user
 * jump to a chapter (Lenis scrolls there, so the timeline scrubs, not jumps).
 */
export default function ProgressRail() {
  const progress = useExperienceStore((s) => s.progress)
  const active = useExperienceStore((s) => s.activeScene)
  const lenis = useExperienceStore((s) => s.lenis)

  const goTo = (start) => {
    const story = document.getElementById('story')
    if (!story || !lenis) return
    const scrollable = story.offsetHeight - window.innerHeight
    lenis.scrollTo(story.offsetTop + (start / TOTAL_UNITS) * scrollable + 1, { duration: 2.2 })
  }

  return (
    <aside className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 items-center gap-4 sm:right-8 md:flex">
      <ol className="flex flex-col items-end gap-3">
        {SCENE_RANGES.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => goTo(s.start)}
              className={`eyebrow flex items-center gap-3 transition-colors ${active === s.id ? 'text-terracotta' : 'text-ink/40 hover:text-ink'}`}
            >
              {/* titles only on large screens; on tablets they would sit over the scene */}
              <span className={`hidden transition-opacity lg:inline ${active === s.id ? 'opacity-100' : 'opacity-0'}`}>{s.title}</span>
              {s.index}
            </button>
          </li>
        ))}
      </ol>
      <div className="relative h-32 w-px bg-ink/15">
        <div className="absolute inset-x-0 top-0 bg-terracotta" style={{ height: `${progress * 100}%` }} />
      </div>
    </aside>
  )
}
