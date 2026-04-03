import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { OrderStatus } from '@/generated/prisma'
import { paginationQuerySchema } from '@/common/dtos/pagination-query.dto'
import { omitEmptyField } from '@/common/utils/zod'

export const listOrdersQuerySchema = paginationQuerySchema.extend({
  buyerUserId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  sellerUserId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  currency: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  status: z.preprocess(omitEmptyField, z.enum(OrderStatus).optional()),
})

export class ListOrdersQueryDto extends createZodDto(listOrdersQuerySchema) {}
