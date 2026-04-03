import { CreateCounterpartyDto } from '@/counterparties/dto/create-counterparty.dto'
import { UpdateCounterpartyDto } from '@/counterparties/dto/update-counterparty.dto'
import { ApiBodyOptions, ApiOperationOptions, ApiParamOptions } from '@nestjs/swagger'

export const counterpartiesCreateOperation: ApiOperationOptions = {
  summary: 'Create counterparty',
  description: 'Create a new external counterparty record.',
}
export const counterpartiesCreateBody: ApiBodyOptions = { type: CreateCounterpartyDto }
export const counterpartiesListOperation: ApiOperationOptions = {
  summary: 'List counterparties',
  description: 'List counterparties with pagination and filters.',
}
export const counterpartiesFindOneOperation: ApiOperationOptions = {
  summary: 'Get counterparty by ID',
  description: 'Fetch one counterparty by id.',
}
export const counterpartiesUpdateOperation: ApiOperationOptions = {
  summary: 'Update counterparty by ID',
  description: 'Update one counterparty.',
}
export const counterpartiesUpdateBody: ApiBodyOptions = { type: UpdateCounterpartyDto }
export const counterpartiesRemoveOperation: ApiOperationOptions = {
  summary: 'Delete counterparty by ID',
  description: 'Hard delete one counterparty.',
}
export const counterpartyIdParam: ApiParamOptions = {
  name: 'id',
  description: 'Counterparty id',
}
