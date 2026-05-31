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
}

export const useProductsStore =
  create<ProductsStore>(
    (set) => ({
      products: [],

      addProduct: (
        product
      ) =>
        set((state) => ({
          products: [
            ...state.products,
            product
          ]
        })),

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
        }))
    })
  )