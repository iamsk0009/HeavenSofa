import * as THREE from 'three'

export const PALETTE = {
  paper: '#F4F1EA', // HEAVEN & CO. Warm Ivory — matches the page background
  cream: '#EDE8DF',
  creamShade: '#E2DACB',
  sage: '#C9D0B8',
  forest: '#385343',
  terracotta: '#C96845',
  terracottaDeep: '#B45A3A',
  ink: '#292923',
  linen: '#D6C8B0',
  oak: '#B4865A',
  floor: '#E6DDCF',
  stone: '#D8D0C2',
  brass: '#C4A06A',
}

/* ════════════════════════════════════════════════════════════════════
 * Procedural PBR maps
 *
 * Tileable value-noise / pattern height fields are generated on a canvas
 * and converted to tangent-space normal maps (and roughness maps), giving
 * plaster, microcement, linen and paint real micro-surface response without
 * shipping image files. Each map is generated once and cached.
 * ════════════════════════════════════════════════════════════════════ */

const cache = new Map()

export function mulberry32(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Tileable smooth value noise, `period` lattice cells across the tile. */
function valueNoise(size, period, rand) {
  const lattice = Float32Array.from({ length: period * period }, rand)
  const out = new Float32Array(size * size)
  const fade = (t) => t * t * (3 - 2 * t)
  for (let y = 0; y < size; y++) {
    const fy = (y / size) * period
    const y0 = Math.floor(fy), ty = fade(fy - y0)
    const y1 = (y0 + 1) % period
    for (let x = 0; x < size; x++) {
      const fx = (x / size) * period
      const x0 = Math.floor(fx), tx = fade(fx - x0)
      const x1 = (x0 + 1) % period
      const a = lattice[y0 * period + x0], b = lattice[y0 * period + x1]
      const c = lattice[y1 * period + x0], d = lattice[y1 * period + x1]
      out[y * size + x] = (a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty
    }
  }
  return out
}

/** Fractal noise: sum of octaves [period, amplitude]. */
export function fbm(size, octaves, seed) {
  const rand = mulberry32(seed)
  const out = new Float32Array(size * size)
  for (const [period, amp] of octaves) {
    const n = valueNoise(size, period, rand)
    for (let i = 0; i < out.length; i++) out[i] += n[i] * amp
  }
  return out
}

export function toTexture(size, pixels, { srgb = false } = {}) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(size, size)
  img.data.set(pixels)
  ctx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.anisotropy = 8
  tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace
  return tex
}

/** Height field → tangent-space normal map (wrapping edges, tileable). */
export function normalFromHeight(h, size, strength) {
  const px = new Uint8ClampedArray(size * size * 4)
  const at = (x, y) => h[((y + size) % size) * size + ((x + size) % size)]
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * strength
      const dy = (at(x, y + 1) - at(x, y - 1)) * strength
      const len = Math.hypot(dx, dy, 1)
      const i = (y * size + x) * 4
      px[i] = (-dx / len * 0.5 + 0.5) * 255
      px[i + 1] = (dy / len * 0.5 + 0.5) * 255
      px[i + 2] = (1 / len * 0.5 + 0.5) * 255
      px[i + 3] = 255
    }
  }
  return px
}

/** Height field → greyscale roughness map in [base-range/2, base+range/2]. */
export function roughnessFromHeight(h, size, base, range) {
  let min = Infinity, max = -Infinity
  for (const v of h) { if (v < min) min = v; if (v > max) max = v }
  const px = new Uint8ClampedArray(size * size * 4)
  for (let i = 0; i < h.length; i++) {
    const v = (base + ((h[i] - min) / (max - min) - 0.5) * range) * 255
    px[i * 4] = px[i * 4 + 1] = px[i * 4 + 2] = v
    px[i * 4 + 3] = 255
  }
  return px
}

export function cached(key, build) {
  if (!cache.has(key)) cache.set(key, build())
  return cache.get(key)
}

/** Lime plaster: broad trowel undulation + fine grain. */
function plasterMaps() {
  return cached('plaster', () => {
    const s = 512
    const h = fbm(s, [[3, 1], [7, 0.5], [16, 0.22], [48, 0.12], [128, 0.06]], 11)
    return { normal: toTexture(s, normalFromHeight(h, s, 3.2)), roughness: toTexture(s, roughnessFromHeight(h, s, 0.9, 0.12)) }
  })
}

/** Microcement floor: soft cloudy variation, very low relief. */
function microcementMaps() {
  return cached('microcement', () => {
    const s = 512
    const h = fbm(s, [[4, 1], [9, 0.6], [24, 0.25], [96, 0.08]], 23)
    return { normal: toTexture(s, normalFromHeight(h, s, 1.2)), roughness: toTexture(s, roughnessFromHeight(h, s, 0.72, 0.2)) }
  })
}

/** Plain-weave linen: interlaced warp/weft threads + slub irregularity. */
function linenMaps() {
  return cached('linen', () => {
    const s = 256
    const threads = 32
    const slub = fbm(s, [[8, 1], [32, 0.5]], 5)
    const fibre = fbm(s, [[128, 1]], 9)
    const h = new Float32Array(s * s)
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const u = (x / s) * threads, v = (y / s) * threads
        const cu = Math.floor(u), cv = Math.floor(v)
        const warpOver = (cu + cv) % 2 === 0
        const warp = Math.sin(Math.PI * (u - cu)) // thread cross-section
        const weft = Math.sin(Math.PI * (v - cv))
        const i = y * s + x
        h[i] = (warpOver ? warp * 0.65 + weft * 0.35 : weft * 0.65 + warp * 0.35) + slub[i] * 0.35 + fibre[i] * 0.15
      }
    }
    return { normal: toTexture(s, normalFromHeight(h, s, 1.6)), roughness: toTexture(s, roughnessFromHeight(h, s, 0.9, 0.12)) }
  })
}

/** Satin paint: almost flat, faint orange-peel. */
function paintMaps() {
  return cached('paint', () => {
    const s = 256
    const h = fbm(s, [[24, 1], [64, 0.5]], 31)
    return { normal: toTexture(s, normalFromHeight(h, s, 0.8)) }
  })
}

export const withRepeat = (tex, r) => {
  const t = tex.clone()
  t.repeat.set(r[0], r[1] ?? r[0])
  t.needsUpdate = true
  return t
}

/* ── Material factories ─────────────────────────────────────────────── */

/**
 * `repeat` = tiles per UV unit: a number, or [u, v]. Extruded walls use
 * metres as UVs (0.5 → one 2 m tile); planes use 0–1 UVs (pass size / 2).
 */
export function makePlaster(color = PALETTE.cream, repeat = 0.5) {
  const m = plasterMaps()
  const r = Array.isArray(repeat) ? repeat : [repeat]
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 1,
    roughnessMap: withRepeat(m.roughness, r),
    normalMap: withRepeat(m.normal, r),
    // smooth lime plaster: relief only reads at grazing light
    normalScale: new THREE.Vector2(0.14, 0.14),
  })
}

export function makeMicrocement(color = PALETTE.floor, repeat = [12, 9]) {
  const m = microcementMaps()
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 1,
    roughnessMap: withRepeat(m.roughness, repeat),
    normalMap: withRepeat(m.normal, repeat),
    normalScale: new THREE.Vector2(0.4, 0.4),
  })
}

/** Linen upholstery. GLB UVs are cube-projected at 1 UV unit = 1 m. */
export function makeLinen(color = PALETTE.linen, repeat = 14) {
  const m = linenMaps()
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 1,
    roughnessMap: withRepeat(m.roughness, [repeat]),
    normalMap: withRepeat(m.normal, [repeat]),
    normalScale: new THREE.Vector2(0.45, 0.45),
    sheen: 0.6,
    sheenRoughness: 0.8,
    sheenColor: new THREE.Color('#FFF4E6'),
  })
}

export function makePaint(color = PALETTE.terracotta, repeat = 2) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.48,
    normalMap: withRepeat(paintMaps().normal, [repeat]),
    normalScale: new THREE.Vector2(0.25, 0.25),
    clearcoat: 0.2,
    clearcoatRoughness: 0.55,
  })
}

export const makeWood = (color = PALETTE.oak) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.5 })

export const makeBrass = () =>
  new THREE.MeshStandardMaterial({ color: PALETTE.brass, metalness: 1, roughness: 0.28 })

export const makeStone = (color = PALETTE.stone) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.6 })
