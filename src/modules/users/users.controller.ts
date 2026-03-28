import { hash } from 'bcryptjs'
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { IdParamDto } from '@/common/dto/id-param.dto'
import { CreateUserRequestDto } from '@/users/dto/create-user-request.dto'
import { ListUsersQueryDto } from '@/users/dto/list-users-query.dto'
import { UpdateUserDto } from '@/users/dto/update-user.dto'
import { UsersService } from '@/users/users.service'

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserRequestDto) {
    return this.usersService.create({
      name: dto.name,
      username: dto.username,
      passwordHash: await hash(dto.password, 12),
      isActive: dto.isActive,
    })
  }

  @Get()
  list(@Query() query: ListUsersQueryDto) {
    return this.usersService.list(query)
  }

  @Get(':id')
  findOne(@Param() params: IdParamDto) {
    return this.usersService.findOne(params.id)
  }

  @Patch(':id')
  update(@Param() params: IdParamDto, @Body() dto: UpdateUserDto) {
    return this.usersService.update(params.id, dto)
  }
}
