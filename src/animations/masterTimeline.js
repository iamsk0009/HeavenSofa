import gsap from 'gsap'
import { SCENE_RANGES, TOTAL_UNITS } from '../data/scenes'
import { SCENE_BUILDERS } from './sceneAnimations'
import { getSceneRefs, resolveRefs } from './sceneRegistry'

/**
 * The single source of truth for the storytelling experience.
 *
 * One GSAP timeline, TOTAL_UNITS long, scrubbed by one ScrollTrigger spanning
 * the #story element. Every camera move, 3D object tween and HTML/SVG text
 * animation is a child of this timeline, so they can never drift apart, and
 * reversing the scroll reverses everything.
 */
export function createMasterTimeline({ trigger, onUpdate }) {
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    // Scrub smoothing makes the playhead trail raw scroll. Drive chapter UI
    // and the Canvas gate from the rendered playhead so neither gets ahead
    // of the scene being shown during the Scene 04 → 05 handoff.
    onUpdate: () => onUpdate?.(tl.progress()),
    scrollTrigger: {
      trigger,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.9, // light catch-up smoothing on top of Lenis
      invalidateOnRefresh: true,
    },
  })

  for (const scene of SCENE_RANGES) {
    tl.addLabel(scene.id, scene.start)
    const build = SCENE_BUILDERS[scene.id]
    if (!build) {
      // An enabled scene without a builder silently freezes the story on the
      // previous scene (nothing reveals the next layer), so make it loud.
      if (import.meta.env.DEV) {
        console.error(
          `[masterTimeline] scene "${scene.id}" is enabled in data/scenes.js but has no builder in SCENE_BUILDERS.` +
            ' If the source registers it, the dev server is serving a stale module — restart `npm run dev`.',
        )
      }
      continue
    }
    // 3D scenes register refs; illustrated (DOM/SVG-only) scenes have none.
    const refs = getSceneRefs(scene.id)
    if (scene.layer === '3d' && !refs) {
      if (import.meta.env.DEV) console.warn(`[masterTimeline] 3D scene "${scene.id}" registered no refs`)
      continue
    }
    build(tl, refs ? resolveRefs(refs) : {}, { start: scene.start, length: scene.length })
  }

  // Pad so timeline duration === TOTAL_UNITS exactly (scroll % ↔ unit mapping).
  tl.set({}, {}, TOTAL_UNITS)
  return tl
}
