import gsap from 'gsap'
import { SOFA_PARTS, CUTS, PLANK } from '../illustrations/production/sofaParts'
import { q, reveal } from './illustrationHelpers'
import { fadeIn, revealWords } from './textAnimations'

const P = (name) => `[data-production="${name}"]`
const part = (id) => `[data-part="${id}"]`
const frame = (id) => `#sofa-${id}`

/**
 * Scene 04 scroll-driven construction, integrated into the shared master timeline.
 *
 * Timeline offsets from the scene start:
 * 0-3      Workshop entrance
 * 4-7      Cutting and measured preparation
 * 7-9.8    Frame assembly
 * 9.8-12.2 Foam and upholstery
 * 12.2-15  Finishing and product reveal
 */
export const STEPS = [
  { from: 4, to: 7 },
  { from: 7, to: 9.8 },
  { from: 9.8, to: 12.2 },
  { from: 12.2, to: 15 },
]

export function buildProduction(tl, _o, { start }) {
  const at = (t) => start + t

  // ── sideways journey: forest → workshop ──
  gsap.set(P('root'), { xPercent: 100, visibility: 'visible' })
  tl.fromTo(P('root'), { xPercent: 100 }, { xPercent: 0, duration: 3, ease: 'power2.inOut', immediateRender: false }, at(0))
  tl.fromTo('[data-forest="root"]', { xPercent: 0 }, { xPercent: -100, duration: 3, ease: 'power2.inOut', immediateRender: false }, at(0))

  // ── set the stage ──
  reveal(tl, P('backdrop'), { scale: 0.8, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, duration: 3, ease: 'power2.out' }, at(1))
  reveal(tl, P('bench'), { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: 2.4, ease: 'power3.out' }, at(1.2))
  reveal(tl, P('joiner'), { y: 120, opacity: 0 }, { y: 0, opacity: 1, duration: 2.4, ease: 'power3.out' }, at(1.8))
  reveal(tl, P('tool'), { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.3, ease: 'back.out(1.8)' }, at(2.2))
  fadeIn(tl, P('eyebrow'), at(1.8), 1.4)
  revealWords(tl, P('title'), at(2), 2.6)
  fadeIn(tl, P('steps'), at(3), 1.4)

  // step index: label brightens as its step starts, bar fills during it
  STEPS.forEach(({ from, to }, i) => {
    tl.fromTo(`[data-step="${i}"]`, { opacity: 0.4 }, { opacity: 1, duration: 0.5, immediateRender: false }, at(from))
    reveal(tl, `[data-step-fill="${i}"]`, { scaleX: 0 }, { scaleX: 1, duration: to - from, ease: 'none' }, at(from))
  })

  // parts start as the plank: raw board visible, shaped profile hidden
  SOFA_PARTS.forEach((p) => {
    gsap.set(part(p.id), { x: p.rawPos.x + (p.index - 2) * 38, y: p.rawPos.y - 18, opacity: 0, rotation: p.rawRotation, transformOrigin: '50% 50%' })
    gsap.set(`${part(p.id)} [data-shaped]`, { opacity: 0 })
  })
  SOFA_PARTS.forEach((p) => {
    tl.to(part(p.id), { x: p.rawPos.x, y: p.rawPos.y, opacity: 1, duration: 0.55, ease: 'power2.out' }, at(3 + p.index * 0.12))
  })
  const arm = q(`${P('joiner')} [data-arm]`)
  gsap.set(arm, { transformOrigin: '0% 0%' })

  // ── STEP 1 · CUTTING ─────────────────────────────────────────────
  gsap.set(P('cut-guide'), { opacity: 0 })
  gsap.set(`${P('cut-guide')} path`, { strokeDasharray: '600 600', strokeDashoffset: 600 })
  tl.to(P('cut-guide'), { opacity: 0.7, duration: 0.3, ease: 'power1.out' }, at(3.7))
  tl.to(`${P('cut-guide')} path`, { strokeDashoffset: 0, duration: 0.9, ease: 'power1.inOut' }, at(3.7))
  reveal(tl, P('cutmark'), { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.12 }, at(3.8))
  gsap.set(q(P('kerf')), { opacity: 0 })
  gsap.set(q(P('dust')), { scale: 0, transformOrigin: '50% 50%' })
  gsap.set(P('saw'), { x: CUTS[0] + 60, y: PLANK.y - 40, opacity: 0 })
  tl.to(P('saw'), { opacity: 1, x: CUTS[0], y: PLANK.y, duration: 0.4, ease: 'power2.out' }, at(4))

  const perCut = 0.62
  CUTS.forEach((x, i) => {
    const t = 4.4 + i * perCut
    if (i > 0) tl.to(P('saw'), { x, duration: 0.18, ease: 'power1.inOut' }, at(t - 0.18))
    tl.fromTo(P('saw-stroke'), { x: -14 }, { x: 14, duration: 0.11, repeat: 3, yoyo: true, ease: 'sine.inOut', immediateRender: false }, at(t))
    tl.fromTo(`${P('kerf')}[data-cut="${i}"]`, { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, at(t + 0.15))
    tl.fromTo(`${P('dust')}[data-cut="${i}"]`, { scale: 0 }, { scale: 1, duration: 0.3, stagger: 0.04, ease: 'back.out(3)', immediateRender: false }, at(t + 0.1))
  })
  tl.fromTo(arm, { rotation: -10 }, { rotation: 10, duration: 0.2, repeat: 11, yoyo: true, ease: 'sine.inOut', immediateRender: false }, at(4.4))
  tl.to(P('saw'), { opacity: 0, y: PLANK.y - 60, duration: 0.4, ease: 'power1.in' }, at(6.9))
  tl.to(P('cutmark'), { opacity: 0, duration: 0.4 }, at(6.4))
  tl.to(P('cut-guide'), { opacity: 0, duration: 0.35, ease: 'power1.out' }, at(6.4))
  SOFA_PARTS.forEach((p) => {
    tl.to(part(p.id), { x: p.cutPos.x, duration: 0.5, ease: 'power2.out' }, at(6.5))
  })

  // STEP 02 — FRAME ASSEMBLY
  tl.to(q(P('kerf')), { opacity: 0, duration: 0.3 }, at(7))
  tl.to(q(P('dust')), { opacity: 0, y: 6, duration: 0.6 }, at(7))
  SOFA_PARTS.forEach((p, i) => {
    const t = 7 + i * 0.22
    tl.to(part(p.id), { x: p.explodedPos.x, y: p.explodedPos.y, rotation: 0, duration: 1.6, ease: 'power3.inOut' }, at(t))
    tl.to(`${part(p.id)} [data-raw]`, { opacity: 0, duration: 0.8 }, at(t + 0.7))
    tl.fromTo(`${part(p.id)} [data-shaped]`, { opacity: 0 }, { opacity: 1, duration: 0.8, immediateRender: false }, at(t + 0.6))
  })

  // The shaped members assemble into a full-size, exposed two-seater frame.
  const frameMembers = [
    { id: 'rear-rail', time: 7.42, from: { x: -42, y: -8, rotation: -2, opacity: 0 }, duration: 0.9 },
    { id: 'front-rail', time: 7.56, from: { x: 42, y: 14, rotation: 2, opacity: 0 }, duration: 0.9 },
    { id: 'side-rails', time: 7.72, from: { x: -24, y: 8, rotation: -1, opacity: 0 }, duration: 0.85 },
    { id: 'cross-support', time: 7.86, from: { y: 28, rotation: 2, opacity: 0 }, duration: 0.8 },
    { id: 'rear-leg-left', time: 8.04, from: { y: -30, rotation: -3, opacity: 0 }, duration: 0.82 },
    { id: 'rear-leg-right', time: 8.12, from: { y: -30, rotation: 3, opacity: 0 }, duration: 0.82 },
    { id: 'front-leg-left', time: 8.22, from: { y: 34, rotation: -3, opacity: 0 }, duration: 0.78 },
    { id: 'front-leg-right', time: 8.3, from: { y: 34, rotation: 3, opacity: 0 }, duration: 0.78 },
    { id: 'left-arm-frame', time: 8.42, from: { x: -20, y: 30, rotation: -2, opacity: 0 }, duration: 0.95 },
    { id: 'right-arm-frame', time: 8.56, from: { x: 24, y: 28, rotation: 2, opacity: 0 }, duration: 0.95 },
    { id: 'back-frame', time: 8.7, from: { y: -34, rotation: -2, opacity: 0 }, duration: 1.02 },
  ]
  frameMembers.forEach(({ id, time, from, duration }) => {
    reveal(tl, frame(id), { ...from, transformOrigin: '50% 50%' }, { x: 0, y: 0, rotation: 0, opacity: 1, duration, ease: 'power2.inOut' }, at(time))
  })

  // The small shaped-member study clears as the full-size frame starts joining.
  tl.to('[data-part]', { opacity: 0, duration: 0.48, stagger: 0.035, ease: 'power1.inOut' }, at(7.15))
  gsap.set(q(P('connector')), { strokeDasharray: '100 100' })
  gsap.set(q(P('dowel')), { scale: 0, opacity: 0, transformOrigin: '50% 50%' })
  reveal(tl, P('connector'), { strokeDashoffset: 100, opacity: 0 }, { strokeDashoffset: 0, opacity: 0.22, duration: 0.72, stagger: 0.08, ease: 'power1.inOut' }, at(8.32))
  tl.to(P('connector'), { opacity: 0, duration: 0.35 }, at(8.9))

  const armPanel = SOFA_PARTS.find((p) => p.id === 'armPanel')
  gsap.set(P('plane'), { x: armPanel.explodedPos.x - 60, opacity: 0 })
  tl.to(P('plane'), { opacity: 1, duration: 0.3 }, at(8.5))
  tl.to(P('plane'), { x: armPanel.explodedPos.x + 60, duration: 0.9, ease: 'power1.inOut' }, at(8.6))
  tl.to(P('plane'), { opacity: 0, y: '-=30', duration: 0.4 }, at(9.4))
  reveal(tl, P('shaving'), { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.12, ease: 'back.out(2)' }, at(8.8))
  tl.to(P('shaving'), { opacity: 0, y: 40, duration: 0.6, stagger: 0.05, ease: 'power1.in' }, at(9.5))
  tl.fromTo(arm, { rotation: -6 }, { rotation: 8, duration: 0.3, repeat: 3, yoyo: true, ease: 'sine.inOut', immediateRender: false }, at(8.6))

  // STEP 03 — UPHOLSTERY
  // Foam, fabric and separate cushions build over the completed frame.

  // STEP 04 — FINISHING
  const sofaComponent = (name) => `[data-sofa-component="${name}"]`
  const upholsteryOrder = [
    { name: 'foam-back', time: 9.82, from: { y: 8, opacity: 0, scale: 0.97, transformOrigin: '50% 100%' }, to: { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' } },
    { name: 'foam-seat', time: 9.96, from: { y: 12, opacity: 0, scaleY: 0.92, transformOrigin: '50% 100%' }, to: { y: 0, opacity: 1, scaleY: 1, duration: 0.42, ease: 'power2.out' } },
    { name: 'foam-arms', time: 10.1, from: { scaleX: 0.84, opacity: 0, transformOrigin: '50% 50%' }, to: { scaleX: 1, opacity: 1, duration: 0.45, ease: 'power2.out' } },
    { name: 'backrest', time: 10.12, from: { y: -18, opacity: 0.2, scaleY: 0.94, transformOrigin: '50% 100%' }, to: { y: 0, opacity: 1, scaleY: 1, duration: 0.6, ease: 'power2.out' } },
    { name: 'base', time: 10.24, from: { y: 16, opacity: 0.15, scaleY: 0.88, transformOrigin: '50% 0%' }, to: { y: 0, opacity: 1, scaleY: 1, duration: 0.6, ease: 'power2.out' } },
    { name: 'arm-left', time: 10.36, from: { x: -14, scaleX: 0.84, y: 8, opacity: 0.15, transformOrigin: '50% 85%' }, to: { x: 0, scaleX: 1, y: 0, opacity: 1, duration: 0.62, ease: 'power2.out' } },
    { name: 'arm-right', time: 10.48, from: { x: 14, scaleX: 0.84, y: 8, opacity: 0.15, transformOrigin: '50% 85%' }, to: { x: 0, scaleX: 1, y: 0, opacity: 1, duration: 0.62, ease: 'power2.out' } },
    { name: 'seat-cushion-left', time: 10.62, from: { x: -16, y: 12, rotation: -1.2, opacity: 0.1, transformOrigin: '50% 100%' }, to: { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.62, ease: 'power2.out' } },
    { name: 'seat-cushion-right', time: 10.76, from: { x: 16, y: 12, rotation: 1.2, opacity: 0.1, transformOrigin: '50% 100%' }, to: { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.62, ease: 'power2.out' } },
    { name: 'back-cushion-left', time: 10.9, from: { y: -18, rotation: -0.8, opacity: 0.1, transformOrigin: '50% 100%' }, to: { y: 0, rotation: 0, opacity: 1, duration: 0.62, ease: 'power2.out' } },
    { name: 'back-cushion-right', time: 11.04, from: { y: -18, rotation: 0.8, opacity: 0.1, transformOrigin: '50% 100%' }, to: { y: 0, rotation: 0, opacity: 1, duration: 0.62, ease: 'power2.out' } },
    { name: 'legs', time: 11.16, from: { y: -10, opacity: 0.1, transformOrigin: '50% 0%' }, to: { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power2.out' } },
  ]
  upholsteryOrder.forEach(({ name, time, from, to }) => reveal(tl, sofaComponent(name), from, to, at(time)))
  const fabricWraps = [
    ['backrest', 410, 10.12, 0.6],
    ['base', 430, 10.24, 0.6],
    ['arm-left', 100, 10.36, 0.62],
    ['arm-right', 132, 10.48, 0.62],
    ['seat-left', 195, 10.62, 0.62],
    ['seat-right', 185, 10.76, 0.62],
    ['back-left', 180, 10.9, 0.62],
    ['back-right', 175, 11.04, 0.62],
  ]
  fabricWraps.forEach(([name, width, time, duration]) => {
    tl.fromTo(`#sofa-${name}-wipe-rect`, { attr: { width: 0 } }, { attr: { width }, duration, ease: 'power2.out', immediateRender: false }, at(time))
  })
  tl.to('#sofa-wooden-frame', { opacity: 0, duration: 0.78, ease: 'power1.inOut' }, at(10.9))

  reveal(tl, P('shadow'), { scaleX: 0.72, opacity: 0.04, transformOrigin: '50% 50%' }, { scaleX: 1, opacity: 0.16, duration: 0.9, ease: 'power2.out' }, at(12.2))
  gsap.set(P('cushion'), { opacity: 0, transformOrigin: '50% 85%' })
  tl.to(P('cushion'), { opacity: 1, duration: 0.42, ease: 'power1.out' }, at(9.82))
  tl.fromTo(P('cushion'), { y: -10, scale: 0.985 }, { y: 0, scale: 1, duration: 0.9, ease: 'power2.out', immediateRender: false }, at(12.2))
  reveal(tl, P('sparkle'), { scale: 0, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.15, ease: 'back.out(3)' }, at(13.4))
  reveal(tl, P('label'), { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }, at(13.8))
}
