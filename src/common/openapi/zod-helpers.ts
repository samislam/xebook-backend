import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

export const dateTimeCodec = z.codec(z.iso.datetime(), z.date(), {
  decode: (isoString) => new Date(isoString),
  encode: (date) => date.toISOString(),
})

type ZodDtoLike = { schema: z.ZodTypeAny }

export function makeWrappedDto(name: string, dto: ZodDtoLike) {
  const wrappedSchema = z
    .object({
      data: dto.schema,
    })
    .meta({ id: name })

  return createZodDto(wrappedSchema, { codec: true })
}

export function makePaginatedDto(name: string, dto: ZodDtoLike) {
  const paginatedSchema = z
    .object({
      total: z.number().int(),
      perPage: z.number().int(),
      page: z.number().int(),
      totalPages: z.number().int(),
      isFirstPage: z.boolean(),
      isLastPage: z.boolean(),
      count: z.number().int(),
      data: z.array(dto.schema),
    })
    .meta({ id: name })

  return createZodDto(paginatedSchema, { codec: true })
}
