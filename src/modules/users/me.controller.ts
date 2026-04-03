import { JwtUser } from '@/auth/types/jwt-user.type'
import { UsersService } from '@/users/users.service'
import { UpdateUserDto } from '@/users/dto/update-user.dto'
import { Body, Controller, Get, Patch, Post } from '@nestjs/common'
import { ChangePasswordDto } from '@/users/dto/change-password.dto'
import { ChangeUsernameDto } from '@/users/dto/change-username.dto'
import { CurrentUser } from '@/common/decorators/current-user.decorator'

@Controller({ path: 'me', version: '1' })
export class MeController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findMe(@CurrentUser() user: JwtUser) {
    return { data: await this.usersService.findOne(user.sub) }
  }

  @Patch()
  async updateMe(@CurrentUser() user: JwtUser, @Body() dto: UpdateUserDto) {
    return { data: await this.usersService.update(user.sub, dto) }
  }

  @Post('change-password')
  async changeMyPassword(@CurrentUser() user: JwtUser, @Body() dto: ChangePasswordDto) {
    return { data: await this.usersService.changePassword(user.sub, dto.password) }
  }

  @Post('change-username')
  async changeMyUsername(@CurrentUser() user: JwtUser, @Body() dto: ChangeUsernameDto) {
    return { data: await this.usersService.changeUsername(user.sub, dto.username) }
  }
}
