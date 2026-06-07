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
    salePrice,
    setSalePrice
  ] = useState('')

  const [
    profitMargin,
    setProfitMargin
  ] = useState('30')

  const [stock, setStock] =
    useState('')

  const [lastPriceEdited, setLastPriceEdited] =
    useState<'cost' | 'sale'>('cost')

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

  const numericSale =
    parseNumber(salePrice)

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
    setSalePrice(
      formatNumber(
        String(existingProduct.salePrice)
      )
    )
    setProfitMargin(
      String(existingProduct.profitMargin)
    )
    setLastPriceEdited('cost')
  }, [existingProduct])

  useEffect(() => {
    if (lastPriceEdited === 'cost') {
      if (!costPrice) {
        setSalePrice('')
        return
      }

      const computed = Math.round(
        numericCost +
          (numericCost *
            numericMargin) /
            100
      )

      setSalePrice(
        computed
          ? formatNumber(String(computed))
          : ''
      )
    }
  }, [costPrice, numericCost, numericMargin, lastPriceEdited])

  useEffect(() => {
    if (lastPriceEdited === 'sale') {
      if (!salePrice) {
        setCostPrice('')
        return
      }

      const computed =
        numericMargin >= 0
          ? Math.round(
              numericSale /
                (1 + numericMargin / 100)
            )
          : numericSale

      setCostPrice(
        computed
          ? formatNumber(String(computed))
          : ''
      )
    }
  }, [salePrice, numericSale, numericMargin, lastPriceEdited])

  const computedSaleFromCost =
    numericCost > 0
      ? Math.round(
          numericCost +
            (numericCost *
              numericMargin) /
              100
        )
      : 0

  const computedCostFromSale =
    numericSale > 0 &&
    numericMargin >= 0
      ? Math.round(
          numericSale /
            (1 + numericMargin / 100)
        )
      : 0

  

  const submit = () => {
    if (!name || numericCost <= 0 || numericSale <= 0) return

    const stockToSave = existingProduct
      ? numericStock > 0
        ? existingProduct.stock + numericStock
        : existingProduct.stock
      : numericStock

    if (!existingProduct && stockToSave <= 0) return

    if (existingProduct) {
      updateProduct(existingProduct.id, {
        name,
        barcode,
        category,
        costPrice: numericCost,
        profitMargin: numericMargin,
        salePrice: numericSale,
        stock: stockToSave
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

        salePrice:
          numericSale,

        stock:
          stockToSave
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
          onChange={(e) => setName(e.target.value.slice(0, 100))}
          maxLength={100}
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
          onFocus={(e) => e.target.select()}
          onChange={(e) => setBarcode(e.target.value.slice(0, 30))}
          maxLength={30}
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
          onFocus={(e) => e.target.select()}
          onChange={(e) => {
            const numbers = e.target.value.replace(/\D/g, '').slice(0, 9)
            setCostPrice(numbers ? new Intl.NumberFormat('es-CO').format(Number(numbers)) : '')
            setLastPriceEdited('cost')
          }}
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
          Precio de venta
        </p>

        <input
          type="text"
          inputMode="numeric"
          value={salePrice}
          onFocus={(e) => e.target.select()}
          onChange={(e) => {
            const numbers = e.target.value.replace(/\D/g, '').slice(0, 9)
            setSalePrice(numbers ? new Intl.NumberFormat('es-CO').format(Number(numbers)) : '')
            setLastPriceEdited('sale')
          }}
          placeholder="6.500"
          className="
            w-full
            border
            rounded-xl
            p-3
            outline-none
            focus:border-blue-500
          "
        />

        {computedCostFromSale > 0 ? (
          <p className="text-xs text-slate-500 mt-2">
            Precio de compra calculado: $ {formatNumber(String(computedCostFromSale))}
          </p>
        ) : null}
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
          min={0}
          max={500}
          onFocus={(e) => e.target.select()}
          onChange={(e) => {
            const n = e.target.value.replace(/\D/g, '').slice(0, 3)
            const num = n ? Math.min(500, Number(n)) : 0
            setProfitMargin(String(num))
          }}
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
          onFocus={(e) => e.target.select()}
          onChange={(e) => {
            const numbers = e.target.value.replace(/\D/g, '').slice(0, 7)
            setStock(numbers ? new Intl.NumberFormat('es-CO').format(Number(numbers)) : '')
          }}
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

        {computedSaleFromCost > 0 ? (
          <p className="text-xs text-slate-500 mt-2">
            Precio de venta estimado: $ {formatNumber(String(computedSaleFromCost))}
          </p>
        ) : null}

        {existingProduct ? (
          <p className="text-xs text-slate-500 mt-2">
            Este producto ya existe. Deja este campo vacío para mantener el stock actual, o ingresa una cantidad para sumarla.
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