import { IdParamDto } from '@/common/dtos/id-param.dto'
import { CounterpartiesService } from '@/counterparties/counterparties.service'
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { CreateCounterpartyDto } from '@/counterparties/dto/create-counterparty.dto'
import { UpdateCounterpartyDto } from '@/counterparties/dto/update-counterparty.dto'
import { ListCounterpartiesQueryDto } from '@/counterparties/dto/list-counterparties-query.dto'

@Controller({ path: 'counterparties', version: '1' })
export class CounterpartiesController {
  constructor(private readonly counterpartiesService: CounterpartiesService) {}

  @Post()
  async create(@Body() dto: CreateCounterpartyDto) {
    return { data: await this.counterpartiesService.create(dto) }
  }

  @Get()
  list(@Query() query: ListCounterpartiesQueryDto) {
    return this.counterpartiesService.list(query)
  }

  @Get(':id')
  async findOne(@Param() params: IdParamDto) {
    return { data: await this.counterpartiesService.findOne(params.id) }
  }

  @Patch(':id')
  async update(@Param() params: IdParamDto, @Body() dto: UpdateCounterpartyDto) {
    return { data: await this.counterpartiesService.update(params.id, dto) }
  }
}
