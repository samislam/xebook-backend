import * as openapi from '@/users/users.openapi'
import { JwtUser } from '@/auth/types/jwt-user.type'
import { UsersService } from '@/users/users.service'
import { UpdateUserDto } from '@/users/dto/update-user.dto'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Get, Patch, Post } from '@nestjs/common'
import { ChangePasswordDto } from '@/users/dto/change-password.dto'
import { ChangeUsernameDto } from '@/users/dto/change-username.dto'
import { CurrentUser } from '@/common/decorators/current-user.decorator'

@ApiTags('Me')
@Controller({ path: 'me', version: '1' })
export class MeController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation(openapi.meFindOperation)
  @Get()
  async findMe(@CurrentUser() user: JwtUser) {
    return { data: await this.usersService.findOne(user.sub) }
  }

  @ApiOperation(openapi.meUpdateOperation)
  @ApiBody(openapi.meUpdateBody)
  @Patch()
  async updateMe(@CurrentUser() user: JwtUser, @Body() dto: UpdateUserDto) {
    return { data: await this.usersService.update(user.sub, dto) }
  }

  @ApiOperation(openapi.meChangePasswordOperation)
  @ApiBody(openapi.meChangePasswordBody)
  @Post('change-password')
  async changeMyPassword(@CurrentUser() user: JwtUser, @Body() dto: ChangePasswordDto) {
    return { data: await this.usersService.changePassword(user.sub, dto.password) }
  }

  @ApiOperation(openapi.meChangeUsernameOperation)
  @ApiBody(openapi.meChangeUsernameBody)
  @Post('change-username')
  async changeMyUsername(@CurrentUser() user: JwtUser, @Body() dto: ChangeUsernameDto) {
    return { data: await this.usersService.changeUsername(user.sub, dto.username) }
  }
}
