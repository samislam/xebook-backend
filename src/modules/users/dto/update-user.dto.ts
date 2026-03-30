import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { emptyToUndefined } from '@/common/utils/zod'

export const updateUserSchema = z.object({
  name: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
})

export class UpdateUserDto extends createZodDto(updateUserSchema) {}
