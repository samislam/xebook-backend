import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { TransactionType, TransferMethod } from '@/generated/prisma'
import { paginationQuerySchema } from '@/common/dtos/pagination-query.dto'
import { omitEmptyField } from '@/common/utils/zod'

export const listTransactionsQuerySchema = paginationQuerySchema.extend({
  ownerUserId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  initiatorUserId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  fromUserId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  toUserId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  beneficiaryUserId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  fromAccountId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  toAccountId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  fromCounterpartyId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  toCounterpartyId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  currency: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  type: z.preprocess(omitEmptyField, z.enum(TransactionType).optional()),
  method: z.preprocess(omitEmptyField, z.enum(TransferMethod).optional()),
  occurredFrom: z.preprocess(omitEmptyField, z.string().optional()),
  occurredTo: z.preprocess(omitEmptyField, z.string().optional()),
})

export class ListTransactionsQueryDto extends createZodDto(listTransactionsQuerySchema) {}
