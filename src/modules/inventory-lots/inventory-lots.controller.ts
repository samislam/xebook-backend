import { ZodResponse } from 'nestjs-zod'
import { IdParamDto } from '@/common/dtos/id-param.dto'
import * as openapi from '@/inventory-lots/inventory-lots.openapi'
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { InventoryLotsService } from '@/inventory-lots/inventory-lots.service'
import { CreateInventoryLotDto } from '@/inventory-lots/dto/create-inventory-lot.dto'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { ListInventoryLotsQueryDto } from '@/inventory-lots/dto/list-inventory-lots-query.dto'
import { WrappedInventoryLotResponseZodDto } from '@/inventory-lots/dto/inventory-lot-responses.dto'
import { PaginatedInventoryLotResponseZodDto } from '@/inventory-lots/dto/inventory-lot-responses.dto'

@ApiTags('Inventory Lots')
@ApiBearerAuth()
@Controller({ path: 'inventory-lots', version: '1' })
export class InventoryLotsController {
  constructor(private readonly inventoryLotsService: InventoryLotsService) {}

  @ApiOperation(openapi.inventoryLotsCreateOperation)
  @ApiBody(openapi.inventoryLotsCreateBody)
  @ZodResponse({ type: WrappedInventoryLotResponseZodDto, status: 201 })
  @Post()
  async create(@Body() dto: CreateInventoryLotDto) {
    return { data: await this.inventoryLotsService.create(dto) }
  }

  @ApiOperation(openapi.inventoryLotsListOperation)
  @ZodResponse({ type: PaginatedInventoryLotResponseZodDto, status: 200 })
  @Get()
  list(@Query() query: ListInventoryLotsQueryDto) {
    return this.inventoryLotsService.list(query)
  }

  @ApiOperation(openapi.inventoryLotsFindOneOperation)
  @ApiParam(openapi.inventoryLotIdParam)
  @ZodResponse({ type: WrappedInventoryLotResponseZodDto, status: 200 })
  @Get(':id')
  async findOne(@Param() params: IdParamDto) {
    return { data: await this.inventoryLotsService.findOne(params.id) }
  }
}
