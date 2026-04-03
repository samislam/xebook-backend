import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { omitEmptyField } from '@/common/utils/zod'

export const changeUsernameSchema = z.object({
  username: z.preprocess(omitEmptyField, z.string().trim().min(3)),
})

export class ChangeUsernameDto extends createZodDto(changeUsernameSchema) {}
