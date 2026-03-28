import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { paginationQuerySchema } from '@/common/dtos/pagination-query.dto'
import { stringToBoolean } from '@/common/utils/zod'

export const listUsersQuerySchema = paginationQuerySchema.extend({
  isActive: z.preprocess(stringToBoolean, z.boolean().optional()),
})

export class ListUsersQueryDto extends createZodDto(listUsersQuerySchema) {}
