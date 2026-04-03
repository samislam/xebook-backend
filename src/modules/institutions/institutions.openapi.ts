import { CreateInstitutionDto } from '@/institutions/dto/create-institution.dto'
import { UpdateInstitutionDto } from '@/institutions/dto/update-institution.dto'
import { ApiBodyOptions, ApiOperationOptions, ApiParamOptions } from '@nestjs/swagger'

export const institutionsCreateOperation: ApiOperationOptions = {
  summary: 'Create institution',
  description:
    'Create a new institution such as a bank, wallet provider, exchange, or cash office.',
}
export const institutionsCreateBody: ApiBodyOptions = { type: CreateInstitutionDto }
export const institutionsListOperation: ApiOperationOptions = {
  summary: 'List institutions',
  description: 'List institutions with pagination and filters.',
}
export const institutionsFindOneOperation: ApiOperationOptions = {
  summary: 'Get institution by ID',
  description: 'Fetch one institution by id.',
}
export const institutionsUpdateOperation: ApiOperationOptions = {
  summary: 'Update institution by ID',
  description: 'Update one institution.',
}
export const institutionsUpdateBody: ApiBodyOptions = { type: UpdateInstitutionDto }
export const institutionsRemoveOperation: ApiOperationOptions = {
  summary: 'Delete institution by ID',
  description: 'Hard delete one institution when foreign-key constraints allow it.',
}
export const institutionIdParam: ApiParamOptions = {
  name: 'id',
  description: 'Institution id',
}
