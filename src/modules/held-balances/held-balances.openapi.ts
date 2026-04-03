import { ApiOperationOptions } from '@nestjs/swagger'

export const heldBalancesListOperation: ApiOperationOptions = {
  summary: 'List held balances',
  description: 'List current held-balance snapshots between owner users and holder users.',
}
