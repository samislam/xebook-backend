import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { CounterpartyType } from '@/generated/prisma'
import { emptyToUndefined } from '@/common/utils/zod'

export const updateCounterpartySchema = z.object({
  name: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  type: z.preprocess(emptyToUndefined, z.enum(CounterpartyType).optional()),
  phone: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  note: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
})

export class UpdateCounterpartyDto extends createZodDto(updateCounterpartySchema) {}
