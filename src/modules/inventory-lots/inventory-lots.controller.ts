import { IdParamDto } from '@/common/dtos/id-param.dto'
import * as openapi from '@/inventory-lots/inventory-lots.openapi'
import { InventoryLotsService } from '@/inventory-lots/inventory-lots.service'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { CreateInventoryLotDto } from '@/inventory-lots/dto/create-inventory-lot.dto'
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ListInventoryLotsQueryDto } from '@/inventory-lots/dto/list-inventory-lots-query.dto'

@ApiTags('Inventory Lots')
@ApiBearerAuth()
@Controller({ path: 'inventory-lots', version: '1' })
export class InventoryLotsController {
  constructor(private readonly inventoryLotsService: InventoryLotsService) {}

  @ApiOperation(openapi.inventoryLotsCreateOperation)
  @ApiBody(openapi.inventoryLotsCreateBody)
  @Post()
  async create(@Body() dto: CreateInventoryLotDto) {
    return { data: await this.inventoryLotsService.create(dto) }
  }

  @ApiOperation(openapi.inventoryLotsListOperation)
  @Get()
  list(@Query() query: ListInventoryLotsQueryDto) {
    return this.inventoryLotsService.list(query)
  }

  @ApiOperation(openapi.inventoryLotsFindOneOperation)
  @ApiParam(openapi.inventoryLotIdParam)
  @Get(':id')
  async findOne(@Param() params: IdParamDto) {
    return { data: await this.inventoryLotsService.findOne(params.id) }
  }
}
