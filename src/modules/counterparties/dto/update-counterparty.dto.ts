import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { CounterpartyType } from '@/generated/prisma'
import { omitEmptyField } from '@/common/utils/zod'

export const updateCounterpartySchema = z.object({
  name: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  type: z.preprocess(omitEmptyField, z.enum(CounterpartyType).optional()),
  phone: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  note: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
})

export class UpdateCounterpartyDto extends createZodDto(updateCounterpartySchema) {}
