import { Module } from '@nestjs/common'
import { SaleExecutionsService } from '@/sale-executions/sale-executions.service'
import { SaleExecutionsController } from '@/sale-executions/sale-executions.controller'

@Module({
  controllers: [SaleExecutionsController],
  providers: [SaleExecutionsService],
  exports: [SaleExecutionsService],
})
export class SaleExecutionsModule {}
