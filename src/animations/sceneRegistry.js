import { useLayoutEffect } from 'react'

/**
 * 3D scenes register the refs they want animated (door hinge, lights,
 * furniture groups...). The master timeline reads them when it is built.
 *
 * React runs child layout effects before the parent's, so by the time
 * SceneManager builds the timeline every scene below it has registered.
 */
const registry = new Map()

export const getSceneRefs = (id) => registry.get(id)

/** `refs` is an object of React refs; values are dereferenced at build time. */
export function useRegisterScene(id, refs) {
  useLayoutEffect(() => {
    registry.set(id, refs)
    return () => registry.delete(id)
  }, [id, refs])
}

/** Resolve { door: ref, light: ref } → { door: Object3D, light: Light }. */
export function resolveRefs(refs) {
  // values may be single refs or arrays of refs (e.g. one per chair)
  const deref = (r) => (Array.isArray(r) ? r.map(deref) : r.current)
  return Object.fromEntries(Object.entries(refs).map(([k, r]) => [k, deref(r)]))
}
