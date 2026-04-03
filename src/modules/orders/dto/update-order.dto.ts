import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { OrderStatus } from '@/generated/prisma'

export const updateOrderSchema = z.object({
  status: z.enum(OrderStatus).optional(),
  note: z.string().trim().optional(),
})

export class UpdateOrderDto extends createZodDto(updateOrderSchema) {}
