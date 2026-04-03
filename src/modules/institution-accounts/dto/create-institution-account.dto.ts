import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { omitEmptyField, stringToBoolean } from '@/common/utils/zod'

export const createInstitutionAccountSchema = z.object({
  userId: z.string().trim().min(1),
  institutionId: z.string().trim().min(1),
  currency: z.string().trim().min(1),
  title: z.string().trim().min(1),
  accountIdentifier: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  isActive: z.preprocess(stringToBoolean, z.boolean().optional()),
  note: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
})

export class CreateInstitutionAccountDto extends createZodDto(createInstitutionAccountSchema) {}
