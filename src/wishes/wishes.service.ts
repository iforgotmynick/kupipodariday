import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from './entities/wish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  private readonly logger = new Logger('WishesService');

  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async createWish(wish: CreateWishDto): Promise<Wish> {
    const newWish = this.wishRepository.create(wish);

    return this.wishRepository.save(newWish);
  }

  async findLast(): Promise<Wish[]> {
    const wish = await this.wishRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 1,
    });

    return wish;
  }

  async findTop(): Promise<Wish[]> {
    const wish = await this.wishRepository.find({
      order: {
        copied: 'DESC',
      },
      take: 1,
    });

    return wish;
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOneBy({ id });

    if (!wish) {
      throw new NotFoundException(`Wish with ID ${id} not found`);
    }

    return wish;
  }

  async update(id: number, updateWishDto: UpdateWishDto): Promise<Wish> {
    const wish = await this.wishRepository.findOne({ where: { id } });

    if (!wish) {
      throw new NotFoundException(`Wish with ID ${id} not found`);
    }

    const updatedWish = this.wishRepository.merge(wish, updateWishDto);

    return this.wishRepository.save(updatedWish);
  }
  async remove(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({ where: { id } });

    if (!wish) {
      throw new NotFoundException(`Wish with ID ${id} not found`);
    }

    return this.wishRepository.remove(wish);
  }

  async copy(id: number): Promise<Wish> {
    throw new NotFoundException(`COPY ID ${id} PLEASE`);
  }
}
