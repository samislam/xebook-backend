import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtUser } from '@/auth/types/jwt-user.type'
import { UsersService } from '@/users/users.service'
import { Environment } from '@/server/environment-schema'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService<Environment, true>,
    private readonly usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    })
  }

  async validate(payload: JwtUser) {
    const user = await this.usersService.findActiveById(payload.sub)
    if (!user) {
      throw new UnauthorizedException('User is no longer active')
    }

    return {
      sub: user.id,
      username: user.username,
      name: user.name,
    } satisfies JwtUser
  }
}
