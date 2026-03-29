import { Prisma } from '@/generated/prisma'
import { createResourceConfig } from '@/common/utils/create-resource-config'

export const institutionsResourceConfig = createResourceConfig<
  Prisma.InstitutionScalarFieldEnum,
  Prisma.InstitutionWhereInput
>({
  allowedSortBy: ['id', 'name', 'country', 'type', 'createdAt', 'updatedAt'],
  allowedSelect: ['id', 'name', 'country', 'type', 'createdAt', 'updatedAt'],
  defaultSelect: ['id', 'name', 'country', 'type', 'createdAt', 'updatedAt'],
  enforcedSelect: ['id'],
  defaultSortBy: 'createdAt',
  defaultSortOrder: 'desc',
  tieBreakerField: 'id',
  tieBreakerOrder: 'asc',
  search: (searchStr?: string) =>
    searchStr ? { name: { contains: searchStr, mode: 'insensitive' } } : undefined,
})
