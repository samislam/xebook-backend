import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

export const updateInstitutionAccountSchema = z.object({
  title: z.string().trim().min(1).optional(),
  currency: z.string().trim().min(1).optional(),
  accountIdentifier: z.string().trim().optional(),
  isActive: z.boolean().optional(),
  note: z.string().trim().optional(),
})

export class UpdateInstitutionAccountDto extends createZodDto(updateInstitutionAccountSchema) {}
