import SplitWords from '../components/SplitWords'

const PRODUCTS = [
  { name: 'Linnea', kind: 'Two-seater sofa · linen' },
  { name: 'Ora', kind: 'Lounge chair · bouclé' },
  { name: 'Terra', kind: 'Coffee table · glazed clay' },
]

/**
 * HTML layer for Scene 02. Kept to the lower-left corner so the 3D
 * arrangement and the wall wordmark stay unobstructed. All motion is driven
 * by animations/livingRoomAnimation.js.
 */
export default function LivingRoomSection() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <div className="absolute bottom-10 left-4 max-w-xs sm:left-8 md:bottom-12 md:left-12">
        <p data-living="eyebrow" className="eyebrow invisible mb-3 text-terracotta">
          02 — The living room
        </p>
        <SplitWords
          as="h2"
          data-living="title"
          className="editorial-heading invisible text-[clamp(1.8rem,3vw,2.6rem)] text-ink"
          parts={[{ text: 'Quiet forms,' }, { text: 'warm', accent: true }, { text: 'materials.' }]}
        />
        <ul data-living="products" className="invisible mt-5 space-y-1.5 text-sm text-ink/70">
          {PRODUCTS.map((p) => (
            <li key={p.name} className="flex gap-3">
              <span className="w-14 font-serif text-ink">{p.name}</span>
              <span>{p.kind}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
