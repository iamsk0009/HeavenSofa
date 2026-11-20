import { useLayoutEffect } from 'react'
import { gsap, ScrollTrigger } from '../animations/gsapSetup'
import { createMasterTimeline } from '../animations/masterTimeline'
import { ACTIVE_SCENES, canvasVisibleAt, sceneAtProgress } from '../data/scenes'
import { useExperienceStore } from '../store/useExperienceStore'
import IntroScene from './scenes/IntroScene'
import LivingRoomScene from './scenes/LivingRoomScene'
import ForestScene from './scenes/ForestScene'
import ProductionScene from './scenes/ProductionScene'
import SofaStructureScene from './scenes/SofaStructureScene'
import ChairCollectionScene from './scenes/ChairCollectionScene'

const SCENE_COMPONENTS = {
  intro: IntroScene,
  livingRoom: LivingRoomScene,
  forest: ForestScene,
  production: ProductionScene,
  sofaStructure: SofaStructureScene,
  chairs: ChairCollectionScene,
}

/**
 * Mounts every enabled scene, then — once they have all registered their
 * refs — builds the single scroll-driven master timeline.
 */
export default function SceneManager() {
  useLayoutEffect(() => {
    const { setProgress, setActiveScene, setCanvasActive } = useExperienceStore.getState()

    const ctx = gsap.context(() => {
      createMasterTimeline({
        trigger: '#story',
        onUpdate: (progress) => {
          setProgress(progress)
          setActiveScene(sceneAtProgress(progress))
          setCanvasActive(canvasVisibleAt(progress))
        },
      })
    })
    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [])

  return ACTIVE_SCENES.map(({ id }) => {
    const Scene = SCENE_COMPONENTS[id]
    return Scene ? <Scene key={id} /> : null
  })
}
