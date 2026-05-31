export interface Supplier {
  id: string

  name: string

  contact: string

  deliverySchedule: string
}

export interface SupplierReceiptItem {
  id: string

  name: string

  barcode?: string

  category?: string

  quantity: number

  unitCost: number

  totalCost: number
}

export interface SupplierReceipt {
  id: string

  supplierId: string

  supplierName: string

  invoiceNumber: string

  receivedAt: string

  deliveryTime: string

  status: 'Pendiente' | 'Recibido'

  items: SupplierReceiptItem[]

  total: number
}
