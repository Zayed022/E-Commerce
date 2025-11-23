import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  findAll() {
    return this.productRepo.find();
  }

  findOne(id: string) {
    return this.productRepo.findOne({ where: { id } });
  }

  async seed() {
    const sampleProducts = [
      {
        title: 'Organic Milk',
        description: 'Fresh organic farm milk, 1 litre',
        imageUrl: 'https://picsum.photos/300/200?random=1',
        price: 59.0,
      },
      {
        title: 'Brown Bread',
        description: 'Whole wheat brown bread, 400g',
        imageUrl: 'https://picsum.photos/300/200?random=2',
        price: 45.0,
      },
      {
        title: 'Corn Flakes',
        description: 'Breakfast cereal flakes, 500g',
        imageUrl: 'https://picsum.photos/300/200?random=3',
        price: 215.0,
      },
    ];

    const newProducts = this.productRepo.create(sampleProducts);
    return this.productRepo.save(newProducts);
  }
}
