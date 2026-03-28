import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { CounterpartyType } from '@/generated/prisma'
import { paginationQuerySchema } from '@/common/dtos/pagination-query.dto'
import { emptyToUndefined } from '@/common/utils/zod'

export const listCounterpartiesQuerySchema = paginationQuerySchema.extend({
  type: z.preprocess(emptyToUndefined, z.enum(CounterpartyType).optional()),
})

export class ListCounterpartiesQueryDto extends createZodDto(listCounterpartiesQuerySchema) {}
