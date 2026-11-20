import { useMemo } from 'react'

let grainUrl = null

/** Tiny tileable monochrome noise tile, generated once per page load. */
function makeGrain() {
  if (grainUrl) return grainUrl
  const s = 140
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')
  const img = ctx.createImageData(s, s)
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v
    img.data[i + 3] = 26 + Math.random() * 20
  }
  ctx.putImageData(img, 0, 0)
  grainUrl = c.toDataURL('image/png')
  return grainUrl
}

/**
 * Subtle risograph-like paper grain over flat illustration colours. A static
 * CSS background (not an SVG filter), so it costs nothing while the artwork
 * animates underneath.
 */
export default function PaperGrain({ opacity = 0.5 }) {
  const url = useMemo(makeGrain, [])
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 mix-blend-multiply"
      style={{ backgroundImage: `url(${url})`, opacity }}
    />
  )
}
