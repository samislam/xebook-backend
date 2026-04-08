import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { userSummaryResponseSchema } from '@/users/dto/user-responses.dto'
import { institutionResponseSchema } from '@/institutions/dto/institution-responses.dto'
import { dateTimeCodec, makePaginatedDto, makeWrappedDto } from '@/common/openapi/zod-helpers'

export const institutionAccountBaseResponseSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    institutionId: z.string(),
    currency: z.string(),
    title: z.string(),
    accountIdentifier: z.string().nullable().optional(),
    isActive: z.boolean(),
    note: z.string().nullable().optional(),
    createdAt: dateTimeCodec,
    updatedAt: dateTimeCodec,
  })
  .meta({ id: 'InstitutionAccountBaseResponse' })

export class InstitutionAccountBaseResponseZodDto extends createZodDto(
  institutionAccountBaseResponseSchema,
  { codec: true }
) {}

export const institutionAccountResponseSchema = institutionAccountBaseResponseSchema
  .extend({
    user: userSummaryResponseSchema,
    institution: institutionResponseSchema,
  })
  .meta({ id: 'InstitutionAccountResponse' })

export class InstitutionAccountResponseZodDto extends createZodDto(
  institutionAccountResponseSchema,
  {
    codec: true,
  }
) {}

export class WrappedInstitutionAccountResponseZodDto extends makeWrappedDto(
  'WrappedInstitutionAccountResponse',
  InstitutionAccountResponseZodDto
) {}

export class PaginatedInstitutionAccountResponseZodDto extends makePaginatedDto(
  'PaginatedInstitutionAccountResponse',
  InstitutionAccountResponseZodDto
) {}
