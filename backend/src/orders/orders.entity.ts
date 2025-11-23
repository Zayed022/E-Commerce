import { Entity, Column, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { User } from '../users/users.entity';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders, { eager: true })
  user: User;

  @Column({ type: 'float', nullable: true, default: 0 })
total: number;


  @Column({ default: 'pending' })
  status: string; // pending | confirmed | shipped | delivered

 @Column({ nullable: true })
address: string;


  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;
}
