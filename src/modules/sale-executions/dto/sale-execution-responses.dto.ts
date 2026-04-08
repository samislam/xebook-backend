import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { userSummaryResponseSchema } from '@/users/dto/user-responses.dto'
import { institutionResponseSchema } from '@/institutions/dto/institution-responses.dto'
import { counterpartyResponseSchema } from '@/counterparties/dto/counterparty-responses.dto'
import { dateTimeCodec, makePaginatedDto, makeWrappedDto } from '@/common/openapi/zod-helpers'
import { institutionAccountBaseResponseSchema } from '@/institution-accounts/dto/institution-account-responses.dto'

const saleExecutionInventoryLotSummaryResponseSchema = z
  .object({
    id: z.string(),
    assetCurrency: z.string(),
    costCurrency: z.string(),
    unitCostAmount: z.number(),
    acquiredAt: dateTimeCodec,
  })
  .meta({ id: 'SaleExecutionInventoryLotSummaryResponse' })

const saleExecutionAllocationResponseSchema = z
  .object({
    id: z.string(),
    saleExecutionId: z.string(),
    inventoryLotId: z.string(),
    quantityAllocated: z.number(),
    costAmount: z.number(),
    createdAt: dateTimeCodec,
    inventoryLot: saleExecutionInventoryLotSummaryResponseSchema,
  })
  .meta({ id: 'SaleExecutionAllocationResponse' })

const saleExecutionSettlementAccountResponseSchema = institutionAccountBaseResponseSchema
  .extend({
    user: userSummaryResponseSchema,
    institution: institutionResponseSchema,
  })
  .meta({ id: 'SaleExecutionSettlementAccountResponse' })

export const saleExecutionResponseSchema = z
  .object({
    id: z.string(),
    ownerUserId: z.string(),
    counterpartyId: z.string().nullable().optional(),
    settlementAccountId: z.string().nullable().optional(),
    assetCurrency: z.string(),
    quantitySold: z.number(),
    feeCurrency: z.string().nullable().optional(),
    feeAmount: z.number().nullable().optional(),
    consumedQuantity: z.number(),
    proceedsCurrency: z.string(),
    proceedsAmount: z.number(),
    netProceedsAmount: z.number(),
    unitSalePrice: z.number(),
    costBasisMethod: z.string(),
    costBasisCurrency: z.string().nullable().optional(),
    costBasisAmount: z.number().nullable().optional(),
    realizedProfitAmount: z.number().nullable().optional(),
    occurredAt: dateTimeCodec,
    note: z.string().nullable().optional(),
    createdAt: dateTimeCodec,
    updatedAt: dateTimeCodec,
    ownerUser: userSummaryResponseSchema,
    counterparty: counterpartyResponseSchema.nullable().optional(),
    settlementAccount: saleExecutionSettlementAccountResponseSchema.nullable().optional(),
    allocations: z.array(saleExecutionAllocationResponseSchema),
  })
  .meta({ id: 'SaleExecutionResponse' })

export class SaleExecutionResponseZodDto extends createZodDto(saleExecutionResponseSchema, {
  codec: true,
}) {}

export class WrappedSaleExecutionResponseZodDto extends makeWrappedDto(
  'WrappedSaleExecutionResponse',
  SaleExecutionResponseZodDto
) {}

export class PaginatedSaleExecutionResponseZodDto extends makePaginatedDto(
  'PaginatedSaleExecutionResponse',
  SaleExecutionResponseZodDto
) {}
