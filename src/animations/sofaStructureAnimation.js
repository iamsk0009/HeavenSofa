import { addCameraPath } from './cameraAnimations'
import { reveal } from './illustrationHelpers'
import { rig } from './rig'
import { fadeIn, fadeOut, revealWords } from './textAnimations'
import { EXPLODE, SOFA_LABELS } from '../data/sofaStructure'
import { STUDIO } from '../experience/models/StudioStage'

const SX = STUDIO.sofaX

/**
 * SCENE 05 — Under the surface.
 *
 * The camera moves to the studio while the workshop illustration still
 * covers the Canvas, then the illustration lifts away like a curtain.
 *
 * Timeline (offsets in units from `start`; scene length = 22):
 *   0 ─ 3      workshop curtain lifts, revealing the assembled sofa
 *   1.5 ─ 4.5  heading
 *   4 ─ 7.5    STAGE 2  cushions slide out to their own column, the linen
 *                       shell lifts off, the whole assembly floats up
 *   7.5 ─ 10.5 STAGE 3  covers lift off their foam/fibre cores; foam padding rises
 *   10.5 ─ 13  STAGE 4  legs drop away — the beech frame stands alone
 *   13 ─ 15.5  STAGE 5  springs and webbing lift out of the frame
 *   15.5 ─ 18  STAGE 6  full exploded view holds (camera settles)
 *   18 ─ 22    labels leave; every layer returns home (hand-off to Scene 06)
 * Labels appear as their layer separates; scrolling back hides them in reverse.
 */
export const SOFA_CAMERA = {
  // assembled three-quarter view → pulled back and centred on the full
  // exploded composition (structure column + cushion column, 0.1–2.6 m tall)
  // reaches the wide framing by t = 8, before the layers spread far apart
  positions: [[SX + 2.0, 1.45, 2.9], [SX + 2.6, 1.8, 3.9], [SX + 3.2, 2.2, 5.1], [SX + 3.45, 2.3, 5.75]],
  targets: [[SX, 0.45, 0], [SX + 0.5, 0.85, 0.06], [SX + 1.1, 1.2, 0.13], [SX + 1.3, 1.3, 0.15]],
}
/** gentle lateral drift while the exploded view holds; Scene 06 starts here */
export const SOFA_HOLD_END = {
  positions: [[SX + 3.45, 2.3, 5.75], [SX + 3.3, 2.28, 5.82], [SX + 3.15, 2.26, 5.86]],
  targets: [[SX + 1.3, 1.3, 0.15], [SX + 1.25, 1.28, 0.15], [SX + 1.2, 1.25, 0.15]],
}

const LABEL_AT = { upholstery: 7, cushions: 9, foam: 9.8, frame: 11.6, structure: 12.4, support: 14.6 }

export function buildSofaStructure(tl, o, { start }) {
  const at = (t) => start + t
  const { root, parts, covers, contactShadow } = o.sofa
  const home = (n) => n.userData.home
  const away = (n, [dx, dy, dz]) => ({ x: home(n).x + dx, y: home(n).y + dy, z: home(n).z + dz })

  // ── arrive: camera cuts to the studio while still covered, curtain lifts ──
  // portrait framing works around the subject (not x = 0), with less lens
  // distortion than the living room's wide angle and a little more distance
  tl.set(rig.camera, { lateralFollow: 1, wide: 0.4, pullback: 1.6 }, at(0))
  addCameraPath(tl, SOFA_CAMERA, { at: at(0), duration: 8, ease: 'power2.inOut' })
  addCameraPath(tl, SOFA_HOLD_END, { at: at(8), duration: 10, ease: 'sine.inOut' })
  tl.fromTo('[data-production="root"]', { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 100% 0%)', duration: 3, ease: 'power2.inOut', immediateRender: false }, at(0))

  fadeIn(tl, '[data-sofa="eyebrow"]', at(1.5), 1.4)
  revealWords(tl, '[data-sofa="title"]', at(1.8), 2.4)
  fadeIn(tl, '[data-sofa="intro"]', at(3), 1.5)
  // the big heading steps back once the labels take over (eyebrow stays)
  fadeOut(tl, '[data-sofa="title"], [data-sofa="intro"]', at(6.4), 1)

  // ── exploded-view moves (each returns home at 18.6+) ──
  const move = (node, offset, from, dur, ease = 'power3.inOut') => {
    tl.fromTo(node.position, { ...home(node) }, { ...away(node, offset), duration: dur, ease, immediateRender: false }, at(from))
    tl.fromTo(node.position, { ...away(node, offset) }, { ...home(node), duration: 2.6, ease: 'power3.inOut', immediateRender: false }, at(18.8))
  }

  // STAGE 2 — cushions out, shell off, assembly floats up
  tl.fromTo(root.position, { y: 0 }, { y: EXPLODE.lift, duration: 3, ease: 'power2.inOut', immediateRender: false }, at(4))
  tl.fromTo(root.position, { y: EXPLODE.lift }, { y: 0, duration: 2.6, ease: 'power3.inOut', immediateRender: false }, at(18.8))
  const shadowMat = contactShadow?.children?.[0]?.material
  if (shadowMat) {
    tl.fromTo(shadowMat, { opacity: 0.6 }, { opacity: 0.18, duration: 3, immediateRender: false }, at(4))
    tl.fromTo(shadowMat, { opacity: 0.18 }, { opacity: 0.6, duration: 2.6, immediateRender: false }, at(18.8))
  }
  ;['SeatCushion_L', 'SeatCushion_R', 'BackCushion_L', 'BackCushion_R'].forEach((n, i) => move(parts[n], EXPLODE.parts[n], 4 + i * 0.25, 2.6))
  move(parts.Upholstery, EXPLODE.parts.Upholstery, 5, 2.5)

  // STAGE 3 — covers off cores, foam padding up
  Object.keys(EXPLODE.covers).forEach((n, i) => move(covers[n], EXPLODE.covers[n], 7.5 + i * 0.2, 1.6))
  move(parts.Padding, EXPLODE.parts.Padding, 8, 2.2)

  // STAGE 4 — legs drop away from the frame
  move(parts.Legs, EXPLODE.parts.Legs, 10.5, 1.8)

  // STAGE 5 — seat support lifts out
  move(parts.SeatSupport, EXPLODE.parts.SeatSupport, 13, 1.9)

  // ── labels ──
  for (const { id } of SOFA_LABELS) {
    reveal(tl, `[data-sofa-label="${id}"]`, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out' }, at(LABEL_AT[id]))
  }
  tl.to('[data-sofa-label]', { autoAlpha: 0, duration: 0.6, stagger: 0.06 }, at(18))
}
