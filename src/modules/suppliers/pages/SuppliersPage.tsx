import { ChangeEvent, useMemo, useState } from 'react'
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
  const [deliverySchedule, setDeliverySchedule] = useState([
    { day: 'monday', label: 'Lunes', active: true, from: '09:00', to: '18:00' },
    { day: 'tuesday', label: 'Martes', active: true, from: '09:00', to: '18:00' },
    { day: 'wednesday', label: 'Miércoles', active: true, from: '09:00', to: '18:00' },
    { day: 'thursday', label: 'Jueves', active: true, from: '09:00', to: '18:00' },
    { day: 'friday', label: 'Viernes', active: true, from: '09:00', to: '18:00' },
    { day: 'saturday', label: 'Sábado', active: false, from: '09:00', to: '18:00' },
    { day: 'sunday', label: 'Domingo', active: false, from: '09:00', to: '18:00' }
  ])

  const [selectedSupplier, setSelectedSupplier] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [receivedAt, setReceivedAt] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')
  const [deliveryDays, setDeliveryDays] = useState<string[]>([])
  const [invoicePhoto, setInvoicePhoto] = useState('')
  const [receiptStatus, setReceiptStatus] = useState<typeof statusOptions[number]>('Pendiente')

  const [search, setSearch] = useState('')

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

  const toggleScheduleDay = (day: string) => {
    setDeliverySchedule((current) =>
      current.map((item) =>
        item.day === day
          ? { ...item, active: !item.active }
          : item
      )
    )
  }

  const updateScheduleTime = (day: string, field: 'from' | 'to', value: string) => {
    setDeliverySchedule((current) =>
      current.map((item) =>
        item.day === day ? { ...item, [field]: value } : item
      )
    )
  }

  const handleInvoicePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setInvoicePhoto(reader.result)
      }
    }
    reader.readAsDataURL(file)
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
    setDeliverySchedule([
      { day: 'monday', label: 'Lunes', active: true, from: '09:00', to: '18:00' },
      { day: 'tuesday', label: 'Martes', active: true, from: '09:00', to: '18:00' },
      { day: 'wednesday', label: 'Miércoles', active: true, from: '09:00', to: '18:00' },
      { day: 'thursday', label: 'Jueves', active: true, from: '09:00', to: '18:00' },
      { day: 'friday', label: 'Viernes', active: true, from: '09:00', to: '18:00' },
      { day: 'saturday', label: 'Sábado', active: false, from: '09:00', to: '18:00' },
      { day: 'sunday', label: 'Domingo', active: false, from: '09:00', to: '18:00' }
    ])
  }

  const submitReceipt = () => {
    if (!selectedSupplier || !invoiceNumber || !receivedAt || !deliveryTime) return

    const supplier = suppliers.find((supplier) => supplier.id === selectedSupplier)
    if (!supplier) return

    addReceipt({
      id: uuid(),
      supplierId: supplier.id,
      supplierName: supplier.name,
      invoiceNumber,
      receivedAt,
      deliveryTime,
      deliveryDays,
      status: receiptStatus,
      invoicePhoto,
      items: [],
      total: 0
    })

    setInvoiceNumber('')
    setReceivedAt('')
    setDeliveryTime('')
    setDeliveryDays([])
    setInvoicePhoto('')
    setReceiptStatus('Pendiente')
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
              <div className="grid gap-3">
                {deliverySchedule.map((day) => (
                  <div key={day.day} className="flex flex-col gap-2 rounded-2xl border border-slate-200 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <input
                          type="checkbox"
                          checked={day.active}
                          onChange={() => toggleScheduleDay(day.day)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        {day.label}
                      </label>
                      <div className="text-sm text-slate-500">{day.active ? 'Activo' : 'Inactivo'}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="time"
                        value={day.from}
                        disabled={!day.active}
                        onChange={(e) => updateScheduleTime(day.day, 'from', e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                      />
                      <input
                        type="time"
                        value={day.to}
                        disabled={!day.active}
                        onChange={(e) => updateScheduleTime(day.day, 'to', e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
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
            <div>
              <p className="text-sm text-gray-500 mb-2">Días programados</p>
              <div className="grid grid-cols-3 gap-2">
                {['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'].map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() =>
                      setDeliveryDays((current) =>
                        current.includes(day)
                          ? current.filter((d) => d !== day)
                          : [...current, day]
                      )
                    }
                    className={`rounded-2xl border px-3 py-2 text-sm font-medium transition ${
                      deliveryDays.includes(day)
                        ? 'border-blue-600 bg-blue-100 text-blue-700'
                        : 'border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Foto de la factura</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleInvoicePhotoChange}
                className="w-full rounded-2xl border border-slate-300 p-3 outline-none focus:border-blue-500"
              />
              {invoicePhoto && (
                <img
                  src={invoicePhoto}
                  alt="Factura"
                  className="mt-3 h-40 w-full rounded-2xl object-cover border border-slate-200"
                />
              )}
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Solo se guardará la foto de la factura como pedido, sin registrar productos.</p>
            </div>
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
                      {receipt.deliveryDays.length > 0 && (
                        <div className="rounded-2xl bg-blue-50 p-3 text-sm text-blue-700">
                          <p className="font-semibold">Días programados</p>
                          <p>{receipt.deliveryDays.join(', ')}</p>
                        </div>
                      )}
                      {receipt.invoicePhoto && (
                        <img
                          src={receipt.invoicePhoto}
                          alt="Factura"
                          className="mt-3 h-40 w-full rounded-2xl object-cover border border-slate-200"
                        />
                      )}
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
