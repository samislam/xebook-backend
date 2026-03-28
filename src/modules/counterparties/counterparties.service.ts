import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@/generated/prisma'
import { buildPaginatedResponse, getPaginationArgs } from '@/common/utils/pagination-helpers'
import { buildPrismaOrderBy } from '@/lib/prisma/build-prisma-order-by'
import { DatabaseService } from '@/database/database.service'
import { CreateCounterpartyDto } from '@/counterparties/dto/create-counterparty.dto'
import { ListCounterpartiesQueryDto } from '@/counterparties/dto/list-counterparties-query.dto'
import { UpdateCounterpartyDto } from '@/counterparties/dto/update-counterparty.dto'

@Injectable()
export class CounterpartiesService {
  constructor(private readonly database: DatabaseService) {}

  create(dto: CreateCounterpartyDto) {
    return this.database.counterparty.create({
      data: dto,
    })
  }

  async list(query: ListCounterpartiesQueryDto) {
    const { page, perPage, skip, take } = getPaginationArgs(query)
    const where: Prisma.CounterpartyWhereInput = {
      ...(query.search ? { name: { contains: query.search, mode: 'insensitive' } } : {}),
      ...(query.type ? { type: query.type } : {}),
    }

    const [data, total] = await this.database.$transaction([
      this.database.counterparty.findMany({
        where,
        skip,
        take,
        orderBy: buildPrismaOrderBy<
          Prisma.CounterpartyScalarFieldEnum,
          Prisma.CounterpartyOrderByWithRelationInput
        >({
          sortBy:
            query.sortBy && ['name', 'type', 'createdAt', 'updatedAt'].includes(query.sortBy)
              ? (query.sortBy as Prisma.CounterpartyScalarFieldEnum)
              : 'createdAt',
          sortOrder: query.sortOrder ?? 'desc',
          tieBreakerField: 'id',
          tieBreakerOrder: 'asc',
        }),
      }),
      this.database.counterparty.count({ where }),
    ])

    return buildPaginatedResponse({ data, total, page, perPage })
  }

  async findOne(id: string) {
    const counterparty = await this.database.counterparty.findUnique({ where: { id } })
    if (!counterparty) {
      throw new NotFoundException('Counterparty not found')
    }

    return counterparty
  }

  async update(id: string, dto: UpdateCounterpartyDto) {
    await this.findOne(id)
    return this.database.counterparty.update({
      where: { id },
      data: dto,
    })
  }
}
