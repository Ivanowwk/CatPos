import type { Product } from '../../types/product.types'

interface Props {
  product: Product
  onClick: () => void
}

export const ProductCard = ({
  product,
  onClick
}: Props) => {
  return (
    <button
      onClick={onClick}
      className="
        bg-white
        rounded-2xl
        p-4
        border
        shadow-sm
        hover:border-blue-500
        transition
        text-left
      "
    >
      <div
        className="
          h-28
          rounded-xl
          bg-gray-100
          mb-3
        "
      />

      <h3 className="font-medium">
        {product.name}
      </h3>

      <p
        className="
          text-blue-600
          font-bold
          mt-1
        "
      >
        ${product.price}
      </p>
    </button>
  )
}