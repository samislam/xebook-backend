import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { dateTimeCodec, makePaginatedDto, makeWrappedDto } from '@/common/openapi/zod-helpers'

export const rateSnapshotResponseSchema = z
  .object({
    id: z.string(),
    baseCurrency: z.string(),
    quoteCurrency: z.string(),
    rate: z.number(),
    source: z.string(),
    recorderUserId: z.string().nullable().optional(),
    note: z.string().nullable().optional(),
    capturedAt: dateTimeCodec,
    createdAt: dateTimeCodec,
    updatedAt: dateTimeCodec,
  })
  .meta({ id: 'RateSnapshotResponse' })

export class RateSnapshotResponseZodDto extends createZodDto(rateSnapshotResponseSchema, {
  codec: true,
}) {}

export class WrappedRateSnapshotResponseZodDto extends makeWrappedDto(
  'WrappedRateSnapshotResponse',
  RateSnapshotResponseZodDto
) {}

export class PaginatedRateSnapshotResponseZodDto extends makePaginatedDto(
  'PaginatedRateSnapshotResponse',
  RateSnapshotResponseZodDto
) {}
