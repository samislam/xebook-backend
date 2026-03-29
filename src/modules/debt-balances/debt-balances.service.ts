import { Injectable } from '@nestjs/common'
import { Prisma } from '@/generated/prisma'
import { normalizeCurrency } from '@/common/utils/currency'
import { DatabaseService } from '@/database/database.service'
import { buildPrismaOrderBy } from '@/lib/prisma/build-prisma-order-by'
import { debtBalancesResourceConfig } from '@/debt-balances/debt-balances.config'
import { ListDebtBalancesQueryDto } from '@/debt-balances/dto/list-debt-balances-query.dto'
import { buildPaginatedResponse, getPaginationArgs } from '@/common/utils/pagination-helpers'

@Injectable()
export class DebtBalancesService {
  constructor(private readonly database: DatabaseService) {}

  async list(query: ListDebtBalancesQueryDto) {
    const { page, perPage, skip, take } = getPaginationArgs(query)
    const sortArgs = debtBalancesResourceConfig.getSortArgs({
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    })
    const where: Prisma.DebtBalanceWhereInput = {
      debtorUserId: query.debtorUserId,
      creditorUserId: query.creditorUserId,
      currency: query.currency ? normalizeCurrency(query.currency) : undefined,
    }

    const [data, total] = await this.database.$transaction([
      this.database.debtBalance.findMany({
        where,
        skip,
        take,
        orderBy: buildPrismaOrderBy<
          Prisma.DebtBalanceScalarFieldEnum,
          Prisma.DebtBalanceOrderByWithRelationInput
        >(sortArgs),
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
