import { create } from 'zustand'

import type { Product } from '../types/product.types'

import type { CartItem } from '../types/cart.types'

interface CartStore {
  items: CartItem[]

  addItem: (product: Product) => void

  removeItem: (
    productId: string
  ) => void

  increaseQuantity: (
    productId: string
  ) => void

  decreaseQuantity: (
    productId: string
  ) => void

  subtotal: () => number

  tax: () => number

  total: () => number
}

const TAX_RATE = 0.19

export const useCartStore =
  create<CartStore>((set, get) => ({
    items: [],

    addItem: (product) => {
      const items = get().items

      const existing = items.find(
        item => item.id === product.id
      )

      if (existing) {
        set({
          items: items.map(item =>
            item.id === product.id
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,

                  subtotal:
                    (item.quantity + 1) *
                    item.price
                }
              : item
          )
        })

        return
      }

      set({
        items: [
          ...items,
          {
            ...product,

            quantity: 1,

            subtotal: product.price
          }
        ]
      })
    },

    removeItem: (productId) => {
      set({
        items: get().items.filter(
          item =>
            item.id !== productId
        )
      })
    },

    increaseQuantity: (
      productId
    ) => {
      set({
        items: get().items.map(item =>
          item.id === productId
            ? {
                ...item,

                quantity:
                  item.quantity + 1,

                subtotal:
                  (item.quantity + 1) *
                  item.price
              }
            : item
        )
      })
    },

    decreaseQuantity: (
      productId
    ) => {
      const updated = get()
        .items
        .map(item => {
          if (
            item.id !== productId
          ) {
            return item
          }

          return {
            ...item,

            quantity:
              item.quantity - 1,

            subtotal:
              (item.quantity - 1) *
              item.price
          }
        })
        .filter(
          item => item.quantity > 0
        )

      set({
        items: updated
      })
    },

    subtotal: () => {
      return get().items.reduce(
        (acc, item) =>
          acc + item.subtotal,
        0
      )
    },

    tax: () => {
      return (
        get().subtotal() * TAX_RATE
      )
    },

    total: () => {
      return (
        get().subtotal() +
        get().tax()
      )
    }
  }))