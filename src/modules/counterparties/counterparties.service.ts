import { Prisma } from '@/generated/prisma'
import { DatabaseService } from '@/database/database.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { buildPrismaSelect } from '@/lib/prisma/build-prisma-select'
import { buildPrismaOrderBy } from '@/lib/prisma/build-prisma-order-by'
import { CreateCounterpartyDto } from '@/counterparties/dto/create-counterparty.dto'
import { UpdateCounterpartyDto } from '@/counterparties/dto/update-counterparty.dto'
import { counterpartiesResourceConfig } from '@/counterparties/counterparties.config'
import { buildPaginatedResponse, getPaginationArgs } from '@/common/utils/pagination-helpers'
import { ListCounterpartiesQueryDto } from '@/counterparties/dto/list-counterparties-query.dto'

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
    const selectedFields = counterpartiesResourceConfig.getSelectArgs({ select: query.select })
    const sortArgs = counterpartiesResourceConfig.getSortArgs({
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    })
    const where: Prisma.CounterpartyWhereInput = {
      ...counterpartiesResourceConfig.search(query.search),
      type: query.type,
    }

    const [data, total] = await this.database.$transaction([
      this.database.counterparty.findMany({
        where,
        skip,
        take,
        select: buildPrismaSelect<Prisma.CounterpartyScalarFieldEnum, Prisma.CounterpartySelect>(
          selectedFields
        ),
        orderBy: buildPrismaOrderBy<
          Prisma.CounterpartyScalarFieldEnum,
          Prisma.CounterpartyOrderByWithRelationInput
        >(sortArgs),
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

  async remove(id: string) {
    await this.findOne(id)
    return this.database.counterparty.delete({
      where: { id },
    })
  }
}
