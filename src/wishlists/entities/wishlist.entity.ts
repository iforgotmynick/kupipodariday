import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  name: string;

  @Column({ length: 1500 })
  description: string;

  @Column()
  image: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
