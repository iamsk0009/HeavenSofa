import SplitWords from '../components/SplitWords'
import ForestLandscape from '../illustrations/forest/ForestLandscape'
import PaperGrain from '../illustrations/shared/PaperGrain'

/**
 * SCENE 03 layer. Covers the 3D canvas once revealed (the timeline animates
 * its clip-path up from the bottom like a rising horizon), so the illustrated
 * chapter reads as a page turn rather than a new website.
 * Starts fully clipped — the timeline owns every state after that.
 */
export default function ForestSection() {
  return (
    <div
      data-forest="root"
      className="pointer-events-none absolute inset-0 z-[15] overflow-hidden bg-paper"
      style={{ clipPath: 'inset(100% 0% 0% 0%)' }}
    >
      <ForestLandscape />
      <PaperGrain />

      <div className="absolute left-4 right-4 top-24 sm:left-8 md:left-12 md:top-28">
        <p data-forest="eyebrow" className="eyebrow invisible mb-4 text-terracotta">03 — Origin</p>
        <SplitWords
          as="h2"
          data-forest="title"
          className="editorial-heading max-w-[12ch] text-[clamp(3rem,6.4vw,6.4rem)] text-ink"
          parts={[{ text: 'From forest to' }, { text: 'home.', accent: true }]}
        />
        {/* sits in the open sky under the headline, clear of the sun */}
        <p data-forest="intro" className="invisible mt-5 max-w-[22rem] text-sm leading-relaxed text-ink/70">
          Every HEAVEN &amp; CO. piece begins as a tree in a slow-grown Nordic forest — felled selectively, carried out by hand and
          replanted, so the forest keeps its shape.
        </p>
      </div>
    </div>
  )
}
