import { useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'

import { useFiadosStore } from '../store/fiados.store'
import { useSalesStore } from '../../sales/store/sales.store'

const statusOptions = ['Pendiente', 'Pagado'] as const

export const FiadosPage = () => {
  const { fiados, addFiado, markPaid, removeFiado } = useFiadosStore()
  const { addSale } = useSalesStore()

  const [client, setClient] = useState('')
  const [concept, setConcept] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState<typeof statusOptions[number]>('Pendiente')
  const [search, setSearch] = useState('')
  const [confirmPaidId, setConfirmPaidId] = useState<string | null>(null)

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
          fiado.concept
            .toLowerCase()
            .includes(search.toLowerCase())
      ),
    [fiados, search]
  )

  const totalOwed = useMemo(
    () => fiados.reduce((acc, fiado) => acc + fiado.amount, 0),
    [fiados]
  )

  const submitFiado = () => {
    if (!client || !concept || numericAmount <= 0 || !dueDate) return

    addFiado({
      id: uuid(),
      client,
      concept,
      amount: numericAmount,
      dueDate,
      status,
      createdAt: new Date().toISOString()
    })

    setClient('')
    setConcept('')
    setAmount('')
    setDueDate('')
    setStatus('Pendiente')
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
              onChange={(e) => setClient(e.target.value)}
              placeholder="Juan Pérez"
              className="w-full border rounded-xl p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Concepto</p>
            <input
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="Compra de abarrotes"
              className="w-full border rounded-xl p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Monto</p>
            <input
              value={amount}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setAmount(formatNumber(e.target.value))}
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

          <button
            onClick={submitFiado}
            className="w-full rounded-2xl bg-green-600 py-4 text-white font-semibold hover:bg-green-700 transition"
          >
            Registrar fiado
          </button>
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
              {filteredFiados.map((fiado) => (
                <div key={fiado.id} className="rounded-3xl border p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start">
                    <div>
                      <p className="text-sm text-gray-500">Cliente</p>
                      <h3 className="text-xl font-bold">{fiado.client}</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-500">
                      <div>
                        <p>Vence</p>
                        <p className="font-medium">{fiado.dueDate}</p>
                      </div>
                      <div>
                        <p>Monto</p>
                        <p className="font-medium">${formatPrice(fiado.amount)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-gray-600">{fiado.concept}</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          fiado.status === 'Pagado'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {fiado.status}
                      </span>

                      <button
                        onClick={() => setConfirmPaidId(fiado.id)}
                        className="rounded-2xl bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700 transition"
                      >
                        Marcar pagado
                      </button>

                      <button
                        onClick={() => removeFiado(fiado.id)}
                        className="rounded-2xl border border-red-200 px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
