import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

export const updateUserSchema = z.object({
  name: z.string().trim().min(1).optional(),
})

export class UpdateUserDto extends createZodDto(updateUserSchema) {}
