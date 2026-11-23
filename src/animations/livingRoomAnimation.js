import { addCameraPath } from './cameraAnimations'
import { INTRO } from './introAnimation'
import { fadeIn, fadeOut, hideWords, revealWords } from './textAnimations'
import { rig } from './rig'

const last = (arr) => arr[arr.length - 1]

/**
 * SCENE 02 choreography — the HEAVEN & CO. living room.
 *
 * The doorway scene ends inside the sage room; this scene continues in the
 * same space (no cut). The doorway's sofa becomes the centrepiece while the
 * chair, coffee table, lamp and wall typography arrive around it.
 * Values are shared with LivingRoomScene.jsx so its first render equals
 * timeline progress 0 of this scene.
 */
/*
 * Parking spots are chosen so no doorway-scene camera can see them: both sit
 * outside the sightlines through the arch and outside the doorway's final
 * frame. (Hiding with `visible` is not an option: the furniture's
 * ContactShadows bake on the first frame and would bake empty.)
 */
export const LIVING = {
  chair: {
    from: { position: [3.5, 0, -5.0], rotationY: -1.35 }, // off-frame right
    to: { position: [1.75, 0, -5.4], rotationY: -0.6 },   // angled toward the sofa
  },
  table: {
    from: { position: [-2.6, 0, -2.2], rotationY: 0.9 },  // behind the wall, left of the arch
    to: { position: [0.12, 0, -4.65], rotationY: 0 },
  },
  // HEAVEN & CO. is ~2.3× wider than the old 5-letter mark at equal cap
  // height, so the caps are smaller to occupy the same span of wall
  typography: { capCentreY: 1.32, capHeight: 0.52, rise: 0.3, opacity: [0, 0.82] },
  lamp: { shade: [0, 1.4], light: [0, 2.4] },

  camera: {
    // Starts exactly where the doorway camera finished, then recentres and
    // eases in, lowering slightly to a showroom eye-line.
    positions: [
      last(INTRO.camera.positions),
      [0.0, 1.22, -1.58],
      [0.15, 1.19, -1.64],
      [0.25, 1.17, -1.72],
    ],
    targets: [
      last(INTRO.camera.targets),
      [-0.15, 0.66, -5.5],
      [0.12, 0.7, -5.45],
      [0.25, 0.72, -5.4],
    ],
  },
}

/**
 * Timeline (offsets in units from `start`; scene length = 15):
 *   0 ─ 2.5   doorway caption leaves
 *   0 ─ 15    camera recentres on the arrangement and eases in
 *   0 ─ 10    portrait screens widen the lens (no effect on desktop)
 *   1 ─ 7.5   armchair glides in from the right and turns to the sofa
 *   2.5 ─ 8.5 coffee table slides in from the foreground
 *   3 ─ 8     floor lamp warms up
 *   4.5 ─ 10.5 HEAVEN & CO. wordmark rises and fades onto the wall
 *   9.5 ─ 12  scene caption + product names
 */
export function buildLivingRoom(tl, o, { start, length }) {
  const at = (t) => start + t
  const { chair, table, typography, lamp } = LIVING

  addCameraPath(tl, LIVING.camera, { at: start, duration: length })
  tl.fromTo(rig.camera, { wide: 0 }, { wide: 1, duration: 10, ease: 'power1.inOut', immediateRender: false }, at(0))

  // Armchair
  tl.fromTo(o.chair.position,
    { x: chair.from.position[0], z: chair.from.position[2] },
    { x: chair.to.position[0], z: chair.to.position[2], duration: 6.5, ease: 'power3.out' }, at(1))
  tl.fromTo(o.chair.rotation, { y: chair.from.rotationY }, { y: chair.to.rotationY, duration: 6.5, ease: 'power2.out' }, at(1))

  // Coffee table (decor rides on it)
  tl.fromTo(o.table.position,
    { x: table.from.position[0], z: table.from.position[2] },
    { x: table.to.position[0], z: table.to.position[2], duration: 6, ease: 'power3.out' }, at(2.5))
  tl.fromTo(o.table.rotation, { y: table.from.rotationY }, { y: table.to.rotationY, duration: 6, ease: 'power2.out' }, at(2.5))

  // Floor lamp switches on
  tl.fromTo(o.lampShade.material, { emissiveIntensity: lamp.shade[0] }, { emissiveIntensity: lamp.shade[1], duration: 5, ease: 'power1.inOut' }, at(3))
  tl.fromTo(o.lampLight, { intensity: lamp.light[0] }, { intensity: lamp.light[1], duration: 5, ease: 'power1.inOut' }, at(3))

  // Wall wordmark
  const y = typography.capCentreY
  tl.fromTo(o.typography.position, { y: y - typography.rise }, { y, duration: 6, ease: 'power2.out' }, at(4.5))
  tl.fromTo(o.typography.material, { opacity: typography.opacity[0] }, { opacity: typography.opacity[1], duration: 5, ease: 'power1.inOut' }, at(4.5))

  // HTML overlay
  hideWords(tl, '[data-intro="caption-title"]', at(0), 2)
  fadeOut(tl, '[data-intro="caption-body"], [data-intro="caption-title"]', at(0), 1.8)
  fadeIn(tl, '[data-living="eyebrow"]', at(9.5), 1.8)
  revealWords(tl, '[data-living="title"]', at(9.8), 2)
  fadeIn(tl, '[data-living="products"]', at(10.4), 1.8)
}
