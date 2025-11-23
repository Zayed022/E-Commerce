import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './orders.entity';
import { OrderItem } from './order-item.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { UsersModule } from '../users/users.module';
import { CartModule } from '../cart/cart.module';   // <── Add this

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    UsersModule,
    CartModule,   // <── Add here
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
