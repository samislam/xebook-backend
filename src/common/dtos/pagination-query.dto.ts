import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { emptyToUndefined } from '@/common/utils/zod'

export const paginationQuerySchema = z.object({
  page: z.preprocess(emptyToUndefined, z.coerce.number().int().min(1).default(1)),
  perPage: z.preprocess(emptyToUndefined, z.coerce.number().int().min(1).max(250).default(20)),
  select: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  sortBy: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  sortOrder: z.preprocess(emptyToUndefined, z.enum(['asc', 'desc']).default('asc')),
  search: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .transform((value) => value.toLowerCase())
      .optional()
  ),
})

export class PaginationQueryDto extends createZodDto(paginationQuerySchema) {}
