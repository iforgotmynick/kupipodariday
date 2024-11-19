import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HashingModule } from '../services/hashing/hashing.module';
import { IsOwnerGuard } from 'src/guards/is-owner.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HashingModule],
  controllers: [UsersController],
  providers: [UsersService, IsOwnerGuard],
  exports: [UsersService],
})
export class UsersModule {}
