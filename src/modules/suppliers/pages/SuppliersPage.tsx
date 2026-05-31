import { useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'

import { useProductsStore } from '../../products/store/products.store'
import { useSuppliersStore } from '../store/suppliers.store'

const statusOptions = ['Pendiente', 'Recibido'] as const

export const SuppliersPage = () => {
  const {
    suppliers,
    receipts,
    addSupplier,
    removeSupplier,
    addReceipt,
    markReceiptReceived,
    removeReceipt
  } = useSuppliersStore()

  const {
    products,
    addProduct,
    updateProduct
  } = useProductsStore()

  const [supplierName, setSupplierName] = useState('')
  const [supplierContact, setSupplierContact] = useState('')
  const [deliverySchedule, setDeliverySchedule] = useState('Lunes a viernes 9:00 - 18:00')

  const [selectedSupplier, setSelectedSupplier] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [receivedAt, setReceivedAt] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')
  const [receiptStatus, setReceiptStatus] = useState<typeof statusOptions[number]>('Pendiente')
  const [itemName, setItemName] = useState('')
  const [itemBarcode, setItemBarcode] = useState('')
  const [itemCategory, setItemCategory] = useState('Otros')
  const [itemQuantity, setItemQuantity] = useState('')
  const [itemUnitCost, setItemUnitCost] = useState('')
  const [itemList, setItemList] = useState<{
    id: string
    name: string
    barcode?: string
    category?: string
    quantity: number
    unitCost: number
    totalCost: number
  }[]>([])

  const [search, setSearch] = useState('')

  const receiptTotal = useMemo(
    () => itemList.reduce((acc, item) => acc + item.totalCost, 0),
    [itemList]
  )

  const filteredReceipts = useMemo(
    () =>
      receipts.filter(
        (receipt) =>
          receipt.invoiceNumber
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          receipt.supplierName
            .toLowerCase()
            .includes(search.toLowerCase())
      ),
    [receipts, search]
  )

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('es-CO').format(value)

  const addItem = () => {
    const quantity = Number(itemQuantity) || 0
    const unitCost = Number(itemUnitCost.replace(/\./g, '')) || 0

    if (!itemName || quantity <= 0 || unitCost <= 0) return

    setItemList((current) => [
      ...current,
      {
        id: uuid(),
        name: itemName,
        barcode: itemBarcode || undefined,
        category: itemCategory || 'Otros',
        quantity,
        unitCost,
        totalCost: quantity * unitCost
      }
    ])

    setItemName('')
    setItemBarcode('')
    setItemCategory('Otros')
    setItemQuantity('')
    setItemUnitCost('')
  }

  const submitSupplier = () => {
    if (!supplierName) return

    addSupplier({
      id: uuid(),
      name: supplierName,
      contact: supplierContact,
      deliverySchedule
    })

    setSupplierName('')
    setSupplierContact('')
    setDeliverySchedule('Lunes a viernes 9:00 - 18:00')
  }

  const submitReceipt = () => {
    if (!selectedSupplier || !invoiceNumber || !receivedAt || !deliveryTime || itemList.length === 0) return

    const supplier = suppliers.find((supplier) => supplier.id === selectedSupplier)
    if (!supplier) return

    itemList.forEach((item) => {
      const barcode = item.barcode?.trim()
      const existingProduct = barcode
        ? products.find((product) => product.barcode === barcode)
        : products.find(
            (product) =>
              product.name.toLowerCase() ===
              item.name.toLowerCase()
          )

      if (existingProduct) {
        const salePrice = Math.round(
          item.unitCost +
            (existingProduct.profitMargin / 100) *
              item.unitCost
        )

        updateProduct(existingProduct.id, {
          stock: existingProduct.stock + item.quantity,
          costPrice: item.unitCost,
          salePrice,
          category:
            existingProduct.category || item.category || 'Otros',
          barcode: existingProduct.barcode || barcode
        })
      } else {
        addProduct({
          id: uuid(),
          name: item.name,
          barcode: barcode || undefined,
          category: item.category || 'Otros',
          costPrice: item.unitCost,
          profitMargin: 30,
          salePrice: Math.round(item.unitCost * 1.3),
          stock: item.quantity
        })
      }
    })

    addReceipt({
      id: uuid(),
      supplierId: supplier.id,
      supplierName: supplier.name,
      invoiceNumber,
      receivedAt,
      deliveryTime,
      status: receiptStatus,
      items: itemList,
      total: receiptTotal
    })

    setInvoiceNumber('')
    setReceivedAt('')
    setDeliveryTime('')
    setReceiptStatus('Pendiente')
    setItemList([])
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Proveedores</h1>
            <p className="text-sm text-gray-500 mt-2">
              Administra proveedores, horarios de entrega y facturas de lo que dejaron.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-50 p-5 text-slate-700">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Facturas</p>
            <p className="mt-2 text-3xl font-bold">{receipts.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_1fr]">
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border shadow-sm p-6 space-y-5">
            <h2 className="text-2xl font-bold">Registrar proveedor</h2>
            <div>
              <p className="text-sm text-gray-500 mb-2">Nombre del proveedor</p>
              <input
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="Distribuciones ABC"
                className="w-full border rounded-xl p-3 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Contacto</p>
              <input
                value={supplierContact}
                onChange={(e) => setSupplierContact(e.target.value)}
                placeholder="319 555 0123"
                className="w-full border rounded-xl p-3 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Horario de entrega</p>
              <input
                value={deliverySchedule}
                onChange={(e) => setDeliverySchedule(e.target.value)}
                placeholder="Lunes a viernes 9:00 - 18:00"
                className="w-full border rounded-xl p-3 outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={submitSupplier}
              className="w-full rounded-2xl bg-blue-600 py-4 text-white font-semibold hover:bg-blue-700 transition"
            >
              Guardar proveedor
            </button>
          </div>

          <div className="bg-white rounded-3xl border shadow-sm p-6 space-y-5">
            <h2 className="text-2xl font-bold">Registrar factura</h2>
            <div>
              <p className="text-sm text-gray-500 mb-2">Proveedor</p>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="w-full border rounded-xl p-3 outline-none focus:border-blue-500"
              >
                <option value="">Selecciona un proveedor</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Número de factura</p>
              <input
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="FAC-2026-001"
                className="w-full border rounded-xl p-3 outline-none focus:border-blue-500"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500 mb-2">Fecha recibida</p>
                <input
                  type="date"
                  value={receivedAt}
                  onChange={(e) => setReceivedAt(e.target.value)}
                  className="w-full border rounded-xl p-3 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Hora de entrega</p>
                <input
                  type="time"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full border rounded-xl p-3 outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Estado</p>
              <select
                value={receiptStatus}
                onChange={(e) => setReceiptStatus(e.target.value as typeof statusOptions[number])}
                className="w-full border rounded-xl p-3 outline-none focus:border-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Agregar item recibido</p>
              <div className="grid gap-4 sm:grid-cols-3 mt-3">
                <input
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Producto"
                  className="border rounded-xl p-3 outline-none focus:border-blue-500"
                />
                <input
                  value={itemQuantity}
                  onChange={(e) => setItemQuantity(e.target.value)}
                  placeholder="Cantidad"
                  className="border rounded-xl p-3 outline-none focus:border-blue-500"
                />
                <input
                  value={itemUnitCost}
                  onChange={(e) => setItemUnitCost(e.target.value)}
                  placeholder="Costo unitario"
                  className="border rounded-xl p-3 outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3 mt-3">
                <input
                  value={itemBarcode}
                  onChange={(e) => setItemBarcode(e.target.value)}
                  placeholder="Código de barras"
                  className="border rounded-xl p-3 outline-none focus:border-blue-500"
                />
                <select
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value)}
                  className="border rounded-xl p-3 outline-none focus:border-blue-500"
                >
                  <option>Bebidas</option>
                  <option>Alimentos</option>
                  <option>Hogar</option>
                  <option>Oficina</option>
                  <option>Otros</option>
                </select>
                <div className="rounded-xl border border-dashed border-slate-200 p-3 text-sm text-slate-500">
                  El producto se guardará en inventario o actualizará el stock si ya existe.
                </div>
              </div>
              <button
                onClick={addItem}
                className="mt-4 rounded-2xl bg-slate-900 px-5 py-3 text-white font-semibold hover:bg-slate-800 transition"
              >
                Añadir item
              </button>
            </div>
            {itemList.length > 0 && (
              <div className="rounded-3xl border p-4 space-y-3">
                {itemList.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} x ${formatPrice(item.unitCost)}
                      </p>
                    </div>
                    <p className="font-semibold">${formatPrice(item.totalCost)}</p>
                  </div>
                ))}
                <div className="border-t pt-3 flex items-center justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${formatPrice(receiptTotal)}</span>
                </div>
              </div>
            )}
            <button
              onClick={submitReceipt}
              className="w-full rounded-2xl bg-green-600 py-4 text-white font-semibold hover:bg-green-700 transition"
            >
              Guardar factura
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border shadow-sm p-6 space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Facturas de proveedores</h2>
              <p className="text-sm text-gray-500 mt-2">Busca por proveedor o número de factura.</p>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar factura..."
              className="w-full max-w-sm border rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {filteredReceipts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
              No hay facturas registradas.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReceipts.map((receipt) => (
                <div key={receipt.id} className="rounded-3xl border p-5 space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Proveedor</p>
                      <h3 className="text-xl font-bold">{receipt.supplierName}</h3>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <p className="text-sm text-gray-500">Factura</p>
                        <p className="font-medium">{receipt.invoiceNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fecha</p>
                        <p className="font-medium">{receipt.receivedAt}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Hora</p>
                        <p className="font-medium">{receipt.deliveryTime}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      {receipt.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3">
                          <span>{item.name}</span>
                          <span className="font-semibold">${formatPrice(item.totalCost)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-3xl border p-4 bg-slate-50">
                      <p className="text-sm text-gray-500">Estado</p>
                      <p className="mt-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                        {receipt.status}
                      </p>
                      <div className="mt-4 flex flex-col gap-3">
                        <button
                          onClick={() => markReceiptReceived(receipt.id)}
                          className="rounded-2xl bg-green-600 px-4 py-3 text-white font-semibold hover:bg-green-700 transition"
                        >
                          Marcar recibido
                        </button>
                        <button
                          onClick={() => removeReceipt(receipt.id)}
                          className="rounded-2xl border border-red-200 px-4 py-3 text-red-700 hover:bg-red-50 transition"
                        >
                          Eliminar factura
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Total recibido</span>
                    <span>${formatPrice(receipt.total)}</span>
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
