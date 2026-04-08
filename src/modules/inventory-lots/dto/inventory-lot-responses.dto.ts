import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { userSummaryResponseSchema } from '@/users/dto/user-responses.dto'
import { dateTimeCodec, makePaginatedDto, makeWrappedDto } from '@/common/openapi/zod-helpers'

const inventoryLotSaleExecutionSummaryResponseSchema = z
  .object({
    id: z.string(),
    assetCurrency: z.string(),
    quantitySold: z.number(),
    proceedsCurrency: z.string(),
    proceedsAmount: z.number(),
    occurredAt: dateTimeCodec,
  })
  .meta({ id: 'InventoryLotSaleExecutionSummaryResponse' })

const inventoryLotAllocationResponseSchema = z
  .object({
    id: z.string(),
    saleExecutionId: z.string(),
    inventoryLotId: z.string(),
    quantityAllocated: z.number(),
    costAmount: z.number(),
    createdAt: dateTimeCodec,
    saleExecution: inventoryLotSaleExecutionSummaryResponseSchema,
  })
  .meta({ id: 'InventoryLotAllocationResponse' })

export const inventoryLotResponseSchema = z
  .object({
    id: z.string(),
    ownerUserId: z.string(),
    assetCurrency: z.string(),
    quantityAcquired: z.number(),
    remainingQuantity: z.number(),
    costCurrency: z.string(),
    totalCostAmount: z.number(),
    unitCostAmount: z.number(),
    sourceOrderId: z.string().nullable().optional(),
    sourceTransactionId: z.string().nullable().optional(),
    acquiredAt: dateTimeCodec,
    note: z.string().nullable().optional(),
    createdAt: dateTimeCodec,
    updatedAt: dateTimeCodec,
    ownerUser: userSummaryResponseSchema,
    allocations: z.array(inventoryLotAllocationResponseSchema),
  })
  .meta({ id: 'InventoryLotResponse' })

export class InventoryLotResponseZodDto extends createZodDto(inventoryLotResponseSchema, {
  codec: true,
}) {}

export class WrappedInventoryLotResponseZodDto extends makeWrappedDto(
  'WrappedInventoryLotResponse',
  InventoryLotResponseZodDto
) {}

export class PaginatedInventoryLotResponseZodDto extends makePaginatedDto(
  'PaginatedInventoryLotResponse',
  InventoryLotResponseZodDto
) {}
