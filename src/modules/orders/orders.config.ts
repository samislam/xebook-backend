import { Prisma } from '@/generated/prisma'
import { createResourceConfig } from '@/common/utils/create-resource-config'

export const ordersResourceConfig = createResourceConfig<
  Prisma.OrderScalarFieldEnum,
  Prisma.OrderWhereInput
>({
  allowedSortBy: [
    'id',
    'buyerUserId',
    'sellerUserId',
    'baseCurrency',
    'quoteCurrency',
    'status',
    'createdAt',
    'updatedAt',
  ],
  allowedSelect: [
    'id',
    'buyerUserId',
    'sellerUserId',
    'baseCurrency',
    'baseAmount',
    'quoteCurrency',
    'quoteAmount',
    'status',
    'impliedRate',
    'note',
    'createdAt',
    'updatedAt',
  ],
  defaultSelect: [
    'id',
    'buyerUserId',
    'sellerUserId',
    'baseCurrency',
    'baseAmount',
    'quoteCurrency',
    'quoteAmount',
    'status',
    'impliedRate',
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
