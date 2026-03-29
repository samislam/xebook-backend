import { Prisma } from '@/generated/prisma'
import { createResourceConfig } from '@/common/utils/create-resource-config'

export const counterpartiesResourceConfig = createResourceConfig<
  Prisma.CounterpartyScalarFieldEnum,
  Prisma.CounterpartyWhereInput
>({
  allowedSortBy: ['id', 'name', 'type', 'phone', 'createdAt', 'updatedAt'],
  allowedSelect: ['id', 'name', 'type', 'phone', 'note', 'createdAt', 'updatedAt'],
  defaultSelect: ['id', 'name', 'type', 'phone', 'note', 'createdAt', 'updatedAt'],
  enforcedSelect: ['id'],
  defaultSortBy: 'createdAt',
  defaultSortOrder: 'desc',
  tieBreakerField: 'id',
  tieBreakerOrder: 'asc',
  search: (searchStr?: string) =>
    searchStr ? { name: { contains: searchStr, mode: 'insensitive' } } : undefined,
})
