import { Controller, Get, Query } from '@nestjs/common'
import { DebtBalancesService } from '@/debt-balances/debt-balances.service'
import { ListDebtBalancesQueryDto } from '@/debt-balances/dto/list-debt-balances-query.dto'

@Controller({ path: 'debt-balances', version: '1' })
export class DebtBalancesController {
  constructor(private readonly debtBalancesService: DebtBalancesService) {}

  @Get()
  list(@Query() query: ListDebtBalancesQueryDto) {
    return this.debtBalancesService.list(query)
  }
}
