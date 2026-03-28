import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { TransactionType, TransferMethod } from '@/generated/prisma'
import { emptyToUndefined } from '@/common/utils/zod'

export const createTransactionSchema = z.object({
  type: z.enum(TransactionType),
  method: z.preprocess(emptyToUndefined, z.enum(TransferMethod).optional()),
  ownerUserId: z.string().trim().min(1),
  fromUserId: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  toUserId: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  beneficiaryUserId: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  fromAccountId: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  toAccountId: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  fromCounterpartyId: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  toCounterpartyId: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  amount: z.string().trim().min(1),
  currency: z.string().trim().min(1),
  referenceCode: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  note: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  occurredAt: z.coerce.date(),
})

export class CreateTransactionDto extends createZodDto(createTransactionSchema) {}
