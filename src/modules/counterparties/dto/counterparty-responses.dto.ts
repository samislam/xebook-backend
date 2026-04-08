import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { dateTimeCodec, makePaginatedDto, makeWrappedDto } from '@/common/openapi/zod-helpers'

export const counterpartyResponseSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    phone: z.string().nullable().optional(),
    note: z.string().nullable().optional(),
    createdAt: dateTimeCodec,
    updatedAt: dateTimeCodec,
  })
  .meta({ id: 'CounterpartyResponse' })

export class CounterpartyResponseZodDto extends createZodDto(counterpartyResponseSchema, {
  codec: true,
}) {}

export class WrappedCounterpartyResponseZodDto extends makeWrappedDto(
  'WrappedCounterpartyResponse',
  CounterpartyResponseZodDto
) {}

export class PaginatedCounterpartyResponseZodDto extends makePaginatedDto(
  'PaginatedCounterpartyResponse',
  CounterpartyResponseZodDto
) {}
