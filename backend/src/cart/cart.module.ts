import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cart]), ProductsModule, UsersModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],   // <-- IMPORTANT
})
export class CartModule {}
