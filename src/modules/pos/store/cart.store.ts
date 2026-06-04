import { create } from 'zustand'

import type {
  Product
} from '../../products/store/products.store'

import type {
  CartItem
} from '../types/cart.types'

interface CartStore {
  items: CartItem[]

  addToCart: (
    product: Product
  ) => void

  removeFromCart: (
    id: string
  ) => void

  increaseQuantity: (
    id: string
  ) => void

  decreaseQuantity: (
    id: string
  ) => void

  updateQuantity: (
    id: string,
    quantity: number
  ) => void

  clearCart: () => void
}

export const useCartStore =
  create<CartStore>(
    (set) => ({
      items: [],

      addToCart: (
        product
      ) =>
        set((state) => {
          const existing =
            state.items.find(
              item =>
                item.id ===
                product.id
            )

          if (existing) {
            if (existing.quantity >= product.stock) {
              return state
            }

            return {
              items:
                state.items.map(
                  item =>
                    item.id ===
                    product.id
                      ? {
                          ...item,
                          quantity:
                            item.quantity +
                            1
                        }
                      : item
                )
            }
          }

          if (product.stock <= 0) {
            return state
          }

          return {
            items: [
              ...state.items,
              {
                ...product,
                quantity: 1
              }
            ]
          }
        }),

      removeFromCart: (
        id
      ) =>
        set((state) => ({
          items:
            state.items.filter(
              item =>
                item.id !== id
            )
        })),

      increaseQuantity: (
        id
      ) =>
        set((state) => ({
          items: state.items.map(
            item =>
              item.id === id
                ? {
                    ...item,
                    quantity:
                      item.quantity < item.stock
                        ? item.quantity + 1
                        : item.quantity
                  }
                : item
          )
        })),

      decreaseQuantity: (
        id
      ) =>
        set((state) => ({
          items: state.items.map(
            item =>
              item.id === id
                ? {
                    ...item,
                    quantity:
                      Math.max(
                        1,
                        item.quantity -
                          1
                      )
                  }
                : item
          )
        })),

      updateQuantity: (
        id,
        quantity
      ) =>
        set((state) => ({
          items: state.items.map(
            item =>
              item.id === id
                ? {
                    ...item,
                    quantity:
                      Math.max(1, Math.min(item.stock, quantity))
                  }
                : item
          )
        })),

      clearCart: () =>
        set({
          items: []
        })
    })
  )