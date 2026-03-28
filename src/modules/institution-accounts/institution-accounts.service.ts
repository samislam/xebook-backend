import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@/generated/prisma'
import { buildPaginatedResponse, getPaginationArgs } from '@/common/utils/pagination-helpers'
import { buildPrismaOrderBy } from '@/lib/prisma/build-prisma-order-by'
import { normalizeCurrency } from '@/common/utils/currency'
import { DatabaseService } from '@/database/database.service'
import { CreateInstitutionAccountDto } from '@/institution-accounts/dto/create-institution-account.dto'
import { ListInstitutionAccountsQueryDto } from '@/institution-accounts/dto/list-institution-accounts-query.dto'
import { UpdateInstitutionAccountDto } from '@/institution-accounts/dto/update-institution-account.dto'

@Injectable()
export class InstitutionAccountsService {
  constructor(private readonly database: DatabaseService) {}

  create(dto: CreateInstitutionAccountDto) {
    return this.database.institutionAccount.create({
      data: {
        ...dto,
        currency: normalizeCurrency(dto.currency),
        isActive: dto.isActive ?? true,
      },
      include: this.accountInclude,
    })
  }

  async list(query: ListInstitutionAccountsQueryDto) {
    const { page, perPage, skip, take } = getPaginationArgs(query)
    const where: Prisma.InstitutionAccountWhereInput = {
      ...(query.userId ? { userId: query.userId } : {}),
      ...(query.institutionId ? { institutionId: query.institutionId } : {}),
      ...(query.currency ? { currency: normalizeCurrency(query.currency) } : {}),
      ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
    }

    const [data, total] = await this.database.$transaction([
      this.database.institutionAccount.findMany({
        where,
        skip,
        take,
        orderBy: buildPrismaOrderBy<
          Prisma.InstitutionAccountScalarFieldEnum,
          Prisma.InstitutionAccountOrderByWithRelationInput
        >({
          sortBy:
            query.sortBy && ['title', 'currency', 'createdAt', 'updatedAt'].includes(query.sortBy)
              ? (query.sortBy as Prisma.InstitutionAccountScalarFieldEnum)
              : 'createdAt',
          sortOrder: query.sortOrder ?? 'desc',
          tieBreakerField: 'id',
          tieBreakerOrder: 'asc',
        }),
        include: this.accountInclude,
      }),
      this.database.institutionAccount.count({ where }),
    ])

    return buildPaginatedResponse({ data, total, page, perPage })
  }

  async findOne(id: string) {
    const account = await this.database.institutionAccount.findUnique({
      where: { id },
      include: this.accountInclude,
    })
    if (!account) {
      throw new NotFoundException('Institution account not found')
    }

    return account
  }

  async update(id: string, dto: UpdateInstitutionAccountDto) {
    await this.findOne(id)
    return this.database.institutionAccount.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.currency ? { currency: normalizeCurrency(dto.currency) } : {}),
      },
      include: this.accountInclude,
    })
  }

  private readonly accountInclude = {
    user: {
      select: {
        id: true,
        name: true,
        username: true,
      },
    },
    institution: true,
  } satisfies Prisma.InstitutionAccountInclude
}
