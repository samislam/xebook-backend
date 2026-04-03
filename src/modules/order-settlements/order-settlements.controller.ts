import { JwtUser } from '@/auth/types/jwt-user.type'
import { IdParamDto } from '@/common/dtos/id-param.dto'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import * as openapi from '@/order-settlements/order-settlements.openapi'
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { OrderSettlementsService } from '@/order-settlements/order-settlements.service'
import { CreateOrderSettlementDto } from '@/order-settlements/dto/create-order-settlement.dto'
import { ListOrderSettlementsQueryDto } from '@/order-settlements/dto/list-order-settlements-query.dto'

@ApiTags('Order Settlements')
@Controller({ path: 'order-settlements', version: '1' })
export class OrderSettlementsController {
  constructor(private readonly orderSettlementsService: OrderSettlementsService) {}

  @ApiOperation(openapi.orderSettlementsCreateOperation)
  @ApiBody(openapi.orderSettlementsCreateBody)
  @Post()
  async create(@Body() dto: CreateOrderSettlementDto, @CurrentUser() user: JwtUser) {
    return { data: await this.orderSettlementsService.create(dto, user.sub) }
  }

  @ApiOperation(openapi.orderSettlementsListOperation)
  @Get()
  list(@Query() query: ListOrderSettlementsQueryDto) {
    return this.orderSettlementsService.list(query)
  }

  @ApiOperation(openapi.orderSettlementsFindOneOperation)
  @ApiParam(openapi.orderSettlementIdParam)
  @Get(':id')
  async findOne(@Param() params: IdParamDto) {
    return { data: await this.orderSettlementsService.findOne(params.id) }
  }
}
