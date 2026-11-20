/**
 * Editorial headline split into masked words for GSAP reveals.
 *
 * Each word gets two nested spans:
 *   outer  .overflow-hidden  → the mask
 *   middle [data-word]       → animated by the scroll timeline
 *   inner  [data-load-word]  → animated once on page load
 * Separate wrappers mean load-in and scroll animations never fight over the
 * same transform.
 *
 * parts: [{ text: 'Step into a calmer' }, { text: 'home.', accent: true }]
 */
export default function SplitWords({ as: Tag = 'h2', parts, className = '', ...rest }) {
  const words = parts.flatMap(({ text, accent }) => text.split(' ').map((w) => ({ w, accent })))
  return (
    <Tag className={className} {...rest}>
      <span className="sr-only">{parts.map((p) => p.text).join(' ')}</span>
      <span aria-hidden="true">
        {words.map(({ w, accent }, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <span data-word className="inline-block will-change-transform">
              <span data-load-word className={`inline-block ${accent ? 'accent' : ''}`}>
                {w}
                {i < words.length - 1 ? ' ' : ''}
              </span>
            </span>
          </span>
        ))}
      </span>
    </Tag>
  )
}
