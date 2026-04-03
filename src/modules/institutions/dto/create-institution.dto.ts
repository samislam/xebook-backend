import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { InstitutionType } from '@/generated/prisma'
import { omitEmptyField } from '@/common/utils/zod'

export const createInstitutionSchema = z.object({
  name: z.string().trim().min(1),
  country: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  type: z.preprocess(omitEmptyField, z.enum(InstitutionType).optional()),
})

export class CreateInstitutionDto extends createZodDto(createInstitutionSchema) {}
