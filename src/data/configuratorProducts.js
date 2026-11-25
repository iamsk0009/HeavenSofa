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
    cameraTarget: [0, 0.9, 0],
  },
  'ora-lounge-chair': {
    model: '/models/accent_chair.glb',
    components: [
      { id: 'upholstery', label: 'Bouclé upholstery', materials: ['Fabric'], kind: 'boucle', defaultColor: '#E8DDC9' },
      { id: 'plinth', label: 'Oak plinth', materials: ['Wood'], kind: 'wood', defaultColor: '#B4865A' },
    ],
    meshes: ['Sculptural cocoon body tailored in tactile bouclé', 'Four-star splayed European oak swivel base'],
    cameraTarget: [0, 0.9, 0],
  },
  'terra-coffee-table': {
    model: '/models/new/terra_coffee_table.glb',
    components: [
      { id: 'wood', label: 'Solid European oak', materials: ['Wood'], kind: 'wood', defaultColor: '#B4865A' },
      { id: 'finish', label: 'Protective finish', materials: ['Wood'], kind: 'finish', defaultColor: '#BDB3A4' },
    ],
    meshes: ['Tabletop (softly eased bullnose edge)', 'Sculptural flared oak pedestal base'],
    cameraTarget: [0, 0.36, 0],
    cameraPosition: [2.15, 1.65, 2.75],
  },
  'sol-table-lamp': {
    model: '/models/new/sol_table_lamp.glb',
    components: [
      { id: 'ceramic', label: 'Ceramic base', materials: ['Ceramic'], kind: 'ceramic', defaultColor: '#B86B4B' },
      { id: 'finish', label: 'Ceramic surface finish', materials: ['Ceramic'], kind: 'ceramicFinish', defaultColor: '#BDB3A4' },
      { id: 'shade', label: 'Linen shade', materials: ['Shade'], kind: 'lampShade', defaultColor: '#E0D4C0' },
      { id: 'hardware', label: 'Brass hardware', materials: ['Hardware'], kind: 'hardware', defaultColor: '#D4AF37' },
    ],
    meshes: [
      'Hand-thrown ceramic base',
      'Natural woven linen shade',
      'Brushed brass stem & socket fixture',
      'Internal frosted incandescent bulb',
    ],
    cameraTarget: [0, 1.15, 0],
    cameraPosition: [3.2, 1.85, 4.8],
  },
  'soren-dining-chair': {
    model: '/models/new/soren_dining_chair.glb',
    components: [
      { id: 'wood', label: 'Solid oak frame', materials: ['Oak | original grain and finish PBR'], kind: 'wood', defaultColor: '#B4865A' },
      { id: 'finish', label: 'Wood finish', materials: ['Oak | original grain and finish PBR'], kind: 'sorenFinish', defaultColor: '#BDB3A4' },
      { id: 'seat', label: 'Woven cord seat', materials: ['Textile | original woven or leather PBR'], kind: 'cord', defaultColor: '#D9C7AA' },
    ],
    meshes: [
      'Horseshoe wishbone crest',
      'Y-back central stem',
      'Continuous swept rear stiles',
      'Tapered front & rear legs',
      'Side and cross aprons',
      'Woven paper cord seat (warp and weft)',
      'Protective floor glides',
    ],
    cameraTarget: [0, 1.05, 0],
    cameraPosition: [2.8, 1.85, 3.8],
  },
  'alma-bed': {
    model: '/models/new/alma_upholstered_bed.glb',
    components: [
      { id: 'headboard', label: 'Headboard fabric', materials: ['Headboard'], kind: 'bedFabric', defaultColor: '#87927A' },
      { id: 'frame', label: 'Platform frame fabric', materials: ['Frame'], kind: 'bedFabric', defaultColor: '#87927A' },
      { id: 'bedding', label: 'Main bedding', materials: ['Bedding'], kind: 'beddingFabric', defaultColor: '#F5F1E9' },
    ],
    meshes: [
      'Padded architectural curved headboard',
      'Solid European beech low-profile platform frame',
      'Integrated floating mattress with organic folded duvet',
      'Sleeping pillows (2 minimal or 4 styled)',
      'Subtle 7mm architectural perimeter shadow-gap reveal',
    ],
    cameraTarget: [0, 0.06, 0],
    cameraPosition: [2.35, 2.25, 2.75],
  },
  'nord-sideboard': {
    model: '/models/new/nord_sideboard.glb',
    components: [
      { id: 'wood', label: 'Carcass & countertop', materials: ['Carcass'], kind: 'nordWood', defaultColor: '#594438' },
      { id: 'doors', label: 'Door panels', materials: ['Doors'], kind: 'nordDoors', defaultColor: '#594438' },
      { id: 'finish', label: 'Protective wood finish', materials: ['Carcass', 'Doors'], kind: 'finish', defaultColor: '#BDB3A4' },
      { id: 'hardware', label: 'Hardware pull handles', materials: ['Hardware'], kind: 'nordHardware', defaultColor: '#D4AF37' },
    ],
    meshes: [
      'Solid quarter-sawn carcass and bullnose top',
      'Four precision-hung front cabinet door panels',
      'Recessed architectural shadow plinth base',
      'Edge-mounted hardware finger pulls (removable for flush handleless aesthetic)',
    ],
    cameraTarget: [0, 0.05, 0],
    cameraPosition: [2.6, 1.4, 2.8],
  },
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
    { id: 'walnut', label: 'Warm walnut', color: '#594438' },
    { id: 'smoked', label: 'Smoked oak', color: '#765B45' },
    { id: 'black-oak', label: 'Black oak', color: '#222120' },
  ],
  accent: [
    { id: 'original-terracotta', label: 'Original terracotta', color: '#B37355' },
    { id: 'terracotta', label: 'Terracotta', color: '#A66F56' },
    { id: 'moss', label: 'Moss', color: '#89927B' },
    { id: 'ivory', label: 'Ivory', color: '#E8DDC9' },
  ],
  cord: [
    { id: 'natural-cord', label: 'Natural cord', color: '#D9C7AA' },
    { id: 'ivory', label: 'Ivory cord', color: '#F4EFE6' },
    { id: 'linen', label: 'Linen cord', color: '#C8B49A' },
    { id: 'taupe', label: 'Taupe cord', color: '#8E8271' },
    { id: 'charcoal', label: 'Charcoal cord', color: '#2C2B29' },
  ],
  sorenFinish: [
    { id: 'matte', label: 'Matte', color: '#8C8275' },
    { id: 'satin', label: 'Satin', color: '#BDB3A4' },
    { id: 'oil', label: 'Natural oil', color: '#EDE6DB' },
  ],
  cushionFabric: [
    { id: 'cognac', label: 'Cognac saddle leather', color: '#8C4F2B' },
    { id: 'sand', label: 'Sand linen', color: '#C8B49A' },
    { id: 'charcoal', label: 'Charcoal wool', color: '#292925' },
    { id: 'olive', label: 'Olive velvet', color: '#535B49' },
  ],
  bedFabric: [
    { id: 'ivory-boucle', label: 'Ivory Bouclé', color: '#E8DDC8' },
    { id: 'sand-boucle', label: 'Sand Bouclé', color: '#C8B49A' },
    { id: 'charcoal-boucle', label: 'Charcoal Bouclé', color: '#292925' },
    { id: 'oatmeal-linen', label: 'Oatmeal Linen', color: '#D9CEBD' },
    { id: 'sage-linen', label: 'Sage Celadon Linen', color: '#87927A' },
    { id: 'taupe-linen', label: 'Warm Taupe Linen', color: '#968778' },
  ],
  beddingFabric: [
    { id: 'crisp-white', label: 'Crisp White Percale', color: '#F5F1E9' },
    { id: 'washed-slate', label: 'Washed Slate Linen', color: '#7A8288' },
    { id: 'muted-terracotta', label: 'Muted Terracotta', color: '#B87960' },
    { id: 'sandstone', label: 'Warm Sandstone', color: '#C8B49A' },
  ],
  nordWood: [
    { id: 'walnut', label: 'Warm Walnut', color: '#594438' },
    { id: 'oak', label: 'Natural White Oak', color: '#B4865A' },
    { id: 'smoked', label: 'Smoked Espresso Oak', color: '#3D3028' },
    { id: 'black-ash', label: 'Black Stained Ash', color: '#222120' },
  ],
  nordDoors: [
    { id: 'walnut', label: 'Warm Walnut (Matched)', color: '#594438' },
    { id: 'oak', label: 'Natural White Oak', color: '#B4865A' },
    { id: 'smoked', label: 'Smoked Espresso Oak', color: '#3D3028' },
    { id: 'black-ash', label: 'Black Stained Ash', color: '#222120' },
    { id: 'chalk-white', label: 'Chalk White Matte Lacquer', color: '#F2EDE4' },
    { id: 'slate-grey', label: 'Slate Grey Matte Lacquer', color: '#4E5357' },
  ],
  nordHardware: [
    { id: 'brass', label: 'Brushed Champagne Brass', color: '#D4AF37' },
    { id: 'black', label: 'Matte Anodized Black', color: '#222222' },
    { id: 'bronze', label: 'Antique Bronze', color: '#5A4532' },
    { id: 'steel', label: 'Brushed Stainless Steel', color: '#CCCCCC' },
  ],
  finish: [
    { id: 'matte', label: 'Matte (Low sheen oil)', color: '#8C8275' },
    { id: 'satin', label: 'Satin (Hand-waxed)', color: '#BDB3A4' },
    { id: 'gloss', label: 'Gloss (Low lacquer)', color: '#EDE6DB' },
  ],
  ceramicFinish: [
    { id: 'matte', label: 'Matte (Soft unglazed)', color: '#8C8275' },
    { id: 'satin', label: 'Satin (Subtle reflection)', color: '#BDB3A4' },
    { id: 'gloss', label: 'Gloss (Polished glaze)', color: '#EDE6DB' },
  ],
  ceramic: [
    { id: 'terracotta', label: 'Terracotta raw clay', color: '#B86B4B' },
    { id: 'chalk', label: 'Chalk white glaze', color: '#F4EFE6' },
    { id: 'sandstone', label: 'Speckled sandstone', color: '#D2C4B0' },
    { id: 'celadon', label: 'Olive celadon glaze', color: '#6D7763' },
  ],
  lampShade: [
    { id: 'natural', label: 'Natural linen', color: '#E0D4C0' },
    { id: 'ivory', label: 'Ivory linen', color: '#FAF5EE' },
    { id: 'oatmeal', label: 'Oatmeal heather', color: '#C2B39E' },
  ],
  hardware: [
    { id: 'brass', label: 'Brushed brass', color: '#D4AF37' },
    { id: 'bronze', label: 'Antiqued bronze', color: '#5A4532' },
    { id: 'blackened', label: 'Blackened steel', color: '#2C2C2C' },
  ],
})

export function createInitialConfiguratorSelections(product) {
  const selections = Object.fromEntries(product.components.map((component) => {
    const options = MATERIAL_OPTIONS[component.kind] ?? []
    const selected = options.find((option) => option.color === component.defaultColor) ?? options[0]
    return [component.id, selected?.color ?? component.defaultColor]
  }))
  if (product.slug === 'linnea-sofa') selections.cushionDetails = 'enabled'
  if (product.slug === 'terra-coffee-table') selections.geometryVariant = 'original'
  if (product.slug === 'sol-table-lamp') selections.illumination = 'warm'
  if (product.slug === 'soren-dining-chair') {
    selections.wood = '#B4865A'
    selections.finish = '#BDB3A4'
    selections.seat = '#D9C7AA'
    selections.cushion = 'off'
    selections.cushionColor = '#8C4F2B'
  }
  if (product.slug === 'alma-bed') {
    selections.headboard = '#87927A'
    selections.frame = '#87927A'
    selections.bedding = '#F5F1E9'
    selections.pillows = '4'
    selections.underglow = 'warm'
  }
  if (product.slug === 'nord-sideboard') {
    selections.wood = '#594438'
    selections.doors = '#594438'
    selections.finish = '#BDB3A4'
    selections.hardware = '#D4AF37'
    selections.handleStyle = 'pull'
  }
  return selections
}

export function selectionsForProduct(state, product) {
  return state?.slug === product.slug ? state.values : createInitialConfiguratorSelections(product)
}

export function createResetConfiguratorSelections(product) {
  const selections = Object.fromEntries(product.components.map((component) => [component.id, null]))
  if (product.slug === 'linnea-sofa') selections.cushionDetails = 'enabled'
  if (product.slug === 'terra-coffee-table') selections.geometryVariant = 'original'
  if (product.slug === 'sol-table-lamp') selections.illumination = 'warm'
  if (product.slug === 'soren-dining-chair') {
    selections.wood = '#B4865A'
    selections.finish = '#BDB3A4'
    selections.seat = '#D9C7AA'
    selections.cushion = 'off'
    selections.cushionColor = '#8C4F2B'
  }
  if (product.slug === 'alma-bed') {
    selections.headboard = '#87927A'
    selections.frame = '#87927A'
    selections.bedding = '#F5F1E9'
    selections.pillows = '4'
    selections.underglow = 'warm'
  }
  if (product.slug === 'nord-sideboard') {
    selections.wood = '#594438'
    selections.doors = '#594438'
    selections.finish = '#BDB3A4'
    selections.hardware = '#D4AF37'
    selections.handleStyle = 'pull'
  }
  return selections
}

export const CONFIGURATOR_TABS = ['Materials', 'Structure', 'Dimensions', 'Summary']
