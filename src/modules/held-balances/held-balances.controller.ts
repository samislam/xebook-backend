import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import * as openapi from '@/held-balances/held-balances.openapi'
import { HeldBalancesService } from '@/held-balances/held-balances.service'
import { ListHeldBalancesQueryDto } from '@/held-balances/dto/list-held-balances-query.dto'

@ApiTags('Held Balances')
@Controller({ path: 'held-balances', version: '1' })
export class HeldBalancesController {
  constructor(private readonly heldBalancesService: HeldBalancesService) {}

  @ApiOperation(openapi.heldBalancesListOperation)
  @Get()
  list(@Query() query: ListHeldBalancesQueryDto) {
    return this.heldBalancesService.list(query)
  }
}
