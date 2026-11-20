import SplitWords from '../components/SplitWords'
import ProductionScene from '../illustrations/production/ProductionScene'
import PaperGrain from '../illustrations/shared/PaperGrain'

export const PRODUCTION_STEPS = ['Cutting', 'Frame Assembly', 'Upholstery', 'Finishing']

/**
 * SCENE 04 layer. Parked one screen to the right; the timeline slides it in
 * as the forest slides out, so the journey continues sideways from the
 * forest into the workshop. The step index at the bottom fills step by step.
 */
export default function ProductionSection() {
  return (
    // hidden until the timeline parks it off-screen (xPercent 100) and reveals it
    <div data-production="root" className="pointer-events-none absolute inset-0 z-[16] overflow-hidden bg-paper" style={{ visibility: 'hidden' }}>
      <ProductionScene />
      <PaperGrain />

      <div className="absolute left-4 right-4 top-24 sm:left-8 md:left-12 md:top-28">
        <p data-production="eyebrow" className="eyebrow invisible mb-4 text-terracotta">04 — The workshop</p>
        <SplitWords
          as="h2"
          data-production="title"
          className="editorial-heading max-w-[13ch] text-[clamp(2.6rem,5.2vw,5.4rem)] text-ink"
          parts={[{ text: 'Cut.' }, { text: 'Shaped', accent: true }, { text: 'and joined' }, { text: 'by hand.', accent: true }]}
        />
      </div>

      <ol
        data-production="steps"
        className="invisible absolute inset-x-4 bottom-6 grid grid-cols-2 gap-x-5 gap-y-2 sm:inset-x-8 sm:grid-cols-4 sm:gap-3 md:inset-x-auto md:bottom-10 md:left-1/2 md:w-[44rem] md:-translate-x-1/2"
      >
        {PRODUCTION_STEPS.map((label, i) => (
          <li key={label} data-step={i} className="opacity-40">
            <div className="relative h-px bg-ink/20">
              {/* inline transform (not Tailwind's `scale` property) so GSAP's scaleX owns it */}
              <div data-step-fill={i} className="absolute inset-0 origin-left bg-terracotta" style={{ transform: 'scaleX(0)' }} />
            </div>
            <p className="eyebrow mt-3 whitespace-nowrap text-[0.6rem] text-ink sm:text-[0.68rem]">
              <span className="text-terracotta">0{i + 1}</span> {label}
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}
