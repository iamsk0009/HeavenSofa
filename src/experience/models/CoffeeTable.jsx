import { useMemo } from 'react'
import * as THREE from 'three'
import { ContactShadows } from '@react-three/drei'
import { makeClay, makeGlaze } from '../materials/furnitureMaterials'

/**
 * Round terracotta coffee table: a 45 mm glazed top with a full bullnose
 * edge on a waisted, sculptural clay pedestal. Both parts are lathed from
 * 2D profiles, which gives perfectly smooth turned forms.
 *
 * Origin: floor level, centred. Ø 0.92 m × 0.405 m H.
 * `children` are placed on the table top (decor travels with the table).
 */
export const COFFEE_TABLE = { radius: 0.46, topThickness: 0.045, height: 0.405 }

const SEGMENTS = 96

function topProfile() {
  const { radius: R, topThickness: T } = COFFEE_TABLE
  const r = T / 2
  const pts = [new THREE.Vector2(0, 0), new THREE.Vector2(R - r, 0)]
  for (let i = 1; i < 16; i++) {
    const a = -Math.PI / 2 + (Math.PI * i) / 16 // bullnose: half-round edge
    pts.push(new THREE.Vector2(R - r + Math.cos(a) * r, r + Math.sin(a) * r))
  }
  pts.push(new THREE.Vector2(R - r, T), new THREE.Vector2(0, T))
  return pts
}

function pedestalProfile(h) {
  // smooth silhouette: wide foot → slim waist → flared neck under the top
  const silhouette = new THREE.SplineCurve(
    [
      [0.25, 0.012], [0.235, 0.05], [0.18, 0.13], [0.15, 0.2], [0.165, 0.28], [0.205, h - 0.02], [0.215, h],
    ].map(([x, y]) => new THREE.Vector2(x, y)),
  ).getPoints(48)
  return [new THREE.Vector2(0, 0), new THREE.Vector2(0.24, 0), ...silhouette, new THREE.Vector2(0, h)]
}

export default function CoffeeTable({ ref, children, ...props }) {
  const baseH = COFFEE_TABLE.height - COFFEE_TABLE.topThickness

  const { topGeo, baseGeo, glaze, clay } = useMemo(
    () => ({
      topGeo: new THREE.LatheGeometry(topProfile(), SEGMENTS),
      baseGeo: new THREE.LatheGeometry(pedestalProfile(baseH), SEGMENTS),
      glaze: makeGlaze(),
      clay: makeClay(),
    }),
    [baseH],
  )

  return (
    <group ref={ref} name="coffee-table" {...props}>
      <ContactShadows position-y={0.02} scale={1.6} far={0.4} blur={2.4} opacity={0.5} resolution={256} frames={1} color="#3A3127" />
      <mesh name="pedestal" geometry={baseGeo} material={clay} castShadow receiveShadow />
      <mesh name="top" geometry={topGeo} material={glaze} position-y={baseH} castShadow receiveShadow />
      <group name="table-top-decor" position-y={COFFEE_TABLE.height}>
        {children}
      </group>
    </group>
  )
}
