import { Module } from '@nestjs/common'
import { DebtBalancesController } from '@/debt-balances/debt-balances.controller'
import { DebtBalancesService } from '@/debt-balances/debt-balances.service'

@Module({
  controllers: [DebtBalancesController],
  providers: [DebtBalancesService],
})
export class DebtBalancesModule {}
