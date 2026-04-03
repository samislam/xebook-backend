import * as openapi from '@/auth/auth.openapi'
import { LoginDto } from '@/auth/dto/login.dto'
import { AuthService } from '@/auth/auth.service'
import { JwtUser } from '@/auth/types/jwt-user.type'
import { RegisterDto } from '@/auth/dto/register.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Public } from '@/common/decorators/public.decorator'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common'

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation(openapi.authRegisterOperation)
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return { data: await this.authService.register(dto) }
  }

  @Public()
  @ApiOperation(openapi.authLoginOperation)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return { data: await this.authService.login(dto) }
  }

  @ApiBearerAuth()
  @ApiOperation(openapi.authMeOperation)
  @Get(['me', 'whoami'])
  me(@CurrentUser() user: JwtUser) {
    return { data: { user } }
  }
}
