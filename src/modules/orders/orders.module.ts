import { Module } from '@nestjs/common'
import { OrderSettlementsController } from '@/order-settlements/order-settlements.controller'
import { OrderSettlementsService } from '@/order-settlements/order-settlements.service'
import { OrdersController } from '@/orders/orders.controller'
import { OrdersService } from '@/orders/orders.service'

@Module({
  controllers: [OrdersController, OrderSettlementsController],
  providers: [OrdersService, OrderSettlementsService],
  exports: [OrdersService, OrderSettlementsService],
})
export class OrdersModule {}
