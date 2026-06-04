export interface SupplierDeliveryDay {
  day: string
  label: string
  active: boolean
  from: string
  to: string
}

export interface Supplier {
  id: string

  name: string

  contact: string

  deliverySchedule: SupplierDeliveryDay[]
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

  deliveryDays: string[]

  status: 'Pendiente' | 'Recibido'

  invoicePhotoUrl?: string

  items: SupplierReceiptItem[]

  total: number
}
