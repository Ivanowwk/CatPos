import {
  useMemo,
  useState
} from 'react'

import {
  useCartStore
} from '../store/cart.store'

interface Props {
  open: boolean

  onClose: () => void
}

export const CheckoutModal =
  ({
    open,
    onClose
  }: Props) => {
    const {
      items,
      clearCart
    } = useCartStore()

    const [received, setReceived] =
      useState('')

    const [paymentMethod,
      setPaymentMethod
    ] = useState(
      'Efectivo'
    )

    const total =
      useMemo(() => {
        return items.reduce(
          (
            acc,
            item
          ) =>
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

    const finishSale =
      () => {
        alert(
          'Venta realizada 😭🔥'
        )

        clearCart()

        setReceived('')

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
              onClick={
                onClose
              }
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
                value={received}
                onFocus={(e) =>
                  e.target.select()
                }
                onChange={(e) =>
                  setReceived(
                    formatNumber(
                      e.target.value
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
              className="
                bg-green-50
                rounded-2xl
                p-5
              "
            >
              <p
                className="
                  text-sm
                  text-green-700
                "
              >
                Cambio
              </p>

              <h3
                className="
                  text-4xl
                  font-bold
                  text-green-600
                "
              >
                $
                {formatPrice(
                  change > 0
                    ? change
                    : 0
                )}
              </h3>
            </div>

            <button
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
              "
            >
              Finalizar venta
            </button>
          </div>
        </div>
      </div>
    )
  }