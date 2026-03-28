import { Module } from '@nestjs/common'
import { HeldBalancesController } from '@/held-balances/held-balances.controller'
import { HeldBalancesService } from '@/held-balances/held-balances.service'

@Module({
  controllers: [HeldBalancesController],
  providers: [HeldBalancesService],
})
export class HeldBalancesModule {}
