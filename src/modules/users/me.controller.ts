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
  findMe(@CurrentUser() user: JwtUser) {
    return this.usersService.findOne(user.sub)
  }

  @Patch()
  updateMe(@CurrentUser() user: JwtUser, @Body() dto: UpdateUserDto) {
    return this.usersService.update(user.sub, dto)
  }

  @Post('change-password')
  changeMyPassword(@CurrentUser() user: JwtUser, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(user.sub, dto.password)
  }

  @Post('change-username')
  changeMyUsername(@CurrentUser() user: JwtUser, @Body() dto: ChangeUsernameDto) {
    return this.usersService.changeUsername(user.sub, dto.username)
  }
}
