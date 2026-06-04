import { useMemo, useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'

import { useSalesStore } from '../../sales/store/sales.store'
import { useFiadosStore } from '../../fiados/store/fiados.store'
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
    addFiado,
    fiados
  } = useFiadosStore()

  const {
    updateProduct
  } = useProductsStore()

  const [received, setReceived] =
    useState('')

  const [
    paymentMethod,
    setPaymentMethod
  ] = useState('Efectivo')

  const [client, setClient] = useState('')
  const [concept, setConcept] = useState('')
  const [dueDate, setDueDate] = useState('')

  const [showSuccess, setShowSuccess] =
    useState(false)

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

  useEffect(() => {
    if (!open) return

    const handler = (event: KeyboardEvent) => {
      if (event.code !== 'Space' && event.key !== ' ') return

      const target = event.target as HTMLElement | null
      if (
        target?.closest('input, textarea, select') ||
        target?.isContentEditable
      ) {
        return
      }

      event.preventDefault()
      finishSale()
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, items.length, paymentMethod, numericReceived, total])

  const hasStockIssue = items.some(
    (item) => item.quantity > item.stock
  )

  const finishSale = () => {
    if (
      items.length === 0 ||
      hasStockIssue
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

    if (
      paymentMethod === 'Fiado' &&
      (!client.trim() ||
        !concept.trim() ||
        !dueDate.trim())
    ) {
      return
    }

    const saleReceived =
      paymentMethod ===
      'Efectivo'
        ? numericReceived
        : paymentMethod === 'Fiado'
        ? 0
        : total

    const saleChange =
      paymentMethod === 'Efectivo'
        ? saleReceived - total
        : 0

    if (paymentMethod === 'Fiado') {
      const normalizedClient = client.trim().toLowerCase()
      const existingClient = fiados.find(
        (fiado) =>
          fiado.client.toLowerCase() ===
          normalizedClient
      )
      const clientId = existingClient?.clientId ?? uuid()

      const fiadoItems = items.map((item) => `${item.quantity} x ${item.name}`)

      addFiado({
        id: uuid(),
        client: client.trim(),
        clientId,
        concept: concept.trim(),
        items: fiadoItems,
        amount: total,
        dueDate,
        status: 'Pendiente',
        createdAt: new Date().toISOString()
      })
    }

    addSale({
      id: uuid(),

      createdAt:
        new Date().toISOString(),

      paymentMethod,

      total,

      received:
        saleReceived,

      change:
        saleChange,

      items
    })

    items.forEach((item) => {
      updateProduct(item.id, {
        stock: item.stock - item.quantity
      })
    })

    clearCart()

    setReceived('')
    setClient('')
    setConcept('')
    setDueDate('')

    setPaymentMethod(
      'Efectivo'
    )

    setShowSuccess(true)

    setTimeout(() => {
      setShowSuccess(false)
      onClose()
    }, 2000)
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
      {showSuccess ? (
        <div
          className="
            bg-white
            w-[500px]
            rounded-3xl
            p-6
            shadow-2xl
            flex
            flex-col
            items-center
            justify-center
            py-16
          "
        >
          <div
            className="
              text-6xl
              text-green-600
              mb-4
            "
          >
            ✓
          </div>

          <h2
            className="
              text-3xl
              font-bold
              text-center
              mb-2
            "
          >
            ¡Venta realizada!
          </h2>

          <p
            className="
              text-gray-500
              text-center
            "
          >
            La venta se ha completado exitosamente
          </p>
        </div>
      ) : (
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
          <div>
            <h2
              className="
                text-3xl
                font-bold
              "
            >
              Cobrar
            </h2>
            <p
              className="
                text-sm
                text-gray-500
                mt-1
              "
            >
              Presiona Espacio para finalizar
            </p>
          </div>

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

              <option>
                Fiado
              </option>
            </select>
          </div>

          {paymentMethod === 'Fiado' && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Cliente</p>
                <input
                  value={client}
                  onChange={(e) => setClient(e.target.value.slice(0, 100))}
                  maxLength={100}
                  placeholder="Nombre del cliente"
                  className="w-full border rounded-xl p-4 outline-none"
                />
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Concepto</p>
                <input
                  value={concept}
                  onChange={(e) => setConcept(e.target.value.slice(0, 200))}
                  maxLength={200}
                  placeholder="Descripción del fiado"
                  className="w-full border rounded-xl p-4 outline-none"
                />
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Fecha límite para pagar</p>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) =>
                    setDueDate(e.target.value)
                  }
                  className="w-full border rounded-xl p-4 outline-none"
                />
              </div>

              <div className="rounded-2xl bg-yellow-50 p-4 text-yellow-700">
                <p className="text-sm">
                  El fiado quedará registrado como pendiente y se sumará al cliente si ya existe.
                </p>
              </div>
            </div>
          )}

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
                  value={received}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const numbers = e.target.value.replace(/\D/g, '').slice(0, 12)
                    setReceived(numbers ? new Intl.NumberFormat('es-CO').format(Number(numbers)) : '')
                  }}
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

              {hasStockIssue && (
                <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                  La cantidad de algún producto supera el stock disponible. Ajusta el carrito antes de continuar.
                </div>
              )}
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
              ) ||
              (
                paymentMethod === 'Fiado' &&
                (!client.trim() ||
                  !concept.trim() ||
                  !dueDate.trim())
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
      )}
    </div>
  )
}