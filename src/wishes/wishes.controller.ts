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

@Controller('wishes')
@UseGuards(JwtGuard)
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
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
  findOne(@Param() { id }: { id: string }): Promise<Wish> {
    return this.wishesService.findOne(+id);
  }

  @Patch(':id')
  update(@Request() req, @Body() updateWishDto: UpdateWishDto): Promise<Wish> {
    return this.wishesService.update(req.user.id, updateWishDto);
  }

  @Delete(':id')
  removeOne(@Param() id: number): Promise<Wish> {
    return this.wishesService.remove(id);
  }

  @Post(':id/copy')
  wishCopy(@Request() req, @Param() { id }: { id: string }): Promise<Wish> {
    return this.wishesService.copy(req.user, +id);
  }
}
