import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { emptyToUndefined, stringToBoolean } from '@/common/utils/zod'

export const updateInstitutionAccountSchema = z.object({
  title: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  currency: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  accountIdentifier: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
  isActive: z.preprocess(stringToBoolean, z.boolean().optional()),
  note: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
})

export class UpdateInstitutionAccountDto extends createZodDto(updateInstitutionAccountSchema) {}
