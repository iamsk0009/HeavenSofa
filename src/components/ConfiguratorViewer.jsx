import { Component, Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { applyConfiguratorConfiguration, cloneConfiguratorMaterials, disposeConfiguratorMaterials } from '../experience/models/configuratorMaterialManager'
import {
  makeConfiguratorBedding,
  makeConfiguratorBoucle,
  makeConfiguratorLinen,
  makeConfiguratorWood,
  makeNordHardware,
  makeNordWood,
  makeTerraOak,
  withRepeat
} from '../experience/models/materials'

function CanvasLoader() {
  return (
    <Html center>
      <div className="pointer-events-none flex flex-col items-center justify-center whitespace-nowrap rounded bg-paper/92 px-5 py-3 shadow-md backdrop-blur-sm" role="status" aria-live="polite">
        <p className="eyebrow text-[0.62rem] text-terracotta">HEAVEN &amp; CO.</p>
        <p className="mt-1 font-serif text-xs text-ink/70">Loading 3D piece...</p>
      </div>
    </Html>
  )
}

class ModelErrorBoundary extends Component {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(err) { console.error('Configurator 3D model loading error:', err) }
  componentDidUpdate(prevProps) {
    if (prevProps.product?.slug !== this.props.product?.slug && this.state.hasError) {
      this.setState({ hasError: false })
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <Html center>
          <div className="flex flex-col items-center justify-center rounded bg-paper/95 p-5 text-center shadow-md">
            <p className="eyebrow text-terracotta">Model Unavailable</p>
            <p className="mt-2 text-xs text-ink/65">Could not load the 3D asset. Check your connection and try again.</p>
          </div>
        </Html>
      )
    }
    return this.props.children
  }
}

function partitionSorenMesh(mesh) {
  if (mesh.userData.isSorenSeparated) return
  mesh.userData.isSorenSeparated = true

  const geom = mesh.geometry
  const posAttr = geom.attributes.position
  const indexAttr = geom.index
  if (!posAttr || !indexAttr) return

  const posArray = posAttr.array
  const indexArray = indexAttr.array
  const numVerts = posAttr.count

  const parent = new Int32Array(numVerts)
  for (let i = 0; i < numVerts; i++) parent[i] = i
  function find(i) {
    let r = i
    while (r !== parent[r]) r = parent[r]
    let c = i
    while (c !== r) {
      let n = parent[c]
      parent[c] = r
      c = n
    }
    return r
  }

  for (let t = 0; t < indexArray.length; t += 3) {
    const a = indexArray[t]
    const b = indexArray[t + 1]
    const c = indexArray[t + 2]
    let ra = find(a); let rb = find(b)
    if (ra !== rb) parent[ra] = rb
    let rc = find(c); rb = find(b)
    if (rb !== rc) parent[rb] = rc
  }

  const isFrameIsland = new Uint8Array(numVerts)
  for (let i = 0; i < numVerts; i++) {
    const y = posArray[i * 3 + 1]
    if (y < -0.05 || y > 0.22) isFrameIsland[find(i)] = 1
  }

  const frameIdx = []
  const seatIdx = []
  for (let t = 0; t < indexArray.length; t += 3) {
    const a = indexArray[t]
    if (isFrameIsland[find(a)]) {
      frameIdx.push(a, indexArray[t + 1], indexArray[t + 2])
    } else {
      seatIdx.push(a, indexArray[t + 1], indexArray[t + 2])
    }
  }

  const reordered = new Uint32Array(indexArray.length)
  reordered.set(frameIdx, 0)
  reordered.set(seatIdx, frameIdx.length)
  geom.setIndex(new THREE.BufferAttribute(reordered, 1))
  geom.clearGroups()
  geom.addGroup(0, frameIdx.length, 0)
  geom.addGroup(frameIdx.length, seatIdx.length, 1)

  const orig = mesh.material
  const frameMat = orig.clone()
  frameMat.name = 'Oak | original grain and finish PBR'
  frameMat.userData.isSorenWood = true
  frameMat.userData.configuratorOriginalColor = 0xffffff

  const seatMat = orig.clone()
  seatMat.name = 'Textile | original woven or leather PBR'
  seatMat.userData.isSorenSeat = true
  seatMat.userData.configuratorOriginalColor = 0xffffff
  mesh.userData.origSeatNormalMap = orig.normalMap ?? null

  mesh.material = [frameMat, seatMat]
}

function createSorenCushionMesh() {
  const shape = new THREE.Shape()
  // Scaled & tailored Wishbone seat contour (reduced footprint by ~10%):
  const frontHalfW = 0.485
  const rearHalfW = 0.360
  const frontZ = 0.540
  const rearZ = -0.240
  const r = 0.080

  shape.moveTo(frontHalfW - r, frontZ)
  shape.quadraticCurveTo(0, frontZ + 0.025, -frontHalfW + r, frontZ)
  shape.quadraticCurveTo(-frontHalfW, frontZ, -frontHalfW, frontZ - r)
  shape.lineTo(-rearHalfW, rearZ + r)
  shape.quadraticCurveTo(-rearHalfW, rearZ, -rearHalfW + r, rearZ)
  shape.quadraticCurveTo(0, rearZ + 0.015, rearHalfW - r, rearZ)
  shape.quadraticCurveTo(rearHalfW, rearZ, rearHalfW, rearZ + r)
  shape.lineTo(frontHalfW, frontZ - r)
  shape.quadraticCurveTo(frontHalfW, frontZ, frontHalfW - r, frontZ)

  // 24 mm visible padded thickness (14 mm body + 2x 5 mm bevel piping):
  const extrudeSettings = {
    steps: 1,
    depth: 0.014,
    bevelEnabled: true,
    bevelThickness: 0.005,
    bevelSize: 0.008,
    bevelOffset: -0.002,
    bevelSegments: 4,
  }

  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings)
  geom.rotateX(Math.PI / 2)
  // Translate vertically to rest directly atop the upper woven cord (Y_bottom = 0.160, Y_top = 0.184):
  geom.translate(0, 0.179, 0.015)
  geom.computeVertexNormals()

  const mat = new THREE.MeshPhysicalMaterial({
    name: 'SorenCushion',
    color: new THREE.Color('#8C4F2B'),
    roughness: 0.44,
    metalness: 0,
    clearcoat: 0.25,
    clearcoatRoughness: 0.35,
    sheen: 0.20,
    sheenColor: new THREE.Color('#E0BA98'),
  })
  mat.userData.isSorenCushion = true

  const mesh = new THREE.Mesh(geom, mat)
  mesh.name = 'SorenCushion'
  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.visible = false
  return mesh
}

function partitionNordMesh(mesh, object) {
  if (mesh.userData.isNordSeparated) return
  mesh.userData.isNordSeparated = true

  const geom = mesh.geometry
  const posAttr = geom.attributes.position
  const indexAttr = geom.index
  if (!posAttr || !indexAttr) return

  const posArray = posAttr.array
  const indexArray = indexAttr.array
  const numVerts = posAttr.count

  const parent = new Int32Array(numVerts)
  for (let i = 0; i < numVerts; i++) parent[i] = i
  function find(i) {
    let r = i; while (r !== parent[r]) r = parent[r];
    let c = i; while (c !== r) { let n = parent[c]; parent[c] = r; c = n; }
    return r;
  }

  for (let t = 0; t < indexArray.length; t += 3) {
    const a = indexArray[t], b = indexArray[t + 1], c = indexArray[t + 2]
    let ra = find(a), rb = find(b); if (ra !== rb) parent[ra] = rb
    let rc = find(c); rb = find(b); if (rb !== rc) parent[rb] = rc
  }

  const isHandleRoot = new Uint8Array(numVerts)
  for (let i = 0; i < numVerts; i++) {
    if (posArray[i * 3 + 2] > 0.250) {
      isHandleRoot[find(i)] = 1
    }
  }

  // Count triangles per non-handle root to uniquely isolate the front door facade (Island #1, 14,692 tris)
  const rootTriCounts = new Map()
  let doorRootId = -1
  let maxTris = 0
  for (let t = 0; t < indexArray.length; t += 3) {
    const root = find(indexArray[t])
    if (!isHandleRoot[root]) {
      const c = (rootTriCounts.get(root) || 0) + 1
      rootTriCounts.set(root, c)
      if (c > maxTris) {
        maxTris = c
        doorRootId = root
      }
    }
  }

  const carcassIdx = []
  const doorIdx = []
  const handleIdx = []

  for (let t = 0; t < indexArray.length; t += 3) {
    const a = indexArray[t], b = indexArray[t + 1], c = indexArray[t + 2]
    const root = find(a)
    if (isHandleRoot[root]) {
      handleIdx.push(a, b, c)
    } else if (root === doorRootId) {
      doorIdx.push(a, b, c)
    } else {
      carcassIdx.push(a, b, c)
    }
  }

  const reordered = new Uint32Array(indexArray.length)
  reordered.set(carcassIdx, 0)
  reordered.set(doorIdx, carcassIdx.length)
  reordered.set(handleIdx, carcassIdx.length + doorIdx.length)

  geom.setIndex(new THREE.BufferAttribute(reordered, 1))
  geom.clearGroups()
  geom.addGroup(0, carcassIdx.length, 0)
  geom.addGroup(carcassIdx.length, doorIdx.length, 1)
  geom.addGroup(carcassIdx.length + doorIdx.length, handleIdx.length, 2)

  const carcassMat = makeNordWood('#594438', 'satin', [3, 2])
  carcassMat.name = 'Carcass'
  carcassMat.userData.isNordCarcass = true

  const doorMat = makeNordWood('#594438', 'satin', [3, 2])
  doorMat.name = 'Doors'
  doorMat.userData.isNordDoors = true

  const handleMat = makeNordHardware('#D4AF37')
  handleMat.name = 'Hardware'
  handleMat.userData.isNordHardware = true

  mesh.material = [carcassMat, doorMat, handleMat]

  if (object) {
    object.userData.nordHandleGroup = geom.groups[2]
    object.userData.nordHandleCount = handleIdx.length
    object.userData.nordHandleMat = handleMat
  }
}

function partitionAlmaMesh(mesh, object) {
  if (mesh.userData.isAlmaSeparated) return
  mesh.userData.isAlmaSeparated = true

  const geom = mesh.geometry
  const posAttr = geom.attributes.position
  const indexAttr = geom.index
  if (!posAttr || !indexAttr) return

  const posArray = posAttr.array
  const indexArray = indexAttr.array
  const numVerts = posAttr.count

  const parent = new Int32Array(numVerts)
  for (let i = 0; i < numVerts; i++) parent[i] = i
  function find(i) {
    let r = i; while (r !== parent[r]) r = parent[r];
    let c = i; while (c !== r) { let n = parent[c]; parent[c] = r; c = n; }
    return r;
  }

  for (let t = 0; t < indexArray.length; t += 3) {
    const a = indexArray[t], b = indexArray[t + 1], c = indexArray[t + 2]
    let ra = find(a), rb = find(b); if (ra !== rb) parent[ra] = rb
    let rc = find(c); rb = find(b); if (rb !== rc) parent[rb] = rc
  }

  const bounds = new Map()
  for (let i = 0; i < numVerts; i++) {
    const r = find(i)
    if (!bounds.has(r)) {
      bounds.set(r, { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity, minZ: Infinity, maxZ: -Infinity })
    }
    const b = bounds.get(r)
    const x = posArray[i * 3], y = posArray[i * 3 + 1], z = posArray[i * 3 + 2]
    if (x < b.minX) b.minX = x; if (x > b.maxX) b.maxX = x
    if (y < b.minY) b.minY = y; if (y > b.maxY) b.maxY = y
    if (z < b.minZ) b.minZ = z; if (z > b.maxZ) b.maxZ = z
  }

  const islandClass = new Map()
  for (const [r, b] of bounds.entries()) {
    const cz = (b.minZ + b.maxZ) / 2
    const cy = (b.minY + b.maxY) / 2
    const cx = (b.minX + b.maxX) / 2
    const szX = b.maxX - b.minX
    const szZ = b.maxZ - b.minZ

    // 1. Pillows check
    if (Math.abs(cx) < 0.65 && b.minY > -0.08 && b.maxY < 0.28 && szX < 0.95 && szZ < 0.45 && b.minZ > -0.85) {
      if (cz < -0.58) {
        islandClass.set(r, 'rearPillow')
        continue
      } else if (cz >= -0.58 && cz < -0.28) {
        islandClass.set(r, 'frontPillow')
        continue
      }
    }

    // 2. Headboard check
    if (b.maxZ < -0.65 || (b.minZ < -0.75 && b.maxY > 0.15)) {
      islandClass.set(r, 'headboard')
      continue
    }

    // 3. Platform Frame check (Left rail, Right rail, Footboard, Base plinth)
    // Include the right longitudinal side rail (which reaches Y=-0.105 at the headboard joint)
    // Exclude right-side and left-side hanging sheet/tassel overhangs so only actual frame rails/plinth are in 'frame'
    const isRightSideRail = b.minX > 0.65 && b.maxX < 0.71 && b.minY < -0.35 && szZ > 0.80
    const isRightOverhang = b.maxX > 0.705 && b.maxZ < 0.85
    const isLeftOverhang = b.minX < -0.750 && b.maxZ < 0.85
    if ((b.maxY < -0.20 && !isRightOverhang && !isLeftOverhang) || isRightSideRail) {
      islandClass.set(r, 'frame')
      continue
    }

    // 4. Omit dangling throw tassel/fringe tufts on the right overhang so no stray fragments remain
    if (b.minX > 0.725 && b.maxY < -0.215 && b.minZ > 0.30 && b.maxZ < 0.75 && szZ < 0.12) {
      islandClass.set(r, 'omit')
      continue
    }

    // 5. Everything else is Bedding (Mattress, Bedsheet, Main Duvet, Hanging Drapes)
    islandClass.set(r, 'bedding')
  }

  const headboardIdx = []
  const frameIdx = []
  const beddingIdx = []
  const rearPillowIdx = []
  const frontPillowIdx = []

  for (let t = 0; t < indexArray.length; t += 3) {
    const a = indexArray[t], b = indexArray[t + 1], c = indexArray[t + 2]
    const cat = islandClass.get(find(a)) || 'frame'
    if (cat === 'omit') continue
    if (cat === 'headboard') headboardIdx.push(a, b, c)
    else if (cat === 'bedding') beddingIdx.push(a, b, c)
    else if (cat === 'rearPillow') rearPillowIdx.push(a, b, c)
    else if (cat === 'frontPillow') frontPillowIdx.push(a, b, c)
    else frameIdx.push(a, b, c)
  }

  const totalIdxLen = headboardIdx.length + frameIdx.length + beddingIdx.length + rearPillowIdx.length + frontPillowIdx.length
  const reordered = new Uint32Array(totalIdxLen)
  let offset = 0
  reordered.set(headboardIdx, offset); offset += headboardIdx.length
  reordered.set(frameIdx, offset); offset += frameIdx.length
  reordered.set(beddingIdx, offset); offset += beddingIdx.length
  reordered.set(rearPillowIdx, offset); offset += rearPillowIdx.length
  reordered.set(frontPillowIdx, offset)

  geom.setIndex(new THREE.BufferAttribute(reordered, 1))
  geom.clearGroups()
  offset = 0
  geom.addGroup(offset, headboardIdx.length, 0); offset += headboardIdx.length
  geom.addGroup(offset, frameIdx.length, 1); offset += frameIdx.length
  geom.addGroup(offset, beddingIdx.length, 2); offset += beddingIdx.length
  geom.addGroup(offset, rearPillowIdx.length, 3); offset += rearPillowIdx.length
  geom.addGroup(offset, frontPillowIdx.length, 4)

  const headboardMat = makeConfiguratorBoucle('#87927A', 12)
  headboardMat.name = 'Headboard'
  headboardMat.userData.isAlmaHeadboard = true

  const frameMat = makeConfiguratorBoucle('#87927A', 12)
  frameMat.name = 'Frame'
  frameMat.userData.isAlmaFrame = true

  const beddingMat = makeConfiguratorBedding('#F5F1E9', 8)
  beddingMat.name = 'Bedding'
  beddingMat.userData.isAlmaBedding = true

  const rearPillowMat = makeConfiguratorBedding('#F7F3EA', 8)
  rearPillowMat.name = 'RearPillows'
  rearPillowMat.userData.isAlmaPillow = true

  const frontPillowMat = makeConfiguratorBedding('#F7F3EA', 8)
  frontPillowMat.name = 'FrontPillows'
  frontPillowMat.userData.isAlmaPillow = true
  frontPillowMat.userData.isAlmaFrontPillow = true

  mesh.material = [headboardMat, frameMat, beddingMat, rearPillowMat, frontPillowMat]

  if (object) {
    object.userData.almaFrontPillowsGroup = geom.groups[4]
    object.userData.almaFrontPillowsCount = frontPillowIdx.length
    object.userData.almaFrontPillowMat = frontPillowMat
  }
}

function createAlmaUnderglow() {
  const group = new THREE.Group()
  group.name = 'AlmaUnderglow'

  const lightColor = new THREE.Color('#FFE2B8')
  const intensity = 1.4
  const distance = 1.6
  const decay = 2

  const leftLight = new THREE.PointLight(lightColor, intensity, distance, decay)
  leftLight.position.set(-0.75, -0.44, 0.0)

  const rightLight = new THREE.PointLight(lightColor, intensity, distance, decay)
  rightLight.position.set(0.75, -0.44, 0.0)

  const footLight = new THREE.PointLight(lightColor, intensity, distance, decay)
  footLight.position.set(0.0, -0.44, 0.85)

  const headLight = new THREE.PointLight(lightColor, intensity, distance, decay)
  headLight.position.set(0.0, -0.44, -0.85)

  group.add(leftLight, rightLight, footLight, headLight)

  const glowMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0x000000),
    emissive: new THREE.Color('#FFE2B8'),
    emissiveIntensity: 0.90,
    transparent: true,
    opacity: 0.40,
    roughness: 1.0,
  })
  glowMat.userData = { isUnderglowMesh: true }

  const glowGeom = new THREE.PlaneGeometry(1.56, 1.84)
  glowGeom.rotateX(-Math.PI / 2)
  glowGeom.translate(0, -0.451, 0)
  const glowMesh = new THREE.Mesh(glowGeom, glowMat)
  group.add(glowMesh)

  return group
}

function LoadedFurniture({ product, selections }) {
  const modelUrl = (product.slug === 'terra-coffee-table' && selections?.geometryVariant === 'refined')
    ? '/models/new/terra_coffee_table_refined.glb'
    : product.model
  const { scene } = useGLTF(modelUrl)
  const furniture = useMemo(() => {
    const object = cloneConfiguratorMaterials(scene)
    if (product.slug === 'linnea-sofa') {
      const pillow = object.getObjectByName('Pillow')
      if (pillow && !object.getObjectByName('Pillow_L')) {
        // Rotate into diamond orientation (45 degrees around local Z face normal)
        const diamondAngle = Math.PI / 4
        pillow.rotation.set(pillow.rotation.x, pillow.rotation.y, diamondAngle)

        const pillow2 = pillow.clone(true)
        pillow2.name = 'Pillow_L'
        if (Array.isArray(pillow.material)) {
          pillow2.material = pillow.material.map((m) => m.clone())
        } else if (pillow.material) {
          pillow2.material = pillow.material.clone()
        }
        pillow2.position.set(-pillow.position.x, pillow.position.y, pillow.position.z)
        pillow2.rotation.set(pillow.rotation.x, -pillow.rotation.y, -diamondAngle)
        pillow2.scale.copy(pillow.scale)
        pillow2.castShadow = true
        pillow2.receiveShadow = true
        if (pillow.parent) {
          pillow.parent.add(pillow2)
        } else {
          object.add(pillow2)
        }
      }

      object.traverse((node) => {
        if (!node.isMesh) return
        const replaceFabric = (material) => {
          if (!['Fabric', 'Accent'].includes(material.name)) return material
          const linen = makeConfiguratorLinen(material.color)
          linen.name = material.name
          linen.userData = { ...material.userData }
          material.dispose()
          return linen
        }
        node.material = Array.isArray(node.material) ? node.material.map(replaceFabric) : replaceFabric(node.material)
      })
    }

    if (product.slug === 'terra-coffee-table') {
      object.traverse((node) => {
        if (!node.isMesh) return

        if (selections?.geometryVariant !== 'refined') {
          // Compute clean longitudinal UV mapping for Terra's original solid oak geometry
          const posAttr = node.geometry?.attributes?.position
          const normAttr = node.geometry?.attributes?.normal
          const uvAttr = node.geometry?.attributes?.uv
          if (posAttr && normAttr && uvAttr) {
            const count = posAttr.count
            for (let i = 0; i < count; i++) {
              const x = posAttr.getX(i)
              const y = posAttr.getY(i)
              const z = posAttr.getZ(i)
              const nx = normAttr.getX(i)
              const ny = normAttr.getY(i)
              const nz = normAttr.getZ(i)

              let u = 0
              let v = 0

              if (y > 0.06 && ny > 0.60) {
                // Tabletop top: relaxed transverse scale and organic grain sway
                v = (x + 0.505) * 0.95
                u = (z + 0.265) * 0.70 + Math.sin(x * 3.2) * 0.038 + Math.cos(x * 6.0 + z * 4.0) * 0.018
              } else if (y > -0.06) {
                // Rounded bullnose edge and perimeter
                if (Math.abs(nz) >= Math.abs(nx)) {
                  // Front and back edges: match top longitudinal grain seamlessly across bullnose
                  v = (x + 0.505) * 0.95
                  u = (y + 0.06) * 1.5 + (z > 0 ? 0.0 : 0.4)
                } else {
                  // Curved ends: smooth transverse transition
                  v = (z + 0.265) * 1.2
                  u = (y + 0.06) * 1.5 + (x > 0 ? 0.0 : 0.4)
                }
              } else {
                // Recessed plinth base (y <= -0.06)
                if (ny < -0.60) {
                  v = (x + 0.505) * 0.95
                  u = (z + 0.265) * 0.70
                } else if (Math.abs(nz) >= Math.abs(nx)) {
                  v = (x + 0.505) * 0.95
                  u = (y + 0.155) * 2.2
                } else {
                  v = (z + 0.265) * 1.2
                  u = (y + 0.155) * 2.2
                }
              }
              uvAttr.setXY(i, u, v)
            }
            uvAttr.needsUpdate = true
            node.geometry.computeVertexNormals()
          }
        }

        const oakMat = makeTerraOak(selections?.wood ?? '#B4865A', selections?.finish ?? 'satin')
        oakMat.name = 'Wood'
        node.material?.dispose?.()
        node.material = oakMat
      })
    }

    if (product.slug === 'nord-sideboard') {
      object.traverse((node) => {
        if (!node.isMesh) return
        partitionNordMesh(node, object)
      })
    }

    if (product.slug === 'alma-bed') {
      object.traverse((node) => {
        if (!node.isMesh) return
        partitionAlmaMesh(node, object)
      })
      if (!object.getObjectByName('AlmaUnderglow')) {
        object.add(createAlmaUnderglow())
      }
    }

    if (product.slug === 'ora-lounge-chair') {
      object.traverse((node) => {
        if (!node.isMesh) return
        if (node.material) {
          const mats = Array.isArray(node.material) ? node.material : [node.material]
          for (const mat of mats) {
            mat.userData.isOraMaterial = true
            mat.userData.isOraFabric = (node.name === 'Fabric')
            mat.userData.isOraWood = (node.name === 'Wood')
            if (node.name === 'Fabric') {
              mat.roughness = 0.95
            } else if (node.name === 'Wood') {
              mat.roughness = 0.50
            }
          }
        }
      })
    }

    if (product.slug === 'sol-table-lamp') {
      object.traverse((node) => {
        if (!node.isMesh) return
        if (node.name === 'Ceramic') {
          const orig = node.material
          const ceramicMat = new THREE.MeshPhysicalMaterial({
            name: 'Ceramic',
            color: orig.color ? orig.color.clone() : new THREE.Color('#B86B4B'),
            map: orig.map ?? null,
            normalMap: orig.normalMap ?? null,
            roughnessMap: orig.roughnessMap ?? null,
            roughness: 0.44,
            metalness: 0,
            clearcoat: 0.25,
            clearcoatRoughness: 0.25,
          })
          ceramicMat.userData.isSolMaterial = true
          ceramicMat.userData.configuratorOriginalColor = ceramicMat.color.getHex()
          orig.dispose?.()
          node.material = ceramicMat
        } else if (node.name === 'Shade') {
          const orig = node.material
          const linenTex = makeConfiguratorLinen(orig.color ?? '#E0D4C0', 14)
          const shadeMat = new THREE.MeshPhysicalMaterial({
            name: 'Shade',
            color: orig.color ? orig.color.clone() : new THREE.Color('#E0D4C0'),
            map: orig.map ?? null,
            normalMap: withRepeat(linenTex.normalMap, [18, 10]),
            normalScale: new THREE.Vector2(0.24, 0.24),
            roughness: 0.96,
            metalness: 0,
            sheen: 0.45,
            sheenRoughness: 0.85,
            sheenColor: new THREE.Color('#FFF6E8'),
            side: THREE.DoubleSide,
            emissive: new THREE.Color('#FFD4A2'),
            emissiveIntensity: 0.35,
          })
          shadeMat.userData.isSolMaterial = true
          shadeMat.userData.configuratorOriginalColor = shadeMat.color.getHex()
          orig.dispose?.()
          node.material = shadeMat
        } else if (node.name === 'Hardware') {
          node.material.userData.isSolMaterial = true
          node.material.metalness = 0.94
          node.material.roughness = 0.28
        } else if (node.name === 'Bulb') {
          node.material.userData.isSolMaterial = true
          node.material.roughness = 0.18
        }
      })
    }

    if (product.slug === 'soren-dining-chair') {
      object.traverse((node) => {
        if (!node.isMesh) return
        partitionSorenMesh(node)
      })
      if (!object.getObjectByName('SorenCushion')) {
        const cushion = createSorenCushionMesh()
        object.add(cushion)
      }
    }

    object.updateMatrixWorld(true)
    const bounds = new THREE.Box3().setFromObject(object)
    const center = bounds.getCenter(new THREE.Vector3())
    const size = bounds.getSize(new THREE.Vector3())
    const scale = 2.35 / Math.max(size.x, size.y, size.z, 0.001)
    object.scale.setScalar(scale)
    object.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale)
    return object
  }, [scene, product.slug, selections?.geometryVariant])

  useEffect(() => () => {
    disposeConfiguratorMaterials(furniture)
  }, [furniture])

  useEffect(() => {
    if (product.slug === 'soren-dining-chair') {
      const cushionMesh = furniture.getObjectByName('SorenCushion')
      if (cushionMesh) {
        cushionMesh.visible = selections?.cushion === 'on'
        if (cushionMesh.material) {
          const fabricColor = selections?.cushionColor ?? '#8C4F2B'
          cushionMesh.material.color.set(fabricColor)
          if (fabricColor === '#8C4F2B' || fabricColor === 'cognac') {
            cushionMesh.material.roughness = 0.44
            cushionMesh.material.clearcoat = 0.25
            cushionMesh.material.sheen = 0.20
          } else if (fabricColor === '#535B49' || fabricColor === 'olive') {
            cushionMesh.material.roughness = 0.72
            cushionMesh.material.clearcoat = 0
            cushionMesh.material.sheen = 0.65
          } else {
            cushionMesh.material.roughness = 0.88
            cushionMesh.material.clearcoat = 0
            cushionMesh.material.sheen = 0.35
          }
          cushionMesh.material.needsUpdate = true
        }
      }
    }
    applyConfiguratorConfiguration(furniture, product, selections)
  }, [furniture, product, selections])

  return <primitive object={furniture} dispose={null} />
}

function CameraRig({ command, product }) {
  const controls = useRef(null)
  const destination = useRef(null)
  const isTerra = product?.slug === 'terra-coffee-table'
  const isSol = product?.slug === 'sol-table-lamp'
  const isSoren = product?.slug === 'soren-dining-chair'
  const isAlma = product?.slug === 'alma-bed'
  const targetY = product?.cameraTarget?.[1] ?? 0.9
  const prevSlugRef = useRef(null)

  useEffect(() => {
    if (controls.current) {
      if (prevSlugRef.current !== product?.slug) {
        prevSlugRef.current = product?.slug
        controls.current.target.set(0, targetY, 0)
        if ((isTerra || isSol || isSoren || isAlma) && product?.cameraPosition) {
          controls.current.object.position.set(...product.cameraPosition)
        }
        controls.current.update()
      }
    }
  }, [targetY, isTerra, isSol, isSoren, isAlma, product?.cameraPosition, product?.slug])

  useEffect(() => {
    if (!command || !controls.current) return
    const control = controls.current
    destination.current = null
    const target = control.target
    const distance = control.object.position.distanceTo(target) || (isTerra ? 3.7 : isSol ? 5.8 : isAlma ? 4.0 : 4.5)

    let positions
    if (isTerra) {
      positions = {
        front: [0, distance * 0.38, distance * 0.92],
        side: [distance * 0.92, distance * 0.35, 0],
        rear: [0, distance * 0.38, -distance * 0.92],
        reset: product.cameraPosition ? [...product.cameraPosition] : [2.15, 1.65, 2.75],
      }
    } else if (isSol) {
      positions = {
        front: [0, distance * 0.12, distance * 0.98],
        side: [distance * 0.98, distance * 0.12, 0],
        rear: [0, distance * 0.12, -distance * 0.98],
        reset: product.cameraPosition ? [...product.cameraPosition] : [3.2, 1.85, 4.8],
      }
    } else if (isSoren) {
      positions = {
        front: [0, distance * 0.22, distance * 0.97],
        side: [distance * 0.97, distance * 0.18, 0],
        rear: [0, distance * 0.22, -distance * 0.97],
        reset: product.cameraPosition ? [...product.cameraPosition] : [2.8, 1.85, 3.8],
      }
    } else if (isAlma) {
      positions = {
        front: [0, distance * 0.44, distance * 0.88],
        side: [distance * 0.88, distance * 0.42, 0],
        rear: [0, distance * 0.44, -distance * 0.88],
        reset: product.cameraPosition ? [...product.cameraPosition] : [2.35, 2.25, 2.75],
      }
    } else {
      positions = {
        front: [0, 0.22, distance],
        side: [distance, 0.18, 0],
        rear: [0, 0.22, -distance],
        reset: [distance * 0.72, distance * 0.42, distance * 0.9],
      }
    }

    if (positions[command.type]) {
      const [x, y, z] = positions[command.type]
      if (command.type === 'reset' && (isTerra || isSol || isSoren || isAlma) && product?.cameraPosition) {
        destination.current = new THREE.Vector3(...product.cameraPosition)
      } else {
        destination.current = new THREE.Vector3(target.x + x, target.y + y, target.z + z)
      }
    }
    if (command.type === 'zoom-in') control.dollyIn(1.2)
    if (command.type === 'zoom-out') control.dollyOut(1.2)
    control.update()
  }, [command, isTerra, isSol, isSoren, isAlma, product?.cameraPosition])

  useFrame((_, delta) => {
    if (!destination.current || !controls.current) return
    const camera = controls.current.object
    camera.position.lerp(destination.current, 1 - Math.exp(-6 * delta))
    controls.current.update()
    if (camera.position.distanceTo(destination.current) < 0.015) destination.current = null
  })

  return <OrbitControls ref={controls} makeDefault target={[0, targetY, 0]} enableDamping dampingFactor={0.08} minDistance={isTerra ? 1.4 : isSol ? 1.5 : isSoren ? 1.4 : 1.7} maxDistance={8} maxPolarAngle={Math.PI * 0.49} />
}

export default function ConfiguratorViewer({ product, selections, command }) {
  const isTerra = product?.slug === 'terra-coffee-table'
  const isSol = product?.slug === 'sol-table-lamp'
  const isSoren = product?.slug === 'soren-dining-chair'
  const isAlma = product?.slug === 'alma-bed'
  const solIllumination = isSol ? ((selections?.illumination === 'on' || !selections?.illumination) ? 'warm' : selections?.illumination) : null

  if (!product?.model) {
    return <div className="configurator-no-model">
      <img src={product.image} alt={`${product.name} product reference`} />
      <div><p className="eyebrow text-terracotta">No verified product model</p><p className="mt-2 max-w-sm text-sm leading-relaxed text-ink/65">{product.modelNote ?? 'The catalogue image is shown for reference; no substitute model or customization preview is used.'}</p></div>
    </div>
  }

  const initialCameraPos = (isTerra || isSol || isSoren || isAlma) && product?.cameraPosition ? product.cameraPosition : [3.1, 2.25, 4.2]

  return <div className="configurator-canvas" aria-label={`${product.name} interactive 3D model`}>
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: initialCameraPos, fov: 37, near: 0.05, far: 80 }} gl={{ antialias: true, powerPreference: 'high-performance' }} onCreated={({ gl }) => { gl.toneMapping = THREE.NeutralToneMapping; gl.toneMappingExposure = 1.08 }}>
      <color attach="background" args={['#DED8CC']} />
      <hemisphereLight skyColor="#fffdf8" groundColor="#9a8d79" intensity={isTerra ? 1.55 : 1.45} />
      <ambientLight intensity={isTerra ? 0.42 : 0.35} />
      <directionalLight castShadow position={[4, 6, 4]} intensity={3.2} shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-near={0.1} shadow-camera-far={18} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-normalBias={0.015} />
      <directionalLight position={[-4, 3, -2]} intensity={isTerra ? 1.4 : 1.15} color="#f0dfc5" />
      {isTerra && <>
        {/* Soft studio rim light to accentuate rounded bullnose tabletop silhouette */}
        <directionalLight position={[-2.5, 2.8, -3.2]} intensity={1.1} color="#fef5ea" />
        {/* Gentle low studio fill to illuminate sculptural recessed plinth base */}
        <directionalLight position={[0, 0.4, 2.2]} intensity={0.55} color="#ede6dc" />
        {/* Grounding contact shadow under plinth base and tabletop overhang */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.006, 0]} receiveShadow>
          <planeGeometry args={[8, 8]} /><shadowMaterial transparent opacity={0.36} />
        </mesh>
      </>}
      {isSol && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} receiveShadow>
          <planeGeometry args={[3.2, 3.2]} /><shadowMaterial transparent opacity={0.38} />
        </mesh>
      )}
      {solIllumination === 'warm' && <>
        {/* 2700K warm incandescent point light radiating inside the shade */}
        <pointLight position={[0, 1.48, 0]} intensity={3.2} distance={7} decay={2} color="#FFE2BC" castShadow />
        {/* Soft downward warm spotlight illuminating the ceramic base and floor */}
        <spotLight position={[0, 1.48, 0]} target-position={[0, 0, 0]} angle={0.88} penumbra={0.7} intensity={2.2} distance={5.5} decay={2} color="#FFDAA8" castShadow />
        {/* Subtle warm bounce pool under the base */}
        <pointLight position={[0, 0.20, 0]} intensity={0.75} distance={2.2} decay={2} color="#FFD199" />
      </>}
      {solIllumination === 'daylight' && <>
        {/* 5000K–5500K neutral daylight point light radiating inside the shade */}
        <pointLight position={[0, 1.48, 0]} intensity={3.4} distance={7} decay={2} color="#EDF4FF" castShadow />
        {/* Clean downward neutral spotlight illuminating the ceramic base and floor */}
        <spotLight position={[0, 1.48, 0]} target-position={[0, 0, 0]} angle={0.88} penumbra={0.7} intensity={2.3} distance={5.5} decay={2} color="#EBF2FA" castShadow />
        {/* Subtle clean bounce pool under the base */}
        <pointLight position={[0, 0.20, 0]} intensity={0.65} distance={2.2} decay={2} color="#E2ECF7" />
      </>}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.012, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} /><shadowMaterial transparent opacity={0.18} />
      </mesh>
      <ModelErrorBoundary product={product}>
        <Suspense fallback={<CanvasLoader />}>
          <LoadedFurniture key={`${product.slug}-${selections?.geometryVariant ?? 'orig'}`} product={product} selections={selections} />
        </Suspense>
      </ModelErrorBoundary>
      <CameraRig command={command} product={product} />
    </Canvas>
  </div>
}

for (const modelPath of ['/models/sofa.glb', '/models/accent_chair.glb', '/models/new/sol_table_lamp.glb', '/models/new/terra_coffee_table_refined.glb', '/models/new/soren_dining_chair.glb']) useGLTF.preload(modelPath)
