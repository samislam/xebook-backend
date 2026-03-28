import { Module } from '@nestjs/common'
import { InstitutionsController } from '@/institutions/institutions.controller'
import { InstitutionsService } from '@/institutions/institutions.service'

@Module({
  controllers: [InstitutionsController],
  providers: [InstitutionsService],
  exports: [InstitutionsService],
})
export class InstitutionsModule {}
