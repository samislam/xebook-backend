import { Prisma } from '@/generated/prisma'
import { createResourceConfig } from '@/common/utils/create-resource-config'

export const rateSnapshotsResourceConfig = createResourceConfig<
  Prisma.RateSnapshotScalarFieldEnum,
  Prisma.RateSnapshotWhereInput
>({
  allowedSortBy: [
    'id',
    'baseCurrency',
    'quoteCurrency',
    'source',
    'capturedAt',
    'createdAt',
    'updatedAt',
  ],
  allowedSelect: [
    'id',
    'baseCurrency',
    'quoteCurrency',
    'rate',
    'source',
    'recorderUserId',
    'note',
    'capturedAt',
    'createdAt',
    'updatedAt',
  ],
  defaultSelect: [
    'id',
    'baseCurrency',
    'quoteCurrency',
    'rate',
    'source',
    'recorderUserId',
    'note',
    'capturedAt',
    'createdAt',
    'updatedAt',
  ],
  enforcedSelect: ['id'],
  defaultSortBy: 'capturedAt',
  defaultSortOrder: 'desc',
  tieBreakerField: 'id',
  tieBreakerOrder: 'asc',
})
