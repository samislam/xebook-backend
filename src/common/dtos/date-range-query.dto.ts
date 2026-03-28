import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { emptyToUndefined } from '@/common/utils/zod'

export const dateRangeQuerySchema = z.object({
  occurredFrom: z.preprocess(emptyToUndefined, z.string().optional()),
  occurredTo: z.preprocess(emptyToUndefined, z.string().optional()),
})

export class DateRangeQueryDto extends createZodDto(dateRangeQuerySchema) {}
