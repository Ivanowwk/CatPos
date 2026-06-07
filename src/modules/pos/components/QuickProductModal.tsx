import React, { useState } from 'react'
import { useProductsStore } from '../../products/store/products.store'

interface Props {
  open: boolean
  onClose: () => void
  initial: {
    barcode: string
    name: string
    brand?: string
    image?: string | null
    quantity?: string | null
    categories?: string[]
    salePrice?: number
    costPrice?: number
    stock?: number
  }
  onSaved?: () => void
}

export const QuickProductModal = ({ open, onClose, initial, onSaved }: Props) => {
  const { addProduct } = useProductsStore()

  const [name, setName] = useState(initial.name)
  const [type, setType] = useState('Bebidas')
  const [costPrice, setCostPrice] = useState(initial.costPrice ? String(initial.costPrice) : '')
  const [salePrice, setSalePrice] = useState(initial.salePrice ? String(initial.salePrice) : '')
  const [profitMargin, setProfitMargin] = useState('30')
  const [stock, setStock] = useState(initial.stock ? String(initial.stock) : '')
  const [lastPriceEdited, setLastPriceEdited] = useState<'cost' | 'sale'>('cost')

  const parseNumber = (value: string) => {
    return Number(value.replace(/\./g, '')) || 0
  }

  const formatNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')

    if (!numbers) return ''

    return new Intl.NumberFormat('es-CO').format(Number(numbers))
  }

  const numericCost = parseNumber(costPrice)
  const numericSale = parseNumber(salePrice)
  const numericMargin = Number(profitMargin) || 0
  const numericStock = parseNumber(stock)

  React.useEffect(() => {
    setName(initial.name)
    setType(initial.categories?.[0] || 'Bebidas')
    setCostPrice(initial.costPrice ? String(initial.costPrice) : '')
    setSalePrice(initial.salePrice ? String(initial.salePrice) : '')
    setProfitMargin('30')
    setStock(initial.stock ? String(initial.stock) : '')
    setLastPriceEdited('cost')
  }, [initial])

  React.useEffect(() => {
    if (lastPriceEdited !== 'cost') return

    if (!costPrice) {
      setSalePrice('')
      return
    }

    const computed = Math.round(numericCost * (1 + numericMargin / 100))
    setSalePrice(computed ? formatNumber(String(computed)) : '')
  }, [costPrice, numericCost, numericMargin, lastPriceEdited])

  React.useEffect(() => {
    if (lastPriceEdited !== 'sale') return

    if (!salePrice) {
      setCostPrice('')
      return
    }

    const computed = numericMargin >= 0 ? Math.round(numericSale / (1 + numericMargin / 100)) : numericSale
    setCostPrice(computed ? formatNumber(String(computed)) : '')
  }, [salePrice, numericSale, numericMargin, lastPriceEdited])

  if (!open) return null

  const submit = () => {
    const cp = parseNumber(costPrice)
    const pm = Number(profitMargin) || 0
    const st = parseNumber(stock)
    const sp = parseNumber(salePrice) || Math.round(cp * (1 + pm / 100))

    if (!name.trim() || cp <= 0 || sp <= 0) return

    addProduct({
      id: initial.barcode,
      name,
      costPrice: cp,
      profitMargin: pm,
      salePrice: sp,
      stock: st,
      barcode: initial.barcode,
      category: type,
      brand: undefined,
      image: null,
      quantity: undefined
    })
    if (onSaved) onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-3xl p-6 w-[420px] shadow-2xl">
        <h3 className="text-2xl font-bold mb-5">Nuevo producto</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del producto</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 100))}
            maxLength={100}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            placeholder="Coca-Cola"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Código de barras</label>
          <input
            value={initial.barcode}
            readOnly
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de producto</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
          >
            <option>Bebidas</option>
            <option>Alimentos</option>
            <option>Limpieza</option>
            <option>Higiene</option>
            <option>Otros</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Precio de compra</label>
          <input
            value={costPrice}
            onChange={(e) => {
              const numbers = e.target.value.replace(/\D/g, '').slice(0, 9)
              setCostPrice(numbers ? new Intl.NumberFormat('es-CO').format(Number(numbers)) : '')
              setLastPriceEdited('cost')
            }}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
            placeholder="5.000"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Precio de venta</label>
          <input
            value={salePrice}
            onChange={(e) => {
              const numbers = e.target.value.replace(/\D/g, '').slice(0, 9)
              setSalePrice(numbers ? new Intl.NumberFormat('es-CO').format(Number(numbers)) : '')
              setLastPriceEdited('sale')
            }}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
            placeholder="6.500"
          />
          {numericSale > 0 && (
            <p className="text-xs text-slate-500 mt-2">
              Precio de compra estimado: $ {formatNumber(String(Math.round(numericSale / (1 + numericMargin / 100))))}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Ganancia %</label>
          <input
            value={profitMargin}
            onChange={(e) => {
              const n = e.target.value.replace(/\D/g, '').slice(0, 3)
              const num = n ? Math.min(500, Number(n)) : 0
              setProfitMargin(String(num))
            }}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
            placeholder="30"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad / Stock</label>
          <input
            value={stock}
            onChange={(e) => {
              const numbers = e.target.value.replace(/\D/g, '').slice(0, 7)
              setStock(numbers ? new Intl.NumberFormat('es-CO').format(Number(numbers)) : '')
            }}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none"
            placeholder="10"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
            Cancelar
          </button>
          <button onClick={submit} className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white">
            Guardar producto
          </button>
        </div>
      </div>
    </div>
  )
}
