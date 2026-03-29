import { Prisma } from '@/generated/prisma'
import { createResourceConfig } from '@/common/utils/create-resource-config'

export const institutionAccountsResourceConfig = createResourceConfig<
  Prisma.InstitutionAccountScalarFieldEnum,
  Prisma.InstitutionAccountWhereInput
>({
  allowedSortBy: [
    'id',
    'userId',
    'institutionId',
    'currency',
    'title',
    'isActive',
    'createdAt',
    'updatedAt',
  ],
  allowedSelect: [
    'id',
    'userId',
    'institutionId',
    'currency',
    'title',
    'accountIdentifier',
    'isActive',
    'note',
    'createdAt',
    'updatedAt',
  ],
  defaultSelect: [
    'id',
    'userId',
    'institutionId',
    'currency',
    'title',
    'accountIdentifier',
    'isActive',
    'note',
    'createdAt',
    'updatedAt',
  ],
  enforcedSelect: ['id'],
  defaultSortBy: 'createdAt',
  defaultSortOrder: 'desc',
  tieBreakerField: 'id',
  tieBreakerOrder: 'asc',
})
