import { create } from 'zustand'
import { SCENE_RANGES } from '../data/scenes'

/**
 * UI-facing experience state (progress rail, nav theming, overlays).
 * Per-frame 3D values do NOT live here — see animations/rig.js — so scrolling
 * never triggers React re-renders inside the Canvas.
 */
export const useExperienceStore = create((set, get) => ({
  progress: 0,
  activeScene: SCENE_RANGES[0]?.id ?? 'intro',
  lenis: null,
  /** false while an illustrated chapter fully covers the Canvas (render paused) */
  canvasActive: true,
  sofaExplodedTriggered: false,
  sofaExplodedReady: false,
  chairsTriggered: false,

  setProgress: (progress) => set({ progress }),
  setCanvasActive: (canvasActive) => {
    if (get().canvasActive !== canvasActive) set({ canvasActive })
  },
  setActiveScene: (activeScene) => {
    if (get().activeScene !== activeScene) set({ activeScene })
  },
  setLenis: (lenis) => set({ lenis }),
  triggerSofaExploded: () => {
    if (!get().sofaExplodedTriggered) set({ sofaExplodedTriggered: true })
  },
  markSofaExplodedReady: () => {
    if (!get().sofaExplodedReady) set({ sofaExplodedReady: true })
  },
  triggerChairs: () => {
    if (!get().chairsTriggered) set({ chairsTriggered: true })
  },
  resetStreaming: () => set({ sofaExplodedTriggered: false, sofaExplodedReady: false, chairsTriggered: false }),
}))
