import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { CounterpartyType } from '@/generated/prisma'

export const updateCounterpartySchema = z.object({
  name: z.string().trim().min(1).optional(),
  type: z.enum(CounterpartyType).optional(),
  phone: z.string().trim().optional(),
  note: z.string().trim().optional(),
})

export class UpdateCounterpartyDto extends createZodDto(updateCounterpartySchema) {}
