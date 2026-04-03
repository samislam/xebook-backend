import { IdParamDto } from '@/common/dtos/id-param.dto'
import { OrdersService } from '@/orders/orders.service'
import { CreateOrderDto } from '@/orders/dto/create-order.dto'
import { UpdateOrderDto } from '@/orders/dto/update-order.dto'
import { ListOrdersQueryDto } from '@/orders/dto/list-orders-query.dto'
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'

@Controller({ path: 'orders', version: '1' })
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() dto: CreateOrderDto) {
    return { data: await this.ordersService.create(dto) }
  }

  @Get()
  list(@Query() query: ListOrdersQueryDto) {
    return this.ordersService.list(query)
  }

  @Get(':id')
  async findOne(@Param() params: IdParamDto) {
    return { data: await this.ordersService.findOne(params.id) }
  }

  @Patch(':id')
  async update(@Param() params: IdParamDto, @Body() dto: UpdateOrderDto) {
    return { data: await this.ordersService.update(params.id, dto) }
  }
}
