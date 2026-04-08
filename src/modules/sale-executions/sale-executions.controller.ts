import { ZodResponse } from 'nestjs-zod'
import { IdParamDto } from '@/common/dtos/id-param.dto'
import * as openapi from '@/sale-executions/sale-executions.openapi'
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { SaleExecutionsService } from '@/sale-executions/sale-executions.service'
import { CreateSaleExecutionDto } from '@/sale-executions/dto/create-sale-execution.dto'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { ListSaleExecutionsQueryDto } from '@/sale-executions/dto/list-sale-executions-query.dto'
import { WrappedSaleExecutionResponseZodDto } from '@/sale-executions/dto/sale-execution-responses.dto'
import { PaginatedSaleExecutionResponseZodDto } from '@/sale-executions/dto/sale-execution-responses.dto'

@ApiTags('Sale Executions')
@ApiBearerAuth()
@Controller({ path: 'sale-executions', version: '1' })
export class SaleExecutionsController {
  constructor(private readonly saleExecutionsService: SaleExecutionsService) {}

  @ApiOperation(openapi.saleExecutionsCreateOperation)
  @ApiBody(openapi.saleExecutionsCreateBody)
  @ZodResponse({ type: WrappedSaleExecutionResponseZodDto, status: 201 })
  @Post()
  async create(@Body() dto: CreateSaleExecutionDto) {
    return { data: await this.saleExecutionsService.create(dto) }
  }

  @ApiOperation(openapi.saleExecutionsListOperation)
  @ZodResponse({ type: PaginatedSaleExecutionResponseZodDto, status: 200 })
  @Get()
  list(@Query() query: ListSaleExecutionsQueryDto) {
    return this.saleExecutionsService.list(query)
  }

  @ApiOperation(openapi.saleExecutionsFindOneOperation)
  @ApiParam(openapi.saleExecutionIdParam)
  @ZodResponse({ type: WrappedSaleExecutionResponseZodDto, status: 200 })
  @Get(':id')
  async findOne(@Param() params: IdParamDto) {
    return { data: await this.saleExecutionsService.findOne(params.id) }
  }
}
