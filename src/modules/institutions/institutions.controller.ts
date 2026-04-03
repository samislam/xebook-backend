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
  async create(@Body() dto: CreateInstitutionDto) {
    return { data: await this.institutionsService.create(dto) }
  }

  @Get()
  list(@Query() query: ListInstitutionsQueryDto) {
    return this.institutionsService.list(query)
  }

  @Get(':id')
  async findOne(@Param() params: IdParamDto) {
    return { data: await this.institutionsService.findOne(params.id) }
  }

  @Patch(':id')
  async update(@Param() params: IdParamDto, @Body() dto: UpdateInstitutionDto) {
    return { data: await this.institutionsService.update(params.id, dto) }
  }

  @Delete(':id')
  async remove(@Param() params: IdParamDto) {
    return { data: await this.institutionsService.remove(params.id) }
  }
}
