import { Controller, Post, Get, UseGuards, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
 @Post('checkout')
@UseGuards(JwtAuthGuard)
checkout(@CurrentUser() user: any, @Body('address') address: string) {
  return this.ordersService.checkout(user.id, address);
}


  @UseGuards(JwtAuthGuard)
  @Get('my')
  getMyOrders(@CurrentUser() user) {
    return this.ordersService.getMyOrders(user.id);
  }
}
