import { IdParamDto } from '@/common/dtos/id-param.dto'
import { InstitutionsService } from '@/institutions/institutions.service'
import { CreateInstitutionDto } from '@/institutions/dto/create-institution.dto'
import { UpdateInstitutionDto } from '@/institutions/dto/update-institution.dto'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ListInstitutionsQueryDto } from '@/institutions/dto/list-institutions-query.dto'

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

  @Delete(':id')
  remove(@Param() params: IdParamDto) {
    return this.institutionsService.remove(params.id)
  }
}
