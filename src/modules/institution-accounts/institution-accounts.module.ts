import { Module } from '@nestjs/common'
import { InstitutionAccountsController } from '@/institution-accounts/institution-accounts.controller'
import { InstitutionAccountsService } from '@/institution-accounts/institution-accounts.service'

@Module({
  controllers: [InstitutionAccountsController],
  providers: [InstitutionAccountsService],
  exports: [InstitutionAccountsService],
})
export class InstitutionAccountsModule {}
