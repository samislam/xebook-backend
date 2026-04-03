import * as openapi from '@/orders/orders.openapi'
import { IdParamDto } from '@/common/dtos/id-param.dto'
import { OrdersService } from '@/orders/orders.service'
import { CreateOrderDto } from '@/orders/dto/create-order.dto'
import { UpdateOrderDto } from '@/orders/dto/update-order.dto'
import { ListOrdersQueryDto } from '@/orders/dto/list-orders-query.dto'
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'

@ApiTags('Orders')
@Controller({ path: 'orders', version: '1' })
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation(openapi.ordersCreateOperation)
  @ApiBody(openapi.ordersCreateBody)
  @Post()
  async create(@Body() dto: CreateOrderDto) {
    return { data: await this.ordersService.create(dto) }
  }

  @ApiOperation(openapi.ordersListOperation)
  @Get()
  list(@Query() query: ListOrdersQueryDto) {
    return this.ordersService.list(query)
  }

  @ApiOperation(openapi.ordersFindOneOperation)
  @ApiParam(openapi.orderIdParam)
  @Get(':id')
  async findOne(@Param() params: IdParamDto) {
    return { data: await this.ordersService.findOne(params.id) }
  }

  @ApiOperation(openapi.ordersUpdateOperation)
  @ApiParam(openapi.orderIdParam)
  @ApiBody(openapi.ordersUpdateBody)
  @Patch(':id')
  async update(@Param() params: IdParamDto, @Body() dto: UpdateOrderDto) {
    return { data: await this.ordersService.update(params.id, dto) }
  }
}
