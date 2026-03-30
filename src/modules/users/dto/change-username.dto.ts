import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { emptyToUndefined } from '@/common/utils/zod'

export const changeUsernameSchema = z.object({
  username: z.preprocess(emptyToUndefined, z.string().trim().min(3)),
})

export class ChangeUsernameDto extends createZodDto(changeUsernameSchema) {}
