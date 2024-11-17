import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WishlistsService {
  private readonly logger = new Logger('WishesService');

  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) {}

  async create(createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
    const wishlist = this.wishlistRepository.create(createWishlistDto);

    return this.wishlistRepository.save(wishlist);
  }

  async findAll(): Promise<Wishlist[]> {
    return this.wishlistRepository.find();
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishlist = this.wishlistRepository.findOneBy({ id });

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

    const updatedWishlist = this.wishlistRepository.merge(
      wishlist,
      updateWishlistDto,
    );

    return this.wishlistRepository.save(updatedWishlist);
  }

  async remove(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({ where: { id } });

    if (!wishlist) {
      throw new NotFoundException(`Wishlist with ID ${id} not found`);
    }

    return this.wishlistRepository.remove(wishlist);
  }
}
