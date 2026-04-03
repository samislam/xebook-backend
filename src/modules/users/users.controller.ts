import { hash } from 'bcryptjs'
import { UsersService } from '@/users/users.service'
import { IdParamDto } from '@/common/dtos/id-param.dto'
import { UpdateUserDto } from '@/users/dto/update-user.dto'
import { ChangeUsernameDto } from '@/users/dto/change-username.dto'
import { ChangePasswordDto } from '@/users/dto/change-password.dto'
import { ListUsersQueryDto } from '@/users/dto/list-users-query.dto'
import { CreateUserRequestDto } from '@/users/dto/create-user-request.dto'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserRequestDto) {
    return {
      data: await this.usersService.create({
        name: dto.name,
        username: dto.username,
        passwordHash: await hash(dto.password, 12),
        isActive: dto.isActive,
      }),
    }
  }

  @Get()
  list(@Query() query: ListUsersQueryDto) {
    return this.usersService.list(query)
  }

  @Get(':id')
  async findOne(@Param() params: IdParamDto) {
    return { data: await this.usersService.findOne(params.id) }
  }

  @Patch(':id')
  async update(@Param() params: IdParamDto, @Body() dto: UpdateUserDto) {
    return { data: await this.usersService.update(params.id, dto) }
  }

  @Post(':id/change-password')
  async changePassword(@Param() params: IdParamDto, @Body() dto: ChangePasswordDto) {
    return { data: await this.usersService.changePassword(params.id, dto.password) }
  }

  @Post(':id/change-username')
  async changeUsername(@Param() params: IdParamDto, @Body() dto: ChangeUsernameDto) {
    return { data: await this.usersService.changeUsername(params.id, dto.username) }
  }

  @Post(':id/freeze')
  async freeze(@Param() params: IdParamDto) {
    return { data: await this.usersService.freeze(params.id) }
  }

  @Post(':id/unfreeze')
  async unfreeze(@Param() params: IdParamDto) {
    return { data: await this.usersService.unfreeze(params.id) }
  }

  @Delete(':id')
  async remove(@Param() params: IdParamDto) {
    return { data: await this.usersService.remove(params.id) }
  }
}
