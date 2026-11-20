import { PRODUCTS } from './catalog.js'

// Only the seven requested catalogue entries are exposed. Model paths refer to
// existing assets; a null model means the viewer must report that it is absent.
const definitions = {
  'linnea-sofa': {
    model: '/models/sofa.glb',
    components: [
      { id: 'upholstery', label: 'Upholstery', materials: ['Fabric'], kind: 'fabric', defaultColor: '#C8B49A' },
      { id: 'legs', label: 'Legs and frame', materials: ['Wood'], kind: 'wood', defaultColor: '#B4865A' },
      { id: 'accent', label: 'Accent cushion', materials: ['Accent'], kind: 'accent', defaultColor: '#B37355' },
    ],
    meshes: ['BackCushion_L', 'BackCushion_R', 'Arm_L', 'Arm_R', 'Back', 'Base', 'SeatCushion_L', 'SeatCushion_R', 'Leg_BL', 'Leg_BR', 'Leg_FL', 'Leg_FR', 'Pillow'],
  },
  'ora-lounge-chair': {
    model: '/models/accent_chair.glb',
    components: [
      { id: 'upholstery', label: 'Bouclé upholstery', materials: ['Fabric'], kind: 'boucle', defaultColor: '#E8DDC9' },
      { id: 'plinth', label: 'Oak plinth', materials: ['Wood'], kind: 'wood', defaultColor: '#B4865A' },
    ],
    meshes: ['Backrest', 'Plinth', 'Seat', 'SeatBase'],
  },
  'terra-coffee-table': { model: null, components: [], meshes: [], modelNote: 'A procedural round terracotta coffee table exists in the living-room scene, but it does not match Terra’s catalogued solid-oak table design.' },
  'sol-table-lamp': { model: null, components: [], meshes: [], modelNote: 'A procedural floor lamp exists in the living-room scene, but it is not Sol’s table lamp.' },
  'soren-dining-chair': { model: null, components: [], meshes: [], modelNote: 'The available dining_chair.glb is explicitly identified as Ask in its Blender source and Scene 06 manifest, so it is not assigned to Soren.' },
  'alma-bed': { model: null, components: [], meshes: [], modelNote: 'No matching bed model or product-specific model mapping was found in the project.' },
  'nord-sideboard': { model: null, components: [], meshes: [], modelNote: 'No matching sideboard model or product-specific model mapping was found in the project.' },
}

export const CONFIGURATOR_PRODUCTS = Object.freeze(
  Object.entries(definitions).map(([slug, definition]) => {
    const product = PRODUCTS.find((item) => item.slug === slug)
    if (!product) throw new Error(`Configurator product ${slug} is missing from the catalogue.`)
    return Object.freeze({ ...product, ...definition })
  }),
)

export const MATERIAL_OPTIONS = Object.freeze({
  fabric: [
    { id: 'sand', label: 'Sand linen', color: '#C8B49A' },
    { id: 'moss', label: 'Moss linen', color: '#89927B' },
    { id: 'ivory', label: 'Ivory linen', color: '#E8DDC9' },
  ],
  boucle: [
    { id: 'natural', label: 'Natural bouclé', color: '#C8B49A' },
    { id: 'terracotta', label: 'Terracotta bouclé', color: '#C4683F' },
    { id: 'ivory', label: 'Ivory bouclé', color: '#E8DDC9' },
  ],
  wood: [
    { id: 'oak', label: 'Natural oak', color: '#B4865A' },
    { id: 'walnut', label: 'Walnut', color: '#594438' },
    { id: 'smoked', label: 'Smoked oak', color: '#765B45' },
  ],
  accent: [
    { id: 'original-terracotta', label: 'Original terracotta', color: '#B37355' },
    { id: 'terracotta', label: 'Terracotta', color: '#A66F56' },
    { id: 'moss', label: 'Moss', color: '#89927B' },
    { id: 'ivory', label: 'Ivory', color: '#E8DDC9' },
  ],
})

export function createInitialConfiguratorSelections(product) {
  const selections = Object.fromEntries(product.components.map((component) => {
    const options = MATERIAL_OPTIONS[component.kind] ?? []
    const selected = options.find((option) => option.color === component.defaultColor) ?? options[0]
    return [component.id, selected?.color ?? component.defaultColor]
  }))
  if (product.slug === 'linnea-sofa') selections.pillowDetail = 'included'
  return selections
}

export function selectionsForProduct(state, product) {
  return state?.slug === product.slug ? state.values : createInitialConfiguratorSelections(product)
}

export function createResetConfiguratorSelections(product) {
  const selections = Object.fromEntries(product.components.map((component) => [component.id, null]))
  if (product.slug === 'linnea-sofa') selections.pillowDetail = 'included'
  return selections
}

export const CONFIGURATOR_TABS = ['Materials', 'Structure', 'Dimensions', 'Summary']
