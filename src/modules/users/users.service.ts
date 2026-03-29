import { hash } from 'bcryptjs'
import { SafeUser } from './user-types'
import { Prisma, User } from '@/generated/prisma'
import { CreateUserDto } from '@/users/dto/create-user.dto'
import { UpdateUserDto } from '@/users/dto/update-user.dto'
import { DatabaseService } from '@/database/database.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { ListUsersQueryDto } from '@/users/dto/list-users-query.dto'
import { buildPrismaOrderBy } from '@/lib/prisma/build-prisma-order-by'
import { buildPaginatedResponse, getPaginationArgs } from '@/common/utils/pagination-helpers'

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  async create(dto: CreateUserDto) {
    return this.database.user.create({
      data: {
        name: dto.name,
        username: dto.username.toLowerCase(),
        passwordHash: dto.passwordHash,
        isActive: dto.isActive ?? true,
      },
      select: this.userSelect,
    })
  }

  async list(query: ListUsersQueryDto) {
    const { page, perPage, skip, take } = getPaginationArgs(query)
    const where: Prisma.UserWhereInput = {
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
              { username: { contains: query.search.toLowerCase(), mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
    }

    const [data, total] = await this.database.$transaction([
      this.database.user.findMany({
        where,
        skip,
        take,
        orderBy: buildPrismaOrderBy<
          Prisma.UserScalarFieldEnum,
          Prisma.UserOrderByWithRelationInput
        >({
          sortBy:
            query.sortBy && ['name', 'username', 'createdAt', 'updatedAt'].includes(query.sortBy)
              ? (query.sortBy as Prisma.UserScalarFieldEnum)
              : 'createdAt',
          sortOrder: query.sortOrder ?? 'desc',
          tieBreakerField: 'id',
          tieBreakerOrder: 'asc',
        }),
        select: this.userSelect,
      }),
      this.database.user.count({ where }),
    ])

    return buildPaginatedResponse({ data, total, page, perPage })
  }

  async findOne(id: string) {
    const user = await this.database.user.findUnique({
      where: { id },
      select: this.userSelect,
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.ensureExists(id)

    return this.database.user.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
        ...(dto.password ? { passwordHash: await hash(dto.password, 12) } : {}),
      },
      select: this.userSelect,
    })
  }

  findByUsername(username: string, withPasswordHash: true): Promise<User | null>
  findByUsername(username: string, withPasswordHash?: false): Promise<SafeUser | null>
  findByUsername(username: string, withPasswordHash = false) {
    return this.database.user.findUnique({
      where: { username: username.toLowerCase() },
      omit: { passwordHash: !withPasswordHash },
    })
  }

  findActiveById(id: string) {
    return this.database.user.findFirst({
      where: { id, isActive: true },
    })
  }

  private async ensureExists(id: string) {
    const user = await this.database.user.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }
  }

  private readonly userSelect = {
    id: true,
    name: true,
    username: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
  } satisfies Prisma.UserSelect
}
