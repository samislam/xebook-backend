import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { userSummaryResponseSchema } from '@/users/dto/user-responses.dto'
import { dateTimeCodec, makePaginatedDto } from '@/common/openapi/zod-helpers'

export const heldBalanceResponseSchema = z
  .object({
    id: z.string(),
    ownerUserId: z.string(),
    holderUserId: z.string(),
    currency: z.string(),
    amount: z.number(),
    createdAt: dateTimeCodec,
    updatedAt: dateTimeCodec,
    ownerUser: userSummaryResponseSchema,
    holderUser: userSummaryResponseSchema,
  })
  .meta({ id: 'HeldBalanceResponse' })

export class HeldBalanceResponseZodDto extends createZodDto(heldBalanceResponseSchema, {
  codec: true,
}) {}

export class PaginatedHeldBalanceResponseZodDto extends makePaginatedDto(
  'PaginatedHeldBalanceResponse',
  HeldBalanceResponseZodDto
) {}
