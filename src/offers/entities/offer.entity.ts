import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';

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

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.id)
  item: Wish;
}
