import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma, OrderStatus, SettlementStatus } from '@/generated/prisma'
import { BalancesService } from '@/balances/balances.service'
import { buildPaginatedResponse, getPaginationArgs } from '@/common/utils/pagination-helpers'
import { buildPrismaOrderBy } from '@/lib/prisma/build-prisma-order-by'
import { assertDecimalPositive, toDecimal } from '@/common/utils/decimal'
import { normalizeCurrency } from '@/common/utils/currency'
import { DatabaseService } from '@/database/database.service'
import { CreateOrderDto } from '@/orders/dto/create-order.dto'
import { ListOrdersQueryDto } from '@/orders/dto/list-orders-query.dto'
import { UpdateOrderDto } from '@/orders/dto/update-order.dto'

@Injectable()
export class OrdersService {
  constructor(
    private readonly database: DatabaseService,
    private readonly balancesService: BalancesService
  ) {}

  async create(dto: CreateOrderDto) {
    const baseAmount = toDecimal(dto.baseAmount, 'baseAmount')
    const quoteAmount = toDecimal(dto.quoteAmount, 'quoteAmount')
    assertDecimalPositive(baseAmount, 'baseAmount')
    assertDecimalPositive(quoteAmount, 'quoteAmount')

    return this.database.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          buyerUserId: dto.buyerUserId,
          sellerUserId: dto.sellerUserId,
          baseCurrency: normalizeCurrency(dto.baseCurrency),
          baseAmount,
          quoteCurrency: normalizeCurrency(dto.quoteCurrency),
          quoteAmount,
          status: dto.status ?? OrderStatus.PENDING_PAYMENT,
          impliedRate: dto.impliedRate
            ? toDecimal(dto.impliedRate, 'impliedRate')
            : quoteAmount.div(baseAmount),
          note: dto.note,
        },
        include: this.orderInclude,
      })

      await this.balancesService.adjustDebtBalance(
        tx,
        order.buyerUserId,
        order.sellerUserId,
        order.quoteCurrency,
        order.quoteAmount
      )

      return order
    })
  }

  async list(query: ListOrdersQueryDto) {
    const { page, perPage, skip, take } = getPaginationArgs(query)
    const where: Prisma.OrderWhereInput = {
      ...(query.buyerUserId ? { buyerUserId: query.buyerUserId } : {}),
      ...(query.sellerUserId ? { sellerUserId: query.sellerUserId } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.currency
        ? {
            OR: [
              { baseCurrency: normalizeCurrency(query.currency) },
              { quoteCurrency: normalizeCurrency(query.currency) },
            ],
          }
        : {}),
    }

    const [data, total] = await this.database.$transaction([
      this.database.order.findMany({
        where,
        skip,
        take,
        orderBy: buildPrismaOrderBy<
          Prisma.OrderScalarFieldEnum,
          Prisma.OrderOrderByWithRelationInput
        >({
          sortBy:
            query.sortBy &&
            [
              'buyerUserId',
              'sellerUserId',
              'baseCurrency',
              'quoteCurrency',
              'status',
              'createdAt',
              'updatedAt',
            ].includes(query.sortBy)
              ? (query.sortBy as Prisma.OrderScalarFieldEnum)
              : 'createdAt',
          sortOrder: query.sortOrder ?? 'desc',
          tieBreakerField: 'id',
          tieBreakerOrder: 'asc',
        }),
        include: this.orderInclude,
      }),
      this.database.order.count({ where }),
    ])

    return buildPaginatedResponse({ data, total, page, perPage })
  }

  async findOne(id: string) {
    const order = await this.database.order.findUnique({
      where: { id },
      include: this.orderInclude,
    })
    if (!order) {
      throw new NotFoundException('Order not found')
    }

    return order
  }

  async update(id: string, dto: UpdateOrderDto) {
    await this.findOne(id)
    return this.database.order.update({
      where: { id },
      data: dto,
      include: this.orderInclude,
    })
  }

  async refreshStatus(tx: Prisma.TransactionClient, orderId: string) {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        settlements: true,
      },
    })

    if (!order || order.status === OrderStatus.CANCELLED) {
      return order
    }

    const paidSettlements = order.settlements.filter(
      (settlement) => settlement.status === SettlementStatus.PAID
    )
    let nextStatus: OrderStatus = OrderStatus.PENDING_PAYMENT

    if (paidSettlements.length > 0) {
      const quotePaidTotal = paidSettlements
        .filter((settlement) => settlement.currency === order.quoteCurrency)
        .reduce((total, settlement) => total.plus(settlement.amount), new Prisma.Decimal(0))

      nextStatus = quotePaidTotal.greaterThanOrEqualTo(order.quoteAmount)
        ? OrderStatus.SETTLED
        : OrderStatus.PARTIALLY_SETTLED
    }

    return tx.order.update({
      where: { id: orderId },
      data: { status: nextStatus },
      include: this.orderInclude,
    })
  }

  readonly orderInclude = {
    buyerUser: { select: { id: true, name: true, username: true } },
    sellerUser: { select: { id: true, name: true, username: true } },
    settlements: {
      orderBy: { createdAt: 'desc' },
    },
  } satisfies Prisma.OrderInclude
}
