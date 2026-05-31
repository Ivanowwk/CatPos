interface Props {
  onNavigate: (page: 'menu' | 'dashboard' | 'pos' | 'products' | 'sales') => void
}

export const MenuPage = ({ onNavigate }: Props) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Menú de la aplicación</h1>
            <p className="text-sm text-gray-500 mt-2">
              Navega entre los módulos activos de CatPos.
            </p>
          </div>

          <button
            onClick={() => onNavigate('dashboard')}
            className="rounded-2xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700 transition"
          >
            Ir al dashboard
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="bg-white rounded-3xl border p-6 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-sm text-gray-500">Punto de venta</p>
            <h2 className="text-2xl font-bold mt-3">POS</h2>
            <p className="text-gray-600 mt-3">
              Vende rápido desde el carrito, escanea códigos y cobra al instante.
            </p>
          </div>
          <button
            onClick={() => onNavigate('pos')}
            className="mt-6 rounded-2xl bg-green-600 px-4 py-3 text-white font-semibold hover:bg-green-700 transition"
          >
            Abrir POS
          </button>
        </div>

        <div className="bg-white rounded-3xl border p-6 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-sm text-gray-500">Productos</p>
            <h2 className="text-2xl font-bold mt-3">Inventario</h2>
            <p className="text-gray-600 mt-3">
              Crea, busca y administra productos con precios, stock y códigos.
            </p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="mt-6 rounded-2xl bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 transition"
          >
            Ver productos
          </button>
        </div>

        <div className="bg-white rounded-3xl border p-6 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-sm text-gray-500">Ventas</p>
            <h2 className="text-2xl font-bold mt-3">Historial</h2>
            <p className="text-gray-600 mt-3">
              Revisa transacciones, totales y detalles de ventas ya realizadas.
            </p>
          </div>
          <button
            onClick={() => onNavigate('sales')}
            className="mt-6 rounded-2xl bg-purple-600 px-4 py-3 text-white font-semibold hover:bg-purple-700 transition"
          >
            Ver historial
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Acceso directo</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <button
            onClick={() => onNavigate('menu')}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left hover:bg-slate-100 transition"
          >
            Menú
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4 text-left hover:bg-blue-100 transition"
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('products')}
            className="rounded-2xl border border-green-200 bg-green-50 px-4 py-4 text-left hover:bg-green-100 transition"
          >
            Productos
          </button>
        </div>
      </div>
    </div>
  )
}
