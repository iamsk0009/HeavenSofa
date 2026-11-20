import { buildIntro } from './introAnimation'
import { buildLivingRoom } from './livingRoomAnimation'
import { buildForest } from './forestAnimation'
import { buildProduction } from './productionAnimation'
import { buildSofaStructure } from './sofaStructureAnimation'
import { buildChairCollection } from './chairCollectionAnimation'

/**
 * Registry of per-scene timeline builders. Each builder receives the master
 * timeline, the scene's resolved 3D objects and its absolute window
 * { start, length }, and adds camera, object and text tweens inside it.
 * Each scene's choreography lives in its own <scene>Animation.js file.
 */
export const SCENE_BUILDERS = {
  intro: buildIntro,
  livingRoom: buildLivingRoom,
  forest: buildForest,
  production: buildProduction,
  sofaStructure: buildSofaStructure,
  chairs: buildChairCollection,
}
