import { Offer } from './src/offers/entities/offer.entity';
import { User } from './src/users/entities/user.entity';
import { Wish } from './src/wishes/entities/wish.entity';
import { Wishlist } from './src/wishlists/entities/wishlist.entity';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'student',
  password: 'student',
  database: 'nest_project',
  entities: [User, Wish, Offer, Wishlist],
  migrations: ['./src/database/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
