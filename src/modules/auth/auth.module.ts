import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from '@/auth/auth.service'
import { UsersModule } from '@/users/users.module'
import { AuthController } from '@/auth/auth.controller'
import { Environment } from '@/server/environment-schema'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtStrategy } from '@/auth/strategies/jwt.strategy'

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Environment, true>) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow('JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
