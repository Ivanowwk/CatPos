import {
  useMemo,
  useState
} from 'react'

import {
  useProductsStore
} from '../../products/store/products.store'

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
    removeFromCart
  } = useCartStore()

  const [barcode, setBarcode] =
    useState('')

  const [checkoutOpen,
    setCheckoutOpen
  ] = useState(false)

  const handleScan = (
    value: string
  ) => {
    setBarcode(value)

    const product =
      products.find(
        p =>
          p.barcode === value
      )

    if (product) {
      addToCart(product)

      setBarcode('')
    }
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

            <div
              className="
                mt-6
                grid
                grid-cols-3
                gap-4
              "
            >
              {products.map(
                product => (
                  <button
                    key={
                      product.id
                    }
                    onClick={() =>
                      addToCart(
                        product
                      )
                    }
                    className="
                      border
                      rounded-2xl
                      p-4
                      text-left
                      hover:border-blue-500
                      transition
                    "
                  >
                    <h3
                      className="
                        font-bold
                      "
                    >
                      {
                        product.name
                      }
                    </h3>

                    <p
                      className="
                        text-blue-600
                        font-semibold
                        mt-2
                      "
                    >
                      $
                      {formatPrice(
                        product.salePrice
                      )}
                    </p>

                    <p
                      className="
                        text-xs
                        text-gray-400
                        mt-2
                      "
                    >
                      {
                        product.barcode
                      }
                    </p>
                  </button>
                )
              )}
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
            "
          >
            <h2
              className="
                text-2xl
                font-bold
                mb-5
              "
            >
              Carrito
            </h2>

            <div
              className="
                flex-1
                space-y-3
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

                    <p
                      className="
                        text-sm
                        text-gray-500
                      "
                    >
                      Cantidad:
                      {' '}
                      {
                        item.quantity
                      }
                    </p>
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
                mt-5
                pt-5
              "
            >
              <div
                className="
                  flex
                  justify-between
                  text-3xl
                  font-bold
                "
              >
                <span>Total</span>

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
                  w-full
                  mt-5
                  bg-green-600
                  hover:bg-green-700
                  transition
                  text-white
                  rounded-2xl
                  py-5
                  text-xl
                  font-bold
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