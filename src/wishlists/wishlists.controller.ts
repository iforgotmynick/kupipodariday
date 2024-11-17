import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Wishlist } from './entities/wishlist.entity';

@Controller('wishlists')
@UseGuards(JwtGuard)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll();
  }

  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
    return this.wishlistsService.create(createWishlistDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Wishlist> {
    return this.wishlistsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistsService.update(+id, updateWishlistDto);
  }

  @Delete(':id')
  removeOne(@Param('id') id: string): Promise<Wishlist> {
    return this.wishlistsService.remove(+id);
  }
}
