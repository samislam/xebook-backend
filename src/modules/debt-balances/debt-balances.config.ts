import { Prisma } from '@/generated/prisma'
import { createResourceConfig } from '@/common/utils/create-resource-config'

export const debtBalancesResourceConfig = createResourceConfig<
  Prisma.DebtBalanceScalarFieldEnum,
  Prisma.DebtBalanceWhereInput
>({
  allowedSortBy: [
    'id',
    'debtorUserId',
    'creditorUserId',
    'currency',
    'amount',
    'createdAt',
    'updatedAt',
  ],
  allowedSelect: [
    'id',
    'debtorUserId',
    'creditorUserId',
    'currency',
    'amount',
    'createdAt',
    'updatedAt',
  ],
  defaultSelect: [
    'id',
    'debtorUserId',
    'creditorUserId',
    'currency',
    'amount',
    'createdAt',
    'updatedAt',
  ],
  enforcedSelect: ['id'],
  defaultSortBy: 'updatedAt',
  defaultSortOrder: 'desc',
  tieBreakerField: 'id',
  tieBreakerOrder: 'asc',
})
