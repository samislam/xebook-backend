import { Prisma } from '@/generated/prisma'
import { normalizeCurrency } from '@/common/utils/currency'
import { DatabaseService } from '@/database/database.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { buildPrismaOrderBy } from '@/lib/prisma/build-prisma-order-by'
import { buildPaginatedResponse, getPaginationArgs } from '@/common/utils/pagination-helpers'
import { institutionAccountsResourceConfig } from '@/institution-accounts/institution-accounts.config'
import { CreateInstitutionAccountDto } from '@/institution-accounts/dto/create-institution-account.dto'
import { UpdateInstitutionAccountDto } from '@/institution-accounts/dto/update-institution-account.dto'
import { ListInstitutionAccountsQueryDto } from '@/institution-accounts/dto/list-institution-accounts-query.dto'

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
    const sortArgs = institutionAccountsResourceConfig.getSortArgs({
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    })
    const where: Prisma.InstitutionAccountWhereInput = {
      userId: query.userId,
      institutionId: query.institutionId,
      currency: query.currency ? normalizeCurrency(query.currency) : undefined,
      isActive: query.isActive,
    }

    const [data, total] = await this.database.$transaction([
      this.database.institutionAccount.findMany({
        where,
        skip,
        take,
        orderBy: buildPrismaOrderBy<
          Prisma.InstitutionAccountScalarFieldEnum,
          Prisma.InstitutionAccountOrderByWithRelationInput
        >(sortArgs),
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

  async remove(id: string) {
    await this.findOne(id)
    return this.database.institutionAccount.delete({
      where: { id },
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
