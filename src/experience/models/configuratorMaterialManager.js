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
    if (component.id === 'finish') continue
    for (const materialName of component.materials) componentByMaterial.set(materialName, component)
  }

  object.traverse((node) => {
    if (!node.isMesh) return
    const materials = Array.isArray(node.material) ? node.material : [node.material]
    for (const material of materials) {
      if (!material?.color) continue
      const component = componentByMaterial.get(material.name)
      if (!component) continue
      const selectedColor = selections[component.id]
      if (material.userData.isTerraOak) {
        const isNaturalOak = !selectedColor || selectedColor === '#B4865A' || selectedColor === 'oak'
        const colorMap = {
          '#594438': '#604638', // Walnut
          '#765B45': '#7E6652', // Smoked Oak
        }
        material.color.set(isNaturalOak ? 0xF6E7D2 : (colorMap[selectedColor] ?? selectedColor))
      } else if (material.userData.isOraMaterial) {
        if (material.userData.isOraWood) {
          const isNaturalOak = !selectedColor || selectedColor === '#B4865A' || selectedColor === 'oak'
          const woodMap = {
            '#594438': '#604638', // Walnut
            '#765B45': '#7E6652', // Smoked Oak
          }
          material.color.set(isNaturalOak ? 0xffffff : (woodMap[selectedColor] ?? selectedColor))
          material.roughness = selectedColor === '#594438' ? 0.42 : selectedColor === '#765B45' ? 0.48 : 0.50
        } else if (material.userData.isOraFabric) {
          const isIvory = !selectedColor || selectedColor === '#E8DDC9' || selectedColor === 'ivory'
          material.color.set(isIvory ? 0xF8F4EB : selectedColor)
          material.roughness = 0.95
        }
      } else if (material.userData.isSolMaterial) {
        if (material.name === 'Ceramic') {
          const color = selectedColor ?? material.userData.configuratorOriginalColor ?? '#B86B4B'
          material.color.set(color)
          const finishValue = selections?.finish
          const isMatte = finishValue === '#8C8275' || finishValue === 'matte'
          const isGloss = finishValue === '#EDE6DB' || finishValue === 'gloss'
          material.roughness = isMatte ? 0.85 : isGloss ? 0.16 : 0.44
          if ('clearcoat' in material) {
            material.clearcoat = isGloss ? 0.70 : isMatte ? 0 : 0.25
            material.clearcoatRoughness = isGloss ? 0.10 : isMatte ? 0.50 : 0.25
          }
        } else if (material.name === 'Shade') {
          const color = selectedColor ?? '#E0D4C0'
          material.color.set(color)
          material.roughness = 0.96
        } else if (material.name === 'Hardware') {
          const isBronze = selectedColor === '#5A4532' || selectedColor === 'bronze'
          const isBlackened = selectedColor === '#2C2C2C' || selectedColor === 'blackened'
          if (isBlackened) {
            material.color.set('#1E1E1E')
            material.metalness = 0.82
            material.roughness = 0.40
          } else if (isBronze) {
            material.color.set('#523E2E')
            material.metalness = 0.88
            material.roughness = 0.36
          } else {
            material.color.set('#D8B048')
            material.metalness = 0.94
            material.roughness = 0.28
          }
        }
      } else if (material.userData.isSorenWood) {
        const isNaturalOak = !selectedColor || selectedColor === '#B4865A' || selectedColor === 'oak'
        const isWalnut = selectedColor === '#594438' || selectedColor === 'walnut'
        const isSmoked = selectedColor === '#765B45' || selectedColor === 'smoked'
        const isBlack = selectedColor === '#222120' || selectedColor === '#242220' || selectedColor === 'black-oak'

        if (isNaturalOak) {
          material.color.set(0xFBF4E8)
        } else if (isWalnut) {
          material.color.set('#634937')
        } else if (isSmoked) {
          material.color.set('#7C634E')
        } else if (isBlack) {
          material.color.set('#201F1E')
        } else {
          material.color.set(selectedColor)
        }
      } else if (material.userData.isSorenSeat) {
        const isNatural = !selectedColor || selectedColor === '#D9C7AA' || selectedColor === 'natural-cord'
        const isIvory = selectedColor === '#F4EFE6' || selectedColor === 'ivory'
        const isLinen = selectedColor === '#C8B49A' || selectedColor === 'linen'
        const isTaupe = selectedColor === '#8E8271' || selectedColor === 'taupe'
        const isCharcoal = selectedColor === '#2C2B29' || selectedColor === 'charcoal'

        if (isNatural) {
          material.color.set(0xFFFAF0)
        } else if (isIvory) {
          material.color.set('#FCF8F0')
        } else if (isLinen) {
          material.color.set('#C8B49A')
        } else if (isTaupe) {
          material.color.set('#8E8271')
        } else if (isCharcoal) {
          material.color.set('#2C2B29')
        } else {
          material.color.set(selectedColor)
        }
      } else if (material.userData.isSorenCushion) {
        material.color.set(selections.cushionColor ?? '#8C4F2B')
      } else if (material.userData.isNordCarcass) {
        const color = selectedColor ?? selections.wood ?? '#594438'
        const colorMap = {
          '#594438': '#523D2F',
          '#B4865A': '#C49A6C',
          '#3D3028': '#382B24',
          '#222120': '#1F1E1D',
        }
        material.color.set(colorMap[color] ?? color)
      } else if (material.userData.isNordDoors) {
        const doorColor = selectedColor ?? selections.doors ?? selections.wood ?? '#594438'
        const isChalkWhite = doorColor === '#F2EDE4' || doorColor === 'chalk-white'
        const isSlateGrey = doorColor === '#4E5357' || doorColor === 'slate-grey'
        const colorMap = {
          '#594438': '#523D2F',
          '#B4865A': '#C49A6C',
          '#3D3028': '#382B24',
          '#222120': '#1F1E1D',
          '#F2EDE4': '#F2EDE4',
          '#4E5357': '#4E5357',
        }
        material.color.set(colorMap[doorColor] ?? doorColor)
        if (isChalkWhite || isSlateGrey) {
          material.roughness = 0.70
          material.clearcoat = 0
        }
      } else if (material.userData.isNordHardware) {
        const hwColor = selectedColor ?? selections.hardware ?? '#D4AF37'
        const isBlack = hwColor === '#222222' || hwColor === 'black'
        const isBronze = hwColor === '#5A4532' || hwColor === 'bronze'
        const isSteel = hwColor === '#CCCCCC' || hwColor === 'steel'
        if (isBlack) {
          material.color.set('#202020')
          material.metalness = 0.85
          material.roughness = 0.42
        } else if (isBronze) {
          material.color.set('#544131')
          material.metalness = 0.90
          material.roughness = 0.36
        } else if (isSteel) {
          material.color.set('#CCCCCC')
          material.metalness = 0.96
          material.roughness = 0.22
        } else {
          material.color.set('#D8B048')
          material.metalness = 0.94
          material.roughness = 0.26
        }
      } else if (material.userData.isAlmaHeadboard) {
        const color = selectedColor ?? selections.headboard ?? '#87927A'
        material.color.set(color)
      } else if (material.userData.isAlmaFrame) {
        const color = selectedColor ?? selections.frame ?? '#87927A'
        material.color.set(color)
      } else if (material.userData.isAlmaBedding) {
        const color = selectedColor ?? selections.bedding ?? '#F5F1E9'
        material.color.set(color)
      } else if (material.userData.isAlmaPillow) {
        const color = '#F7F3EA'
        material.color.set(color)
      } else {
        material.color.set(selectedColor ?? material.userData.configuratorOriginalColor ?? 0xffffff)
      }
      material.needsUpdate = true
    }
  })

  // Handle Sol lamp illumination states across all materials (Warm Light, Daylight On, Daylight Off)
  const illuminationMode = (selections?.illumination === 'on' || !selections?.illumination) ? 'warm' : selections?.illumination
  const isWarm = illuminationMode === 'warm'
  const isDaylight = illuminationMode === 'daylight'

  object.traverse((node) => {
    if (!node.isMesh) return
    const materials = Array.isArray(node.material) ? node.material : [node.material]
    for (const material of materials) {
      if (!material) continue
      if (material.userData.isSolMaterial && material.name === 'Bulb') {
        if ('emissive' in material) {
          if (isWarm) {
            material.emissive.set('#FFE2B8')
            material.emissiveIntensity = 2.0
          } else if (isDaylight) {
            // Neutral daylight white (5000K–5500K) clean illumination
            material.emissive.set('#F0F5FF')
            material.emissiveIntensity = 2.4
          } else {
            material.emissive.set(0x000000)
            material.emissiveIntensity = 0
          }
          material.needsUpdate = true
        }
      } else if (material.userData.isSolMaterial && material.name === 'Shade') {
        if ('emissive' in material) {
          if (isWarm) {
            material.emissive.set('#FFD4A2')
            material.emissiveIntensity = 0.36
          } else if (isDaylight) {
            // Neutral clean daylight diffused through woven linen
            material.emissive.set('#E2ECFC')
            material.emissiveIntensity = 0.30
          } else {
            material.emissive.set(0x000000)
            material.emissiveIntensity = 0
          }
          material.needsUpdate = true
        }
      }
    }
  })
}

/** Apply protective surface finish adjustments (roughness & clearcoat sheen). */
export function applyConfiguratorFinish(object, finishValue) {
  if (!finishValue) return
  const isMatte = finishValue === '#8C8275' || finishValue === 'matte'
  const isGloss = finishValue === '#EDE6DB' || finishValue === 'gloss'

  object.traverse((node) => {
    if (!node.isMesh) return
    const materials = Array.isArray(node.material) ? node.material : [node.material]
    for (const material of materials) {
      if (!material) continue
      if (material.userData.isTerraOak) {
        material.roughness = isMatte ? 0.80 : isGloss ? 0.24 : 0.50
        if ('clearcoat' in material) {
          material.clearcoat = isGloss ? 0.48 : isMatte ? 0 : 0.14
          material.clearcoatRoughness = isGloss ? 0.14 : 0.32
        }
        material.needsUpdate = true
      } else if (material.userData.isSolMaterial && material.name === 'Ceramic') {
        const roughness = isMatte ? 0.85 : isGloss ? 0.16 : 0.44
        const clearcoat = isGloss ? 0.70 : isMatte ? 0 : 0.25
        const clearcoatRoughness = isGloss ? 0.10 : isMatte ? 0.50 : 0.25
        material.roughness = roughness
        if ('clearcoat' in material) {
          material.clearcoat = clearcoat
          material.clearcoatRoughness = clearcoatRoughness
        }
        material.needsUpdate = true
      } else if (material.userData.isSorenWood) {
        const isMatte = finishValue === '#8C8275' || finishValue === 'matte'
        const isOil = finishValue === '#EDE6DB' || finishValue === 'oil'
        if (isMatte) {
          material.roughness = 0.88
          if ('clearcoat' in material) {
            material.clearcoat = 0
            material.clearcoatRoughness = 0.5
          }
        } else if (isOil) {
          material.roughness = 0.36
          if ('clearcoat' in material) {
            material.clearcoat = 0.35
            material.clearcoatRoughness = 0.18
          }
        } else {
          // Satin (default)
          material.roughness = 0.48
          if ('clearcoat' in material) {
            material.clearcoat = 0.20
            material.clearcoatRoughness = 0.26
          }
        }
        material.needsUpdate = true
      } else if (material.userData.isNordWood) {
        if (!material.userData.isMatteLacquer) {
          material.roughness = isMatte ? 0.82 : isGloss ? 0.20 : 0.48
          if ('clearcoat' in material) {
            material.clearcoat = isGloss ? 0.55 : isMatte ? 0 : 0.18
            material.clearcoatRoughness = isGloss ? 0.12 : 0.26
          }
        }
        material.needsUpdate = true
      } else if (material.name === 'Wood' || material.name === 'Oak | original grain and finish PBR') {
        const roughness = isMatte ? 0.88 : isGloss ? 0.22 : 0.46
        const clearcoat = isGloss ? 0.5 : isMatte ? 0 : 0.16
        const clearcoatRoughness = isGloss ? 0.15 : 0.35
        material.roughness = roughness
        if ('clearcoat' in material) {
          material.clearcoat = clearcoat
          material.clearcoatRoughness = clearcoatRoughness
        }
        material.needsUpdate = true
      }
    }
  })
}

/** Apply product-specific structural visibility without mutating the cached GLB. */
export function applyConfiguratorStructure(object, product, selections) {
  if (product.slug === 'linnea-sofa') {
    const isVisible = selections.cushionDetails !== 'disabled'
    const cushions = []
    object.traverse((node) => {
      if (node.isMesh && (node.name === 'Pillow' || node.name.startsWith('Pillow_'))) {
        cushions.push(node)
      }
    })
    if (cushions.length === 0) throw new Error('Linnea sofa GLB must contain the verified accent cushion mesh.')
    for (const cushion of cushions) {
      cushion.visible = isVisible
    }
  } else if (product.slug === 'soren-dining-chair') {
    const cushionMesh = object.getObjectByName('SorenCushion')
    if (cushionMesh) {
      cushionMesh.visible = selections.cushion === 'on'
      if (cushionMesh.material) {
        const fabricColor = selections.cushionColor ?? '#8C4F2B'
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
  } else if (product.slug === 'alma-bed') {
    // Pillow visibility: 2 vs 4 pillows
    const showFrontPillows = selections.pillows === '4' || selections.pillows === 4 || !selections.pillows
    if (object.userData.almaFrontPillowsGroup) {
      // In Three.js geometry groups, setting count to 0 or restoring full count
      const g = object.userData.almaFrontPillowsGroup
      g.count = showFrontPillows ? object.userData.almaFrontPillowsCount : 0
    }
    if (object.userData.almaFrontPillowMat) {
      object.userData.almaFrontPillowMat.visible = showFrontPillows
    }

    // Under-bed perimeter shadow-gap lighting
    const underglowGroup = object.getObjectByName('AlmaUnderglow')
    if (underglowGroup) {
      const mode = selections.underglow ?? 'warm'
      const isWarm = mode === 'warm'
      const isNeutral = mode === 'neutral'
      const isOff = mode === 'off'

      underglowGroup.traverse((child) => {
        if (child.isLight) {
          if (isOff) {
            child.intensity = 0
          } else if (isWarm) {
            child.color.set('#FFE2B8')
            child.intensity = 1.4
          } else if (isNeutral) {
            child.color.set('#F4EFE6')
            child.intensity = 1.5
          }
        } else if (child.isMesh && child.material) {
          if (isOff) {
            child.material.visible = false
          } else {
            child.material.visible = true
            if ('emissive' in child.material && child.material.emissive) {
              child.material.emissive.set(isWarm ? '#FFE2B8' : '#F4EFE6')
              child.material.emissiveIntensity = isWarm ? 0.90 : 1.05
            } else if ('color' in child.material && child.material.color) {
              child.material.color.set(isWarm ? '#FFE2B8' : '#F4EFE6')
            }
          }
        }
      })
    }
  } else if (product.slug === 'nord-sideboard') {
    const handleStyle = selections.handleStyle ?? 'pull'
    const isHandlesVisible = handleStyle !== 'none'
    if (object.userData.nordHandleGroup) {
      const g = object.userData.nordHandleGroup
      g.count = isHandlesVisible ? object.userData.nordHandleCount : 0
    }
    if (object.userData.nordHandleMat) {
      object.userData.nordHandleMat.visible = isHandlesVisible
    }
  }
}

export function applyConfiguratorConfiguration(object, product, selections) {
  applyConfiguratorMaterials(object, product.components, selections)
  if (selections.finish) {
    applyConfiguratorFinish(object, selections.finish)
  }
  applyConfiguratorStructure(object, product, selections)
}

export function disposeConfiguratorMaterials(object) {
  object.traverse((node) => {
    if (!node.isMesh) return
    const materials = Array.isArray(node.material) ? node.material : [node.material]
    materials.forEach((material) => material?.dispose())
  })
}
