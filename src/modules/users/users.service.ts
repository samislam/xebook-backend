import { hash } from 'bcryptjs'
import { SafeUser } from './user-types'
import { Prisma, User } from '@/generated/prisma'
import { CreateUserDto } from '@/users/dto/create-user.dto'
import { UpdateUserDto } from '@/users/dto/update-user.dto'
import { DatabaseService } from '@/database/database.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { ListUsersQueryDto } from '@/users/dto/list-users-query.dto'
import { usersResourceConfig } from '@/users/users.config'
import { buildPrismaSelect } from '@/lib/prisma/build-prisma-select'
import { buildPrismaOrderBy } from '@/lib/prisma/build-prisma-order-by'
import { buildPaginatedResponse, getPaginationArgs } from '@/common/utils/pagination-helpers'

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  async create(dto: CreateUserDto) {
    const selectedFields = usersResourceConfig.getSelectArgs({})

    return this.database.user.create({
      data: {
        name: dto.name,
        username: dto.username.toLowerCase(),
        passwordHash: dto.passwordHash,
        isActive: dto.isActive ?? true,
      },
      select: buildPrismaSelect<Prisma.UserScalarFieldEnum, Prisma.UserSelect>(selectedFields),
    })
  }

  async list(query: ListUsersQueryDto) {
    const { page, perPage, skip, take } = getPaginationArgs(query)
    const { sortBy, sortOrder, search, select } = query
    const selectedFields = usersResourceConfig.getSelectArgs({ select })
    const sortArgs = usersResourceConfig.getSortArgs({ sortBy, sortOrder })
    const where: Prisma.UserWhereInput = {
      ...usersResourceConfig.search(search),
      isActive: query.isActive,
    }

    const [data, total] = await this.database.$transaction([
      this.database.user.findMany({
        where,
        skip,
        take,
        orderBy: buildPrismaOrderBy<
          Prisma.UserScalarFieldEnum,
          Prisma.UserOrderByWithRelationInput
        >(sortArgs),
        select: buildPrismaSelect<Prisma.UserScalarFieldEnum, Prisma.UserSelect>(selectedFields),
      }),
      this.database.user.count({ where }),
    ])

    return buildPaginatedResponse({ data, total, page, perPage })
  }

  async findOne(id: string) {
    const selectedFields = usersResourceConfig.getSelectArgs({})
    const user = await this.database.user.findUnique({
      where: { id },
      select: buildPrismaSelect<Prisma.UserScalarFieldEnum, Prisma.UserSelect>(selectedFields),
    })
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.ensureExists(id)
    const selectedFields = usersResourceConfig.getSelectArgs({})

    return this.database.user.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
        ...(dto.password ? { passwordHash: await hash(dto.password, 12) } : {}),
      },
      select: buildPrismaSelect<Prisma.UserScalarFieldEnum, Prisma.UserSelect>(selectedFields),
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
}
