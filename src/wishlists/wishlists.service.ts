import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishlistsService {
  private readonly logger = new Logger('WishesService');

  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(
    owner: User,
    createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    const wishes = await this.wishesService.findByIds(createWishlistDto.items);

    const wishlist = this.wishlistRepository.create({
      ...createWishlistDto,
      items: wishes,
      owner,
    });

    return this.wishlistRepository.save(wishlist);
  }

  async findAll(): Promise<Wishlist[]> {
    return this.wishlistRepository.find();
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['items', 'owner'],
    });

    if (!wishlist) {
      throw new NotFoundException(`Wishlist with ID ${id} not found`);
    }

    return wishlist;
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({ where: { id } });

    if (!wishlist) {
      throw new NotFoundException(`Wishlist with ID ${id} not found`);
    }

    let items: Wish[] = [];
    if (updateWishlistDto.items) {
      items = await this.wishesService.findByIds(updateWishlistDto.items);
    }

    const updatedWishlist = this.wishlistRepository.merge(wishlist, {
      ...updateWishlistDto,
      items,
    });

    // in wishlists.controller.ts:47 I use @UseGuards(IsOwnerGuard), so not-owner cannot
    // get to this point
    return this.wishlistRepository.save(updatedWishlist);
  }

  async remove(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({ where: { id } });

    if (!wishlist) {
      throw new NotFoundException(`Wishlist with ID ${id} not found`);
    }

    // in wishlists.controller.ts:54 I use @UseGuards(IsOwnerGuard), so not-owner cannot
    // get to this point
    return this.wishlistRepository.remove(wishlist);
  }
}
