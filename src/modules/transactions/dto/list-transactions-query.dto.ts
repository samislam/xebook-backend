import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { TransactionType, TransferMethod } from '@/generated/prisma'
import { paginationQuerySchema } from '@/common/dtos/pagination-query.dto'
import { emptyToUndefined } from '@/common/utils/zod'

export const listTransactionsQuerySchema = paginationQuerySchema.extend({
  ownerUserId: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  initiatorUserId: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  fromUserId: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  toUserId: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  beneficiaryUserId: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  fromAccountId: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  toAccountId: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  fromCounterpartyId: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  toCounterpartyId: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  currency: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  type: z.preprocess(emptyToUndefined, z.enum(TransactionType).optional()),
  method: z.preprocess(emptyToUndefined, z.enum(TransferMethod).optional()),
  occurredFrom: z.preprocess(emptyToUndefined, z.string().optional()),
  occurredTo: z.preprocess(emptyToUndefined, z.string().optional()),
})

export class ListTransactionsQueryDto extends createZodDto(listTransactionsQuerySchema) {}
