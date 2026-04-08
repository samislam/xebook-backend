import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { makeWrappedDto } from '@/common/openapi/zod-helpers'
import { userResponseSchema, userSummaryResponseSchema } from '@/users/dto/user-responses.dto'

export const authPayloadResponseSchema = z
  .object({
    user: userResponseSchema,
    accessToken: z.string(),
  })
  .meta({ id: 'AuthPayloadResponse' })

export class AuthPayloadResponseZodDto extends createZodDto(authPayloadResponseSchema, {
  codec: true,
}) {}

export const currentAuthUserResponseSchema = z
  .object({
    user: userSummaryResponseSchema,
  })
  .meta({ id: 'CurrentAuthUserResponse' })

export class CurrentAuthUserResponseZodDto extends createZodDto(currentAuthUserResponseSchema, {
  codec: true,
}) {}

export class WrappedAuthPayloadResponseZodDto extends makeWrappedDto(
  'WrappedAuthPayloadResponse',
  AuthPayloadResponseZodDto
) {}

export class WrappedCurrentAuthUserResponseZodDto extends makeWrappedDto(
  'WrappedCurrentAuthUserResponse',
  CurrentAuthUserResponseZodDto
) {}
