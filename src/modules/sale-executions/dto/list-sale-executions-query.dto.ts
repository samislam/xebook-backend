import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { CostBasisMethod } from '@/generated/prisma'
import { paginationQuerySchema } from '@/common/dtos/pagination-query.dto'
import { omitEmptyField } from '@/common/utils/zod'

export const listSaleExecutionsQuerySchema = paginationQuerySchema.extend({
  ownerUserId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  counterpartyId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  assetCurrency: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  proceedsCurrency: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  costBasisMethod: z.preprocess(omitEmptyField, z.enum(CostBasisMethod).optional()),
})

export class ListSaleExecutionsQueryDto extends createZodDto(listSaleExecutionsQuerySchema) {}
