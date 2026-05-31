import { useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'

import { useSalesStore } from '../../sales/store/sales.store'
import { useCartStore } from '../store/cart.store'
import { useProductsStore } from '../../products/store/products.store'

interface Props {
  open: boolean
  onClose: () => void
}

export const CheckoutModal = ({
  open,
  onClose
}: Props) => {
  const {
    items,
    clearCart
  } = useCartStore()

  const {
    addSale
  } = useSalesStore()

  const {
    updateProduct
  } = useProductsStore()

  const [received, setReceived] =
    useState('')

  const [
    paymentMethod,
    setPaymentMethod
  ] = useState('Efectivo')

  const total = useMemo(() => {
    return items.reduce(
      (acc, item) =>
        acc +
        item.salePrice *
          item.quantity,
      0
    )
  }, [items])

  const numericReceived =
    Number(
      received.replace(
        /\./g,
        ''
      )
    ) || 0

  const change =
    numericReceived - total

  const formatPrice = (
    value: number
  ) => {
    return new Intl.NumberFormat(
      'es-CO'
    ).format(value)
  }

  const formatNumber = (
    value: string
  ) => {
    const numbers =
      value.replace(
        /\D/g,
        ''
      )

    if (!numbers) return ''

    return new Intl.NumberFormat(
      'es-CO'
    ).format(
      Number(numbers)
    )
  }

  const finishSale = () => {
    if (
      items.length === 0
    ) {
      return
    }

    if (
      paymentMethod ===
        'Efectivo' &&
      numericReceived <
        total
    ) {
      return
    }

    const saleReceived =
      paymentMethod ===
      'Efectivo'
        ? numericReceived
        : total

    addSale({
      id: uuid(),

      createdAt:
        new Date().toISOString(),

      paymentMethod,

      total,

      received:
        saleReceived,

      change:
        saleReceived - total,

      items
    })

    items.forEach((item) => {
      updateProduct(item.id, {
        stock: item.stock - item.quantity
      })
    })

    clearCart()

    setReceived('')

    setPaymentMethod(
      'Efectivo'
    )

    onClose()
  }

  if (!open) return null

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/40
        flex
        items-center
        justify-center
        z-50
      "
    >
      <div
        className="
          bg-white
          w-[500px]
          rounded-3xl
          p-6
          shadow-2xl
        "
      >
        <div
          className="
            flex
            justify-between
            items-center
            mb-6
          "
        >
          <h2
            className="
              text-3xl
              font-bold
            "
          >
            Cobrar
          </h2>

          <button
            onClick={() => {
              setReceived('')
              setPaymentMethod(
                'Efectivo'
              )
              onClose()
            }}
            className="
              text-gray-400
              text-2xl
            "
          >
            ×
          </button>
        </div>

        <div
          className="
            bg-blue-50
            rounded-2xl
            p-5
            mb-5
          "
        >
          <p
            className="
              text-sm
              text-blue-700
            "
          >
            Total a pagar
          </p>

          <h3
            className="
              text-5xl
              font-bold
              text-blue-600
            "
          >
            $
            {formatPrice(
              total
            )}
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <p
              className="
                text-sm
                text-gray-500
                mb-2
              "
            >
              Método de pago
            </p>

            <select
              value={
                paymentMethod
              }
              onChange={(e) =>
                setPaymentMethod(
                  e.target.value
                )
              }
              className="
                w-full
                border
                rounded-xl
                p-4
                outline-none
              "
            >
              <option>
                Efectivo
              </option>

              <option>
                Nequi
              </option>

              <option>
                Daviplata
              </option>

              <option>
                Transferencia
              </option>

              <option>
                Tarjeta
              </option>
            </select>
          </div>

          {paymentMethod ===
            'Efectivo' && (
            <>
              <div>
                <p
                  className="
                    text-sm
                    text-gray-500
                    mb-2
                  "
                >
                  Dinero recibido
                </p>

                <input
                  value={
                    received
                  }
                  onFocus={(e) =>
                    e.target.select()
                  }
                  onChange={(e) =>
                    setReceived(
                      formatNumber(
                        e.target
                          .value
                      )
                    )
                  }
                  placeholder="20.000"
                  className="
                    w-full
                    border
                    rounded-xl
                    p-4
                    outline-none
                  "
                />
              </div>

              <div
                className={`
                  rounded-2xl
                  p-5

                  ${
                    change >= 0
                      ? 'bg-green-50'
                      : 'bg-red-50'
                  }
                `}
              >
                <p
                  className={`
                    text-sm

                    ${
                      change >= 0
                        ? 'text-green-700'
                        : 'text-red-700'
                    }
                  `}
                >
                  {change >= 0
                    ? 'Cambio'
                    : 'Faltan'}
                </p>

                <h3
                  className={`
                    text-4xl
                    font-bold

                    ${
                      change >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  `}
                >
                  $
                  {formatPrice(
                    Math.abs(
                      change
                    )
                  )}
                </h3>
              </div>
            </>
          )}

          <button
            disabled={
              items.length ===
                0 ||
              (
                paymentMethod ===
                  'Efectivo' &&
                numericReceived <
                  total
              )
            }
            onClick={
              finishSale
            }
            className="
              w-full
              bg-green-600
              hover:bg-green-700
              transition
              text-white
              rounded-2xl
              py-5
              text-xl
              font-bold
              mt-4
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            Finalizar venta
          </button>
        </div>
      </div>
    </div>
  )
}