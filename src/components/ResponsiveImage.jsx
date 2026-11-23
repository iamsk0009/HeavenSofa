/**
 * Use high quality, responsive WebP variants on common viewport widths while
 * keeping the original image as a full resolution fallback.
 */
export default function ResponsiveImage({ src, sizes = '100vw', ...props }) {
  const isJpeg = typeof src === 'string' && /\.jpe?g(?:\?.*)?$/i.test(src)
  const sourceWidth = Number.parseInt(props.width, 10)
  const optimizedBase = isJpeg
    ? src.replace(/^\/images\//, '/images-optimized/').replace(/\.jpe?g(?:\?.*)?$/i, '')
    : null
  const has1280 = sourceWidth > 1280 || (!sourceWidth && /\/(?:lifestyle|materials)\//.test(src))
  const candidates = optimizedBase
    ? [480, 960, ...(has1280 ? [1280] : [])].map((width) => `${optimizedBase}-${width}.webp ${width}w`)
    : []

  return (
    <picture>
      {candidates.length > 0 && (
        <source
          type="image/webp"
          srcSet={candidates.join(', ')}
          sizes={sizes}
        />
      )}
      <img src={src} sizes={sizes} {...props} />
    </picture>
  )
}
