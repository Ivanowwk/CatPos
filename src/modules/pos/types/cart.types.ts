import type {
  Product
} from '../../products/store/products.store'

export interface CartItem extends Omit<Product, 'quantity'> {
  quantity: number
}