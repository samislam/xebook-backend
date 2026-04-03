import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { omitEmptyField, stringToBoolean } from '@/common/utils/zod'

export const updateInstitutionAccountSchema = z.object({
  title: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  currency: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  accountIdentifier: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  isActive: z.preprocess(stringToBoolean, z.boolean().optional()),
  note: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
})

export class UpdateInstitutionAccountDto extends createZodDto(updateInstitutionAccountSchema) {}
