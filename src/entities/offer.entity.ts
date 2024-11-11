import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
} from 'typeorm';
import { Wish } from './wish.entity';
import { User } from './user.entity';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @Column()
  amount: number;

  @Column()
  hidden: boolean = false;

  @OneToOne(() => User, (user) => user.id)
  user: User;

  @OneToOne(() => Wish, (wish) => wish.id)
  item: Wish;
}
