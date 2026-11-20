import gsap from 'gsap'

/**
 * Helpers for scroll-scrubbed SVG/DOM tweens on the master timeline.
 *
 * GSAP's fromTo only immediate-renders the FIRST target of a staggered tween,
 * so other targets would show their natural state until their turn. `reveal`
 * explicitly sets every target's start state at build time, then adds the
 * tween with immediateRender:false — fully deterministic in both directions.
 */
export const q = (sel) => gsap.utils.toArray(sel)

export function reveal(tl, sel, from, to, at) {
  const els = typeof sel === 'string' ? q(sel) : sel
  if (!els.length) return
  gsap.set(els, from)
  tl.fromTo(els, from, { ...to, immediateRender: false }, at)
}

/**
 * Walking cycle: legs swing in opposite phase for `steps` strides over
 * `duration` units. Repeat + yoyo inside a scrubbed timeline is deterministic,
 * so stepping is locked to scroll position (and reverses walking backwards).
 */
export function walkCycle(tl, rootSel, at, duration, steps, swing = 20) {
  const a = q(`${rootSel} [data-leg="a"]`)
  const b = q(`${rootSel} [data-leg="b"]`)
  if (!a.length) return
  gsap.set([...a, ...b], { transformOrigin: '50% 0%' })
  const per = duration / steps
  const vars = { duration: per, repeat: steps - 1, yoyo: true, ease: 'sine.inOut', immediateRender: false }
  tl.fromTo(a, { rotation: -swing }, { rotation: swing, ...vars }, at)
  tl.fromTo(b, { rotation: swing }, { rotation: -swing, ...vars }, at)
}
