import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { normalizeCartFinish } from '../data/fabricFinishes.js'

const MAX_QUANTITY = 99

const normalizeConfiguration = (configuration) => {
  if (!configuration || typeof configuration !== 'object' || Array.isArray(configuration)) return null
  const entries = Object.entries(configuration).filter(([key, value]) => typeof key === 'string' && (
    key === 'pillowDetail' && (value === 'included' || value === 'removed')
    || value && typeof value === 'object' && typeof value.label === 'string' && (value.color === undefined || typeof value.color === 'string')
  ))
  return entries.length ? Object.fromEntries(entries.sort(([left], [right]) => left.localeCompare(right))) : null
}

const configurationKey = (configuration) => JSON.stringify(normalizeConfiguration(configuration))
const isSameCartVariant = (item, slug, finish, configuration) => item.slug === slug
  && normalizeCartFinish(slug, item.finish) === finish
  && configurationKey(item.configuration) === configurationKey(configuration)

const restorePersistedState = (persisted, current) => {
  const quantities = new Map()
  if (Array.isArray(persisted?.cart)) {
    for (const item of persisted.cart) {
      if (!item || typeof item.slug !== 'string' || !Number.isFinite(item.quantity) || item.quantity < 1) continue
      const quantity = Math.min(MAX_QUANTITY, Math.floor(item.quantity))
      const finish = normalizeCartFinish(item.slug, item.finish)
      const configuration = normalizeConfiguration(item.configuration)
      const key = JSON.stringify([item.slug, finish, configurationKey(configuration)])
      const existing = quantities.get(key)?.quantity ?? 0
      quantities.set(key, { slug: item.slug, finish, configuration, quantity: Math.min(MAX_QUANTITY, existing + quantity) })
    }
  }
  return {
    ...current,
    cart: [...quantities.values()],
    wishlist: Array.isArray(persisted?.wishlist) ? [...new Set(persisted.wishlist.filter((slug) => typeof slug === 'string'))] : [],
  }
}

export const useShopStore = create(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      addToCart: (slug, quantity = 1, selectedFinish = null, selectedConfiguration = null) => {
        const amount = Math.max(1, Math.min(MAX_QUANTITY, Math.floor(Number(quantity) || 1)))
        const finish = normalizeCartFinish(slug, selectedFinish)
        const configuration = normalizeConfiguration(selectedConfiguration)
        set((state) => {
          const existing = state.cart.find((item) => isSameCartVariant(item, slug, finish, configuration))
          return {
            cart: existing
              ? state.cart.map((item) => isSameCartVariant(item, slug, finish, configuration) ? { ...item, finish, configuration, quantity: Math.min(MAX_QUANTITY, item.quantity + amount) } : item)
              : [...state.cart, { slug, finish, configuration, quantity: amount }],
          }
        })
      },
      removeFromCart: (slug, selectedFinish = null, selectedConfiguration = null) => {
        const finish = normalizeCartFinish(slug, selectedFinish)
        const configuration = normalizeConfiguration(selectedConfiguration)
        set((state) => ({ cart: state.cart.filter((item) => !isSameCartVariant(item, slug, finish, configuration)) }))
      },
      setQuantity: (slug, finishOrQuantity, quantityValue, selectedConfiguration = null) => {
        const selectedFinish = quantityValue === undefined ? null : finishOrQuantity
        const quantity = quantityValue === undefined ? finishOrQuantity : quantityValue
        const parsed = Number(quantity)
        if (!Number.isFinite(parsed) || parsed < 1) return
        const amount = Math.min(MAX_QUANTITY, Math.floor(parsed))
        const finish = normalizeCartFinish(slug, selectedFinish)
        const configuration = normalizeConfiguration(selectedConfiguration)
        set((state) => ({ cart: state.cart.map((item) => isSameCartVariant(item, slug, finish, configuration) ? { ...item, finish, configuration, quantity: amount } : item) }))
      },
      clearCart: () => set({ cart: [] }),
      toggleWishlist: (slug) => set((state) => ({
        wishlist: state.wishlist.includes(slug)
          ? state.wishlist.filter((item) => item !== slug)
          : [...state.wishlist, slug],
      })),
      removeFromWishlist: (slug) => set((state) => ({ wishlist: state.wishlist.filter((item) => item !== slug) })),
      isWishlisted: (slug) => get().wishlist.includes(slug),
    }),
    {
      name: 'heaven-co-shop-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ cart, wishlist }) => ({ cart, wishlist }),
      version: 1,
      merge: restorePersistedState,
    },
  ),
)

export const selectCartCount = (state) => state.cart.reduce((sum, item) => sum + item.quantity, 0)
