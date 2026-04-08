import { ZodResponse } from 'nestjs-zod'
import { IdParamDto } from '@/common/dtos/id-param.dto'
import * as openapi from '@/institutions/institutions.openapi'
import { InstitutionsService } from '@/institutions/institutions.service'
import { CreateInstitutionDto } from '@/institutions/dto/create-institution.dto'
import { UpdateInstitutionDto } from '@/institutions/dto/update-institution.dto'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ListInstitutionsQueryDto } from '@/institutions/dto/list-institutions-query.dto'
import { WrappedInstitutionResponseZodDto } from '@/institutions/dto/institution-responses.dto'
import { PaginatedInstitutionResponseZodDto } from '@/institutions/dto/institution-responses.dto'

@ApiTags('Institutions')
@ApiBearerAuth()
@Controller({ path: 'institutions', version: '1' })
export class InstitutionsController {
  constructor(private readonly institutionsService: InstitutionsService) {}

  @ApiOperation(openapi.institutionsCreateOperation)
  @ApiBody(openapi.institutionsCreateBody)
  @ZodResponse({ type: WrappedInstitutionResponseZodDto, status: 201 })
  @Post()
  async create(@Body() dto: CreateInstitutionDto) {
    return { data: await this.institutionsService.create(dto) }
  }

  @ApiOperation(openapi.institutionsListOperation)
  @ZodResponse({ type: PaginatedInstitutionResponseZodDto, status: 200 })
  @Get()
  list(@Query() query: ListInstitutionsQueryDto) {
    return this.institutionsService.list(query)
  }

  @ApiOperation(openapi.institutionsFindOneOperation)
  @ApiParam(openapi.institutionIdParam)
  @ZodResponse({ type: WrappedInstitutionResponseZodDto, status: 200 })
  @Get(':id')
  async findOne(@Param() params: IdParamDto) {
    return { data: await this.institutionsService.findOne(params.id) }
  }

  @ApiOperation(openapi.institutionsUpdateOperation)
  @ApiParam(openapi.institutionIdParam)
  @ApiBody(openapi.institutionsUpdateBody)
  @ZodResponse({ type: WrappedInstitutionResponseZodDto, status: 200 })
  @Patch(':id')
  async update(@Param() params: IdParamDto, @Body() dto: UpdateInstitutionDto) {
    return { data: await this.institutionsService.update(params.id, dto) }
  }

  @ApiOperation(openapi.institutionsRemoveOperation)
  @ApiParam(openapi.institutionIdParam)
  @ZodResponse({ type: WrappedInstitutionResponseZodDto, status: 200 })
  @Delete(':id')
  async remove(@Param() params: IdParamDto) {
    return { data: await this.institutionsService.remove(params.id) }
  }
}
