import { Injectable } from '@nestjs/common'
import { Prisma } from '@/generated/prisma'
import { buildPaginatedResponse, getPaginationArgs } from '@/common/utils/pagination-helpers'
import { buildPrismaOrderBy } from '@/lib/prisma/build-prisma-order-by'
import { normalizeCurrency } from '@/common/utils/currency'
import { DatabaseService } from '@/database/database.service'
import { ListDebtBalancesQueryDto } from '@/debt-balances/dto/list-debt-balances-query.dto'

@Injectable()
export class DebtBalancesService {
  constructor(private readonly database: DatabaseService) {}

  async list(query: ListDebtBalancesQueryDto) {
    const { page, perPage, skip, take } = getPaginationArgs(query)
    const where: Prisma.DebtBalanceWhereInput = {
      ...(query.debtorUserId ? { debtorUserId: query.debtorUserId } : {}),
      ...(query.creditorUserId ? { creditorUserId: query.creditorUserId } : {}),
      ...(query.currency ? { currency: normalizeCurrency(query.currency) } : {}),
    }

    const [data, total] = await this.database.$transaction([
      this.database.debtBalance.findMany({
        where,
        skip,
        take,
        orderBy: buildPrismaOrderBy<
          Prisma.DebtBalanceScalarFieldEnum,
          Prisma.DebtBalanceOrderByWithRelationInput
        >({
          sortBy:
            query.sortBy &&
            [
              'debtorUserId',
              'creditorUserId',
              'currency',
              'amount',
              'createdAt',
              'updatedAt',
            ].includes(query.sortBy)
              ? (query.sortBy as Prisma.DebtBalanceScalarFieldEnum)
              : 'updatedAt',
          sortOrder: query.sortOrder ?? 'desc',
          tieBreakerField: 'id',
          tieBreakerOrder: 'asc',
        }),
        include: this.balanceInclude,
      }),
      this.database.debtBalance.count({ where }),
    ])

    return buildPaginatedResponse({ data, total, page, perPage })
  }

  private readonly balanceInclude = {
    debtorUser: {
      select: { id: true, name: true, username: true },
    },
    creditorUser: {
      select: { id: true, name: true, username: true },
    },
  } satisfies Prisma.DebtBalanceInclude
}
