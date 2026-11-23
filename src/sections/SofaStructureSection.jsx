import SplitWords from '../components/SplitWords'
import { SOFA_LABELS } from '../data/sofaStructure'

/**
 * HTML layer for Scene 05: heading plus the construction labels.
 *
 * Both label layouts are always in the DOM and CSS breakpoints pick one:
 *   ≥ 768 px  anchored labels with leader lines, positioned every frame by
 *             LabelProjector (pinned to the moving 3D parts)
 *   < 768 px  a legend list under the sofa
 * Both carry the same [data-sofa-label] hooks, so the master timeline
 * animates them together and whichever is visible is always in the correct
 * state — resizing across 768 px needs no listener, re-render or reload.
 */
export default function SofaStructureSection() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <div className="absolute left-4 right-4 top-24 sm:left-8 md:left-12 md:right-auto md:top-28">
        <p data-sofa="eyebrow" className="eyebrow invisible mb-4 text-terracotta">05 — Under the surface</p>
        <SplitWords
          as="h2"
          data-sofa="title"
          className="editorial-heading invisible max-w-[14ch] text-[clamp(2.2rem,4.2vw,4.2rem)] text-ink"
          parts={[{ text: 'Every layer has a' }, { text: 'purpose.', accent: true }]}
        />
        <p data-sofa="intro" className="invisible mt-4 hidden max-w-xs text-sm leading-relaxed text-ink/70 md:block">
          Beneath the linen: a corner-blocked beech frame, steel springs and layered foam — built to be re-covered,
          repaired and kept for decades.
        </p>
      </div>

      {/* small screens: legend list in stage order */}
      <ul className="absolute inset-x-4 bottom-10 grid grid-cols-2 gap-x-4 gap-y-3 md:hidden">
        {SOFA_LABELS.map(({ id, title, sub }) => (
          <li key={id} data-sofa-label={id} className="invisible border-l border-terracotta pl-2.5">
            <p className="eyebrow text-[0.6rem] text-ink">{title}</p>
            <p className="mt-0.5 text-[0.68rem] leading-snug text-ink/60">{sub}</p>
          </li>
        ))}
      </ul>

      {/* tablet / desktop: labels pinned to the 3D parts */}
      <div className="hidden md:block">
        {SOFA_LABELS.map(({ id, dx: x, dy: y, title, sub }) => {
          const left = x < 0
          return (
            <div key={id} data-anchor-for={id} className="absolute left-0 top-0" style={{ transform: 'translate3d(-9999px,0,0)' }}>
              <div data-sofa-label={id} className="invisible relative">
                <span className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-terracotta" />
                <svg className="absolute left-0 top-0 overflow-visible" width="1" height="1" aria-hidden="true">
                  <line x1="0" y1="0" x2={x} y2={y} stroke="currentColor" className="text-ink" strokeOpacity="0.45" strokeWidth="1" />
                </svg>
                <div
                  className={`absolute w-max max-w-[11rem] -translate-y-1/2 ${left ? '-translate-x-full pr-2 text-right' : 'pl-2'}`}
                  style={{ left: x, top: y }}
                >
                  <p className="eyebrow text-[0.62rem] text-ink">{title}</p>
                  <p className="mt-0.5 text-[0.7rem] leading-snug text-ink/60">{sub}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
