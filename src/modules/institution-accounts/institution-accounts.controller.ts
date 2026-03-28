import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { IdParamDto } from '@/common/dto/id-param.dto'
import { CreateInstitutionAccountDto } from '@/institution-accounts/dto/create-institution-account.dto'
import { ListInstitutionAccountsQueryDto } from '@/institution-accounts/dto/list-institution-accounts-query.dto'
import { UpdateInstitutionAccountDto } from '@/institution-accounts/dto/update-institution-account.dto'
import { InstitutionAccountsService } from '@/institution-accounts/institution-accounts.service'

@Controller({ path: 'institution-accounts', version: '1' })
export class InstitutionAccountsController {
  constructor(private readonly institutionAccountsService: InstitutionAccountsService) {}

  @Post()
  create(@Body() dto: CreateInstitutionAccountDto) {
    return this.institutionAccountsService.create(dto)
  }

  @Get()
  list(@Query() query: ListInstitutionAccountsQueryDto) {
    return this.institutionAccountsService.list(query)
  }

  @Get(':id')
  findOne(@Param() params: IdParamDto) {
    return this.institutionAccountsService.findOne(params.id)
  }

  @Patch(':id')
  update(@Param() params: IdParamDto, @Body() dto: UpdateInstitutionAccountDto) {
    return this.institutionAccountsService.update(params.id, dto)
  }
}
