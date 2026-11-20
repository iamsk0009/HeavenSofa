import * as THREE from 'three'
import {
  cached,
  fbm,
  normalFromHeight,
  roughnessFromHeight,
  toTexture,
  withRepeat,
} from '../models/materials'

/**
 * PBR materials for furniture and objects, built on the procedural map
 * generators in models/materials.js (architecture materials live there).
 * GLB furniture uses cube-projected UVs at 1 UV unit = 1 m, so `repeat` is
 * "tiles per metre".
 */

export const FURNITURE_COLORS = {
  boucleOrange: '#C4683F',
  terracottaGlaze: '#A04E30',
  clay: '#8E4A30',
  ceramicWhite: '#EEE7DA',
  wool: '#E8DFCF',
  blackMetal: '#2B2A26',
  shade: '#F3E9DA',
}

/** Bouclé: dense irregular loops (ridged noise) → strong, soft micro-relief. */
function boucleMaps() {
  return cached('boucle', () => {
    const s = 256
    const a = fbm(s, [[24, 1], [48, 0.6]], 41)
    const b = fbm(s, [[32, 1], [64, 0.5]], 43)
    const h = new Float32Array(s * s)
    for (let i = 0; i < h.length; i++) {
      // ridged noise: bright rings where the field crosses its midpoint = loops
      const r1 = 1 - Math.abs(a[i] / 1.6 - 0.5) * 2
      const r2 = 1 - Math.abs(b[i] / 1.5 - 0.5) * 2
      h[i] = r1 ** 3 + r2 ** 3 * 0.7
    }
    return { normal: toTexture(s, normalFromHeight(h, s, 2.4)), roughness: toTexture(s, roughnessFromHeight(h, s, 0.92, 0.1)) }
  })
}

/** Wool rug: soft felted noise. */
function woolMaps() {
  return cached('wool', () => {
    const s = 256
    const h = fbm(s, [[16, 1], [64, 0.7], [128, 0.4]], 51)
    return { normal: toTexture(s, normalFromHeight(h, s, 2)) }
  })
}

/** Hand-thrown ceramic / glaze: gentle undulation. */
function glazeMaps() {
  return cached('glaze', () => {
    const s = 256
    const h = fbm(s, [[4, 1], [12, 0.4], [40, 0.12]], 61)
    return { normal: toTexture(s, normalFromHeight(h, s, 1.4)) }
  })
}

export function makeBoucle(color = FURNITURE_COLORS.boucleOrange, repeat = 9) {
  const m = boucleMaps()
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 1,
    roughnessMap: withRepeat(m.roughness, [repeat]),
    normalMap: withRepeat(m.normal, [repeat]),
    normalScale: new THREE.Vector2(0.75, 0.75),
    sheen: 1,
    sheenRoughness: 0.85,
    sheenColor: new THREE.Color('#FFD9C2'),
  })
}

/** Glazed terracotta (coffee-table top): satin glaze with a soft clearcoat. */
export function makeGlaze(color = FURNITURE_COLORS.terracottaGlaze, repeat = 1.5) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.38,
    normalMap: withRepeat(glazeMaps().normal, [repeat]),
    normalScale: new THREE.Vector2(0.18, 0.18),
    clearcoat: 0.5,
    clearcoatRoughness: 0.35,
  })
}

/** Unglazed fired clay (pedestals, pots). */
export function makeClay(color = FURNITURE_COLORS.clay, repeat = 3) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.85,
    normalMap: withRepeat(glazeMaps().normal, [repeat]),
    normalScale: new THREE.Vector2(0.35, 0.35),
  })
}

export function makeCeramic(color = FURNITURE_COLORS.ceramicWhite) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.42,
    normalMap: withRepeat(glazeMaps().normal, [2]),
    normalScale: new THREE.Vector2(0.25, 0.25),
    clearcoat: 0.3,
    clearcoatRoughness: 0.4,
  })
}

export function makeWool(color = FURNITURE_COLORS.wool, repeat = [10, 7]) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 1,
    normalMap: withRepeat(woolMaps().normal, repeat),
    normalScale: new THREE.Vector2(0.6, 0.6),
  })
}

export const makeBlackMetal = () =>
  new THREE.MeshStandardMaterial({ color: FURNITURE_COLORS.blackMetal, metalness: 0.7, roughness: 0.45 })

/* ── Construction materials (Scene 05) ───────────────────────────────── */

/** Open-cell polyurethane foam: dense pin-hole porosity, very matte. */
function foamMaps() {
  return cached('foam', () => {
    const s = 256
    const n = fbm(s, [[64, 1], [128, 0.8]], 71)
    const h = new Float32Array(s * s)
    for (let i = 0; i < h.length; i++) h[i] = n[i] > 1.05 ? 0 : 1 // pores
    return { normal: toTexture(s, normalFromHeight(h, s, 0.9)) }
  })
}

/** Machined timber: fine straight grain along U. */
function grainMaps() {
  return cached('grain', () => {
    const s = 256
    const n = fbm(s, [[6, 1], [24, 0.3]], 81)
    const h = new Float32Array(s * s)
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const i = y * s + x
        h[i] = Math.sin((y / s) * Math.PI * 2 * 18 + n[i] * 6) * 0.5 + 0.5
      }
    }
    return { normal: toTexture(s, normalFromHeight(h, s, 1.2)), roughness: toTexture(s, roughnessFromHeight(h, s, 0.62, 0.16)) }
  })
}

/** Leather: soft pebble grain. */
function leatherMaps() {
  return cached('leather', () => {
    const s = 256
    const h = fbm(s, [[48, 1], [96, 0.5]], 91)
    return { normal: toTexture(s, normalFromHeight(h, s, 1.4)), roughness: toTexture(s, roughnessFromHeight(h, s, 0.5, 0.14)) }
  })
}

export const makeFoam = (color = '#EADCA9') =>
  new THREE.MeshStandardMaterial({ color, roughness: 1, normalMap: withRepeat(foamMaps().normal, [6]), normalScale: new THREE.Vector2(0.6, 0.6) })

export const makeFibre = (color = '#F2EEE6') =>
  new THREE.MeshStandardMaterial({ color, roughness: 1, normalMap: withRepeat(woolMaps().normal, [8]), normalScale: new THREE.Vector2(0.5, 0.5) })

export function makeTimber(color = '#C9A06E', repeat = 4) {
  const m = grainMaps()
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 1,
    roughnessMap: withRepeat(m.roughness, [repeat]),
    normalMap: withRepeat(m.normal, [repeat]),
    normalScale: new THREE.Vector2(0.35, 0.35),
  })
}

export const makeSpringSteel = () =>
  new THREE.MeshStandardMaterial({ color: '#3A3B3D', metalness: 0.9, roughness: 0.38 })

export const makeWebbing = () =>
  new THREE.MeshStandardMaterial({ color: '#8C857A', roughness: 0.95, normalMap: withRepeat(woolMaps().normal, [12]), normalScale: new THREE.Vector2(0.4, 0.4) })

export function makeLeather(color = '#8E5E3C') {
  const m = leatherMaps()
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 1,
    roughnessMap: withRepeat(m.roughness, [6]),
    normalMap: withRepeat(m.normal, [6]),
    normalScale: new THREE.Vector2(0.3, 0.3),
    clearcoat: 0.15,
    clearcoatRoughness: 0.6,
  })
}

export function makeWoolFelt(color = '#4E6B57') {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 1,
    normalMap: withRepeat(woolMaps().normal, [10]),
    normalScale: new THREE.Vector2(0.5, 0.5),
    sheen: 0.8,
    sheenRoughness: 0.8,
    sheenColor: new THREE.Color('#C9D6CC'),
  })
}

/** Linen lamp shade that glows from within (emissiveIntensity is animated). */
export const makeLampShade = () =>
  new THREE.MeshStandardMaterial({
    color: FURNITURE_COLORS.shade,
    roughness: 0.95,
    emissive: '#FFD9A8',
    emissiveIntensity: 0,
    side: THREE.DoubleSide,
  })
