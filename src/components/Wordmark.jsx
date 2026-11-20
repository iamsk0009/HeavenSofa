/**
 * HEAVEN & CO. typographic wordmark — the single source for every on-screen
 * use of the brand name (header, footer, loading screen).
 *
 * Fraunces at a light weight with wide tracking; the ampersand is set in the
 * italic cut, slightly smaller, as the mark's one flourish. Tracking is
 * removed after the final character so the mark centres optically.
 */
export const BRAND = {
  name: 'HEAVEN & CO.',
  tagline: 'A beautiful way to live.',
  descriptor: 'Furniture · Interiors · Living',
}

export default function Wordmark({ className = '', tracking = '0.26em', ...rest }) {
  return (
    <span
      className={`inline-flex items-baseline whitespace-nowrap font-serif font-light ${className}`}
      style={{ letterSpacing: tracking }}
      aria-label={BRAND.name}
      role="img"
      {...rest}
    >
      <span aria-hidden="true">HEAVEN</span>
      <span aria-hidden="true" className="mx-[0.12em] font-normal italic" style={{ fontSize: '0.92em', letterSpacing: 0 }}>
        &amp;
      </span>
      <span aria-hidden="true" style={{ marginRight: `-${tracking}` }}>
        CO.
      </span>
    </span>
  )
}
