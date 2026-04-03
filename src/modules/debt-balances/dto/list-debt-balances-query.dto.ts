import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { paginationQuerySchema } from '@/common/dtos/pagination-query.dto'
import { omitEmptyField } from '@/common/utils/zod'

export const listDebtBalancesQuerySchema = paginationQuerySchema.extend({
  debtorUserId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  creditorUserId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  currency: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
})

export class ListDebtBalancesQueryDto extends createZodDto(listDebtBalancesQuerySchema) {}
