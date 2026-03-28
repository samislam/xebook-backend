import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { emptyToUndefined, stringToBoolean } from '@/common/utils/zod'

export const updateUserSchema = z.object({
  name: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  isActive: z.preprocess(stringToBoolean, z.boolean().optional()),
  password: z.preprocess(emptyToUndefined, z.string().min(8).optional()),
})

export class UpdateUserDto extends createZodDto(updateUserSchema) {}
