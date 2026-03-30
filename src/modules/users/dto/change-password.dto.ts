import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { emptyToUndefined } from '@/common/utils/zod'

export const changePasswordSchema = z.object({
  password: z.preprocess(emptyToUndefined, z.string().min(8)),
})

export class ChangePasswordDto extends createZodDto(changePasswordSchema) {}
