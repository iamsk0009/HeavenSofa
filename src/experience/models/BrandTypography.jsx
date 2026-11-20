import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { PALETTE } from './materials'

const CANVAS = { w: 4096, h: 1024 }

/**
 * Render a wordmark with the site's own web font (Fraunces, loaded in
 * index.html) into a power-of-two canvas. Returns the texture plus the
 * cap-height fraction so the plane can be sized to an exact cap height.
 */
async function buildWordmark(text, { weight = 300, tracking = 0.08 } = {}) {
  const family = 'Fraunces'
  try {
    await Promise.all([document.fonts.load(`${weight} 200px ${family}`), document.fonts.load(`italic ${weight} 200px ${family}`)])
  } catch {
    /* fall back to the serif stack below */
  }
  const canvas = document.createElement('canvas')
  canvas.width = CANVAS.w
  canvas.height = CANVAS.h
  const ctx = canvas.getContext('2d')

  let px = 980
  // the ampersand is set in the italic cut, as in the 2D Wordmark component
  const font = (l = '') => `${l === '&' ? 'italic ' : ''}${weight} ${px}px ${family}, "Times New Roman", serif`
  const width = (l) => {
    ctx.font = font(l)
    return ctx.measureText(l).width
  }
  const letters = [...text]
  const measure = () => letters.reduce((w, l) => w + width(l), 0) + px * tracking * (letters.length - 1)
  // keep a margin so letterforms never touch the texture edge
  while (measure() > CANVAS.w * 0.94) px -= 20

  ctx.font = font()
  const cap = ctx.measureText('H').actualBoundingBoxAscent
  const baseline = CANVAS.h / 2 + cap / 2
  let x = (CANVAS.w - measure()) / 2
  ctx.fillStyle = '#ffffff'
  for (const l of letters) {
    ctx.font = font(l)
    ctx.fillText(l, x, baseline)
    x += ctx.measureText(l).width + px * tracking
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return { texture, capFraction: cap / CANVAS.h }
}

/**
 * Large brand wordmark painted on the wall. A real 3D plane (not an HTML
 * overlay) so furniture in front genuinely overlaps it and it receives the
 * room's light and shadows. The forwarded ref is the mesh; the timeline
 * animates its position and material.opacity.
 *
 * `capHeight` (m) is the height of the capitals; `position` is the centre of
 * the capitals on the wall.
 */
export default function BrandTypography({ ref, text = 'HEAVEN & CO.', capHeight = 1.3, color = PALETTE.forest, opacity = 0, ...props }) {
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.9,
        transparent: true,
        opacity,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        visible: false, // shown once the font has rendered (no fallback flash)
      }),
    [color], // eslint-disable-line react-hooks/exhaustive-deps -- opacity is timeline-owned after mount
  )

  useEffect(() => {
    let cancelled = false
    let tex
    buildWordmark(text).then(({ texture, capFraction }) => {
      if (cancelled) return texture.dispose()
      tex = texture
      material.map = texture
      material.visible = true
      material.needsUpdate = true
      const h = capHeight / capFraction
      ref.current?.scale.set(h * (CANVAS.w / CANVAS.h), h, 1)
    })
    return () => {
      cancelled = true
      tex?.dispose()
    }
  }, [text, capHeight, material, ref])

  return (
    <mesh ref={ref} name="brand-typography" material={material} receiveShadow {...props}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  )
}
