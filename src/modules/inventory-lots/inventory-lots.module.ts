import { Module } from '@nestjs/common'
import { InventoryLotsService } from '@/inventory-lots/inventory-lots.service'
import { InventoryLotsController } from '@/inventory-lots/inventory-lots.controller'

@Module({
  controllers: [InventoryLotsController],
  providers: [InventoryLotsService],
  exports: [InventoryLotsService],
})
export class InventoryLotsModule {}
