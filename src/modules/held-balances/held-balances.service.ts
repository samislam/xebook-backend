import { Injectable } from '@nestjs/common'
import { Prisma } from '@/generated/prisma'
import { buildPaginatedResponse, getPaginationArgs } from '@/common/utils/pagination-helpers'
import { buildPrismaOrderBy } from '@/lib/prisma/build-prisma-order-by'
import { normalizeCurrency } from '@/common/utils/currency'
import { DatabaseService } from '@/database/database.service'
import { ListHeldBalancesQueryDto } from '@/held-balances/dto/list-held-balances-query.dto'

@Injectable()
export class HeldBalancesService {
  constructor(private readonly database: DatabaseService) {}

  async list(query: ListHeldBalancesQueryDto) {
    const { page, perPage, skip, take } = getPaginationArgs(query)
    const where: Prisma.HeldBalanceWhereInput = {
      ...(query.ownerUserId ? { ownerUserId: query.ownerUserId } : {}),
      ...(query.holderUserId ? { holderUserId: query.holderUserId } : {}),
      ...(query.currency ? { currency: normalizeCurrency(query.currency) } : {}),
    }

    const [data, total] = await this.database.$transaction([
      this.database.heldBalance.findMany({
        where,
        skip,
        take,
        orderBy: buildPrismaOrderBy<
          Prisma.HeldBalanceScalarFieldEnum,
          Prisma.HeldBalanceOrderByWithRelationInput
        >({
          sortBy:
            query.sortBy &&
            [
              'ownerUserId',
              'holderUserId',
              'currency',
              'amount',
              'createdAt',
              'updatedAt',
            ].includes(query.sortBy)
              ? (query.sortBy as Prisma.HeldBalanceScalarFieldEnum)
              : 'updatedAt',
          sortOrder: query.sortOrder ?? 'desc',
          tieBreakerField: 'id',
          tieBreakerOrder: 'asc',
        }),
        include: this.balanceInclude,
      }),
      this.database.heldBalance.count({ where }),
    ])

    return buildPaginatedResponse({ data, total, page, perPage })
  }

  private readonly balanceInclude = {
    ownerUser: {
      select: { id: true, name: true, username: true },
    },
    holderUser: {
      select: { id: true, name: true, username: true },
    },
  } satisfies Prisma.HeldBalanceInclude
}
