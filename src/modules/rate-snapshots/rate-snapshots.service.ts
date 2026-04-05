import { Prisma } from '@/generated/prisma'
import { normalizeCurrency } from '@/common/utils/currency'
import { DatabaseService } from '@/database/database.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { buildPrismaSelect } from '@/lib/prisma/build-prisma-select'
import { buildPrismaOrderBy } from '@/lib/prisma/build-prisma-order-by'
import { assertDecimalPositive, toDecimal } from '@/common/utils/decimal'
import { CreateRateSnapshotDto } from '@/rate-snapshots/dto/create-rate-snapshot.dto'
import { rateSnapshotsResourceConfig } from '@/rate-snapshots/rate-snapshots.config'
import { ListRateSnapshotsQueryDto } from '@/rate-snapshots/dto/list-rate-snapshots-query.dto'
import { buildPaginatedResponse, getPaginationArgs } from '@/common/utils/pagination-helpers'

@Injectable()
export class RateSnapshotsService {
  constructor(private readonly database: DatabaseService) {}

  create(dto: CreateRateSnapshotDto) {
    const rate = toDecimal(dto.rate, 'rate')
    assertDecimalPositive(rate, 'rate')

    return this.database.rateSnapshot.create({
      data: {
        baseCurrency: normalizeCurrency(dto.baseCurrency),
        quoteCurrency: normalizeCurrency(dto.quoteCurrency),
        rate,
        source: dto.source,
        recorderUserId: dto.recorderUserId,
        note: dto.note,
        capturedAt: new Date(dto.capturedAt),
      },
    })
  }

  async list(query: ListRateSnapshotsQueryDto) {
    const { page, perPage, skip, take } = getPaginationArgs(query)
    const selectedFields = rateSnapshotsResourceConfig.getSelectArgs({ select: query.select })
    const sortArgs = rateSnapshotsResourceConfig.getSortArgs({
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    })
    const where: Prisma.RateSnapshotWhereInput = {
      baseCurrency: query.baseCurrency ? normalizeCurrency(query.baseCurrency) : undefined,
      quoteCurrency: query.quoteCurrency ? normalizeCurrency(query.quoteCurrency) : undefined,
      source: query.source,
    }

    const [data, total] = await this.database.$transaction([
      this.database.rateSnapshot.findMany({
        where,
        skip,
        take,
        select: buildPrismaSelect<Prisma.RateSnapshotScalarFieldEnum, Prisma.RateSnapshotSelect>(
          selectedFields
        ),
        orderBy: buildPrismaOrderBy<
          Prisma.RateSnapshotScalarFieldEnum,
          Prisma.RateSnapshotOrderByWithRelationInput
        >(sortArgs),
      }),
      this.database.rateSnapshot.count({ where }),
    ])

    return buildPaginatedResponse({ data, total, page, perPage })
  }

  async findOne(id: string) {
    const snapshot = await this.database.rateSnapshot.findUnique({ where: { id } })
    if (!snapshot) {
      throw new NotFoundException('Rate snapshot not found')
    }

    return snapshot
  }
}
