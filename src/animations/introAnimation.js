import { addCameraPath } from './cameraAnimations'
import { fadeIn, fadeOut, hideWords, revealWords } from './textAnimations'

/**
 * SCENE 01 choreography. Values are shared with IntroScene.jsx so the scene's
 * first render and the timeline's progress-0 state are identical (no jump
 * when the timeline takes over).
 */
export const INTRO = {
  door: { from: 0.9, to: 1.8 },                 // hinge angle (rad): ajar → fully open
  lights: {                                      // [start, end] intensities
    spot: [12, 40],
    fill: [2, 7],
    window: [2, 6],
  },
  sofa: { position: [0, 0, -5.95], travel: -0.3 }, // starts 30 cm deeper, eases forward

  camera: {
    // Front-facing, doorway-centred, then a straight dolly through the arch.
    // Pitch/yaw change only a few degrees: no swinging or orbiting.
    positions: [
      [0, 1.5, 7.0],      // full architectural composition, sofa visible through the gap
      [0, 1.46, 5.2],
      [0, 1.4, 3.2],      // the arch fills the frame
      [0, 1.34, 1.3],
      [0, 1.3, 0.1],      // in the threshold
      [0, 1.27, -0.9],
      [-0.1, 1.25, -1.55], // inside: sofa framed, room left for the caption
    ],
    targets: [
      [0, 1.42, 0],
      [0, 1.38, -0.6],
      [0, 1.28, -2],
      [0, 1.08, -3.8],
      [0, 0.92, -4.8],
      [-0.2, 0.72, -5.4],
      [-0.35, 0.6, -5.5],
    ],
  },
}

/**
 * Timeline (offsets in units from `start`; scene length = 15):
 *   0 ─ 3     headline + scroll cue leave
 *   1 ─ 7     door swings from ajar to fully open, room light rises
 *   6 ─ 13    sofa eases forward into its final place
 *   0 ─ 15    camera dolly: full composition → through arch → sofa
 *   10 ─ 13   caption reveals inside the room
 */
export function buildIntro(tl, o, { start, length }) {
  const at = (t) => start + t
  const { door, lights, sofa } = INTRO

  addCameraPath(tl, INTRO.camera, { at: start, duration: length, initial: start === 0 })

  tl.fromTo(o.doorHinge.rotation, { y: door.from }, { y: door.to, duration: 6, ease: 'power2.inOut' }, at(1))

  const light = (target, [from, to]) =>
    tl.fromTo(target, { intensity: from }, { intensity: to, duration: 6, ease: 'power1.inOut' }, at(1))
  light(o.interiorSpot, lights.spot)
  light(o.interiorFill, lights.fill)
  light(o.windowLight, lights.window)

  const z = sofa.position[2]
  tl.fromTo(o.sofa.position, { z: z + sofa.travel }, { z, duration: 7, ease: 'power2.out' }, at(6))

  fadeOut(tl, '[data-intro="cue"]', at(0), 1.2)
  hideWords(tl, '[data-intro="headline"]', at(0.6), 2.4)
  fadeOut(tl, '[data-intro="meta"]', at(0.6), 2)
  revealWords(tl, '[data-intro="caption-title"]', at(10), 2.2)
  fadeIn(tl, '[data-intro="caption-body"]', at(10.8), 2)
}
