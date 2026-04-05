import { Prisma, CostBasisMethod } from '@/generated/prisma'
import { normalizeCurrency } from '@/common/utils/currency'
import { DatabaseService } from '@/database/database.service'
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { buildPrismaOrderBy } from '@/lib/prisma/build-prisma-order-by'
import { assertDecimalPositive, toDecimal } from '@/common/utils/decimal'
import { saleExecutionsResourceConfig } from '@/sale-executions/sale-executions.config'
import { CreateSaleExecutionDto } from '@/sale-executions/dto/create-sale-execution.dto'
import { ListSaleExecutionsQueryDto } from '@/sale-executions/dto/list-sale-executions-query.dto'
import { buildPaginatedResponse, getPaginationArgs } from '@/common/utils/pagination-helpers'

@Injectable()
export class SaleExecutionsService {
  constructor(private readonly database: DatabaseService) {}

  async create(dto: CreateSaleExecutionDto) {
    const quantitySold = toDecimal(dto.quantitySold, 'quantitySold')
    const proceedsAmount = toDecimal(dto.proceedsAmount, 'proceedsAmount')
    const feeAmount = dto.feeAmount ? toDecimal(dto.feeAmount, 'feeAmount') : new Prisma.Decimal(0)
    assertDecimalPositive(quantitySold, 'quantitySold')
    assertDecimalPositive(proceedsAmount, 'proceedsAmount')
    if (dto.feeAmount) {
      assertDecimalPositive(feeAmount, 'feeAmount')
    }

    const assetCurrency = normalizeCurrency(dto.assetCurrency)
    const proceedsCurrency = normalizeCurrency(dto.proceedsCurrency)
    const feeCurrency = dto.feeCurrency ? normalizeCurrency(dto.feeCurrency) : undefined
    const costBasisMethod = dto.costBasisMethod ?? CostBasisMethod.FIFO

    if (costBasisMethod !== CostBasisMethod.FIFO) {
      throw new BadRequestException(
        'Only FIFO cost-basis is supported right now. Weighted average can be added next.'
      )
    }

    const consumedQuantity =
      feeCurrency === assetCurrency ? quantitySold.plus(feeAmount) : quantitySold
    const netProceedsAmount =
      feeCurrency === proceedsCurrency ? proceedsAmount.minus(feeAmount) : proceedsAmount

    if (netProceedsAmount.lt(0)) {
      throw new BadRequestException('net proceeds amount cannot be negative')
    }

    return this.database.$transaction(async (tx) => {
      const candidateLots = await tx.inventoryLot.findMany({
        where: {
          ownerUserId: dto.ownerUserId,
          assetCurrency,
          remainingQuantity: { gt: new Prisma.Decimal(0) },
        },
        orderBy: [{ acquiredAt: 'asc' }, { createdAt: 'asc' }],
      })

      if (candidateLots.length === 0) {
        throw new BadRequestException('No available inventory lots for this owner and asset')
      }

      const availableQuantity = candidateLots.reduce(
        (total, lot) => total.plus(lot.remainingQuantity),
        new Prisma.Decimal(0)
      )

      if (availableQuantity.lt(consumedQuantity)) {
        throw new BadRequestException('Not enough remaining inventory to execute this sale')
      }

      const costCurrencies = new Set(candidateLots.map((lot) => lot.costCurrency))
      if (costCurrencies.size > 1) {
        throw new BadRequestException(
          'Mixed cost currencies across open lots are not supported for automatic realized profit yet'
        )
      }

      let remainingToAllocate = consumedQuantity
      const allocations: Array<{
        inventoryLotId: string
        quantityAllocated: Prisma.Decimal
        costAmount: Prisma.Decimal
        nextRemainingQuantity: Prisma.Decimal
      }> = []

      for (const lot of candidateLots) {
        if (remainingToAllocate.lte(0)) {
          break
        }

        const quantityAllocated = Prisma.Decimal.min(remainingToAllocate, lot.remainingQuantity)
        if (quantityAllocated.lte(0)) {
          continue
        }

        const costAmount = lot.unitCostAmount.mul(quantityAllocated)
        allocations.push({
          inventoryLotId: lot.id,
          quantityAllocated,
          costAmount,
          nextRemainingQuantity: lot.remainingQuantity.minus(quantityAllocated),
        })
        remainingToAllocate = remainingToAllocate.minus(quantityAllocated)
      }

      const costBasisCurrency = candidateLots[0]?.costCurrency
      const costBasisAmount = allocations.reduce(
        (total, allocation) => total.plus(allocation.costAmount),
        new Prisma.Decimal(0)
      )
      const realizedProfitAmount =
        costBasisCurrency === proceedsCurrency ? netProceedsAmount.minus(costBasisAmount) : null

      const saleExecution = await tx.saleExecution.create({
        data: {
          ownerUserId: dto.ownerUserId,
          counterpartyId: dto.counterpartyId,
          settlementAccountId: dto.settlementAccountId,
          assetCurrency,
          quantitySold,
          feeCurrency,
          feeAmount: dto.feeAmount ? feeAmount : undefined,
          consumedQuantity,
          proceedsCurrency,
          proceedsAmount,
          netProceedsAmount,
          unitSalePrice: proceedsAmount.div(quantitySold),
          costBasisMethod,
          costBasisCurrency,
          costBasisAmount,
          realizedProfitAmount,
          occurredAt: new Date(dto.occurredAt),
          note: dto.note,
          allocations: {
            create: allocations.map((allocation) => ({
              inventoryLotId: allocation.inventoryLotId,
              quantityAllocated: allocation.quantityAllocated,
              costAmount: allocation.costAmount,
            })),
          },
        },
        include: this.saleExecutionInclude,
      })

      await Promise.all(
        allocations.map((allocation) =>
          tx.inventoryLot.update({
            where: { id: allocation.inventoryLotId },
            data: { remainingQuantity: allocation.nextRemainingQuantity },
          })
        )
      )

      return tx.saleExecution.findUniqueOrThrow({
        where: { id: saleExecution.id },
        include: this.saleExecutionInclude,
      })
    })
  }

  async list(query: ListSaleExecutionsQueryDto) {
    const { page, perPage, skip, take } = getPaginationArgs(query)
    const sortArgs = saleExecutionsResourceConfig.getSortArgs({
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    })
    const where: Prisma.SaleExecutionWhereInput = {
      ownerUserId: query.ownerUserId,
      counterpartyId: query.counterpartyId,
      assetCurrency: query.assetCurrency ? normalizeCurrency(query.assetCurrency) : undefined,
      proceedsCurrency: query.proceedsCurrency
        ? normalizeCurrency(query.proceedsCurrency)
        : undefined,
      costBasisMethod: query.costBasisMethod,
    }

    const [data, total] = await this.database.$transaction([
      this.database.saleExecution.findMany({
        where,
        skip,
        take,
        orderBy: buildPrismaOrderBy<
          Prisma.SaleExecutionScalarFieldEnum,
          Prisma.SaleExecutionOrderByWithRelationInput
        >(sortArgs),
        include: this.saleExecutionInclude,
      }),
      this.database.saleExecution.count({ where }),
    ])

    return buildPaginatedResponse({ data, total, page, perPage })
  }

  async findOne(id: string) {
    const saleExecution = await this.database.saleExecution.findUnique({
      where: { id },
      include: this.saleExecutionInclude,
    })
    if (!saleExecution) {
      throw new NotFoundException('Sale execution not found')
    }

    return saleExecution
  }

  readonly saleExecutionInclude = {
    ownerUser: { select: { id: true, name: true, username: true } },
    counterparty: true,
    settlementAccount: {
      include: {
        user: { select: { id: true, name: true, username: true } },
        institution: true,
      },
    },
    allocations: {
      orderBy: { createdAt: 'asc' },
      include: {
        inventoryLot: {
          select: {
            id: true,
            assetCurrency: true,
            costCurrency: true,
            unitCostAmount: true,
            acquiredAt: true,
          },
        },
      },
    },
  } satisfies Prisma.SaleExecutionInclude
}
