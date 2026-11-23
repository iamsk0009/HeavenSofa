import { useSyncExternalStore } from 'react'

export const CRITICAL_HOMEPAGE_MODELS = [
  '/models-optimized/sofa.glb',
  '/models-optimized/accent_chair.glb',
]

export const DEFERRED_HOMEPAGE_MODELS = [
  '/models-optimized/sofa_exploded.glb',
  '/models-optimized/dining_chair.glb',
  '/models-optimized/lounge_chair.glb',
  '/models-optimized/armchair.glb',
  '/models-optimized/shell_chair.glb',
]

export const HOMEPAGE_MODELS = [
  ...CRITICAL_HOMEPAGE_MODELS,
  ...DEFERRED_HOMEPAGE_MODELS,
]

let snapshot = Object.freeze({
  fontsReady: false,
  pageReady: false,
  modelsReady: false,
  scenesReady: false,
  wordmarkReady: false,
  canvasReady: false,
  entered: false,
  error: null,
  attempt: 0,
  progress: 0,
  active: false,
})
const listeners = new Set()
let retryHandler = null
const initialState = {
  fontsReady: false,
  pageReady: false,
  modelsReady: false,
  scenesReady: false,
  wordmarkReady: false,
  canvasReady: false,
  entered: false,
  error: null,
  attempt: 0,
  progress: 0,
  active: false,
}

function update(changes) {
  snapshot = Object.freeze({ ...snapshot, ...changes })
  listeners.forEach((listener) => listener())
}

export const subscribeHomepageReadiness = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
export const getHomepageReadiness = () => snapshot
export function useHomepageReadiness() {
  return useSyncExternalStore(subscribeHomepageReadiness, getHomepageReadiness, getHomepageReadiness)
}

export function markHomepageReady(key) {
  update({ [key]: true })
}

export function reportHomepageAssetProgress(progress, active) {
  if (snapshot.progress === progress && snapshot.active === active) return
  update({ progress, active })
}

export function registerHomepageRetryHandler(handler) {
  retryHandler = handler
}

export function resetHomepageReadiness() {
  snapshot = Object.freeze({ ...initialState, attempt: snapshot.attempt + 1 })
  listeners.forEach((listener) => listener())
}

export function markHomepageEntered() {
  update({ entered: true })
}

export function failHomepage(error) {
  update({ error: error instanceof Error ? error.message : String(error || 'An essential homepage asset failed to load.') })
}

export function retryHomepage() {
  retryHandler?.()
  update({ modelsReady: false, scenesReady: false, canvasReady: false, entered: false, error: null, attempt: snapshot.attempt + 1 })
}

export function homepageIsReady(state = snapshot) {
  return state.fontsReady && state.pageReady && state.modelsReady && state.scenesReady && state.wordmarkReady && state.canvasReady && !state.error
}
