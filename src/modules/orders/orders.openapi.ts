import { CreateOrderDto } from '@/orders/dto/create-order.dto'
import { UpdateOrderDto } from '@/orders/dto/update-order.dto'
import { ApiBodyOptions, ApiOperationOptions, ApiParamOptions } from '@nestjs/swagger'

export const ordersCreateOperation: ApiOperationOptions = {
  summary: 'Create order',
  description: 'Create a trade agreement between two internal users.',
}
export const ordersCreateBody: ApiBodyOptions = { type: CreateOrderDto }
export const ordersListOperation: ApiOperationOptions = {
  summary: 'List orders',
  description: 'List orders with pagination and filters.',
}
export const ordersFindOneOperation: ApiOperationOptions = {
  summary: 'Get order by ID',
  description: 'Fetch one order by id.',
}
export const ordersUpdateOperation: ApiOperationOptions = {
  summary: 'Update order by ID',
  description: 'Update mutable order fields such as status or note.',
}
export const ordersUpdateBody: ApiBodyOptions = { type: UpdateOrderDto }
export const orderIdParam: ApiParamOptions = {
  name: 'id',
  description: 'Order id',
}
