import { Controller, Get, Post, Body, Patch, Param, Delete,Request, UseGuards } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('')
@UseGuards(JwtGuard)
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get('users/me/wishes')
  myWishes(@Request() req) {
    return this.wishesService.findById(req.user.id);
  }

  @Get('wishes/last')
  myLastWish(@Request() req) {
    return this.wishesService.findByIdLast(req.user.id);
  }

  @Get('wishes/top')
  myFirstWish(@Request() req) {
    return this.wishesService.findByIdTop(req.user.id);
  }

  @Get(':id/wishes')
  findOne(@Param('id') id: string) {
    return this.wishesService.findById(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
  //   return this.wishesService.update(+id, updateWishDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.wishesService.remove(+id);
  // }
}
