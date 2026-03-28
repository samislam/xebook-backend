import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { JwtUser } from '@/auth/types/jwt-user.type'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { IdParamDto } from '@/common/dto/id-param.dto'
import { CreateOrderSettlementDto } from '@/order-settlements/dto/create-order-settlement.dto'
import { ListOrderSettlementsQueryDto } from '@/order-settlements/dto/list-order-settlements-query.dto'
import { OrderSettlementsService } from '@/order-settlements/order-settlements.service'

@Controller({ path: 'order-settlements', version: '1' })
export class OrderSettlementsController {
  constructor(private readonly orderSettlementsService: OrderSettlementsService) {}

  @Post()
  create(@Body() dto: CreateOrderSettlementDto, @CurrentUser() user: JwtUser) {
    return this.orderSettlementsService.create(dto, user.sub)
  }

  @Get()
  list(@Query() query: ListOrderSettlementsQueryDto) {
    return this.orderSettlementsService.list(query)
  }

  @Get(':id')
  findOne(@Param() params: IdParamDto) {
    return this.orderSettlementsService.findOne(params.id)
  }
}
