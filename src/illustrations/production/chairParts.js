/**
 * The five components of the side-view dining chair, and where each one is
 * at every stage of the making story (1600 × 900 artboard units).
 *
 *   raw        a 120-unit length of the plank lying on the bench (STEP 1)
 *   exploded   lifted into an exploded technical diagram (STEP 2 → 3)
 *   assembled  joined into the finished chair standing on the bench (STEP 3 → 4)
 *
 * Every part is drawn centred on (0, 0) in its FINAL orientation; `rawRotation`
 * turns it to lie flat as a plank section. The raw sketch rect is drawn in
 * the same orientation, so at `rawRotation` it reads as a horizontal board.
 */
export const BENCH_TOP = 600
export const PLANK = { x0: 480, length: 600, y: 578, thickness: 22 }
export const CUTS = [600, 720, 840, 960]
export const PIECE = PLANK.length / 5

const rawCenter = (i) => ({ x: PLANK.x0 + PIECE * (i + 0.5), y: PLANK.y + PLANK.thickness / 2 })
const plus = (p, dx, dy) => ({ x: p.x + dx, y: p.y + dy })

const PARTS_DEF = [
  {
    id: 'backPost',
    label: 'Back leg',
    shape: { type: 'polygon', points: '-1,150 13,150 -1,-150 -15,-150' },
    raw: { w: 22, h: PIECE },
    rawRotation: 90,
    assembled: { x: 831, y: 450 },
    explode: [-80, 0],
  },
  {
    id: 'backrest',
    label: 'Backrest',
    shape: { type: 'path', d: 'M-9 -38 Q3 0 -9 38 L9 38 Q21 0 9 -38 Z' },
    raw: { w: 22, h: PIECE },
    rawRotation: -90,
    assembled: { x: 842, y: 345 },
    explode: [-130, -40],
  },
  {
    id: 'seat',
    label: 'Seat',
    shape: { type: 'rect', x: -80, y: -8, w: 160, h: 16, rx: 6 },
    raw: { w: PIECE, h: 22 },
    rawRotation: 0,
    assembled: { x: 906, y: 426 },
    explode: [0, -90],
  },
  {
    id: 'stretcher',
    label: 'Stretcher',
    shape: { type: 'rect', x: -59, y: -4.5, w: 118, h: 9, rx: 4 },
    raw: { w: PIECE, h: 22 },
    rawRotation: 0,
    assembled: { x: 902, y: 528 },
    explode: [0, 30],
  },
  {
    id: 'frontLeg',
    label: 'Front leg',
    shape: { type: 'polygon', points: '-7,-85 7,-85 5,85 -5,85' },
    raw: { w: 22, h: PIECE },
    rawRotation: -90,
    assembled: { x: 967, y: 515 },
    explode: [80, 0],
  },
]

export const CHAIR_PARTS = PARTS_DEF.map((p, i) => {
  const raw = rawCenter(i)
  return {
    ...p,
    index: i,
    rawPos: raw,
    // after cutting, the pieces open up small gaps
    cutPos: plus(raw, (i - 2) * 16, 0),
    explodedPos: plus(p.assembled, p.explode[0], p.explode[1]),
  }
})

/** Joint dowels on the assembled chair. */
export const DOWELS = [
  [834, 426], [966, 426], [840, 528], [963, 528], [833, 345],
]
