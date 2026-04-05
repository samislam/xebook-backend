import { CreateRateSnapshotDto } from '@/rate-snapshots/dto/create-rate-snapshot.dto'
import { ApiBodyOptions, ApiOperationOptions, ApiParamOptions } from '@nestjs/swagger'

export const rateSnapshotsCreateOperation: ApiOperationOptions = {
  summary: 'Create rate snapshot',
  description:
    'Store a reference FX or market rate that can later be used for approximate breakeven and profit calculations.',
}
export const rateSnapshotsCreateBody: ApiBodyOptions = { type: CreateRateSnapshotDto }
export const rateSnapshotsListOperation: ApiOperationOptions = {
  summary: 'List rate snapshots',
  description: 'List stored rate snapshots with pagination and filters.',
}
export const rateSnapshotsFindOneOperation: ApiOperationOptions = {
  summary: 'Get rate snapshot by ID',
  description: 'Fetch one rate snapshot by id.',
}
export const rateSnapshotIdParam: ApiParamOptions = {
  name: 'id',
  description: 'Rate snapshot id',
}
