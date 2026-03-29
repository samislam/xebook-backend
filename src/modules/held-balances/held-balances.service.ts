import { Injectable } from '@nestjs/common'
import { Prisma } from '@/generated/prisma'
import { normalizeCurrency } from '@/common/utils/currency'
import { DatabaseService } from '@/database/database.service'
import { buildPrismaOrderBy } from '@/lib/prisma/build-prisma-order-by'
import { heldBalancesResourceConfig } from '@/held-balances/held-balances.config'
import { ListHeldBalancesQueryDto } from '@/held-balances/dto/list-held-balances-query.dto'
import { buildPaginatedResponse, getPaginationArgs } from '@/common/utils/pagination-helpers'

@Injectable()
export class HeldBalancesService {
  constructor(private readonly database: DatabaseService) {}

  async list(query: ListHeldBalancesQueryDto) {
    const { page, perPage, skip, take } = getPaginationArgs(query)
    const sortArgs = heldBalancesResourceConfig.getSortArgs({
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    })
    const where: Prisma.HeldBalanceWhereInput = {
      ownerUserId: query.ownerUserId,
      holderUserId: query.holderUserId,
      currency: query.currency ? normalizeCurrency(query.currency) : undefined,
    }

    const [data, total] = await this.database.$transaction([
      this.database.heldBalance.findMany({
        where,
        skip,
        take,
        orderBy: buildPrismaOrderBy<
          Prisma.HeldBalanceScalarFieldEnum,
          Prisma.HeldBalanceOrderByWithRelationInput
        >(sortArgs),
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
