import { ZodResponse } from 'nestjs-zod'
import { Controller, Get, Query } from '@nestjs/common'
import * as openapi from '@/held-balances/held-balances.openapi'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { HeldBalancesService } from '@/held-balances/held-balances.service'
import { ListHeldBalancesQueryDto } from '@/held-balances/dto/list-held-balances-query.dto'
import { PaginatedHeldBalanceResponseZodDto } from '@/held-balances/dto/held-balance-responses.dto'

@ApiTags('Held Balances')
@ApiBearerAuth()
@Controller({ path: 'held-balances', version: '1' })
export class HeldBalancesController {
  constructor(private readonly heldBalancesService: HeldBalancesService) {}

  @ApiOperation(openapi.heldBalancesListOperation)
  @ZodResponse({ type: PaginatedHeldBalanceResponseZodDto, status: 200 })
  @Get()
  list(@Query() query: ListHeldBalancesQueryDto) {
    return this.heldBalancesService.list(query)
  }
}
