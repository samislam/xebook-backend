import { ApiBodyOptions, ApiOperationOptions, ApiParamOptions } from '@nestjs/swagger'
import { CreateOrderSettlementDto } from '@/order-settlements/dto/create-order-settlement.dto'

export const orderSettlementsCreateOperation: ApiOperationOptions = {
  summary: 'Create order settlement',
  description: 'Create a settlement leg for an order and apply settlement-related balance logic.',
}
export const orderSettlementsCreateBody: ApiBodyOptions = { type: CreateOrderSettlementDto }
export const orderSettlementsListOperation: ApiOperationOptions = {
  summary: 'List order settlements',
  description: 'List order settlement rows with pagination and filters.',
}
export const orderSettlementsFindOneOperation: ApiOperationOptions = {
  summary: 'Get order settlement by ID',
  description: 'Fetch one order settlement row by id.',
}
export const orderSettlementIdParam: ApiParamOptions = {
  name: 'id',
  description: 'Order settlement id',
}
