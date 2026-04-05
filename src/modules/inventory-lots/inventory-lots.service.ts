import { Prisma } from '@/generated/prisma'
import { normalizeCurrency } from '@/common/utils/currency'
import { DatabaseService } from '@/database/database.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { buildPrismaOrderBy } from '@/lib/prisma/build-prisma-order-by'
import { assertDecimalPositive, toDecimal } from '@/common/utils/decimal'
import { inventoryLotsResourceConfig } from '@/inventory-lots/inventory-lots.config'
import { CreateInventoryLotDto } from '@/inventory-lots/dto/create-inventory-lot.dto'
import { ListInventoryLotsQueryDto } from '@/inventory-lots/dto/list-inventory-lots-query.dto'
import { buildPaginatedResponse, getPaginationArgs } from '@/common/utils/pagination-helpers'

@Injectable()
export class InventoryLotsService {
  constructor(private readonly database: DatabaseService) {}

  create(dto: CreateInventoryLotDto) {
    const quantityAcquired = toDecimal(dto.quantityAcquired, 'quantityAcquired')
    const totalCostAmount = toDecimal(dto.totalCostAmount, 'totalCostAmount')
    assertDecimalPositive(quantityAcquired, 'quantityAcquired')
    assertDecimalPositive(totalCostAmount, 'totalCostAmount')
    const unitCostAmount = totalCostAmount.div(quantityAcquired)

    return this.database.inventoryLot.create({
      data: {
        ownerUserId: dto.ownerUserId,
        assetCurrency: normalizeCurrency(dto.assetCurrency),
        quantityAcquired,
        remainingQuantity: quantityAcquired,
        costCurrency: normalizeCurrency(dto.costCurrency),
        totalCostAmount,
        unitCostAmount,
        sourceOrderId: dto.sourceOrderId,
        sourceTransactionId: dto.sourceTransactionId,
        acquiredAt: new Date(dto.acquiredAt),
        note: dto.note,
      },
      include: this.inventoryLotInclude,
    })
  }

  async list(query: ListInventoryLotsQueryDto) {
    const { page, perPage, skip, take } = getPaginationArgs(query)
    const sortArgs = inventoryLotsResourceConfig.getSortArgs({
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    })
    const where: Prisma.InventoryLotWhereInput = {
      ownerUserId: query.ownerUserId,
      assetCurrency: query.assetCurrency ? normalizeCurrency(query.assetCurrency) : undefined,
      costCurrency: query.costCurrency ? normalizeCurrency(query.costCurrency) : undefined,
    }

    const [data, total] = await this.database.$transaction([
      this.database.inventoryLot.findMany({
        where,
        skip,
        take,
        orderBy: buildPrismaOrderBy<
          Prisma.InventoryLotScalarFieldEnum,
          Prisma.InventoryLotOrderByWithRelationInput
        >(sortArgs),
        include: this.inventoryLotInclude,
      }),
      this.database.inventoryLot.count({ where }),
    ])

    return buildPaginatedResponse({ data, total, page, perPage })
  }

  async findOne(id: string) {
    const lot = await this.database.inventoryLot.findUnique({
      where: { id },
      include: this.inventoryLotInclude,
    })
    if (!lot) {
      throw new NotFoundException('Inventory lot not found')
    }

    return lot
  }

  readonly inventoryLotInclude = {
    ownerUser: { select: { id: true, name: true, username: true } },
    allocations: {
      orderBy: { createdAt: 'asc' },
      include: {
        saleExecution: {
          select: {
            id: true,
            assetCurrency: true,
            quantitySold: true,
            proceedsCurrency: true,
            proceedsAmount: true,
            occurredAt: true,
          },
        },
      },
    },
  } satisfies Prisma.InventoryLotInclude
}
