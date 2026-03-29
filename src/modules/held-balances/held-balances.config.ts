import { Prisma } from '@/generated/prisma'
import { createResourceConfig } from '@/common/utils/create-resource-config'

export const heldBalancesResourceConfig = createResourceConfig<
  Prisma.HeldBalanceScalarFieldEnum,
  Prisma.HeldBalanceWhereInput
>({
  allowedSortBy: [
    'id',
    'ownerUserId',
    'holderUserId',
    'currency',
    'amount',
    'createdAt',
    'updatedAt',
  ],
  allowedSelect: ['id', 'ownerUserId', 'holderUserId', 'currency', 'amount', 'createdAt', 'updatedAt'],
  defaultSelect: ['id', 'ownerUserId', 'holderUserId', 'currency', 'amount', 'createdAt', 'updatedAt'],
  enforcedSelect: ['id'],
  defaultSortBy: 'updatedAt',
  defaultSortOrder: 'desc',
  tieBreakerField: 'id',
  tieBreakerOrder: 'asc',
})
