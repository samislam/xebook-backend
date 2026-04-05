import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { omitEmptyField } from '@/common/utils/zod'

export const createInventoryLotSchema = z.object({
  ownerUserId: z.string().trim().min(1),
  assetCurrency: z.string().trim().min(1),
  quantityAcquired: z.string().trim().min(1),
  costCurrency: z.string().trim().min(1),
  totalCostAmount: z.string().trim().min(1),
  sourceOrderId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  sourceTransactionId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  acquiredAt: z.string(),
  note: z.preprocess(omitEmptyField, z.string().trim().optional()),
})

export class CreateInventoryLotDto extends createZodDto(createInventoryLotSchema) {}
