import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { RateSource } from '@/generated/prisma'
import { paginationQuerySchema } from '@/common/dtos/pagination-query.dto'
import { omitEmptyField } from '@/common/utils/zod'

export const listRateSnapshotsQuerySchema = paginationQuerySchema.extend({
  baseCurrency: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  quoteCurrency: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  source: z.preprocess(omitEmptyField, z.enum(RateSource).optional()),
})

export class ListRateSnapshotsQueryDto extends createZodDto(listRateSnapshotsQuerySchema) {}
