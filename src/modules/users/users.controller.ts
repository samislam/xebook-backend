import { hash } from 'bcryptjs'
import { ZodResponse } from 'nestjs-zod'
import * as openapi from '@/users/users.openapi'
import { UsersService } from '@/users/users.service'
import { IdParamDto } from '@/common/dtos/id-param.dto'
import { UpdateUserDto } from '@/users/dto/update-user.dto'
import { ChangeUsernameDto } from '@/users/dto/change-username.dto'
import { ChangePasswordDto } from '@/users/dto/change-password.dto'
import { ListUsersQueryDto } from '@/users/dto/list-users-query.dto'
import { WrappedUserResponseZodDto } from '@/users/dto/user-responses.dto'
import { CreateUserRequestDto } from '@/users/dto/create-user-request.dto'
import { PaginatedUserResponseZodDto } from '@/users/dto/user-responses.dto'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'

@ApiTags('Users')
@ApiBearerAuth()
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation(openapi.usersCreateOperation)
  @ApiBody(openapi.usersCreateBody)
  @ZodResponse({ type: WrappedUserResponseZodDto, status: 201 })
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
  @ZodResponse({ type: PaginatedUserResponseZodDto, status: 200 })
  @Get()
  list(@Query() query: ListUsersQueryDto) {
    return this.usersService.list(query)
  }

  @ApiOperation(openapi.usersFindOneOperation)
  @ApiParam(openapi.userIdParam)
  @ZodResponse({ type: WrappedUserResponseZodDto, status: 200 })
  @Get(':id')
  async findOne(@Param() params: IdParamDto) {
    return { data: await this.usersService.findOne(params.id) }
  }

  @ApiOperation(openapi.usersUpdateOperation)
  @ApiParam(openapi.userIdParam)
  @ApiBody(openapi.usersUpdateBody)
  @ZodResponse({ type: WrappedUserResponseZodDto, status: 200 })
  @Patch(':id')
  async update(@Param() params: IdParamDto, @Body() dto: UpdateUserDto) {
    return { data: await this.usersService.update(params.id, dto) }
  }

  @ApiOperation(openapi.usersChangePasswordOperation)
  @ApiParam(openapi.userIdParam)
  @ApiBody(openapi.usersChangePasswordBody)
  @ZodResponse({ type: WrappedUserResponseZodDto, status: 200 })
  @Post(':id/change-password')
  async changePassword(@Param() params: IdParamDto, @Body() dto: ChangePasswordDto) {
    return { data: await this.usersService.changePassword(params.id, dto.password) }
  }

  @ApiOperation(openapi.usersChangeUsernameOperation)
  @ApiParam(openapi.userIdParam)
  @ApiBody(openapi.usersChangeUsernameBody)
  @ZodResponse({ type: WrappedUserResponseZodDto, status: 200 })
  @Post(':id/change-username')
  async changeUsername(@Param() params: IdParamDto, @Body() dto: ChangeUsernameDto) {
    return { data: await this.usersService.changeUsername(params.id, dto.username) }
  }

  @ApiOperation(openapi.usersFreezeOperation)
  @ApiParam(openapi.userIdParam)
  @ZodResponse({ type: WrappedUserResponseZodDto, status: 200 })
  @Post(':id/freeze')
  async freeze(@Param() params: IdParamDto) {
    return { data: await this.usersService.freeze(params.id) }
  }

  @ApiOperation(openapi.usersUnfreezeOperation)
  @ApiParam(openapi.userIdParam)
  @ZodResponse({ type: WrappedUserResponseZodDto, status: 200 })
  @Post(':id/unfreeze')
  async unfreeze(@Param() params: IdParamDto) {
    return { data: await this.usersService.unfreeze(params.id) }
  }

  @ApiOperation(openapi.usersRemoveOperation)
  @ApiParam(openapi.userIdParam)
  @ZodResponse({ type: WrappedUserResponseZodDto, status: 200 })
  @Delete(':id')
  async remove(@Param() params: IdParamDto) {
    return { data: await this.usersService.remove(params.id) }
  }
}
