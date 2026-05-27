import { create } from 'zustand'

import type { Sale } from '../types/sales.types'

interface SalesStore {
  sales: Sale[]
  addSale: (sale: Sale) => void
  clearSales: () => void
}

export const useSalesStore = create<SalesStore>((set) => ({
  sales: [],

  addSale: (sale) =>
    set((state) => ({
      sales: [sale, ...state.sales]
    })),

  clearSales: () =>
    set({
      sales: []
    })
}))