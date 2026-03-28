import { compare, hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import { Injectable } from '@nestjs/common'
import { LoginDto } from '@/auth/dto/login.dto'
import { JwtUser } from '@/auth/types/jwt-user.type'
import { UsersService } from '@/users/users.service'
import { RegisterDto } from '@/auth/dto/register.dto'
import { AccountForzenHttpException } from '@/classes/auth-exception.class'
import { InvalidCredentialsHttpException } from '@/classes/auth-exception.class'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async register(dto: RegisterDto) {
    const passwordHash = await hash(dto.password, 12)
    const user = await this.usersService.create({
      name: dto.name,
      username: dto.username,
      passwordHash,
    })

    return this.buildAuthResponse({
      sub: user.id,
      username: user.username,
      name: user.name,
    })
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByUsername(dto.username)
    if (!user) throw new InvalidCredentialsHttpException()
    if (!user.isActive) throw new AccountForzenHttpException()
    const isValid = await compare(dto.password, user.passwordHash)
    if (!isValid) throw new InvalidCredentialsHttpException()
    return this.buildAuthResponse({
      sub: user.id,
      name: user.name,
      username: user.username,
    })
  }

  private async buildAuthResponse(user: JwtUser) {
    const accessToken = await this.jwtService.signAsync(user)
    return {
      user,
      accessToken,
    }
  }
}
