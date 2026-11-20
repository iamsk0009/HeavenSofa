export const FABRIC_FINISHES = Object.freeze([
  { id: 'sand', name: 'Sand', hex: '#C8B49A' },
  { id: 'moss', name: 'Moss', hex: '#89927B' },
  { id: 'ivory', name: 'Ivory', hex: '#E8DDC9' },
])

export const DEFAULT_FABRIC_FINISH = 'sand'
export const FINISHABLE_PRODUCT_SLUGS = Object.freeze(['linnea-sofa', 'alma-bed'])

export const isFinishableProduct = (slug) => FINISHABLE_PRODUCT_SLUGS.includes(slug)

export function getFabricFinish(id) {
  return FABRIC_FINISHES.find((finish) => finish.id === id) ?? FABRIC_FINISHES[0]
}

export function normalizeCartFinish(slug, finishId) {
  if (!isFinishableProduct(slug)) return null
  return FABRIC_FINISHES.some((finish) => finish.id === finishId) ? finishId : DEFAULT_FABRIC_FINISH
}
