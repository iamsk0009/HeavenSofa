import { addCameraPath } from './cameraAnimations'
import { reveal } from './illustrationHelpers'
import { rig } from './rig'
import { fadeIn, fadeOut, revealWords } from './textAnimations'
import { CHAIRS } from '../data/chairCollection'
import { STUDIO } from '../experience/models/StudioStage'
import { SOFA_HOLD_END } from './sofaStructureAnimation'

const CX = STUDIO.chairsX
const last = (a) => a[a.length - 1]

/**
 * SCENE 06 — The chair collection.
 *
 * Starts exactly where Scene 05's camera rests (beside the reassembled
 * sofa) and pans right along the studio to the platform — one continuous
 * space, no cut.
 *
 * Timeline (offsets in units from `start`; scene length = 20):
 *   0 ─ 4.5    camera pans from the sofa to the establishing view;
 *              platform rises into place; Scene 05 eyebrow leaves
 *   2.5 ─ 5    heading
 *   4 ─ 10.5   chairs arrive one by one (rise, scale, settle with a turn)
 *   6.5        heading steps back
 *   10.5 ─ 16.5 lateral tracking shot along the collection, left → right;
 *              each chair turns slightly toward the passing camera
 *   16.5 ─ 20  pull back to the final composition; heading returns
 */
export const CHAIRS_CAMERA = {
  arrive: {
    positions: [last(SOFA_HOLD_END.positions), [CX - 4, 2.35, 7.2], [CX - 1.2, 2.4, 8.2], [CX, 2.4, 8.4]],
    targets: [last(SOFA_HOLD_END.targets), [CX - 4, 0.85, 0.15], [CX - 0.8, 0.55, 0], [CX, 0.5, 0]],
  },
  track: {
    positions: [[CX, 2.4, 8.4], [CX - 3.4, 1.45, 4.3], [CX, 1.4, 4.1], [CX + 3.4, 1.45, 4.3]],
    targets: [[CX, 0.5, 0], [CX - 3.2, 0.5, -0.2], [CX, 0.55, 0.2], [CX + 3.3, 0.5, -0.2]],
  },
  // final: centred, and aimed above the chairs so the lineup sits in the
  // lower third — clear of the chapter rail (vertically centred, right edge)
  // and balanced against the heading above
  final: {
    // low eye-line, looking slightly up: the lineup settles below the rail
    positions: [[CX + 3.4, 1.45, 4.3], [CX + 1.6, 1.35, 6.2], [CX, 1.25, 7.9]],
    targets: [[CX + 3.3, 0.5, -0.2], [CX + 1, 1.0, 0.1], [CX, 1.55, 0.2]],
  },
}

export function buildChairCollection(tl, o, { start }) {
  const at = (t) => start + t

  // ── arrival ──
  addCameraPath(tl, CHAIRS_CAMERA.arrive, { at: at(0), duration: 4.5, ease: 'power2.inOut' })
  // narrow screens: step back far enough for the whole 8 m lineup
  tl.fromTo(rig.camera, { pullback: 1.6 }, { pullback: 6.6, duration: 4.5, ease: 'power2.inOut', immediateRender: false }, at(0))
  fadeOut(tl, '[data-sofa="eyebrow"]', at(0), 1.2)
  reveal(tl, [o.platform.position], { y: -0.12 }, { y: 0, duration: 2.6, ease: 'power3.out' }, at(1.6))
  reveal(tl, [o.platform.scale], { x: 0.82, z: 0.82 }, { x: 1, z: 1, duration: 2.6, ease: 'power3.out' }, at(1.6))

  fadeIn(tl, '[data-chairs="eyebrow"]', at(2.5), 1.3)
  revealWords(tl, '[data-chairs="title"]', at(2.8), 2.2)

  // ── chairs, one by one ──
  CHAIRS.forEach((c, i) => {
    const t = 4 + i * 1.3
    const chair = o.chairs[i]
    const shadow = o.shadows[i]
    reveal(tl, [chair.scale], { x: 0.001, y: 0.001, z: 0.001 }, { x: 1, y: 1, z: 1, duration: 1.7, ease: 'back.out(1.3)' }, at(t))
    reveal(tl, [chair.position], { y: 0.35 }, { y: 0, duration: 1.7, ease: 'power3.out' }, at(t))
    reveal(tl, [chair.rotation], { y: -0.9 }, { y: 0, duration: 1.9, ease: 'power3.out' }, at(t))
    reveal(tl, [shadow.material], { opacity: 0 }, { opacity: 1, duration: 1.4, ease: 'power1.out' }, at(t + 0.3))
    reveal(tl, `[data-chair-label="${c.id}"]`, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'power2.out' }, at(t + 1))
  })
  fadeOut(tl, '[data-chairs="title"]', at(6.5), 1)

  // ── tracking shot ──
  addCameraPath(tl, CHAIRS_CAMERA.track, { at: at(10.5), duration: 6, ease: 'sine.inOut' })
  CHAIRS.forEach((_, i) => {
    // turn toward the camera as it passes, then back
    const passAt = 11.5 + i * 1.1
    tl.fromTo(o.chairs[i].rotation, { y: 0 }, { y: 0.18, duration: 1.1, ease: 'sine.inOut', immediateRender: false }, at(passAt - 0.8))
    tl.fromTo(o.chairs[i].rotation, { y: 0.18 }, { y: 0, duration: 1.4, ease: 'sine.inOut', immediateRender: false }, at(passAt + 0.3))
  })

  // ── final composition ──
  addCameraPath(tl, CHAIRS_CAMERA.final, { at: at(16.5), duration: 3.5, ease: 'power2.inOut' })
  tl.fromTo('[data-chairs="title"]', { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: 1.8, ease: 'power2.out', immediateRender: false }, at(17.6))
  fadeIn(tl, '[data-chairs="cta"]', at(18.2), 1.4)
}
