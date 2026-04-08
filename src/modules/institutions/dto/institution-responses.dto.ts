import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { dateTimeCodec, makePaginatedDto, makeWrappedDto } from '@/common/openapi/zod-helpers'

export const institutionResponseSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    country: z.string().nullable().optional(),
    type: z.string(),
    createdAt: dateTimeCodec,
    updatedAt: dateTimeCodec,
  })
  .meta({ id: 'InstitutionResponse' })

export class InstitutionResponseZodDto extends createZodDto(institutionResponseSchema, {
  codec: true,
}) {}

export class WrappedInstitutionResponseZodDto extends makeWrappedDto(
  'WrappedInstitutionResponse',
  InstitutionResponseZodDto
) {}

export class PaginatedInstitutionResponseZodDto extends makePaginatedDto(
  'PaginatedInstitutionResponse',
  InstitutionResponseZodDto
) {}
