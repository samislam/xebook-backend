import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { omitEmptyField } from '@/common/utils/zod'
import { TransactionType, TransferMethod } from '@/generated/prisma'

export const createTransactionSchema = z.object({
  type: z.enum(TransactionType),
  method: z.preprocess(omitEmptyField, z.enum(TransferMethod).optional()),
  ownerUserId: z.string().trim().min(1),
  fromUserId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  toUserId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  beneficiaryUserId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  fromAccountId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  toAccountId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  fromCounterpartyId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  toCounterpartyId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  amount: z.string().trim().min(1),
  currency: z.string().trim().min(1),
  referenceCode: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  note: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  occurredAt: z.string(),
})

export class CreateTransactionDto extends createZodDto(createTransactionSchema) {}
