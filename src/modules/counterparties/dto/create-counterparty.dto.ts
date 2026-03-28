import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { CounterpartyType } from '@/generated/prisma'
import { emptyToUndefined } from '@/common/utils/zod'

export const createCounterpartySchema = z.object({
  name: z.string().trim().min(1),
  type: z.preprocess(emptyToUndefined, z.enum(CounterpartyType).optional()),
  phone: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  note: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
})

export class CreateCounterpartyDto extends createZodDto(createCounterpartySchema) {}
