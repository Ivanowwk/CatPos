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

  const weekdays = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo']

  const weeklySchedule = useMemo(
    () =>
      weekdays.map((day) => ({
        day,
        receipts: receipts.filter((receipt) => receipt.deliveryDays.includes(day))
      })),
    [receipts]
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
        <div className="bg-white rounded-3xl border p-6 shadow-sm xl:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Horario</p>
              <h2 className="text-2xl font-bold">Pedidos de la semana</h2>
              <p className="text-sm text-gray-500">Resumen de pedidos programados por día.</p>
            </div>
            <span className="rounded-3xl bg-blue-50 border-0 px-4 py-2 text-sm font-semibold text-blue-700">
              {receipts.length} pedido(s)
            </span>
          </div>

          <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
            {weeklySchedule.map((daySchedule) => (
              <div key={daySchedule.day} className="rounded-3xl border p-4 bg-slate-50 min-h-[180px]">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold">{daySchedule.day}</p>
                  <span className="rounded-full bg-blue-100 border-0 px-3 py-1 text-xs font-semibold text-blue-700">
                    {daySchedule.receipts.length} pedido(s)
                  </span>
                </div>
                {daySchedule.receipts.length === 0 ? (
                  <p className="mt-3 text-sm text-gray-500">Sin pedidos</p>
                ) : (
                  <ul className="mt-3 space-y-2 text-sm text-gray-700">
                    {daySchedule.receipts.slice(0, 2).map((receipt) => (
                      <li key={receipt.id} className="rounded-2xl bg-white p-3 border border-slate-200">
                        <p className="font-semibold">{receipt.supplierName}</p>
                        <p className="text-slate-500">Fac {receipt.invoiceNumber}</p>
                        <p className="text-slate-500">{receipt.deliveryTime}</p>
                      </li>
                    ))}
                    {daySchedule.receipts.length > 2 && (
                      <p className="text-xs text-slate-500">+{daySchedule.receipts.length - 2} más pedidos</p>
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
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
