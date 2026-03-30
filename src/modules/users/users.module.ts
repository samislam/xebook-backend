import { Module } from '@nestjs/common'
import { MeController } from '@/users/me.controller'
import { UsersService } from '@/users/users.service'
import { UsersController } from '@/users/users.controller'

@Module({
  controllers: [UsersController, MeController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
