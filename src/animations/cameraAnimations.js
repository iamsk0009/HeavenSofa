import * as THREE from 'three'
import { rig } from './rig'

/**
 * Shared camera-path engine. A path is a pair of smooth Catmull-Rom curves —
 * one for the eye, one for the look-at target — sampled by arc length, so the
 * camera glides at an even speed instead of stopping at every keyframe.
 * Paths themselves live with each scene's choreography (e.g. INTRO.camera).
 *
 * Rule: each scene's first point must equal the previous scene's last point,
 * so handing over between scenes never jumps.
 */
const toCurve = (points) =>
  new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)), false, 'centripetal')

/**
 * Add a camera move to the master timeline.
 * @param {gsap.core.Timeline} tl
 * @param {{positions:number[][], targets:number[][]}} path
 * @param {{at:number, duration:number, ease?:string, initial?:boolean}} opts
 *   `initial` writes the first frame to the rig immediately (first scene only).
 */
export function addCameraPath(tl, path, { at, duration, ease = 'power1.inOut', initial = false }) {
  const posCurve = toCurve(path.positions)
  const tgtCurve = toCurve(path.targets)
  const state = { t: 0 }
  const v = new THREE.Vector3()

  const apply = () => {
    posCurve.getPointAt(state.t, v)
    Object.assign(rig.camera.position, { x: v.x, y: v.y, z: v.z })
    tgtCurve.getPointAt(state.t, v)
    Object.assign(rig.camera.target, { x: v.x, y: v.y, z: v.z })
  }

  if (initial) apply()
  tl.fromTo(state, { t: 0 }, { t: 1, duration, ease, onUpdate: apply, immediateRender: false }, at)
}
