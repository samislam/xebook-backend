import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { paginationQuerySchema } from '@/common/dtos/pagination-query.dto'
import { emptyToUndefined, stringToBoolean } from '@/common/utils/zod'

export const listInstitutionAccountsQuerySchema = paginationQuerySchema.extend({
  userId: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  institutionId: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  currency: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  isActive: z.preprocess(stringToBoolean, z.boolean().optional()),
})

export class ListInstitutionAccountsQueryDto extends createZodDto(
  listInstitutionAccountsQuerySchema
) {}
