import gsap from 'gsap'

/**
 * Scroll-scrubbed text helpers. Every helper uses fromTo with explicit start
 * values so the state is fully determined by scroll position — scrolling
 * backwards replays the exact inverse.
 */
const q = (sel) => gsap.utils.toArray(sel)

export function fadeIn(tl, sel, at, duration = 2, vars = {}) {
  const els = q(sel)
  if (!els.length) return
  tl.fromTo(els, { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration, ease: 'power2.out', ...vars }, at)
}

export function fadeOut(tl, sel, at, duration = 2, vars = {}) {
  const els = q(sel)
  if (!els.length) return
  tl.fromTo(
    els,
    { autoAlpha: 1, y: 0 },
    { autoAlpha: 0, y: -32, duration, ease: 'power1.in', immediateRender: false, ...vars },
    at,
  )
}

/** Masked word-by-word reveal for <SplitWords> markup ([data-word]). */
export function revealWords(tl, containerSel, at, duration = 2.5) {
  const container = q(containerSel)
  const words = q(`${containerSel} [data-word]`)
  if (!words.length) return
  // Staggered fromTo only immediate-renders the first target, so hide all
  // words explicitly — otherwise later words flash before their scroll point.
  gsap.set(container, { autoAlpha: 0 })
  gsap.set(words, { yPercent: 110 })
  tl.fromTo(container, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1, immediateRender: false }, at)
  tl.fromTo(
    words,
    { yPercent: 110 },
    { yPercent: 0, duration, ease: 'power3.out', stagger: duration / (words.length * 3) },
    at,
  )
}

export function hideWords(tl, containerSel, at, duration = 2) {
  const words = q(`${containerSel} [data-word]`)
  if (!words.length) return
  tl.fromTo(
    words,
    { yPercent: 0 },
    // -140 (not -110) so descenders clear the mask's bottom padding
    { yPercent: -140, duration, ease: 'power2.in', stagger: duration / (words.length * 3), immediateRender: false },
    at,
  )
}
