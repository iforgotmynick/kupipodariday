import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Wish } from './entities/wish.entity';
import { UpdateWishDto } from './dto/update-wish.dto';
import { IsOwnerGuard } from '../guards/is-owner.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@Request() req, @Body() wish: CreateWishDto): Promise<Wish> {
    return this.wishesService.createWish(req.user, wish);
  }

  @Get('last')
  findLast(): Promise<Wish[]> {
    return this.wishesService.findLast();
  }

  @Get('top')
  findTop(): Promise<Wish[]> {
    return this.wishesService.findTop();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  findOne(@Param() { id }: { id: string }): Promise<Wish> {
    return this.wishesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @UseGuards(IsOwnerGuard)
  update(@Request() req, @Body() updateWishDto: UpdateWishDto): Promise<Wish> {
    return this.wishesService.update(req.user.id, updateWishDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @UseGuards(IsOwnerGuard)
  removeOne(@Param() id: number): Promise<Wish> {
    return this.wishesService.remove(id);
  }

  @Post(':id/copy')
  @UseGuards(JwtGuard)
  wishCopy(@Request() req, @Param() { id }: { id: string }): Promise<Wish> {
    return this.wishesService.copy(req.user, +id);
  }
}
