import { createZodDto } from 'nestjs-zod'
import { orderBaseResponseSchema } from '@/orders/dto/order-responses.dto'
import { userSummaryResponseSchema } from '@/users/dto/user-responses.dto'
import { makePaginatedDto, makeWrappedDto } from '@/common/openapi/zod-helpers'
import { orderSettlementListItemResponseSchema } from '@/orders/dto/order-responses.dto'
import { counterpartyResponseSchema } from '@/counterparties/dto/counterparty-responses.dto'
import { institutionAccountBaseResponseSchema } from '@/institution-accounts/dto/institution-account-responses.dto'

export const orderSettlementResponseSchema = orderSettlementListItemResponseSchema
  .extend({
    order: orderBaseResponseSchema,
    payerUser: userSummaryResponseSchema.nullable().optional(),
    payeeUser: userSummaryResponseSchema.nullable().optional(),
    beneficiaryUser: userSummaryResponseSchema.nullable().optional(),
    toCounterparty: counterpartyResponseSchema.nullable().optional(),
    toAccount: institutionAccountBaseResponseSchema.nullable().optional(),
    fromAccount: institutionAccountBaseResponseSchema.nullable().optional(),
  })
  .meta({ id: 'OrderSettlementResponse' })

export class OrderSettlementResponseZodDto extends createZodDto(orderSettlementResponseSchema, {
  codec: true,
}) {}

export class WrappedOrderSettlementResponseZodDto extends makeWrappedDto(
  'WrappedOrderSettlementResponse',
  OrderSettlementResponseZodDto
) {}

export class PaginatedOrderSettlementResponseZodDto extends makePaginatedDto(
  'PaginatedOrderSettlementResponse',
  OrderSettlementResponseZodDto
) {}
