import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { OrderStatus } from '@/generated/prisma'
import { emptyToUndefined } from '@/common/utils/zod'

export const updateOrderSchema = z.object({
  status: z.preprocess(emptyToUndefined, z.enum(OrderStatus).optional()),
  note: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
})

export class UpdateOrderDto extends createZodDto(updateOrderSchema) {}
