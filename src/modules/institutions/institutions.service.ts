import { Prisma } from '@/generated/prisma'
import { DatabaseService } from '@/database/database.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { buildPrismaSelect } from '@/lib/prisma/build-prisma-select'
import { buildPrismaOrderBy } from '@/lib/prisma/build-prisma-order-by'
import { institutionsResourceConfig } from '@/institutions/institutions.config'
import { CreateInstitutionDto } from '@/institutions/dto/create-institution.dto'
import { UpdateInstitutionDto } from '@/institutions/dto/update-institution.dto'
import { ListInstitutionsQueryDto } from '@/institutions/dto/list-institutions-query.dto'
import { buildPaginatedResponse, getPaginationArgs } from '@/common/utils/pagination-helpers'

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
    const selectedFields = institutionsResourceConfig.getSelectArgs({ select: query.select })
    const sortArgs = institutionsResourceConfig.getSortArgs({
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    })
    const where: Prisma.InstitutionWhereInput = {
      ...institutionsResourceConfig.search(query.search),
      type: query.type,
    }

    const [data, total] = await this.database.$transaction([
      this.database.institution.findMany({
        where,
        skip,
        take,
        select: buildPrismaSelect<Prisma.InstitutionScalarFieldEnum, Prisma.InstitutionSelect>(
          selectedFields
        ),
        orderBy: buildPrismaOrderBy<
          Prisma.InstitutionScalarFieldEnum,
          Prisma.InstitutionOrderByWithRelationInput
        >(sortArgs),
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

  async remove(id: string) {
    await this.findOne(id)
    return this.database.institution.delete({
      where: { id },
    })
  }
}
