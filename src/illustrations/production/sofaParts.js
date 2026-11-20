/**
 * The five structural members of the two-seater sofa frame, and where each one
 * is at every stage of the making story (1600 × 900 artboard units).
 *
 * Side-profile view — left = back of sofa, right = front of sofa:
 *
 *   backPost    rear post + backrest frame  (tall, extends to backrest height)
 *   armPanel    horizontal arm rail         (connects the two posts at arm height)
 *   seatBase    horizontal seat-deck frame  (the platform the cushions rest on)
 *   bottomRail  low connecting base rail    (structural cross-member near the floor)
 *   frontPost   front arm post              (slightly shorter than the back post)
 *
 * Stages:
 *   raw        a 120-unit section of the plank lying on the bench (Step 1)
 *   cut        small gaps open where the saw has passed (Step 1 → 2)
 *   exploded   pieces lift into an open technical diagram (Step 2 → 3)
 *   assembled  parts join into the finished sofa side frame (Step 3 → 4)
 *
 * Every part is drawn centred on (0, 0) in its FINAL orientation.
 * `rawRotation` turns it to lie flat as a horizontal plank section.
 *
 * The assembled frame reads as a sofa in side profile:
 *
 *   backPost ─────── armPanel ─────── frontPost
 *      │                                  │
 *      └──────────── seatBase ────────────┘
 *      │                                  │
 *      └──────────── bottomRail ──────────┘
 */
export const BENCH_TOP = 600
export const PLANK = { x0: 480, length: 600, y: 578, thickness: 22 }
export const CUTS = [600, 720, 840, 960]
export const PIECE = PLANK.length / 5

const rawCenter = (i) => ({ x: PLANK.x0 + PIECE * (i + 0.5), y: PLANK.y + PLANK.thickness / 2 })
const plus = (p, dx, dy) => ({ x: p.x + dx, y: p.y + dy })

// Assembled sofa side frame is centred around x=870; both posts bottom at y=600 (bench top).
// backPost center:  y = 600 − 135 = 465  (270 h total, −135 → +135)
// frontPost center: y = 600 − 110 = 490  (220 h total, −110 → +110)

const PARTS_DEF = [
  {
    id: 'backPost',
    label: 'Back post',
    // Tall tapered post — taller because it extends to backrest height
    shape: { type: 'polygon', points: '-8,-135 8,-135 7,135 -7,135' },
    raw: { w: 22, h: PIECE },
    rawRotation: 90,
    assembled: { x: 760, y: 465 },
    explode: [-110, 0],
  },
  {
    id: 'armPanel',
    label: 'Arm rail',
    // Long horizontal rail — connects both posts at arm height
    shape: { type: 'rect', x: -110, y: -10, w: 220, h: 20, rx: 7 },
    raw: { w: PIECE, h: 22 },
    rawRotation: 0,
    assembled: { x: 870, y: 390 },
    explode: [0, -130],
  },
  {
    id: 'seatBase',
    label: 'Seat frame',
    // Horizontal seat-deck support
    shape: { type: 'rect', x: -110, y: -9, w: 220, h: 18, rx: 4 },
    raw: { w: PIECE, h: 22 },
    rawRotation: 0,
    assembled: { x: 870, y: 548 },
    explode: [0, -70],
  },
  {
    id: 'bottomRail',
    label: 'Base rail',
    // Low cross-member near the floor
    shape: { type: 'rect', x: -115, y: -6, w: 230, h: 12, rx: 3 },
    raw: { w: PIECE, h: 22 },
    rawRotation: 0,
    assembled: { x: 870, y: 582 },
    explode: [0, 60],
  },
  {
    id: 'frontPost',
    label: 'Front post',
    // Front arm post — slightly shorter than the back post
    shape: { type: 'polygon', points: '-7,-110 7,-110 6,110 -6,110' },
    raw: { w: 22, h: PIECE },
    rawRotation: -90,
    assembled: { x: 980, y: 490 },
    explode: [110, 0],
  },
]

export const SOFA_PARTS = PARTS_DEF.map((p, i) => {
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

// Keep this alias so any code still referencing CHAIR_PARTS keeps working.
export const CHAIR_PARTS = SOFA_PARTS

/** Dowels at key frame joints (5, same count as before). */
export const DOWELS = [
  [760, 390],   // backPost ↔ armPanel
  [980, 390],   // frontPost ↔ armPanel
  [760, 548],   // backPost ↔ seatBase
  [980, 548],   // frontPost ↔ seatBase
  [980, 582],   // frontPost ↔ bottomRail
]
