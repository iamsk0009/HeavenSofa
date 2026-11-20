import gsap from 'gsap'
import { PATH_ID } from '../illustrations/forest/WalkingPath'
import { q, reveal, walkCycle } from './illustrationHelpers'
import { fadeIn, fadeOut, revealWords } from './textAnimations'

const F = (name) => `[data-forest="${name}"]`
const PATH = `#${PATH_ID}`

/**
 * SCENE 03 — "From forest to home" (SVG + HTML, no 3D objects).
 *
 * Timeline (offsets in units from `start`; scene length = 18):
 *   0 ─ 3.5    illustration rises over the 3D living room (clip-path)
 *   0 ─ 1.5    living-room caption leaves
 *   1.5 ─ 7    distant tree line grows, left → right
 *   2 ─ 5.5    headline + intro copy
 *   3 ─ 9      mid trees grow (staggered, with a little overshoot)
 *   4 ─ 9.5    framing foreground trees grow
 *   0 ─ 18     parallax drift (far → front: slow → fast), sun rises, birds glide
 *   5 ─ 7      log pile appears at the forest edge
 *   6 ─ 15.5   two carriers walk the log along the path toward home
 *   6 ─ 8      the home appears
 *   8.5 ─ 16.5 the log cart follows, wheel turning
 *   11 ─ 15.5  furniture appears around the home, one piece at a time
 */
export function buildForest(tl, _o, { start, length }) {
  const at = (t) => start + t
  const grow = { scaleY: 0, scaleX: 0.7, transformOrigin: '50% 100%' }
  const grown = { scaleY: 1, scaleX: 1 }

  // ── page turn: the illustrated chapter rises over the 3D scene ──
  reveal(tl, F('root'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 3.5, ease: 'power2.inOut' }, at(0))
  reveal(tl, `${F('near')}, ${F('front')}`, { y: 70 }, { y: 0, duration: 4.5, ease: 'power2.out' }, at(0))
  fadeOut(tl, '[data-living="eyebrow"], [data-living="products"]', at(0), 1.5)
  tl.fromTo(q('[data-living="title"] [data-word]'), { yPercent: 0 }, { yPercent: -140, duration: 1.5, ease: 'power2.in', immediateRender: false }, at(0))

  // ── trees grow ──
  reveal(tl, '[data-tree="far"]', grow, { ...grown, duration: 1.4, stagger: 0.28, ease: 'power2.out' }, at(1.5))
  reveal(tl, '[data-tree="mid"]', grow, { ...grown, duration: 2, stagger: 0.42, ease: 'back.out(1.4)' }, at(3))
  reveal(tl, '[data-tree="front"]', grow, { ...grown, duration: 3, stagger: 0.8, ease: 'power3.out' }, at(4))

  // ── headline ──
  fadeIn(tl, F('eyebrow'), at(2), 1.5)
  revealWords(tl, F('title'), at(2.2), 2.8)
  fadeIn(tl, F('intro'), at(3.6), 1.9)

  // ── parallax + sky (the whole chapter) ──
  const drift = { far: -20, mid: -55, near: -90, front: -160 }
  for (const [layer, x] of Object.entries(drift)) {
    tl.fromTo(F(layer), { x: 0 }, { x, duration: length, ease: 'none', immediateRender: false }, at(0))
  }
  reveal(tl, F('sun'), { y: 50, scale: 0.92, transformOrigin: '50% 50%' }, { y: -30, scale: 1, duration: length, ease: 'none' }, at(0))
  reveal(tl, F('birds'), { x: -60, opacity: 0 }, { x: 70, opacity: 1, duration: length, ease: 'none' }, at(0))

  // ── objects on the land ──
  reveal(tl, F('logpile'), { scale: 0, transformOrigin: '50% 100%' }, { scale: 1, duration: 2, ease: 'back.out(1.6)' }, at(5))
  reveal(tl, F('home'), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 2, ease: 'power2.out' }, at(6))
  reveal(tl, F('furniture'), { y: 24, opacity: 0, scale: 0.6, transformOrigin: '50% 100%' }, { y: 0, opacity: 1, scale: 1, duration: 1.6, stagger: 0.95, ease: 'back.out(1.5)' }, at(11))

  // ── walkers follow the path (front-left → home), shrinking with depth ──
  const walk = (sel, from, to, startPos, endPos, scales, steps) => {
    const el = q(sel)
    if (!el.length) return
    const mp = { path: PATH, align: PATH, alignOrigin: [0.5, 1] }
    // hidden until they set off, so they never stand waiting at the frame edge
    gsap.set(el, { motionPath: { ...mp, start: startPos, end: startPos }, scale: scales[0], opacity: 0 })
    tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.6, immediateRender: false }, at(from))
    tl.to(el, { motionPath: { ...mp, start: startPos, end: endPos }, duration: to - from, ease: 'none' }, at(from))
    tl.fromTo(el, { scale: scales[0] }, { scale: scales[1], duration: to - from, ease: 'none', immediateRender: false }, at(from))
    walkCycle(tl, sel, at(from), to - from, steps)
  }
  walk(F('carriers'), 6, 15.5, 0, 0.84, [1.2, 0.62], 22)
  walk(F('cart'), 8.5, 16.5, 0, 0.7, [1.1, 0.66], 18)
  tl.fromTo(F('wheel'), { rotation: 0 }, { rotation: 900, duration: 8, ease: 'none', transformOrigin: '50% 50%', immediateRender: false }, at(8.5))
}
