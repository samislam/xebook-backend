import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { SettlementKind, SettlementStatus, TransferMethod } from '@/generated/prisma'
import { omitEmptyField } from '@/common/utils/zod'

export const createOrderSettlementSchema = z.object({
  orderId: z.string().trim().min(1),
  kind: z.enum(SettlementKind),
  status: z.preprocess(omitEmptyField, z.enum(SettlementStatus).optional()),
  payerUserId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  payeeUserId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  beneficiaryUserId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  toCounterpartyId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  toAccountId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  fromAccountId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  method: z.preprocess(omitEmptyField, z.enum(TransferMethod).optional()),
  currency: z.string().trim().min(1),
  amount: z.string().trim().min(1),
  note: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  dueAt: z.preprocess(omitEmptyField, z.string().optional()),
  paidAt: z.preprocess(omitEmptyField, z.string().optional()),
})

export class CreateOrderSettlementDto extends createZodDto(createOrderSettlementSchema) {}
