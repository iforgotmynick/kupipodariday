import { Injectable, Logger } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WishesService {
  private readonly logger = new Logger('WishesService');

  readonly wishList: Wish[] = [
    {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: '1',
      link: '1',
      image: '1',
      price: 0,
      raised: 0,
      description: '1',
      offers: {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        username: '1',
        about: '1',
        avatar: '1',
        email: '1',
        password: '1',
        wishes: [],
        offers: [],
        wishlists: [],
      },
      copied: 0,
    },
    {
      id: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: '2',
      link: '2',
      image: '2',
      price: 0,
      raised: 0,
      description: '2',
      offers: {
        id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        username: '2',
        about: '2',
        avatar: '2',
        email: '2',
        password: '2',
        wishes: [],
        offers: [],
        wishlists: [],
      },
      copied: 0,
    },
  ];

  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async findByUsername(username: string): Promise<Wish[]> {
    return this.wishList;
  }

  async findByIdLast(id: number): Promise<Wish[]> {
    const wishes = await this.wishRepository.findBy({ id });

    return [this.wishList[0]];
  }

  async findByIdTop(id: number): Promise<Wish[]> {
    const wishes = await this.wishRepository.findBy({ id });

    return [this.wishList[1]];
  }
}
