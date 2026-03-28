import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { JwtUser } from '@/auth/types/jwt-user.type'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { IdParamDto } from '@/common/dto/id-param.dto'
import { CreateTransactionDto } from '@/transactions/dto/create-transaction.dto'
import { ListTransactionsQueryDto } from '@/transactions/dto/list-transactions-query.dto'
import { TransactionsService } from '@/transactions/transactions.service'

@Controller({ path: 'transactions', version: '1' })
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() dto: CreateTransactionDto, @CurrentUser() user: JwtUser) {
    return this.transactionsService.create(dto, user.sub)
  }

  @Get()
  list(@Query() query: ListTransactionsQueryDto) {
    return this.transactionsService.list(query)
  }

  @Get(':id')
  findOne(@Param() params: IdParamDto) {
    return this.transactionsService.findOne(params.id)
  }
}
