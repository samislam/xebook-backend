import { ZodResponse } from 'nestjs-zod'
import { JwtUser } from '@/auth/types/jwt-user.type'
import { IdParamDto } from '@/common/dtos/id-param.dto'
import * as openapi from '@/transactions/transactions.openapi'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { TransactionsService } from '@/transactions/transactions.service'
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { CreateTransactionDto } from '@/transactions/dto/create-transaction.dto'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { ListTransactionsQueryDto } from '@/transactions/dto/list-transactions-query.dto'
import { WrappedTransactionResponseZodDto } from '@/transactions/dto/transaction-responses.dto'
import { PaginatedTransactionResponseZodDto } from '@/transactions/dto/transaction-responses.dto'

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller({ path: 'transactions', version: '1' })
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation(openapi.createTransactionOperation)
  @ApiBody(openapi.createTransactionBody)
  @ZodResponse({ type: WrappedTransactionResponseZodDto, status: 201 })
  @Post()
  async create(@Body() dto: CreateTransactionDto, @CurrentUser() user: JwtUser) {
    return { data: await this.transactionsService.create(dto, user.sub) }
  }

  @ApiOperation(openapi.listTransactionsOperation)
  @ZodResponse({ type: PaginatedTransactionResponseZodDto, status: 200 })
  @Get()
  list(@Query() query: ListTransactionsQueryDto) {
    return this.transactionsService.list(query)
  }

  @ApiOperation(openapi.findTransactionOperation)
  @ApiParam(openapi.transactionIdParam)
  @ZodResponse({ type: WrappedTransactionResponseZodDto, status: 200 })
  @Get(':id')
  async findOne(@Param() params: IdParamDto) {
    return { data: await this.transactionsService.findOne(params.id) }
  }
}
