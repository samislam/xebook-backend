import { JwtUser } from '@/auth/types/jwt-user.type'
import { IdParamDto } from '@/common/dtos/id-param.dto'
import * as openapi from '@/transactions/transactions.openapi'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { TransactionsService } from '@/transactions/transactions.service'
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { CreateTransactionDto } from '@/transactions/dto/create-transaction.dto'
import { ListTransactionsQueryDto } from '@/transactions/dto/list-transactions-query.dto'

@ApiTags('Transactions')
@Controller({ path: 'transactions', version: '1' })
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation(openapi.createTransactionOperation)
  @ApiBody(openapi.createTransactionBody)
  @Post()
  async create(@Body() dto: CreateTransactionDto, @CurrentUser() user: JwtUser) {
    return { data: await this.transactionsService.create(dto, user.sub) }
  }

  @ApiOperation(openapi.listTransactionsOperation)
  @Get()
  list(@Query() query: ListTransactionsQueryDto) {
    return this.transactionsService.list(query)
  }

  @ApiOperation(openapi.findTransactionOperation)
  @ApiParam(openapi.transactionIdParam)
  @Get(':id')
  async findOne(@Param() params: IdParamDto) {
    return { data: await this.transactionsService.findOne(params.id) }
  }
}
