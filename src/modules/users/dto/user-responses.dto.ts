import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { dateTimeCodec, makePaginatedDto, makeWrappedDto } from '@/common/openapi/zod-helpers'

export const userSummaryResponseSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    username: z.string(),
  })
  .meta({ id: 'UserSummaryResponse' })

export class UserSummaryResponseZodDto extends createZodDto(userSummaryResponseSchema, {
  codec: true,
}) {}

export const userResponseSchema = userSummaryResponseSchema
  .extend({
    isActive: z.boolean(),
    createdAt: dateTimeCodec,
    updatedAt: dateTimeCodec,
  })
  .meta({ id: 'UserResponse' })

export class UserResponseZodDto extends createZodDto(userResponseSchema, { codec: true }) {}

export class WrappedUserResponseZodDto extends makeWrappedDto(
  'WrappedUserResponse',
  UserResponseZodDto
) {}

export class PaginatedUserResponseZodDto extends makePaginatedDto(
  'PaginatedUserResponse',
  UserResponseZodDto
) {}
