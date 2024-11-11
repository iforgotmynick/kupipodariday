import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffersModule } from './offers/offers.module';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { HashingModule } from './services/hashing/hashing.module';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';
import { Offer } from './entities/offer.entity';
import { Wish } from './entities/wish.entity';
import { Wishlist } from './entities/wishlist.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'student',
      password: 'student',
      database: 'nest_project',
      entities: [User, Wish, Offer, Wishlist],
      synchronize: true,
    }),
    OffersModule,
    WishesModule,
    WishlistsModule,
    UsersModule,
    HashingModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
