import { create } from 'zustand'

import type {
  Supplier,
  SupplierReceipt
} from '../types/supplier.types'

interface SuppliersStore {
  suppliers: Supplier[]
  receipts: SupplierReceipt[]

  addSupplier: (supplier: Supplier) => void
  removeSupplier: (id: string) => void

  addReceipt: (receipt: SupplierReceipt) => void
  markReceiptReceived: (id: string) => void
  removeReceipt: (id: string) => void
}

export const useSuppliersStore = create<SuppliersStore>((set) => ({
  suppliers: [],
  receipts: [],

  addSupplier: (supplier) =>
    set((state) => ({
      suppliers: [supplier, ...state.suppliers]
    })),

  removeSupplier: (id) =>
    set((state) => ({
      suppliers: state.suppliers.filter((supplier) => supplier.id !== id)
    })),

  addReceipt: (receipt) =>
    set((state) => ({
      receipts: [receipt, ...state.receipts]
    })),

  markReceiptReceived: (id) =>
    set((state) => ({
      receipts: state.receipts.map((receipt) =>
        receipt.id === id
          ? { ...receipt, status: 'Recibido' }
          : receipt
      )
    })),

  removeReceipt: (id) =>
    set((state) => ({
      receipts: state.receipts.filter((receipt) => receipt.id !== id)
    }))
}))
