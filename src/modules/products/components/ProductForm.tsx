import {
  useEffect,
  useMemo,
  useState
} from 'react'

import { v4 as uuid } from 'uuid'

import {
  useProductsStore
} from '../store/products.store'

export const ProductForm = ({ initialBarcode }: { initialBarcode?: string }) => {
  const { products, addProduct, updateProduct } =
    useProductsStore()

  const [name, setName] =
    useState('')

  const [barcode, setBarcode] =
    useState('')

  const [category, setCategory] =
    useState('Bebidas')

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

  const existingProduct = useMemo(
    () =>
      products.find((product) =>
        (product.barcode && product.barcode === barcode) ||
        product.id === barcode
      ),
    [products, barcode]
  )

  useEffect(() => {
    if (initialBarcode) setBarcode(initialBarcode)
  }, [initialBarcode])

  useEffect(() => {
    if (!existingProduct) return

    setName(existingProduct.name)
    setCategory(
      existingProduct.category ||
        'Bebidas'
    )
    setCostPrice(
      formatNumber(
        String(existingProduct.costPrice)
      )
    )
    setProfitMargin(
      String(existingProduct.profitMargin)
    )
  }, [existingProduct])

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

  

  const submit = () => {
    if (!name || numericCost <= 0 || numericStock <= 0) return

    if (existingProduct) {
      updateProduct(existingProduct.id, {
        name,
        barcode,
        category,
        costPrice: numericCost,
        profitMargin: numericMargin,
        salePrice,
        stock:
          existingProduct.stock +
          numericStock
      })
    } else {
      addProduct({
        id: uuid(),

        name,

        barcode,

        category,

        costPrice:
          numericCost,

        profitMargin:
          numericMargin,

        salePrice,

        stock:
          numericStock
      })
    }

    setName('')

    setBarcode('')

    setCostPrice('')

    setProfitMargin('30')

    setStock('')

    setCategory('Bebidas')
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
          Tipo de producto
        </p>

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="
            w-full
            border
            rounded-xl
            p-3
            outline-none
            focus:border-blue-500
          "
        >
          <option>Bebidas</option>
          <option>Alimentos</option>
          <option>Hogar</option>
          <option>Oficina</option>
          <option>Otros</option>
        </select>
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
        <div className="flex items-center justify-between gap-3">
          <p
            className="
              text-sm
              text-gray-500
              mb-2
            "
          >
            Cantidad / Stock
          </p>
          {existingProduct ? (
            <span className="text-xs text-slate-500">
              Stock actual: {existingProduct.stock}
            </span>
          ) : null}
        </div>

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

        {existingProduct ? (
          <p className="text-xs text-slate-500 mt-2">
            Este producto ya existe. La cantidad ingresada se sumará al stock existente.
          </p>
        ) : null}
      </div>

      {/* Precio final de venta removed from product form - not needed in product management */}

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