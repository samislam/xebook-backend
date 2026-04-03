import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { omitEmptyField } from '@/common/utils/zod'

export const dateRangeQuerySchema = z.object({
  occurredFrom: z.preprocess(omitEmptyField, z.string().optional()),
  occurredTo: z.preprocess(omitEmptyField, z.string().optional()),
})

export class DateRangeQueryDto extends createZodDto(dateRangeQuerySchema) {}
