import type {
  CartItem
} from '../../pos/types/cart.types'

export interface Sale {
  id: string

  createdAt: string

  paymentMethod: string

  total: number

  received: number

  change: number

  items: CartItem[]
}