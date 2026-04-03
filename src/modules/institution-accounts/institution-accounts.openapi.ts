import { ApiBodyOptions, ApiOperationOptions, ApiParamOptions } from '@nestjs/swagger'
import { CreateInstitutionAccountDto } from '@/institution-accounts/dto/create-institution-account.dto'
import { UpdateInstitutionAccountDto } from '@/institution-accounts/dto/update-institution-account.dto'

export const institutionAccountsCreateOperation: ApiOperationOptions = {
  summary: 'Create institution account',
  description: 'Create a specific institution account for an internal user.',
}
export const institutionAccountsCreateBody: ApiBodyOptions = { type: CreateInstitutionAccountDto }
export const institutionAccountsListOperation: ApiOperationOptions = {
  summary: 'List institution accounts',
  description: 'List institution accounts with pagination and filters.',
}
export const institutionAccountsFindOneOperation: ApiOperationOptions = {
  summary: 'Get institution account by ID',
  description: 'Fetch one institution account by id.',
}
export const institutionAccountsUpdateOperation: ApiOperationOptions = {
  summary: 'Update institution account by ID',
  description: 'Update one institution account.',
}
export const institutionAccountsUpdateBody: ApiBodyOptions = { type: UpdateInstitutionAccountDto }
export const institutionAccountsRemoveOperation: ApiOperationOptions = {
  summary: 'Delete institution account by ID',
  description: 'Hard delete one institution account.',
}
export const institutionAccountIdParam: ApiParamOptions = {
  name: 'id',
  description: 'Institution account id',
}
