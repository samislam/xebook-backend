import { ZodResponse } from 'nestjs-zod'
import * as openapi from '@/auth/auth.openapi'
import { LoginDto } from '@/auth/dto/login.dto'
import { AuthService } from '@/auth/auth.service'
import { JwtUser } from '@/auth/types/jwt-user.type'
import { RegisterDto } from '@/auth/dto/register.dto'
import { Public } from '@/common/decorators/public.decorator'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { WrappedAuthPayloadResponseZodDto } from '@/auth/dto/auth-responses.dto'
import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { WrappedCurrentAuthUserResponseZodDto } from '@/auth/dto/auth-responses.dto'

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation(openapi.authRegisterOperation)
  @ZodResponse({ type: WrappedAuthPayloadResponseZodDto, status: 201 })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return { data: await this.authService.register(dto) }
  }

  @Public()
  @ApiOperation(openapi.authLoginOperation)
  @ZodResponse({ type: WrappedAuthPayloadResponseZodDto, status: 200 })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return { data: await this.authService.login(dto) }
  }

  @ApiBearerAuth()
  @ApiOperation(openapi.authMeOperation)
  @ZodResponse({ type: WrappedCurrentAuthUserResponseZodDto, status: 200 })
  @Get(['me', 'whoami'])
  me(@CurrentUser() user: JwtUser) {
    return { data: { user } }
  }
}
