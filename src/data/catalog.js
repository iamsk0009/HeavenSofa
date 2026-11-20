export const CATEGORIES = ['Sofas', 'Chairs', 'Tables', 'Beds', 'Storage', 'Lighting', 'Accessories']

// Demonstration catalogue: prices and availability are illustrative, not live inventory.
export const PRODUCTS = [
  {
    slug: 'linnea-sofa', name: 'Linnea Two-Seater', category: 'Sofas', price: 124000,
    material: 'Linen', colour: 'Oat', availability: 'Made to order', year: 2026, featured: 1,
    image: '/images/products/linnea-sofa/linnea-sofa-studio.jpg',
    fabricMask: '/images/masks/linnea-sofa-fabric-mask.png',
    alternateImage: '/images/products/linnea-sofa/linnea-sofa-front.jpg',
    detailImage: '/images/materials/linen/linen-and-oak-detail.jpg',
    roomImage: '/images/lifestyle/living-room/living-room-linnea.jpg',
    visual: 'sofa', fabric: '#D9C7AA',
    short: 'A generous, quiet silhouette in stonewashed linen.',
    description: 'A considered two-seater with a solid beech frame, softly rounded arms and removable linen covers. Designed for slow mornings and long conversations.',
    dimensions: 'W 192 × D 88 × H 86 cm',
    specifications: ['Solid beech frame', 'Stonewashed linen upholstery', 'High resilience foam and feather blend', 'Removable, repairable covers'],
    colours: ['Oat', 'Moss', 'Clay'],
  },
  {
    slug: 'ora-lounge-chair', name: 'Ora Lounge Chair', category: 'Chairs', price: 68500,
    material: 'Bouclé', colour: 'Ivory', availability: 'Made to order', year: 2026, featured: 2,
    image: '/images/products/ora-chair/ora-chair-studio.jpg',
    alternateImage: '/images/products/ora-chair/ora-chair-front.jpg',
    detailImage: '/images/materials/boucle/boucle-upholstery-detail.jpg',
    roomImage: '/images/lifestyle/lounge/lounge-boucle-chair.jpg',
    visual: 'lounge', fabric: '#E5DED2', short: 'A sculptural seat with a soft, enveloping back.',
    description: 'A low lounge chair balancing a generous upholstered shell with a hand-finished oak base. Its compact footprint makes a comfortable reading corner anywhere.',
    dimensions: 'W 78 × D 82 × H 76 cm', specifications: ['Solid oak frame', 'Textured ivory bouclé', 'Hand-finished joinery', 'Protective floor glides'], colours: ['Ivory', 'Walnut'],
  },
  {
    slug: 'terra-coffee-table', name: 'Terra Coffee Table', category: 'Tables', price: 38900,
    material: 'Oak', colour: 'Natural', availability: 'In studio', year: 2026, featured: 3,
    image: '/images/products/terra-table/terra-table-studio.jpg',
    alternateImage: '/images/products/terra-table/terra-table-front.jpg',
    detailImage: '/images/materials/oak/oak-grain-detail.jpg',
    roomImage: '/images/lifestyle/living-room/living-room-linnea.jpg',
    visual: 'table', fabric: '#B4865A', short: 'A grounded oak table with a softly eased edge.',
    description: 'A low, tactile centrepiece shaped from solid oak. The softly eased edge and recessed plinth give the simple form a quieter architectural presence.',
    dimensions: 'W 110 × D 62 × H 38 cm', specifications: ['Solid European oak', 'Low sheen natural oil', 'Rounded, hand-sanded edges', 'Felt floor protectors'], colours: ['Natural', 'Smoked'],
  },
  {
    slug: 'soren-dining-chair', name: 'Soren Dining Chair', category: 'Chairs', price: 32400,
    material: 'Oak', colour: 'Natural', availability: 'Made to order', year: 2025, featured: 4,
    image: '/images/products/soren-chair/soren-chair-studio.jpg',
    alternateImage: '/images/products/soren-chair/soren-chair-front.jpg',
    detailImage: '/images/materials/oak/oak-grain-detail.jpg',
    roomImage: '/images/lifestyle/dining/dining-natural-oak.jpg',
    visual: 'chair', fabric: '#B4865A', short: 'A light oak frame shaped for everyday dining.',
    description: 'A pared-back dining chair with a curved back rail, considered proportions and a woven seat. Made to gather around, and made to stay.',
    dimensions: 'W 48 × D 52 × H 79 cm', specifications: ['Solid oak frame', 'Hand-woven natural rush seat', 'Traditional mortise and tenon joints', 'Low VOC finish'], colours: ['Natural', 'Walnut'],
  },
  {
    slug: 'alma-bed', name: 'Alma Upholstered Bed', category: 'Beds', price: 112000,
    material: 'Linen', colour: 'Sand', availability: 'Made to order', year: 2025, featured: 5,
    image: '/images/products/alma-bed/alma-bed-studio.jpg',
    fabricMask: '/images/masks/alma-bed-fabric-mask.png',
    alternateImage: '/images/products/alma-bed/alma-bed-front.jpg',
    detailImage: '/images/materials/linen/linen-and-oak-detail.jpg',
    roomImage: '/images/lifestyle/bedroom/bedroom-alma.jpg',
    visual: 'bed', fabric: '#D9C7AA', short: 'A softly upholstered headboard with a grounded oak base.',
    description: 'A restful bed built around a sturdy beech frame, a gently curved linen headboard and discreet oak feet. Sized for considered, uncluttered bedrooms.',
    dimensions: 'W 168 × D 218 × H 104 cm', specifications: ['Solid beech and oak frame', 'Linen upholstered headboard', 'Fits a 160 × 200 cm mattress', 'Slatted timber support'], colours: ['Sand', 'Oat', 'Moss'],
  },
  {
    slug: 'nord-sideboard', name: 'Nord Sideboard', category: 'Storage', price: 89500,
    material: 'Walnut', colour: 'Walnut', availability: 'Made to order', year: 2025, featured: 6,
    image: '/images/products/nord-sideboard/nord-sideboard-studio.jpg',
    alternateImage: '/images/products/nord-sideboard/nord-sideboard-front.jpg',
    detailImage: '/images/materials/walnut/walnut-grain-detail.jpg',
    roomImage: '/images/lifestyle/living-room/living-room-linnea.jpg',
    visual: 'storage', fabric: '#795A42', short: 'Quietly useful storage in richly grained walnut.',
    description: 'A long, low sideboard with clean-lined doors, adjustable shelves and a recessed base. The natural walnut grain brings warmth without visual noise.',
    dimensions: 'W 160 × D 42 × H 74 cm', specifications: ['Solid walnut fronts', 'Veneered walnut cabinet', 'Soft-close hinges', 'Adjustable interior shelves'], colours: ['Walnut', 'Natural oak'],
  },
  {
    slug: 'sol-table-lamp', name: 'Sol Table Lamp', category: 'Lighting', price: 18500,
    material: 'Ceramic', colour: 'Chalk', availability: 'In studio', year: 2026, featured: 7,
    image: '/images/products/sol-lamp/sol-lamp-studio.jpg',
    alternateImage: '/images/products/sol-lamp/sol-lamp-front.jpg',
    detailImage: '/images/products/sol-lamp/sol-lamp-studio.jpg',
    roomImage: '/images/lifestyle/bedroom/bedroom-alma.jpg',
    visual: 'lamp', fabric: '#C8BBA8', short: 'A warm pool of light on a hand-thrown ceramic base.',
    description: 'A softly rounded ceramic base and linen shade bring an easy, warm glow to bedside tables and reading corners.',
    dimensions: 'W 34 × D 34 × H 52 cm', specifications: ['Hand-thrown ceramic base', 'Natural linen shade', 'Dimmable warm LED included', '220–240 V'], colours: ['Chalk', 'Sage'],
  },
  {
    slug: 'still-vessel-set', name: 'Still Ceramic Vessels', category: 'Accessories', price: 7800,
    material: 'Ceramic', colour: 'Chalk', availability: 'In studio', year: 2026, featured: 8,
    image: '/images/products/still-vessels/still-vessels-studio.jpg',
    detailImage: '/images/products/still-vessels/still-vessels-studio.jpg',
    roomImage: '/images/lifestyle/living-room/living-room-linnea.jpg',
    visual: 'vessel', fabric: '#C8BBA8', short: 'A pair of quiet forms, shaped and glazed by hand.',
    description: 'Two small stoneware vessels with a matte, tactile glaze. Each piece is finished by hand, so subtle variations make every pair its own.',
    dimensions: 'Set of 2 · H 18 and 24 cm', specifications: ['Hand-thrown stoneware', 'Matte food-safe glaze', 'Made in small batches', 'Each piece is unique'], colours: ['Chalk', 'Sage'],
  },
]

export const COLLECTIONS = [
  { slug: 'living-room', title: 'Living Room', description: 'Room to settle in. Sofas, chairs and tables shaped for the everyday rituals of home.', visual: 'sofa', image: '/images/lifestyle/living-room/living-room-linnea.jpg', products: ['linnea-sofa', 'ora-lounge-chair', 'terra-coffee-table'] },
  { slug: 'dining', title: 'Dining', description: 'Honest materials and generous forms for meals that last a little longer.', visual: 'dining', image: '/images/lifestyle/dining/dining-natural-oak.jpg', products: ['soren-dining-chair', 'terra-coffee-table'] },
  { slug: 'lounge', title: 'Lounge', description: 'A softer pace, expressed through enveloping seats and warm natural finishes.', visual: 'lounge', image: '/images/lifestyle/lounge/lounge-boucle-chair.jpg', products: ['ora-lounge-chair', 'linnea-sofa'] },
  { slug: 'bedroom', title: 'Bedroom', description: 'Quiet, considered pieces to make the end of each day feel like a return.', visual: 'bed', image: '/images/lifestyle/bedroom/bedroom-alma.jpg', products: ['alma-bed', 'sol-table-lamp'] },
  { slug: 'designer-chairs', title: 'Designer Chairs', description: 'Five distinct studies in comfort, proportion and the character of wood.', visual: 'chair', image: '/images/lifestyle/dining/dining-natural-oak.jpg', products: ['ora-lounge-chair', 'soren-dining-chair'] },
]

export const productBySlug = (slug) => PRODUCTS.find((product) => product.slug === slug)
export const collectionBySlug = (slug) => COLLECTIONS.find((collection) => collection.slug === slug)

const GALLERY_IMAGE_KEYS = ['threeQuarter', 'front', 'material', 'lifestyle']

export function productImagesForColour(product, colour) {
  const baseImages = {
    threeQuarter: product.image,
    front: product.alternateImage ?? product.image,
    material: product.detailImage ?? product.image,
    lifestyle: product.roomImage ?? product.image,
  }
  const variant = product.variants?.find((item) => item.colour.toLowerCase() === colour.toLowerCase())

  if (!variant) {
    const isBaseColour = product.colour.toLowerCase() === colour.toLowerCase()
    return { images: baseImages, available: isBaseColour, fallbackColour: product.colour }
  }

  const images = Object.fromEntries(GALLERY_IMAGE_KEYS.map((key) => [key, variant.images[key] || baseImages[key]]))
  const available = GALLERY_IMAGE_KEYS.every((key) => Boolean(variant.images[key]))
  return { images, available, fallbackColour: product.colour }
}
