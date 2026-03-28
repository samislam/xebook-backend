import { Module } from '@nestjs/common'
import { TransactionsController } from '@/transactions/transactions.controller'
import { TransactionsService } from '@/transactions/transactions.service'

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
