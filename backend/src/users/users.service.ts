import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  async create(data: { email: string }) {
    const user = this.usersRepo.create(data);
    return this.usersRepo.save(user);
  }

  async findById(id: string) {
    return this.usersRepo.findOne({ where: { id } });
  }
}
