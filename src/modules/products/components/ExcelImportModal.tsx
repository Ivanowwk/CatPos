import React, { useState } from 'react'
import { useProductsStore } from '../store/products.store'

interface ImportRow {
  CODE?: string
  BARCODE?: string
  NOMBRE: string
  CANTIDAD?: string
  TIPO?: string
  DESCRIPCION?: string
  'PRECIO COSTO': string | number
  'PRECIO SUGERIDO': string | number
}

interface Props {
  open: boolean
  onClose: () => void
}

export const ExcelImportModal = ({ open, onClose }: Props) => {
  const { addProduct } = useProductsStore()

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<ImportRow[]>([])
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  const parseCSV = (text: string): ImportRow[] => {
    const lines = text.split('\n').filter((line) => line.trim())
    if (lines.length < 2) return []

    const headers = lines[0]
      .split(',')
      .map((h) => h.trim())

    const rows: ImportRow[] = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      
      // Parse CSV respetando comillas
      const values: string[] = []
      let current = ''
      let inQuotes = false

      for (let j = 0; j < line.length; j++) {
        const char = line[j]
        
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim().replace(/^"|"$/g, ''))
          current = ''
        } else {
          current += char
        }
      }
      values.push(current.trim().replace(/^"|"$/g, ''))

      const row: any = {}

      headers.forEach((header, idx) => {
        row[header] = values[idx] || ''
      })

      // Acepta CODE o BARCODE
      const barcode = row.CODE || row.BARCODE
      if (barcode) {
        rows.push(row)
      }
    }

    return rows
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return

    setError('')
    setFile(f)

    try {
      const text = await f.text()

      // Detectar si es CSV o Excel convertido a CSV
      const rows = parseCSV(text)

      if (rows.length === 0) {
        setError('No se encontraron filas válidas')
        return
      }

      setPreview(rows.slice(0, 5)) // preview primeras 5 filas
    } catch (err) {
      setError('Error al leer el archivo: ' + String(err))
    }
  }

  const handleImport = async () => {
    if (!file) return

    setImporting(true)
    try {
      const text = await file.text()
      const rows = parseCSV(text)

      let added = 0
      rows.forEach((row) => {
        const barcode = row.CODE || row.BARCODE
        if (!barcode || !barcode.trim()) return

        const costPrice = Number(row['PRECIO COSTO']) || 0
        const salePrice = Number(row['PRECIO SUGERIDO']) || 0

        const product = {
          id: barcode,
          barcode: barcode,
          name: row.NOMBRE?.trim() || 'Producto sin nombre',
          costPrice,
          salePrice,
          profitMargin: costPrice > 0 ? Math.round(((salePrice - costPrice) / costPrice) * 100) : 0,
          stock: 0,
          category: row.TIPO?.trim(),
          quantity: row.CANTIDAD?.trim(),
          brand: ''
        }

        addProduct(product)
        added++
      })

      setError(`✓ Importados ${added} productos`)
      setTimeout(() => {
        onClose()
        setFile(null)
        setPreview([])
      }, 1500)
    } catch (err) {
      setError('Error al importar: ' + String(err))
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-[600px] max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">Importar productos desde Excel</h3>

        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 font-semibold mb-2">📋 Formato requerido:</p>
          <p className="text-xs text-blue-700 mb-2">Tu archivo CSV/Excel debe tener estas columnas (en este orden):</p>
          <code className="text-xs bg-blue-100 p-2 rounded block mb-2 overflow-x-auto">
            CODE (o BARCODE), NOMBRE, CANTIDAD, TIPO, DESCRIPCION, PRECIO COSTO, PRECIO SUGERIDO
          </code>
          <p className="text-xs text-blue-700">
            ✓ Guarda tu Excel como <strong>CSV (valores separados por comas)</strong><br/>
            ✓ La primera fila debe ser el encabezado exacto<br/>
            ✓ CODE o BARCODE es obligatorio, sin él no se importa la fila<br/>
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-2">
            Selecciona un archivo CSV o Excel
          </label>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="w-full border rounded p-3"
          />
        </div>

        {error && (
          <div
            className={`mb-4 p-3 rounded ${
              error.startsWith('✓') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {error}
          </div>
        )}

        {preview.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Vista previa (primeras 5 filas):</p>
            <div className="overflow-x-auto border rounded">
              <table className="w-full text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">BARCODE</th>
                    <th className="p-2 text-left">NOMBRE</th>
                    <th className="p-2 text-left">PRECIO COSTO</th>
                    <th className="p-2 text-left">PRECIO SUGERIDO</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2">{row.CODE || row.BARCODE}</td>
                      <td className="p-2">{row.NOMBRE}</td>
                      <td className="p-2">${row['PRECIO COSTO']}</td>
                      <td className="p-2">${row['PRECIO SUGERIDO']}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleImport}
            disabled={!file || importing}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {importing ? 'Importando...' : 'Importar'}
          </button>
        </div>
      </div>
    </div>
  )
}
