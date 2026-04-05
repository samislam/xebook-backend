import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { CostBasisMethod } from '@/generated/prisma'
import { omitEmptyField } from '@/common/utils/zod'

export const createSaleExecutionSchema = z.object({
  ownerUserId: z.string().trim().min(1),
  counterpartyId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  settlementAccountId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  assetCurrency: z.string().trim().min(1),
  quantitySold: z.string().trim().min(1),
  feeCurrency: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  feeAmount: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  proceedsCurrency: z.string().trim().min(1),
  proceedsAmount: z.string().trim().min(1),
  costBasisMethod: z.preprocess(omitEmptyField, z.enum(CostBasisMethod).optional()),
  occurredAt: z.string(),
  note: z.preprocess(omitEmptyField, z.string().trim().optional()),
})

export class CreateSaleExecutionDto extends createZodDto(createSaleExecutionSchema) {}
