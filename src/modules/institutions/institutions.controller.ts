import { IdParamDto } from '@/common/dtos/id-param.dto'
import * as openapi from '@/institutions/institutions.openapi'
import { InstitutionsService } from '@/institutions/institutions.service'
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { CreateInstitutionDto } from '@/institutions/dto/create-institution.dto'
import { UpdateInstitutionDto } from '@/institutions/dto/update-institution.dto'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ListInstitutionsQueryDto } from '@/institutions/dto/list-institutions-query.dto'

@ApiTags('Institutions')
@Controller({ path: 'institutions', version: '1' })
export class InstitutionsController {
  constructor(private readonly institutionsService: InstitutionsService) {}

  @ApiOperation(openapi.institutionsCreateOperation)
  @ApiBody(openapi.institutionsCreateBody)
  @Post()
  async create(@Body() dto: CreateInstitutionDto) {
    return { data: await this.institutionsService.create(dto) }
  }

  @ApiOperation(openapi.institutionsListOperation)
  @Get()
  list(@Query() query: ListInstitutionsQueryDto) {
    return this.institutionsService.list(query)
  }

  @ApiOperation(openapi.institutionsFindOneOperation)
  @ApiParam(openapi.institutionIdParam)
  @Get(':id')
  async findOne(@Param() params: IdParamDto) {
    return { data: await this.institutionsService.findOne(params.id) }
  }

  @ApiOperation(openapi.institutionsUpdateOperation)
  @ApiParam(openapi.institutionIdParam)
  @ApiBody(openapi.institutionsUpdateBody)
  @Patch(':id')
  async update(@Param() params: IdParamDto, @Body() dto: UpdateInstitutionDto) {
    return { data: await this.institutionsService.update(params.id, dto) }
  }

  @ApiOperation(openapi.institutionsRemoveOperation)
  @ApiParam(openapi.institutionIdParam)
  @Delete(':id')
  async remove(@Param() params: IdParamDto) {
    return { data: await this.institutionsService.remove(params.id) }
  }
}
