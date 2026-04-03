import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { paginationQuerySchema } from '@/common/dtos/pagination-query.dto'
import { omitEmptyField, stringToBoolean } from '@/common/utils/zod'

export const listInstitutionAccountsQuerySchema = paginationQuerySchema.extend({
  userId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  institutionId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  currency: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  isActive: z.preprocess(stringToBoolean, z.boolean().optional()),
})

export class ListInstitutionAccountsQueryDto extends createZodDto(
  listInstitutionAccountsQuerySchema
) {}
