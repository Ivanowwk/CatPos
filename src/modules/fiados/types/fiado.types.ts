export interface Fiado {
  id: string

  client: string

  clientId: string

  concept: string

  items?: string[]

  amount: number

  dueDate: string

  status: 'Pendiente' | 'Pagado'

  createdAt: string
}
