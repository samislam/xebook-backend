import { ApiOperationOptions } from '@nestjs/swagger'

export const debtBalancesListOperation: ApiOperationOptions = {
  summary: 'List debt balances',
  description: 'List current debt-balance snapshots between debtors and creditors.',
}
