import { hash } from 'bcryptjs'
import * as openapi from '@/users/users.openapi'
import { UsersService } from '@/users/users.service'
import { IdParamDto } from '@/common/dtos/id-param.dto'
import { UpdateUserDto } from '@/users/dto/update-user.dto'
import { ChangeUsernameDto } from '@/users/dto/change-username.dto'
import { ChangePasswordDto } from '@/users/dto/change-password.dto'
import { ListUsersQueryDto } from '@/users/dto/list-users-query.dto'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { CreateUserRequestDto } from '@/users/dto/create-user-request.dto'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'

@ApiTags('Users')
@ApiBearerAuth()
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation(openapi.usersCreateOperation)
  @ApiBody(openapi.usersCreateBody)
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

  @ApiOperation(openapi.usersListOperation)
  @Get()
  list(@Query() query: ListUsersQueryDto) {
    return this.usersService.list(query)
  }

  @ApiOperation(openapi.usersFindOneOperation)
  @ApiParam(openapi.userIdParam)
  @Get(':id')
  async findOne(@Param() params: IdParamDto) {
    return { data: await this.usersService.findOne(params.id) }
  }

  @ApiOperation(openapi.usersUpdateOperation)
  @ApiParam(openapi.userIdParam)
  @ApiBody(openapi.usersUpdateBody)
  @Patch(':id')
  async update(@Param() params: IdParamDto, @Body() dto: UpdateUserDto) {
    return { data: await this.usersService.update(params.id, dto) }
  }

  @ApiOperation(openapi.usersChangePasswordOperation)
  @ApiParam(openapi.userIdParam)
  @ApiBody(openapi.usersChangePasswordBody)
  @Post(':id/change-password')
  async changePassword(@Param() params: IdParamDto, @Body() dto: ChangePasswordDto) {
    return { data: await this.usersService.changePassword(params.id, dto.password) }
  }

  @ApiOperation(openapi.usersChangeUsernameOperation)
  @ApiParam(openapi.userIdParam)
  @ApiBody(openapi.usersChangeUsernameBody)
  @Post(':id/change-username')
  async changeUsername(@Param() params: IdParamDto, @Body() dto: ChangeUsernameDto) {
    return { data: await this.usersService.changeUsername(params.id, dto.username) }
  }

  @ApiOperation(openapi.usersFreezeOperation)
  @ApiParam(openapi.userIdParam)
  @Post(':id/freeze')
  async freeze(@Param() params: IdParamDto) {
    return { data: await this.usersService.freeze(params.id) }
  }

  @ApiOperation(openapi.usersUnfreezeOperation)
  @ApiParam(openapi.userIdParam)
  @Post(':id/unfreeze')
  async unfreeze(@Param() params: IdParamDto) {
    return { data: await this.usersService.unfreeze(params.id) }
  }

  @ApiOperation(openapi.usersRemoveOperation)
  @ApiParam(openapi.userIdParam)
  @Delete(':id')
  async remove(@Param() params: IdParamDto) {
    return { data: await this.usersService.remove(params.id) }
  }
}
