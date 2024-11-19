import { Length } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  link: string;

  @Column()
  image: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  raised: number;

  @Column()
  @Length(1, 1024)
  description: string;

  @ManyToOne(() => User, (user) => user.wishes, {
    onDelete: 'CASCADE',
  })
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.id, {
    cascade: true,
  })
  offers: Offer[];

  @Column({ default: 0 })
  copied: number;
}
