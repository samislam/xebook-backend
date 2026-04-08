import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { userSummaryResponseSchema } from '@/users/dto/user-responses.dto'
import { counterpartyResponseSchema } from '@/counterparties/dto/counterparty-responses.dto'
import { dateTimeCodec, makePaginatedDto, makeWrappedDto } from '@/common/openapi/zod-helpers'
import { institutionAccountBaseResponseSchema } from '@/institution-accounts/dto/institution-account-responses.dto'

export const transactionResponseSchema = z
  .object({
    id: z.string(),
    type: z.string(),
    method: z.string(),
    ownerUserId: z.string(),
    initiatorUserId: z.string(),
    fromUserId: z.string().nullable().optional(),
    toUserId: z.string().nullable().optional(),
    beneficiaryUserId: z.string().nullable().optional(),
    fromAccountId: z.string().nullable().optional(),
    toAccountId: z.string().nullable().optional(),
    fromCounterpartyId: z.string().nullable().optional(),
    toCounterpartyId: z.string().nullable().optional(),
    amount: z.number(),
    currency: z.string(),
    referenceCode: z.string().nullable().optional(),
    note: z.string().nullable().optional(),
    occurredAt: dateTimeCodec,
    createdAt: dateTimeCodec,
    updatedAt: dateTimeCodec,
    ownerUser: userSummaryResponseSchema,
    initiatorUser: userSummaryResponseSchema,
    fromUser: userSummaryResponseSchema.nullable().optional(),
    toUser: userSummaryResponseSchema.nullable().optional(),
    beneficiaryUser: userSummaryResponseSchema.nullable().optional(),
    fromAccount: institutionAccountBaseResponseSchema.nullable().optional(),
    toAccount: institutionAccountBaseResponseSchema.nullable().optional(),
    fromCounterparty: counterpartyResponseSchema.nullable().optional(),
    toCounterparty: counterpartyResponseSchema.nullable().optional(),
  })
  .meta({ id: 'TransactionResponse' })

export class TransactionResponseZodDto extends createZodDto(transactionResponseSchema, {
  codec: true,
}) {}

export class WrappedTransactionResponseZodDto extends makeWrappedDto(
  'WrappedTransactionResponse',
  TransactionResponseZodDto
) {}

export class PaginatedTransactionResponseZodDto extends makePaginatedDto(
  'PaginatedTransactionResponse',
  TransactionResponseZodDto
) {}
