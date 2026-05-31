import {
  useMemo,
  useState
} from 'react'

import {
  ProductForm
} from '../components/ProductForm'

import {
  useProductsStore
} from '../store/products.store'

export const ProductsPage =
  () => {
    const {
      products,
      removeProduct
    } = useProductsStore()

    const [search, setSearch] =
      useState('')

    const [categoryFilter, setCategoryFilter] =
      useState('Todos')

    const filteredProducts =
      useMemo(() => {
        return products.filter(
          product => {
            const matchesSearch =
              product.name
                .toLowerCase()
                .includes(
                  search.toLowerCase()
                ) ||
              product.barcode
                ?.includes(search)

            const matchesCategory =
              categoryFilter === 'Todos' ||
              product.category ===
                categoryFilter

            return matchesSearch && matchesCategory
          }
        )
      }, [
        products,
        search,
        categoryFilter
      ])

    const formatPrice = (
      value: number
    ) => {
      return new Intl.NumberFormat(
        'es-CO'
      ).format(value)
    }

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
            grid
            grid-cols-[380px_1fr]
            gap-6
          "
        >
          <ProductForm />

          <div
            className="
              bg-white
              rounded-2xl
              border
              shadow-sm
              p-5
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                mb-5
              "
            >
              <div>
                <h2
                  className="
                    text-2xl
                    font-bold
                  "
                >
                  Productos
                </h2>

                <p
                  className="
                    text-gray-500
                    text-sm
                  "
                >
                  {
                    filteredProducts.length
                  }{' '}
                  productos
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Buscar nombre o código..."
                  className="
                    border
                    rounded-xl
                    px-4
                    py-3
                    w-full
                    max-w-[260px]
                    outline-none
                    focus:border-blue-500
                  "
                />

                <select
                  value={categoryFilter}
                  onChange={(e) =>
                    setCategoryFilter(
                      e.target.value
                    )
                  }
                  className="
                    border
                    rounded-xl
                    px-4
                    py-3
                    w-full
                    max-w-[200px]
                    outline-none
                    focus:border-blue-500
                  "
                >
                  <option>Todos</option>
                  <option>Bebidas</option>
                  <option>Alimentos</option>
                  <option>Hogar</option>
                  <option>Oficina</option>
                  <option>Otros</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredProducts.map(
                product => (
                  <div
                    key={
                      product.id
                    }
                    className="
                      border
                      rounded-2xl
                      p-5
                      flex
                      items-center
                      justify-between
                      hover:border-blue-300
                      transition
                    "
                  >
                    <div>
                      <h3
                        className="
                          text-lg
                          font-bold
                        "
                      >
                        {
                          product.name
                        }
                      </h3>

                      <p
                        className="
                          text-sm
                          text-gray-400
                          mt-1
                        "
                      >
                        Código:
                        {' '}
                        {
                          product.barcode ||
                          'Sin código'
                        }
                      </p>

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          mt-3
                          flex-wrap
                        "
                      >
                        <span
                          className="
                            bg-blue-100
                            text-blue-700
                            px-3
                            py-1
                            rounded-full
                            text-sm
                            font-medium
                          "
                        >
                          Venta:
                          {' '}
                          $
                          {formatPrice(
                            product.salePrice
                          )}
                        </span>

                        <span
                          className="
                            bg-gray-100
                            text-gray-700
                            px-3
                            py-1
                            rounded-full
                            text-sm
                          "
                        >
                          Compra:
                          {' '}
                          $
                          {formatPrice(
                            product.costPrice
                          )}
                        </span>

                        <span
                          className="
                            bg-green-100
                            text-green-700
                            px-3
                            py-1
                            rounded-full
                            text-sm
                          "
                        >
                          +
                          {
                            product.profitMargin
                          }
                          %
                        </span>

                        <span
                          className="
                            bg-slate-100
                            text-slate-700
                            px-3
                            py-1
                            rounded-full
                            text-sm
                            font-medium
                          "
                        >
                          {
                            product.category ||
                            'General'
                          }
                        </span>

                        <span
                          className={`
                            px-3
                            py-1
                            rounded-full
                            text-sm
                            font-medium

                            ${
                              product.stock <=
                              5
                                ? `
                                  bg-red-100
                                  text-red-700
                                `
                                : `
                                  bg-yellow-100
                                  text-yellow-700
                                `
                            }
                          `}
                        >
                          Stock:
                          {' '}
                          {
                            product.stock
                          }
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        removeProduct(
                          product.id
                        )
                      }
                      className="
                        bg-red-500
                        hover:bg-red-600
                        transition
                        text-white
                        px-5
                        py-3
                        rounded-xl
                        font-semibold
                      "
                    >
                      Eliminar
                    </button>
                  </div>
                )
              )}

              {filteredProducts.length ===
                0 && (
                <div
                  className="
                    border-2
                    border-dashed
                    rounded-2xl
                    p-10
                    text-center
                    text-gray-400
                  "
                >
                  No se encontraron
                  productos
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }