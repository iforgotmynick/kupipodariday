import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { Offer } from './entities/offer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { IsNotOwnerGuard } from 'src/guards/is-not-owner.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Offer]), UsersModule],
  controllers: [OffersController],
  providers: [OffersService, IsNotOwnerGuard],
})
export class OffersModule {}
