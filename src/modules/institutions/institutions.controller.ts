import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { IdParamDto } from '@/common/dto/id-param.dto'
import { CreateInstitutionDto } from '@/institutions/dto/create-institution.dto'
import { ListInstitutionsQueryDto } from '@/institutions/dto/list-institutions-query.dto'
import { UpdateInstitutionDto } from '@/institutions/dto/update-institution.dto'
import { InstitutionsService } from '@/institutions/institutions.service'

@Controller({ path: 'institutions', version: '1' })
export class InstitutionsController {
  constructor(private readonly institutionsService: InstitutionsService) {}

  @Post()
  create(@Body() dto: CreateInstitutionDto) {
    return this.institutionsService.create(dto)
  }

  @Get()
  list(@Query() query: ListInstitutionsQueryDto) {
    return this.institutionsService.list(query)
  }

  @Get(':id')
  findOne(@Param() params: IdParamDto) {
    return this.institutionsService.findOne(params.id)
  }

  @Patch(':id')
  update(@Param() params: IdParamDto, @Body() dto: UpdateInstitutionDto) {
    return this.institutionsService.update(params.id, dto)
  }
}
