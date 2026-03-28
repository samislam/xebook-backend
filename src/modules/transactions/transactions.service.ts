import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma, Transaction as TransactionModel, TransactionType } from '@/generated/prisma'
import { BalancesService } from '@/balances/balances.service'
import { buildPaginatedResponse, getPaginationArgs } from '@/common/utils/pagination-helpers'
import { buildPrismaOrderBy } from '@/lib/prisma/build-prisma-order-by'
import { assertDecimalPositive, toDecimal } from '@/common/utils/decimal'
import { normalizeCurrency } from '@/common/utils/currency'
import { DatabaseService } from '@/database/database.service'
import { CreateTransactionDto } from '@/transactions/dto/create-transaction.dto'
import { ListTransactionsQueryDto } from '@/transactions/dto/list-transactions-query.dto'

@Injectable()
export class TransactionsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly balancesService: BalancesService
  ) {}

  async create(dto: CreateTransactionDto, initiatorUserId: string) {
    const amount = toDecimal(dto.amount)
    assertDecimalPositive(amount)
    const currency = normalizeCurrency(dto.currency)

    return this.database.$transaction(async (tx) => {
      this.validate(dto)

      const transaction = await tx.transaction.create({
        data: {
          type: dto.type,
          method: dto.method,
          ownerUserId: dto.ownerUserId,
          initiatorUserId,
          fromUserId: dto.fromUserId,
          toUserId: dto.toUserId,
          beneficiaryUserId: dto.beneficiaryUserId,
          fromAccountId: dto.fromAccountId,
          toAccountId: dto.toAccountId,
          fromCounterpartyId: dto.fromCounterpartyId,
          toCounterpartyId: dto.toCounterpartyId,
          amount,
          currency,
          referenceCode: dto.referenceCode,
          note: dto.note,
          occurredAt: dto.occurredAt,
        },
        include: this.transactionInclude,
      })

      await this.applyBalanceRules(tx, transaction)
      return transaction
    })
  }

  async list(query: ListTransactionsQueryDto) {
    const { page, perPage, skip, take } = getPaginationArgs(query)
    const where: Prisma.TransactionWhereInput = {
      ...(query.ownerUserId ? { ownerUserId: query.ownerUserId } : {}),
      ...(query.initiatorUserId ? { initiatorUserId: query.initiatorUserId } : {}),
      ...(query.fromUserId ? { fromUserId: query.fromUserId } : {}),
      ...(query.toUserId ? { toUserId: query.toUserId } : {}),
      ...(query.beneficiaryUserId ? { beneficiaryUserId: query.beneficiaryUserId } : {}),
      ...(query.fromAccountId ? { fromAccountId: query.fromAccountId } : {}),
      ...(query.toAccountId ? { toAccountId: query.toAccountId } : {}),
      ...(query.fromCounterpartyId ? { fromCounterpartyId: query.fromCounterpartyId } : {}),
      ...(query.toCounterpartyId ? { toCounterpartyId: query.toCounterpartyId } : {}),
      ...(query.currency ? { currency: normalizeCurrency(query.currency) } : {}),
      ...(query.type ? { type: query.type } : {}),
      ...(query.method ? { method: query.method } : {}),
      ...(query.occurredFrom || query.occurredTo
        ? {
            occurredAt: {
              ...(query.occurredFrom ? { gte: query.occurredFrom } : {}),
              ...(query.occurredTo ? { lte: query.occurredTo } : {}),
            },
          }
        : {}),
    }

    const [data, total] = await this.database.$transaction([
      this.database.transaction.findMany({
        where,
        skip,
        take,
        orderBy: buildPrismaOrderBy<
          Prisma.TransactionScalarFieldEnum,
          Prisma.TransactionOrderByWithRelationInput
        >({
          sortBy:
            query.sortBy &&
            [
              'type',
              'method',
              'ownerUserId',
              'initiatorUserId',
              'currency',
              'amount',
              'occurredAt',
              'createdAt',
              'updatedAt',
            ].includes(query.sortBy)
              ? (query.sortBy as Prisma.TransactionScalarFieldEnum)
              : 'occurredAt',
          sortOrder: query.sortOrder ?? 'desc',
          tieBreakerField: 'id',
          tieBreakerOrder: 'asc',
        }),
        include: this.transactionInclude,
      }),
      this.database.transaction.count({ where }),
    ])

    return buildPaginatedResponse({ data, total, page, perPage })
  }

  async findOne(id: string) {
    const transaction = await this.database.transaction.findUnique({
      where: { id },
      include: this.transactionInclude,
    })

    if (!transaction) {
      throw new NotFoundException('Transaction not found')
    }

    return transaction
  }

  private validate(dto: CreateTransactionDto) {
    const requireFields = (fields: Array<keyof CreateTransactionDto>) => {
      for (const field of fields) {
        if (!dto[field]) {
          throw new BadRequestException(`${String(field)} is required for ${dto.type}`)
        }
      }
    }

    switch (dto.type) {
      case TransactionType.OPENING_BALANCE:
      case TransactionType.CASH_TO_USER_HOLD:
      case TransactionType.ACCOUNT_TO_USER_HOLD:
        requireFields(['ownerUserId', 'toUserId'])
        break
      case TransactionType.USER_RETURNS_FUNDS:
        requireFields(['ownerUserId', 'fromUserId'])
        break
      case TransactionType.INTERNAL_HOLDER_TRANSFER:
        requireFields(['ownerUserId', 'fromUserId', 'toUserId'])
        break
      case TransactionType.CREATE_DEBT:
        requireFields(['fromUserId', 'toUserId'])
        break
      case TransactionType.SETTLE_DEBT_DIRECT:
        requireFields(['ownerUserId', 'toUserId'])
        break
      case TransactionType.SETTLE_DEBT_VIA_COUNTERPARTY:
        requireFields(['ownerUserId', 'fromUserId', 'beneficiaryUserId', 'toCounterpartyId'])
        break
      default:
        break
    }
  }

  private async applyBalanceRules(tx: Prisma.TransactionClient, transaction: TransactionModel) {
    switch (transaction.type) {
      case TransactionType.OPENING_BALANCE:
      case TransactionType.CASH_TO_USER_HOLD:
      case TransactionType.ACCOUNT_TO_USER_HOLD:
        await this.balancesService.adjustHeldBalance(
          tx,
          transaction.ownerUserId,
          transaction.toUserId!,
          transaction.currency,
          transaction.amount
        )
        break
      case TransactionType.USER_RETURNS_FUNDS:
        await this.balancesService.adjustHeldBalance(
          tx,
          transaction.ownerUserId,
          transaction.fromUserId!,
          transaction.currency,
          transaction.amount.negated()
        )
        break
      case TransactionType.INTERNAL_HOLDER_TRANSFER:
        await this.balancesService.adjustHeldBalance(
          tx,
          transaction.ownerUserId,
          transaction.fromUserId!,
          transaction.currency,
          transaction.amount.negated()
        )
        await this.balancesService.adjustHeldBalance(
          tx,
          transaction.ownerUserId,
          transaction.toUserId!,
          transaction.currency,
          transaction.amount
        )
        break
      case TransactionType.CREATE_DEBT:
        await this.balancesService.adjustDebtBalance(
          tx,
          transaction.toUserId!,
          transaction.fromUserId!,
          transaction.currency,
          transaction.amount
        )
        break
      case TransactionType.SETTLE_DEBT_DIRECT:
        await this.balancesService.adjustDebtBalance(
          tx,
          transaction.ownerUserId,
          transaction.toUserId!,
          transaction.currency,
          transaction.amount.negated()
        )

        if (transaction.fromUserId && transaction.fromUserId !== transaction.ownerUserId) {
          await this.balancesService.adjustHeldBalance(
            tx,
            transaction.ownerUserId,
            transaction.fromUserId,
            transaction.currency,
            transaction.amount.negated()
          )
        }
        break
      case TransactionType.SETTLE_DEBT_VIA_COUNTERPARTY:
        await this.balancesService.adjustDebtBalance(
          tx,
          transaction.ownerUserId,
          transaction.beneficiaryUserId!,
          transaction.currency,
          transaction.amount.negated()
        )

        if (transaction.fromUserId && transaction.fromUserId !== transaction.ownerUserId) {
          await this.balancesService.adjustHeldBalance(
            tx,
            transaction.ownerUserId,
            transaction.fromUserId,
            transaction.currency,
            transaction.amount.negated()
          )
        }
        break
      default:
        break
    }
  }

  private readonly transactionInclude = {
    ownerUser: { select: { id: true, name: true, username: true } },
    initiatorUser: { select: { id: true, name: true, username: true } },
    fromUser: { select: { id: true, name: true, username: true } },
    toUser: { select: { id: true, name: true, username: true } },
    beneficiaryUser: { select: { id: true, name: true, username: true } },
    fromAccount: true,
    toAccount: true,
    fromCounterparty: true,
    toCounterparty: true,
  } satisfies Prisma.TransactionInclude
}
