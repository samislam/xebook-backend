import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { OrderStatus } from '@/generated/prisma'
import { paginationQuerySchema } from '@/common/dtos/pagination-query.dto'
import { emptyToUndefined } from '@/common/utils/zod'

export const listOrdersQuerySchema = paginationQuerySchema.extend({
  buyerUserId: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  sellerUserId: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  currency: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  status: z.preprocess(emptyToUndefined, z.enum(OrderStatus).optional()),
})

export class ListOrdersQueryDto extends createZodDto(listOrdersQuerySchema) {}
