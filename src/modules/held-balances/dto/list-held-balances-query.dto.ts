import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { paginationQuerySchema } from '@/common/dtos/pagination-query.dto'
import { emptyToUndefined } from '@/common/utils/zod'

export const listHeldBalancesQuerySchema = paginationQuerySchema.extend({
  ownerUserId: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  holderUserId: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  currency: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
})

export class ListHeldBalancesQueryDto extends createZodDto(listHeldBalancesQuerySchema) {}
