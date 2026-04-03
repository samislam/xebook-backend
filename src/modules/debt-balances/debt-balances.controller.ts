import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import * as openapi from '@/debt-balances/debt-balances.openapi'
import { DebtBalancesService } from '@/debt-balances/debt-balances.service'
import { ListDebtBalancesQueryDto } from '@/debt-balances/dto/list-debt-balances-query.dto'

@ApiTags('Debt Balances')
@Controller({ path: 'debt-balances', version: '1' })
export class DebtBalancesController {
  constructor(private readonly debtBalancesService: DebtBalancesService) {}

  @ApiOperation(openapi.debtBalancesListOperation)
  @Get()
  list(@Query() query: ListDebtBalancesQueryDto) {
    return this.debtBalancesService.list(query)
  }
}
