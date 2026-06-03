import {
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  useProductsStore
} from '../../products/store/products.store'
import { QuickProductModal } from '../components/QuickProductModal'

import {
  useCartStore
} from '../store/cart.store'

import {
  CheckoutModal
} from '../components/CheckoutModal'

export const POSPage = () => {
  const { products } =
    useProductsStore()

  const {
    items,
    addToCart,
    removeFromCart,
    updateQuantity
  } = useCartStore()

  const [barcode, setBarcode] =
    useState('')

  const [quickProduct, setQuickProduct] = useState<null | any>(null)
  const [quickOpen, setQuickOpen] = useState(false)

  const [checkoutOpen,
    setCheckoutOpen
  ] = useState(false)

  const handleScan = (
    value: string
  ) => {
    const trimmed = value.trim()
    setBarcode(value)

    if (!trimmed) return

    const product = products.find((p) => p.barcode === trimmed)

    if (product) {
      addToCart(product)
      setBarcode('')
      return
    }

    setQuickProduct({
      barcode: trimmed,
      name: '',
      brand: undefined,
      image: null,
      quantity: undefined,
      categories: [],
      salePrice: 0,
      costPrice: 0,
      stock: 0
    })
    setQuickOpen(true)
  }

  const total =
    useMemo(() => {
      return items.reduce(
        (acc, item) =>
          acc +
          item.salePrice *
            item.quantity,
        0
      )
    }, [items])

  const formatPrice = (
    value: number
  ) => {
    return new Intl.NumberFormat(
      'es-CO'
    ).format(value)
  }

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.code !== 'Space' && event.key !== ' ') return

      const target = event.target as HTMLElement | null
      if (
        target?.closest('input, textarea, select') ||
        target?.isContentEditable
      ) {
        return
      }

      if (items.length > 0) {
        event.preventDefault()
        setCheckoutOpen(true)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [items])

  return (
    <>
      <CheckoutModal
        open={checkoutOpen}
        onClose={() =>
          setCheckoutOpen(
            false
          )
        }
      />

      <QuickProductModal
        open={quickOpen}
        onClose={() => setQuickOpen(false)}
        initial={quickProduct || { barcode: '', name: '' }}
        onSaved={() => {
          // after saving, add to cart if product exists
          const saved = products.find((p) => p.barcode === (quickProduct && quickProduct.barcode))
          if (saved) addToCart(saved)
        }}
      />

      <div
        className="
          min-h-screen
          bg-gray-100
          p-6
        "
      >
        <div
          className="
            grid
            grid-cols-[1fr_400px]
            gap-6
          "
        >
          <div
            className="
              bg-white
              rounded-2xl
              border
              p-5
            "
          >
            <h1
              className="
                text-3xl
                font-bold
                mb-5
              "
            >
              Punto de venta
            </h1>

            <div className="flex flex-col gap-3">
              <input
                autoFocus
                value={barcode}
                onChange={(e) =>
                  setBarcode(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleScan(barcode)
                  }
                }}
                placeholder="Escanea producto..."
                className="
                  w-full
                  border-2
                  border-blue-500
                  rounded-2xl
                  p-5
                  text-xl
                  outline-none
                "
              />
              <button
                onClick={() => handleScan(barcode)}
                disabled={!barcode.trim()}
                className="
                  w-full
                  rounded-2xl
                  bg-blue-600
                  text-white
                  py-4
                  text-lg
                  font-semibold
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                Agregar código
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
              <p className="text-lg font-semibold mb-2">Escanea el producto o escribe el código.</p>
              <p className="text-sm">No se muestran todos los productos aquí para que la venta sea más rápida.</p>
            </div>
          </div>

          <div
            className="
              bg-white
              rounded-2xl
              border
              p-5
              flex
              flex-col
              h-[calc(100vh-200px)]
            "
          >
            <div className="mb-5">
              <h2 className="text-2xl font-bold">Carrito</h2>
              <p className="text-sm text-gray-500">Presiona Espacio para cobrar</p>
            </div>

            <div
              className="
                flex-1
                space-y-3
                overflow-y-auto
                pb-5
              "
            >
              {items.map(item => (
                <div
                  key={item.id}
                  className="
                    border
                    rounded-xl
                    p-4
                    flex
                    justify-between
                    items-center
                  "
                >
                  <div>
                    <h3
                      className="
                        font-semibold
                      "
                    >
                      {item.name}
                    </h3>

                    <label className="block text-sm text-gray-500">
                      Cantidad:
                    </label>
                    <input
                      type="number"
                      min={1}
                      step={1}
                      value={item.quantity}
                      onChange={(e) => {
                        const value = Number(e.target.value)

                        if (
                          Number.isInteger(value) &&
                          value >= 1
                        ) {
                          updateQuantity(
                            item.id,
                            value
                          )
                        }
                      }}
                      className="
                        mt-1
                        w-24
                        border
                        rounded-xl
                        p-2
                        text-center
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                      "
                    />
                  </div>

                  <div
                    className="
                      text-right
                    "
                  >
                    <p
                      className="
                        font-bold
                      "
                    >
                      $
                      {formatPrice(
                        item.salePrice *
                          item.quantity
                      )}
                    </p>

                    <button
                      onClick={() =>
                        removeFromCart(
                          item.id
                        )
                      }
                      className="
                        text-red-500
                        text-sm
                        mt-2
                      "
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="
                border-t
                mt-auto
                pt-5
                bg-white
                flex
                items-center
                justify-between
                gap-4
              "
            >
              <div
                className="
                  flex
                  flex-col
                  text-3xl
                  font-bold
                  text-blue-600
                "
              >
                <span className="text-sm text-gray-500 font-normal mb-1">Total</span>
                <span>
                  $
                  {formatPrice(
                    total
                  )}
                </span>
              </div>

              <button
                onClick={() =>
                  setCheckoutOpen(
                    true
                  )
                }
                className="
                  bg-green-600
                  hover:bg-green-700
                  transition
                  text-white
                  rounded-2xl
                  py-5
                  px-8
                  text-xl
                  font-bold
                  whitespace-nowrap
                "
              >
                Cobrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}