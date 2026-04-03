import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { OrderStatus } from '@/generated/prisma'
import { omitEmptyField } from '@/common/utils/zod'

export const updateOrderSchema = z.object({
  status: z.preprocess(omitEmptyField, z.enum(OrderStatus).optional()),
  note: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
})

export class UpdateOrderDto extends createZodDto(updateOrderSchema) {}
