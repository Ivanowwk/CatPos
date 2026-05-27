import type { CartItem } from '../../types/cart.types'

import { useCartStore } from '../../store/cart.store'

interface Props {
  item: CartItem
}

export const CartItemComponent = ({
  item
}: Props) => {
  const {
    increaseQuantity,
    decreaseQuantity,
    removeItem
  } = useCartStore()

  return (
    <div className="border-b py-4">
      <div className="flex justify-between">
        <div>
          <h3 className="font-medium">
            {item.name}
          </h3>

          <p className="text-sm text-gray-500">
            ${item.price}
          </p>
        </div>

        <button
          onClick={() =>
            removeItem(item.id)
          }
          className="text-red-500"
        >
          X
        </button>
      </div>

      <div
        className="
          flex
          items-center
          gap-2
          mt-3
        "
      >
        <button
          onClick={() =>
            decreaseQuantity(item.id)
          }
          className="
            w-8
            h-8
            rounded-lg
            bg-gray-100
          "
        >
          -
        </button>

        <span>{item.quantity}</span>

        <button
          onClick={() =>
            increaseQuantity(item.id)
          }
          className="
            w-8
            h-8
            rounded-lg
            bg-gray-100
          "
        >
          +
        </button>
      </div>
    </div>
  )
}