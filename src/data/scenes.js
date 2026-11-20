/**
 * Storytelling chapters, in scroll order.
 *
 * `length` is measured in timeline units. The master timeline lays the
 * enabled scenes end-to-end, so the scroll share of a scene is
 * length / TOTAL_UNITS. With all six enabled, the lengths below reproduce the
 * brief's initial distribution (15 / 15 / 18 / 15 / 17 / 20 %).
 *
 * Scenes are switched on as each development phase lands, so the scroll
 * length never contains dead space for unbuilt chapters.
 */
/*
 * `layer`: '3d' scenes render in the persistent Canvas; 'illustration' scenes
 * are opaque SVG/HTML layers on top of it. `opaque` = [from, to] offsets (in
 * units from the scene start) during which the illustration fully covers the
 * Canvas — used to pause WebGL rendering while it can't be seen.
 */
export const SCENES = [
  { id: 'intro',         index: '01', title: 'The doorway',          length: 15, enabled: true,  layer: '3d' },
  { id: 'livingRoom',    index: '02', title: 'The living room',      length: 15, enabled: true,  layer: '3d' },
  { id: 'forest',        index: '03', title: 'From forest to home',  length: 18, enabled: true,  layer: 'illustration', opaque: [3.5, 18] },
  { id: 'production',    index: '04', title: 'Made by hand',         length: 15, enabled: true,  layer: 'illustration', opaque: [0, 15] },
  { id: 'sofaStructure', index: '05', title: 'Under the surface',    length: 22, enabled: true,  layer: '3d' },
  { id: 'chairs',        index: '06', title: 'The chair collection', length: 20, enabled: true,  layer: '3d' },
]

/** Viewport heights of scrolling per timeline unit. Higher = slower story. */
export const VH_PER_UNIT = 24 // doorway ≈ 3.6 screen-heights of scrolling

export const ACTIVE_SCENES = SCENES.filter((s) => s.enabled)

export const TOTAL_UNITS = ACTIVE_SCENES.reduce((sum, s) => sum + s.length, 0)

/** Active scenes with absolute `start` / `end` positions on the master timeline. */
export const SCENE_RANGES = (() => {
  let cursor = 0
  return ACTIVE_SCENES.map((s) => {
    const range = { ...s, start: cursor, end: cursor + s.length }
    cursor += s.length
    return range
  })
})()

/**
 * Whether the 3D Canvas can be seen at a 0–1 scroll progress. A one-unit
 * margin keeps it rendering slightly beyond the cover window, because the
 * scrubbed timeline trails the raw scroll position.
 */
const CANVAS_MARGIN = 1
const OPAQUE_WINDOWS = SCENE_RANGES.filter((s) => s.opaque)
  .map((s) => [s.start + s.opaque[0], s.start + s.opaque[1]])
  .reduce((merged, w) => {
    const last = merged[merged.length - 1]
    if (last && w[0] <= last[1]) last[1] = Math.max(last[1], w[1]) // back-to-back illustrated scenes
    else merged.push([...w])
    return merged
  }, [])

export function canvasVisibleAt(progress) {
  const unit = progress * TOTAL_UNITS
  return !OPAQUE_WINDOWS.some(([a, b]) => unit > a + CANVAS_MARGIN && unit < b - CANVAS_MARGIN)
}

/** Which scene is on screen for a 0–1 scroll progress. */
export function sceneAtProgress(progress) {
  const unit = progress * TOTAL_UNITS
  return (SCENE_RANGES.find((s) => unit < s.end) ?? SCENE_RANGES[SCENE_RANGES.length - 1]).id
}
