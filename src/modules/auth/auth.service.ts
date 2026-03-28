import { compare, hash } from 'bcryptjs'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { LoginDto } from '@/auth/dto/login.dto'
import { RegisterDto } from '@/auth/dto/register.dto'
import { JwtUser } from '@/auth/types/jwt-user.type'
import { UsersService } from '@/users/users.service'

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
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const isValid = await compare(dto.password, user.passwordHash)
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return this.buildAuthResponse({
      sub: user.id,
      username: user.username,
      name: user.name,
    })
  }

  private async buildAuthResponse(user: JwtUser) {
    const accessToken = await this.jwtService.signAsync(user)
    return {
      accessToken,
      user,
    }
  }
}
