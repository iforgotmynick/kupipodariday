import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class OffersService {
  private readonly logger = new Logger('UserService');
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto): Promise<Offer> {
    const { item, amount, ...offerData } = createOfferDto;
    const wish = await this.wishesService.findOne(item);
    const newRaisedAmount = Number(wish.raised) + amount;

    if (newRaisedAmount > wish.price) {
      throw new ConflictException(
        `The raised amount exceeds the price of the wish. Maximum allowed: ${
          wish.price - wish.raised
        }`,
      );
    }

    const newOffer = this.offerRepository.create({
      ...offerData,
      amount,
      item: wish,
    });

    const savedOffer = await this.offerRepository.save(newOffer);

    wish.raised = newRaisedAmount;
    wish.offers = [...wish.offers, savedOffer];

    await this.wishesService.update(wish.id, {
      raised: wish.raised,
      offers: wish.offers,
    });

    return savedOffer;
  }

  async findAll(): Promise<Offer[]> {
    return this.offerRepository.find();
  }

  async findOne(id: number): Promise<Offer> {
    const offer = this.offerRepository.findOneBy({ id });

    if (!offer) {
      throw new NotFoundException(`Offer with ID ${id} not found`);
    }

    return offer;
  }
}
