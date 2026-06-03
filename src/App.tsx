import { useMemo, useState } from 'react'

import { DashboardPage } from './modules/app/pages/DashboardPage'
import { FiadosPage } from './modules/fiados/pages/FiadosPage'
import { POSPage } from './modules/pos/pages/POSPage'
import { ProductsPage } from './modules/products/pages/ProductsPage'
import { SalesHistoryPage } from './modules/sales/pages/SalesHistoryPage'
import { SuppliersPage } from './modules/suppliers/pages/SuppliersPage'
import { ClockBadge } from './modules/app/components/ClockBadge'
import { useCartStore } from './modules/pos/store/cart.store'
import { useFiadosStore } from './modules/fiados/store/fiados.store'
import { useProductsStore } from './modules/products/store/products.store'
import { useSalesStore } from './modules/sales/store/sales.store'
import { useSuppliersStore } from './modules/suppliers/store/suppliers.store'

const pages = [
  { id: 'dashboard', title: 'Dashboard' },
  { id: 'pos', title: 'Punto de venta' },
  { id: 'products', title: 'Productos' },
  { id: 'sales', title: 'Historial' },
  { id: 'fiados', title: 'Fiados' },
  { id: 'suppliers', title: 'Proveedores' }
] as const

type Page = (typeof pages)[number]['id']

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  const cartItems = useCartStore((state) => state.items.length)
  const productsCount = useProductsStore((state) => state.products.length)
  const salesCount = useSalesStore((state) => state.sales.length)
  const fiadosCount = useFiadosStore((state) => state.fiados.length)
  const suppliersCount = useSuppliersStore((state) => state.suppliers.length)

  const pageTitle = useMemo(() => {
    const page = pages.find((item) => item.id === currentPage)
    return page?.title ?? 'CatPos'
  }, [currentPage])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white/80 border-slate-200 border-b backdrop-blur-xl sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">CatPos</p>
            <h1 className="text-3xl font-bold">{pageTitle}</h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => setCurrentPage(page.id)}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  currentPage === page.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {page.title}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ClockBadge />
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            <span>Productos: {productsCount}</span>
            <span>Ventas: {salesCount}</span>
            <span>Fiados: {fiadosCount}</span>
            <span>Proveedores: {suppliersCount}</span>
            <span>Carrito: {cartItems}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        {currentPage === 'dashboard' && <DashboardPage onNavigate={setCurrentPage} />}
        {currentPage === 'pos' && <POSPage />}
        {currentPage === 'products' && <ProductsPage />}
        {currentPage === 'sales' && <SalesHistoryPage />}
        {currentPage === 'fiados' && <FiadosPage />}
        {currentPage === 'suppliers' && <SuppliersPage />}
      </main>
    </div>
  )
}

export default App