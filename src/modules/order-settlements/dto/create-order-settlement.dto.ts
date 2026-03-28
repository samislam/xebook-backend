import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { SettlementKind, SettlementStatus, TransferMethod } from '@/generated/prisma'
import { emptyToUndefined } from '@/common/utils/zod'

export const createOrderSettlementSchema = z.object({
  orderId: z.string().trim().min(1),
  kind: z.enum(SettlementKind),
  status: z.preprocess(emptyToUndefined, z.enum(SettlementStatus).optional()),
  payerUserId: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  payeeUserId: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  beneficiaryUserId: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  toCounterpartyId: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  toAccountId: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  fromAccountId: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  method: z.preprocess(emptyToUndefined, z.enum(TransferMethod).optional()),
  currency: z.string().trim().min(1),
  amount: z.string().trim().min(1),
  note: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  dueAt: z.preprocess(emptyToUndefined, z.string().optional()),
  paidAt: z.preprocess(emptyToUndefined, z.string().optional()),
})

export class CreateOrderSettlementDto extends createZodDto(createOrderSettlementSchema) {}
