import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { InstitutionType } from '@/generated/prisma'
import { emptyToUndefined } from '@/common/utils/zod'

export const createInstitutionSchema = z.object({
  name: z.string().trim().min(1),
  country: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  type: z.preprocess(emptyToUndefined, z.enum(InstitutionType).optional()),
})

export class CreateInstitutionDto extends createZodDto(createInstitutionSchema) {}
