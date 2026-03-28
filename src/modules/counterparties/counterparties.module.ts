import { Module } from '@nestjs/common'
import { CounterpartiesController } from '@/counterparties/counterparties.controller'
import { CounterpartiesService } from '@/counterparties/counterparties.service'

@Module({
  controllers: [CounterpartiesController],
  providers: [CounterpartiesService],
  exports: [CounterpartiesService],
})
export class CounterpartiesModule {}
