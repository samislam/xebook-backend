import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { userSummaryResponseSchema } from '@/users/dto/user-responses.dto'
import { dateTimeCodec, makePaginatedDto, makeWrappedDto } from '@/common/openapi/zod-helpers'

export const orderSettlementListItemResponseSchema = z
  .object({
    id: z.string(),
    orderId: z.string(),
    kind: z.string(),
    status: z.string(),
    payerUserId: z.string().nullable().optional(),
    payeeUserId: z.string().nullable().optional(),
    beneficiaryUserId: z.string().nullable().optional(),
    toCounterpartyId: z.string().nullable().optional(),
    toAccountId: z.string().nullable().optional(),
    fromAccountId: z.string().nullable().optional(),
    method: z.string(),
    currency: z.string(),
    amount: z.number(),
    note: z.string().nullable().optional(),
    dueAt: dateTimeCodec.nullable().optional(),
    paidAt: dateTimeCodec.nullable().optional(),
    createdAt: dateTimeCodec,
    updatedAt: dateTimeCodec,
  })
  .meta({ id: 'OrderSettlementListItemResponse' })

export class OrderSettlementListItemResponseZodDto extends createZodDto(
  orderSettlementListItemResponseSchema,
  { codec: true }
) {}

export const orderBaseResponseSchema = z
  .object({
    id: z.string(),
    buyerUserId: z.string(),
    sellerUserId: z.string(),
    baseCurrency: z.string(),
    baseAmount: z.number(),
    quoteCurrency: z.string(),
    quoteAmount: z.number(),
    status: z.string(),
    impliedRate: z.number().nullable().optional(),
    note: z.string().nullable().optional(),
    createdAt: dateTimeCodec,
    updatedAt: dateTimeCodec,
  })
  .meta({ id: 'OrderBaseResponse' })

export class OrderBaseResponseZodDto extends createZodDto(orderBaseResponseSchema, {
  codec: true,
}) {}

export const orderResponseSchema = orderBaseResponseSchema
  .extend({
    buyerUser: userSummaryResponseSchema,
    sellerUser: userSummaryResponseSchema,
    settlements: z.array(orderSettlementListItemResponseSchema),
  })
  .meta({ id: 'OrderResponse' })

export class OrderResponseZodDto extends createZodDto(orderResponseSchema, { codec: true }) {}

export class WrappedOrderResponseZodDto extends makeWrappedDto(
  'WrappedOrderResponse',
  OrderResponseZodDto
) {}

export class PaginatedOrderResponseZodDto extends makePaginatedDto(
  'PaginatedOrderResponse',
  OrderResponseZodDto
) {}
