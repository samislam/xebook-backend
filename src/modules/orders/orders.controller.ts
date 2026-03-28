import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { IdParamDto } from '@/common/dto/id-param.dto'
import { CreateOrderDto } from '@/orders/dto/create-order.dto'
import { ListOrdersQueryDto } from '@/orders/dto/list-orders-query.dto'
import { UpdateOrderDto } from '@/orders/dto/update-order.dto'
import { OrdersService } from '@/orders/orders.service'

@Controller({ path: 'orders', version: '1' })
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto)
  }

  @Get()
  list(@Query() query: ListOrdersQueryDto) {
    return this.ordersService.list(query)
  }

  @Get(':id')
  findOne(@Param() params: IdParamDto) {
    return this.ordersService.findOne(params.id)
  }

  @Patch(':id')
  update(@Param() params: IdParamDto, @Body() dto: UpdateOrderDto) {
    return this.ordersService.update(params.id, dto)
  }
}
