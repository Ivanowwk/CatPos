import { useEffect, useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'

// import { useProductsStore } from '../../products/store/products.store'
import { useSuppliersStore } from '../store/suppliers.store'

const statusOptions = ['Pendiente', 'Recibido'] as const

export const SuppliersPage = () => {
  const {
    suppliers,
    receipts,
    addSupplier,
    addReceipt,
    markReceiptReceived,
    removeReceipt
  } = useSuppliersStore()

  

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
  const [invoicePhotoUrl, setInvoicePhotoUrl] = useState('')
  const [receiptStatus, setReceiptStatus] = useState<typeof statusOptions[number]>('Pendiente')

  const [search, setSearch] = useState('')

  useEffect(() => {
    const supplier = suppliers.find((s) => s.id === selectedSupplier)
    if (supplier) {
      const days = supplier.deliverySchedule.filter((d) => d.active).map((d) => d.label)
      setDeliveryDays(days)
      const firstActive = supplier.deliverySchedule.find((d) => d.active)
      setDeliveryTime(firstActive ? firstActive.from : '')
    } else {
      setDeliveryDays([])
      setDeliveryTime('')
    }
  }, [selectedSupplier, suppliers])

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

  const compressImage = async (file: File, maxWidth = 1200, quality = 0.8) => {
    const imageBitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxWidth / imageBitmap.width)
    const width = Math.round(imageBitmap.width * scale)
    const height = Math.round(imageBitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return file

    ctx.drawImage(imageBitmap, 0, 0, width, height)

    return new Promise<File>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: file.type }))
          } else {
            resolve(file)
          }
        },
        file.type,
        quality
      )
    })
  }

  const handleInvoicePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const compressedFile = await compressImage(file)
    const objectUrl = URL.createObjectURL(compressedFile)

    setInvoicePhotoUrl(objectUrl)
    // en producción, este archivo debe subirse a un servidor/almacenamiento externo
    // y guardarse en la base de datos sólo la URL resultante
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
    if (!selectedSupplier || !invoiceNumber || !receivedAt) return

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
      status: invoicePhotoUrl ? 'Recibido' : receiptStatus,
      invoicePhotoUrl,
      items: [],
      total: 0
    })

    setInvoiceNumber('')
    setReceivedAt('')
    setDeliveryTime('')
    setDeliveryDays([])
    setInvoicePhotoUrl('')
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
                onChange={(e) => setSupplierName(e.target.value.slice(0, 100))}
                maxLength={100}
                placeholder="Distribuciones ABC"
                className="w-full border rounded-xl p-3 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Contacto</p>
              <input
                value={supplierContact}
                onChange={(e) => setSupplierContact(e.target.value.slice(0, 20))}
                maxLength={20}
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
                onChange={(e) => setInvoiceNumber(e.target.value.slice(0, 30))}
                maxLength={30}
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
                <p className="text-sm text-gray-500 mb-2">Hora de entrega (según proveedor)</p>
                <input
                  type="time"
                  value={deliveryTime}
                  disabled
                  className="w-full border rounded-xl p-3 outline-none bg-gray-50 disabled:opacity-90"
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
              {selectedSupplier ? (
                <div className="flex flex-wrap gap-2">
                  {deliveryDays.length > 0 ? (
                    deliveryDays.map((d) => (
                      <div key={d} className="rounded-full border px-3 py-1 text-sm bg-blue-50 text-blue-700">
                        {d}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">El proveedor no tiene días activos.</p>
                  )}
                </div>
              ) : (
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
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Foto de la factura</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleInvoicePhotoChange}
                className="w-full rounded-2xl border border-slate-300 p-3 outline-none focus:border-blue-500"
              />
              {invoicePhotoUrl && (
                <img
                  src={invoicePhotoUrl}
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
                      {receipt.invoicePhotoUrl && (
                        <img
                          src={receipt.invoicePhotoUrl}
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
                          onClick={() => receipt.status !== 'Recibido' && markReceiptReceived(receipt.id)}
                          disabled={receipt.status === 'Recibido'}
                          className={`rounded-2xl px-4 py-3 font-semibold transition ${
                            receipt.status === 'Recibido'
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {receipt.status === 'Recibido' ? 'Recibido' : 'Marcar recibido'}
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
