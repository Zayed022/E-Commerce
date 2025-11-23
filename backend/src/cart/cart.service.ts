import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,
    private productsService: ProductsService,
    private usersService: UsersService,
  ) {}

  async addItem(userId: string, productId: string, quantity: number) {
  const user = await this.usersService.findById(userId);
  if (!user) {
    throw new NotFoundException('User not found');
  }

  const product = await this.productsService.findOne(productId);
  if (!product) {
    throw new NotFoundException('Product not found');
  }

  let cartItem = await this.cartRepo.findOne({
    where: { user: { id: user.id }, product: { id: product.id } },
  });

  if (cartItem) {
    cartItem.quantity += quantity;
  } else {
    cartItem = this.cartRepo.create({
      user,
      product,
      quantity,
    });
  }

  return this.cartRepo.save(cartItem);
}



  async getCart(userId: string) {
  const user = await this.usersService.findById(userId);
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return this.cartRepo.find({ where: { user: { id: user.id } } });
}


  async updateQuantity(id: string, quantity: number) {
    const item = await this.cartRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Item not found');

    item.quantity = quantity;
    return this.cartRepo.save(item);
  }

  async removeItem(id: string) {
    await this.cartRepo.delete(id);
    return { message: 'Item removed' };
  }

  async clearCart(userId: string) {
  const user = await this.usersService.findById(userId);
  if (!user) {
    throw new NotFoundException('User not found');
  }

  await this.cartRepo.delete({ user: { id: user.id } });
  return { message: 'Cart cleared' };
}

}
