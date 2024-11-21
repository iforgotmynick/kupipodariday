import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from './entities/wish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  private readonly logger = new Logger('WishesService');

  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async createWish(owner: User, wish: CreateWishDto): Promise<Wish> {
    const newWish = this.wishRepository.create({ ...wish, owner });

    return this.wishRepository.save(newWish);
  }

  async findLast(): Promise<Wish[]> {
    const wish = await this.wishRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });

    return wish;
  }

  async findTop(): Promise<Wish[]> {
    const wish = await this.wishRepository.find({
      order: {
        copied: 'DESC',
      },
      take: 20,
    });

    return wish;
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });

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

    // in wishes.controller.ts:47 I use @UseGuards(IsOwnerGuard), so not-owner cannot
    // get to this point
    const updatedWish = this.wishRepository.merge(wish, updateWishDto);

    return this.wishRepository.save(updatedWish);
  }

  async remove(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({ where: { id } });

    if (!wish) {
      throw new NotFoundException(`Wish with ID ${id} not found`);
    }

    // in wishes.controller.ts:52 I use @UseGuards(IsOwnerGuard), so not-owner cannot
    // get to this point
    return this.wishRepository.remove(wish);
  }

  async copy(owner: User, id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!wish) {
      throw new NotFoundException(`Wish with ID ${id} not found`);
    }

    const existingCopy = await this.wishRepository.findOne({
      where: {
        owner: { id: owner.id },
        name: wish.name,
        link: wish.link,
        image: wish.image,
      },
    });

    if (existingCopy) {
      throw new ConflictException(
        `Wish "${wish.name}" has already been copied by this user`,
      );
    }

    const newWish = this.wishRepository.create({ ...wish, owner });

    this.update(wish.id, { ...wish, copied: wish.copied + 1 });

    return this.wishRepository.save(newWish);
  }

  async findByIds(ids: number[]) {
    return this.wishRepository.findBy({ id: In(ids) });
  }

  async findWishWithOffers(id: number) {
    return this.wishRepository.findOne({
      where: { id },
      relations: ['offers'],
    });
  }
}
