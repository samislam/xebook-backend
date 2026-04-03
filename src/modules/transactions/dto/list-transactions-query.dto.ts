import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { omitEmptyField } from '@/common/utils/zod'
import { TransactionType, TransferMethod } from '@/generated/prisma'
import { paginationQuerySchema } from '@/common/dtos/pagination-query.dto'

export const listTransactionsQuerySchema = paginationQuerySchema.extend({
  ownerUserId: z
    .preprocess(omitEmptyField, z.string().trim().min(1).optional())
    .describe('Filter by transaction owner user.'),
  initiatorUserId: z
    .preprocess(omitEmptyField, z.string().trim().min(1).optional())
    .describe('Filter by authenticated user who created or initiated the transaction.'),
  fromUserId: z
    .preprocess(omitEmptyField, z.string().trim().min(1).optional())
    .describe('Filter by internal source user.'),
  toUserId: z
    .preprocess(omitEmptyField, z.string().trim().min(1).optional())
    .describe('Filter by internal destination user.'),
  beneficiaryUserId: z
    .preprocess(omitEmptyField, z.string().trim().min(1).optional())
    .describe('Filter by internal beneficiary user.'),
  fromAccountId: z
    .preprocess(omitEmptyField, z.string().trim().min(1).optional())
    .describe('Filter by source institution account.'),
  toAccountId: z
    .preprocess(omitEmptyField, z.string().trim().min(1).optional())
    .describe('Filter by destination institution account.'),
  fromCounterpartyId: z
    .preprocess(omitEmptyField, z.string().trim().min(1).optional())
    .describe('Filter by external source counterparty.'),
  toCounterpartyId: z
    .preprocess(omitEmptyField, z.string().trim().min(1).optional())
    .describe('Filter by external destination counterparty.'),
  currency: z
    .preprocess(omitEmptyField, z.string().trim().min(1).optional())
    .describe('Filter by currency code.'),
  type: z
    .preprocess(omitEmptyField, z.enum(TransactionType).optional())
    .describe('Filter by transaction type.'),
  method: z
    .preprocess(omitEmptyField, z.enum(TransferMethod).optional())
    .describe('Filter by transfer method.'),
  occurredFrom: z
    .preprocess(omitEmptyField, z.string().optional())
    .describe('Filter transactions that occurred at or after this ISO-8601 timestamp.'),
  occurredTo: z
    .preprocess(omitEmptyField, z.string().optional())
    .describe('Filter transactions that occurred at or before this ISO-8601 timestamp.'),
})

export class ListTransactionsQueryDto extends createZodDto(listTransactionsQuerySchema) {}
