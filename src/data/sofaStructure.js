/**
 * Scene 05 — the exploded sofa: where each construction layer travels and
 * what each label points at. Shared by the 3D scene (anchors), the HTML
 * labels and the timeline, so they can never disagree.
 *
 * Offsets are in sofa-local metres (x = width, y = up, z = toward camera).
 * Node names match tools/blender/build_sofa_exploded.py.
 */
export const EXPLODE = {
  lift: 0.38, // the whole assembly rises so dropped legs stay above the floor
  parts: {
    Legs: [0, -0.32, 0],
    SeatSupport: [0, 0.42, 0],
    Padding: [0, 0.86, 0],
    Upholstery: [0, 1.4, 0],
    SeatCushion_L: [2.45, 0.05, 0.15],
    SeatCushion_R: [2.45, 0.05, 0.15],
    BackCushion_L: [2.45, 0.62, 0.4],
    BackCushion_R: [2.45, 0.62, 0.4],
  },
  // cover lifts off its core (in the cushion's own space)
  covers: {
    SeatCushion_L_Cover: [0, 0.36, 0],
    SeatCushion_R_Cover: [0, 0.36, 0],
    BackCushion_L_Cover: [0, 0.36, 0],
    BackCushion_R_Cover: [0, 0.36, 0],
  },
}

/**
 * Editorial labels. `node` + `at` = the 3D anchor (node-local); `dx`/`dy` =
 * where the text sits relative to the anchor, in CSS px at desktop size.
 * The structure labels form one column on the left, in height order, so
 * they never cross; the cushion label sits to the right of its column.
 */
export const SOFA_LABELS = [
  { id: 'upholstery', node: 'Upholstery', at: [-0.9, 0.58, 0.25], dx: -120, dy: -18, title: 'Upholstery', sub: 'Stonewashed linen, hand-tailored' },
  { id: 'foam', node: 'Padding', at: [-0.9, 0.45, 0.3], dx: -120, dy: 0, title: 'Foam cushioning', sub: 'High-density, CertiPUR foam' },
  { id: 'support', node: 'SeatSupport', at: [-0.62, 0.33, 0.1], dx: -150, dy: 6, title: 'Seat support', sub: 'Sinuous steel springs + webbing' },
  { id: 'frame', node: 'Frame', at: [-0.93, 0.24, 0.4], dx: -120, dy: 14, title: 'Wooden frame', sub: 'Kiln-dried beech, corner-blocked' },
  { id: 'structure', node: 'Legs', at: [-0.85, 0.04, 0.34], dx: -120, dy: 22, title: 'Structural components', sub: 'Solid oak legs, steel fixings' },
  { id: 'cushions', node: 'SeatCushion_R', at: [0.42, 0.2, 0.25], dx: 120, dy: 18, title: 'Seat cushions', sub: 'Removable covers, HR foam cores' },
]
