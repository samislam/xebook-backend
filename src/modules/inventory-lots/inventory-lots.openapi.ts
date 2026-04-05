import { CreateInventoryLotDto } from '@/inventory-lots/dto/create-inventory-lot.dto'
import { ApiBodyOptions, ApiOperationOptions, ApiParamOptions } from '@nestjs/swagger'

export const inventoryLotsCreateOperation: ApiOperationOptions = {
  summary: 'Create inventory lot',
  description:
    'Record acquired inventory, such as buying USDT from an internal user, with the total cost kept for later FIFO profit calculation.',
}
export const inventoryLotsCreateBody: ApiBodyOptions = { type: CreateInventoryLotDto }
export const inventoryLotsListOperation: ApiOperationOptions = {
  summary: 'List inventory lots',
  description: 'List inventory lots and remaining quantities with pagination and filters.',
}
export const inventoryLotsFindOneOperation: ApiOperationOptions = {
  summary: 'Get inventory lot by ID',
  description: 'Fetch one inventory lot and its sale allocations.',
}
export const inventoryLotIdParam: ApiParamOptions = {
  name: 'id',
  description: 'Inventory lot id',
}
