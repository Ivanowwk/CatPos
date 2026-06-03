import { create } from 'zustand'

export interface Product {
  id: string

  name: string

  costPrice: number

  profitMargin: number

  salePrice: number

  stock: number

  barcode?: string

  category?: string
  brand?: string
  image?: string | null
  quantity?: string | null
  nutriments?: Record<string, any>
}

interface ProductsStore {
  products: Product[]

  addProduct: (
    product: Product
  ) => void

  updateProduct: (
    id: string,
    changes: Partial<Product>
  ) => void

  removeProduct: (
    id: string
  ) => void

  clearAllProducts: () => void
}

export const useProductsStore =
  create<ProductsStore>(
    (set) => ({
      products: [],

      addProduct: (
        product
      ) =>
        set((state) => {
          const exists = state.products.some(
            (item) =>
              item.id === product.id ||
              (product.barcode && item.barcode === product.barcode)
          )

          if (exists) {
            return state
          }

          return {
            products: [
              ...state.products,
              product
            ]
          }
        }),

      updateProduct: (
        id,
        changes
      ) =>
        set((state) => ({
          products: state.products.map(
            (product) =>
              product.id === id
                ? {
                    ...product,
                    ...changes
                  }
                : product
          )
        })),

      removeProduct: (id) =>
        set((state) => ({
          products:
            state.products.filter(
              p => p.id !== id
            )
        })),

      clearAllProducts: () =>
        set(() => ({
          products: []
        }))
    })
  )