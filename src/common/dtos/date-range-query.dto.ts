import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { emptyToUndefined } from '@/common/utils/zod'

export const dateRangeQuerySchema = z.object({
  occurredFrom: z.preprocess(emptyToUndefined, z.coerce.date().optional()),
  occurredTo: z.preprocess(emptyToUndefined, z.coerce.date().optional()),
})

export class DateRangeQueryDto extends createZodDto(dateRangeQuerySchema) {}
