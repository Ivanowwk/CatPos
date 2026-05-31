import { useMemo } from 'react'

import { useCartStore } from '../../pos/store/cart.store'
import { useFiadosStore } from '../../fiados/store/fiados.store'
import { useProductsStore } from '../../products/store/products.store'
import { useSalesStore } from '../../sales/store/sales.store'
import { useSuppliersStore } from '../../suppliers/store/suppliers.store'

interface Props {
  onNavigate: (page: 'dashboard' | 'pos' | 'products' | 'sales' | 'fiados' | 'suppliers') => void
}

export const DashboardPage = ({ onNavigate }: Props) => {
  const { items } = useCartStore()
  const { fiados } = useFiadosStore()
  const { products } = useProductsStore()
  const { sales } = useSalesStore()
  const { receipts, suppliers } = useSuppliersStore()

  const currentDate = new Date()
  const todayKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`
  const currentDayLabel = currentDate.toLocaleDateString('es-CO', {
    weekday: 'long',
    day: '2-digit',
    month: 'long'
  })

  const todayReceipts = useMemo(
    () => receipts.filter((receipt) => receipt.receivedAt === todayKey),
    [receipts, todayKey]
  )

  const upcomingReceipts = useMemo(
    () =>
      receipts
        .filter((receipt) => receipt.receivedAt >= todayKey)
        .sort((a, b) => {
          const dateA = new Date(`${a.receivedAt}T${a.deliveryTime || '00:00'}`)
          const dateB = new Date(`${b.receivedAt}T${b.deliveryTime || '00:00'}`)
          return dateA.getTime() - dateB.getTime()
        })
        .slice(0, 4),
    [receipts, todayKey]
  )

  const lowStockCount = useMemo(
    () => products.filter((product) => product.stock <= 5).length,
    [products]
  )

  const totalSalesAmount = useMemo(
    () => sales.reduce((acc, sale) => acc + sale.total, 0),
    [sales]
  )

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-2">
              Resumen general de tu punto de venta.
            </p>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="bg-white rounded-3xl border p-6 shadow-sm">
          <p className="text-sm text-gray-500">Productos</p>
          <p className="mt-3 text-4xl font-bold">{products.length}</p>
          <p className="text-sm text-gray-500 mt-2">Artículos disponibles</p>
        </div>

        <div className="bg-white rounded-3xl border p-6 shadow-sm">
          <p className="text-sm text-gray-500">Ventas</p>
          <p className="mt-3 text-4xl font-bold">{sales.length}</p>
          <p className="text-sm text-gray-500 mt-2">Transacciones registradas</p>
        </div>

        <div className="bg-white rounded-3xl border p-6 shadow-sm">
          <p className="text-sm text-gray-500">Carrito</p>
          <p className="mt-3 text-4xl font-bold">{items.length}</p>
          <p className="text-sm text-gray-500 mt-2">Productos en venta pendiente</p>
        </div>

        <div className="bg-white rounded-3xl border p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total ventas</p>
          <p className="mt-3 text-4xl font-bold">${new Intl.NumberFormat('es-CO').format(totalSalesAmount)}</p>
          <p className="text-sm text-gray-500 mt-2">Monto total registrado</p>
        </div>

        <div className="bg-white rounded-3xl border p-6 shadow-sm">
          <p className="text-sm text-gray-500">Fiados</p>
          <p className="mt-3 text-4xl font-bold">{fiados.length}</p>
          <p className="text-sm text-gray-500 mt-2">Cuentas por cobrar registradas</p>
        </div>

        <div className="bg-white rounded-3xl border p-6 shadow-sm">
          <p className="text-sm text-gray-500">Proveedores</p>
          <p className="mt-3 text-4xl font-bold">{suppliers.length}</p>
          <p className="text-sm text-gray-500 mt-2">Proveedores registrados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="bg-white rounded-3xl border p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Horario</p>
              <h2 className="text-2xl font-bold">Pedidos para hoy</h2>
              <p className="text-sm text-gray-500">Hoy es {currentDayLabel}</p>
            </div>
            <span className="rounded-3xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              {todayReceipts.length} pedido(s)
            </span>
          </div>

          {todayReceipts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
              No hay pedidos programados para hoy.
            </div>
          ) : (
            <div className="space-y-4">
              {todayReceipts.map((receipt) => (
                <div
                  key={receipt.id}
                  className="rounded-3xl border p-4 bg-slate-50"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Proveedor</p>
                      <p className="font-semibold">{receipt.supplierName}</p>
                    </div>
                    <span className="rounded-2xl bg-blue-100 px-3 py-1 text-sm text-blue-700">
                      {receipt.deliveryTime}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-500">Factura {receipt.invoiceNumber}</p>
                </div>
              ))}
            </div>
          )}

          {upcomingReceipts.length > 0 && (
            <div className="mt-6">
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
                Próximos pedidos
              </p>
              <div className="space-y-3 mt-3">
                {upcomingReceipts.map((receipt) => (
                  <div
                    key={receipt.id}
                    className="rounded-3xl border p-4 bg-slate-50"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-500">{receipt.receivedAt}</p>
                        <p className="font-semibold">{receipt.supplierName}</p>
                      </div>
                      <span className="rounded-2xl bg-slate-100 px-3 py-1 text-sm text-slate-700">
                        {receipt.deliveryTime}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Factura {receipt.invoiceNumber}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-3xl border p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Alertas rápidas</h2>
          <ul className="space-y-3 text-gray-600">
            <li>
              <strong>{lowStockCount}</strong> producto(s) con stock bajo (≤ 5).
            </li>
            <li>
              <strong>{items.reduce((acc, item) => acc + item.quantity, 0)}</strong> unidades en el carrito.
            </li>
            <li>
              Última venta: <strong>{sales[0]?.id ?? 'N/A'}</strong>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl border p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Accesos rápidos</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => onNavigate('pos')}
              className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4 text-left hover:bg-blue-100 transition"
            >
              Punto de venta
            </button>
            <button
              onClick={() => onNavigate('products')}
              className="rounded-2xl border border-green-200 bg-green-50 px-4 py-4 text-left hover:bg-green-100 transition"
            >
              Administrar productos
            </button>
            <button
              onClick={() => onNavigate('sales')}
              className="rounded-2xl border border-purple-200 bg-purple-50 px-4 py-4 text-left hover:bg-purple-100 transition"
            >
              Historial de ventas
            </button>
            <button
              onClick={() => onNavigate('suppliers')}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left hover:bg-slate-100 transition"
            >
              Proveedores
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
