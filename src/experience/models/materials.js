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

/** Subtle non-periodic linen grain for the configurable sofa surfaces. */
function configuratorLinenMaps() {
  return cached('configurator-linen', () => {
    const size = 256
    const height = fbm(size, [[12, 0.34], [36, 0.24], [96, 0.16], [192, 0.08]], 47)
    return {
      normal: toTexture(size, normalFromHeight(height, size, 0.9)),
      roughness: toTexture(size, roughnessFromHeight(height, size, 0.94, 0.06)),
    }
  })
}

/** Linen material for the configurator: fine grain without the high-contrast weave bands. */
export function makeConfiguratorLinen(color = PALETTE.linen, repeat = 8) {
  const maps = configuratorLinenMaps()
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness: 0.96,
    roughnessMap: withRepeat(maps.roughness, [repeat]),
    normalMap: withRepeat(maps.normal, [repeat]),
    normalScale: new THREE.Vector2(0.12, 0.12),
    sheen: 0.32,
    sheenRoughness: 0.92,
    sheenColor: new THREE.Color('#FFF4E6'),
  })
}

let terraTexturesCache = null

/**
 * Loads and caches the real 2K Meshy Oak Wood Grain PBR textures:
 * - /textures/terra-oak/oak-wood-grain_2k_color.jpg (sRGB)
 * - /textures/terra-oak/oak-wood-grain_2k_normalgl.jpg (Linear / NoColorSpace)
 * - /textures/terra-oak/oak-wood-grain_2k_roughness.jpg (Linear / NoColorSpace)
 * Displacement map is omitted initially per instructions to avoid unwanted surface distortion.
 */
export function loadTerraOakTextures() {
  if (terraTexturesCache) return terraTexturesCache

  const loader = new THREE.TextureLoader()

  const colorMap = loader.load('/textures/terra-oak/oak-wood-grain_2k_color.jpg')
  colorMap.colorSpace = THREE.SRGBColorSpace
  colorMap.wrapS = THREE.RepeatWrapping
  colorMap.wrapT = THREE.RepeatWrapping
  colorMap.anisotropy = 8

  const normalMap = loader.load('/textures/terra-oak/oak-wood-grain_2k_normalgl.jpg')
  normalMap.colorSpace = THREE.NoColorSpace
  normalMap.wrapS = THREE.RepeatWrapping
  normalMap.wrapT = THREE.RepeatWrapping
  normalMap.anisotropy = 8

  const roughnessMap = loader.load('/textures/terra-oak/oak-wood-grain_2k_roughness.jpg')
  roughnessMap.colorSpace = THREE.NoColorSpace
  roughnessMap.wrapS = THREE.RepeatWrapping
  roughnessMap.wrapT = THREE.RepeatWrapping
  roughnessMap.anisotropy = 8

  terraTexturesCache = {
    colorMap,
    normalMap,
    roughnessMap,
  }

  return terraTexturesCache
}

export function disposeTerraOakTextures() {
  if (!terraTexturesCache) return
  terraTexturesCache.colorMap?.dispose()
  terraTexturesCache.normalMap?.dispose()
  terraTexturesCache.roughnessMap?.dispose()
  terraTexturesCache = null
}

/** Authentic European Oak PBR material using real 2K Meshy oak wood grain texture maps. */
export function makeTerraOak(color = '#B4865A', finish = 'matte') {
  const textures = loadTerraOakTextures()
  const isMatte = finish === 'matte'
  const isGloss = finish === 'gloss'
  const roughness = isMatte ? 0.80 : isGloss ? 0.24 : 0.50
  const clearcoat = isGloss ? 0.48 : isMatte ? 0 : 0.14
  const clearcoatRoughness = isGloss ? 0.14 : 0.32

  const isDefaultOak = !color || color === '#B4865A' || color === 'oak'
  const colorMap = {
    '#594438': '#604638', // Walnut
    '#765B45': '#7E6652', // Smoked Oak
  }
  const baseColor = isDefaultOak ? 0xF6E7D2 : (colorMap[color] ?? color)

  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(baseColor),
    map: textures.colorMap,
    roughnessMap: textures.roughnessMap,
    normalMap: textures.normalMap,
    normalScale: new THREE.Vector2(0.28, 0.28),
    roughness,
    clearcoat,
    clearcoatRoughness,
  })

  mat.userData = {
    isTerraOak: true,
    configuratorOriginalColor: 0xF6E7D2,
  }

  return mat
}

/** Procedural straight wood grain maps for configurable furniture surfaces. */
function configuratorWoodMaps() {
  return cached('configurator-wood', () => {
    const s = 512
    const n = fbm(s, [[8, 1], [32, 0.4], [128, 0.15]], 67)
    const h = new Float32Array(s * s)
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const i = y * s + x
        const wave = Math.sin((y / s) * Math.PI * 2 * 28 + n[i] * 5) * 0.5 + 0.5
        h[i] = wave * 0.75 + n[i] * 0.25
      }
    }
    return {
      normal: toTexture(s, normalFromHeight(h, s, 1.4)),
      roughness: toTexture(s, roughnessFromHeight(h, s, 0.58, 0.18)),
    }
  })
}

/** Realistic natural wood PBR material for the configurator (Terra, Nord, etc.). */
export function makeConfiguratorWood(color = PALETTE.oak, finish = 'satin', repeat = [5, 4]) {
  const maps = configuratorWoodMaps()
  const isMatte = finish === 'matte'
  const isGloss = finish === 'gloss'
  const roughness = isMatte ? 0.88 : isGloss ? 0.22 : 0.46
  const clearcoat = isGloss ? 0.5 : isMatte ? 0 : 0.16
  const clearcoatRoughness = isGloss ? 0.15 : 0.35
  const rep = Array.isArray(repeat) ? repeat : [repeat, repeat]

  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness,
    roughnessMap: withRepeat(maps.roughness, rep),
    normalMap: withRepeat(maps.normal, rep),
    normalScale: new THREE.Vector2(0.3, 0.3),
    clearcoat,
    clearcoatRoughness,
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

/** High-fidelity straight architectural veneer maps for Nord Sideboard. */
function nordVeneerMaps() {
  return cached('nord-veneer', () => {
    const s = 512
    const fibers = fbm(s, [[16, 0.4], [64, 0.3], [128, 0.2], [256, 0.1]], 93)
    const h = new Float32Array(s * s)
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const i = y * s + x
        // Straight-line comb with very subtle micro-sway (pure vertical rift cut)
        const sway = Math.sin((y / s) * Math.PI * 4) * 0.04
        const u = ((x / s) * 20 + sway + fibers[i] * 0.4) % 1
        const pore = Math.sin(u * Math.PI * 2) * 0.5 + 0.5
        h[i] = pore * 0.55 + fibers[i] * 0.45
      }
    }
    return {
      normal: toTexture(s, normalFromHeight(h, s, 1.1)),
      roughness: toTexture(s, roughnessFromHeight(h, s, 0.52, 0.14)),
    }
  })
}

export function makeNordWood(color = '#594438', finish = 'satin', repeat = [3, 2]) {
  const isChalkWhite = color === '#F2EDE4' || color === 'chalk-white'
  const isSlateGrey = color === '#4E5357' || color === 'slate-grey'
  const isMatteLacquer = isChalkWhite || isSlateGrey

  const isMatte = finish === 'matte' || isMatteLacquer
  const isGloss = finish === 'gloss' && !isMatteLacquer
  const roughness = isMatteLacquer ? 0.70 : isMatte ? 0.82 : isGloss ? 0.20 : 0.48
  const clearcoat = isMatteLacquer ? 0 : isGloss ? 0.55 : isMatte ? 0 : 0.18
  const clearcoatRoughness = isGloss ? 0.12 : 0.26

  const colorMap = {
    '#594438': '#523D2F', // Warm Walnut
    '#B4865A': '#C49A6C', // Natural White Oak
    '#3D3028': '#382B24', // Smoked Espresso Oak
    '#222120': '#1F1E1D', // Black Stained Ash
    '#F2EDE4': '#F2EDE4', // Chalk White
    '#4E5357': '#4E5357', // Slate Grey
  }
  const baseColor = colorMap[color] ?? color

  const maps = isMatteLacquer ? paintMaps() : nordVeneerMaps()
  const rep = Array.isArray(repeat) ? repeat : [repeat, repeat]

  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(baseColor),
    roughness,
    roughnessMap: maps.roughness ? withRepeat(maps.roughness, rep) : null,
    normalMap: withRepeat(maps.normal, rep),
    normalScale: isMatteLacquer ? new THREE.Vector2(0.12, 0.12) : new THREE.Vector2(0.35, 0.35),
    clearcoat,
    clearcoatRoughness,
  })

  mat.userData = {
    isNordWood: true,
    isMatteLacquer,
    configuratorOriginalColor: new THREE.Color(baseColor).getHex(),
  }

  return mat
}

export function makeNordHardware(color = '#D4AF37') {
  const isBlack = color === '#222222' || color === 'black'
  const isBronze = color === '#5A4532' || color === 'bronze'
  const isSteel = color === '#CCCCCC' || color === 'steel'

  let hex = '#D8B048' // Brushed Champagne Brass
  let metalness = 0.94
  let roughness = 0.26

  if (isBlack) {
    hex = '#202020'
    metalness = 0.85
    roughness = 0.42
  } else if (isBronze) {
    hex = '#544131'
    metalness = 0.90
    roughness = 0.36
  } else if (isSteel) {
    hex = '#CCCCCC'
    metalness = 0.96
    roughness = 0.22
  }

  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(hex),
    metalness,
    roughness,
  })

  mat.userData = {
    isNordHardware: true,
    configuratorOriginalColor: new THREE.Color(hex).getHex(),
  }

  return mat
}

/** Tactile looped yarn bouclé maps for Alma Bed. */
function boucleMaps() {
  return cached('boucle', () => {
    const s = 256
    const n1 = fbm(s, [[16, 0.4], [32, 0.35], [64, 0.2]], 77)
    const n2 = fbm(s, [[24, 0.5], [48, 0.3], [96, 0.15]], 89)
    const h = new Float32Array(s * s)
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const i = y * s + x
        const curl = Math.sin(n1[i] * Math.PI * 4) * Math.cos(n2[i] * Math.PI * 4) * 0.5 + 0.5
        h[i] = curl * 0.65 + n1[i] * 0.35
      }
    }
    return {
      normal: toTexture(s, normalFromHeight(h, s, 1.8)),
      roughness: toTexture(s, roughnessFromHeight(h, s, 0.92, 0.08)),
    }
  })
}

export function makeConfiguratorBoucle(color = '#E8DDC8', repeat = 12) {
  const maps = boucleMaps()
  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness: 0.92,
    roughnessMap: withRepeat(maps.roughness, [repeat]),
    normalMap: withRepeat(maps.normal, [repeat]),
    normalScale: new THREE.Vector2(0.35, 0.35),
    sheen: 0.50,
    sheenRoughness: 0.80,
    sheenColor: new THREE.Color('#FFF6E8'),
  })
  mat.userData = {
    isAlmaBoucle: true,
    configuratorOriginalColor: new THREE.Color(color).getHex(),
  }
  return mat
}

/** Bedding washed percale / linen cloth maps. */
function beddingMaps() {
  return cached('bedding', () => {
    const s = 256
    const h = fbm(s, [[16, 0.4], [48, 0.3], [128, 0.15]], 61)
    return {
      normal: toTexture(s, normalFromHeight(h, s, 0.75)),
      roughness: toTexture(s, roughnessFromHeight(h, s, 0.88, 0.10)),
    }
  })
}

export function makeConfiguratorBedding(color = '#F5F1E9', repeat = 8) {
  const maps = beddingMaps()
  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness: 0.88,
    roughnessMap: withRepeat(maps.roughness, [repeat]),
    normalMap: withRepeat(maps.normal, [repeat]),
    normalScale: new THREE.Vector2(0.18, 0.18),
    sheen: 0.30,
    sheenRoughness: 0.85,
    sheenColor: new THREE.Color('#FFFFFF'),
  })
  mat.userData = {
    isAlmaBedding: true,
    configuratorOriginalColor: new THREE.Color(color).getHex(),
  }
  return mat
}

export const makeWood = (color = PALETTE.oak) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.5 })

export const makeBrass = () =>
  new THREE.MeshStandardMaterial({ color: PALETTE.brass, metalness: 1, roughness: 0.28 })

export const makeStone = (color = PALETTE.stone) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.6 })
