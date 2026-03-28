import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma, SettlementKind, SettlementStatus, TransactionType } from '@/generated/prisma'
import { BalancesService } from '@/balances/balances.service'
import { buildPaginatedResponse, getPaginationArgs } from '@/common/utils/pagination-helpers'
import { buildPrismaOrderBy } from '@/lib/prisma/build-prisma-order-by'
import { assertDecimalPositive, toDecimal } from '@/common/utils/decimal'
import { normalizeCurrency } from '@/common/utils/currency'
import { DatabaseService } from '@/database/database.service'
import { CreateOrderSettlementDto } from '@/order-settlements/dto/create-order-settlement.dto'
import { ListOrderSettlementsQueryDto } from '@/order-settlements/dto/list-order-settlements-query.dto'
import { OrdersService } from '@/orders/orders.service'

@Injectable()
export class OrderSettlementsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly balancesService: BalancesService,
    private readonly ordersService: OrdersService
  ) {}

  async create(dto: CreateOrderSettlementDto, initiatorUserId: string) {
    const amount = toDecimal(dto.amount)
    assertDecimalPositive(amount)
    const currency = normalizeCurrency(dto.currency)

    return this.database.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: dto.orderId },
      })
      if (!order) {
        throw new NotFoundException('Order not found')
      }

      const status = dto.status ?? (dto.paidAt ? SettlementStatus.PAID : SettlementStatus.PENDING)
      const settlement = await tx.orderSettlement.create({
        data: {
          orderId: dto.orderId,
          kind: dto.kind,
          status,
          payerUserId: dto.payerUserId,
          payeeUserId: dto.payeeUserId,
          beneficiaryUserId: dto.beneficiaryUserId,
          toCounterpartyId: dto.toCounterpartyId,
          toAccountId: dto.toAccountId,
          fromAccountId: dto.fromAccountId,
          method: dto.method,
          currency,
          amount,
          note: dto.note,
          dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined,
          paidAt: dto.paidAt ? new Date(dto.paidAt) : status === SettlementStatus.PAID ? new Date() : undefined,
        },
        include: this.settlementInclude,
      })

      if (status === SettlementStatus.PAID) {
        if (settlement.payerUserId && settlement.payerUserId !== order.buyerUserId) {
          await this.balancesService.adjustHeldBalance(
            tx,
            order.buyerUserId,
            settlement.payerUserId,
            settlement.currency,
            settlement.amount.negated()
          )
        }

        if (settlement.kind !== SettlementKind.FEE) {
          const creditorUserId =
            settlement.beneficiaryUserId ?? settlement.payeeUserId ?? order.sellerUserId
          const existingDebt = await tx.debtBalance.findUnique({
            where: {
              debtorUserId_creditorUserId_currency: {
                debtorUserId: order.buyerUserId,
                creditorUserId,
                currency: settlement.currency,
              },
            },
          })

          if (existingDebt) {
            await this.balancesService.adjustDebtBalance(
              tx,
              order.buyerUserId,
              creditorUserId,
              settlement.currency,
              settlement.amount.negated()
            )
          }
        }

        await tx.transaction.create({
          data: {
            type: settlement.toCounterpartyId
              ? TransactionType.SETTLE_DEBT_VIA_COUNTERPARTY
              : settlement.kind === SettlementKind.FEE
                ? TransactionType.EXPENSE
                : TransactionType.SETTLE_DEBT_DIRECT,
            method: settlement.method,
            ownerUserId: order.buyerUserId,
            initiatorUserId,
            fromUserId: settlement.payerUserId,
            toUserId:
              settlement.payeeUserId ??
              (!settlement.toCounterpartyId ? order.sellerUserId : undefined),
            beneficiaryUserId: settlement.beneficiaryUserId,
            fromAccountId: settlement.fromAccountId,
            toAccountId: settlement.toAccountId,
            toCounterpartyId: settlement.toCounterpartyId,
            amount: settlement.amount,
            currency: settlement.currency,
            note: `Order settlement ${settlement.id}${settlement.note ? `: ${settlement.note}` : ''}`,
            occurredAt: settlement.paidAt ?? new Date(),
          },
        })
      }

      await this.ordersService.refreshStatus(tx, dto.orderId)

      return tx.orderSettlement.findUniqueOrThrow({
        where: { id: settlement.id },
        include: this.settlementInclude,
      })
    })
  }

  async list(query: ListOrderSettlementsQueryDto) {
    const { page, perPage, skip, take } = getPaginationArgs(query)
    const where: Prisma.OrderSettlementWhereInput = {
      ...(query.orderId ? { orderId: query.orderId } : {}),
      ...(query.kind ? { kind: query.kind } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.payerUserId ? { payerUserId: query.payerUserId } : {}),
      ...(query.payeeUserId ? { payeeUserId: query.payeeUserId } : {}),
      ...(query.beneficiaryUserId ? { beneficiaryUserId: query.beneficiaryUserId } : {}),
      ...(query.toCounterpartyId ? { toCounterpartyId: query.toCounterpartyId } : {}),
      ...(query.currency ? { currency: normalizeCurrency(query.currency) } : {}),
    }

    const [data, total] = await this.database.$transaction([
      this.database.orderSettlement.findMany({
        where,
        skip,
        take,
        orderBy: buildPrismaOrderBy<
          Prisma.OrderSettlementScalarFieldEnum,
          Prisma.OrderSettlementOrderByWithRelationInput
        >({
          sortBy:
            query.sortBy &&
            [
              'orderId',
              'kind',
              'status',
              'currency',
              'amount',
              'dueAt',
              'paidAt',
              'createdAt',
              'updatedAt',
            ].includes(query.sortBy)
              ? (query.sortBy as Prisma.OrderSettlementScalarFieldEnum)
              : 'createdAt',
          sortOrder: query.sortOrder ?? 'desc',
          tieBreakerField: 'id',
          tieBreakerOrder: 'asc',
        }),
        include: this.settlementInclude,
      }),
      this.database.orderSettlement.count({ where }),
    ])

    return buildPaginatedResponse({ data, total, page, perPage })
  }

  async findOne(id: string) {
    const settlement = await this.database.orderSettlement.findUnique({
      where: { id },
      include: this.settlementInclude,
    })

    if (!settlement) {
      throw new NotFoundException('Order settlement not found')
    }

    return settlement
  }

  private readonly settlementInclude = {
    order: true,
    payerUser: { select: { id: true, name: true, username: true } },
    payeeUser: { select: { id: true, name: true, username: true } },
    beneficiaryUser: { select: { id: true, name: true, username: true } },
    toCounterparty: true,
    toAccount: true,
    fromAccount: true,
  } satisfies Prisma.OrderSettlementInclude
}
