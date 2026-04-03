import { JwtUser } from '@/auth/types/jwt-user.type'
import { IdParamDto } from '@/common/dtos/id-param.dto'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { TransactionsService } from '@/transactions/transactions.service'
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { CreateTransactionDto } from '@/transactions/dto/create-transaction.dto'
import { ListTransactionsQueryDto } from '@/transactions/dto/list-transactions-query.dto'

@Controller({ path: 'transactions', version: '1' })
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(@Body() dto: CreateTransactionDto, @CurrentUser() user: JwtUser) {
    return { data: await this.transactionsService.create(dto, user.sub) }
  }

  @Get()
  list(@Query() query: ListTransactionsQueryDto) {
    return this.transactionsService.list(query)
  }

  @Get(':id')
  async findOne(@Param() params: IdParamDto) {
    return { data: await this.transactionsService.findOne(params.id) }
  }
}
