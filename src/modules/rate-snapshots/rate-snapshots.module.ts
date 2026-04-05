import { Module } from '@nestjs/common'
import { RateSnapshotsService } from '@/rate-snapshots/rate-snapshots.service'
import { RateSnapshotsController } from '@/rate-snapshots/rate-snapshots.controller'

@Module({
  controllers: [RateSnapshotsController],
  providers: [RateSnapshotsService],
  exports: [RateSnapshotsService],
})
export class RateSnapshotsModule {}
