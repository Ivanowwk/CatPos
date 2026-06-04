import { useEffect, useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'

import { useFiadosStore } from '../store/fiados.store'
import { useSalesStore } from '../../sales/store/sales.store'

const statusOptions = ['Pendiente', 'Pagado'] as const

export const FiadosPage = () => {
  const { fiados, addFiado, updateFiado, markPaid, removeFiado } = useFiadosStore()
  const { addSale } = useSalesStore()

  const [client, setClient] = useState('')
  const [concept, setConcept] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState<typeof statusOptions[number]>('Pendiente')
  const [items, setItems] = useState('')
  const [search, setSearch] = useState('')
  const [confirmPaidId, setConfirmPaidId] = useState<string | null>(null)
  const [editingFiadoId, setEditingFiadoId] = useState<string | null>(null)
  const [expandedClientIds, setExpandedClientIds] = useState<string[]>([])

  const numericAmount = Number(amount.replace(/\./g, '')) || 0

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('es-CO').format(value)

  const formatNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (!numbers) return ''
    return new Intl.NumberFormat('es-CO').format(Number(numbers))
  }

  const filteredFiados = useMemo(
    () =>
      fiados.filter(
        (fiado) =>
          fiado.client
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          fiado.clientId
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          fiado.concept
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (fiado.items ?? [])
            .some((item) => item.toLowerCase().includes(search.toLowerCase()))
      ),
    [fiados, search]
  )

  const groupedFiadosByClient = useMemo(() => {
    return Object.values(
      filteredFiados.reduce<Record<string, {
        clientId: string
        client: string
        fiados: typeof fiados
      }>>((acc, fiado) => {
        if (!acc[fiado.clientId]) {
          acc[fiado.clientId] = {
            clientId: fiado.clientId,
            client: fiado.client,
            fiados: []
          }
        }

        acc[fiado.clientId].fiados.push(fiado)
        return acc
      }, {})
    )
  }, [filteredFiados, fiados])

  const selectedFiado = editingFiadoId
    ? fiados.find((fiado) => fiado.id === editingFiadoId)
    : null

  useEffect(() => {
    if (!selectedFiado) return
    setItems(selectedFiado.items?.join('\n') ?? '')
    setClient(selectedFiado.client)
    setConcept(selectedFiado.concept)
    setAmount(formatNumber(String(selectedFiado.amount)))
    setDueDate(selectedFiado.dueDate)
    setStatus(selectedFiado.status)
  }, [selectedFiado])

  const totalOwed = useMemo(
    () => fiados.reduce((acc, fiado) => acc + fiado.amount, 0),
    [fiados]
  )

  const submitFiado = () => {
    if (!client || !concept || numericAmount <= 0 || !dueDate) return

    const normalizedClient = client.trim()
    const existingClient = fiados.find(
      (fiado) => fiado.client.toLowerCase() === normalizedClient.toLowerCase()
    )

    const clientId =
      existingClient?.clientId ?? selectedFiado?.clientId ?? uuid()

    const parsedItems = items
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean)

    if (editingFiadoId && selectedFiado) {
      updateFiado(editingFiadoId, {
        client,
        clientId,
        concept,
        items: parsedItems,
        amount: numericAmount,
        dueDate,
        status
      })
    } else {
      addFiado({
        id: uuid(),
        client,
        clientId,
        concept,
        items: parsedItems,
        amount: numericAmount,
        dueDate,
        status,
        createdAt: new Date().toISOString()
      })
    }

    setClient('')
    setConcept('')
    setItems('')
    setAmount('')
    setDueDate('')
    setStatus('Pendiente')
    setEditingFiadoId(null)
  }

  const handleConfirmPaid = (fiado: any) => {
    markPaid(fiado.id)

    addSale({
      id: uuid(),
      createdAt: new Date().toISOString(),
      paymentMethod: 'Fiado Pagado',
      total: fiado.amount,
      received: fiado.amount,
      change: 0,
      items: []
    })

    setConfirmPaidId(null)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Fiados</h1>
            <p className="text-sm text-gray-500 mt-2">
              Registra y controla cuentas por cobrar con el mismo diseño limpio de la aplicación.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-50 p-4 text-slate-700">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total adeudado</p>
            <p className="mt-2 text-3xl font-bold">${formatPrice(totalOwed)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_1fr]">
        <div className="bg-white rounded-3xl border shadow-sm p-6 space-y-5">
          <h2 className="text-2xl font-bold">Nuevo fiado</h2>

          <div>
            <p className="text-sm text-gray-500 mb-2">Cliente</p>
            <input
              value={client}
                onChange={(e) => setClient(e.target.value.slice(0, 100))}
                maxLength={100}
              placeholder="Juan Pérez"
              className="w-full border rounded-xl p-3 outline-none focus:border-blue-500"
            />
            <p className="mt-2 text-xs text-gray-400">
              Si el nombre coincide con un cliente ya existente, se reutiliza su ID y cualquier nuevo concepto se guarda en la misma cuenta.
            </p>
            {editingFiadoId && (
              <p className="mt-2 text-xs text-blue-600">
                Editando fiado: guarda los cambios o cancela para crear uno nuevo.
              </p>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Concepto</p>
            <input
                value={concept}
                onChange={(e) => setConcept(e.target.value.slice(0, 200))}
                maxLength={200}
              placeholder="Compra de abarrotes"
              className="w-full border rounded-xl p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Implementos / items comprados</p>
            <textarea
              value={items}
              onChange={(e) => setItems(e.target.value)}
              placeholder="1 libra de arroz\n2 rollos de papel\n1 kilo de azúcar"
              className="w-full min-h-[120px] resize-none border rounded-2xl p-3 outline-none focus:border-blue-500"
            />
            <p className="mt-2 text-xs text-gray-400">Agrega cada producto en una línea para mantener el historial claro.</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Monto</p>
            <input
              value={amount}
              onFocus={(e) => e.target.select()}
              onChange={(e) => {
                const numbers = e.target.value.replace(/\D/g, '').slice(0, 12)
                setAmount(numbers ? new Intl.NumberFormat('es-CO').format(Number(numbers)) : '')
              }}
              placeholder="50.000"
              className="w-full border rounded-xl p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Fecha de pago</p>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border rounded-xl p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Estado</p>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof statusOptions[number])}
              className="w-full border rounded-xl p-3 outline-none focus:border-blue-500"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <button
              onClick={submitFiado}
              className="w-full rounded-2xl bg-green-600 py-4 text-white font-semibold hover:bg-green-700 transition"
            >
              {editingFiadoId ? 'Guardar cambios' : 'Registrar fiado'}
            </button>
            {editingFiadoId && (
              <button
                onClick={() => {
                  setEditingFiadoId(null)
                  setClient('')
                  setConcept('')
                  setItems('')
                  setAmount('')
                  setDueDate('')
                  setStatus('Pendiente')
                }}
                className="w-full rounded-2xl border border-slate-200 py-4 text-slate-700 hover:bg-slate-50 transition"
              >
                Cancelar edición
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl border shadow-sm p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold">Cuentas fiadas</h2>
              <p className="text-sm text-gray-500 mt-2">Busca por cliente o concepto y controla los estados.</p>
            </div>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="border rounded-2xl px-4 py-3 outline-none focus:border-blue-500 w-full max-w-sm"
            />
          </div>

          {filteredFiados.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
              No hay fiados registrados.
            </div>
          ) : (
            <div className="space-y-4">
              {groupedFiadosByClient.map((group) => {
                const clientTotal = group.fiados.reduce((acc, fiado) => acc + fiado.amount, 0)
                const isExpanded = expandedClientIds.includes(group.clientId)

                return (
                  <div key={group.clientId} className="rounded-3xl border p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Cliente</p>
                        <h3 className="text-xl font-bold">{group.client}</h3>
                        <p className="text-xs text-gray-400 mt-1">ID: {group.clientId}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm text-gray-500 sm:grid-cols-3">
                        <div>
                          <p>Fiados</p>
                          <p className="font-medium">{group.fiados.length}</p>
                        </div>
                        <div>
                          <p>Total adeudado</p>
                          <p className="font-medium">${formatPrice(clientTotal)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setExpandedClientIds((current) =>
                                current.includes(group.clientId)
                                  ? current.filter((id) => id !== group.clientId)
                                  : [...current, group.clientId]
                              )
                            }}
                            className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700 hover:bg-blue-100 transition"
                          >
                            {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
                          </button>
                          <button
                            onClick={() => {
                              setEditingFiadoId(null)
                              setClient(group.client)
                              setConcept('')
                              setAmount('')
                              setDueDate('')
                              setStatus('Pendiente')
                            }}
                            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
                          >
                            Agregar concepto
                          </button>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-5 space-y-4">
                        {group.fiados.map((fiado) => (
                          <div key={fiado.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="text-sm text-gray-500">Concepto</p>
                                <p className="font-medium">{fiado.concept}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-3 text-sm text-gray-500 sm:grid-cols-3">
                                <div>
                                  <p>Vence</p>
                                  <p className="font-medium">{fiado.dueDate}</p>
                                </div>
                                <div>
                                  <p>Monto</p>
                                  <p className="font-medium">${formatPrice(fiado.amount)}</p>
                                </div>
                                <div>
                                  <p>Status</p>
                                  <span
                                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                                      fiado.status === 'Pagado'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                    }`}
                                  >
                                    {fiado.status}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {(fiado.items ?? []).length > 0 ? (
                              <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4">
                                <p className="text-sm text-gray-500 mb-2">Implementos comprados</p>
                                <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                                  {(fiado.items ?? []).map((item, index) => (
                                    <li key={`${fiado.id}-item-${index}`}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
                                No se registraron implementos para este fiado.
                              </div>
                            )}

                            <div className="mt-4 flex flex-wrap items-center gap-3">
                              <button
                                onClick={() => {
                                  setEditingFiadoId(fiado.id)
                                  setClient(fiado.client)
                                  setConcept(fiado.concept)
                                  setAmount(formatPrice(fiado.amount))
                                  setDueDate(fiado.dueDate)
                                  setStatus(fiado.status)
                                }}
                                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => fiado.status !== 'Pagado' && setConfirmPaidId(fiado.id)}
                                disabled={fiado.status === 'Pagado'}
                                className={`rounded-2xl px-4 py-2 text-sm transition ${
                                  fiado.status === 'Pagado'
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                              >
                                {fiado.status === 'Pagado' ? 'Pagado' : 'Marcar pagado'}
                              </button>
                              <button
                                onClick={() => removeFiado(fiado.id)}
                                className="rounded-2xl border border-red-200 px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {confirmPaidId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md">
            <h2 className="text-2xl font-bold mb-4">Confirmar pago de fiado</h2>
            {fiados.map(fiado =>
              fiado.id === confirmPaidId ? (
                <div key={fiado.id} className="mb-6">
                  <div className="bg-blue-50 rounded-2xl p-4 mb-4">
                    <p className="text-sm text-blue-700">Cliente</p>
                    <p className="font-semibold text-lg">{fiado.client}</p>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-4 mb-6">
                    <p className="text-sm text-green-700">Monto a registrar</p>
                    <p className="font-bold text-2xl text-green-600">${formatPrice(fiado.amount)}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setConfirmPaidId(null)}
                      className="flex-1 rounded-2xl border px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleConfirmPaid(fiado)}
                      className="flex-1 rounded-2xl bg-green-600 px-4 py-3 text-white hover:bg-green-700 transition font-semibold"
                    >
                      Confirmar pago
                    </button>
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  )
}
