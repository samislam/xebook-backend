import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { stringToBoolean } from '@/common/utils/zod'
import { paginationQuerySchema } from '@/common/dtos/pagination-query.dto'

export const listUsersQuerySchema = paginationQuerySchema.extend({
  isActive: z.preprocess(stringToBoolean, z.boolean().optional()),
})

export class ListUsersQueryDto extends createZodDto(listUsersQuerySchema) {}
