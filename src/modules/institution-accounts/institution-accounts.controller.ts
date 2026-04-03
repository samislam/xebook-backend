import { IdParamDto } from '@/common/dtos/id-param.dto'
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { InstitutionAccountsService } from '@/institution-accounts/institution-accounts.service'
import { CreateInstitutionAccountDto } from '@/institution-accounts/dto/create-institution-account.dto'
import { UpdateInstitutionAccountDto } from '@/institution-accounts/dto/update-institution-account.dto'
import { ListInstitutionAccountsQueryDto } from '@/institution-accounts/dto/list-institution-accounts-query.dto'

@Controller({ path: 'institution-accounts', version: '1' })
export class InstitutionAccountsController {
  constructor(private readonly institutionAccountsService: InstitutionAccountsService) {}

  @Post()
  async create(@Body() dto: CreateInstitutionAccountDto) {
    return { data: await this.institutionAccountsService.create(dto) }
  }

  @Get()
  list(@Query() query: ListInstitutionAccountsQueryDto) {
    return this.institutionAccountsService.list(query)
  }

  @Get(':id')
  async findOne(@Param() params: IdParamDto) {
    return { data: await this.institutionAccountsService.findOne(params.id) }
  }

  @Patch(':id')
  async update(@Param() params: IdParamDto, @Body() dto: UpdateInstitutionAccountDto) {
    return { data: await this.institutionAccountsService.update(params.id, dto) }
  }
}
