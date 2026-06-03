export interface Fiado {
  id: string

  client: string

  clientId: string

  concept: string

  amount: number

  dueDate: string

  status: 'Pendiente' | 'Pagado'

  createdAt: string
}
