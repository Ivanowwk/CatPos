import {
  useMemo,
  useState
} from 'react'

import { v4 as uuid } from 'uuid'

import {
  useProductsStore
} from '../store/products.store'

export const ProductForm = () => {
  const { addProduct } =
    useProductsStore()

  const [name, setName] =
    useState('')

  const [barcode, setBarcode] =
    useState('')

  const [
    costPrice,
    setCostPrice
  ] = useState('')

  const [
    profitMargin,
    setProfitMargin
  ] = useState('30')

  const [stock, setStock] =
    useState('')

  const parseNumber = (
    value: string
  ) => {
    return Number(
      value.replace(/\./g, '')
    ) || 0
  }

  const formatNumber = (
    value: string
  ) => {
    const numbers =
      value.replace(/\D/g, '')

    if (!numbers) return ''

    return new Intl.NumberFormat(
      'es-CO'
    ).format(Number(numbers))
  }

  const numericCost =
    parseNumber(costPrice)

  const numericMargin =
    Number(profitMargin) || 0

  const numericStock =
    parseNumber(stock)

  const salePrice =
    useMemo(() => {
      return Math.round(
        numericCost +
          (
            numericCost *
            numericMargin
          ) /
            100
      )
    }, [
      numericCost,
      numericMargin
    ])

  const formatPrice = (
    value: number
  ) => {
    return new Intl.NumberFormat(
      'es-CO'
    ).format(value)
  }

  const submit = () => {
    if (!name) return

    addProduct({
      id: uuid(),

      name,

      barcode,

      costPrice:
        numericCost,

      profitMargin:
        numericMargin,

      salePrice,

      stock:
        numericStock
    })

    setName('')

    setBarcode('')

    setCostPrice('')

    setProfitMargin('30')

    setStock('')
  }

  return (
    <div
      className="
        bg-white
        rounded-2xl
        p-5
        shadow-sm
        border
        space-y-5
      "
    >
      <h2
        className="
          text-2xl
          font-bold
        "
      >
        Nuevo producto
      </h2>

      <div>
        <p
          className="
            text-sm
            text-gray-500
            mb-2
          "
        >
          Nombre del producto
        </p>

        <input
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          placeholder="Coca-Cola"
          className="
            w-full
            border
            rounded-xl
            p-3
            outline-none
            focus:border-blue-500
          "
        />
      </div>

      <div>
        <p
          className="
            text-sm
            text-gray-500
            mb-2
          "
        >
          Código de barras
        </p>

        <input
          value={barcode}
          onFocus={(e) =>
            e.target.select()
          }
          onChange={(e) =>
            setBarcode(
              e.target.value
            )
          }
          placeholder="7702001045603"
          className="
            w-full
            border
            rounded-xl
            p-3
            outline-none
            focus:border-blue-500
          "
        />
      </div>

      <div>
        <p
          className="
            text-sm
            text-gray-500
            mb-2
          "
        >
          Precio de compra
        </p>

        <input
          type="text"
          inputMode="numeric"
          value={costPrice}
          onFocus={(e) =>
            e.target.select()
          }
          onChange={(e) =>
            setCostPrice(
              formatNumber(
                e.target.value
              )
            )
          }
          placeholder="5.000"
          className="
            w-full
            border
            rounded-xl
            p-3
            outline-none
            focus:border-blue-500
          "
        />
      </div>

      <div>
        <p
          className="
            text-sm
            text-gray-500
            mb-2
          "
        >
          Ganancia %
        </p>

        <input
          type="number"
          value={profitMargin}
          onFocus={(e) =>
            e.target.select()
          }
          onChange={(e) =>
            setProfitMargin(
              e.target.value
            )
          }
          placeholder="30"
          className="
            w-full
            border
            rounded-xl
            p-3
            outline-none
            focus:border-blue-500
          "
        />
      </div>

      <div>
        <p
          className="
            text-sm
            text-gray-500
            mb-2
          "
        >
          Cantidad / Stock
        </p>

        <input
          type="text"
          inputMode="numeric"
          value={stock}
          onFocus={(e) =>
            e.target.select()
          }
          onChange={(e) =>
            setStock(
              formatNumber(
                e.target.value
              )
            )
          }
          placeholder="10"
          className="
            w-full
            border
            rounded-xl
            p-3
            outline-none
            focus:border-blue-500
          "
        />
      </div>

      <div
        className="
          bg-blue-50
          border
          border-blue-200
          rounded-2xl
          p-5
        "
      >
        <p
          className="
            text-sm
            text-blue-700
            mb-2
          "
        >
          Precio final de venta
        </p>

        <h3
          className="
            text-4xl
            font-bold
            text-blue-600
          "
        >
          $
          {formatPrice(
            salePrice
          )}
        </h3>
      </div>

      <button
        onClick={submit}
        className="
          w-full
          bg-blue-600
          hover:bg-blue-700
          transition
          text-white
          rounded-xl
          py-4
          font-semibold
          text-lg
        "
      >
        Guardar producto
      </button>
    </div>
  )
}