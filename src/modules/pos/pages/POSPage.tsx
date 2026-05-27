import { ProductCard } from '../components/products/ProductCard'

import { CartItemComponent } from '../components/cart/CartItem'

import { useCartStore } from '../store/cart.store'

import { formatCurrency } from '../utils/currency'

const MOCK_PRODUCTS = [
  {
    id: '1',

    name: 'Coca-Cola',

    price: 4000,

    stock: 10
  },

  {
    id: '2',

    name: 'Papas',

    price: 2500,

    stock: 20
  },

  {
    id: '3',

    name: 'Chocolate',

    price: 3000,

    stock: 15
  }
]

export const POSPage = () => {
  const {
    items,
    addItem,
    subtotal,
    tax,
    total
  } = useCartStore()

  return (
    <div
      className="
        grid
        grid-cols-[1fr_380px]
        h-screen
      "
    >
      <div className="p-6">
        <div
          className="
            grid
            grid-cols-4
            gap-4
          "
        >
          {MOCK_PRODUCTS.map(
            product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() =>
                  addItem(product)
                }
              />
            )
          )}
        </div>
      </div>

      <div
        className="
          border-l
          bg-white
          flex
          flex-col
        "
      >
        <div
          className="
            p-4
            border-b
            font-semibold
            text-lg
          "
        >
          Orden actual
        </div>

        <div className="flex-1 overflow-auto p-4">
          {items.map(item => (
            <CartItemComponent
              key={item.id}
              item={item}
            />
          ))}
        </div>

        <div
          className="
            border-t
            p-4
            space-y-3
          "
        >
          <div className="flex justify-between">
            <span>Subtotal</span>

            <span>
              {formatCurrency(
                subtotal()
              )}
            </span>
          </div>

          <div className="flex justify-between">
            <span>IVA</span>

            <span>
              {formatCurrency(tax())}
            </span>
          </div>

          <div
            className="
              flex
              justify-between
              text-2xl
              font-bold
            "
          >
            <span>Total</span>

            <span>
              {formatCurrency(
                total()
              )}
            </span>
          </div>

          <button
            className="
              w-full
              py-4
              rounded-2xl
              bg-blue-600
              text-white
              font-semibold
              mt-4
            "
          >
            COBRAR
          </button>
        </div>
      </div>
    </div>
  )
}