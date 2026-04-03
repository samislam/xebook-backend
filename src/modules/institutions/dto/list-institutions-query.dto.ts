import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { InstitutionType } from '@/generated/prisma'
import { paginationQuerySchema } from '@/common/dtos/pagination-query.dto'
import { omitEmptyField } from '@/common/utils/zod'

export const listInstitutionsQuerySchema = paginationQuerySchema.extend({
  type: z.preprocess(omitEmptyField, z.enum(InstitutionType).optional()),
})

export class ListInstitutionsQueryDto extends createZodDto(listInstitutionsQuerySchema) {}
