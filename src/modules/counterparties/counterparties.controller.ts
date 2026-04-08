import { ZodResponse } from 'nestjs-zod'
import { IdParamDto } from '@/common/dtos/id-param.dto'
import * as openapi from '@/counterparties/counterparties.openapi'
import { CounterpartiesService } from '@/counterparties/counterparties.service'
import { CreateCounterpartyDto } from '@/counterparties/dto/create-counterparty.dto'
import { UpdateCounterpartyDto } from '@/counterparties/dto/update-counterparty.dto'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ListCounterpartiesQueryDto } from '@/counterparties/dto/list-counterparties-query.dto'
import { WrappedCounterpartyResponseZodDto } from '@/counterparties/dto/counterparty-responses.dto'
import { PaginatedCounterpartyResponseZodDto } from '@/counterparties/dto/counterparty-responses.dto'

@ApiTags('Counterparties')
@ApiBearerAuth()
@Controller({ path: 'counterparties', version: '1' })
export class CounterpartiesController {
  constructor(private readonly counterpartiesService: CounterpartiesService) {}

  @ApiOperation(openapi.counterpartiesCreateOperation)
  @ApiBody(openapi.counterpartiesCreateBody)
  @ZodResponse({ type: WrappedCounterpartyResponseZodDto, status: 201 })
  @Post()
  async create(@Body() dto: CreateCounterpartyDto) {
    return { data: await this.counterpartiesService.create(dto) }
  }

  @ApiOperation(openapi.counterpartiesListOperation)
  @ZodResponse({ type: PaginatedCounterpartyResponseZodDto, status: 200 })
  @Get()
  list(@Query() query: ListCounterpartiesQueryDto) {
    return this.counterpartiesService.list(query)
  }

  @ApiOperation(openapi.counterpartiesFindOneOperation)
  @ApiParam(openapi.counterpartyIdParam)
  @ZodResponse({ type: WrappedCounterpartyResponseZodDto, status: 200 })
  @Get(':id')
  async findOne(@Param() params: IdParamDto) {
    return { data: await this.counterpartiesService.findOne(params.id) }
  }

  @ApiOperation(openapi.counterpartiesUpdateOperation)
  @ApiParam(openapi.counterpartyIdParam)
  @ApiBody(openapi.counterpartiesUpdateBody)
  @ZodResponse({ type: WrappedCounterpartyResponseZodDto, status: 200 })
  @Patch(':id')
  async update(@Param() params: IdParamDto, @Body() dto: UpdateCounterpartyDto) {
    return { data: await this.counterpartiesService.update(params.id, dto) }
  }

  @ApiOperation(openapi.counterpartiesRemoveOperation)
  @ApiParam(openapi.counterpartyIdParam)
  @ZodResponse({ type: WrappedCounterpartyResponseZodDto, status: 200 })
  @Delete(':id')
  async remove(@Param() params: IdParamDto) {
    return { data: await this.counterpartiesService.remove(params.id) }
  }
}
