import type { CartItem } from '../../pos/types/cart.types'

export interface Sale {
  id: string
  createdAt: string
  items: CartItem[]
  total: number
  paymentMethod: string
  received: number
  change: number
}