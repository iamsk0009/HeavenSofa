import { Link } from 'react-router-dom'
import SplitWords from '../components/SplitWords'
import { CHAIRS } from '../data/chairCollection'

/**
 * HTML layer for Scene 06: heading, a product caption under each chair
 * (pinned to the platform by LabelProjector) and a closing link to the shop.
 */
export default function ChairCollectionSection() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <div className="absolute inset-x-4 top-24 text-center md:top-28">
        <p data-chairs="eyebrow" className="eyebrow invisible mb-4 text-terracotta">06 — The chair collection</p>
        <SplitWords
          as="h2"
          data-chairs="title"
          className="editorial-heading invisible mx-auto max-w-[16ch] text-[clamp(2.2rem,4.6vw,4.6rem)] text-ink"
          parts={[{ text: 'Designed for the way you' }, { text: 'live.', accent: true }]}
        />
      </div>

      {CHAIRS.map((c) => (
        <div key={c.id} data-anchor-for={`chair-${c.id}`} className="absolute left-0 top-0" style={{ transform: 'translate3d(-9999px,0,0)' }}>
          <div data-chair-label={c.id} className="invisible absolute left-0 top-3 w-max -translate-x-1/2 text-center">
            <p className="font-serif text-base text-ink md:text-lg">{c.name}</p>
            <p className="eyebrow mt-0.5 hidden text-[0.58rem] text-ink/55 lg:block">{c.kind} · {c.material}</p>
          </div>
        </div>
      ))}

      <div data-chairs="cta" className="invisible absolute inset-x-0 bottom-10 flex justify-center">
        <Link to="/collections" className="eyebrow pointer-events-auto border-b border-terracotta pb-1 text-terracotta">
          Explore the collection
        </Link>
      </div>
    </div>
  )
}
