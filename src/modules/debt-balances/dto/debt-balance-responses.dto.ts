import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { userSummaryResponseSchema } from '@/users/dto/user-responses.dto'
import { dateTimeCodec, makePaginatedDto } from '@/common/openapi/zod-helpers'

export const debtBalanceResponseSchema = z
  .object({
    id: z.string(),
    debtorUserId: z.string(),
    creditorUserId: z.string(),
    currency: z.string(),
    amount: z.number(),
    createdAt: dateTimeCodec,
    updatedAt: dateTimeCodec,
    debtorUser: userSummaryResponseSchema,
    creditorUser: userSummaryResponseSchema,
  })
  .meta({ id: 'DebtBalanceResponse' })

export class DebtBalanceResponseZodDto extends createZodDto(debtBalanceResponseSchema, {
  codec: true,
}) {}

export class PaginatedDebtBalanceResponseZodDto extends makePaginatedDto(
  'PaginatedDebtBalanceResponse',
  DebtBalanceResponseZodDto
) {}
