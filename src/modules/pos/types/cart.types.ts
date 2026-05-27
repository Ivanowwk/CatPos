import type {
  Product
} from '../../products/store/products.store'

export interface CartItem
  extends Product {
  quantity: number
}