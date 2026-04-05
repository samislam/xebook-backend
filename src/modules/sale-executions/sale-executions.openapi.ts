import { CreateSaleExecutionDto } from '@/sale-executions/dto/create-sale-execution.dto'
import { ApiBodyOptions, ApiOperationOptions, ApiParamOptions } from '@nestjs/swagger'

export const saleExecutionsCreateOperation: ApiOperationOptions = {
  summary: 'Create sale execution',
  description:
    'Record a realized sale, consume inventory using FIFO, and compute realized profit when the inventory cost currency matches the sale proceeds currency.',
}
export const saleExecutionsCreateBody: ApiBodyOptions = { type: CreateSaleExecutionDto }
export const saleExecutionsListOperation: ApiOperationOptions = {
  summary: 'List sale executions',
  description:
    'List realized sales, proceeds, fees, and calculated profit with pagination and filters.',
}
export const saleExecutionsFindOneOperation: ApiOperationOptions = {
  summary: 'Get sale execution by ID',
  description: 'Fetch one sale execution and its inventory allocations.',
}
export const saleExecutionIdParam: ApiParamOptions = {
  name: 'id',
  description: 'Sale execution id',
}
