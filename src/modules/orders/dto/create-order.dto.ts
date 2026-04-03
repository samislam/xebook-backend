import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { OrderStatus } from '@/generated/prisma'
import { omitEmptyField } from '@/common/utils/zod'

export const createOrderSchema = z.object({
  buyerUserId: z.string().trim().min(1),
  sellerUserId: z.string().trim().min(1),
  baseCurrency: z.string().trim().min(1),
  baseAmount: z.string().trim().min(1),
  quoteCurrency: z.string().trim().min(1),
  quoteAmount: z.string().trim().min(1),
  status: z.preprocess(omitEmptyField, z.enum(OrderStatus).optional()),
  impliedRate: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  note: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
})

export class CreateOrderDto extends createZodDto(createOrderSchema) {}
