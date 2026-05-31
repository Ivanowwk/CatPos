import { create } from 'zustand'

import type { Fiado } from '../types/fiado.types'

interface FiadosStore {
  fiados: Fiado[]

  addFiado: (fiado: Fiado) => void

  markPaid: (id: string) => void

  removeFiado: (id: string) => void
}

export const useFiadosStore = create<FiadosStore>((set) => ({
  fiados: [],

  addFiado: (fiado) =>
    set((state) => ({
      fiados: [fiado, ...state.fiados]
    })),

  markPaid: (id) =>
    set((state) => ({
      fiados: state.fiados.map((fiado) =>
        fiado.id === id
          ? {
              ...fiado,
              status: 'Pagado'
            }
          : fiado
      )
    })),

  removeFiado: (id) =>
    set((state) => ({
      fiados: state.fiados.filter((fiado) => fiado.id !== id)
    }))
}))
