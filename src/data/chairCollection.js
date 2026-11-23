/**
 * Scene 06 — the chair collection. Five distinct chairs, all built in
 * Blender (tools/blender/build_collection.py, plus Ora from build_chair.py).
 *
 * `x`/`z` are offsets from the platform centre (metres); `ry` = yaw (rad),
 * angled gently toward the middle of the arc. `mats` maps the GLB's
 * placeholder material names to site PBR material factories (by key in
 * models/ChairModel.jsx).
 */
export const PLATFORM = { rx: 5.2, rz: 2.3, height: 0.1 }

export const CHAIRS = [
  {
    id: 'ask',
    name: 'Ask',
    kind: 'Dining chair',
    material: 'Solid oak',
    url: '/models-optimized/dining_chair.glb',
    x: -3.6, z: -0.35, ry: 0.42,
    mats: { Oak: 'oak' },
  },
  {
    id: 'ora',
    name: 'Ora',
    kind: 'Lounge chair',
    material: 'Terracotta bouclé',
    url: '/models-optimized/accent_chair.glb',
    x: -1.8, z: 0.2, ry: 0.22,
    mats: { Fabric: 'boucle', Wood: 'oak' },
  },
  {
    id: 'linnea',
    name: 'Linnea',
    kind: 'Slipper chair',
    material: 'Natural linen, oak',
    url: '/models-optimized/lounge_chair.glb',
    x: 0, z: 0.45, ry: 0,
    mats: { Fabric: 'linen', Oak: 'oak' },
  },
  {
    id: 'tor',
    name: 'Tor',
    kind: 'Armchair',
    material: 'Walnut, saddle leather',
    url: '/models-optimized/armchair.glb',
    x: 1.8, z: 0.2, ry: -0.22,
    mats: { Walnut: 'walnut', Leather: 'leather' },
  },
  {
    id: 'vale',
    name: 'Vale',
    kind: 'Shell chair',
    material: 'Forest wool, black steel',
    url: '/models-optimized/shell_chair.glb',
    x: 3.6, z: -0.35, ry: -0.42,
    mats: { Wool: 'wool', BlackSteel: 'steel' },
  },
]
