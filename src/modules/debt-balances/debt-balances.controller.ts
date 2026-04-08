import { ZodResponse } from 'nestjs-zod'
import { Controller, Get, Query } from '@nestjs/common'
import * as openapi from '@/debt-balances/debt-balances.openapi'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { DebtBalancesService } from '@/debt-balances/debt-balances.service'
import { PaginatedDebtBalanceResponseZodDto } from '@/debt-balances/dto/debt-balance-responses.dto'
import { ListDebtBalancesQueryDto } from '@/debt-balances/dto/list-debt-balances-query.dto'

@ApiTags('Debt Balances')
@ApiBearerAuth()
@Controller({ path: 'debt-balances', version: '1' })
export class DebtBalancesController {
  constructor(private readonly debtBalancesService: DebtBalancesService) {}

  @ApiOperation(openapi.debtBalancesListOperation)
  @ZodResponse({ type: PaginatedDebtBalanceResponseZodDto, status: 200 })
  @Get()
  list(@Query() query: ListDebtBalancesQueryDto) {
    return this.debtBalancesService.list(query)
  }
}
