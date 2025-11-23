import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './orders.entity';
import { OrderItem } from './order-item.entity';
import { UsersService } from '../users/users.service';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    private readonly usersService: UsersService,
    private readonly cartService: CartService,
  ) {}

 async checkout(userId: string, address: string) {
  const user = await this.usersService.findById(userId);
  const cartItems = await this.cartService.getCart(userId);

  if (cartItems.length === 0) {
    throw new BadRequestException('Cart is empty');
  }

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  const order = this.orderRepo.create({
    user: user!,
    total,
    address,
    status: 'pending',  // COD default
  });

  await this.orderRepo.save(order);

  for (const item of cartItems) {
    const orderItem = this.orderItemRepo.create({
      order,
      product: item.product,
      price: item.product.price,
      quantity: item.quantity,
    });

    await this.orderItemRepo.save(orderItem);
  }

  await this.cartService.clearCart(userId);

  return order;
}



  async getMyOrders(userId: string) {
  return this.orderRepo.find({
    where: { user: { id: userId } },
    relations: ['items', 'items.product'],
    order: { createdAt: 'DESC' },
  });
}

}
