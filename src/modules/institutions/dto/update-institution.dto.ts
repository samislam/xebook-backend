import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { InstitutionType } from '@/generated/prisma'

export const updateInstitutionSchema = z.object({
  name: z.string().trim().min(1).optional(),
  country: z.string().trim().optional(),
  type: z.enum(InstitutionType).optional(),
})

export class UpdateInstitutionDto extends createZodDto(updateInstitutionSchema) {}
