import {
  useMemo,
  useState
} from 'react'

import {
  useSalesStore
} from '../store/sales.store'

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('es-CO').format(value)
}

export const SalesHistoryPage = () => {
  const { sales, clearSales } =
    useSalesStore()

  const [search, setSearch] =
    useState('')

  const filteredSales =
    useMemo(() => {
      return sales.filter(
        (sale) =>
          sale.id
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          sale.paymentMethod
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      )
    }, [sales, search])

  return (
    <div
      className="
        p-6
        min-h-screen
        bg-gray-100
      "
    >
      <div
        className="
          flex
          flex-col
          gap-6
        "
      >
        <div
          className="
            bg-white
            rounded-2xl
            border
            shadow-sm
            p-6
          "
        >
          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-4
              mb-6
            "
          >
            <div>
              <h1
                className="
                  text-3xl
                  font-bold
                "
              >
                Historial de ventas
              </h1>

              <p
                className="
                  text-sm
                  text-gray-500
                  mt-2
                "
              >
                {sales.length}{' '}
                registros
              </p>
            </div>

            <div
              className="
                flex
                gap-3
                flex-wrap
              "
            >
              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Buscar por id o método..."
                className="
                  border
                  rounded-xl
                  px-4
                  py-3
                  w-full
                  sm:w-[320px]
                  outline-none
                  focus:border-blue-500
                "
              />

              <button
                onClick={clearSales}
                className="
                  bg-red-600
                  hover:bg-red-700
                  text-white
                  rounded-2xl
                  px-5
                  py-3
                  font-semibold
                "
              >
                Limpiar historial
              </button>
            </div>
          </div>

          {filteredSales.length === 0 ? (
            <div
              className="
                rounded-2xl
                border
                border-dashed
                border-gray-300
                p-10
                text-center
                text-gray-500
              "
            >
              No hay ventas registradas
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSales.map((sale) => (
                <div
                  key={sale.id}
                  className="
                    bg-gray-50
                    rounded-3xl
                    border
                    p-5
                  "
                >
                  <div
                    className="
                      flex
                      flex-col
                      md:flex-row
                      md:items-center
                      md:justify-between
                      gap-4
                      mb-4
                    "
                  >
                    <div>
                      <p
                        className="
                          text-sm
                          text-gray-500
                        "
                      >
                        ID de venta
                      </p>
                      <h2
                        className="
                          text-xl
                          font-bold
                        "
                      >
                        {sale.id}
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Fecha
                        </p>
                        <p className="font-medium">
                          {sale.createdAt}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Total
                        </p>
                        <p className="font-medium">
                          ${formatPrice(sale.total)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Método
                        </p>
                        <p className="font-medium">
                          {sale.paymentMethod}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">
                          Artículos
                        </p>
                        <p className="font-medium">
                          {sale.items.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {sale.items.map((item) => (
                      <div
                        key={item.id}
                        className="
                          rounded-2xl
                          border
                          p-4
                          grid
                          grid-cols-[1fr_auto]
                          gap-3
                          items-center
                        "
                      >
                        <div>
                          <p className="font-semibold">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} x ${formatPrice(item.salePrice)}
                          </p>
                        </div>

                        <p className="font-semibold">
                          ${formatPrice(item.salePrice * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div
                    className="
                      mt-4
                      flex
                      flex-col
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                      gap-4
                    "
                  >
                    <div
                      className="
                        bg-blue-50
                        rounded-2xl
                        p-4
                      "
                    >
                      <p className="text-sm text-blue-700">
                        Recibido
                      </p>
                      <p className="font-semibold">
                        ${formatPrice(sale.received)}
                      </p>
                    </div>

                    <div
                      className="
                        bg-green-50
                        rounded-2xl
                        p-4
                      "
                    >
                      <p className="text-sm text-green-700">
                        Cambio
                      </p>
                      <p className="font-semibold">
                        ${formatPrice(sale.change)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}