import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { IdParamDto } from '@/common/dto/id-param.dto'
import { CounterpartiesService } from '@/counterparties/counterparties.service'
import { CreateCounterpartyDto } from '@/counterparties/dto/create-counterparty.dto'
import { ListCounterpartiesQueryDto } from '@/counterparties/dto/list-counterparties-query.dto'
import { UpdateCounterpartyDto } from '@/counterparties/dto/update-counterparty.dto'

@Controller({ path: 'counterparties', version: '1' })
export class CounterpartiesController {
  constructor(private readonly counterpartiesService: CounterpartiesService) {}

  @Post()
  create(@Body() dto: CreateCounterpartyDto) {
    return this.counterpartiesService.create(dto)
  }

  @Get()
  list(@Query() query: ListCounterpartiesQueryDto) {
    return this.counterpartiesService.list(query)
  }

  @Get(':id')
  findOne(@Param() params: IdParamDto) {
    return this.counterpartiesService.findOne(params.id)
  }

  @Patch(':id')
  update(@Param() params: IdParamDto, @Body() dto: UpdateCounterpartyDto) {
    return this.counterpartiesService.update(params.id, dto)
  }
}
