import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { paginationQuerySchema } from '@/common/dtos/pagination-query.dto'
import { omitEmptyField } from '@/common/utils/zod'

export const listInventoryLotsQuerySchema = paginationQuerySchema.extend({
  ownerUserId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  assetCurrency: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  costCurrency: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
})

export class ListInventoryLotsQueryDto extends createZodDto(listInventoryLotsQuerySchema) {}
