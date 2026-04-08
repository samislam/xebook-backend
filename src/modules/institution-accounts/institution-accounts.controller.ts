import { ZodResponse } from 'nestjs-zod'
import { IdParamDto } from '@/common/dtos/id-param.dto'
import * as openapi from '@/institution-accounts/institution-accounts.openapi'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { InstitutionAccountsService } from '@/institution-accounts/institution-accounts.service'
import { CreateInstitutionAccountDto } from '@/institution-accounts/dto/create-institution-account.dto'
import { UpdateInstitutionAccountDto } from '@/institution-accounts/dto/update-institution-account.dto'
import { ListInstitutionAccountsQueryDto } from '@/institution-accounts/dto/list-institution-accounts-query.dto'
import { WrappedInstitutionAccountResponseZodDto } from '@/institution-accounts/dto/institution-account-responses.dto'
import { PaginatedInstitutionAccountResponseZodDto } from '@/institution-accounts/dto/institution-account-responses.dto'

@ApiTags('Institution Accounts')
@ApiBearerAuth()
@Controller({ path: 'institution-accounts', version: '1' })
export class InstitutionAccountsController {
  constructor(private readonly institutionAccountsService: InstitutionAccountsService) {}

  @ApiOperation(openapi.institutionAccountsCreateOperation)
  @ApiBody(openapi.institutionAccountsCreateBody)
  @ZodResponse({ type: WrappedInstitutionAccountResponseZodDto, status: 201 })
  @Post()
  async create(@Body() dto: CreateInstitutionAccountDto) {
    return { data: await this.institutionAccountsService.create(dto) }
  }

  @ApiOperation(openapi.institutionAccountsListOperation)
  @ZodResponse({ type: PaginatedInstitutionAccountResponseZodDto, status: 200 })
  @Get()
  list(@Query() query: ListInstitutionAccountsQueryDto) {
    return this.institutionAccountsService.list(query)
  }

  @ApiOperation(openapi.institutionAccountsFindOneOperation)
  @ApiParam(openapi.institutionAccountIdParam)
  @ZodResponse({ type: WrappedInstitutionAccountResponseZodDto, status: 200 })
  @Get(':id')
  async findOne(@Param() params: IdParamDto) {
    return { data: await this.institutionAccountsService.findOne(params.id) }
  }

  @ApiOperation(openapi.institutionAccountsUpdateOperation)
  @ApiParam(openapi.institutionAccountIdParam)
  @ApiBody(openapi.institutionAccountsUpdateBody)
  @ZodResponse({ type: WrappedInstitutionAccountResponseZodDto, status: 200 })
  @Patch(':id')
  async update(@Param() params: IdParamDto, @Body() dto: UpdateInstitutionAccountDto) {
    return { data: await this.institutionAccountsService.update(params.id, dto) }
  }

  @ApiOperation(openapi.institutionAccountsRemoveOperation)
  @ApiParam(openapi.institutionAccountIdParam)
  @ZodResponse({ type: WrappedInstitutionAccountResponseZodDto, status: 200 })
  @Delete(':id')
  async remove(@Param() params: IdParamDto) {
    return { data: await this.institutionAccountsService.remove(params.id) }
  }
}
