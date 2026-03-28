import { Controller, Get, Query } from '@nestjs/common'
import { ListHeldBalancesQueryDto } from '@/held-balances/dto/list-held-balances-query.dto'
import { HeldBalancesService } from '@/held-balances/held-balances.service'

@Controller({ path: 'held-balances', version: '1' })
export class HeldBalancesController {
  constructor(private readonly heldBalancesService: HeldBalancesService) {}

  @Get()
  list(@Query() query: ListHeldBalancesQueryDto) {
    return this.heldBalancesService.list(query)
  }
}
