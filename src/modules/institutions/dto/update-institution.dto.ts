import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { InstitutionType } from '@/generated/prisma'
import { emptyToUndefined } from '@/common/utils/zod'

export const updateInstitutionSchema = z.object({
  name: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  country: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  type: z.preprocess(emptyToUndefined, z.enum(InstitutionType).optional()),
})

export class UpdateInstitutionDto extends createZodDto(updateInstitutionSchema) {}
