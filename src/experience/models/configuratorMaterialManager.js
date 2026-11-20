/** Clone model materials so one product's finish choices never affect another. */
export function cloneConfiguratorMaterials(source) {
  const object = source.clone(true)
  object.traverse((node) => {
    if (!node.isMesh) return
    node.castShadow = true
    node.receiveShadow = true
    if (Array.isArray(node.material)) node.material = node.material.map((material) => material.clone())
    else if (node.material) node.material = node.material.clone()
    const materials = Array.isArray(node.material) ? node.material : [node.material]
    for (const material of materials) {
      if (material?.color) material.userData.configuratorOriginalColor = material.color.getHex()
    }
  })
  return object
}

/** Apply only the component groups mapped for this product; null restores GLB colors. */
export function applyConfiguratorMaterials(object, components, selections) {
  const componentByMaterial = new Map()
  for (const component of components) {
    for (const materialName of component.materials) componentByMaterial.set(materialName, component)
  }

  object.traverse((node) => {
    if (!node.isMesh) return
    const materials = Array.isArray(node.material) ? node.material : [node.material]
    for (const material of materials) {
      if (!material?.color) continue
      const component = componentByMaterial.get(material.name)
      const selectedColor = component ? selections[component.id] : null
      material.color.set(selectedColor ?? material.userData.configuratorOriginalColor ?? 0xffffff)
      material.needsUpdate = true
    }
  })
}

/** Apply product-specific structural visibility without mutating the cached GLB. */
export function applyConfiguratorStructure(object, product, selections) {
  if (product.slug !== 'linnea-sofa') return
  const cushion = object.getObjectByName('Pillow')
  if (!cushion?.isMesh) throw new Error('Linnea sofa GLB must contain the verified accent cushion mesh.')
  cushion.visible = selections.cushionDetails !== 'disabled'
}

export function applyConfiguratorConfiguration(object, product, selections) {
  applyConfiguratorMaterials(object, product.components, selections)
  applyConfiguratorStructure(object, product, selections)
}

export function disposeConfiguratorMaterials(object) {
  object.traverse((node) => {
    if (!node.isMesh) return
    const materials = Array.isArray(node.material) ? node.material : [node.material]
    materials.forEach((material) => material?.dispose())
  })
}
