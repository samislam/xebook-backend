import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@/generated/prisma'
import { buildPaginatedResponse, getPaginationArgs } from '@/common/utils/pagination-helpers'
import { buildPrismaOrderBy } from '@/lib/prisma/build-prisma-order-by'
import { DatabaseService } from '@/database/database.service'
import { CreateInstitutionDto } from '@/institutions/dto/create-institution.dto'
import { ListInstitutionsQueryDto } from '@/institutions/dto/list-institutions-query.dto'
import { UpdateInstitutionDto } from '@/institutions/dto/update-institution.dto'

@Injectable()
export class InstitutionsService {
  constructor(private readonly database: DatabaseService) {}

  create(dto: CreateInstitutionDto) {
    return this.database.institution.create({
      data: dto,
    })
  }

  async list(query: ListInstitutionsQueryDto) {
    const { page, perPage, skip, take } = getPaginationArgs(query)
    const where: Prisma.InstitutionWhereInput = {
      ...(query.search ? { name: { contains: query.search, mode: 'insensitive' } } : {}),
      ...(query.type ? { type: query.type } : {}),
    }

    const [data, total] = await this.database.$transaction([
      this.database.institution.findMany({
        where,
        skip,
        take,
        orderBy: buildPrismaOrderBy<
          Prisma.InstitutionScalarFieldEnum,
          Prisma.InstitutionOrderByWithRelationInput
        >({
          sortBy:
            query.sortBy &&
            ['name', 'country', 'type', 'createdAt', 'updatedAt'].includes(query.sortBy)
              ? (query.sortBy as Prisma.InstitutionScalarFieldEnum)
              : 'createdAt',
          sortOrder: query.sortOrder ?? 'desc',
          tieBreakerField: 'id',
          tieBreakerOrder: 'asc',
        }),
      }),
      this.database.institution.count({ where }),
    ])

    return buildPaginatedResponse({ data, total, page, perPage })
  }

  async findOne(id: string) {
    const institution = await this.database.institution.findUnique({ where: { id } })
    if (!institution) {
      throw new NotFoundException('Institution not found')
    }

    return institution
  }

  async update(id: string, dto: UpdateInstitutionDto) {
    await this.findOne(id)
    return this.database.institution.update({
      where: { id },
      data: dto,
    })
  }
}
